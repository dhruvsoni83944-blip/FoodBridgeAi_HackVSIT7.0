import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { QRScannerModal } from './QRScannerModal';
import { QRModal } from './QRModal';
import { 
  Building2, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Truck, 
  ShieldCheck, 
  Eye, 
  Utensils, 
  Camera, 
  UserCheck,
  Sparkles,
  QrCode
} from 'lucide-react';

export const NGODashboard = () => {
  const { 
    donations = [], 
    markDistributionComplete, 
    setSelectedDonation, 
    setActiveView, 
    currentUser, 
    showToast, 
    addNGO, 
    registeredVolunteers = [], 
    registeredNGOs = [], 
    currentRole, 
    acceptNgoDonation,
    declineNgoDonation,
    acceptNgoRequest 
  } = useApp();

  const [activeScanItem, setActiveScanItem] = useState(null);
  const [activeQRDonation, setActiveQRDonation] = useState(null);
  const [showNgoRegForm, setShowNgoRegForm] = useState(false);

  // NGO Registration & Requirement Form State
  const [ngoData, setNgoData] = useState({
    name: currentUser?.name || '',
    contactPerson: '',
    phone: currentUser?.phone || '',
    address: '',
    dailyCapacity: '100 - 250 Beneficiaries',
    foodPreference: 'Cooked Meals & Prepared Buffets',
    coldStorage: 'Yes - Refrigerated Storage Ready'
  });

  const loggedInNgo = registeredNGOs.find(n => n.name === currentUser?.name || n.id === currentUser?.id);
  const isNgoRegistered = !!loggedInNgo;

  if (currentRole !== 'ngo') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* NGOs Shelters Directory Banner */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EBF1FE] text-[#1D52F2] text-xs font-bold border border-[#1D52F2]/30">
              <Building2 className="w-3.5 h-3.5" />
              <span>NGO Shelter Directory</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900">Verified Shelter Partners</h1>
            <p className="text-slate-600 text-xs sm:text-sm">
              List of verified community shelters, kitchens, and NGOs receiving food dispatches from the rescue network.
            </p>
          </div>
          
          <div className="px-5 py-3 rounded-2xl bg-[#F8FAFC] border border-slate-200 text-center">
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Registered NGOs</p>
            <p className="text-2xl font-black text-[#1D52F2] flex items-center justify-center gap-1.5 mt-0.5">
              <Building2 className="w-5 h-5" /> {registeredNGOs.length}
            </p>
          </div>
        </div>

        {/* Directory List */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#1D52F2]" />
            <span>Community Recipient Shelters</span>
          </h2>

          {registeredNGOs && registeredNGOs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {registeredNGOs.map(ngo => (
                <div key={ngo.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-4">
                  <div className="flex items-center gap-3.5">
                    <img 
                      src={ngo.logo || "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=150&auto=format&fit=crop&q=80"} 
                      alt={ngo.name}
                      className="w-14 h-14 rounded-2xl border-2 border-[#1D52F2]/30 object-cover shadow-xs"
                    />
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900">{ngo.name}</h3>
                      <span className="text-[10px] font-bold text-[#63A644] bg-[#F0F8EC] px-2.5 py-0.5 rounded-full border border-[#63A644]/30 inline-block mt-0.5">
                        {ngo.status || 'Verified Shelter'}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-slate-600 bg-[#F8FAFC] p-4 rounded-2xl border border-slate-200 space-y-2">
                    <p className="flex justify-between">
                      <span className="text-slate-500">Location:</span>
                      <span className="font-semibold text-slate-900 truncate max-w-[180px]">{ngo.address}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-slate-500">Daily Capacity:</span>
                      <span className="font-semibold text-[#1D52F2]">{ngo.dailyCapacity}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-slate-500">Preference:</span>
                      <span className="font-semibold text-slate-900">{ngo.foodPreference}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-slate-500">Cold Storage:</span>
                      <span className="font-semibold text-slate-900">{ngo.coldStorage}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-slate-500">Contact:</span>
                      <span className="font-mono text-slate-800 font-semibold">{ngo.phone}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 max-w-md mx-auto shadow-sm">
              <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-900">No NGOs Registered Yet</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-[280px] mx-auto">NGO Shelters can register themselves for receiving food using their NGO dashboards.</p>
            </div>
          )}
        </div>
      </div>
    );
  }


  const capacityOptions = [
    "50 - 100 Beneficiaries",
    "100 - 250 Beneficiaries",
    "250 - 500 Beneficiaries",
    "500+ Large Community Kitchen"
  ];

  const preferenceOptions = [
    "Cooked Meals & Prepared Buffets",
    "Raw Grains & Dry Ration Items",
    "Fresh Bakery & Pastries",
    "Dairy, Milk & Fresh Produce"
  ];

  const handleNgoRegisterSubmit = (e) => {
    e.preventDefault();
    if (addNGO) {
      addNGO(ngoData);
    }
    setShowNgoRegForm(false);
    showToast(`NGO Registration Successful! AI Smart Match Engine configured for ${ngoData.name}.`, 'success');
  };

  const handleAcceptDonation = (item) => {
    if (acceptNgoDonation) {
      acceptNgoDonation(item.id, currentUser);
    } else if (acceptNgoRequest) {
      acceptNgoRequest(item.id);
    } else {
      showToast(`Accepted incoming donation: ${item.foodName}. Shelter capacity reserved!`);
    }
  };

  const handleRejectDonation = (item) => {
    if (declineNgoDonation) {
      declineNgoDonation(item.id, currentUser, "Capacity full / cannot take this much food");
    } else {
      showToast(`Declined donation ${item.id}. AI re-routing to remaining shelters.`, 'info');
    }
  };

  const totalMealsReceived = donations.reduce((acc, curr) => curr.status === 'Delivered to NGO' || curr.status === 'Delivered' || curr.status === 'NGO Confirmed' || curr.status === 'Distributed' ? acc + (curr.peopleFedCount || 0) : acc, 0);
  const foodDistributedCount = donations.reduce((acc, curr) => curr.status === 'Distributed' ? acc + (curr.peopleFedCount || 0) : acc, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* NGO Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EBF1FE] text-[#1D52F2] text-xs font-bold border border-[#1D52F2]/30">
            <Building2 className="w-3.5 h-3.5" />
            <span>NGO Shelter Portal • {loggedInNgo?.name || currentUser?.name || 'Verified Shelter Partner'}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900">NGO Surplus Food Allocations</h1>
          <p className="text-slate-600 text-xs sm:text-sm">
            Review incoming food donations, accept packages to reserve shelter dining capacity, or decline if capacity is full to re-route to alternate shelters.
          </p>
        </div>

        {/* Hero Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setActiveView('ai-analyzer')}
            className="px-4 py-3 rounded-2xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-extrabold text-xs border border-purple-200 transition-all flex items-center gap-2 shadow-xs cursor-pointer"
            title="Inspect visual freshness with Gemini Vision API"
          >
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span>AI Food Quality Analyzer</span>
          </button>

          <button
            onClick={() => setShowNgoRegForm(!showNgoRegForm)}
            className="px-4 py-3 rounded-2xl bg-[#EBF1FE] hover:bg-[#1D52F2]/15 text-[#1D52F2] font-extrabold text-xs border border-[#1D52F2]/30 transition-all flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Building2 className="w-4 h-4 text-[#1D52F2]" />
            <span>{showNgoRegForm ? 'Close Requirements Form' : 'Update Shelter Requirements'}</span>
          </button>

          <span className="px-3.5 py-3 rounded-2xl bg-[#F0F8EC] border border-[#63A644]/30 text-[#63A644] text-xs font-extrabold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#63A644]" />
            <span>Verified Shelter Partner</span>
          </span>

          <span className="px-3.5 py-3 rounded-2xl bg-[#EBF1FE] border border-[#1D52F2]/30 text-[#1D52F2] text-xs font-extrabold flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-[#1D52F2]" />
            <span>{registeredNGOs?.length || 0} Registered NGOs</span>
          </span>
        </div>
      </div>

      {/* NGO REGISTRATION & REQUIREMENT PORTAL (Collapsible) */}
      {showNgoRegForm && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#1D52F2]/30 shadow-md space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-[#EBF1FE] text-[#1D52F2]">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900">NGO & Shelter Food Requirement Portal</h2>
                <p className="text-xs text-slate-500">Register your shelter details to automatically receive AI matched surplus food.</p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#F0F8EC] text-[#63A644] text-xs font-bold border border-[#63A644]/30 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#63A644]" /> Verified NGO Listing
            </span>
          </div>

          <form onSubmit={handleNgoRegisterSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">NGO / Shelter Name *</label>
                <input 
                  type="text"
                  required
                  value={ngoData.name}
                  onChange={(e) => setNgoData({...ngoData, name: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-[#F8FAFC] border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-[#1D52F2] focus:bg-white"
                  placeholder="e.g. City Community Shelter"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Contact Person & Phone *</label>
                <input 
                  type="text"
                  required
                  value={ngoData.phone}
                  onChange={(e) => setNgoData({...ngoData, phone: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-[#F8FAFC] border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-[#1D52F2] focus:bg-white font-mono"
                  placeholder="Sarah Jenkins (+1 555-987-6543)"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Shelter Delivery Address *</label>
              <input 
                type="text"
                required
                value={ngoData.address}
                onChange={(e) => setNgoData({...ngoData, address: e.target.value})}
                className="w-full px-4 py-3 rounded-xl bg-[#F8FAFC] border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-[#1D52F2] focus:bg-white"
                placeholder="88 Haven Road, Sector 7, Central District"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Daily Beneficiary Capacity *</label>
                <select
                  value={ngoData.dailyCapacity}
                  onChange={(e) => setNgoData({...ngoData, dailyCapacity: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-[#F8FAFC] border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-[#1D52F2] focus:bg-white cursor-pointer"
                >
                  {capacityOptions.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Food Category Preference *</label>
                <select
                  value={ngoData.foodPreference}
                  onChange={(e) => setNgoData({...ngoData, foodPreference: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-[#F8FAFC] border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-[#1D52F2] focus:bg-white cursor-pointer"
                >
                  {preferenceOptions.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Cold Storage Available? *</label>
                <select
                  value={ngoData.coldStorage}
                  onChange={(e) => setNgoData({...ngoData, coldStorage: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-[#F8FAFC] border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-[#1D52F2] focus:bg-white cursor-pointer"
                >
                  <option value="Yes - Refrigerated Storage Ready">Yes - Refrigerated Storage Ready</option>
                  <option value="No - Immediate Consumption Only">No - Immediate Consumption Only</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-[#1D52F2] hover:bg-[#133BB5] text-white font-black text-sm shadow-md shadow-[#1D52F2]/25 transition-all hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer"
            >
              <Building2 className="w-5 h-5" />
              <span>Register NGO & Connect AI Smart Matching Pool</span>
            </button>
          </form>
        </div>
      )}

      {/* NGO REGISTERED PROFILE SUMMARY */}
      {isNgoRegistered && (
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#EBF1FE] flex items-center justify-center text-[#1D52F2] font-bold text-lg border border-[#1D52F2]/30">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold text-slate-900">{loggedInNgo.name}</span>
                <span className="text-[10px] font-bold text-[#1D52F2] bg-[#EBF1FE] px-2.5 py-0.5 rounded-full border border-[#1D52F2]/30">VERIFIED SHELTER RECIPIENT</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{loggedInNgo.address} • Contact: {loggedInNgo.phone}</p>
            </div>
          </div>

          <div className="text-left sm:text-right text-xs text-slate-600">
            <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Daily Shelter Capacity</span>
            <span className="font-bold text-[#63A644]">{loggedInNgo.dailyCapacity}</span>
          </div>
        </div>
      )}

      {/* 4 NGO METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#1D52F2]">Meals Received Today</span>
          <div className="text-3xl font-black text-slate-900 font-heading">{totalMealsReceived}</div>
          <p className="text-[11px] text-slate-500">Delivered to shelter dining hall</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#F26B1D]">Pending Deliveries</span>
          <div className="text-3xl font-black text-[#F26B1D] font-heading">
            {donations.filter(d => d.status !== 'Delivered to NGO' && d.status !== 'Delivered' && d.status !== 'NGO Confirmed' && d.status !== 'Distributed').length}
          </div>
          <p className="text-[11px] text-slate-500">En route via courier</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#63A644]">Food Distributed</span>
          <div className="text-3xl font-black text-[#63A644] font-heading">{foodDistributedCount}</div>
          <p className="text-[11px] text-slate-500">Served to occupants</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#1D52F2]">Facility Efficiency</span>
          <div className="text-3xl font-black text-slate-900 font-heading">100%</div>
          <p className="text-[11px] text-slate-500">Zero food wasted at facility</p>
        </div>

      </div>

      {/* Available Food Donations Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Utensils className="w-5 h-5 text-[#63A644]" />
            <span>Available Food Donations</span>
          </h2>
          <span className="text-xs text-[#1D52F2] font-bold bg-[#EBF1FE] px-3 py-1 rounded-full border border-[#1D52F2]/20">{donations.length} Active Shipments</span>
        </div>

        {donations.length === 0 ? (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center shadow-sm">
            <Utensils className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-sm">No surplus food allocations available in your area right now. When donor kitchens list excess meals, they will appear here automatically for your shelter to claim.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {donations.map((item) => (
              <div 
                key={item.id}
                className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-4 relative"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  
                  <div className="flex items-center gap-4">
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
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-[#1D52F2] bg-[#EBF1FE] px-2 py-0.5 rounded border border-[#1D52F2]/20">
                          {item.id}
                        </span>
                        <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                          Category: {item.category}
                        </span>
                      </div>
                      <h3 className="text-base font-extrabold text-slate-900 mt-1">{item.foodName}</h3>
                      <p className="text-xs text-slate-500">
                        Quantity: <strong className="text-slate-900">{item.quantity}</strong> • Can feed: <strong className="text-[#63A644]">~{item.peopleFedCount} occupants</strong>
                      </p>
                    </div>
                  </div>

                  {/* Delivery Courier status */}
                  {/* NGO & Courier Details Box */}
                  <div className="bg-[#F8FAFC] p-3 rounded-2xl border border-slate-200 text-xs text-slate-700 space-y-1.5 md:w-72">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400">Registered Donor & Pickup</p>
                      <p className="font-bold text-slate-900 truncate">
                        {item.donorName || 'Registered Donor'} • {item.pickupAddress || 'Local Location'}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400">Assigned Courier</p>
                      <p className="font-bold text-slate-900 flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-[#F26B1D]" />
                        <span>{item.acceptedVolunteer?.name || item.assignedVolunteer?.name || 'Assigned Courier'}</span>
                      </p>
                    </div>
                    <p className="text-[11px] text-[#1D52F2] font-bold">
                      Status: {item.status}
                    </p>
                  </div>

                  {/* NGO Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2">
                    {(() => {
                      const myName = currentUser?.name || loggedInNgo?.name || 'NGO Shelter';
                      const isAcceptedByMe = item.acceptedNgo?.name?.toLowerCase() === myName.toLowerCase();
                      const isDeclinedByMe = item.declinedNgos?.some(n => (typeof n === 'string' ? n : n?.name)?.toLowerCase() === myName.toLowerCase());
                      const isClaimedByOther = item.acceptedNgo && !isAcceptedByMe;

                      if (item.status === 'Distributed') {
                        return (
                          <span className="px-4 py-2 rounded-xl bg-[#F0F8EC] text-[#63A644] font-extrabold text-xs border border-[#63A644]/30 flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-[#63A644]" />
                            <span>Meal Distribution Completed</span>
                          </span>
                        );
                      }

                      if (item.status === 'Delivered' || item.status === 'NGO Confirmed') {
                        return (
                          <span className="px-4 py-2 rounded-xl bg-[#F0F8EC] text-[#63A644] font-extrabold text-xs border border-[#63A644]/30 flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-[#63A644]" />
                            <span>Food Delivered & Verified</span>
                          </span>
                        );
                      }

                      if (isAcceptedByMe) {
                        return (
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="px-3 py-2 rounded-xl bg-[#F0F8EC] text-[#63A644] text-xs font-black border border-[#63A644]/30 flex items-center gap-1.5">
                              <CheckCircle2 className="w-4 h-4 text-[#63A644]" />
                              <span>Accepted by Your Shelter</span>
                            </span>

                            {/* Button for NGO to show their Delivery QR Pass */}
                            <button
                              onClick={() => setActiveQRDonation(item)}
                              className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-xs border border-slate-200 flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                              title="Show this QR to Volunteer Courier upon arrival at shelter to confirm delivery"
                            >
                              <QrCode className="w-4 h-4 text-[#63A644]" />
                              <span>Show Delivery QR</span>
                            </button>

                            {/* Alternative: NGO confirms or scans receiver pass */}
                            <button
                              onClick={() => setActiveScanItem(item)}
                              className="px-3.5 py-2.5 rounded-xl bg-[#1D52F2] hover:bg-[#133BB5] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                              title="Confirm delivery receipt"
                            >
                              <Camera className="w-4 h-4" />
                              <span>Confirm Receipt</span>
                            </button>
                          </div>
                        );
                      }

                      if (isDeclinedByMe) {
                        return (
                          <div className="flex items-center gap-2">
                            <span className="px-3 py-2 rounded-xl bg-red-50 text-red-600 text-xs font-bold border border-red-200 flex items-center gap-1.5">
                              <XCircle className="w-4 h-4 text-red-500" />
                              <span>Declined (Capacity Full)</span>
                            </span>
                            <button
                              onClick={() => handleAcceptDonation(item)}
                              className="px-3 py-2 rounded-xl bg-[#EBF1FE] hover:bg-[#1D52F2]/20 text-[#1D52F2] font-bold text-xs border border-[#1D52F2]/30 cursor-pointer"
                            >
                              Undo & Accept
                            </button>
                          </div>
                        );
                      }

                      if (isClaimedByOther) {
                        return (
                          <span className="px-3 py-2 rounded-xl bg-slate-100 text-slate-600 text-xs font-semibold border border-slate-200">
                            Claimed by {item.acceptedNgo.name}
                          </span>
                        );
                      }

                      // Open for this shelter to Accept or Decline
                      return (
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                          <button
                            onClick={() => handleAcceptDonation(item)}
                            className="px-4 py-2.5 rounded-xl bg-[#63A644] hover:bg-[#4B8233] text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all hover:scale-[1.02] cursor-pointer"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Accept Food Donation</span>
                          </button>

                          <button
                            onClick={() => handleRejectDonation(item)}
                            className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-red-50 text-red-600 font-bold text-xs border border-slate-200 hover:border-red-200 flex items-center justify-center gap-1 cursor-pointer transition-colors"
                            title="Decline if shelter capacity is full or cannot accommodate this food"
                          >
                            <XCircle className="w-4 h-4" />
                            <span>Decline (Capacity Full)</span>
                          </button>
                        </div>
                      );
                    })()}

                    <button
                      onClick={() => {
                        setSelectedDonation(item);
                        setActiveView('ai-analyzer');
                      }}
                      className="px-3 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs border border-purple-200 flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                      title="Inspect Food Quality with Gemini Vision"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                      <span>Inspect Quality</span>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedDonation(item);
                        setActiveView('live-tracking');
                      }}
                      className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 cursor-pointer transition-colors shrink-0"
                      title="Track Courier Map"
                    >
                      <Eye className="w-4 h-4 text-[#1D52F2]" />
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Registered Volunteer Couriers Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Truck className="w-5 h-5 text-[#F26B1D]" />
            <span>Registered Volunteer Couriers</span>
          </h2>
          <span className="text-xs text-[#F26B1D] font-bold bg-[#FEF3EB] px-3 py-1 rounded-full border border-[#F26B1D]/20">{registeredVolunteers?.length || 0} Available Couriers</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {registeredVolunteers?.length > 0 ? (
            registeredVolunteers.map((vol, index) => (
              <div key={index} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#FEF3EB] flex items-center justify-center text-[#F26B1D] border border-[#F26B1D]/20">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">{vol.name}</h3>
                  <p className="text-[11px] text-slate-500">{vol.phone} • {vol.vehicle}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full bg-white p-6 rounded-2xl border border-slate-200 text-center shadow-sm">
              <p className="text-slate-500 text-sm">No registered volunteer couriers yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* QR CAMERA SCANNER MODAL */}
      <QRScannerModal 
        isOpen={!!activeScanItem}
        onClose={() => setActiveScanItem(null)}
        donation={activeScanItem}
        scanType="delivery"
      />

      {/* NGO SHELTER DELIVERY QR MODAL */}
      <QRModal 
        isOpen={!!activeQRDonation}
        onClose={() => setActiveQRDonation(null)}
        donation={activeQRDonation}
        type="delivery"
      />

    </div>
  );
};
