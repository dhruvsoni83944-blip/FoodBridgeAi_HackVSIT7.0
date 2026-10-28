const { prisma } = require('../config/db');
const NotificationService = require('./notificationService');
const { calculateDistanceKm } = require('../utils/distance');
const { isValidDeliveryTransition, isDonationClaimable } = require('../utils/stateMachine');

class DeliveryService {
  /**
   * NGO submits a request for an available food donation
   */
  static async requestDonation({ donationId, ngoUserId, notes }) {
    const donation = await prisma.foodDonation.findUnique({
      where: { id: donationId },
      include: { donor: true }
    });

    if (!donation) {
      const err = new Error('Food donation not found.');
      err.statusCode = 404;
      throw err;
    }

    if (!isDonationClaimable(donation)) {
      const err = new Error(
        `Donation is currently unavailable for requesting (Status: ${donation.status}).`
      );
      err.statusCode = 400;
      throw err;
    }

    // Check if this NGO already requested this donation
    const existingReq = await prisma.nGORequest.findFirst({
      where: {
        donationId,
        ngoId: ngoUserId,
        status: 'PENDING'
      }
    });
    if (existingReq) {
      const err = new Error('You have already submitted a pending request for this food donation.');
      err.statusCode = 400;
      throw err;
    }

    // Create request and transition donation to REQUESTED
    const result = await prisma.$transaction(async (tx) => {
      const request = await tx.nGORequest.create({
        data: {
          donationId,
          ngoId: ngoUserId,
          notes: notes || null,
          status: 'PENDING'
        },
        include: {
          ngo: {
            select: { id: true, name: true, phone: true, ngoProfile: true }
          }
        }
      });

      await tx.foodDonation.update({
        where: { id: donationId },
        data: { status: 'REQUESTED' }
      });

      return request;
    });

    // Notify Donor that an NGO has requested their food
    await NotificationService.createNotification({
      userId: donation.donorId,
      title: 'NGO Requested Your Food Donation! 📩',
      message: `${result.ngo.ngoProfile?.organizationName || result.ngo.name} has requested '${donation.foodName}'. Please review and accept to initiate delivery.`,
      type: 'NGO_REQUEST',
      metadata: { donationId: donation.id, requestId: result.id, ngoId: ngoUserId }
    });

    return result;
  }

