import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  MapPin, 
  Truck, 
  Building2, 
  CheckCircle2, 
  Phone, 
  Navigation, 
  Lock,
  AlertCircle,
  QrCode,
  Camera,
  Sparkles,
  ShieldCheck,
  Check,
  ChevronRight
} from 'lucide-react';
import { QRModal } from './QRModal';
import { QRScannerModal } from './QRScannerModal';

export const LiveTrackingPage = () => {
  const { 
    selectedDonation, 
    setSelectedDonation,
    donations = [], 
    acceptVolunteerRequest, 
    markVolunteerReached,
    markDistributionComplete,
    showToast 
  } = useApp();

  // Pick active donation reactively from donations array
  const activeDonationId = selectedDonation?.id || (donations.length > 0 ? donations[0].id : null);
  const donation = donations.find(d => d.id === activeDonationId) || selectedDonation || donations[0];

  // Modals state
  const [scannerModal, setScannerModal] = useState({ open: false, type: 'pickup' });
  const [qrModal, setQrModal] = useState({ open: false, type: 'pickup' });

  // Status determinations
  const status = donation?.status || '';

  const isDelivered = [
    'Delivered', 
    'Delivered to NGO', 
    'NGO Confirmed', 
    'Distributed'
  ].includes(status);

  const isOutForDelivery = !isDelivered && (
    status === 'Food Picked Up' || 
    status === 'Travelling to NGO' || 
    status === 'Food In Transit' || 
    status.includes('Picked Up') || 
    status.includes('Travelling to NGO')
  );

  const isAtPickup = !isDelivered && !isOutForDelivery && (
    status === 'Volunteer Reached Pickup' || 
    status.includes('Reached Pickup')
  );

  const isVolunteerAccepted = donation
    ? (donation.assignedVolunteer?.isAccepted || 
       donation.acceptedVolunteer ||
       (donation.status !== "Pending NGO Acceptance" && 
        donation.status !== "Pending Volunteer Acceptance" && 
        donation.status !== "NGO Accepted"))
    : false;

  const isVolunteerTravellingToPickup = !isDelivered && !isOutForDelivery && !isAtPickup && (
    status === 'Volunteer Travelling' || 
    status === 'Volunteer Accepted' || 
    status === 'NGO Accepted • Awaiting Volunteer Courier' ||
    status.includes('Travelling') ||
    isVolunteerAccepted
  );

  // Live Telemetry States
  const [transitCountdown, setTransitCountdown] = useState(510); // ~8.5 mins transit
  const [pickupCountdown, setPickupCountdown] = useState(210);  // ~3.5 mins to donor
  const [deliveryProgress, setDeliveryProgress] = useState(35); // percentage along route (0-100)

  useEffect(() => {
    if (!donation) return;

    // Timer logic based on current stage
    const timer = setInterval(() => {
      if (isOutForDelivery) {
        // En route from Donor to NGO
        setTransitCountdown((prev) => (prev > 15 ? prev - 1 : 15));
        setDeliveryProgress((prev) => (prev >= 88 ? 30 : prev + 1.2));
      } else if (isVolunteerTravellingToPickup) {
        // En route from Depot to Donor
        setPickupCountdown((prev) => (prev > 10 ? prev - 1 : 10));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [donation, isOutForDelivery, isVolunteerTravellingToPickup]);

  if (!donation) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="bg-white p-12 max-w-md mx-auto space-y-4 border border-slate-200 rounded-3xl shadow-sm">
          <AlertCircle className="w-12 h-12 text-[#1D52F2]/40 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900">No Rescue Shipments Active</h3>
          <p className="text-xs text-slate-500">There are no food donations in progress. Go to the Donor tab to list food and assign a courier.</p>
        </div>
      </div>
    );
  }

  const formatCountdown = (secs) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };



  const volName = donation.acceptedVolunteer?.name || donation.assignedVolunteer?.name || "Volunteer Courier";
  const ngoName = donation.acceptedNgo?.name || donation.recommendedNgo?.name || "NGO Shelter";
  const donorName = donation.donorName || "Registered Donor";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Multi-Donation Selector (If multiple active rescues exist) */}
      {donations.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <span className="text-xs font-bold text-slate-400 shrink-0 uppercase tracking-wider">
            Track Rescue:
          </span>
          {donations.map((d) => {
            const isSelected = d.id === donation.id;
            const isDone = ['Delivered', 'Delivered to NGO', 'NGO Confirmed', 'Distributed'].includes(d.status);
            const isTransit = d.status === 'Food Picked Up' || d.status === 'Travelling to NGO';
            return (
              <button
                key={d.id}
                onClick={() => setSelectedDonation(d)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer border ${
                  isSelected 
                    ? 'bg-[#1D52F2] text-white border-[#1D52F2] shadow-md shadow-[#1D52F2]/20' 
                    : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${isDone ? 'bg-[#63A644]' : isTransit ? 'bg-[#F26B1D] animate-pulse' : 'bg-[#1D52F2]'}`} />
                <span>{d.id} • {d.foodName?.toLowerCase() === 'dhruv' ? 'Surplus Meal' : d.foodName}</span>
                {isDone && <Check className="w-3 h-3 text-white" />}
              </button>
            );
          })}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EBF1FE] text-[#1D52F2] text-xs font-bold border border-[#1D52F2]/30">
            <Navigation className="w-3.5 h-3.5" />
            <span>Real-Time Telemetry & Route Map</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 mt-1">Live GPS Rescue Map Tracker</h1>
          <p className="text-xs text-slate-500">
            Donation #{donation.id} • {donation.foodName?.toLowerCase() === 'dhruv' ? 'Prepared Catered Meals' : donation.foodName}
          </p>
        </div>

        {/* Dynamic ETA Countdown Badge */}
        <div className={`px-5 py-3 rounded-2xl border shadow-sm flex items-center gap-3 transition-all ${
          isDelivered 
            ? 'bg-[#F0F8EC] border-[#63A644]/40 text-[#63A644]' 
            : isOutForDelivery 
            ? 'bg-[#FEF3EB] border-[#F26B1D]/40 text-[#F26B1D]'
            : 'bg-white border-slate-200'
        }`}>
          <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${
            isDelivered 
              ? 'bg-[#63A644] text-white' 
              : isOutForDelivery 
              ? 'bg-[#F26B1D] animate-ping' 
              : isVolunteerAccepted 
              ? 'bg-[#1D52F2] animate-pulse' 
              : 'bg-slate-400'
          }`}>
            {isDelivered && <Check className="w-2.5 h-2.5" />}
          </div>

          <div>
            <p className="text-[10px] uppercase font-black tracking-wider text-slate-500">
              {isDelivered 
                ? 'Delivery Completed' 
                : isOutForDelivery 
                ? 'Estimated Arrival at NGO' 
                : isAtPickup 
                ? 'At Donor Pickup' 
                : isVolunteerAccepted 
                ? 'Estimated Arrival at Donor' 
                : 'Standby Status'}
            </p>
            <p className={`text-xl font-black font-mono ${
              isDelivered 
                ? 'text-[#63A644]' 
                : isOutForDelivery 
                ? 'text-[#F26B1D]' 
                : isVolunteerAccepted 
                ? 'text-[#1D52F2]' 
                : 'text-slate-500'
            }`}>
              {isDelivered 
                ? '00:00 • Arrived & Delivered' 
                : isOutForDelivery 
                ? `${formatCountdown(transitCountdown)} mins` 
                : isAtPickup 
                ? 'Scanning Donor QR' 
                : isVolunteerAccepted 
                ? `${formatCountdown(pickupCountdown)} mins` 
                : 'Waiting for Accept'}
            </p>
          </div>
        </div>
      </div>

      {/* MILESTONE BANNER 1: DELIVERY COMPLETED CELEBRATION */}
      {isDelivered && (
        <div className="p-5 sm:p-6 rounded-3xl bg-[#F0F8EC] border border-[#63A644]/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm animate-in fade-in">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#63A644] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#63A644]/30">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-[#63A644] text-white px-2 py-0.5 rounded-full">
                  Delivery Handover Verified
                </span>
                <span className="text-xs text-slate-500 font-semibold">NGO QR Scanned Successfully</span>
              </div>
              <h3 className="text-lg font-black text-slate-900 mt-1">
                Food Safely Delivered to {ngoName}! 🎉
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Volunteer courier <strong>{volName}</strong> completed the delivery handover. Respective donor <strong>{donorName}</strong> received automated SMS & App confirmation.
              </p>
            </div>
          </div>

        </div>
      )}

      {/* MILESTONE BANNER 2: FOOD PICKED UP & OUT FOR DELIVERY */}
      {isOutForDelivery && (
        <div className="p-5 sm:p-6 rounded-3xl bg-[#FEF3EB] border border-[#F26B1D]/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm animate-in fade-in">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#F26B1D] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#F26B1D]/30 animate-bounce">
              <Truck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-[#F26B1D] text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  Out for Delivery
                </span>
                <span className="text-xs text-[#F26B1D] font-bold">Donor QR Verified</span>
              </div>
              <h3 className="text-lg font-black text-slate-900 mt-1">
                Courier is En Route to {ngoName}
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Volunteer <strong>{volName}</strong> scanned donor's QR code, picked up <strong>{donation.foodName}</strong>, and is now actively carrying the meals to the shelter.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setScannerModal({ open: true, type: 'delivery' })}
              className="px-5 py-3 rounded-2xl bg-[#63A644] hover:bg-[#4B8233] text-white font-black text-xs shadow-md shadow-[#63A644]/25 transition-all hover:scale-[1.02] shrink-0 flex items-center gap-2 cursor-pointer"
              title="Scan NGO Delivery QR Pass upon arrival at shelter"
            >
              <Camera className="w-4 h-4" />
              <span>Scan NGO Delivery QR</span>
            </button>

            <button
              onClick={() => setQrModal({ open: true, type: 'delivery' })}
              className="px-3.5 py-3 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs shadow-xs transition-all shrink-0 flex items-center gap-1.5 cursor-pointer"
              title="View NGO Shelter Delivery QR Pass"
            >
              <QrCode className="w-4 h-4 text-[#63A644]" />
              <span>Show NGO QR</span>
            </button>
          </div>
        </div>
      )}

      {/* SYNCHRONIZED PIPELINE CHECKMARKS */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#1D52F2]" />
            <span>Synchronized Rescue Status Pipeline</span>
          </p>
          <span className="text-[11px] text-slate-500 font-medium">
            Stage: <strong className="text-slate-800">{donation.status}</strong>
          </span>
        </div>

        {(() => {
          const pipelineStepsConfig = [
            { step: "Donation Created", defaultTime: donation?.createdAt ? new Date(donation.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : (donation?.time || "10:30 AM") },
            { step: "NGO Accepted", defaultTime: donation?.acceptedNgo?.acceptedAt || "10:35 AM" },
            { step: "Volunteer Accepted", defaultTime: donation?.acceptedVolunteer?.acceptedAt || "10:40 AM" },
            { step: "Volunteer Travelling", defaultTime: "In Transit" },
            { step: "Volunteer Reached Pickup", defaultTime: "Reached" },
            { step: "Food Picked Up", defaultTime: "Picked Up" },
            { step: "Travelling to NGO", defaultTime: "In Transit" },
            { step: "Delivered", defaultTime: "Delivered" },
            { step: "NGO Confirmed", defaultTime: "Confirmed" },
            { step: "Distributed", defaultTime: "Distributed" }
          ];

          const checkStepDone = (idx, existingCompleted) => {
            if (existingCompleted) return true;
            switch (idx) {
              case 0:
                return true; // Step 1: Donation Created
              case 1:
                // Step 2: NGO Accepted
                return Boolean(
                  donation?.acceptedNgo || 
                  status.includes("NGO Accepted") || 
                  status === "Volunteer Travelling" || 
                  isVolunteerTravellingToPickup || 
                  isAtPickup || 
                  isOutForDelivery || 
                  isDelivered
                );
              case 2:
                // Step 3: Volunteer Accepted
                return Boolean(
                  donation?.acceptedVolunteer || 
                  donation?.assignedVolunteer?.isAccepted || 
                  status.includes("Volunteer Accepted") || 
                  status === "Volunteer Travelling" || 
                  isVolunteerTravellingToPickup || 
                  isAtPickup || 
                  isOutForDelivery || 
                  isDelivered
                );
              case 3:
                // Step 4: Volunteer Travelling
                return Boolean(
                  status === "Volunteer Travelling" || 
                  isAtPickup || 
                  isOutForDelivery || 
                  isDelivered
                );
              case 4:
                // Step 5: Volunteer Reached Pickup
                return Boolean(
                  status === "Volunteer Reached Pickup" || 
                  status.includes("Reached Pickup") || 
                  isAtPickup ||
                  isOutForDelivery || 
                  isDelivered
                );
              case 5:
                // Step 6: Food Picked Up
                return Boolean(
                  status === "Food Picked Up" || 
                  status.includes("Picked Up") || 
                  isOutForDelivery || 
                  isDelivered
                );
              case 6:
                // Step 7: Travelling to NGO
                return Boolean(
                  status === "Travelling to NGO" || 
                  status.includes("Travelling to NGO") || 
                  isDelivered
                );
              case 7:
                // Step 8: Delivered
                return Boolean(isDelivered);
              case 8:
                // Step 9: NGO Confirmed
                return Boolean(status === "NGO Confirmed" || status === "Distributed");
              case 9:
                // Step 10: Distributed
                return Boolean(status === "Distributed");
              default:
                return false;
            }
          };

          const timelineSteps = pipelineStepsConfig.map((stepMeta, idx) => {
            const existing = donation?.timeline?.find(t => t.step === stepMeta.step) || donation?.timeline?.[idx];
            const isCompleted = checkStepDone(idx, existing?.completed);
            const timeDisplay = (existing?.time && existing.time !== "Pending")
              ? existing.time
              : (isCompleted ? stepMeta.defaultTime : "Pending");

            return {
              step: stepMeta.step,
              completed: isCompleted,
              time: timeDisplay
            };
          });

          return (
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-10 gap-2">
              {timelineSteps.map((st, idx) => (
                <div 
                  key={st.step}
                  className={`p-2.5 rounded-2xl border text-center transition-all ${
                    st.completed 
                      ? 'bg-[#F0F8EC] border-[#63A644]/40 text-[#63A644] shadow-xs' 
                      : 'bg-[#F8FAFC] border-slate-200 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-center mb-1">
                    {st.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-[#63A644]" />
                    ) : (
                      <span className="w-4 h-4 rounded-full border border-slate-300 text-[10px] flex items-center justify-center font-mono">{idx + 1}</span>
                    )}
                  </div>
                  <p className="text-[10px] font-bold truncate" title={st.step}>{st.step}</p>
                  <p className="text-[9px] text-slate-500 truncate">{st.time}</p>
                </div>
              ))}
            </div>
          );
        })()}
      </div>

      {/* VOLUNTEER ACCEPTANCE LOCK BANNER (If not accepted yet) */}
      {!isVolunteerAccepted && (
        <div className="p-6 rounded-3xl bg-[#FEF3EB] border border-[#F26B1D]/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-white text-[#F26B1D] shadow-xs">
              <Lock className="w-8 h-8 animate-bounce" />
            </div>
            <div>
              <span className="text-[10px] font-black text-[#F26B1D] uppercase tracking-widest bg-white px-2 py-0.5 rounded border border-[#F26B1D]/20">
                Tracking Locked
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-1">Waiting for Volunteer Acceptance</h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Live GPS telemetry map unlocks automatically as soon as courier accepts pickup request.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* INTERACTIVE VECTOR GPS MAP SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Map Canvas Visual (8 Cols) */}
        <div className="lg:col-span-8 bg-white p-3 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden h-[460px]">
          
          {/* Map Canvas Background */}
          <div className="w-full h-full bg-slate-900 rounded-2xl relative overflow-hidden border border-slate-800 bg-grid-pattern">
            
            {/* SVG Dynamic Route Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
              {/* Corridor: Donor to NGO */}
              <path 
                d="M 120,320 C 250,180 400,280 680,130" 
                fill="none" 
                stroke={isDelivered ? '#63A644' : isOutForDelivery ? '#F26B1D' : '#1D52F2'} 
                strokeWidth={isDelivered ? "5" : "4"} 
                strokeDasharray={isDelivered ? "none" : "8 6"}
                className={`transition-all duration-700 ${
                  isOutForDelivery ? 'animate-pulse opacity-95' : isDelivered ? 'opacity-90' : 'opacity-40'
                }`}
              />

              {/* Corridor Completed Checkpoint (If Delivered) */}
              {isDelivered && (
                <circle cx="680" cy="130" r="18" fill="#63A644" opacity="0.3" className="animate-ping" />
              )}
            </svg>

            {/* Donor Pickup Pin (Left bottom: 14%, 66%) */}
            <div className={`absolute left-[14%] bottom-[20%] p-3 rounded-2xl backdrop-blur-md border text-center space-y-1 shadow-lg z-10 transition-all ${
              isOutForDelivery || isDelivered 
                ? 'bg-white/95 border-[#63A644]/50' 
                : 'bg-white/95 border-[#1D52F2]/50 ring-2 ring-[#1D52F2]/20'
            }`}>
              <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${
                isOutForDelivery || isDelivered 
                  ? 'bg-[#F0F8EC] text-[#63A644]' 
                  : 'bg-[#EBF1FE] text-[#1D52F2]'
              }`}>
                {isOutForDelivery || isDelivered ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <MapPin className="w-5 h-5" />
                )}
              </div>
              <p className="text-[10px] font-bold text-slate-900 truncate max-w-[110px]">
                Donor: {donorName.split(' ')[0]}
              </p>
              <p className={`text-[9px] font-extrabold ${
                isOutForDelivery || isDelivered ? 'text-[#63A644]' : 'text-[#1D52F2]'
              }`}>
                {isOutForDelivery || isDelivered ? '✓ Food Picked Up' : 'Pickup Location'}
              </p>
            </div>

            {/* DYNAMIC COURIER VEHICLE MARKER */}
            {(() => {
              // Calculate vehicle coordinates dynamically based on stage
              let vehicleLeft = '14%';
              let vehicleTop = '66%';
              let isMoving = false;

              if (isDelivered) {
                // Parked at NGO Destination
                vehicleLeft = '80%';
                vehicleTop = '18%';
              } else if (isOutForDelivery) {
                // Moving between Donor (14%, 66%) and NGO (80%, 18%)
                const progressRatio = deliveryProgress / 100;
                vehicleLeft = `${14 + (progressRatio * 66)}%`;
                vehicleTop = `${66 - (progressRatio * 48)}%`;
                isMoving = true;
              } else if (isAtPickup) {
                // At Donor pickup
                vehicleLeft = '16%';
                vehicleTop = '60%';
              } else if (isVolunteerTravellingToPickup) {
                // Heading to donor
                vehicleLeft = '10%';
                vehicleTop = '70%';
                isMoving = true;
              } else {
                // At Depot standby
                vehicleLeft = '8%';
                vehicleTop = '74%';
              }

              return (
                <div 
                  className={`absolute p-2.5 rounded-2xl backdrop-blur-md border text-center space-y-1 shadow-2xl z-20 transition-all duration-700 ${
                    isDelivered
                      ? 'border-[#63A644] bg-white ring-4 ring-[#63A644]/20'
                      : isOutForDelivery
                      ? 'border-[#F26B1D] bg-white ring-4 ring-[#F26B1D]/20'
                      : isVolunteerAccepted
                      ? 'border-[#1D52F2] bg-white ring-2 ring-[#1D52F2]/20'
                      : 'border-slate-600 bg-slate-800 opacity-60'
                  }`}
                  style={{ left: vehicleLeft, top: vehicleTop }}
                >
                  <div className={`w-10 h-10 mx-auto rounded-full text-white flex items-center justify-center font-bold shadow-lg ${
                    isDelivered
                      ? 'bg-[#63A644]'
                      : isOutForDelivery
                      ? 'bg-[#F26B1D] animate-bounce'
                      : isVolunteerAccepted
                      ? 'bg-[#1D52F2] animate-pulse'
                      : 'bg-slate-600'
                  }`}>
                    {isDelivered ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <Truck className="w-5 h-5" />
                    )}
                  </div>

                  <div className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                    isDelivered 
                      ? 'bg-[#F0F8EC] text-[#63A644]' 
                      : isOutForDelivery 
                      ? 'bg-[#FEF3EB] text-[#F26B1D]' 
                      : 'bg-[#EBF1FE] text-[#1D52F2]'
                  }`}>
                    {isDelivered 
                      ? '✓ Delivered' 
                      : isOutForDelivery 
                      ? '🚚 In Transit' 
                      : isAtPickup 
                      ? '📍 At Pickup' 
                      : `Courier: ${volName.split(' ')[0]}`}
                  </div>
                </div>
              );
            })()}

            {/* NGO Shelter Pin (Right top: 80%, 18%) */}
            <div className={`absolute right-[8%] top-[16%] p-3 rounded-2xl backdrop-blur-md border text-center space-y-1 shadow-lg z-10 transition-all ${
              isDelivered 
                ? 'bg-white/95 border-[#63A644] ring-4 ring-[#63A644]/30' 
                : 'bg-white/95 border-[#63A644]/40'
            }`}>
              <div className="w-8 h-8 mx-auto rounded-full bg-[#F0F8EC] flex items-center justify-center text-[#63A644]">
                <Building2 className="w-5 h-5" />
              </div>
              <p className="text-[10px] font-bold text-slate-900 truncate max-w-[110px]">
                NGO: {ngoName.split(' ')[0]}
              </p>
              <p className="text-[9px] text-[#63A644] font-extrabold">
                {isDelivered ? '✓ Safe Handover' : 'Shelter Destination'}
              </p>
            </div>

            {/* Map Overlay Specs (Bottom Info Bar) */}
            <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-[11px] font-medium backdrop-blur-md">
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${
                  isDelivered 
                    ? 'bg-[#63A644]' 
                    : isOutForDelivery 
                    ? 'bg-[#F26B1D] animate-ping' 
                    : isVolunteerAccepted 
                    ? 'bg-[#1D52F2] animate-pulse' 
                    : 'bg-slate-400'
                }`} />
                <span>
                  Status:{' '}
                  <strong>
                    {isDelivered 
                      ? `Delivery Completed • Food Safely Handed Over to ${ngoName} (Verified via NGO QR)`
                      : isOutForDelivery 
                      ? `Food Picked Up • Courier Out for Delivery to ${ngoName} (Live GPS Telemetry Active)`
                      : isAtPickup 
                      ? `Courier at Donor Pickup • Awaiting Donor QR Pass Scan`
                      : isVolunteerAccepted 
                      ? `Volunteer En Route to Donor Pickup Location`
                      : 'Pending Courier Acceptance'}
                  </strong>
                </span>
              </div>

              <div className="text-slate-300">
                {isDelivered ? (
                  <span className="text-[#63A644] font-bold">0.0 km • Destination Reached</span>
                ) : isOutForDelivery ? (
                  <span className="text-[#F26B1D] font-bold">0.6 km Corridor • Fast Transit</span>
                ) : (
                  <span>1.2 km Corridor Total</span>
                )}
              </div>
            </div>

          </div>

        </div>

        {/* Courier & Telemetry Controls (4 Cols) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <Truck className="w-5 h-5 text-[#F26B1D]" />
            <span>Telemetry & QR Controls</span>
          </h2>

          {/* Courier Card */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200">
            <img 
              src={donation.assignedVolunteer?.photo || donation.acceptedVolunteer?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"} 
              alt={volName}
              className="w-14 h-14 object-cover rounded-full border-2 border-[#F26B1D] shadow-xs"
            />
            <div>
              <h3 className="text-base font-black text-slate-900">{volName}</h3>
              <p className="text-xs text-[#F26B1D] font-bold">{donation.assignedVolunteer?.vehicle || "Eco EV Scooter (Zero Emission)"}</p>
              <p className="text-[11px] text-slate-500">★ 5.0 Rating • Verified Eco Courier</p>
            </div>
          </div>

          {/* Pickup & Destination Details */}
          <div className="space-y-3 text-xs text-slate-600">
            <div className="flex justify-between p-3 rounded-xl bg-[#F8FAFC] border border-slate-200">
              <span className="text-slate-500">Pickup Donor:</span>
              <span className="font-bold text-slate-900 truncate max-w-[180px]">{donorName} ({donation.pickupAddress})</span>
            </div>

            <div className="flex justify-between p-3 rounded-xl bg-[#F8FAFC] border border-slate-200">
              <span className="text-slate-500">Destination NGO:</span>
              <span className="font-bold text-[#1D52F2] truncate max-w-[180px]">{ngoName}</span>
            </div>
          </div>

          {/* REAL-TIME WORKFLOW ACTIONS & QR SCAN SHORTCUTS */}
          <div className="space-y-2.5 pt-2 border-t border-slate-100">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Rescue Verification Controls
            </p>

            {/* STAGE 1: BEFORE PICKUP (Scan Donor QR Pass) */}
            {!isOutForDelivery && !isDelivered && (
              <div className="space-y-2">
                <button
                  onClick={() => setScannerModal({ open: true, type: 'pickup' })}
                  className="w-full py-3.5 rounded-2xl bg-[#1D52F2] hover:bg-[#133BB5] text-white font-extrabold text-xs shadow-md shadow-[#1D52F2]/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  title="Volunteer scans donor's QR code upon arrival at pickup"
                >
                  <Camera className="w-4 h-4" />
                  <span>Scan Donor Pickup QR (Pick Up Food)</span>
                </button>

                <button
                  onClick={() => setQrModal({ open: true, type: 'pickup' })}
                  className="w-full py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <QrCode className="w-3.5 h-3.5 text-[#1D52F2]" />
                  <span>Show Donor's Pickup QR Pass</span>
                </button>
              </div>
            )}

            {/* STAGE 2: OUT FOR DELIVERY (Scan NGO QR Pass to complete) */}
            {isOutForDelivery && (
              <div className="space-y-2">
                <button
                  onClick={() => setScannerModal({ open: true, type: 'delivery' })}
                  className="w-full py-3.5 rounded-2xl bg-[#63A644] hover:bg-[#4B8233] text-white font-black text-xs shadow-md shadow-[#63A644]/25 transition-all flex items-center justify-center gap-2 cursor-pointer animate-pulse"
                  title="Volunteer scans NGO's QR code upon arrival at shelter"
                >
                  <Camera className="w-4 h-4" />
                  <span>Scan NGO Delivery QR (Complete Delivery)</span>
                </button>

                <button
                  onClick={() => setQrModal({ open: true, type: 'delivery' })}
                  className="w-full py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <QrCode className="w-3.5 h-3.5 text-[#63A644]" />
                  <span>Show NGO Shelter Delivery QR Pass</span>
                </button>
              </div>
            )}

            {/* STAGE 3: DELIVERED (Confirm distribution) */}
            {isDelivered && (
              <div className="p-3.5 rounded-2xl bg-[#F0F8EC] border border-[#63A644]/40 text-center space-y-2">
                <div className="flex items-center justify-center gap-1.5 text-[#63A644] font-black text-xs">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Delivery Completed & Verified via QR</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Food arrived safely at {ngoName}. Zero food wasted.
                </p>
              </div>
            )}

            {/* Direct Phone Call Button */}
            <button 
              onClick={() => {
                if (donation.assignedVolunteer || donation.acceptedVolunteer) {
                  showToast(`Calling Volunteer ${volName} (${donation.assignedVolunteer?.phone || '+1 (555) 019-2831'})...`, "info");
                } else {
                  showToast("No volunteer assigned to this rescue order yet.", "warning");
                }
              }}
              className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer mt-1"
            >
              <Phone className="w-4 h-4 text-[#F26B1D]" />
              <span>Call Courier Direct</span>
            </button>
          </div>

        </div>

      </div>

      {/* QR Optical Camera Scanner Modal */}
      <QRScannerModal 
        isOpen={scannerModal.open}
        onClose={() => setScannerModal({ open: false, type: 'pickup' })}
        donation={donation}
        scanType={scannerModal.type}
      />

      {/* QR Code Pass Modal */}
      <QRModal
        isOpen={qrModal.open}
        onClose={() => setQrModal({ open: false, type: 'pickup' })}
        donation={donation}
        type={qrModal.type}
      />

    </div>
  );
};
