/**
 * FoodBridge AI - Local Storage Database Service (Firebase Disconnected)
 * Provides local persistent storage operations using browser LocalStorage.
 */

// Local Storage Keys
const STORAGE_KEYS = {
  USERS: 'fb_users',
  DONATIONS: 'fb_donations',
  VOLUNTEERS: 'fb_volunteers',
  NGOS: 'fb_ngos'
};

const getLocalItem = (key, fallback = []) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (err) {
    console.warn(`Error reading localStorage key ${key}:`, err);
    return fallback;
  }
};

const setLocalItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Error writing localStorage key ${key}:`, err);
  }
};

// Users
export const createUserProfile = async (uid, userData) => {
  try {
    const users = getLocalItem(STORAGE_KEYS.USERS, []);
    const existingIdx = users.findIndex(u => u.uid === uid || u.id === uid);
    const userProfile = {
      id: uid,
      uid,
      ...userData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (existingIdx >= 0) {
      users[existingIdx] = { ...users[existingIdx], ...userProfile };
    } else {
      users.push(userProfile);
    }
    setLocalItem(STORAGE_KEYS.USERS, users);
    return true;
  } catch (error) {
    console.error("Error creating local user profile:", error);
    return false;
  }
};

export const getUserProfile = async (identifier) => {
  try {
    if (!identifier) return null;
    const users = getLocalItem(STORAGE_KEYS.USERS, []);
    const clean = String(identifier).trim().toLowerCase();
    const found = users.find(u => 
      (u.uid && String(u.uid).toLowerCase() === clean) || 
      (u.id && String(u.id).toLowerCase() === clean) || 
      (u.email && String(u.email).toLowerCase() === clean) ||
      (u.name && String(u.name).toLowerCase() === clean)
    );
    return found || null;
  } catch (error) {
    console.error("Error getting local user profile:", error);
    return null;
  }
};

export const getAllUsers = async () => {
  try {
    return getLocalItem(STORAGE_KEYS.USERS, []);
  } catch (error) {
    console.error("Error getting all local users:", error);
    return [];
  }
};

export const updateUserProfile = async (uid, updates) => {
  try {
    const users = getLocalItem(STORAGE_KEYS.USERS, []);
    const idx = users.findIndex(u => u.uid === uid || u.id === uid);
    if (idx >= 0) {
      users[idx] = { ...users[idx], ...updates, updatedAt: new Date().toISOString() };
      setLocalItem(STORAGE_KEYS.USERS, users);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error updating local user profile:", error);
    return false;
  }
};

// Storage (Local Object URL generator)
export const uploadFile = async (path, file) => {
  try {
    if (file instanceof File || file instanceof Blob) {
      return URL.createObjectURL(file);
    }
    return "/ai_food_match.jpg";
  } catch (error) {
    console.error("Error in local file upload:", error);
    return "/ai_food_match.jpg";
  }
};

// Donations
export const createDonation = async (donationId, donationData) => {
  try {
    const donations = getLocalItem(STORAGE_KEYS.DONATIONS, []);
    const newDonation = {
      id: donationId,
      ...donationData,
      createdAt: donationData.createdAt || new Date().toISOString()
    };
    const updated = [newDonation, ...donations.filter(d => d.id !== donationId)];
    setLocalItem(STORAGE_KEYS.DONATIONS, updated);
    return true;
  } catch (error) {
    console.error("Error creating local donation:", error);
    return false;
  }
};

export const updateDonationStatus = async (donationId, updates) => {
  try {
    const donations = getLocalItem(STORAGE_KEYS.DONATIONS, []);
    const idx = donations.findIndex(d => d.id === donationId);
    if (idx >= 0) {
      donations[idx] = {
        ...donations[idx],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      setLocalItem(STORAGE_KEYS.DONATIONS, donations);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error updating local donation:", error);
    return false;
  }
};

// Volunteer Location tracking
export const updateVolunteerLocation = async (donationId, coords) => {
  try {
    const donations = getLocalItem(STORAGE_KEYS.DONATIONS, []);
    const idx = donations.findIndex(d => d.id === donationId);
    if (idx >= 0) {
      donations[idx] = {
        ...donations[idx],
        volunteerCoords: coords,
        updatedAt: new Date().toISOString()
      };
      setLocalItem(STORAGE_KEYS.DONATIONS, donations);
    }
  } catch (error) {
    console.error("Error updating local volunteer location:", error);
  }
};
