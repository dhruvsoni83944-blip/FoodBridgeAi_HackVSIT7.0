import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { SendVolunteerSMSModal } from './SendVolunteerSMSModal';
import { 
  Sparkles, 
  Building2, 
  Truck, 
  MapPin, 
  CheckCircle2, 
  Zap, 
  RefreshCw,
  Star,
  HeartHandshake,
  Smartphone
} from 'lucide-react';

export const AIMatchingScreen = () => {
  const { selectedDonation, donations, setActiveView, updateDonationStatusPipeline } = useApp();
  
  const donation = selectedDonation || (donations && donations.length > 0 ? donations[0] : null);

  const [isLoading, setIsLoading] = useState(Boolean(donation));
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
    if (!donation) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setLoadingProgress(0);
    setCurrentLoadingStep(0);

    const totalDuration = 4500;
    const intervalTime = 50;
    const totalSteps = totalDuration / intervalTime;
    let stepCount = 0;

    const timer = setInterval(() => {
      stepCount++;
      const progress = Math.min(Math.round((stepCount / totalSteps) * 100), 100);
      setLoadingProgress(progress);

      const stepIdx = Math.min(
        Math.floor((stepCount / totalSteps) * loadingSteps.length),
        loadingSteps.length - 1
      );
      setCurrentLoadingStep(stepIdx);

      if (stepCount >= totalSteps) {
        clearInterval(timer);
        setTimeout(() => {
          setIsLoading(false);
          if (donation && (donation.status === "Waiting for AI Matching" || donation.status === "Donation Created")) {
            updateDonationStatusPipeline(donation.id, "AI Matching");
          }
        }, 300);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [donation?.id]);

  const handleManualReRun = () => {
    if (!donation) return;
    setIsLoading(true);
    setLoadingProgress(0);
  };

  if (!donation) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="bg-white p-12 rounded-3xl border border-slate-200 shadow-sm max-w-lg mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-[#EBF1FE] text-[#1D52F2] flex items-center justify-center mx-auto">
            <Sparkles className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">No Active Food Rescue Donations</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            The AI Match Engine activates when a donor posts surplus food. Create a donation listing to calculate real-time nutritional triage, routing, and shelter assignments.
          </p>
          <button
            onClick={() => setActiveView('donor')}
            className="px-6 py-3 rounded-2xl bg-[#1D52F2] hover:bg-[#133BB5] text-white font-bold text-xs shadow-md shadow-[#1D52F2]/20 transition-all cursor-pointer"
          >
            Post Surplus Food in Donor Portal
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-8">
        <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-[#1D52F2]/20 animate-ping"></div>
          <div className="absolute inset-4 rounded-full border-2 border-[#1D52F2]/40 animate-pulse"></div>
          <div className="absolute inset-8 rounded-full bg-white border-2 border-[#1D52F2] shadow-xl flex items-center justify-center">
            <Sparkles className="w-12 h-12 text-[#1D52F2] animate-spin" />
          </div>
          <div className="absolute inset-0 rounded-full border-2 border-[#63A644] border-t-transparent animate-spin-slow"></div>
        </div>

        <div className="space-y-4 max-w-md mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBF1FE] text-[#1D52F2] text-xs font-black border border-[#1D52F2]/30 uppercase tracking-wider">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#1D52F2]" />
            <span>AI Dispatch Neural Processing</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
            Computing Optimal AI Match...
          </h2>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <p className="text-sm font-bold text-slate-800 flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#1D52F2] animate-ping"></span>
              <span>• {loadingSteps[currentLoadingStep]}</span>
            </p>
          </div>

          <div className="w-full h-3 rounded-full bg-slate-200 overflow-hidden relative">
            <div 
              className="h-full bg-gradient-to-r from-[#1D52F2] to-[#63A644] rounded-full transition-all duration-75 shadow-sm"
              style={{ width: `${loadingProgress}%` }}
            ></div>
          </div>

          <div className="flex justify-between text-[11px] font-mono text-slate-500">
            <span>Neural Tensor Execution</span>
            <span className="font-extrabold text-[#1D52F2]">{loadingProgress}%</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-in fade-in duration-500">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F0F8EC] text-[#63A644] text-xs font-bold border border-[#63A644]/30 uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4 text-[#63A644]" />
            <span>AI Match Completed • 98.4% Match Accuracy</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mt-1">AI Matching Dashboard</h1>
          <p className="text-xs text-slate-500">Donation #{donation.id} • Real-time AI Match Matrix</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSmsModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#FEF3EB] hover:bg-[#F26B1D]/15 border border-[#F26B1D]/30 text-[#F26B1D] text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Smartphone className="w-4 h-4 text-[#F26B1D]" />
            <span>Send SMS to Volunteer</span>
          </button>

          <button
            onClick={handleManualReRun}
            className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <RefreshCw className="w-4 h-4 text-[#1D52F2]" />
            <span>Re-Run AI Matching</span>
          </button>
        </div>
      </div>

      {/* MATCHING DASHBOARD METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* DONOR DETAILS CARD */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5 relative group hover:border-[#1D52F2]/30 transition-all">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <span className="text-xs font-black text-[#1D52F2] uppercase tracking-wider flex items-center gap-1.5">
              <HeartHandshake className="w-4 h-4" /> DONOR & FOOD DETAILS
            </span>
            <span className="text-[10px] font-bold bg-[#EBF1FE] text-[#1D52F2] px-2 py-0.5 rounded border border-[#1D52F2]/20">
              ID: {donation.id}
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <p className="text-slate-500 text-[11px]">Donor Name</p>
              <h3 className="text-base font-extrabold text-slate-900 mt-0.5">{donation.donorName || "Verified Donor"}</h3>
            </div>

            <div className="bg-[#F8FAFC] p-3.5 rounded-2xl border border-slate-200 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Food Item:</span>
                <span className="font-bold text-slate-900">{donation.foodName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Quantity & Servings:</span>
                <span className="font-bold text-[#63A644]">{donation.quantity} (~{donation.peopleFedCount} Servings)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Food Type:</span>
                <span className="font-semibold text-slate-800">{donation.category}</span>
              </div>
            </div>

            <div>
              <p className="text-slate-500 text-[11px]">Pickup Address</p>
              <p className="font-semibold text-slate-900 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-[#1D52F2] shrink-0" />
                <span>{donation.pickupAddress}</span>
              </p>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-slate-200 text-[11px]">
              <span className="text-slate-500">Food Freshness Score:</span>
              <span className="font-extrabold text-[#63A644] bg-[#F0F8EC] px-2.5 py-1 rounded-md border border-[#63A644]/30">
                {donation.freshnessScore || 97.8}% (Grade A)
              </span>
            </div>
          </div>
        </div>

        {/* ASSIGNED NGO CARD */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5 relative group hover:border-[#1D52F2]/30 transition-all">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <span className="text-xs font-black text-[#1D52F2] uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-4 h-4" /> ASSIGNED NGO
            </span>
            <span className="text-[10px] font-bold bg-[#EBF1FE] text-[#1D52F2] px-2 py-0.5 rounded border border-[#1D52F2]/20">
              Matched Partner
            </span>
          </div>

          <div className="flex items-center gap-3.5">
            <img 
              src={donation.recommendedNgo?.logo || "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=150&auto=format&fit=crop&q=80"} 
              alt="NGO Logo" 
              className="w-14 h-14 object-cover rounded-2xl border border-slate-200 shadow-xs"
            />
            <div>
              <h3 className="text-base font-extrabold text-slate-900">{donation.recommendedNgo?.name || "Assigned NGO Shelter"}</h3>
              <div className="flex items-center gap-1 text-xs text-[#F26B1D] font-bold mt-0.5">
                <Star className="w-3.5 h-3.5 fill-[#F26B1D]" />
                <span>{donation.recommendedNgo?.rating || 4.9} Rating</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 text-xs bg-[#F8FAFC] p-3.5 rounded-2xl border border-slate-200">
            <div className="flex justify-between">
              <span className="text-slate-500">Shelter Capacity:</span>
              <span className="font-bold text-slate-900">{donation.recommendedNgo?.capacityAvailable || 150} Occupants</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Distance Matrix:</span>
              <span className="font-bold text-[#1D52F2]">{donation.recommendedNgo?.distanceKm || 1.2} km away</span>
            </div>
          </div>
        </div>

        {/* ASSIGNED VOLUNTEER CARD */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5 relative group hover:border-[#F26B1D]/30 transition-all">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <span className="text-xs font-black text-[#F26B1D] uppercase tracking-wider flex items-center gap-1.5">
              <Truck className="w-4 h-4" /> ASSIGNED VOLUNTEER
            </span>
            <span className="text-[10px] font-bold bg-[#FEF3EB] text-[#F26B1D] px-2 py-0.5 rounded border border-[#F26B1D]/20">
              Status: {donation.assignedVolunteer?.status || "Available"}
            </span>
          </div>

          <div className="flex items-center gap-3.5">
            <img 
              src={donation.assignedVolunteer?.photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"} 
              alt="Volunteer" 
              className="w-14 h-14 object-cover rounded-full border-2 border-[#F26B1D] shadow-xs"
            />
            <div>
              <h3 className="text-base font-extrabold text-slate-900">{donation.assignedVolunteer?.name || "Assigned Courier"}</h3>
              <p className="text-xs text-[#F26B1D] font-bold">{donation.assignedVolunteer?.vehicle || "Eco EV Courier"}</p>
            </div>
          </div>

          <div className="space-y-2 text-xs bg-[#F8FAFC] p-3.5 rounded-2xl border border-slate-200">
            <div className="flex justify-between">
              <span className="text-slate-500">Est. Pickup Time:</span>
              <span className="font-bold text-slate-900">{donation.estimatedPickupMins || 14} Minutes</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Est. Delivery Time:</span>
              <span className="font-bold text-[#63A644]">{donation.estimatedDeliveryMins || 28} Minutes</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Volunteer Phone:</span>
              <span className="font-mono text-slate-800">{donation.assignedVolunteer?.phone || "+1 555-456-7890"}</span>
            </div>
          </div>
        </div>

      </div>

      {/* ACTION CTAs */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#FEF3EB] text-[#F26B1D] flex items-center justify-center font-bold">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-extrabold text-slate-900">Volunteer Assigned: {donation.assignedVolunteer?.name || "Assigned Volunteer Courier"}</p>
            <p className="text-[11px] text-slate-500">Dispatch donation receiving SMS pass directly to courier's phone.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setSmsModalOpen(true)}
            className="px-6 py-3.5 rounded-2xl bg-[#F26B1D] hover:bg-[#C9510C] text-white font-extrabold text-xs shadow-md shadow-[#F26B1D]/25 transition-all hover:scale-105 flex items-center gap-2 cursor-pointer"
          >
            <Smartphone className="w-4 h-4" />
            <span>Send Receiving SMS to Volunteer</span>
          </button>

          <button
            onClick={() => setActiveView('volunteer')}
            className="px-5 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-all cursor-pointer"
          >
            Volunteer View
          </button>

          <button
            onClick={() => setActiveView('live-tracking')}
            className="px-6 py-3.5 rounded-2xl bg-[#1D52F2] hover:bg-[#133BB5] text-white font-extrabold text-xs shadow-md shadow-[#1D52F2]/25 transition-all hover:scale-105 cursor-pointer"
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
