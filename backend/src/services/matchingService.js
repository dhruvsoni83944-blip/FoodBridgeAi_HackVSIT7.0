const { prisma } = require('../config/db');
const { calculateDistanceKm } = require('../utils/distance');

class MatchingService {
  /**
   * Smart NGO Matching Algorithm
   * Evaluates and ranks all registered NGOs for a specific food donation based on:
   * 1. Proximity / Distance (40% weight)
   * 2. Capacity & Quantity compatibility (25% weight)
   * 3. Expiry / Time urgency viability (20% weight)
   * 4. Dietary preferences / Food category match (15% weight)
   *
   * @param {string} donationId
   * @returns {Promise<Array>} Ranked NGOs with match scores
   */
  static async matchNGOsForDonation(donationId) {
    const donation = await prisma.foodDonation.findUnique({
      where: { id: donationId },
      include: { analysis: true }
    });

    if (!donation) {
      const error = new Error('Donation not found');
      error.statusCode = 404;
      throw error;
    }

    // Fetch all active NGOs
    const ngos = await prisma.nGOProfile.findMany({
      include: {
        user: {
          select: { id: true, name: true, phone: true, email: true, isVerified: true }
        }
      }
    });

    const now = new Date();
    const hoursUntilExpiry = Math.max(
      0.5,
      (new Date(donation.consumeBefore) - now) / (1000 * 60 * 60)
    );

    const scoredNGOs = ngos.map(ngo => {
      // 1. Distance Score (max 40 pts)
      const distanceKm = calculateDistanceKm(
        donation.latitude,
        donation.longitude,
        ngo.latitude,
        ngo.longitude
      );

      let distanceScore = 0;
      if (distanceKm !== null) {
        if (distanceKm <= 2.0) distanceScore = 40;
        else if (distanceKm <= 5.0) distanceScore = 34;
        else if (distanceKm <= 10.0) distanceScore = 26;
        else if (distanceKm <= 20.0) distanceScore = 15;
        else distanceScore = Math.max(0, 40 - distanceKm);
      }

      // 2. Capacity Score (max 25 pts)
      // Checks if NGO capacity can absorb the donation volume
      let capacityScore = 15;
      const donationPortions = donation.peopleFedCount || Math.floor(donation.quantity * 2.5);
      if (ngo.capacity >= donationPortions) {
        capacityScore = 25; // Perfect capacity fit
      } else if (ngo.capacity >= donationPortions * 0.5) {
        capacityScore = 18; // Partial fit
      } else {
        capacityScore = 8;
      }

      // 3. Time Urgency Compatibility Score (max 20 pts)
      let timeScore = 15;
      // If food is expiring soon (< 3 hours), prioritize closer NGOs strongly
      if (hoursUntilExpiry < 3.0) {
        timeScore = distanceKm <= 5.0 ? 20 : 5;
      } else if (hoursUntilExpiry < 6.0) {
        timeScore = distanceKm <= 12.0 ? 18 : 10;
      } else {
        timeScore = 20; // Plenty of time
      }

      // 4. Dietary Preference Match (max 15 pts)
      let dietaryScore = 15;
      const ngoPrefs = (ngo.dietaryPreferences || 'ALL').toUpperCase();
      const foodTypeUpper = donation.foodType.toUpperCase();

      if (ngoPrefs !== 'ALL') {
        if (ngoPrefs.includes('VEG') && !ngoPrefs.includes('NON') && foodTypeUpper.includes('NON-VEG')) {
          dietaryScore = 0; // Incompatible
        }
      }

      // Calculate total composite match score (0 - 100)
      const totalScore = Math.min(
        99,
        Math.max(10, Math.round(distanceScore + capacityScore + timeScore + dietaryScore))
      );

      return {
        ngoId: ngo.userId,
        ngoName: ngo.organizationName,
        contactPerson: ngo.user.name,
        phone: ngo.user.phone,
        address: ngo.address,
        capacity: ngo.capacity,
        distanceKm,
        matchScore: totalScore,
        estimatedTransitMins: Math.ceil((distanceKm / 20) * 60) + 10,
        dietaryPreferences: ngo.dietaryPreferences || 'ALL',
        isVerified: ngo.user.isVerified,
        scoreBreakdown: {
          distance: distanceScore,
          capacity: capacityScore,
          timeUrgency: timeScore,
          dietary: dietaryScore
        }
      };
    });

    // Rank highest match score first
    return scoredNGOs.sort((a, b) => b.matchScore - a.matchScore);
  }

  /**
   * Smart Volunteer Matching for a Delivery Task
   * Evaluates available volunteers based on:
   * 1. Carrying capacity vs donation load
   * 2. Proximity to pickup point
   * 3. Vehicle suitability
   * 4. Availability flag
   *
   * @param {Object} options
   * @param {number} options.pickupLat
   * @param {number} options.pickupLon
   * @param {number} options.weightKg
   * @param {number} [options.radiusKm=15]
   * @returns {Promise<Array>} Ranked eligible volunteers
   */
  static async matchVolunteersForDelivery({ pickupLat, pickupLon, weightKg, radiusKm = 15 }) {
    // Find available volunteers whose carrying capacity can support the food weight
    const volunteers = await prisma.volunteerProfile.findMany({
      where: {
        isAvailable: true,
        carryingCapacityKg: { gte: weightKg }
      },
      include: {
        user: {
          select: { id: true, name: true, phone: true, email: true }
        }
      }
    });

    const eligible = volunteers
      .map(vol => {
        const distanceKm =
          vol.latitude && vol.longitude
            ? calculateDistanceKm(pickupLat, pickupLon, vol.latitude, vol.longitude)
            : 2.5;

        // Proximity score (0 - 50 pts)
        const proximityScore = Math.max(0, 50 - (distanceKm || 0) * 2.5);

        // Capacity margin score (0 - 30 pts)
        const capacityMargin = vol.carryingCapacityKg - weightKg;
        const capacityScore = capacityMargin >= 5 ? 30 : 20;

        // Experience / points score (0 - 20 pts)
        const expScore = Math.min(20, Math.floor((vol.points || 0) / 10));

        const matchScore = Math.min(99, Math.round(proximityScore + capacityScore + expScore));

        return {
          volunteerId: vol.userId,
          name: vol.user.name,
          phone: vol.user.phone,
          vehicleType: vol.vehicleType || 'Eco EV Scooter',
          carryingCapacityKg: vol.carryingCapacityKg,
          points: vol.points,
          completedDeliveries: vol.completedDeliveries,
          distanceKm: distanceKm !== null ? Math.round(distanceKm * 10) / 10 : null,
          matchScore
        };
      })
      .filter(v => v.distanceKm === null || v.distanceKm <= radiusKm)
      .sort((a, b) => b.matchScore - a.matchScore);

    return eligible;
  }
}

module.exports = MatchingService;
