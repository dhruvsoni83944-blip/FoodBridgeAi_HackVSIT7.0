import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  serverTimestamp 
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase/config";

// Users
export const createUserProfile = async (uid, userData) => {
  try {
    const userRef = doc(db, "users", uid);
    await setDoc(userRef, {
      ...userData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error("Error creating user profile:", error);
    return false;
  }
};

export const getUserProfile = async (uid) => {
  try {
    const userRef = doc(db, "users", uid);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error("Error getting user profile:", error);
    return null;
  }
};

export const updateUserProfile = async (uid, updates) => {
  try {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error("Error updating user profile:", error);
    return false;
  }
};

// Storage
export const uploadFile = async (path, file) => {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

// Donations
export const createDonation = async (donationId, donationData) => {
  try {
    const donationRef = doc(db, "donations", donationId);
    await setDoc(donationRef, {
      ...donationData,
      createdAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error("Error creating donation:", error);
    return false;
  }
};

export const updateDonationStatus = async (donationId, updates) => {
  try {
    const donationRef = doc(db, "donations", donationId);
    await updateDoc(donationRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error("Error updating donation:", error);
    return false;
  }
};

// Volunteer Location tracking
export const updateVolunteerLocation = async (donationId, coords) => {
  try {
    const donationRef = doc(db, "donations", donationId);
    await updateDoc(donationRef, {
      volunteerCoords: coords,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error("Error updating volunteer location:", error);
  }
};
