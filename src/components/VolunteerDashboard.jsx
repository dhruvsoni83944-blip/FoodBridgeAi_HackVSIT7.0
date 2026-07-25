import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { QRScannerModal } from './QRScannerModal';
import { 
  Truck, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Navigation, 
  Phone, 
  Building2, 
  Package, 
  Award,
  Zap,
  Camera,
  XCircle,
  QrCode,
  UserCheck,
  ShieldCheck,
  Sparkles,
  ChevronDown,
  Users
} from 'lucide-react';

export const VolunteerDashboard = () => {
  const { 
    donations = [], 
    acceptVolunteerRequest, 
    markVolunteerReached, 
    setSelectedDonation, 
    setActiveView, 
    currentUser, 
    showToast,
    addVolunteer,
    registeredNGOs = [],
    registeredVolunteers = [],
    currentRole
  } = useApp();

  const [activeScanItem, setActiveScanItem] = useState(null);
  const [showRegForm, setShowRegForm] = useState(false);

  const loggedInVol = registeredVolunteers.find(v => v.name === currentUser?.name || v.id === currentUser?.id);
  const isRegistered = !!loggedInVol;

  if (currentRole !== 'volunteer') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Volunteers Fleet Directory Banner */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-amber-950/10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
              <Truck className="w-3.5 h-3.5" />
              <span>Volunteer Fleet Directory</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white">Active Rescue Couriers</h1>
            <p className="text-slate-300 text-xs sm:text-sm">
              List of all verified volunteer couriers registered on standby to transport food packages in their respective operating zones.
            </p>
          </div>
          
          <div className="px-4 py-3 rounded-2xl glass-card text-center border border-amber-500/20 bg-amber-950/20">
            <p className="text-xs text-slate-400 font-semibold">Active Couriers</p>
            <p className="text-xl font-extrabold text-amber-400 flex items-center justify-center gap-1">
              <Users className="w-4 h-4" /> {registeredVolunteers.length}
            </p>
          </div>
        </div>

        {/* Directory List */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Truck className="w-5 h-5 text-amber-400" />
            <span>On-Call Standby Couriers</span>
          </h2>

          {registeredVolunteers && registeredVolunteers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {registeredVolunteers.map(vol => (
                <div key={vol.id} className="glass-card p-6 rounded-3xl border border-amber-500/30 space-y-4">
                  <div className="flex items-center gap-3">
                    <img 
                      src={vol.photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"} 
                      alt={vol.name}
                      className="w-14 h-14 rounded-full border border-amber-400 object-cover"
                    />
                    <div>
                      <h3 className="text-base font-extrabold text-white">{vol.name}</h3>
                      <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        {vol.status || 'Active on Standby'}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-slate-300 bg-emerald-950/60 p-4 rounded-2xl border border-emerald-500/20 space-y-2">
                    <p className="flex justify-between">
                      <span className="text-slate-400">Vehicle:</span>
                      <span className="font-semibold text-white">{vol.vehicle}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-slate-400">Operating Zone:</span>
                      <span className="font-semibold text-amber-300">{vol.operatingZone}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-slate-400">Availability:</span>
                      <span className="font-semibold text-white">{vol.availability}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-slate-400">Contact:</span>
                      <span className="font-semibold text-slate-300 font-mono">{vol.phone}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 glass-panel rounded-3xl border border-amber-500/20 max-w-md mx-auto bg-amber-950/5">
              <Users className="w-12 h-12 text-amber-400/50 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white">No Volunteers Registered Yet</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-[280px] mx-auto">Users can list themselves as volunteers for delivery work using their Volunteer dashboards.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Volunteer Registration Form State
  const [volData, setVolData] = useState({
    name: currentUser?.name || '',
    phone: currentUser?.phone || '',
    vehicle: 'Eco EV Scooter (Zero Emission)',
    operatingZone: '',
    availability: '24/7 On-Call Standby'
  });

  const vehicles = [
    'Eco EV Scooter (Zero Emission)',
    'Electric Delivery Van',
    'Bicycle / E-Bike',
    'Car / SUV (Bulk Meals Transport)'
  ];

  const availabilitySlots = [
    '24/7 On-Call Standby',
    'Morning Shift (8 AM - 2 PM)',
    'Afternoon Shift (2 PM - 8 PM)',
    'Night Shift (8 PM - 2 AM)'
  ];

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (addVolunteer) {
      addVolunteer(volData);
    }
    setShowRegForm(false);
    showToast(`Volunteer Registration Successful! Active on standby for ${volData.operatingZone}.`, 'success');
  };

  const handleAccept = (item) => {
    if (acceptVolunteerRequest) acceptVolunteerRequest(item.id);
    if (setSelectedDonation) setSelectedDonation(item);
    showToast(`Accepted pickup request for ${item.foodName}! Donor & NGO notified.`);
  };

  const handleReject = (item) => {
    showToast(`Declined request ${item.id}. Re-routing to next available volunteer.`, 'info');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Volunteer Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-emerald-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
            <Truck className="w-3.5 h-3.5" />
            <span>Volunteer Courier Hub • {isRegistered ? loggedInVol.name : (currentUser?.name || 'Guest Volunteer')}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white">Surplus Food Rescue & Logistics</h1>
          <p className="text-slate-300 text-xs sm:text-sm">
            Register for food pickup & drop tasks in your local area. Accept incoming dispatch requests and navigate routes.
          </p>
        </div>

        {/* Hero Actions & Badges */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowRegForm(!showRegForm)}
            className="px-4 py-3 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-extrabold text-xs border border-amber-500/40 transition-all flex items-center gap-2 shadow-md"
          >
            <UserCheck className="w-4 h-4 text-amber-400" />
            <span>{showRegForm ? 'Close Registration Form' : isRegistered ? 'Update Volunteer Area Profile' : 'List Yourself as Volunteer'}</span>
          </button>

          <div className="px-4 py-3 rounded-2xl glass-card text-center border border-emerald-500/20">
            <p className="text-xs text-slate-400 font-semibold">Active Fleet</p>
            <p className="text-xl font-extrabold text-emerald-400 flex items-center justify-center gap-1">
              <Users className="w-4 h-4" /> {registeredVolunteers.length || 0}
            </p>
          </div>

          <div className="px-4 py-3 rounded-2xl glass-card text-center border border-amber-500/20">
            <p className="text-xs text-slate-400 font-semibold">Volunteer Rank</p>
            <p className="text-xl font-extrabold text-amber-400 flex items-center justify-center gap-1">
              <Award className="w-4 h-4" /> 2,840 pts
            </p>
          </div>
        </div>
      </div>

      {/* VOLUNTEER REGISTRATION & AREA LISTING PORTAL (SLIDE-DOWN FORM) */}
      {(showRegForm || !isRegistered) && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-500/40 shadow-2xl space-y-6 animate-in fade-in duration-300 bg-amber-950/20">
          <div className="flex items-center justify-between border-b border-amber-500/20 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400">
                <UserCheck className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-white">Volunteer Logistics Registration Portal</h2>
                <p className="text-xs text-slate-300">List yourself for food pickup & delivery tasks in your operating area.</p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Instant Authorization
            </span>
          </div>

          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name *</label>
                <input 
                  type="text"
                  required
                  value={volData.name}
                  onChange={(e) => setVolData({...volData, name: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-emerald-950/80 border border-emerald-500/30 text-white text-xs focus:outline-none focus:border-amber-400"
                  placeholder="e.g. Alex Rivera"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Phone Number for SMS Dispatch *</label>
                <input 
                  type="tel"
                  required
                  value={volData.phone}
                  onChange={(e) => setVolData({...volData, phone: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-emerald-950/80 border border-emerald-500/30 text-white text-xs focus:outline-none focus:border-amber-400 font-mono"
                  placeholder="+1 (555) 456-7890"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Vehicle Type *</label>
                <select
                  value={volData.vehicle}
                  onChange={(e) => setVolData({...volData, vehicle: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-emerald-950/90 border border-emerald-500/30 text-white text-xs focus:outline-none focus:border-amber-400"
                >
                  {vehicles.map(v => <option key={v} value={v} className="bg-emerald-950 text-white">{v}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Operating Area / Pincode Zone *</label>
                <input 
                  type="text"
                  required
                  value={volData.operatingZone}
                  onChange={(e) => setVolData({...volData, operatingZone: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-emerald-950/80 border border-emerald-500/30 text-white text-xs focus:outline-none focus:border-amber-400"
                  placeholder="e.g. Sector 4, Downtown Metro"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Daily Availability Slot *</label>
                <select
                  value={volData.availability}
                  onChange={(e) => setVolData({...volData, availability: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-emerald-950/90 border border-emerald-500/30 text-white text-xs focus:outline-none focus:border-amber-400"
                >
                  {availabilitySlots.map(s => <option key={s} value={s} className="bg-emerald-950 text-white">{s}</option>)}
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-amber-950 font-extrabold text-sm shadow-xl shadow-amber-500/20 transition-all hover:scale-[1.01] flex items-center justify-center gap-2"
            >
              <UserCheck className="w-5 h-5 text-amber-950" />
              <span>Register & Activate Area Volunteer Standby Status</span>
            </button>
          </form>
        </div>
      )}

      {/* ACTIVE REGISTERED VOLUNTEER PROFILE CARD SUMMARY */}
      {isRegistered && (
        <div className="p-4 sm:p-5 rounded-3xl glass-panel border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-amber-950/20">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-lg border border-amber-500/30">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">{loggedInVol.name}</span>
                <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">ACTIVE ON STANDBY</span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">{loggedInVol.vehicle} • {loggedInVol.operatingZone}</p>
            </div>
          </div>

          <div className="text-left sm:text-right text-xs text-slate-300">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Availability Slot</span>
            <span className="font-bold text-amber-300">{loggedInVol.availability}</span>
          </div>
        </div>
      )}

      {/* Main List of Available & Active Dispatch Tasks */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            <span>Available Food Donations</span>
          </h2>
          <span className="text-xs text-slate-400 font-semibold">{donations.length} Active Shipments</span>
        </div>

        {donations.length === 0 ? (
          <div className="glass-panel p-10 rounded-3xl border border-emerald-500/20 text-center">
            <Package className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">No active requests</h3>
            <p className="text-sm text-slate-400">No food donations available yet. Donors can list surplus food via the Donor tab.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {donations.map((item) => {
              const isAccepted = item.assignedVolunteer?.isAccepted || item.status === "Volunteer Accepted" || item.status === "Food Picked Up" || item.status === "Food In Transit" || item.status === "Delivered to NGO" || item.status === "Distributed";

              return (
                <div 
                  key={item.id}
                  className="glass-card p-6 rounded-3xl border border-emerald-500/30 space-y-5 relative group"
                >
                  
                  {/* Header Info */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={item.imageUrl} 
                        alt={item.foodName}
                        className="w-16 h-16 object-cover rounded-2xl border border-emerald-500/40"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150&auto=format&fit=crop&q=80";
                        }}
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                            {item.id}
                          </span>
                          <span className="text-[10px] font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded">
                            Priority: {item.priorityLevel || "HIGH URGENCY"}
                          </span>
                        </div>
                        <h3 className="text-base font-extrabold text-white mt-1">{item.foodName}</h3>
                        <p className="text-xs text-slate-300">{item.quantity} • Feeds ~{item.peopleFedCount} people</p>
                      </div>
                    </div>

                    {/* Status */}
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide border ${
                      item.status === 'Distributed' || item.status === 'Delivered to NGO'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                        : item.status === 'Food In Transit' || item.status === 'Food Picked Up'
                        ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                        : isAccepted
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                    }`}>
                      {item.status}
                    </span>
                  </div>

                  {/* Locations Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300 bg-emerald-950/60 p-4 rounded-2xl border border-emerald-500/20">
                    <div>
                      <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider block">Pickup Address</span>
                      <p className="font-semibold text-white flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="truncate">{item.pickupAddress}</span>
                      </p>
                    </div>

                    <div>
                      <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider block">Delivery NGO</span>
                      <p className="font-semibold text-emerald-300 flex items-center gap-1 mt-0.5">
                        <Building2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <span className="truncate">{item.recommendedNgo?.name || 'Hope Community Shelter'}</span>
                      </p>
                    </div>
                  </div>

                  {/* Action Controls */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    
                    {!isAccepted && (
                      <>
                        {item.status === 'Pending NGO Acceptance' ? (
                          <div className="flex-1 py-3 rounded-2xl bg-amber-500/10 text-amber-400/50 font-extrabold text-xs border border-amber-500/20 text-center flex items-center justify-center gap-1.5 cursor-not-allowed">
                            <Clock className="w-4 h-4 animate-pulse" />
                            <span>Awaiting NGO Acceptance</span>
                          </div>
                        ) : (
                          <>
                            <button
                              onClick={() => handleAccept(item)}
                              className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-amber-950 font-extrabold text-xs shadow-lg transition-all hover:scale-105 flex items-center justify-center gap-1.5"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Accept Pickup Request</span>
                            </button>

                            <button
                              onClick={() => handleReject(item)}
                              className="px-4 py-3 rounded-2xl glass-panel hover:bg-red-500/20 text-red-300 font-bold text-xs border border-red-500/30 flex items-center gap-1"
                            >
                              <XCircle className="w-4 h-4" />
                              <span>Reject</span>
                            </button>
                          </>
                        )}
                      </>
                    )}

                    {isAccepted && item.status !== 'Distributed' && item.status !== 'Delivered to NGO' && (
                      <>
                        <button
                          onClick={() => setActiveScanItem(item)}
                          className="flex-1 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-extrabold text-xs shadow-lg transition-all flex items-center justify-center gap-1.5"
                        >
                          <Camera className="w-4 h-4" />
                          <span>Scan Pickup QR Code</span>
                        </button>
                      </>
                    )}

                    <button
                      onClick={() => {
                        if (setSelectedDonation) setSelectedDonation(item);
                        if (setActiveView) setActiveView('live-tracking');
                      }}
                      className="px-4 py-3 rounded-2xl glass-panel hover:bg-emerald-800/40 border border-emerald-500/30 text-white font-bold text-xs flex items-center gap-1.5"
                    >
                      <Navigation className="w-4 h-4 text-emerald-400" />
                      <span>Navigation</span>
                    </button>

                    <button
                      onClick={() => showToast(`Calling Donor (${item.contactNumber || '+1 555-234-5678'})...`, 'info')}
                      className="p-3 rounded-2xl bg-emerald-900/40 hover:bg-emerald-800/60 border border-emerald-500/30 text-emerald-300 text-xs font-bold"
                      title="Call Donor"
                    >
                      <Phone className="w-4 h-4" />
                    </button>

                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Registered NGO Shelters Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-400" />
            <span>Registered NGO Shelters</span>
          </h2>
          <span className="text-xs text-slate-400 font-semibold">{registeredNGOs.length} Delivery Points</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {registeredNGOs.length > 0 ? registeredNGOs.map((ngo, idx) => (
            <div key={idx} className="glass-panel p-5 rounded-2xl border border-blue-500/30 hover:border-blue-500/50 transition-all flex items-start gap-4">
               <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex flex-shrink-0 items-center justify-center text-blue-400">
                 <Building2 className="w-5 h-5" />
               </div>
               <div>
                 <h3 className="text-sm font-bold text-white">{ngo.name}</h3>
                 <p className="text-xs text-slate-300 mt-1 flex items-center gap-1">
                   <MapPin className="w-3 h-3 text-blue-400 shrink-0" />
                   <span className="truncate">{ngo.address || ngo.operatingZone || 'Local Area'}</span>
                 </p>
                 <p className="text-[10px] text-slate-400 mt-1">Capacity: {ngo.capacity || 'Not specified'}</p>
               </div>
            </div>
          )) : (
             <div className="col-span-full glass-panel p-6 rounded-2xl text-center text-slate-400 text-sm border border-blue-500/20">
               No NGO shelters registered yet.
             </div>
          )}
        </div>
      </div>

      {/* QR CAMERA SCANNER MODAL */}
      <QRScannerModal 
        isOpen={!!activeScanItem}
        onClose={() => setActiveScanItem(null)}
        donation={activeScanItem}
        scanType="pickup"
      />

    </div>
  );
};
