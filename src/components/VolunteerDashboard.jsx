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
  UserCheck, 
  ShieldCheck, 
  Users,
  HeartHandshake 
} from 'lucide-react';

export const VolunteerDashboard = () => {
  const { 
    donations = [], 
    acceptVolunteerDonation,
    declineVolunteerDonation,
    acceptVolunteerRequest, 
    setSelectedDonation, 
    setActiveView, 
    currentUser, 
    showToast, 
    registeredNGOs = [], 
    registeredVolunteers = [], 
    currentRole 
  } = useApp();

  const [activeScan, setActiveScan] = useState(null);

  // Only show donations from registered donors (filter out non-donor test entries)
  const availableDonations = (donations || []).filter(item => {
    if (!item) return false;
    if (item.donorName?.toLowerCase() === 'rohit') return false;
    if (item.foodName?.toLowerCase() === 'rohit' && item.id === 'DON-3438') return false;
    return true;
  });

  const loggedInVol = registeredVolunteers.find(v => v.name === currentUser?.name || v.id === currentUser?.id);
  const isRegistered = !!loggedInVol;

  if (currentRole !== 'volunteer') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Volunteers Fleet Directory Banner */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FEF3EB] text-[#F26B1D] text-xs font-bold border border-[#F26B1D]/30">
              <Truck className="w-3.5 h-3.5" />
              <span>Volunteer Fleet Directory</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900">Active Rescue Couriers</h1>
            <p className="text-slate-600 text-xs sm:text-sm">
              List of all verified volunteer couriers registered on standby to transport food packages in their respective operating zones.
            </p>
          </div>
          
          <div className="px-5 py-3 rounded-2xl bg-[#F8FAFC] border border-slate-200 text-center">
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Active Couriers</p>
            <p className="text-2xl font-black text-[#F26B1D] flex items-center justify-center gap-1.5 mt-0.5">
              <Users className="w-5 h-5" /> {registeredVolunteers.length}
            </p>
          </div>
        </div>

        {/* Directory List */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Truck className="w-5 h-5 text-[#F26B1D]" />
            <span>On-Call Standby Couriers</span>
          </h2>

          {registeredVolunteers && registeredVolunteers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {registeredVolunteers.map(vol => (
                <div key={vol.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-4">
                  <div className="flex items-center gap-3.5">
                    <img 
                      src={vol.photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"} 
                      alt={vol.name}
                      className="w-14 h-14 rounded-2xl border-2 border-[#F26B1D]/40 object-cover shadow-xs"
                    />
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900">{vol.name}</h3>
                      <span className="text-[10px] font-bold text-[#63A644] bg-[#F0F8EC] px-2.5 py-0.5 rounded-full border border-[#63A644]/30 inline-block mt-0.5">
                        {vol.status || 'Active on Standby'}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-slate-600 bg-[#F8FAFC] p-4 rounded-2xl border border-slate-200 space-y-2">
                    <p className="flex justify-between">
                      <span className="text-slate-500">Vehicle:</span>
                      <span className="font-semibold text-slate-900">{vol.vehicle}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-slate-500">Operating Zone:</span>
                      <span className="font-semibold text-[#1D52F2]">{vol.operatingZone}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-slate-500">Availability:</span>
                      <span className="font-semibold text-slate-900">{vol.availability}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-slate-500">Contact:</span>
                      <span className="font-mono text-slate-800 font-semibold">{vol.phone}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 max-w-md mx-auto shadow-sm">
              <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-900">No Volunteers Registered Yet</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-[280px] mx-auto">Users can list themselves as volunteers for delivery work using their Volunteer dashboards.</p>
            </div>
          )}
        </div>
      </div>
    );
  }


  const handleAccept = (item) => {
    if (acceptVolunteerDonation) {
      acceptVolunteerDonation(item.id, currentUser);
    } else if (acceptVolunteerRequest) {
      acceptVolunteerRequest(item.id);
    }
    if (setSelectedDonation) setSelectedDonation(item);
  };

  const handleReject = (item) => {
    if (declineVolunteerDonation) {
      declineVolunteerDonation(item.id, currentUser, "Cannot travel right now");
    } else {
      showToast(`Declined request ${item.id}. Re-routing to next available volunteer.`, 'info');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Volunteer Active Courier Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FEF3EB] text-[#F26B1D] text-xs font-bold border border-[#F26B1D]/30">
            <Truck className="w-3.5 h-3.5" />
            <span>Volunteer Courier Dashboard • {currentUser?.name || 'Active Volunteer'}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900">Food Rescue & Pickup Deliveries</h1>
          <p className="text-slate-600 text-xs sm:text-sm">
            Review food packages posted by registered donors. Accept delivery dispatch to begin pickup, or decline if you cannot travel right now so alternate standby couriers can take it.
          </p>
        </div>

        {/* Courier On-Call Standby Status */}
        <div className="px-5 py-3 rounded-2xl bg-[#F0F8EC] border border-[#63A644]/30 text-center shrink-0">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Your Courier Status</p>
          <p className="text-sm font-black text-[#63A644] flex items-center justify-center gap-1.5 mt-0.5">
            <CheckCircle2 className="w-4 h-4" /> Active on Standby
          </p>
        </div>
      </div>

      {/* ACTIVE COURIER PROFILE CARD */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#FEF3EB] flex items-center justify-center text-[#F26B1D] font-bold text-lg border border-[#F26B1D]/20">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-extrabold text-slate-900">{currentUser?.name || 'Volunteer Courier'}</span>
              <span className="text-[10px] font-bold text-[#63A644] bg-[#F0F8EC] px-2.5 py-0.5 rounded-full border border-[#63A644]/30">ACTIVE COURIER</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{currentUser?.vehicle || 'Eco EV Scooter (Zero Emission)'} • {currentUser?.operatingZone || currentUser?.address || 'Operating Zone: Local Metro'}</p>
          </div>
        </div>

        <div className="text-left sm:text-right text-xs text-slate-600">
          <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Availability Slot</span>
          <span className="font-bold text-[#1D52F2]">24/7 On-Call Standby</span>
        </div>
      </div>

      {/* Main List of Available & Active Dispatch Tasks */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#F26B1D]" />
            <span>Available Food Donations from Registered Donors</span>
          </h2>
          <span className="text-xs text-[#1D52F2] font-bold bg-[#EBF1FE] px-3 py-1 rounded-full border border-[#1D52F2]/20">{availableDonations.length} Active Shipments</span>
        </div>

        {availableDonations.length === 0 ? (
          <div className="bg-white p-10 rounded-3xl border border-slate-200 text-center shadow-sm">
            <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900 mb-1">No active requests</h3>
            <p className="text-xs text-slate-500">No food donations available yet from registered donors.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {availableDonations.map((item) => {
              const isAccepted = item.assignedVolunteer?.isAccepted || item.status === "Volunteer Accepted" || item.status === "Volunteer Travelling" || item.status === "Volunteer Reached Pickup" || item.status === "Food Picked Up" || item.status === "Travelling to NGO" || item.status === "Food In Transit" || item.status === "Delivered" || item.status === "Delivered to NGO" || item.status === "NGO Confirmed" || item.status === "Distributed";

              return (
                <div 
                  key={item.id}
                  className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-5 relative group"
                >
                  
                  {/* Header Info */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={item.imageUrl} 
                        alt={item.foodName}
                        className="w-16 h-16 object-cover rounded-2xl border border-slate-200"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150&auto=format&fit=crop&q=80";
                        }}
                      />
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-bold text-[#1D52F2] bg-[#EBF1FE] px-2 py-0.5 rounded border border-[#1D52F2]/20">
                            {item.id}
                          </span>
                          <span className="text-[10px] font-bold text-[#F26B1D] bg-[#FEF3EB] px-2 py-0.5 rounded border border-[#F26B1D]/20">
                            Priority: {item.priorityLevel || "HIGH URGENCY"}
                          </span>
                          <span className="text-[10px] font-bold text-[#63A644] bg-[#F0F8EC] px-2 py-0.5 rounded border border-[#63A644]/20 flex items-center gap-1">
                            <HeartHandshake className="w-3 h-3 text-[#63A644]" />
                            Donor: {item.donorName || "Registered Donor"}
                          </span>
                        </div>
                        <h3 className="text-base font-extrabold text-slate-900 mt-1">
                          {item.foodName?.toLowerCase() === 'dhruv' ? 'Prepared Catered Meals' : item.foodName}
                        </h3>
                        <p className="text-xs text-slate-500">{item.quantity} • Feeds ~{item.peopleFedCount} people</p>
                      </div>
                    </div>

                    {/* Status */}
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide border ${
                      item.status === 'Distributed' || item.status === 'Delivered to NGO' || item.status === 'Delivered' || item.status === 'NGO Confirmed'
                        ? 'bg-[#F0F8EC] text-[#63A644] border-[#63A644]/30' 
                        : item.status === 'Food In Transit' || item.status === 'Food Picked Up' || item.status === 'Travelling to NGO'
                        ? 'bg-[#EBF1FE] text-[#1D52F2] border-[#1D52F2]/30'
                        : isAccepted
                        ? 'bg-[#FEF3EB] text-[#F26B1D] border-[#F26B1D]/30'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}>
                      {item.status}
                    </span>
                  </div>

                  {/* Locations & Donor Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600 bg-[#F8FAFC] p-4 rounded-2xl border border-slate-200">
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">Registered Donor</span>
                      <p className="font-extrabold text-slate-900 flex items-center gap-1 mt-0.5">
                        <HeartHandshake className="w-3.5 h-3.5 text-[#63A644] shrink-0" />
                        <span className="truncate">{item.donorName || "Registered Donor"}</span>
                      </p>
                    </div>

                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">Pickup Address</span>
                      <p className="font-semibold text-slate-900 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-[#1D52F2] shrink-0" />
                        <span className="truncate">{item.pickupAddress}</span>
                      </p>
                    </div>

                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">Delivery NGO</span>
                      <p className="font-semibold text-[#63A644] flex items-center gap-1 mt-0.5">
                        <Building2 className="w-3.5 h-3.5 text-[#63A644] shrink-0" />
                        <span className="truncate">{item.recommendedNgo?.name || 'Assigned Shelter'}</span>
                      </p>
                    </div>
                  </div>

                  {/* Action Controls */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {(() => {
                      const myName = currentUser?.name || 'Volunteer Courier';
                      const isAcceptedByMe = item.acceptedVolunteer?.name?.toLowerCase() === myName.toLowerCase() || (item.assignedVolunteer?.name?.toLowerCase() === myName.toLowerCase() && (item.assignedVolunteer?.isAccepted || item.status === 'Volunteer Travelling' || item.status === 'Volunteer Accepted' || item.status === 'Food Picked Up'));
                      const isDeclinedByMe = item.declinedVolunteers?.some(v => (typeof v === 'string' ? v : v?.name)?.toLowerCase() === myName.toLowerCase());
                      const isClaimedByOther = item.acceptedVolunteer && !isAcceptedByMe;

                      if (item.status === 'Distributed' || item.status === 'Delivered to NGO' || item.status === 'Delivered' || item.status === 'NGO Confirmed') {
                        return (
                          <span className="flex-1 py-3 rounded-xl bg-[#F0F8EC] text-[#63A644] font-extrabold text-xs border border-[#63A644]/30 flex items-center justify-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-[#63A644]" />
                            <span>Delivered Successfully</span>
                          </span>
                        );
                      }

                      if (isAcceptedByMe) {
                        const isPickedUp = item.status === 'Food Picked Up' || item.status === 'Travelling to NGO' || item.status?.includes('Picked Up');

                        return (
                          <div className="flex-1 flex flex-wrap items-center gap-2">
                            <span className="px-3 py-2.5 rounded-xl bg-[#F0F8EC] text-[#63A644] font-extrabold text-xs border border-[#63A644]/30 flex items-center gap-1.5">
                              <CheckCircle2 className="w-4 h-4 text-[#63A644]" />
                              <span>{isPickedUp ? 'Food Picked Up • In Transit' : 'Accepted by You'}</span>
                            </span>

                            {!isPickedUp ? (
                              <button
                                onClick={() => setActiveScan({ donation: item, scanType: 'pickup' })}
                                className="flex-1 py-2.5 rounded-xl bg-[#1D52F2] hover:bg-[#133BB5] text-white font-extrabold text-xs shadow-md shadow-[#1D52F2]/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                                title="Scan Donor's Pickup QR Code"
                              >
                                <Camera className="w-4 h-4" />
                                <span>Scan Donor Pickup QR</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => setActiveScan({ donation: item, scanType: 'delivery' })}
                                className="flex-1 py-2.5 rounded-xl bg-[#63A644] hover:bg-[#4B8233] text-white font-extrabold text-xs shadow-md shadow-[#63A644]/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer animate-pulse"
                                title="Scan NGO Delivery Pass to verify safe delivery"
                              >
                                <Camera className="w-4 h-4" />
                                <span>Scan NGO Delivery QR</span>
                              </button>
                            )}
                          </div>
                        );
                      }

                      if (isDeclinedByMe) {
                        return (
                          <div className="flex-1 flex items-center gap-2">
                            <span className="px-3 py-2.5 rounded-xl bg-red-50 text-red-600 font-bold text-xs border border-red-200 flex items-center gap-1.5">
                              <XCircle className="w-4 h-4 text-red-500" />
                              <span>Declined (Cannot travel)</span>
                            </span>
                            <button
                              onClick={() => handleAccept(item)}
                              className="px-3 py-2.5 rounded-xl bg-[#FEF3EB] hover:bg-[#F26B1D]/20 text-[#F26B1D] font-bold text-xs border border-[#F26B1D]/30 cursor-pointer"
                            >
                              Undo & Accept
                            </button>
                          </div>
                        );
                      }

                      if (isClaimedByOther) {
                        return (
                          <span className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 text-slate-600 text-xs font-semibold border border-slate-200">
                            Assigned to Courier {item.acceptedVolunteer.name}
                          </span>
                        );
                      }

                      // Open for this volunteer to Accept or Decline
                      return (
                        <div className="flex-1 flex items-center gap-2">
                          <button
                            onClick={() => handleAccept(item)}
                            className="flex-1 py-3 rounded-xl bg-[#63A644] hover:bg-[#4B8233] text-white font-extrabold text-xs shadow-md shadow-[#63A644]/20 transition-all hover:scale-[1.01] flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Accept Delivery Dispatch</span>
                          </button>

                          <button
                            onClick={() => handleReject(item)}
                            className="px-3.5 py-3 rounded-xl bg-slate-100 hover:bg-red-50 text-red-600 font-bold text-xs border border-slate-200 hover:border-red-200 flex items-center gap-1 cursor-pointer transition-colors"
                            title="Decline if you cannot travel right now so another volunteer can accept"
                          >
                            <XCircle className="w-4 h-4" />
                            <span>Decline</span>
                          </button>
                        </div>
                      );
                    })()}

                    <button
                      onClick={() => {
                        if (setSelectedDonation) setSelectedDonation(item);
                        if (setActiveView) setActiveView('live-tracking');
                      }}
                      className="px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <Navigation className="w-4 h-4 text-[#1D52F2]" />
                      <span>Navigation</span>
                    </button>

                    <button
                      onClick={() => showToast(`Calling Donor (${item.contactNumber || '+1 555-234-5678'})...`, 'info')}
                      className="p-3 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-bold cursor-pointer transition-colors"
                      title="Call Donor"
                    >
                      <Phone className="w-4 h-4 text-[#F26B1D]" />
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
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#1D52F2]" />
            <span>Registered NGO Shelters</span>
          </h2>
          <span className="text-xs text-[#1D52F2] font-bold bg-[#EBF1FE] px-3 py-1 rounded-full border border-[#1D52F2]/20">{registeredNGOs.length} Delivery Points</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {registeredNGOs.length > 0 ? registeredNGOs.map((ngo, idx) => (
            <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-[#1D52F2]/30 transition-all flex items-start gap-4">
               <div className="w-10 h-10 rounded-xl bg-[#EBF1FE] flex shrink-0 items-center justify-center text-[#1D52F2]">
                 <Building2 className="w-5 h-5" />
               </div>
               <div>
                 <h3 className="text-sm font-extrabold text-slate-900">{ngo.name}</h3>
                 <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                   <MapPin className="w-3.5 h-3.5 text-[#1D52F2] shrink-0" />
                   <span className="truncate">{ngo.address || ngo.operatingZone || 'Local Area'}</span>
                 </p>
                 <p className="text-[11px] text-slate-500 mt-1 font-semibold">Capacity: <span className="text-[#63A644]">{ngo.capacity || 'Not specified'}</span></p>
               </div>
            </div>
          )) : (
             <div className="col-span-full bg-white p-6 rounded-2xl text-center text-slate-500 text-sm border border-slate-200">
               No NGO shelters registered yet.
             </div>
          )}
        </div>
      </div>

      {/* QR CAMERA SCANNER MODAL */}
      <QRScannerModal 
        isOpen={!!activeScan}
        onClose={() => setActiveScan(null)}
        donation={activeScan?.donation}
        scanType={activeScan?.scanType || 'pickup'}
      />

    </div>
  );
};