  /**
   * Donor accepts an NGO's request, creating a delivery mission
   */
  static async acceptNGORequest({ requestId, donorUserId }) {
    const request = await prisma.nGORequest.findUnique({
      where: { id: requestId },
      include: {
        donation: true,
        ngo: { select: { id: true, name: true, phone: true, ngoProfile: true } }
      }
    });

    if (!request) {
      const err = new Error('NGO request not found.');
      err.statusCode = 404;
      throw err;
    }

    if (request.donation.donorId !== donorUserId) {
      const err = new Error('Unauthorized: You are not the donor of this food listing.');
      err.statusCode = 403;
      throw err;
    }

    if (request.status !== 'PENDING') {
      const err = new Error(`Request has already been processed (Current status: ${request.status}).`);
      err.statusCode = 400;
      throw err;
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const pickupCode = `FB-PICKUP-${request.donation.id.slice(0, 6).toUpperCase()}-${randomSuffix}`;
    const deliveryCode = `FB-DELIV-${request.donation.id.slice(0, 6).toUpperCase()}-${randomSuffix}`;

    // Atomic transaction: accept request, reject others, set donation to ACCEPTED, create Delivery
    const delivery = await prisma.$transaction(async (tx) => {
      // 1. Accept this request
      await tx.nGORequest.update({
        where: { id: requestId },
        data: { status: 'ACCEPTED' }
      });

      // 2. Reject other pending requests for this donation
      await tx.nGORequest.updateMany({
        where: {
          donationId: request.donationId,
          id: { not: requestId },
          status: 'PENDING'
        },
        data: { status: 'REJECTED' }
      });

      // 3. Update donation status to ACCEPTED
      await tx.foodDonation.update({
        where: { id: request.donationId },
        data: { status: 'ACCEPTED' }
      });

      // 4. Create Delivery record
      const createdDelivery = await tx.delivery.create({
        data: {
          donationId: request.donationId,
          ngoRequestId: request.id,
          status: 'PENDING',
          verificationCode: pickupCode,
          deliveryConfirmationCode: deliveryCode
        },
        include: {
          donation: true,
          ngoRequest: {
            include: { ngo: { include: { ngoProfile: true } } }
          }
        }
      });

      return createdDelivery;
    });

    // Notify the accepted NGO
    await NotificationService.createNotification({
      userId: request.ngoId,
      title: 'Donation Request Accepted! 🎉',
      message: `Great news! Your request for '${request.donation.foodName}' was accepted. A volunteer courier will be assigned shortly.`,
      type: 'DONOR_ACCEPT',
      metadata: { donationId: request.donationId, deliveryId: delivery.id }
    });

    // Notify available nearby volunteers
    this._broadcastDeliveryJobToVolunteers(delivery);

    return delivery;
  }

  /**
   * Broadcasts delivery job to eligible volunteers
   */
  static async _broadcastDeliveryJobToVolunteers(delivery) {
    try {
      const donation = delivery.donation;
      const volunteers = await prisma.volunteerProfile.findMany({
        where: {
          isAvailable: true,
          carryingCapacityKg: { gte: donation.quantity }
        }
      });

      const notifications = [];
      for (const vol of volunteers) {
        const dist = vol.latitude && vol.longitude
          ? calculateDistanceKm(donation.latitude, donation.longitude, vol.latitude, vol.longitude)
          : null;

        if (dist === null || dist <= 15.0) {
          notifications.push({
            userId: vol.userId,
            title: 'New Food Rescue Mission Available! 🚲',
            message: `Pickup: ${donation.foodName} (${donation.quantity} ${donation.unit}) at ${donation.pickupAddress}. Tap to accept delivery.`,
            type: 'VOLUNTEER_ASSIGNED',
            metadata: { deliveryId: delivery.id, donationId: donation.id }
          });
        }
      }

      if (notifications.length > 0) {
        await NotificationService.createManyNotifications(notifications);
      }
    } catch (err) {
      console.warn('[DeliveryService] Error notifying volunteers:', err.message);
    }
  }

  /**
   * Retrieves available delivery missions suitable for volunteer capacity
   */
  static async getAvailableVolunteerJobs(volunteerUserId) {
    const volProfile = await prisma.volunteerProfile.findUnique({
      where: { userId: volunteerUserId }
    });

    const capacity = volProfile?.carryingCapacityKg || 25.0;

    const availableDeliveries = await prisma.delivery.findMany({
      where: {
        status: 'PENDING',
        volunteerId: null,
        donation: {
          quantity: { lte: capacity },
          status: 'ACCEPTED'
        }
      },
      include: {
        donation: {
          include: {
            donor: { select: { id: true, name: true, phone: true, donorProfile: true } },
            analysis: true
          }
        },
        ngoRequest: {
          include: {
            ngo: { select: { id: true, name: true, phone: true, ngoProfile: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Attach distances relative to volunteer location
    return availableDeliveries.map(del => {
      let distanceKm = null;
      if (volProfile?.latitude && volProfile?.longitude) {
        distanceKm = calculateDistanceKm(
          volProfile.latitude,
          volProfile.longitude,
          del.donation.latitude,
          del.donation.longitude
        );
      }
      return {
        ...del,
        pickupDistanceKm: distanceKm
      };
    });
  }

  /**
   * Volunteer accepts a delivery mission
   * CRITICAL REQUIREMENT: Atomic Prisma Transaction with race-condition prevention
   */
  static async acceptDelivery({ deliveryId, volunteerUserId }) {
    // Execute inside an isolated database transaction
    const updatedDelivery = await prisma.$transaction(async (tx) => {
      // 1. Fetch current delivery state with lock check
      const current = await tx.delivery.findUnique({
        where: { id: deliveryId },
        include: { donation: true }
      });

      if (!current) {
        const err = new Error('Delivery mission not found.');
        err.statusCode = 404;
        throw err;
      }

      // Check race condition: if already accepted by another volunteer
      if (current.status !== 'PENDING' || current.volunteerId !== null) {
        const err = new Error(
          'This delivery mission has already been accepted by another volunteer courier.'
        );
        err.statusCode = 409;
        throw err;
      }

      // 2. Assign volunteer and set status to ACCEPTED
      const delivery = await tx.delivery.update({
        where: { id: deliveryId },
        data: {
          volunteerId: volunteerUserId,
          status: 'ACCEPTED'
        },
        include: {
          donation: true,
          ngoRequest: { include: { ngo: true } },
          volunteer: { select: { id: true, name: true, phone: true, volunteerProfile: true } }
        }
      });

      // 3. Update donation status to VOLUNTEER_ASSIGNED
      await tx.foodDonation.update({
        where: { id: current.donationId },
        data: { status: 'VOLUNTEER_ASSIGNED' }
      });

      return delivery;
    });

    const volName = updatedDelivery.volunteer?.name || 'Volunteer Courier';

    // Notify Donor that courier has accepted mission
    await NotificationService.createNotification({
      userId: updatedDelivery.donation.donorId,
      title: 'Volunteer Courier Assigned! 🛵',
      message: `${volName} has accepted your food delivery mission and is en route for pickup.`,
      type: 'VOLUNTEER_ASSIGNED',
      metadata: { deliveryId: updatedDelivery.id, volunteerId: volunteerUserId }
    });

    // Notify NGO that courier is assigned
    await NotificationService.createNotification({
      userId: updatedDelivery.ngoRequest.ngoId,
      title: 'Courier Assigned for Shelter Delivery',
      message: `Volunteer courier ${volName} has been assigned to transport '${updatedDelivery.donation.foodName}' to your shelter.`,
      type: 'VOLUNTEER_ASSIGNED',
      metadata: { deliveryId: updatedDelivery.id, volunteerId: volunteerUserId }
    });

    return updatedDelivery;
  }

  /**
   * Updates delivery status progression: PICKED_UP -> IN_TRANSIT -> DELIVERED
   */
  static async updateDeliveryStatus({ deliveryId, volunteerUserId, newStatus, verificationCode }) {
    const delivery = await prisma.delivery.findUnique({
      where: { id: deliveryId },
      include: {
        donation: true,
        ngoRequest: { include: { ngo: true } }
      }
    });

    if (!delivery) {
      const err = new Error('Delivery not found.');
      err.statusCode = 404;
      throw err;
    }

    if (delivery.volunteerId !== volunteerUserId) {
      const err = new Error('Unauthorized: You are not the assigned volunteer for this delivery.');
      err.statusCode = 403;
      throw err;
    }

    if (!isValidDeliveryTransition(delivery.status, newStatus)) {
      const err = new Error(
        `Invalid status transition from '${delivery.status}' to '${newStatus}'.`
      );
      err.statusCode = 400;
      throw err;
    }

    const updateData = { status: newStatus };
    const donationUpdate = {};

    if (newStatus === 'PICKED_UP') {
      updateData.pickupTime = new Date();
      donationUpdate.status = 'PICKED_UP';
    } else if (newStatus === 'IN_TRANSIT') {
      donationUpdate.status = 'IN_TRANSIT';
    } else if (newStatus === 'DELIVERED') {
      updateData.deliveredTime = new Date();
      donationUpdate.status = 'DELIVERED';
    }

    const updated = await prisma.$transaction(async (tx) => {
      const del = await tx.delivery.update({
        where: { id: deliveryId },
        data: updateData,
        include: {
          donation: true,
          ngoRequest: { include: { ngo: true } },
          volunteer: { select: { id: true, name: true, phone: true, volunteerProfile: true } }
        }
      });

      if (donationUpdate.status) {
        await tx.foodDonation.update({
          where: { id: delivery.donationId },
          data: donationUpdate
        });
      }

      return del;
    });

    // Notify relevant parties
    if (newStatus === 'PICKED_UP') {
      await NotificationService.createNotification({
        userId: delivery.ngoRequest.ngoId,
        title: 'Food Picked Up • En Route to Shelter! 🚚',
        message: `Courier has safely picked up '${delivery.donation.foodName}' from the donor and is now out for delivery.`,
        type: 'PICKED_UP',
        metadata: { deliveryId: delivery.id }
      });
    } else if (newStatus === 'DELIVERED') {
      await NotificationService.createNotification({
        userId: delivery.ngoRequest.ngoId,
        title: 'Food Arrived at Shelter! 📦',
        message: `Courier has arrived with '${delivery.donation.foodName}'. Please confirm receipt to complete the donation.`,
        type: 'DELIVERED',
        metadata: { deliveryId: delivery.id }
      });
      await NotificationService.createNotification({
        userId: delivery.donation.donorId,
        title: 'Food Delivered to Shelter',
        message: `Your food donation '${delivery.donation.foodName}' has reached the shelter facility.`,
        type: 'DELIVERED',
        metadata: { deliveryId: delivery.id }
      });
    }

    return updated;
  }

  /**
   * NGO confirms food arrival and closes the donation cycle
   */
  static async confirmReceiptByNGO({ deliveryId, ngoUserId }) {
    const delivery = await prisma.delivery.findUnique({
      where: { id: deliveryId },
      include: {
        donation: true,
        ngoRequest: true,
        volunteer: true
      }
    });

    if (!delivery) {
      const err = new Error('Delivery not found.');
      err.statusCode = 404;
      throw err;
    }

    if (delivery.ngoRequest.ngoId !== ngoUserId) {
      const err = new Error('Unauthorized: Only the recipient NGO can confirm food arrival.');
      err.statusCode = 403;
      throw err;
    }

    if (delivery.status !== 'DELIVERED') {
      const err = new Error(
        `Cannot confirm receipt. Delivery is currently in status '${delivery.status}'.`
      );
      err.statusCode = 400;
      throw err;
    }

    // Complete transaction: CONFIRMED delivery, COMPLETED donation, award volunteer points
    const result = await prisma.$transaction(async (tx) => {
      // 1. Confirm delivery
      const confirmedDelivery = await tx.delivery.update({
        where: { id: deliveryId },
        data: {
          status: 'CONFIRMED',
          confirmedAt: new Date()
        }
      });

      // 2. Mark food donation COMPLETED
      await tx.foodDonation.update({
        where: { id: delivery.donationId },
        data: { status: 'COMPLETED' }
      });

      // 3. Award points to volunteer (+50 pts) and increment completed counter
      if (delivery.volunteerId) {
        await tx.volunteerProfile.updateMany({
          where: { userId: delivery.volunteerId },
          data: {
            points: { increment: 50 },
            completedDeliveries: { increment: 1 }
          }
        });
      }

      return confirmedDelivery;
    });

    // Notify Volunteer of points awarded
    if (delivery.volunteerId) {
      await NotificationService.createNotification({
        userId: delivery.volunteerId,
        title: 'Mission Accomplished! 🌟 +50 Points',
        message: `The NGO shelter has verified receipt of '${delivery.donation.foodName}'. You earned 50 volunteer reward points!`,
        type: 'RECEIPT_CONFIRMED',
        metadata: { deliveryId: delivery.id, pointsEarned: 50 }
      });
    }

    // Notify Donor of completed mission
    await NotificationService.createNotification({
      userId: delivery.donation.donorId,
      title: 'Donation Completed! 🎉 Zero Food Wasted',
      message: `Your donation of '${delivery.donation.foodName}' was safely received and confirmed by the NGO shelter. Thank you for making an impact!`,
      type: 'RECEIPT_CONFIRMED',
      metadata: { deliveryId: delivery.id }
    });

    return result;
  }

  /**
   * Retrieves volunteer's active and historical deliveries
   */
  static async getVolunteerDeliveries(volunteerUserId) {
    return prisma.delivery.findMany({
      where: { volunteerId: volunteerUserId },
      include: {
        donation: {
          include: {
            donor: { select: { id: true, name: true, phone: true, donorProfile: true } },
            analysis: true
          }
        },
        ngoRequest: {
          include: {
            ngo: { select: { id: true, name: true, phone: true, ngoProfile: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }
}

module.exports = DeliveryService;
