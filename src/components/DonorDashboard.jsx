import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { QRModal } from './QRModal';
import { SendVolunteerSMSModal } from './SendVolunteerSMSModal';
import { 
  HeartHandshake, 
  Sparkles, 
  Clock, 
  MapPin, 
  Phone, 
  Utensils, 
  Package, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  ArrowRight,
  QrCode,
  Smartphone,
  Truck,
  Building2,
  UserCircle,
  Check 
} from 'lucide-react';

export const DonorDashboard = () => {
  const { 
    addDonation, 
    donations, 
    setSelectedDonation, 
    setActiveView, 
    currentUser, 
    showToast,
    registeredVolunteers,
    registeredNGOs,
    currentRole,
    acceptNgoDonation,
    declineNgoDonation,
    acceptVolunteerDonation,
    declineVolunteerDonation
  } = useApp();

  const [activeQRDonation, setActiveQRDonation] = useState(null);
  const [activeSMSDonation, setActiveSMSDonation] = useState(null);

  // Multi-selection states for NGOs and Volunteers
  const [selectedNgos, setSelectedNgos] = useState(() => (registeredNGOs && registeredNGOs.length > 0) ? registeredNGOs : []);
  const [selectedVolunteers, setSelectedVolunteers] = useState(() => (registeredVolunteers && registeredVolunteers.length > 0) ? registeredVolunteers : []);

  useEffect(() => {
    if (selectedNgos.length === 0 && registeredNGOs?.length > 0) {
      setSelectedNgos(registeredNGOs);
    }
  }, [registeredNGOs]);

  useEffect(() => {
    if (selectedVolunteers.length === 0 && registeredVolunteers?.length > 0) {
      setSelectedVolunteers(registeredVolunteers);
    }
  }, [registeredVolunteers]);

  const toggleNgoSelection = (ngo) => {
    setSelectedNgos(prev => {
      const exists = prev.some(n => n.id === ngo.id || n.name === ngo.name);
      if (exists) {
        return prev.filter(n => n.id !== ngo.id && n.name !== ngo.name);
      } else {
        return [...prev, ngo];
      }
    });
  };

  const toggleSelectAllNgos = () => {
    if (selectedNgos.length === registeredNGOs.length) {
      setSelectedNgos([]);
    } else {
      setSelectedNgos([...registeredNGOs]);
    }
  };

  const toggleVolunteerSelection = (vol) => {
    setSelectedVolunteers(prev => {
      const exists = prev.some(v => v.id === vol.id || v.name === vol.name);
      if (exists) {
        return prev.filter(v => v.id !== vol.id && v.name !== vol.name);
      } else {
        return [...prev, vol];
      }
    });
  };

  const toggleSelectAllVolunteers = () => {
    if (selectedVolunteers.length === registeredVolunteers.length) {
      setSelectedVolunteers([]);
    } else {
      setSelectedVolunteers([...registeredVolunteers]);
    }
  };

  const [formData, setFormData] = useState({
    foodName: '',
    category: 'Cooked Meals',
    quantity: '',
    peopleFedCount: '',
    expiryHours: '',
    pickupAddress: '',
    contactNumber: '',
    imageUrl: '/ai_food_match.jpg',
  });

  // Filter donations from registered donors
  const donorDonations = (donations || []).filter(item => {
    if (!item) return false;
    if (item.donorName?.toLowerCase() === 'rohit') return false;
    if (item.foodName?.toLowerCase() === 'rohit' && item.id === 'DON-3438') return false;
    return true;
  });

  if (currentRole !== 'donor') {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-8 text-center">
        <div className="w-16 h-16 rounded-3xl bg-[#EBF1FE] text-[#1D52F2] flex items-center justify-center mx-auto shadow-sm border border-[#1D52F2]/20">
          <HeartHandshake className="w-8 h-8" />
        </div>
        <div className="space-y-3">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EBF1FE] text-[#1D52F2] text-xs font-bold border border-[#1D52F2]/30">
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>Donor Hub Access Control</span>
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900">Registered Food Donors Portal</h1>
          <p className="text-slate-600 text-sm max-w-lg mx-auto">
            You are currently signed in as a <strong className="text-[#F26B1D] font-bold">{currentRole === 'volunteer' ? 'Volunteer Courier' : currentRole?.toUpperCase()} ({currentUser?.name || 'User'})</strong>. Donor Hub is dedicated exclusively to registered food donors to upload surplus meals.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {currentRole === 'volunteer' && (
            <button
              onClick={() => setActiveView('volunteer')}
              className="px-6 py-3.5 rounded-2xl bg-[#1D52F2] hover:bg-[#133BB5] text-white font-extrabold text-xs shadow-md shadow-[#1D52F2]/25 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Truck className="w-4 h-4" />
              <span>Go to My Deliveries</span>
            </button>
          )}
          {currentRole === 'ngo' && (
            <button
              onClick={() => setActiveView('ngo')}
              className="px-6 py-3.5 rounded-2xl bg-[#1D52F2] hover:bg-[#133BB5] text-white font-extrabold text-xs shadow-md shadow-[#1D52F2]/25 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Building2 className="w-4 h-4" />
              <span>Go to NGO Shelters</span>
            </button>
          )}
          <button
            onClick={() => setActiveView('landing')}
            className="px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-extrabold text-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>Back to Home</span>
          </button>
        </div>

        {/* If NGO or Volunteer has pending donations, show them directly here! */}
        {donorDonations.length > 0 && (
          <div className="pt-8 text-left max-w-2xl mx-auto space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#1D52F2]" />
              <span>Incoming Donations Contacting You ({currentUser?.name}):</span>
            </h3>
            <div className="space-y-3">
              {donorDonations.map((item) => {
                const isNgo = currentRole === 'ngo';
                const isVol = currentRole === 'volunteer';

                const isNgoAccepted = item.acceptedNgo?.name?.toLowerCase() === currentUser?.name?.toLowerCase();
                const isNgoDeclined = item.declinedNgos?.some(n => (typeof n === 'string' ? n : n?.name)?.toLowerCase() === currentUser?.name?.toLowerCase());

                const isVolAccepted = item.acceptedVolunteer?.name?.toLowerCase() === currentUser?.name?.toLowerCase() || (item.assignedVolunteer?.name?.toLowerCase() === currentUser?.name?.toLowerCase() && item.assignedVolunteer?.isAccepted);
                const isVolDeclined = item.declinedVolunteers?.some(v => (typeof v === 'string' ? v : v?.name)?.toLowerCase() === currentUser?.name?.toLowerCase());

                return (
                  <div key={item.id} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-[#1D52F2] bg-[#EBF1FE] px-2 py-0.5 rounded border border-[#1D52F2]/20">{item.id}</span>
                        <span className="text-xs font-bold text-slate-900">{item.foodName}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        From: <strong className="text-slate-800">{item.donorName || "Registered Donor"}</strong> • {item.quantity} (~{item.peopleFedCount} people)
                      </p>
                      <p className="text-[11px] text-slate-500">Status: <strong className="text-[#1D52F2]">{item.status}</strong></p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {isNgo && (
                        <>
                          {isNgoAccepted ? (
                            <span className="px-3 py-1.5 rounded-xl bg-[#F0F8EC] text-[#63A644] font-bold text-xs border border-[#63A644]/30 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Accepted
                            </span>
                          ) : isNgoDeclined ? (
                            <span className="px-3 py-1.5 rounded-xl bg-red-50 text-red-600 font-bold text-xs border border-red-200 flex items-center gap-1">
                              <XCircle className="w-3.5 h-3.5" /> Declined
                            </span>
                          ) : (
                            <>
                              <button
                                onClick={() => acceptNgoDonation(item.id, currentUser)}
                                className="px-3 py-2 rounded-xl bg-[#63A644] hover:bg-[#4B8233] text-white font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center gap-1"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" /> Accept
                              </button>
                              <button
                                onClick={() => declineNgoDonation(item.id, currentUser, "Capacity full")}
                                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-red-50 text-red-600 font-bold text-xs border border-slate-200 hover:border-red-200 transition-all cursor-pointer flex items-center gap-1"
                              >
                                <XCircle className="w-3.5 h-3.5" /> Decline
                              </button>
                            </>
                          )}
                        </>
                      )}

                      {isVol && (
                        <>
                          {isVolAccepted ? (
                            <span className="px-3 py-1.5 rounded-xl bg-[#F0F8EC] text-[#63A644] font-bold text-xs border border-[#63A644]/30 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Accepted
                            </span>
                          ) : isVolDeclined ? (
                            <span className="px-3 py-1.5 rounded-xl bg-red-50 text-red-600 font-bold text-xs border border-red-200 flex items-center gap-1">
                              <XCircle className="w-3.5 h-3.5" /> Declined
                            </span>
                          ) : (
                            <>
                              <button
                                onClick={() => acceptVolunteerDonation(item.id, currentUser)}
                                className="px-3 py-2 rounded-xl bg-[#63A644] hover:bg-[#4B8233] text-white font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center gap-1"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" /> Accept
                              </button>
                              <button
                                onClick={() => declineVolunteerDonation(item.id, currentUser, "Cannot travel right now")}
                                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-red-50 text-red-600 font-bold text-xs border border-slate-200 hover:border-red-200 transition-all cursor-pointer flex items-center gap-1"
                              >
                                <XCircle className="w-3.5 h-3.5" /> Decline
                              </button>
                            </>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }


  const categories = [
    'Cooked Meals',
    'Bakery & Pastries',
    'Packaged Foods',
    'Raw Ingredients',
    'Fresh Produce',
    'Beverages & Dairy'
  ];

  const handleAutofillLocation = () => {
    if (currentUser?.address) {
      setFormData((prev) => ({ ...prev, pickupAddress: currentUser.address }));
      showToast("Autofilled pickup address from your profile!", "info");
    } else {
      setFormData((prev) => ({ ...prev, pickupAddress: "Sector 4, City Center (Current Location)" }));
      showToast("Autofilled current location!", "info");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (currentUser?.verificationStatus === 'Pending') {
      showToast("Your FSSAI Verification is pending. You cannot post food until approved.", "error");
      return;
    }
    if (currentUser?.verificationStatus === 'Rejected') {
      showToast("Your FSSAI Verification was rejected. Please contact support.", "error");
      return;
    }

    if (selectedNgos.length === 0 || selectedVolunteers.length === 0) {
      showToast("Please select at least one NGO recipient and one Volunteer courier before donating.", "warning");
      return;
    }
    const payload = {
      ...formData,
      selectedNgos,
      selectedVolunteers,
      selectedNgo: selectedNgos[0],
      selectedVolunteer: selectedVolunteers[0]
    };
    addDonation(payload);
    showToast(`Donation Created! Dispatched alert to ${selectedNgos.length} NGO(s) and ${selectedVolunteers.length} volunteer courier(s).`, 'success');
    setActiveView('live-tracking');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EBF1FE] text-[#1D52F2] text-xs font-bold border border-[#1D52F2]/30">
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>Donor Portal • {currentUser?.name || "Verified Donor"}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900">Post Surplus Food for Rescue</h1>
          <p className="text-slate-600 text-xs sm:text-sm">
            AI instantly matches your food with nearby verified NGOs and assigns dispatch volunteers. Send SMS alerts directly to couriers.
          </p>
        </div>

        <div className="flex items-center gap-3 z-10">
          <div className="px-5 py-3 rounded-2xl bg-[#F8FAFC] border border-slate-200 text-center">
            <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Verification</p>
            {currentUser?.verificationStatus === 'Verified' ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#63A644] mt-0.5">
                <CheckCircle2 className="w-4 h-4 text-[#63A644]" /> 
                {currentUser?.donorType === 'Household / Individual' ? 'Verified Household Donor' : 'FSSAI Verified Donor'}
              </span>
            ) : currentUser?.verificationStatus === 'Pending' ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F26B1D] mt-0.5">
                <AlertCircle className="w-4 h-4 text-[#F26B1D]" /> Pending Verification
              </span>
            ) : currentUser?.verificationStatus === 'Rejected' ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 mt-0.5">
                <AlertCircle className="w-4 h-4 text-red-600" /> Verification Rejected
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#63A644] mt-0.5">
                <CheckCircle2 className="w-4 h-4 text-[#63A644]" /> Verified Donor
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT FORM COLUMN (7 COLS) */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col gap-3 border-b border-slate-200 pb-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Package className="w-5 h-5 text-[#1D52F2]" />
                <span>Food Surplus Upload Form</span>
              </h2>
              <button 
                type="button"
                onClick={() => setActiveView('ai-analyzer')}
                className="text-xs font-bold text-[#1D52F2] bg-[#EBF1FE] hover:bg-[#1D52F2]/15 px-3 py-1.5 rounded-full border border-[#1D52F2]/30 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#1D52F2]" />
                <span>Food Quality Check</span>
              </button>
            </div>
            
            {(selectedNgos.length > 0 || selectedVolunteers.length > 0) && (
              <div className="flex flex-wrap gap-2 mt-1">
                {selectedNgos.length > 0 && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 bg-[#EBF1FE] text-[#1D52F2] border border-[#1D52F2]/30 rounded-xl">
                    <Building2 className="w-3.5 h-3.5" />
                    {selectedNgos.length} NGO Shelter(s) Selected
                  </span>
                )}
                {selectedVolunteers.length > 0 && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 bg-[#FEF3EB] text-[#F26B1D] border border-[#F26B1D]/30 rounded-xl">
                    <UserCircle className="w-3.5 h-3.5" />
                    {selectedVolunteers.length} Standby Courier(s) Selected
                  </span>
                )}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Food Name & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Food Item Name *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Prepared Catered Meals, Fresh Bakery Boxes"
                  value={formData.foodName}
                  onChange={(e) => setFormData({...formData, foodName: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-[#F8FAFC] border border-slate-200 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-[#1D52F2] focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Food Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-[#F8FAFC] border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-[#1D52F2] focus:bg-white transition-all cursor-pointer"
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            {/* Quantity & Servings & Expiry */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Quantity (kg / boxes) *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. 35 kg"
                  value={formData.quantity}
                  onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-[#F8FAFC] border border-slate-200 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-[#1D52F2] focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">People it can Feed *</label>
                <input 
                  type="number" 
                  required
                  placeholder="e.g. 90"
                  value={formData.peopleFedCount}
                  onChange={(e) => setFormData({...formData, peopleFedCount: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-[#F8FAFC] border border-slate-200 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-[#1D52F2] focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Freshness Window (Hours) *</label>
                <input 
                  type="number" 
                  required
                  min="1"
                  max="48"
                  placeholder="e.g. 6"
                  value={formData.expiryHours}
                  onChange={(e) => setFormData({...formData, expiryHours: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-[#F8FAFC] border border-slate-200 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-[#1D52F2] focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Address & Geolocation autofill */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700">Pickup Address *</label>
                <button
                  type="button"
                  onClick={handleAutofillLocation}
                  className="text-xs font-bold text-[#1D52F2] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5" /> Auto-Detect GPS Location
                </button>
              </div>
              <input 
                type="text" 
                required
                placeholder="Full address with landmark"
                value={formData.pickupAddress}
                onChange={(e) => setFormData({...formData, pickupAddress: e.target.value})}
                className="w-full px-4 py-3 rounded-xl bg-[#F8FAFC] border border-slate-200 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-[#1D52F2] focus:bg-white transition-all"
              />
            </div>

            {/* Contact Number */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Contact Phone Number *</label>
              <input 
                type="tel" 
                required
                placeholder="+1 (555) 000-0000"
                value={formData.contactNumber}
                onChange={(e) => setFormData({...formData, contactNumber: e.target.value})}
                className="w-full px-4 py-3 rounded-xl bg-[#F8FAFC] border border-slate-200 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-[#1D52F2] focus:bg-white transition-all"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-[#1D52F2] hover:bg-[#133BB5] text-white font-black text-sm shadow-lg shadow-[#1D52F2]/25 transition-all hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer"
            >
              <HeartHandshake className="w-5 h-5 text-white" />
              <span>Donate Food & Trigger AI Smart Matching</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </form>
        </div>

        {/* RIGHT COLUMN (5 COLS) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* a. Select NGO Recipients (Multi-select) */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#1D52F2]"></span> 
                  Select NGO Recipients ({selectedNgos.length} Selected)
                </h2>
                <p className="text-[11px] text-slate-500 mt-0.5">Alert multiple shelters so an alternate can accept if one is full.</p>
              </div>
              <button 
                type="button"
                onClick={toggleSelectAllNgos}
                className="text-[11px] font-bold text-[#1D52F2] hover:underline cursor-pointer"
              >
                {selectedNgos.length === registeredNGOs.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>

            {registeredNGOs && registeredNGOs.length > 0 ? (
              <div className="space-y-3">
                {registeredNGOs.map(ngo => {
                  const isSelected = selectedNgos.some(n => n.id === ngo.id || n.name === ngo.name);
                  return (
                    <div 
                      key={ngo.id} 
                      onClick={() => toggleNgoSelection(ngo)}
                      className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer ${isSelected ? 'border-[#1D52F2] bg-[#EBF1FE]/60 shadow-xs' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-slate-900 font-extrabold text-sm">{ngo.name}</h3>
                            {isSelected && (
                              <span className="text-[10px] font-bold text-[#1D52F2] bg-white px-2 py-0.5 rounded-full border border-[#1D52F2]/30 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-[#1D52F2]" /> Selected
                              </span>
                            )}
                          </div>
                          <p className="text-slate-500 text-xs mt-1 flex items-start gap-1">
                            <MapPin className="w-3.5 h-3.5 mt-0.5 text-[#1D52F2] shrink-0" />
                            {ngo.address}
                          </p>
                          <div className="flex flex-wrap gap-2 mt-2.5">
                            <span className="text-[10px] font-bold bg-[#EBF1FE] text-[#1D52F2] px-2.5 py-0.5 rounded-md border border-[#1D52F2]/20">Capacity: {ngo.capacity}</span>
                            <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md">{ngo.foodPreference}</span>
                          </div>
                        </div>

                        <div className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all shrink-0 ${isSelected ? 'bg-[#1D52F2] border-[#1D52F2] text-white' : 'border-slate-300 bg-white'}`}>
                          {isSelected && <Check className="w-4 h-4 text-white" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50">
                <AlertCircle className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                <p className="text-xs text-slate-500 max-w-[220px] mx-auto">No NGOs registered yet.</p>
              </div>
            )}
          </div>

          {/* b. Select Volunteer Couriers (Multi-select) */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F26B1D]"></span> 
                  Select Volunteer Couriers ({selectedVolunteers.length} Selected)
                </h2>
                <p className="text-[11px] text-slate-500 mt-0.5">Alert standby couriers; anyone can accept if one cannot travel.</p>
              </div>
              <button 
                type="button"
                onClick={toggleSelectAllVolunteers}
                className="text-[11px] font-bold text-[#F26B1D] hover:underline cursor-pointer"
              >
                {selectedVolunteers.length === registeredVolunteers.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>

            {registeredVolunteers && registeredVolunteers.length > 0 ? (
              <div className="space-y-3">
                {registeredVolunteers.map(vol => {
                  const isSelected = selectedVolunteers.some(v => v.id === vol.id || v.name === vol.name);
                  return (
                    <div 
                      key={vol.id} 
                      onClick={() => toggleVolunteerSelection(vol)}
                      className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer ${isSelected ? 'border-[#F26B1D] bg-[#FEF3EB]/60 shadow-xs' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-slate-900 font-extrabold text-sm">{vol.name}</h3>
                            {isSelected && (
                              <span className="text-[10px] font-bold text-[#F26B1D] bg-white px-2 py-0.5 rounded-full border border-[#F26B1D]/30 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-[#F26B1D]" /> Selected
                              </span>
                            )}
                          </div>
                          <p className="text-slate-500 text-xs mt-1 flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5 text-[#F26B1D]" />
                            {vol.phone}
                          </p>
                          <div className="flex flex-wrap gap-2 mt-2.5">
                            <span className="text-[10px] font-bold bg-[#FEF3EB] text-[#F26B1D] px-2.5 py-0.5 rounded-md border border-[#F26B1D]/20 flex items-center gap-1">
                              <Truck className="w-3 h-3" />
                              {vol.vehicle}
                            </span>
                            <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {vol.operatingZone}
                            </span>
                          </div>
                        </div>

                        <div className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all shrink-0 ${isSelected ? 'bg-[#F26B1D] border-[#F26B1D] text-white' : 'border-slate-300 bg-white'}`}>
                          {isSelected && <Check className="w-4 h-4 text-white" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50">
                <AlertCircle className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                <p className="text-xs text-slate-500">No volunteers registered yet.</p>
              </div>
            )}
          </div>

          {/* c. Your Active Donations */}
          {donorDonations && donorDonations.length > 0 && (
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#1D52F2]" />
                  <span>Your Active Donations</span>
                </h2>
                <span className="text-xs text-[#1D52F2] font-bold bg-[#EBF1FE] px-2.5 py-0.5 rounded-full border border-[#1D52F2]/20">{donorDonations.length} Listed</span>
              </div>

              <div className="space-y-4">
                {donorDonations.map((item) => (
                  <div 
                    key={item.id}
                    className="p-5 rounded-2xl space-y-4 border border-slate-200 bg-[#F8FAFC] relative group hover:border-slate-300 transition-all"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img 
                          src={item.imageUrl} 
                          alt={item.foodName}
                          className="w-14 h-14 object-cover rounded-xl border border-slate-200"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150&auto=format&fit=crop&q=80";
                          }}
                        />
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#1D52F2] bg-[#EBF1FE] px-2 py-0.5 rounded border border-[#1D52F2]/20">
                              {item.id}
                            </span>
                            <span className="text-[10px] font-bold text-[#63A644] bg-[#F0F8EC] px-2 py-0.5 rounded border border-[#63A644]/20 flex items-center gap-1">
                              <HeartHandshake className="w-3 h-3 text-[#63A644]" />
                              Donor: {item.donorName || currentUser?.name || "Registered Donor"}
                            </span>
                          </div>
                          <h3 className="text-sm font-bold text-slate-900 mt-1 leading-tight">
                            {item.foodName?.toLowerCase() === 'dhruv' ? 'Prepared Catered Meals' : item.foodName}
                          </h3>
                          <p className="text-[11px] text-slate-500 mt-0.5">{item.quantity} • Feeds ~{item.peopleFedCount} people</p>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide border ${
                        item.status === 'Distributed' || item.status === 'Delivered to NGO' || item.status === 'Delivered' || item.status === 'NGO Confirmed'
                          ? 'bg-[#F0F8EC] text-[#63A644] border-[#63A644]/30' 
                          : item.status === 'Volunteer Accepted' || item.status === 'Food Picked Up' || item.status === 'Travelling to NGO' || item.status === 'Food In Transit'
                          ? 'bg-[#FEF3EB] text-[#F26B1D] border-[#F26B1D]/30'
                          : 'bg-[#EBF1FE] text-[#1D52F2] border-[#1D52F2]/30'
                      }`}>
                        {item.status}
                      </span>
                    </div>

                    {/* Multi-NGO and Multi-Volunteer Real-time Status */}
                    <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-2 shadow-xs">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">NGO Shelter Status</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {(item.selectedNgos && item.selectedNgos.length > 0 ? item.selectedNgos : [item.recommendedNgo]).filter(Boolean).map(n => {
                            const isAccepted = item.acceptedNgo?.name === n.name || item.acceptedNgo?.id === n.id;
                            const isDeclined = item.declinedNgos?.includes(n.name) || item.declinedNgos?.includes(n.id);
                            return (
                              <span key={n.id || n.name} className={`px-2 py-0.5 rounded text-[10px] font-bold border ${isAccepted ? 'bg-[#F0F8EC] text-[#63A644] border-[#63A644]/30' : isDeclined ? 'bg-red-50 text-red-600 border-red-200 line-through' : 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                                {n.name} {isAccepted ? '✓ (Accepted)' : isDeclined ? '✕ (Full)' : '(Pending)'}
                              </span>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Volunteer Courier Status</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {(item.selectedVolunteers && item.selectedVolunteers.length > 0 ? item.selectedVolunteers : [item.assignedVolunteer]).filter(Boolean).map(v => {
                            const isAccepted = item.acceptedVolunteer?.name === v.name || item.acceptedVolunteer?.id === v.id;
                            const isDeclined = item.declinedVolunteers?.includes(v.name) || item.declinedVolunteers?.includes(v.id);
                            return (
                              <span key={v.id || v.name} className={`px-2 py-0.5 rounded text-[10px] font-bold border ${isAccepted ? 'bg-[#FEF3EB] text-[#F26B1D] border-[#F26B1D]/30' : isDeclined ? 'bg-red-50 text-red-600 border-red-200 line-through' : 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                                {v.name} {isAccepted ? '✓ (Accepted)' : isDeclined ? '✕ (Unavailable)' : '(Pending)'}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      <button
                        onClick={() => setActiveSMSDonation(item)}
                        className="w-full py-2.5 rounded-xl bg-[#FEF3EB] hover:bg-[#F26B1D]/15 border border-[#F26B1D]/30 text-[#F26B1D] font-extrabold text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Smartphone className="w-4 h-4 text-[#F26B1D]" />
                        <span>Send Donation Receiving SMS to Volunteer</span>
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setActiveQRDonation(item)}
                          className="py-2 px-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                          title="Display Pickup QR Code for arriving volunteer courier to scan"
                        >
                          <QrCode className="w-3.5 h-3.5 text-[#1D52F2]" />
                          <span>Pickup QR Pass</span>
                        </button>

                        <button
                          onClick={() => {
                            setSelectedDonation(item);
                            setActiveView('live-tracking');
                          }}
                          className="flex-1 py-2 rounded-xl bg-[#1D52F2] hover:bg-[#133BB5] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Live GPS Map</span>
                        </button>

                        <button
                          onClick={() => {
                            setSelectedDonation(item);
                            setActiveView('ai-matching');
                          }}
                          className="py-2 px-3 rounded-xl bg-[#F0F8EC] hover:bg-[#63A644]/20 text-[#63A644] border border-[#63A644]/30 text-xs font-extrabold transition-all cursor-pointer"
                          title="AI Smart Match Dashboard"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                        </button>
                      </div>

                    </div>

                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* DONOR PICKUP QR MODAL */}
      <QRModal 
        isOpen={!!activeQRDonation}
        onClose={() => setActiveQRDonation(null)}
        donation={activeQRDonation}
        type="pickup"
      />

      {/* SEND VOLUNTEER RECEIVING SMS MODAL */}
      <SendVolunteerSMSModal 
        isOpen={!!activeSMSDonation}
        onClose={() => setActiveSMSDonation(null)}
        donation={activeSMSDonation}
      />

    </div>
  );
};
