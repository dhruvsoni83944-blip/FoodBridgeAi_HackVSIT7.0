import React, { useState } from 'react';
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
  Zap,
  Smartphone,
  Truck,
  Send,
  Building2,
  UserCircle
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
    currentRole
  } = useApp();

  const [activeQRDonation, setActiveQRDonation] = useState(null);
  const [activeSMSDonation, setActiveSMSDonation] = useState(null);

  const [selectedNgo, setSelectedNgo] = useState(null);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);

  if (currentRole !== 'donor') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Read-Only Food Surplus Directory Banner */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-emerald-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-2 z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              <Utensils className="w-3.5 h-3.5" />
              <span>Surplus Food Directory</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white">Active Food Donations</h1>
            <p className="text-slate-300 text-xs sm:text-sm">
              Explore the surplus food listed by verified donors in the network.
            </p>
          </div>
        </div>

        {/* Directory List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Package className="w-5 h-5 text-emerald-400" />
              <span>Surplus Food Packages</span>
            </h2>
            <span className="text-xs text-slate-400 font-semibold bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20">
              {donations.length} Active Listings
            </span>
          </div>

          {donations && donations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {donations.map((item) => (
                <div key={item.id} className="glass-card p-6 rounded-3xl border border-emerald-500/30 space-y-4">
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
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                            {item.id}
                          </span>
                          <span className="text-[10px] font-bold text-blue-300 bg-blue-500/10 px-2 py-0.5 rounded">
                            {item.category}
                          </span>
                        </div>
                        <h3 className="text-base font-extrabold text-white mt-1.5">{item.foodName}</h3>
                        <p className="text-xs text-slate-300">{item.quantity} • Feeds ~{item.peopleFedCount} people</p>
                      </div>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide border ${
                      item.status === 'Distributed' || item.status === 'Delivered to NGO'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                        : item.status === 'Volunteer Accepted' || item.status === 'Food Picked Up' || item.status === 'Volunteer Travelling'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                    }`}>
                      {item.status}
                    </span>
                  </div>

                  <div className="text-xs text-slate-300 bg-emerald-950/60 p-4 rounded-2xl border border-emerald-500/20 space-y-2">
                    <p className="flex items-start gap-1">
                      <strong className="text-slate-400 font-semibold shrink-0">Pickup:</strong>
                      <span className="truncate">{item.pickupAddress}</span>
                    </p>
                    {item.recommendedNgo && (
                      <p className="flex items-start gap-1">
                        <strong className="text-slate-400 font-semibold shrink-0">NGO Recipient:</strong>
                        <span className="truncate text-blue-300 font-medium">{item.recommendedNgo.name}</span>
                      </p>
                    )}
                    {item.assignedVolunteer && (
                      <p className="flex items-start gap-1">
                        <strong className="text-slate-400 font-semibold shrink-0">Volunteer:</strong>
                        <span className="truncate text-amber-300 font-medium">{item.assignedVolunteer.name} ({item.assignedVolunteer.vehicle})</span>
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedDonation(item);
                        setActiveView('live-tracking');
                      }}
                      className="w-full py-2.5 rounded-xl bg-emerald-900/40 hover:bg-emerald-800/60 border border-emerald-500/30 text-emerald-300 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Live GPS Map</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 glass-panel rounded-3xl border border-emerald-500/20 max-w-md mx-auto">
              <AlertCircle className="w-12 h-12 text-emerald-400/50 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white">No Food Donations Listed Yet</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-[280px] mx-auto">Verified donors can submit excess food listings using the Donor dashboard.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

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

  const categories = [
    'Cooked Meals',
    'Bakery & Pastries',
    'Packaged Foods',
    'Raw Ingredients',
    'Fresh Produce',
    'Beverages & Dairy'
  ];

  const handleAutofillLocation = () => {
    setFormData((prev) => ({
      ...prev,
      pickupAddress: "Grand Hyatt Banquet Hall, 88 Grand Boulevard"
    }));
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

    if (!selectedNgo || !selectedVolunteer) {
      showToast("Please select both an NGO Recipient and a Volunteer Courier before donating.", "warning");
      return;
    }
    const payload = {
      ...formData,
      selectedNgo,
      selectedVolunteer
    };
    const created = addDonation(payload);
    showToast(`Donation Created! Awaiting acceptance from ${selectedNgo.name}.`, 'success');
    setActiveView('live-tracking');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-emerald-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>Donor Portal • {currentUser?.name}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white">Post Surplus Food for Rescue</h1>
          <p className="text-slate-300 text-xs sm:text-sm">
            AI instantly matches your food with nearby verified NGOs and assigns dispatch volunteers. Send SMS alerts directly to couriers.
          </p>
        </div>

        <div className="flex items-center gap-3 z-10">
          <div className="px-4 py-3 rounded-2xl glass-card text-center">
            <p className="text-xs text-slate-400 font-semibold">Verification</p>
            {currentUser?.verificationStatus === 'Verified' ? (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 
                {currentUser?.donorType === 'Household / Individual' ? 'Verified Household Donor' : 'FSSAI Verified Donor'}
              </span>
            ) : currentUser?.verificationStatus === 'Pending' ? (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-300">
                <AlertCircle className="w-3.5 h-3.5 text-amber-400" /> Pending Verification
              </span>
            ) : currentUser?.verificationStatus === 'Rejected' ? (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-red-300">
                <AlertCircle className="w-3.5 h-3.5 text-red-400" /> Verification Rejected
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Verified Donor
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT FORM COLUMN (7 COLS) */}
        <div className="lg:col-span-7 glass-panel p-6 sm:p-8 rounded-3xl border border-emerald-500/30 shadow-2xl space-y-6">
          <div className="flex flex-col gap-3 border-b border-emerald-500/20 pb-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Package className="w-5 h-5 text-emerald-400" />
                <span>Food Surplus Upload Form</span>
              </h2>
              <button 
                type="button"
                onClick={() => setActiveView('ai-analyzer')}
                className="text-[11px] font-bold text-emerald-300 bg-emerald-500/20 hover:bg-emerald-500/30 px-3 py-1.5 rounded-full border border-emerald-500/40 flex items-center gap-1 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Food Quality Check Tab</span>
              </button>
            </div>
            
            {(selectedNgo || selectedVolunteer) && (
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedNgo && (
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1.5 bg-blue-500/20 text-blue-300 border border-blue-500/40 rounded-lg">
                    <Building2 className="w-3 h-3" />
                    Recipient: {selectedNgo.name}
                  </span>
                )}
                {selectedVolunteer && (
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-lg">
                    <UserCircle className="w-3 h-3" />
                    Courier: {selectedVolunteer.name}
                  </span>
                )}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Food Name & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Food Item Name *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Surplus Wedding Reception Buffet"
                  value={formData.foodName}
                  onChange={(e) => setFormData({...formData, foodName: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-emerald-950/80 border border-emerald-500/30 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Food Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-emerald-950/90 border border-emerald-500/30 text-white text-xs focus:outline-none focus:border-emerald-400"
                >
                  {categories.map(c => <option key={c} value={c} className="bg-emerald-950 text-white">{c}</option>)}
                </select>
              </div>
            </div>

            {/* Quantity & Servings & Expiry */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Quantity (kg / boxes) *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. 35 kg"
                  value={formData.quantity}
                  onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-emerald-950/80 border border-emerald-500/30 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">People it can Feed *</label>
                <input 
                  type="number" 
                  required
                  placeholder="e.g. 90"
                  value={formData.peopleFedCount}
                  onChange={(e) => setFormData({...formData, peopleFedCount: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-emerald-950/80 border border-emerald-500/30 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Freshness Window (Hours) *</label>
                <input 
                  type="number" 
                  required
                  min="1"
                  max="48"
                  placeholder="e.g. 6"
                  value={formData.expiryHours}
                  onChange={(e) => setFormData({...formData, expiryHours: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-emerald-950/80 border border-emerald-500/30 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>

            {/* Address & Geolocation autofill */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300">Pickup Address *</label>
                <button
                  type="button"
                  onClick={handleAutofillLocation}
                  className="text-[11px] font-bold text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <MapPin className="w-3 h-3" /> Auto-Detect GPS Location
                </button>
              </div>
              <input 
                type="text" 
                required
                placeholder="Full address with landmark"
                value={formData.pickupAddress}
                onChange={(e) => setFormData({...formData, pickupAddress: e.target.value})}
                className="w-full px-4 py-3 rounded-xl bg-emerald-950/80 border border-emerald-500/30 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-400"
              />
            </div>

            {/* Contact Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Contact Phone Number *</label>
              <input 
                type="tel" 
                required
                placeholder="+1 (555) 000-0000"
                value={formData.contactNumber}
                onChange={(e) => setFormData({...formData, contactNumber: e.target.value})}
                className="w-full px-4 py-3 rounded-xl bg-emerald-950/80 border border-emerald-500/30 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-400"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-emerald-950 font-extrabold text-sm shadow-xl shadow-emerald-500/20 transition-all hover:scale-[1.01] flex items-center justify-center gap-2"
            >
              <HeartHandshake className="w-5 h-5 text-emerald-950" />
              <span>Donate Food & Trigger AI Smart Matching</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </form>
        </div>

        {/* RIGHT COLUMN (5 COLS) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* a. Select NGO Recipient */}
          <div className="glass-panel p-5 rounded-3xl border border-blue-500/30 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></span> 
              Select NGO Recipient
            </h2>
            {registeredNGOs && registeredNGOs.length > 0 ? (
              <div className="space-y-3">
                {registeredNGOs.map(ngo => (
                  <div key={ngo.id} className={`glass-card p-4 rounded-xl border transition-all duration-300 ${selectedNgo?.id === ngo.id ? 'border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)] bg-emerald-900/10' : 'border-blue-500/20 hover:border-blue-500/40'}`}>
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="text-white font-bold text-sm">{ngo.name}</h3>
                        <p className="text-slate-400 text-xs mt-1 flex items-start gap-1">
                          <MapPin className="w-3 h-3 mt-0.5 text-blue-400 flex-shrink-0" />
                          {ngo.address}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-3">
                          <span className="text-[10px] font-bold bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-500/30">Capacity: {ngo.capacity}</span>
                          <span className="text-[10px] font-bold bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-500/30">{ngo.foodPreference}</span>
                        </div>
                      </div>
                      <button 
                        type="button"
                        onClick={() => setSelectedNgo(selectedNgo?.id === ngo.id ? null : ngo)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all flex-shrink-0 ${selectedNgo?.id === ngo.id ? 'bg-emerald-500 text-emerald-950 hover:bg-emerald-400 shadow-lg shadow-emerald-500/20' : 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 border border-blue-500/40'}`}
                      >
                        {selectedNgo?.id === ngo.id ? 'Selected' : 'Select'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 glass-card rounded-xl border border-blue-500/10 bg-blue-950/10">
                <AlertCircle className="w-6 h-6 text-blue-400/50 mx-auto mb-2" />
                <p className="text-xs text-slate-400 max-w-[200px] mx-auto">No NGOs registered yet. Ask shelters to register via the NGOs tab.</p>
              </div>
            )}
          </div>

          {/* b. Select Volunteer Courier */}
          <div className="glass-panel p-5 rounded-3xl border border-amber-500/30 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]"></span> 
              Select Volunteer Courier
            </h2>
            {registeredVolunteers && registeredVolunteers.length > 0 ? (
              <div className="space-y-3">
                {registeredVolunteers.map(vol => (
                  <div key={vol.id} className={`glass-card p-4 rounded-xl border transition-all duration-300 ${selectedVolunteer?.id === vol.id ? 'border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)] bg-emerald-900/10' : 'border-amber-500/20 hover:border-amber-500/40'}`}>
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="text-white font-bold text-sm">{vol.name}</h3>
                        <p className="text-slate-400 text-xs mt-1 flex items-center gap-1">
                          <Phone className="w-3 h-3 text-amber-400" />
                          {vol.phone}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-3">
                          <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30 flex items-center gap-1">
                            <Truck className="w-3 h-3" />
                            {vol.vehicle}
                          </span>
                          <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {vol.operatingZone}
                          </span>
                        </div>
                      </div>
                      <button 
                        type="button"
                        onClick={() => setSelectedVolunteer(selectedVolunteer?.id === vol.id ? null : vol)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all flex-shrink-0 ${selectedVolunteer?.id === vol.id ? 'bg-emerald-500 text-emerald-950 hover:bg-emerald-400 shadow-lg shadow-emerald-500/20' : 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40'}`}
                      >
                        {selectedVolunteer?.id === vol.id ? 'Selected' : 'Select'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 glass-card rounded-xl border border-amber-500/10 bg-amber-950/10">
                <AlertCircle className="w-6 h-6 text-amber-400/50 mx-auto mb-2" />
                <p className="text-xs text-slate-400">No volunteers registered yet.</p>
              </div>
            )}
          </div>

          {/* c. Your Active Donations */}
          {donations && donations.length > 0 && (
            <div className="glass-panel p-5 rounded-3xl border border-emerald-500/30 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <span>Your Active Donations</span>
                </h2>
                <span className="text-xs text-slate-400 font-semibold bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20">{donations.length} Listed</span>
              </div>

              <div className="space-y-4">
                {donations.map((item) => (
                  <div 
                    key={item.id}
                    className="glass-card p-5 rounded-2xl space-y-4 border border-emerald-500/25 relative group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img 
                          src={item.imageUrl} 
                          alt={item.foodName}
                          className="w-14 h-14 object-cover rounded-xl border border-emerald-500/30"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150&auto=format&fit=crop&q=80";
                          }}
                        />
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                            {item.id}
                          </span>
                          <h3 className="text-sm font-bold text-white mt-1 leading-tight">{item.foodName}</h3>
                          <p className="text-[11px] text-slate-400 mt-0.5">{item.quantity} • Feeds ~{item.peopleFedCount} people</p>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide border ${
                        item.status === 'Distributed' || item.status === 'Delivered to NGO'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                          : item.status === 'Volunteer Accepted' || item.status === 'Food Picked Up'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                      }`}>
                        {item.status}
                      </span>
                    </div>

                    {/* Assigned Volunteer Details Box */}
                    <div className="bg-emerald-950/80 p-3 rounded-xl border border-emerald-500/20 text-xs text-slate-300 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <img 
                          src={item.assignedVolunteer?.photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"} 
                          alt="Volunteer"
                          className="w-8 h-8 rounded-full border border-amber-400"
                        />
                        <div>
                          <p className="text-[10px] font-bold text-amber-400 uppercase">Assigned Volunteer Courier</p>
                          <p className="font-extrabold text-white text-xs">{item.assignedVolunteer?.name || "Alex Rivera"}</p>
                        </div>
                      </div>

                      <span className="text-[10px] font-mono text-slate-400">
                        {item.assignedVolunteer?.phone || "+1 555-456-7890"}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      
                      {/* DIRECT BUTTON TO SEND VOLUNTEER DONATION RECEIVING SMS */}
                      <button
                        onClick={() => setActiveSMSDonation(item)}
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-amber-950 font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                      >
                        <Smartphone className="w-4 h-4 text-amber-950" />
                        <span>Send Donation Receiving SMS to Volunteer</span>
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setActiveQRDonation(item)}
                          className="py-2 px-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition-all flex items-center gap-1"
                        >
                          <QrCode className="w-3.5 h-3.5 text-emerald-400" />
                          <span>View QR</span>
                        </button>

                        <button
                          onClick={() => {
                            setSelectedDonation(item);
                            setActiveView('live-tracking');
                          }}
                          className="flex-1 py-2 rounded-xl bg-emerald-900/40 hover:bg-emerald-800/60 border border-emerald-500/30 text-emerald-300 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Live GPS Map</span>
                        </button>

                        <button
                          onClick={() => {
                            setSelectedDonation(item);
                            setActiveView('ai-matching');
                          }}
                          className="py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 text-xs font-extrabold transition-all"
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

      {/* QR MODAL */}
      <QRModal 
        isOpen={!!activeQRDonation}
        onClose={() => setActiveQRDonation(null)}
        donation={activeQRDonation}
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
