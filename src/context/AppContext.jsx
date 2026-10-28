import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { initialImpactStats, mockUsers, initialDonations, initialNotifications } from '../data/mockData';
import { sendMobileSMS } from '../services/smsService';
import { 
  createUserProfile, 
  getUserProfile, 
  createDonation, 
  updateDonationStatus 
} from '../services/db';
import { authAPI } from '../services/api';

const AppContext = createContext();

const defaultSeedVolunteers = [];
const defaultSeedNGOs = [];

export const AppProvider = ({ children }) => {
  // Session State (Local, no Firebase)
  const [currentRole, setCurrentRole] = useState(() => {
    try {
      const saved = localStorage.getItem('fb_current_role');
      return saved ? JSON.parse(saved) : 'donor';
    } catch {
      return 'donor';
    }
  });

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('fb_current_user');
      if (saved) {
        const u = JSON.parse(saved);
        if (u && (u.name?.includes('Royal') || u.id === 'usr_donor_1')) {
          const cleanUser = {
            id: 'usr_dhruv',
            name: 'Dhruv',
            email: 'dhruv@foodbridge.ai',
            role: 'donor',
            verified: true,
            phone: '+1 (555) 019-2831',
            donorType: 'Household / Individual'
          };
          localStorage.setItem('fb_current_user', JSON.stringify(cleanUser));
          return cleanUser;
        }
        return u;
      }
      return {
        id: 'usr_dhruv',
        name: 'Dhruv',
        email: 'dhruv@foodbridge.ai',
        role: 'donor',
        verified: true,
        phone: '+1 (555) 019-2831',
        donorType: 'Household / Individual'
      };
    } catch {
      return null;
    }
  });

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    try {
      const saved = localStorage.getItem('fb_is_logged_in');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const [activeView, setActiveView] = useState(() => {
    try {
      const saved = localStorage.getItem('fb_active_view');
      return saved ? JSON.parse(saved) : 'landing';
    } catch {
      return 'landing';
    }
  });

  // Donations State with Local Persistence (clean, only registered donors)
  const sanitizeDonation = (d) => {
    let item = d;
    if (item.foodName?.toLowerCase() === 'dhruv') {
      item = { ...item, foodName: 'Prepared Catered Meals', donorName: item.donorName || 'Dhruv' };
    }
    const hasNgo = !!item.acceptedNgo || item.status?.includes('NGO Accepted');
    const hasVol = !!item.acceptedVolunteer || item.assignedVolunteer?.isAccepted || item.status?.includes('Volunteer Accepted');
    const isTravelling = item.status === 'Volunteer Travelling' || (hasNgo && hasVol);

    if (hasNgo || hasVol || isTravelling || item.status === 'Volunteer Reached Pickup' || item.status === 'Food Picked Up' || item.status === 'Travelling to NGO' || item.status === 'Delivered') {
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
      const fixedTimeline = pipelineSteps.map((stepName, idx) => {
        const existing = (item.timeline || []).find(t => t.step === stepName) || (item.timeline || [])[idx];
        let completed = existing?.completed || false;
        let time = (existing?.time && existing.time !== "Pending") ? existing.time : "Pending";

        if (idx === 0) completed = true;
        if (idx === 1 && (hasNgo || isTravelling)) {
          completed = true;
          if (time === "Pending") time = item.acceptedNgo?.acceptedAt || "10:35 AM";
        }
        if (idx === 2 && (hasVol || isTravelling)) {
          completed = true;
          if (time === "Pending") time = item.acceptedVolunteer?.acceptedAt || "10:40 AM";
        }
        if (idx === 3 && isTravelling) {
          completed = true;
          if (time === "Pending") time = "10:42 AM";
        }
        if (idx === 4 && (item.status === 'Volunteer Reached Pickup' || item.status === 'Food Picked Up' || item.status === 'Travelling to NGO' || item.status === 'Delivered')) {
          completed = true;
          if (time === "Pending") time = "10:50 AM";
        }
        if (idx === 5 && (item.status === 'Food Picked Up' || item.status === 'Travelling to NGO' || item.status === 'Delivered')) {
          completed = true;
          if (time === "Pending") time = "10:55 AM";
        }
        if (idx === 6 && (item.status === 'Travelling to NGO' || item.status === 'Delivered')) {
          completed = true;
          if (time === "Pending") time = "10:56 AM";
        }
        if (idx === 7 && item.status === 'Delivered') {
          completed = true;
          if (time === "Pending") time = "11:15 AM";
        }

        return { step: stepName, completed, time };
      });

      return {
        ...item,
        timeline: fixedTimeline
      };
    }
    return item;
  };

  const [donations, setDonations] = useState(() => {
    try {
      const saved = localStorage.getItem('fb_donations');
      const list = saved ? JSON.parse(saved) : [];
      return list
        .filter(d => !d.donorName?.includes('Royal') && d.id !== 'DON-8092' && d.id !== 'DON-3438' && d.donorName?.toLowerCase() !== 'rohit' && d.foodName?.toLowerCase() !== 'rohit')
        .map(sanitizeDonation);
    } catch {
      return [];
    }
  });

  const [selectedDonation, setSelectedDonation] = useState(() => {
    return donations.length > 0 ? donations[0] : null;
  });

  const [notifications, setNotifications] = useState(initialNotifications);
  const [impactStats, setImpactStats] = useState(initialImpactStats);
  const [mobileNumber, setMobileNumber] = useState("+1 (555) 019-2831");
  const [toastMessage, setToastMessage] = useState(null);
  const [smsModalOpen, setSmsModalOpen] = useState(false);

  // Registered pools with Local Persistence (clean, no dummy data)
  const [registeredVolunteers, setRegisteredVolunteers] = useState(() => {
    try {
      const saved = localStorage.getItem('fb_volunteers');
      const list = saved ? JSON.parse(saved) : [];
      return list.filter(v => 
        !['vol_rohit', 'vol_aman', 'vol_priya', 'VOL-101', 'VOL-102', 'VOL-103'].includes(v.id) &&
        !['rohit', 'Aman Sharma', 'Priya Patel', 'Alex Rivera'].includes(v.name)
      );
    } catch {
      return [];
    }
  });

  const [registeredNGOs, setRegisteredNGOs] = useState(() => {
    try {
      const saved = localStorage.getItem('fb_ngos');
      const list = saved ? JSON.parse(saved) : [];
      return list.filter(n => 
        !['ngo_jaiveer', 'ngo_hope_haven', 'ngo_seva_care', 'NGO-201', 'NGO-202', 'NGO-203'].includes(n.id) &&
        !['jaiveer', 'Hope Haven Kitchen', 'Seva Care Food Bank', 'Hope Community Food Bank', 'Hope Community'].includes(n.name)
      );
    } catch {
      return [];
    }
  });

  // Cleanup routine on load: scrub any legacy demo data from localStorage
  useEffect(() => {
    try {
      const cur = localStorage.getItem('fb_current_user');
      if (cur) {
        const u = JSON.parse(cur);
        if (u?.name?.includes('Royal') || u?.id === 'usr_donor_1') {
          const cleanUser = {
            id: 'usr_dhruv',
            name: 'Dhruv',
            email: 'dhruv@foodbridge.ai',
            role: u.role || 'donor',
            verified: true,
            phone: '+1 (555) 019-2831',
            donorType: 'Household / Individual'
          };
          setCurrentUser(cleanUser);
          localStorage.setItem('fb_current_user', JSON.stringify(cleanUser));
        }
      }

      const usersRaw = localStorage.getItem('fb_users');
      if (usersRaw) {
        const uList = JSON.parse(usersRaw).filter(u => !u.name?.includes('Royal') && u.id !== 'usr_donor_1');
        localStorage.setItem('fb_users', JSON.stringify(uList));
      }

      const volsRaw = localStorage.getItem('fb_volunteers');
      const vList = (volsRaw ? JSON.parse(volsRaw) : []).filter(v => 
        !['vol_rohit', 'vol_aman', 'vol_priya', 'VOL-101', 'VOL-102', 'VOL-103'].includes(v.id) && 
        !['rohit', 'Aman Sharma', 'Priya Patel', 'Alex Rivera'].includes(v.name)
      );
      setRegisteredVolunteers(vList);
      localStorage.setItem('fb_volunteers', JSON.stringify(vList));

      const ngosRaw = localStorage.getItem('fb_ngos');
      const nList = (ngosRaw ? JSON.parse(ngosRaw) : []).filter(n => 
        !['ngo_jaiveer', 'ngo_hope_haven', 'ngo_seva_care', 'NGO-201', 'NGO-202', 'NGO-203'].includes(n.id) && 
        !['jaiveer', 'Hope Haven Kitchen', 'Seva Care Food Bank', 'Hope Community Food Bank', 'Hope Community'].includes(n.name)
      );
      setRegisteredNGOs(nList);
      localStorage.setItem('fb_ngos', JSON.stringify(nList));

      const donsRaw = localStorage.getItem('fb_donations');
      if (donsRaw) {
        const dList = JSON.parse(donsRaw)
          .filter(d => !d.donorName?.includes('Royal') && d.id !== 'DON-8092' && d.id !== 'DON-3438' && d.donorName?.toLowerCase() !== 'rohit' && d.foodName?.toLowerCase() !== 'rohit')
          .map(sanitizeDonation);
        setDonations(dList);
        localStorage.setItem('fb_donations', JSON.stringify(dList));
      }
    } catch (e) {
      console.warn("Storage scrub error:", e);
    }
  }, []);

  // Hydrate authenticated user session from PostgreSQL via GET /api/auth/me
  useEffect(() => {
    const token = localStorage.getItem('fb_jwt_token');
    if (token) {
      authAPI.me()
        .then((res) => {
          const u = res?.data?.data;
          if (u) {
            const roleLower = (u.role || 'donor').toLowerCase();
            setCurrentRole(roleLower);
            setCurrentUser((prev) => ({
              ...(prev || {}),
              ...u,
              role: roleLower,
              backendRole: u.role,
              verified: u.isVerified !== undefined ? u.isVerified : true,
              avatar: `https://images.unsplash.com/photo-${roleLower === 'volunteer' ? '1534528741775-53994a69daeb' : roleLower === 'ngo' ? '1593113598332-cd288d649433' : '1535713875002-d1d0cf377fde'}?w=150&auto=format&fit=crop&q=80`
            }));
            setIsLoggedIn(true);
          }
        })
        .catch((err) => {
          console.warn('Session verification note:', err?.response?.data?.message || err.message);
        });
    }
  }, []);

  // Compute dynamic real-time impact metrics based on actual donations
  useEffect(() => {
    // People Fed reflects the total people fed from all listed food donations!
    const totalPeopleFed = donations.reduce((acc, d) => acc + (Number(d.peopleFedCount) || 0), 0);
    const totalMeals = totalPeopleFed > 0 
      ? totalPeopleFed 
      : donations.reduce((acc, d) => acc + (Math.floor(parseFloat(d.quantity) * 2.5) || 0), 0);
    
    const totalKg = donations.reduce((acc, d) => {
      const match = String(d.quantity || '').match(/(\d+(\.\d+)?)/);
      return acc + (match ? parseFloat(match[0]) : 10);
    }, 0);

    setImpactStats({
      mealsSaved: totalMeals,
      peopleFed: totalPeopleFed, // Increases immediately when donor lists surplus food and fills "People it can Feed"
      activeVolunteers: registeredVolunteers.length,
      ngosConnected: registeredNGOs.length,
      wasteReducedTons: +(totalKg / 1000).toFixed(2),
      totalWasteKg: +totalKg.toFixed(1),
      carbonSavedKg: +(totalKg * 2.5).toFixed(1)
    });
  }, [donations, registeredVolunteers, registeredNGOs]);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('fb_current_role', JSON.stringify(currentRole));
      localStorage.setItem('fb_current_user', JSON.stringify(currentUser));
      localStorage.setItem('fb_is_logged_in', JSON.stringify(isLoggedIn));
      localStorage.setItem('fb_active_view', JSON.stringify(activeView));
    } catch (e) {
      console.warn("Error saving session to localStorage", e);
    }
  }, [currentRole, currentUser, isLoggedIn, activeView]);

  useEffect(() => {
    try {
      localStorage.setItem('fb_donations', JSON.stringify(donations));
    } catch (e) {
      console.warn("Error saving donations to localStorage", e);
    }
  }, [donations]);

  useEffect(() => {
    try {
      localStorage.setItem('fb_volunteers', JSON.stringify(registeredVolunteers));
    } catch (e) {
      console.warn("Error saving volunteers to localStorage", e);
    }
  }, [registeredVolunteers]);

  useEffect(() => {
    try {
      localStorage.setItem('fb_ngos', JSON.stringify(registeredNGOs));
    } catch (e) {
      console.warn("Error saving NGOs to localStorage", e);
    }
  }, [registeredNGOs]);

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
        colors: ['#1D52F2', '#63A644', '#F26B1D', '#3b82f6']
      });
    } catch (e) {
      console.log('Confetti effect', e);
    }
  };

  // Broadcast In-App Notification & Trigger Mobile Phone SMS Alert with distributed targeting
  const broadcastPushNotification = (title, message, targetRole = 'all', options = {}) => {
    const newNotif = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title: title,
      message: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: options.type || (targetRole === 'volunteer' ? 'volunteer' : targetRole === 'ngo' ? 'ngo' : targetRole === 'donor' ? 'donor' : 'system'),
      targetRole: targetRole,
      recipientRole: options.recipientRole || (targetRole !== 'all' ? targetRole : null),
      recipientName: options.recipientName || null,
      recipientId: options.recipientId || null,
      donationId: options.donationId || null,
      read: false,
    };

    setNotifications((prev) => [newNotif, ...prev]);

    // Check if notification is meant for the currently active persona/user
    const isForActiveUser = (
      targetRole === 'all' || 
      targetRole === currentRole || 
      options.recipientRole === currentRole
    ) && (
      !options.recipientName || 
      !currentUser?.name || 
      options.recipientName.trim().toLowerCase() === currentUser.name.trim().toLowerCase() ||
      currentUser.name.trim().toLowerCase().includes(options.recipientName.trim().toLowerCase())
    );

    if (isForActiveUser && !options.silentToast) {
      showToast(`🔔 ${title}: ${message}`);
    }

    // Trigger Mobile SMS Dispatch if targeted to donor/phone
    if (options.phone) {
      sendMobileSMS(options.phone, `📲 [FoodBridge SMS]: ${title} - ${message}`, title);
    } else if (isForActiveUser && targetRole === 'donor') {
      sendMobileSMS(mobileNumber, `📲 [FoodBridge SMS]: ${title} - ${message}`, title);
    }
  };

  // Step 1: Donor Creates Donation (Restricted to registered donors, supporting multi-NGO & multi-volunteer selection)
  const addDonation = async (formData) => {
    if (currentRole !== 'donor') {
      showToast("Only registered food donors can post donations to Donor Hub.", "error");
      return null;
    }

    const newId = `DON-${Math.floor(1000 + Math.random() * 9000)}`;
    const peopleFed = parseInt(formData.peopleFedCount) || Math.floor(parseInt(formData.quantity) * 2.5);
    const userPhone = formData.contactNumber || mobileNumber;

    if (formData.contactNumber) {
      setMobileNumber(formData.contactNumber);
    }
    
    // Support multiple NGOs and multiple Volunteers
    const chosenNgos = (formData.selectedNgos && formData.selectedNgos.length > 0)
      ? formData.selectedNgos
      : (formData.selectedNgo ? [formData.selectedNgo] : (registeredNGOs.length > 0 ? [registeredNGOs[0]] : []));

    const chosenVolunteers = (formData.selectedVolunteers && formData.selectedVolunteers.length > 0)
      ? formData.selectedVolunteers
      : (formData.selectedVolunteer ? [formData.selectedVolunteer] : (registeredVolunteers.length > 0 ? [registeredVolunteers[0]] : []));

    const primaryNgo = chosenNgos[0] || null;
    const primaryVolunteer = chosenVolunteers[0] || null;

    const newDonation = {
      id: newId,
      foodName: formData.foodName || "Surplus Catered Meal",
      category: formData.category || "Cooked Meals",
      quantity: formData.quantity || "25 kg",
      peopleFedCount: peopleFed,
      expiryHours: parseInt(formData.expiryHours) || 6,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      createdTimestamp: Date.now(),
      createdDate: new Date().toISOString(),
      imageUrl: formData.imageUrl || "/ai_food_match.jpg",
      pickupAddress: formData.pickupAddress || "Not specified",
      contactNumber: userPhone,
      donorName: currentUser?.name || "Dhruv",
      donorPhone: userPhone,
      status: "Pending Acceptance",
      aiConfidenceScore: 98.4,
      freshnessScore: 97.8,
      estimatedPickupMins: 14,
      estimatedDeliveryMins: 28,
      priorityLevel: parseInt(formData.expiryHours) <= 4 ? "CRITICAL URGENCY" : "HIGH URGENCY",
      distanceKm: 1.2,
      qrPassCode: `FOODBRIDGE-${newId}-${Date.now()}`,
      
      // Multi-NGO & Multi-Volunteer selection
      selectedNgos: chosenNgos,
      selectedVolunteers: chosenVolunteers,
      acceptedNgo: null,
      declinedNgos: [],
      acceptedVolunteer: null,
      declinedVolunteers: [],

      // Backward compatible fallbacks
      recommendedNgo: primaryNgo ? {
        id: primaryNgo.id,
        name: primaryNgo.name,
        rating: 4.9,
        distanceKm: 1.2,
        capacityAvailable: 150,
        contactNumber: primaryNgo.phone,
        logo: primaryNgo.logo
      } : null,
      assignedVolunteer: primaryVolunteer ? {
        id: primaryVolunteer.id,
        name: primaryVolunteer.name,
        phone: primaryVolunteer.phone,
        vehicle: primaryVolunteer.vehicle,
        rating: primaryVolunteer.rating || 5.0,
        photo: primaryVolunteer.photo,
        distanceKm: 0.8,
        status: "Available",
        isAccepted: false,
      } : null,
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

    // Save locally
    await createDonation(newId, newDonation);
    
    setDonations((prev) => [newDonation, ...prev]);
    setSelectedDonation(newDonation);

    setImpactStats((prev) => ({
      ...prev,
      mealsSaved: prev.mealsSaved + peopleFed,
      peopleFed: prev.peopleFed + peopleFed,
    }));

    // Rule 1: Send targeted notification to each selected NGO
    chosenNgos.forEach((ngo) => {
      broadcastPushNotification(
        "New Food Listing Invitation",
        `Donor ${newDonation.donorName} listed surplus food '${newDonation.foodName}' (${newDonation.quantity}) at ${newDonation.pickupAddress}. Your shelter is invited to accept!`,
        "ngo",
        {
          recipientName: ngo.name,
          recipientId: ngo.id,
          recipientRole: "ngo",
          type: "ngo",
          donationId: newId,
          phone: ngo.phone
        }
      );
    });

    // Confirmation to the donor
    broadcastPushNotification(
      "Donation Listing Published",
      `Your surplus food '${newDonation.foodName}' (${newDonation.quantity}) is published. Invitation sent to: ${chosenNgos.map(n => n.name).join(', ')}.`,
      "donor",
      {
        recipientName: newDonation.donorName,
        recipientRole: "donor",
        type: "donor",
        donationId: newId
      }
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

    // Update in local DB
    await updateDonationStatus(donationId, updates);
    
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
  const acceptVolunteerDonation = (donationId, volunteerUser = currentUser) => {
    const donation = donations.find(d => d.id === donationId);
    if (!donation) return;

    const volName = volunteerUser?.name || currentUser?.name || "Volunteer Courier";
    const volInfo = {
      id: volunteerUser?.id || `VOL-${Date.now()}`,
      name: volName,
      phone: volunteerUser?.phone || "+1 (555) 019-2831",
      vehicle: volunteerUser?.vehicle || "Eco EV Scooter (Zero Emission)",
      operatingZone: volunteerUser?.operatingZone || "Local Sector",
      status: "Travelling to Pickup",
      isAccepted: true,
      acceptedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const isNgoAccepted = !!donation.acceptedNgo || donation.status?.includes("NGO Accepted");
    const nextStatus = isNgoAccepted ? "Volunteer Travelling" : "Volunteer Accepted • Awaiting NGO Acceptance";
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

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

    const updatedTimeline = pipelineSteps.map((stepName, idx) => {
      const existing = (donation.timeline || []).find(t => t.step === stepName) || (donation.timeline || [])[idx];
      let isCompleted = existing?.completed || false;
      let timeStr = (existing?.time && existing.time !== "Pending") ? existing.time : "Pending";

      if (idx === 0) {
        isCompleted = true;
        if (timeStr === "Pending") timeStr = donation.time || nowTime;
      }
      if (idx === 1 && isNgoAccepted) {
        isCompleted = true;
        if (timeStr === "Pending") timeStr = donation.acceptedNgo?.acceptedAt || nowTime;
      }
      if (idx === 2) {
        isCompleted = true;
        if (timeStr === "Pending") timeStr = volInfo.acceptedAt || nowTime;
      }
      if (idx === 3 && isNgoAccepted) {
        isCompleted = true;
        if (timeStr === "Pending") timeStr = nowTime;
      }

      return { step: stepName, completed: isCompleted, time: timeStr };
    });

    const updates = {
      status: nextStatus,
      timeline: updatedTimeline,
      acceptedVolunteer: volInfo,
      assignedVolunteer: volInfo
    };

    updateDonationStatus(donationId, updates);

    setDonations((prev) => prev.map((d) => {
      if (d.id === donationId) {
        const updated = {
          ...d,
          ...updates
        };
        if (selectedDonation && selectedDonation.id === donationId) {
          setSelectedDonation(updated);
        }
        return updated;
      }
      return d;
    }));

    // Rule 3 (part 2): Notification sent to the Donor when volunteer accepts
    broadcastPushNotification(
      "Volunteer Courier Assigned",
      `Volunteer courier ${volName} accepted the pickup for '${donation.foodName}'. Courier is preparing to travel to your pickup address.`,
      "donor",
      {
        recipientName: donation.donorName,
        recipientRole: "donor",
        type: "donor",
        donationId: donationId,
        phone: donation.contactNumber || donation.donorPhone
      }
    );

    // Notification sent to the accepted NGO
    const targetNgoName = donation.acceptedNgo?.name || donation.recommendedNgo?.name || "NGO Shelter";
    broadcastPushNotification(
      "Courier Assigned for Delivery",
      `Volunteer courier ${volName} accepted to deliver '${donation.foodName}' to your shelter. Courier en route to pickup.`,
      "ngo",
      {
        recipientName: targetNgoName,
        recipientRole: "ngo",
        type: "ngo",
        donationId: donationId
      }
    );
    showToast(`Accepted! You are assigned to deliver ${donation.foodName}.`, 'success');
  };

  const acceptVolunteerRequest = acceptVolunteerDonation;

  // Volunteer Declines Request (e.g. Cannot travel right now)
  const declineVolunteerDonation = (donationId, volunteerUser = currentUser, reason = "Cannot travel right now") => {
    const donation = donations.find(d => d.id === donationId);
    if (!donation) return;

    const volName = volunteerUser?.name || currentUser?.name || "Courier";
    
    setDonations((prev) => prev.map((d) => {
      if (d.id === donationId) {
        const declined = [...(d.declinedVolunteers || []), volName];
        const remainingVolunteers = (d.selectedVolunteers || []).filter(v => !declined.includes(v.name));
        
        let nextStatus = d.status;
        if (remainingVolunteers.length === 0) {
          nextStatus = "All Couriers Unavailable (Re-assigning)";
        } else {
          nextStatus = `Declined by ${volName} • Open for Other Standby Couriers`;
        }

        const updated = {
          ...d,
          declinedVolunteers: declined,
          status: nextStatus
        };
        if (selectedDonation && selectedDonation.id === donationId) {
          setSelectedDonation(updated);
        }
        return updated;
      }
      return d;
    }));

    showToast(`Declined delivery task (${reason}). Request remains open for other standby couriers.`, 'info');
  };

  // NGO Accepts Request
  const acceptNgoDonation = (donationId, ngoUser = currentUser) => {
    const donation = donations.find(d => d.id === donationId);
    if (!donation) return;

    const ngoName = ngoUser?.name || currentUser?.name || "Verified NGO Shelter";
    const ngoInfo = {
      id: ngoUser?.id || `NGO-${Date.now()}`,
      name: ngoName,
      address: ngoUser?.address || "Shelter Delivery Point",
      phone: ngoUser?.phone || "+1 (555) 019-2831",
      capacity: ngoUser?.capacity || "150 Beneficiaries",
      acceptedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const isVolAccepted = !!donation.acceptedVolunteer || donation.assignedVolunteer?.isAccepted || donation.status?.includes("Volunteer Accepted");
    const nextStatus = isVolAccepted ? "Volunteer Travelling" : "NGO Accepted • Awaiting Volunteer Courier";
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

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

    const updatedTimeline = pipelineSteps.map((stepName, idx) => {
      const existing = (donation.timeline || []).find(t => t.step === stepName) || (donation.timeline || [])[idx];
      let isCompleted = existing?.completed || false;
      let timeStr = (existing?.time && existing.time !== "Pending") ? existing.time : "Pending";

      if (idx === 0) {
        isCompleted = true;
        if (timeStr === "Pending") timeStr = donation.time || nowTime;
      }
      if (idx === 1) {
        isCompleted = true;
        if (timeStr === "Pending") timeStr = ngoInfo.acceptedAt || nowTime;
      }
      if (idx === 2 && isVolAccepted) {
        isCompleted = true;
        if (timeStr === "Pending") timeStr = donation.acceptedVolunteer?.acceptedAt || nowTime;
      }
      if (idx === 3 && isVolAccepted) {
        isCompleted = true;
        if (timeStr === "Pending") timeStr = nowTime;
      }

      return { step: stepName, completed: isCompleted, time: timeStr };
    });

    const updates = {
      status: nextStatus,
      timeline: updatedTimeline,
      acceptedNgo: ngoInfo,
      recommendedNgo: ngoInfo
    };

    updateDonationStatus(donationId, updates);

    setDonations((prev) => prev.map((d) => {
      if (d.id === donationId) {
        const updated = {
          ...d,
          ...updates
        };
        if (selectedDonation && selectedDonation.id === donationId) {
          setSelectedDonation(updated);
        }
        return updated;
      }
      return d;
    }));

    // Rule 2: Notification sent to ALL volunteers that the donor had selected
    const selectedVols = (donation.selectedVolunteers && donation.selectedVolunteers.length > 0)
      ? donation.selectedVolunteers
      : (donation.assignedVolunteer ? [donation.assignedVolunteer] : registeredVolunteers);

    selectedVols.forEach((vol) => {
      broadcastPushNotification(
        "Courier Delivery Mission Available",
        `${ngoName} has accepted food donation '${donation.foodName}' from ${donation.donorName}. You are invited to accept the pickup & delivery mission!`,
        "volunteer",
        {
          recipientName: vol.name,
          recipientId: vol.id,
          recipientRole: "volunteer",
          type: "volunteer",
          donationId: donationId,
          phone: vol.phone
        }
      );
    });

    // Rule 3 (part 1): Notification sent to the Donor at the same time when NGO accepts
    broadcastPushNotification(
      "NGO Accepted Your Food Donation",
      `${ngoName} has accepted your food donation '${donation.foodName}'! Delivery invitations dispatched to your selected volunteer couriers.`,
      "donor",
      {
        recipientName: donation.donorName,
        recipientRole: "donor",
        type: "donor",
        donationId: donationId,
        phone: donation.contactNumber || donation.donorPhone
      }
    );
    showToast(`Accepted! Shelter capacity reserved for ${donation.foodName}.`, 'success');
  };

  const acceptNgoRequest = acceptNgoDonation;

  // NGO Declines Request (e.g. Cannot take this much food / capacity full)
  const declineNgoDonation = (donationId, ngoUser = currentUser, reason = "Capacity full / cannot take this much food") => {
    const donation = donations.find(d => d.id === donationId);
    if (!donation) return;

    const ngoName = ngoUser?.name || currentUser?.name || "NGO Shelter";

    setDonations((prev) => prev.map((d) => {
      if (d.id === donationId) {
        const declined = [...(d.declinedNgos || []), ngoName];
        const remainingNgos = (d.selectedNgos || []).filter(n => !declined.includes(n.name));

        let nextStatus = d.status;
        if (remainingNgos.length === 0) {
          nextStatus = "All Selected NGOs Declined (Capacity Full)";
        } else {
          nextStatus = `Declined by ${ngoName} • Re-routed to Remaining Shelters`;
        }

        const updated = {
          ...d,
          declinedNgos: declined,
          status: nextStatus
        };
        if (selectedDonation && selectedDonation.id === donationId) {
          setSelectedDonation(updated);
        }
        return updated;
      }
      return d;
    }));

    showToast(`Declined donation for ${donation.foodName} (${reason}). Request re-routed to other selected shelters.`, 'info');
  };

  // Volunteer Reached Pickup Location
  const markVolunteerReached = (donationId) => {
    const donation = donations.find(d => d.id === donationId) || selectedDonation;
    const donorName = donation?.donorName || "Donor";
    const volName = donation?.acceptedVolunteer?.name || donation?.assignedVolunteer?.name || currentUser?.name || "Volunteer Courier";

    updateDonationStatusPipeline(donationId, "Volunteer Reached Pickup");
    broadcastPushNotification(
      "Courier Arrived at Pickup Location",
      `Volunteer courier ${volName} has arrived at your pickup address. Please show your Pickup QR pass to verify handover.`,
      "donor",
      {
        recipientName: donorName,
        recipientRole: "donor",
        type: "donor",
        donationId: donationId,
        phone: donation?.contactNumber || donation?.donorPhone
      }
    );
  };

  // Scan QR Code at Pickup (Volunteer scans Donor's Pickup QR)
  // Rule 4: Notification sent to NGO when volunteer scans pickup QR from donor (means he is out for delivery)
  const scanPickupQR = (donationId) => {
    const donation = donations.find(d => d.id === donationId) || selectedDonation;
    const volName = donation?.acceptedVolunteer?.name || donation?.assignedVolunteer?.name || currentUser?.name || "Volunteer Courier";
    const ngoName = donation?.acceptedNgo?.name || donation?.recommendedNgo?.name || "NGO Shelter";
    const donorName = donation?.donorName || "Donor";
    const foodName = donation?.foodName || "Surplus Catered Meal";

    updateDonationStatusPipeline(donationId, "Food Picked Up");
    
    // Rule 4: Crucial notification sent to NGO that food is picked up and out for delivery!
    broadcastPushNotification(
      "Food Package Picked Up • Out for Delivery",
      `Volunteer courier ${volName} has scanned the pickup QR code and picked up '${foodName}'. Courier is now OUT FOR DELIVERY to your shelter (${ngoName})!`,
      "ngo",
      {
        recipientName: ngoName,
        recipientRole: "ngo",
        type: "ngo",
        donationId: donationId
      }
    );

    // Confirmation sent to Donor
    broadcastPushNotification(
      "Food Picked Up by Courier",
      `Volunteer courier ${volName} has successfully scanned your Pickup QR pass for '${foodName}'. Courier is out for delivery to ${ngoName}.`,
      "donor",
      {
        recipientName: donorName,
        recipientRole: "donor",
        type: "donor",
        donationId: donationId,
        phone: donation?.contactNumber || donation?.donorPhone
      }
    );

    // Award points to volunteer courier
    setRegisteredVolunteers(prev => prev.map(v => {
      if (v.name === volName || (donation?.acceptedVolunteer?.id && v.id === donation.acceptedVolunteer.id)) {
        return { ...v, points: (v.points || 0) + 25 };
      }
      return v;
    }));

    setTimeout(() => {
      updateDonationStatusPipeline(donationId, "Travelling to NGO");
    }, 1000);

    showToast(`✓ Pickup Verified! NGO Shelter (${ngoName}) notified that food is out for delivery.`, 'success');
  };

  // Deliver & NGO Confirms Delivery (Volunteer scans NGO's Delivery QR at shelter)
  // Rule 5: One notification to donor when volunteer scans QR from NGO when he delivers food there
  const scanDeliveryQR = (donationId) => {
    const donation = donations.find(d => d.id === donationId) || selectedDonation;
    const volName = donation?.acceptedVolunteer?.name || donation?.assignedVolunteer?.name || currentUser?.name || "Volunteer Courier";
    const ngoName = donation?.acceptedNgo?.name || donation?.recommendedNgo?.name || "NGO Shelter";
    const donorName = donation?.donorName || "Donor";
    const foodName = donation?.foodName || "Surplus Catered Meal";
    const donorPhone = donation?.contactNumber || donation?.donorPhone || mobileNumber;

    updateDonationStatusPipeline(donationId, "Delivered");
    
    // Rule 5: Crucial notification sent to respective Donor that food has been delivered safely!
    broadcastPushNotification(
      "Food Delivered Safely! 🎉",
      `Great news! Your surplus food '${foodName}' has been delivered safely to ${ngoName} by volunteer courier ${volName}! Zero food wasted.`,
      "donor",
      {
        recipientName: donorName,
        recipientRole: "donor",
        type: "delivered",
        donationId: donationId,
        phone: donorPhone
      }
    );

    // Notification sent to NGO shelter
    broadcastPushNotification(
      "Food Delivery Confirmed",
      `Food package '${foodName}' has been verified and safely received from courier ${volName}. Ready for distribution.`,
      "ngo",
      {
        recipientName: ngoName,
        recipientRole: "ngo",
        type: "delivered",
        donationId: donationId
      }
    );

    // Notification sent to Volunteer courier
    broadcastPushNotification(
      "Delivery Mission Accomplished",
      `Thank you ${volName}! You safely delivered '${foodName}' to ${ngoName}. Impact recorded.`,
      "volunteer",
      {
        recipientName: volName,
        recipientRole: "volunteer",
        type: "delivered",
        donationId: donationId
      }
    );

    // Award points and increment completed pickups for volunteer courier
    setRegisteredVolunteers(prev => prev.map(v => {
      if (v.name === volName || (donation?.acceptedVolunteer?.id && v.id === donation.acceptedVolunteer.id)) {
        return { 
          ...v, 
          points: (v.points || 0) + 50,
          completedPickups: (v.completedPickups || 0) + 1 
        };
      }
      return v;
    }));

    setTimeout(() => {
      updateDonationStatusPipeline(donationId, "NGO Confirmed");
      triggerConfetti();
    }, 1000);

    showToast(`✓ Safe Delivery Confirmed! Donor (${donorName}) has been notified that food was delivered safely.`, 'success');
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

  // Register user via backend API (Express + Prisma + PostgreSQL)
  const registerUser = async (userData) => {
    try {
      const cleanName = (userData.name || 'Dhruv').trim();
      const rawRole = String(userData.role || 'donor').toLowerCase();
      
      const roleMap = {
        donor: 'DONOR',
        ngo: 'NGO',
        volunteer: 'VOLUNTEER',
        admin: 'ADMIN'
      };
      const backendRole = roleMap[rawRole] || 'DONOR';

      let userFromBackend = null;
      let jwtToken = null;

      try {
        const res = await authAPI.register({
          name: cleanName,
          email: (userData.email || `${cleanName.toLowerCase()}_${Date.now()}@foodbridge.ai`).trim().toLowerCase(),
          password: userData.password || 'SecurePassword123!',
          role: backendRole,
          phone: userData.phone || '+1 (555) 019-2831',
          address: userData.address || 'Local Sector',
          organizationName: userData.businessName || cleanName
        });

        if (res?.data?.data) {
          userFromBackend = res.data.data.user;
          jwtToken = res.data.data.token;
        }
      } catch (apiErr) {
        console.warn('Backend register API error:', apiErr?.response?.data || apiErr.message);
        const errMsg = apiErr?.response?.data?.message || apiErr?.message || 'Registration failed.';
        showToast(errMsg, 'error');
        return false;
      }

      const uid = userFromBackend?.id || `usr_${Date.now()}`;
      if (jwtToken) {
        localStorage.setItem('fb_jwt_token', jwtToken);
      }

      const newUserProfile = {
        id: uid,
        uid,
        name: userFromBackend?.name || cleanName,
        email: userFromBackend?.email || userData.email,
        role: rawRole,
        backendRole: userFromBackend?.role || backendRole,
        phone: userFromBackend?.phone || userData.phone || '+1 (555) 019-2831',
        address: userData.address || 'Local District',
        donorType: userData.donorType || 'Household / Individual',
        verified: userFromBackend?.isVerified !== undefined ? userFromBackend.isVerified : true,
        createdAt: userFromBackend?.createdAt || new Date().toISOString(),
        avatar: `https://images.unsplash.com/photo-${rawRole === 'volunteer' ? '1534528741775-53994a69daeb' : rawRole === 'ngo' ? '1593113598332-cd288d649433' : '1535713875002-d1d0cf377fde'}?w=150&auto=format&fit=crop&q=80`,
        ...(rawRole === 'volunteer' ? {
          vehicle: userData.vehicle || 'Eco EV Scooter (Zero Emission)',
          operatingZone: userData.address || 'Downtown Sector',
          availability: '24/7 On-Call Standby',
          rating: 5.0,
          completedPickups: 0,
          points: 0
        } : {}),
        ...(rawRole === 'ngo' ? {
          dailyCapacity: '100 - 250 Beneficiaries',
          foodPreference: 'Cooked Meals & Prepared Buffets',
          coldStorage: 'Yes - Refrigerated Storage Ready',
          contactPerson: cleanName
        } : {})
      };

      await createUserProfile(uid, newUserProfile);

      // Also register to corresponding pool
      if (rawRole === 'volunteer') {
        addVolunteer(newUserProfile);
      } else if (rawRole === 'ngo') {
        addNGO(newUserProfile);
      }

      // Automatically log in with the new registered account
      setCurrentRole(rawRole);
      setCurrentUser(newUserProfile);
      setIsLoggedIn(true);

      try {
        localStorage.setItem('fb_current_role', JSON.stringify(rawRole));
        localStorage.setItem('fb_current_user', JSON.stringify(newUserProfile));
        localStorage.setItem('fb_is_logged_in', JSON.stringify(true));
        localStorage.setItem('fb_active_view', JSON.stringify(rawRole));
      } catch (e) {
        console.warn('Storage write error:', e);
      }

      if (rawRole === 'donor') setActiveView('donor');
      else if (rawRole === 'volunteer') setActiveView('volunteer');
      else if (rawRole === 'ngo') setActiveView('ngo');
      else if (rawRole === 'admin') setActiveView('admin');

      showToast(`Welcome, ${newUserProfile.name}! Persisted to PostgreSQL as ${backendRole}.`, 'success');
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      showToast(error.message || 'Registration failed.', 'error');
      return false;
    }
  };

  // Login user via backend API (Express + Prisma + PostgreSQL)
  const loginUser = async (email, password, role) => {
    try {
      const cleanInput = (email || '').trim();
      const cleanEmail = cleanInput.toLowerCase();

      let userFromBackend = null;
      let jwtToken = null;

      try {
        const res = await authAPI.login({
          email: cleanEmail,
          password: password
        });

        if (res?.data?.data) {
          userFromBackend = res.data.data.user;
          jwtToken = res.data.data.token;
        }
      } catch (apiErr) {
        console.warn('Backend login API error:', apiErr?.response?.data || apiErr.message);
        const errMsg = apiErr?.response?.data?.message || 'Invalid email or password.';
        showToast(errMsg, 'error');
        return false;
      }

      if (jwtToken) {
        localStorage.setItem('fb_jwt_token', jwtToken);
      }

      const activeRole = (userFromBackend?.role ? userFromBackend.role.toLowerCase() : role) || 'donor';
      const profile = {
        id: userFromBackend?.id || `usr_${Date.now()}`,
        name: userFromBackend?.name || cleanEmail.split('@')[0],
        email: userFromBackend?.email || cleanEmail,
        role: activeRole,
        backendRole: userFromBackend?.role || activeRole.toUpperCase(),
        phone: userFromBackend?.phone || '+1 (555) 019-2831',
        verified: userFromBackend?.isVerified !== undefined ? userFromBackend.isVerified : true,
        donorType: 'Household / Individual',
        createdAt: userFromBackend?.createdAt || new Date().toISOString(),
        avatar: `https://images.unsplash.com/photo-${activeRole === 'volunteer' ? '1534528741775-53994a69daeb' : activeRole === 'ngo' ? '1593113598332-cd288d649433' : '1535713875002-d1d0cf377fde'}?w=150&auto=format&fit=crop&q=80`
      };

      await createUserProfile(profile.id, profile);

      if (activeRole === 'volunteer') {
        setRegisteredVolunteers(prev => {
          if (prev.some(v => v.name?.toLowerCase() === profile.name?.toLowerCase() || v.id === profile.id)) return prev;
          const newVol = {
            id: profile.id || `VOL-${Date.now()}`,
            name: profile.name,
            phone: profile.phone || "+1 (555) 019-2831",
            vehicle: profile.vehicle || "Eco EV Scooter (Zero Emission)",
            operatingZone: profile.operatingZone || profile.address || "Local Sector",
            availability: "24/7 On-Call Standby",
            rating: 5.0,
            completedPickups: 0,
            points: 0,
            photo: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
            status: 'Active on Standby'
          };
          return [newVol, ...prev];
        });
      }

      if (activeRole === 'ngo') {
        setRegisteredNGOs(prev => {
          if (prev.some(n => n.name?.toLowerCase() === profile.name?.toLowerCase() || n.id === profile.id)) return prev;
          const newNgo = {
            id: profile.id || `NGO-${Date.now()}`,
            name: profile.name,
            contactPerson: profile.name,
            phone: profile.phone || "+1 (555) 019-2831",
            address: profile.address || "Haven Shelter, Sector 4",
            capacity: "150 Beneficiaries",
            dailyCapacity: "150 Beneficiaries",
            foodPreference: "Cooked Meals & Prepared Buffets",
            coldStorage: "Yes - Refrigerated Storage Ready",
            logo: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=150&auto=format&fit=crop&q=80",
            verified: true,
            status: 'Accepting Donations'
          };
          return [newNgo, ...prev];
        });
      }

      setCurrentRole(activeRole);
      setCurrentUser(profile);
      setIsLoggedIn(true);

      try {
        localStorage.setItem('fb_current_role', JSON.stringify(activeRole));
        localStorage.setItem('fb_current_user', JSON.stringify(profile));
        localStorage.setItem('fb_is_logged_in', JSON.stringify(true));
        localStorage.setItem('fb_active_view', JSON.stringify(activeRole));
      } catch (e) {
        console.warn('Storage write error:', e);
      }

      if (activeRole === 'donor') setActiveView('donor');
      else if (activeRole === 'volunteer') setActiveView('volunteer');
      else if (activeRole === 'ngo') setActiveView('ngo');
      else if (activeRole === 'admin') setActiveView('admin');

      showToast(`Welcome back, ${profile.name}! Authenticated via PostgreSQL JWT.`, "success");
      return true;
    } catch (error) {
      console.error("Login error:", error);
      showToast("Login error: " + error.message, "error");
      return false;
    }
  };

  // Distributed user notification filtering:
  // Each user/persona sees ONLY the notifications specifically intended for them!
  const userNotifications = notifications.filter((n) => {
    // Admin supervises all notifications across the platform
    if (currentRole === 'admin') return true;

    // Platform-wide announcements
    if (n.targetRole === 'all') return true;

    // Check role match
    const roleMatch = n.targetRole === currentRole || n.recipientRole === currentRole;
    if (!roleMatch) return false;

    // If addressed to a specific recipient name, check matching
    if (n.recipientName && currentUser?.name) {
      const target = n.recipientName.trim().toLowerCase();
      const me = currentUser.name.trim().toLowerCase();
      return target === me || target.includes(me) || me.includes(target);
    }

    return true;
  });

  const unreadNotifCount = userNotifications.filter(n => !n.read).length;

  const markNotificationsRead = () => {
    const myNotifIds = new Set(userNotifications.map(n => n.id));
    setNotifications((prev) => prev.map(n => myNotifIds.has(n.id) ? { ...n, read: true } : n));
  };

  // Role Switcher (Preserves actual user identity without defaulting to Royal Horizon)
  const switchRole = (role, userData = null) => {
    let user;
    if (userData) {
      user = userData;
    } else if (currentUser && currentUser.name && !currentUser.name.includes("Royal")) {
      user = { 
        ...currentUser, 
        role 
      };
    } else {
      user = { 
        id: `usr_${role}_${Date.now()}`,
        name: "Dhruv", 
        email: "dhruv@foodbridge.ai",
        role,
        verified: true 
      };
    }
    setCurrentRole(role);
    setCurrentUser(user);
    setIsLoggedIn(true);
    setActiveView(role);

    if (role === 'volunteer') {
      setRegisteredVolunteers(prev => {
        if (prev.some(v => v.name?.toLowerCase() === user.name?.toLowerCase() || v.id === user.id)) return prev;
        const newVol = {
          id: user.id || `VOL-${Date.now()}`,
          name: user.name,
          phone: user.phone || "+1 (555) 019-2831",
          vehicle: user.vehicle || "Eco EV Scooter (Zero Emission)",
          operatingZone: user.operatingZone || user.address || "Local Sector",
          availability: "24/7 On-Call Standby",
          rating: 5.0,
          completedPickups: 0,
          points: 0,
          photo: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
          status: 'Active on Standby'
        };
        return [newVol, ...prev];
      });
    }

    if (role === 'ngo') {
      setRegisteredNGOs(prev => {
        if (prev.some(n => n.name?.toLowerCase() === user.name?.toLowerCase() || n.id === user.id)) return prev;
        const newNgo = {
          id: user.id || `NGO-${Date.now()}`,
          name: user.name,
          contactPerson: user.name,
          phone: user.phone || "+1 (555) 019-2831",
          address: user.address || "Haven Shelter, Sector 4",
          capacity: "150 Beneficiaries",
          dailyCapacity: "150 Beneficiaries",
          foodPreference: "Cooked Meals & Prepared Buffets",
          coldStorage: "Yes - Refrigerated Storage Ready",
          logo: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=150&auto=format&fit=crop&q=80",
          verified: true,
          status: 'Accepting Donations'
        };
        return [newNgo, ...prev];
      });
    }

    if (role === 'donor') setActiveView('donor');
    else if (role === 'volunteer') setActiveView('volunteer');
    else if (role === 'ngo') setActiveView('ngo');
    else if (role === 'admin') setActiveView('admin');
    
    showToast(`Switched persona to ${role.toUpperCase()}: ${user.name}.`);
  };

  // Logout
  const logout = () => {
    setCurrentRole(null);
    setCurrentUser(null);
    setIsLoggedIn(false);
    setActiveView('landing');
    try {
      localStorage.removeItem('fb_jwt_token');
      localStorage.removeItem('fb_current_role');
      localStorage.removeItem('fb_current_user');
      localStorage.setItem('fb_is_logged_in', 'false');
      localStorage.setItem('fb_active_view', JSON.stringify('landing'));
    } catch (e) {
      console.warn("Error clearing localStorage session", e);
    }
    showToast('Logged out successfully.', 'info');
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
        userNotifications,
        impactStats,
        unreadNotifCount,
        mobileNumber,
        setMobileNumber,
        smsModalOpen,
        setSmsModalOpen,
        // Auth
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
        acceptNgoDonation,
        declineNgoDonation,
        acceptVolunteerRequest,
        acceptVolunteerDonation,
        declineVolunteerDonation,
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
