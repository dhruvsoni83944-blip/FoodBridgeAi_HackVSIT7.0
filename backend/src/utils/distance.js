/**
 * Spatial & Geospatial Utility functions
 */

const EARTH_RADIUS_KM = 6371;

/**
 * Calculates the great-circle distance between two points on the Earth's surface
 * using the Haversine formula.
 *
 * @param {number} lat1
 * @param {number} lon1
 * @param {number} lat2
 * @param {number} lon2
 * @returns {number} distance in kilometers
 */
function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  if (lat1 === undefined || lon1 === undefined || lat2 === undefined || lon2 === undefined) {
    return null;
  }
  if (lat1 === lat2 && lon1 === lon2) {
    return 0;
  }

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = EARTH_RADIUS_KM * c;

  return Math.round(distance * 100) / 100; // rounded to 2 decimal places
}

function toRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

/**
 * Computes bounding box coordinates for fast indexed SQL pre-filtering
 */
function getBoundingBox(lat, lon, radiusKm) {
  const dLat = radiusKm / EARTH_RADIUS_KM;
  const dLon = radiusKm / (EARTH_RADIUS_KM * Math.cos(toRadians(lat)));

  const minLat = lat - (dLat * 180) / Math.PI;
  const maxLat = lat + (dLat * 180) / Math.PI;
  const minLon = lon - (dLon * 180) / Math.PI;
  const maxLon = lon + (dLon * 180) / Math.PI;

  return { minLat, maxLat, minLon, maxLon };
}

/**
 * Estimates urban transit time in minutes given distance and vehicle type
 */
function estimateTravelTimeMinutes(distanceKm, vehicleType = "Eco EV Scooter") {
  let avgSpeedKmh = 22; // urban average
  if (vehicleType.toLowerCase().includes("bike")) avgSpeedKmh = 18;
  if (vehicleType.toLowerCase().includes("car")) avgSpeedKmh = 28;
  if (vehicleType.toLowerCase().includes("van")) avgSpeedKmh = 25;

  const hours = distanceKm / avgSpeedKmh;
  const minutes = Math.ceil(hours * 60) + 5; // +5 mins buffer for traffic/handover
  return Math.max(minutes, 8);
}

module.exports = {
  calculateDistanceKm,
  getBoundingBox,
  estimateTravelTimeMinutes
};
