/**
 * State Machine & Lifecycle Validation for Food Donations and Deliveries
 */

const DONATION_STATUS_TRANSITIONS = {
  AVAILABLE: ["REQUESTED", "EXPIRED", "CANCELLED"],
  REQUESTED: ["ACCEPTED", "AVAILABLE", "EXPIRED", "CANCELLED"],
  ACCEPTED: ["VOLUNTEER_ASSIGNED", "AVAILABLE", "CANCELLED"],
  VOLUNTEER_ASSIGNED: ["PICKED_UP", "ACCEPTED", "CANCELLED"],
  PICKED_UP: ["IN_TRANSIT", "CANCELLED"],
  IN_TRANSIT: ["DELIVERED", "CANCELLED"],
  DELIVERED: ["COMPLETED"],
  COMPLETED: [], // Terminal state
  EXPIRED: [],   // Terminal state
  CANCELLED: []  // Terminal state
};

const DELIVERY_STATUS_TRANSITIONS = {
  PENDING: ["ACCEPTED", "CANCELLED"],
  ACCEPTED: ["PICKED_UP", "PENDING", "CANCELLED"],
  PICKED_UP: ["IN_TRANSIT", "CANCELLED"],
  IN_TRANSIT: ["DELIVERED", "CANCELLED"],
  DELIVERED: ["CONFIRMED"],
  CONFIRMED: [], // Terminal state
  CANCELLED: []  // Terminal state
};

/**
 * Checks whether a donation status transition is valid
 */
function isValidDonationTransition(currentStatus, nextStatus) {
  if (currentStatus === nextStatus) return true;
  const allowed = DONATION_STATUS_TRANSITIONS[currentStatus] || [];
  return allowed.includes(nextStatus);
}

/**
 * Checks whether a delivery status transition is valid
 */
function isValidDeliveryTransition(currentStatus, nextStatus) {
  if (currentStatus === nextStatus) return true;
  const allowed = DELIVERY_STATUS_TRANSITIONS[currentStatus] || [];
  return allowed.includes(nextStatus);
}

/**
 * Verifies if donation is currently claimable by an NGO
 */
function isDonationClaimable(donation) {
  if (!donation) return false;
  if (donation.status !== "AVAILABLE") return false;

  // Check consume-before time
  const now = new Date();
  if (donation.consumeBefore && new Date(donation.consumeBefore) <= now) {
    return false;
  }

  return true;
}

module.exports = {
  DONATION_STATUS_TRANSITIONS,
  DELIVERY_STATUS_TRANSITIONS,
  isValidDonationTransition,
  isValidDeliveryTransition,
  isDonationClaimable
};
