import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  MapPin, 
  Truck, 
  Building2, 
  CheckCircle2, 
  Clock, 
  Phone, 
  Sparkles, 
  Navigation, 
  ShieldCheck, 
  MessageSquare,
  Lock,
  Zap,
  AlertCircle
} from 'lucide-react';

export const LiveTrackingPage = () => {
  const { selectedDonation, donations = [], acceptVolunteerRequest, showToast } = useApp();

  const donation = selectedDonation || donations.find(d => d.status !== 'Distributed') || donations[0];

  if (!donation) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="glass-panel p-12 max-w-md mx-auto space-y-4 border border-emerald-500/20 bg-emerald-950/20 rounded-3xl">
          <AlertCircle className="w-12 h-12 text-emerald-400/50 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Rescue Shipments Active</h3>
          <p className="text-xs text-slate-400">There are no food donations in progress. Go to the Donor tab to list food and assign a courier.</p>
        </div>
      </div>
    );
  }

  const isVolunteerAccepted = donation.assignedVolunteer?.isAccepted || 
    (donation.status !== "Pending NGO Acceptance" && 
     donation.status !== "Pending Volunteer Acceptance" && 
     donation.status !== "NGO Accepted");

  const [countdownSeconds, setCountdownSeconds] = useState(840);
  const [gpsProgress, setGpsProgress] = useState(25);

  useEffect(() => {
    if (!isVolunteerAccepted) return;

    const timer = setInterval(() => {
      setCountdownSeconds((prev) => (prev > 0 ? prev - 1 : 0));
      setGpsProgress((prev) => (prev >= 95 ? 25 : prev + 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [isVolunteerAccepted]);

  // Geolocation tracking for active volunteer
  useEffect(() => {
    let watchId;
    // NOTE: Replace with actual current user checks from AppContext
    // Assuming currentUser is available or passed via context in the future.
    // For now, if this is the active volunteer, start watching position:
    if (isVolunteerAccepted && navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          console.log("Volunteer Location Update:", latitude, longitude);
          // TODO: Call updateVolunteerLocation(donation.id, { latitude, longitude }) here
        },
        (error) => {
          console.warn("Geolocation error:", error.message);
        },
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
      );
    }

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [isVolunteerAccepted, donation.id]);

  const formatCountdown = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSimulateVolunteerAccept = () => {
    acceptVolunteerRequest(donation.id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
            <Navigation className="w-3.5 h-3.5" />
            <span>Real-Time Telemetry & Route Map</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">Live GPS Rescue Map Tracker</h1>
          <p className="text-xs text-slate-300">Donation #{donation.id} • {donation.foodName}</p>
        </div>

        {/* ETA Countdown Badge */}
        <div className="glass-panel px-5 py-3 rounded-2xl border border-emerald-500/40 flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${isVolunteerAccepted ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`} />
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Estimated Arrival Countdown</p>
            <p className="text-xl font-extrabold text-emerald-300 font-mono">
              {isVolunteerAccepted ? `${formatCountdown(countdownSeconds)} mins` : 'Waiting for Accept'}
            </p>
          </div>
        </div>
      </div>

      {/* SYNCHRONIZED PIPELINE CHECKMARKS */}
      <div className="glass-panel p-6 rounded-3xl border border-emerald-500/30 space-y-4">
        <p className="text-xs font-extrabold text-slate-300 uppercase tracking-wider">Synchronized Rescue Status Pipeline</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {donation.timeline?.map((st, idx) => (
            <div 
              key={st.step}
              className={`p-2.5 rounded-2xl border text-center transition-all ${
                st.completed 
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-md' 
                  : 'bg-emerald-950/60 border-emerald-500/20 text-slate-500'
              }`}
            >
              <div className="flex items-center justify-center mb-1">
                {st.completed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <span className="w-4 h-4 rounded-full border border-slate-600 text-[10px] flex items-center justify-center font-mono">{idx + 1}</span>
                )}
              </div>
              <p className="text-[10px] font-bold truncate">{st.step}</p>
              <p className="text-[9px] text-slate-400">{st.time}</p>
            </div>
          ))}
        </div>
      </div>

      {/* VOLUNTEER ACCEPTANCE LOCK BANNER (STEP 5 REQUIREMENT) */}
      {!isVolunteerAccepted && (
        <div className="p-6 rounded-3xl glass-panel border border-amber-500/50 bg-gradient-to-r from-amber-950/80 via-emerald-950 to-amber-950/80 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-amber-500/20 text-amber-400">
              <Lock className="w-8 h-8 animate-bounce" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-widest bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30">
                Tracking Locked
              </span>
              <h3 className="text-xl font-extrabold text-white mt-1">Waiting for Volunteer Acceptance</h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Live GPS telemetry map unlocks automatically as soon as courier accepts pickup request.
              </p>
            </div>
          </div>

          <button
            onClick={handleSimulateVolunteerAccept}
            className="px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-extrabold text-xs shadow-xl transition-all hover:scale-105 shrink-0 flex items-center gap-2"
          >
            <Truck className="w-4 h-4" />
            <span>Simulate Volunteer Acceptance</span>
          </button>
        </div>
      )}

      {/* INTERACTIVE VECTOR GPS MAP SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Map Canvas Visual (8 Cols) */}
        <div className="lg:col-span-8 glass-panel p-3 rounded-3xl border border-emerald-500/30 shadow-2xl relative overflow-hidden h-[450px]">
          
          {/* Map Canvas Background */}
          <div className="w-full h-full bg-slate-950 rounded-2xl relative overflow-hidden border border-emerald-500/20 bg-grid-pattern">
            
            {/* Map Ambient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-950/80 via-slate-950 to-emerald-950/60 pointer-events-none"></div>

            {/* SVG Dynamic Route Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
              {/* Pickup Route */}
              <path 
                d="M 120,320 C 250,180 400,280 680,130" 
                fill="none" 
                stroke="#22c55e" 
                strokeWidth="4" 
                strokeDasharray="8 6"
                className={`opacity-80 ${isVolunteerAccepted ? 'animate-pulse' : ''}`}
              />
            </svg>

            {/* Donor Pin */}
            <div className="absolute left-[14%] bottom-[22%] p-3 rounded-2xl glass-panel border border-emerald-500/50 text-center space-y-1 shadow-lg">
              <div className="w-8 h-8 mx-auto rounded-full bg-emerald-500/30 flex items-center justify-center text-emerald-400">
                <MapPin className="w-5 h-5" />
              </div>
              <p className="text-[10px] font-bold text-white">Donor: {donation.donorName ? (donation.donorName.split(' ')[0]) : "Donor"}</p>
              <p className="text-[9px] text-emerald-400">Pickup Location</p>
            </div>

            {/* Volunteer Vehicle Pin (Moving Animation when Accepted) */}
            <div 
              className={`absolute p-3 rounded-2xl glass-card border text-center space-y-1 shadow-2xl z-20 transition-all duration-1000 ${
                isVolunteerAccepted ? 'border-amber-400 bg-emerald-950/90' : 'border-slate-600 bg-slate-900/90 opacity-60'
              }`}
              style={{
                left: isVolunteerAccepted ? `${18 + (gpsProgress * 0.6)}%` : '18%',
                top: isVolunteerAccepted ? `${55 - (gpsProgress * 0.4)}%` : '55%'
              }}
            >
              <div className={`w-10 h-10 mx-auto rounded-full text-amber-950 flex items-center justify-center font-bold shadow-lg ${
                isVolunteerAccepted ? 'bg-amber-400 animate-bounce' : 'bg-slate-600'
              }`}>
                <Truck className="w-5 h-5" />
              </div>
              <div className="px-2 py-0.5 rounded bg-amber-500 text-emerald-950 text-[9px] font-extrabold uppercase">
                Courier: {donation.assignedVolunteer?.name ? (donation.assignedVolunteer.name.split(' ')[0]) : "Alex R."}
              </div>
            </div>

            {/* NGO Pin */}
            <div className="absolute right-[10%] top-[18%] p-3 rounded-2xl glass-panel border border-blue-500/50 text-center space-y-1 shadow-lg">
              <div className="w-8 h-8 mx-auto rounded-full bg-blue-500/30 flex items-center justify-center text-blue-400">
                <Building2 className="w-5 h-5" />
              </div>
              <p className="text-[10px] font-bold text-white">NGO: {donation.recommendedNgo?.name ? (donation.recommendedNgo.name.split(' ')[0]) : "NGO"}</p>
              <p className="text-[9px] text-blue-300">Destination</p>
            </div>

            {/* Map Overlay Specs */}
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center px-4 py-2 rounded-xl glass-panel border border-emerald-500/30 text-white text-[11px] font-medium backdrop-blur-md">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isVolunteerAccepted ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`} />
                <span>Status: <strong>{isVolunteerAccepted ? "Volunteer On The Way (Live Tracking Active)" : "Pending Acceptance"}</strong></span>
              </div>
              <span>Distance: <strong>1.2 km Corridor</strong></span>
            </div>

          </div>

        </div>

        {/* Courier & Route Details (4 Cols) */}
        <div className="lg:col-span-4 glass-panel p-6 rounded-3xl border border-emerald-500/30 shadow-2xl space-y-6">
          
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Truck className="w-5 h-5 text-amber-400" />
            <span>Telemetry Controls</span>
          </h2>

          <div className="flex items-center gap-4 p-4 rounded-2xl glass-card border border-amber-500/20">
            <img 
              src={donation.assignedVolunteer?.photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"} 
              alt={donation.assignedVolunteer?.name || "Awaiting Assignment"}
              className="w-14 h-14 object-cover rounded-full border-2 border-amber-400 shadow-md"
            />
            <div>
              <h3 className="text-base font-extrabold text-white">{donation.assignedVolunteer?.name || "No Courier Assigned"}</h3>
              <p className="text-xs text-amber-300 font-semibold">{donation.assignedVolunteer?.vehicle || "Awaiting Courier Handoff"}</p>
              {donation.assignedVolunteer ? (
                <p className="text-[11px] text-slate-400">★ {donation.assignedVolunteer.rating || 5.0} Rating • {donation.assignedVolunteer.completedPickups || 0} Pickups</p>
              ) : (
                <p className="text-[11px] text-slate-400 font-medium text-emerald-400">Dispatch standby notification sent</p>
              )}
            </div>
          </div>

          <div className="space-y-3 text-xs text-slate-300">
            <div className="flex justify-between p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/20">
              <span className="text-slate-400">Pickup Address:</span>
              <span className="font-semibold text-white truncate max-w-[180px]">{donation.pickupAddress}</span>
            </div>

            <div className="flex justify-between p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/20">
              <span className="text-slate-400">Destination NGO:</span>
              <span className="font-semibold text-emerald-300 truncate max-w-[180px]">{donation.recommendedNgo?.name || "No Shelter Assigned"}</span>
            </div>
          </div>

          <div className="space-y-2">
            <button 
              onClick={() => {
                if (donation.assignedVolunteer) {
                  showToast(`Calling Volunteer ${donation.assignedVolunteer.name} (${donation.assignedVolunteer.phone})...`, "info");
                } else {
                  showToast("No volunteer assigned to this rescue order yet.", "warning");
                }
              }}
              disabled={!donation.assignedVolunteer}
              className={`w-full py-3.5 rounded-2xl font-extrabold text-xs shadow-lg transition-all flex items-center justify-center gap-2 ${donation.assignedVolunteer ? 'bg-emerald-500 hover:bg-emerald-400 text-emerald-950 cursor-pointer' : 'bg-emerald-900/20 border border-emerald-500/20 text-slate-500 cursor-not-allowed'}`}
            >
              <Phone className="w-4 h-4" />
              <span>Call Courier Direct</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
