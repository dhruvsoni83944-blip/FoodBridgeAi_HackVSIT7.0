import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { SendVolunteerSMSModal } from './SendVolunteerSMSModal';
import { 
  Sparkles, 
  Building2, 
  Truck, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Zap, 
  AlertCircle, 
  ArrowRight,
  RefreshCw,
  Compass,
  Phone,
  Star,
  ShieldCheck,
  User,
  HeartHandshake,
  Smartphone,
  Send
} from 'lucide-react';

export const AIMatchingScreen = () => {
  const { selectedDonation, acceptVolunteerRequest, setActiveView, showToast, updateDonationStatusPipeline } = useApp();
  
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [currentLoadingStep, setCurrentLoadingStep] = useState(0);
  const [smsModalOpen, setSmsModalOpen] = useState(false);

  const loadingSteps = [
    "Scanning nearby NGOs...",
    "Checking volunteer availability...",
    "Verifying food freshness...",
    "Calculating shortest delivery route...",
    "Predicting delivery success...",
    "Finalizing best match..."
  ];

  useEffect(() => {
    setIsLoading(true);
    setLoadingProgress(0);
    setCurrentLoadingStep(0);

    const totalDuration = 4500;
    const intervalTime = 50;
    const totalSteps = totalDuration / intervalTime;
    let stepCount = 0;

    const timer = setInterval(() => {
      stepCount++;
      const progress = Math.min(100, Math.floor((stepCount / totalSteps) * 100));
      setLoadingProgress(progress);

      const stepIdx = Math.min(loadingSteps.length - 1, Math.floor((progress / 100) * loadingSteps.length));
      setCurrentLoadingStep(stepIdx);

      if (stepCount >= totalSteps) {
        clearInterval(timer);
        setTimeout(() => {
          setIsLoading(false);
          if (selectedDonation && (selectedDonation.status === "Waiting for AI Matching" || selectedDonation.status === "Donation Created")) {
            updateDonationStatusPipeline(selectedDonation.id, "AI Matching");
          }
        }, 300);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [selectedDonation?.id]);

  const donation = selectedDonation || {
    id: "DON-8092",
    foodName: "Surplus Gourmet Banquet Buffet",
    category: "Cooked Meals",
    quantity: "45 kg",
    peopleFedCount: 120,
    createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    aiConfidenceScore: 98.4,
    freshnessScore: 97.8,
    estimatedPickupMins: 14,
    estimatedDeliveryMins: 28,
    status: "AI Matching",
    priorityLevel: "HIGH URGENCY",
    pickupAddress: "Grand Palace Hotel, 742 Evergreen Terrace",
    contactNumber: "+1 (555) 234-5678",
    donorName: "Royal Horizon Grand Hotel & Banquets",
    recommendedNgo: {
      id: "usr_ngo_1",
      name: "Hope Community Shelter",
      rating: 4.9,
      distanceKm: 1.2,
      capacityAvailable: 150,
      contactNumber: "+1 (555) 987-6543",
      logo: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=150&auto=format&fit=crop&q=80"
    },
    assignedVolunteer: {
      id: "usr_vol_1",
      name: "Alex Rivera",
      phone: "+1 (555) 456-7890",
      vehicle: "Eco EV Scooter (Plate: FB-992)",
      rating: 4.9,
      photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      distanceKm: 0.8,
      status: "Available"
    }
  };

  const handleManualReRun = () => {
    setIsLoading(true);
    setLoadingProgress(0);
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-8">
        <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20 animate-ping"></div>
          <div className="absolute inset-4 rounded-full border-2 border-emerald-400/40 animate-pulse"></div>
          <div className="absolute inset-8 rounded-full bg-emerald-950/80 border border-emerald-500/60 shadow-2xl flex items-center justify-center">
            <Sparkles className="w-12 h-12 text-emerald-400 animate-spin" />
          </div>
          <div className="absolute inset-0 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin-slow"></div>
        </div>

        <div className="space-y-4 max-w-md mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-extrabold border border-emerald-500/30 uppercase tracking-wider">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
            <span>AI Dispatch Optimization Neural Processing</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
            Computing Optimal AI Match...
          </h2>

          <div className="p-4 rounded-2xl glass-panel border border-emerald-500/30 bg-emerald-950/90 shadow-lg">
            <p className="text-sm font-extrabold text-emerald-300 flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>• {loadingSteps[currentLoadingStep]}</span>
            </p>
          </div>

          <div className="w-full h-3 rounded-full bg-emerald-950 border border-emerald-500/30 overflow-hidden relative">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-75 shadow-lg shadow-emerald-500/50"
              style={{ width: `${loadingProgress}%` }}
            ></div>
          </div>

          <div className="flex justify-between text-[11px] font-mono text-slate-400">
            <span>Neural Tensor Execution</span>
            <span className="font-extrabold text-emerald-300">{loadingProgress}%</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-in fade-in duration-500">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-emerald-500/20 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-extrabold border border-emerald-500/30 uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>AI Match Completed • 98.4% Match Accuracy</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">AI Matching Dashboard</h1>
          <p className="text-xs text-slate-300">Donation #{donation.id} • Real-time AI Match Matrix</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSmsModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center gap-1.5"
          >
            <Smartphone className="w-4 h-4 text-amber-400" />
            <span>Send Receiving SMS to Volunteer</span>
          </button>

          <button
            onClick={handleManualReRun}
            className="px-4 py-2 rounded-xl glass-panel hover:bg-emerald-800/40 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Re-Run AI Matching</span>
          </button>
        </div>
      </div>

      {/* MATCHING DASHBOARD METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* DONOR DETAILS CARD */}
        <div className="glass-card p-6 rounded-3xl border border-emerald-500/30 space-y-5 relative group">
          <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
            <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <HeartHandshake className="w-4 h-4" /> DONOR & FOOD DETAILS
            </span>
            <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/20">
              ID: {donation.id}
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <p className="text-slate-400 text-[11px]">Donor Name</p>
              <h3 className="text-base font-extrabold text-white mt-0.5">{donation.donorName || "Royal Horizon Hotel"}</h3>
            </div>

            <div className="bg-emerald-950/60 p-3 rounded-2xl border border-emerald-500/20 space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Food Item:</span>
                <span className="font-bold text-white">{donation.foodName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Quantity & Servings:</span>
                <span className="font-bold text-emerald-300">{donation.quantity} (~{donation.peopleFedCount} Servings)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Food Type:</span>
                <span className="font-semibold text-white">{donation.category}</span>
              </div>
            </div>

            <div>
              <p className="text-slate-400 text-[11px]">Pickup Address</p>
              <p className="font-semibold text-white flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{donation.pickupAddress}</span>
              </p>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-emerald-500/10 text-[11px]">
              <span className="text-slate-400">Food Freshness Score:</span>
              <span className="font-extrabold text-emerald-400 bg-emerald-500/20 px-2.5 py-1 rounded border border-emerald-500/30">
                {donation.freshnessScore || 97.8}% (Grade A)
              </span>
            </div>
          </div>
        </div>

        {/* ASSIGNED NGO CARD */}
        <div className="glass-card p-6 rounded-3xl border border-blue-500/30 space-y-5 relative group">
          <div className="flex items-center justify-between border-b border-blue-500/20 pb-3">
            <span className="text-xs font-extrabold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-4 h-4" /> ASSIGNED NGO
            </span>
            <span className="text-[10px] font-bold bg-blue-500/10 text-blue-300 px-2 py-0.5 rounded border border-blue-500/20">
              Matched Partner
            </span>
          </div>

          <div className="flex items-center gap-3">
            <img 
              src={donation.recommendedNgo?.logo || "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=150&auto=format&fit=crop&q=80"} 
              alt="NGO Logo" 
              className="w-14 h-14 object-cover rounded-2xl border border-blue-500/30"
            />
            <div>
              <h3 className="text-base font-extrabold text-white">{donation.recommendedNgo?.name || "Hope Community Shelter"}</h3>
              <div className="flex items-center gap-1 text-xs text-amber-300 font-bold mt-0.5">
                <Star className="w-3.5 h-3.5 fill-amber-300" />
                <span>{donation.recommendedNgo?.rating || 4.9} Rating</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 text-xs bg-blue-950/40 p-3 rounded-2xl border border-blue-500/20">
            <div className="flex justify-between">
              <span className="text-slate-400">Shelter Capacity:</span>
              <span className="font-bold text-white">{donation.recommendedNgo?.capacityAvailable || 150} Occupants</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Distance Matrix:</span>
              <span className="font-bold text-blue-300">{donation.recommendedNgo?.distanceKm || 1.2} km away</span>
            </div>
          </div>
        </div>

        {/* ASSIGNED VOLUNTEER CARD */}
        <div className="glass-card p-6 rounded-3xl border border-amber-500/30 space-y-5 relative group">
          <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
            <span className="text-xs font-extrabold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Truck className="w-4 h-4" /> ASSIGNED VOLUNTEER
            </span>
            <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
              Status: {donation.assignedVolunteer?.status || "Available"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <img 
              src={donation.assignedVolunteer?.photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"} 
              alt="Volunteer" 
              className="w-14 h-14 object-cover rounded-full border-2 border-amber-400"
            />
            <div>
              <h3 className="text-base font-extrabold text-white">{donation.assignedVolunteer?.name || "Alex Rivera"}</h3>
              <p className="text-xs text-amber-300 font-semibold">{donation.assignedVolunteer?.vehicle || "Eco EV Scooter"}</p>
            </div>
          </div>

          <div className="space-y-2 text-xs bg-amber-950/40 p-3 rounded-2xl border border-amber-500/20">
            <div className="flex justify-between">
              <span className="text-slate-400">Est. Pickup Time:</span>
              <span className="font-bold text-white">{donation.estimatedPickupMins || 14} Minutes</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Est. Delivery Time:</span>
              <span className="font-bold text-emerald-300">{donation.estimatedDeliveryMins || 28} Minutes</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Volunteer Phone:</span>
              <span className="font-mono text-slate-200">{donation.assignedVolunteer?.phone || "+1 555-456-7890"}</span>
            </div>
          </div>
        </div>

      </div>

      {/* ACTION CTAs & DIRECT VOLUNTEER SMS BUTTON */}
      <div className="glass-panel p-6 rounded-3xl border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-white">Volunteer Assigned: {donation.assignedVolunteer?.name || "Alex Rivera"}</p>
            <p className="text-[11px] text-slate-400">Dispatch donation receiving SMS pass directly to courier's phone.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setSmsModalOpen(true)}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-amber-950 font-extrabold text-xs shadow-lg transition-all hover:scale-105 flex items-center gap-2"
          >
            <Smartphone className="w-4 h-4 text-amber-950" />
            <span>Send Receiving SMS to Volunteer</span>
          </button>

          <button
            onClick={() => setActiveView('volunteer')}
            className="px-6 py-3.5 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-extrabold text-xs transition-all"
          >
            Volunteer View
          </button>

          <button
            onClick={() => setActiveView('live-tracking')}
            className="px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-extrabold text-xs shadow-lg transition-all hover:scale-105"
          >
            Open Live GPS Map Tracker
          </button>
        </div>
      </div>

      {/* SEND VOLUNTEER SMS MODAL */}
      <SendVolunteerSMSModal 
        isOpen={smsModalOpen}
        onClose={() => setSmsModalOpen(false)}
        donation={donation}
      />

    </div>
  );
};
