import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { initialImpactStats, mockUsers, initialDonations, initialNotifications } from '../data/mockData';
import { sendMobileSMS } from '../services/smsService';

import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { createUserProfile, getUserProfile, createDonation, updateDonationStatus } from '../services/db';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [currentRole, setCurrentRole] = useState(null); // null = not logged in
  const [currentUser, setCurrentUser] = useState(null);
  const [activeView, setActiveView] = useState('landing');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Real persisted user database to prevent random login (kept for UI compatibility if needed)
  const [registeredUsers, setRegisteredUsers] = useState([]);

  const [donations, setDonations] = useState(initialDonations);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [impactStats, setImpactStats] = useState(initialImpactStats);

  const [mobileNumber, setMobileNumber] = useState("+1 (555) 019-2831");
  const [toastMessage, setToastMessage] = useState(null);
  
  // Global Mobile SMS Modal / Side Drawer State
  const [smsModalOpen, setSmsModalOpen] = useState(false);

  // ============================================================
  // SHARED CONNECTED STATE: Registered Volunteers & NGOs
  // These pools are visible across ALL dashboards (Donor, Volunteer, NGO)
  // ============================================================
  const [registeredVolunteers, setRegisteredVolunteers] = useState([]);
  const [registeredNGOs, setRegisteredNGOs] = useState([]);

  // Setup Firebase Auth State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const profile = await getUserProfile(user.uid);
        if (profile) {
          setCurrentUser(profile);
          setCurrentRole(profile.role);
          setIsLoggedIn(true);
        }
      } else {
        setCurrentUser(null);
        setCurrentRole(null);
        setIsLoggedIn(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Setup Firestore Real-time Listener for Donations
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "donations"), (snapshot) => {
      const updatedDonations = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Merge with initial mock data if needed, or just use Firestore data.
      // Assuming we want to show all from Firestore, but keeping initial if Firestore is empty.
      if (updatedDonations.length > 0) {
        setDonations(updatedDonations);
        
        setSelectedDonation(prevSelected => {
          if (!prevSelected) return null;
          return updatedDonations.find(d => d.id === prevSelected.id) || prevSelected;
        });
      }
    });
    return () => unsubscribe();
  }, []);

  // Add a new volunteer to the global pool
  const addVolunteer = (volData) => {
    const newVol = {
      id: `VOL-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: volData.name,
      phone: volData.phone,
      vehicle: volData.vehicle,
      operatingZone: volData.operatingZone,
      availability: volData.availability,
      rating: 5.0,
      completedPickups: 0,
      points: 0,
      photo: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
      registeredAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Active on Standby'
    };
    setRegisteredVolunteers(prev => [newVol, ...prev]);
    
    broadcastPushNotification(
      "New Volunteer Registered",
      `${newVol.name} is now available for food pickup & delivery in ${newVol.operatingZone}.`
    );
    
    return newVol;
  };

  // Add a new NGO/Shelter to the global pool
  const addNGO = (ngoData) => {
    const newNGO = {
      id: `NGO-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: ngoData.name,
      contactPerson: ngoData.contactPerson,
      phone: ngoData.phone,
      address: ngoData.address,
      dailyCapacity: ngoData.dailyCapacity,
      foodPreference: ngoData.foodPreference,
      coldStorage: ngoData.coldStorage,
      logo: `https://images.unsplash.com/photo-1593113598332-cd288d649433?w=150&auto=format&fit=crop&q=80`,
      registeredAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      verified: true,
      status: 'Accepting Donations'
    };
    setRegisteredNGOs(prev => [newNGO, ...prev]);

    broadcastPushNotification(
      "New NGO Shelter Registered",
      `${newNGO.name} is now accepting surplus food deliveries at ${newNGO.address}.`
    );

    return newNGO;
  };

  // Show Toast helper
  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Trigger celebration confetti
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#22c55e', '#4ade80', '#10b981', '#fef08a']
      });
    } catch (e) {
      console.log('Confetti effect', e);
    }
  };

  // Broadcast In-App Notification & Trigger Mobile Phone SMS Alert
  const broadcastPushNotification = (title, message, targetRole = 'all') => {
    const newNotif = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title: title,
      message: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: "push",
      targetRole: targetRole,
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
    showToast(`🔔 ${title}: ${message}`);

    // Trigger Mobile SMS Dispatch
    const smsMessage = `📲 [FoodBridge Mobile SMS]: ${title} - ${message}`;
    sendMobileSMS(mobileNumber, smsMessage, title);
  };

  // Step 1: Donor Creates Donation (now uses selected NGO & Volunteer from form)
  const addDonation = async (formData) => {
    const newId = `DON-${Math.floor(1000 + Math.random() * 9000)}`;
    const peopleFed = parseInt(formData.peopleFedCount) || Math.floor(parseInt(formData.quantity) * 2.5);
    const userPhone = formData.contactNumber || mobileNumber;

    if (formData.contactNumber) {
      setMobileNumber(formData.contactNumber);
    }
    
    // Use selected NGO and Volunteer from form (chosen by donor from registered pools)
    const selectedNgo = formData.selectedNgo || null;
    const selectedVolunteer = formData.selectedVolunteer || null;

    const newDonation = {
      id: newId,
      foodName: formData.foodName || "Surplus Catered Meal",
      category: formData.category || "Cooked Meals",
      quantity: formData.quantity || "25 kg",
      peopleFedCount: peopleFed,
      expiryHours: parseInt(formData.expiryHours) || 6,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      imageUrl: formData.imageUrl || "/ai_food_match.jpg",
      pickupAddress: formData.pickupAddress || "Not specified",
      contactNumber: userPhone,
      status: "Pending NGO Acceptance",
      aiConfidenceScore: 98.4,
      freshnessScore: 97.8,
      estimatedPickupMins: 14,
      estimatedDeliveryMins: 28,
      priorityLevel: parseInt(formData.expiryHours) <= 4 ? "CRITICAL URGENCY" : "HIGH URGENCY",
      distanceKm: 1.2,
      qrPassCode: `FOODBRIDGE-${newId}-${Date.now()}`,
      recommendedNgo: selectedNgo ? {
        id: selectedNgo.id,
        name: selectedNgo.name,
        rating: 4.9,
        distanceKm: 1.2,
        capacityAvailable: 150,
        contactNumber: selectedNgo.phone,
        logo: selectedNgo.logo
      } : null,
      assignedVolunteer: selectedVolunteer ? {
        id: selectedVolunteer.id,
        name: selectedVolunteer.name,
        phone: selectedVolunteer.phone,
        vehicle: selectedVolunteer.vehicle,
        rating: selectedVolunteer.rating || 5.0,
        photo: selectedVolunteer.photo,
        distanceKm: 0.8,
        status: "Available",
        isAccepted: false,
      } : null,
      donorName: currentUser?.name || "Anonymous Donor",
      donorPhone: userPhone,
      pickupCoords: { lat: 37.7760, lng: -122.4180 },
      ngoCoords: { lat: 37.7710, lng: -122.4230 },
      timeline: [
        { step: "Donation Created", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), completed: true },
        { step: "NGO Accepted", time: "Pending", completed: false },
        { step: "Volunteer Accepted", time: "Pending", completed: false },
        { step: "Volunteer Travelling", time: "Pending", completed: false },
        { step: "Volunteer Reached Pickup", time: "Pending", completed: false },
        { step: "Food Picked Up", time: "Pending", completed: false },
        { step: "Travelling to NGO", time: "Pending", completed: false },
        { step: "Delivered", time: "Pending", completed: false },
        { step: "NGO Confirmed", time: "Pending", completed: false },
        { step: "Distributed", time: "Pending", completed: false },
      ]
    };

    // Save to Firestore
    await createDonation(newId, newDonation);
    
    // Optimistic UI Update (Snapshot listener will also sync this)
    setDonations((prev) => [newDonation, ...prev]);
    setSelectedDonation(newDonation);

    // Broadcast Push & Mobile SMS Alert
    broadcastPushNotification(
      "New Donation Listed",
      `Surplus food '${newDonation.foodName}' (${newDonation.quantity}) is available for pickup at ${newDonation.pickupAddress}.`
    );

    triggerConfetti();
    return newDonation;
  };

  // Pipeline Status Synchronizer
  const updateDonationStatusPipeline = async (donationId, newStatus, extra = {}) => {
    const item = donations.find(d => d.id === donationId);
    if (!item) return;

    const pipelineSteps = [
      "Donation Created",
      "NGO Accepted",
      "Volunteer Accepted",
      "Volunteer Travelling",
      "Volunteer Reached Pickup",
      "Food Picked Up",
      "Travelling to NGO",
      "Delivered",
      "NGO Confirmed",
      "Distributed"
    ];

    const targetIdx = pipelineSteps.indexOf(newStatus);

    const updatedTimeline = pipelineSteps.map((stepName, idx) => {
      const existingTime = item.timeline?.find(t => t.step === stepName)?.time;
      return {
        step: stepName,
        completed: idx <= targetIdx,
        time: idx <= targetIdx 
          ? (existingTime && existingTime !== "Pending" ? existingTime : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
          : "Pending"
      };
    });

    const updates = {
      status: newStatus,
      timeline: updatedTimeline,
      ...extra
    };

    // Update in Firestore
    await updateDonationStatus(donationId, updates);
    
    // Optimistic Update
    setDonations((prev) => prev.map((d) => {
      if (d.id === donationId) {
        const updated = { ...d, ...updates };
        if (selectedDonation && selectedDonation.id === donationId) {
          setSelectedDonation(updated);
        }
        return updated;
      }
      return d;
    }));
  };

  // Volunteer Accepts Request
  const acceptVolunteerRequest = (donationId) => {
    const donation = donations.find(d => d.id === donationId);
    const volunteer = donation?.assignedVolunteer;

    updateDonationStatusPipeline(donationId, "Volunteer Accepted", {
      assignedVolunteer: {
        ...(volunteer || {}),
        status: "Travelling to Pickup",
        isAccepted: true
      }
    });

    setTimeout(() => {
      updateDonationStatusPipeline(donationId, "Volunteer Travelling");
    }, 1000);

    broadcastPushNotification(
      "Volunteer Accepted Request",
      `Courier ${volunteer?.name || 'Volunteer'} accepted pickup for ${donation?.foodName || 'donation'}!`,
      "donor"
    );
  };

  // Volunteer Reached Pickup Location
  const markVolunteerReached = (donationId) => {
    updateDonationStatusPipeline(donationId, "Volunteer Reached Pickup");
    broadcastPushNotification(
      "Volunteer Reached Pickup",
      "Volunteer arrived at pickup location. Ready to scan QR code.",
      "donor"
    );
  };

  // Scan QR Code at Pickup
  const scanPickupQR = (donationId) => {
    updateDonationStatusPipeline(donationId, "Food Picked Up");
    
    setTimeout(() => {
      updateDonationStatusPipeline(donationId, "Travelling to NGO");
      broadcastPushNotification(
        "Food Picked Up",
        "Food package secured via QR pass. Volunteer travelling to NGO.",
        "all"
      );
    }, 1000);
  };

  // Deliver & NGO Confirms Delivery
  const scanDeliveryQR = (donationId) => {
    updateDonationStatusPipeline(donationId, "Delivered");
    
    setTimeout(() => {
      updateDonationStatusPipeline(donationId, "NGO Confirmed");
      broadcastPushNotification(
        "NGO Confirmed Delivery",
        "Shelter confirmed receipt of food donation.",
        "all"
      );
      triggerConfetti();
    }, 1000);
  };

  // Mark Distribution Complete
  const markDistributionComplete = (donationId) => {
    updateDonationStatusPipeline(donationId, "Distributed");

    const donationObj = donations.find(d => d.id === donationId) || selectedDonation;
    const fedCount = donationObj?.peopleFedCount || 100;
    const weightNum = parseFloat(donationObj?.quantity) || 25;

    setImpactStats((prev) => ({
      ...prev,
      mealsSaved: prev.mealsSaved + fedCount,
      peopleFed: prev.peopleFed + fedCount,
      wasteReducedTons: +(prev.wasteReducedTons + weightNum / 1000).toFixed(3),
      carbonSavedKg: +(prev.carbonSavedKg + weightNum * 2.5).toFixed(1)
    }));

    broadcastPushNotification(
      "Distribution Completed",
      `Meal distribution completed! ${fedCount} beneficiaries fed. Impact stats updated.`,
      "all"
    );
    triggerConfetti();
  };

  // NGO Accepts Request
  const acceptNgoRequest = (donationId) => {
    updateDonationStatusPipeline(donationId, "NGO Accepted");
    
    setTimeout(() => {
      updateDonationStatusPipeline(donationId, "Pending Volunteer Acceptance");
    }, 1000);

    const donation = donations.find(d => d.id === donationId);
    broadcastPushNotification(
      "NGO Accepted Donation",
      `${donation?.recommendedNgo?.name || 'NGO'} accepted incoming surplus food! Ready for courier assignment.`,
      "volunteer"
    );
  };

  // Register user with Firebase Auth and Firestore
  const registerUser = async (userData) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
      const user = userCredential.user;

      const newUserProfile = {
        name: userData.name,
        email: userData.email,
        role: userData.role,
        phone: userData.phone || "+1 (555) 000-0000",
        address: userData.address || "Not specified",
        verified: true,
        avatar: `https://images.unsplash.com/photo-${userData.role === 'volunteer' ? '1534528741775-53994a69daeb' : userData.role === 'ngo' ? '1593113598332-cd288d649433' : '1507003211169-0a1dd7228f2d'}?w=150&auto=format&fit=crop&q=80`,
        ...(userData.role === 'volunteer' ? {
          vehicle: "Eco EV Scooter (Zero Emission)",
          rating: 5.0,
          completedPickups: 0,
          points: 0
        } : {}),
        ...(userData.role === 'ngo' ? {
          dailyCapacity: "100 - 250 Beneficiaries",
          foodPreference: "Cooked Meals & Prepared Buffets",
          coldStorage: "Yes - Refrigerated Storage Ready"
        } : {})
      };

      await createUserProfile(user.uid, newUserProfile);
      showToast(`Registration successful! Please log in as ${userData.role.toUpperCase()}.`, "success");
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      showToast(error.message || "Registration failed", "error");
      return false;
    }
  };

  // Login user with Firebase Auth
  const loginUser = async (email, password, role) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      const profile = await getUserProfile(user.uid);
      if (!profile) {
        showToast("User profile not found.", "error");
        return false;
      }

      // Optionally, check if the chosen role matches their profile role
      if (profile.role !== role) {
        showToast("Invalid role selected for this account.", "error");
        // We could sign out here or just let them switch roles if we want
        await signOut(auth);
        return false;
      }

      setCurrentRole(role);
      setCurrentUser(profile);
      setIsLoggedIn(true);
      
      if (role === 'donor') setActiveView('donor');
      else if (role === 'volunteer') setActiveView('volunteer');
      else if (role === 'ngo') setActiveView('ngo');
      else if (role === 'admin') setActiveView('admin');
      
      showToast(`Logged in successfully as ${profile.name}!`);
      return true;
    } catch (error) {
      console.error("Login error:", error);
      showToast("Invalid email or password.", "error");
      return false;
    }
  };

  const markNotificationsRead = () => {
    setNotifications((prev) => prev.map(n => ({ ...n, read: true })));
  };

  const unreadNotifCount = notifications.filter(n => !n.read).length;

  // Role Switcher (used internally or fallback)
  const switchRole = (role, userData = null) => {
    setCurrentRole(role);
    setCurrentUser(userData || mockUsers[role] || { name: role, role });
    setIsLoggedIn(true);
    // Navigate to the role's primary dashboard
    if (role === 'donor') setActiveView('donor');
    else if (role === 'volunteer') setActiveView('volunteer');
    else if (role === 'ngo') setActiveView('ngo');
    else if (role === 'admin') setActiveView('admin');
    showToast(`Welcome! Logged in as ${role.charAt(0).toUpperCase() + role.slice(1)}.`);
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setCurrentRole(null);
      setCurrentUser(null);
      setIsLoggedIn(false);
      setActiveView('landing');
      showToast('Logged out successfully.', 'info');
    } catch (error) {
      console.error("Logout error:", error);
      showToast("Failed to log out.", "error");
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        currentUser,
        isLoggedIn,
        activeView,
        setActiveView,
        donations,
        selectedDonation,
        setSelectedDonation,
        notifications,
        impactStats,
        unreadNotifCount,
        mobileNumber,
        setMobileNumber,
        smsModalOpen,
        setSmsModalOpen,
        // Auth
        registeredUsers,
        registerUser,
        loginUser,
        switchRole,
        logout,
        // Shared connected state
        registeredVolunteers,
        registeredNGOs,
        addVolunteer,
        addNGO,
        // Core workflow
        addDonation,
        updateDonationStatusPipeline,
        acceptNgoRequest,
        acceptVolunteerRequest,
        markVolunteerReached,
        scanPickupQR,
        scanDeliveryQR,
        markDistributionComplete,
        markNotificationsRead,
        triggerConfetti,
        toastMessage,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
