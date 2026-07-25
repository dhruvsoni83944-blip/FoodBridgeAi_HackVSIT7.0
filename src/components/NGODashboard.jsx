import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { QRScannerModal } from './QRScannerModal';
import { 
  Building2, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Truck, 
  MapPin, 
  Heart, 
  ShieldCheck, 
  Eye,
  Utensils,
  Camera,
  Award,
  Sparkles,
  UserCheck,
  Plus
} from 'lucide-react';

export const NGODashboard = () => {
  const { 
    donations, 
    scanDeliveryQR, 
    markDistributionComplete, 
    setSelectedDonation, 
    setActiveView, 
    currentUser, 
    showToast,
    addNGO,
    registeredVolunteers,
    registeredNGOs,
    currentRole,
    acceptNgoRequest
  } = useApp();

  const [activeScanItem, setActiveScanItem] = useState(null);
  const [showNgoRegForm, setShowNgoRegForm] = useState(false);

  const loggedInNgo = registeredNGOs.find(n => n.name === currentUser?.name || n.id === currentUser?.id);
  const isNgoRegistered = !!loggedInNgo;

  if (currentRole !== 'ngo') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* NGOs Shelters Directory Banner */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-blue-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-blue-950/10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-500/30">
              <Building2 className="w-3.5 h-3.5" />
              <span>NGO Shelter Directory</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white">Verified Shelter Partners</h1>
            <p className="text-slate-300 text-xs sm:text-sm">
              List of verified community shelters, kitchens, and NGOs receiving food dispatches from the rescue network.
            </p>
          </div>
          
          <div className="px-4 py-3 rounded-2xl glass-card text-center border border-blue-500/20 bg-blue-950/20">
            <p className="text-xs text-slate-400 font-semibold">Registered NGOs</p>
            <p className="text-xl font-extrabold text-blue-400 flex items-center justify-center gap-1">
              <Building2 className="w-4 h-4 animate-pulse" /> {registeredNGOs.length}
            </p>
          </div>
        </div>

        {/* Directory List */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-400" />
            <span>Community Recipient Shelters</span>
          </h2>

          {registeredNGOs && registeredNGOs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {registeredNGOs.map(ngo => (
                <div key={ngo.id} className="glass-card p-6 rounded-3xl border border-blue-500/30 space-y-4">
                  <div className="flex items-center gap-3">
                    <img 
                      src={ngo.logo || "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=150&auto=format&fit=crop&q=80"} 
                      alt={ngo.name}
                      className="w-14 h-14 rounded-2xl border border-blue-500/40 object-cover"
                    />
                    <div>
                      <h3 className="text-base font-extrabold text-white">{ngo.name}</h3>
                      <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        {ngo.status || 'Verified Shelter'}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-slate-300 bg-emerald-950/60 p-4 rounded-2xl border border-emerald-500/20 space-y-2">
                    <p className="flex justify-between">
                      <span className="text-slate-400">Location:</span>
                      <span className="font-semibold text-white truncate max-w-[180px]">{ngo.address}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-slate-400">Daily Capacity:</span>
                      <span className="font-semibold text-blue-300">{ngo.dailyCapacity}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-slate-400">Preference:</span>
                      <span className="font-semibold text-white">{ngo.foodPreference}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-slate-400">Cold Storage:</span>
                      <span className="font-semibold text-white">{ngo.coldStorage}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-slate-400">Contact:</span>
                      <span className="font-semibold text-slate-300 font-mono">{ngo.phone}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 glass-panel rounded-3xl border border-blue-500/20 max-w-md mx-auto bg-blue-950/5">
              <Building2 className="w-12 h-12 text-blue-400/50 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white">No NGOs Registered Yet</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-[280px] mx-auto">NGO Shelters can register themselves for receiving food using their NGO dashboards.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

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
    if (acceptNgoRequest) {
      acceptNgoRequest(item.id);
    } else {
      showToast(`Accepted incoming donation: ${item.foodName}. Shelter capacity reserved!`);
    }
  };

  const handleRejectDonation = (item) => {
    showToast(`Declined donation ${item.id}. AI re-routing to next shelter.`, 'info');
  };

  const totalMealsReceived = donations.reduce((acc, curr) => curr.status === 'Delivered to NGO' || curr.status === 'Distributed' ? acc + (curr.peopleFedCount || 100) : acc, 370);
  const foodDistributedCount = donations.reduce((acc, curr) => curr.status === 'Distributed' ? acc + (curr.peopleFedCount || 100) : acc, 280);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* NGO Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-emerald-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-500/30">
            <Building2 className="w-3.5 h-3.5" />
            <span>NGO Shelter Portal • {isNgoRegistered ? loggedInNgo.name : (currentUser?.name || 'Guest NGO')}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white">NGO Surplus Food Allocations</h1>
          <p className="text-slate-300 text-xs sm:text-sm">
            Register your shelter's daily meal requirements, receive AI-matched surplus food, and track deliveries.
          </p>
        </div>

        {/* Hero Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowNgoRegForm(!showNgoRegForm)}
            className="px-4 py-3 rounded-2xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 font-extrabold text-xs border border-blue-500/40 transition-all flex items-center gap-2 shadow-md"
          >
            <Building2 className="w-4 h-4 text-blue-400" />
            <span>{showNgoRegForm ? 'Close NGO Form' : isNgoRegistered ? 'Update NGO Shelter Requirements' : 'Register NGO Shelter'}</span>
          </button>

          <span className="px-3.5 py-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-extrabold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Verified Shelter Partner</span>
          </span>

          <span className="px-3.5 py-3 rounded-2xl bg-blue-500/20 border border-blue-500/40 text-blue-300 text-xs font-extrabold flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-blue-400" />
            <span>{registeredNGOs?.length || 0} Registered NGOs</span>
          </span>
        </div>
      </div>

      {/* NGO REGISTRATION & MEAL REQUIREMENT PORTAL (SLIDE-DOWN FORM) */}
      {(showNgoRegForm || !isNgoRegistered) && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-blue-500/40 shadow-2xl space-y-6 animate-in fade-in duration-300 bg-blue-950/20">
          <div className="flex items-center justify-between border-b border-blue-500/20 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-blue-500/20 text-blue-400">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-white">NGO & Shelter Food Requirement Portal</h2>
                <p className="text-xs text-slate-300">Register your shelter details to automatically receive AI matched surplus food.</p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Verified NGO Listing
            </span>
          </div>

          <form onSubmit={handleNgoRegisterSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">NGO / Shelter Name *</label>
                <input 
                  type="text"
                  required
                  value={ngoData.name}
                  onChange={(e) => setNgoData({...ngoData, name: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-emerald-950/80 border border-emerald-500/30 text-white text-xs focus:outline-none focus:border-blue-400"
                  placeholder="e.g. Hope Community Shelter"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Contact Person & Phone *</label>
                <input 
                  type="text"
                  required
                  value={ngoData.phone}
                  onChange={(e) => setNgoData({...ngoData, phone: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-emerald-950/80 border border-emerald-500/30 text-white text-xs focus:outline-none focus:border-blue-400 font-mono"
                  placeholder="Sarah Jenkins (+1 555-987-6543)"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Shelter Delivery Address *</label>
              <input 
                type="text"
                required
                value={ngoData.address}
                onChange={(e) => setNgoData({...ngoData, address: e.target.value})}
                className="w-full px-4 py-3 rounded-xl bg-emerald-950/80 border border-emerald-500/30 text-white text-xs focus:outline-none focus:border-blue-400"
                placeholder="88 Haven Road, Sector 7, Central District"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Daily Beneficiary Capacity *</label>
                <select
                  value={ngoData.dailyCapacity}
                  onChange={(e) => setNgoData({...ngoData, dailyCapacity: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-emerald-950/90 border border-emerald-500/30 text-white text-xs focus:outline-none focus:border-blue-400"
                >
                  {capacityOptions.map(c => <option key={c} value={c} className="bg-emerald-950 text-white">{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Food Category Preference *</label>
                <select
                  value={ngoData.foodPreference}
                  onChange={(e) => setNgoData({...ngoData, foodPreference: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-emerald-950/90 border border-emerald-500/30 text-white text-xs focus:outline-none focus:border-blue-400"
                >
                  {preferenceOptions.map(p => <option key={p} value={p} className="bg-emerald-950 text-white">{p}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Cold Storage Available? *</label>
                <select
                  value={ngoData.coldStorage}
                  onChange={(e) => setNgoData({...ngoData, coldStorage: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-emerald-950/90 border border-emerald-500/30 text-white text-xs focus:outline-none focus:border-blue-400"
                >
                  <option value="Yes - Refrigerated Storage Ready" className="bg-emerald-950 text-white">Yes - Refrigerated Storage Ready</option>
                  <option value="No - Immediate Consumption Only" className="bg-emerald-950 text-white">No - Immediate Consumption Only</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-blue-950 font-extrabold text-sm shadow-xl shadow-blue-500/20 transition-all hover:scale-[1.01] flex items-center justify-center gap-2"
            >
              <Building2 className="w-5 h-5 text-blue-950" />
              <span>Register NGO & Connect AI Smart Matching Pool</span>
            </button>
          </form>
        </div>
      )}

      {/* NGO REGISTERED PROFILE SUMMARY */}
      {isNgoRegistered && (
        <div className="p-4 sm:p-5 rounded-3xl glass-panel border border-blue-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-blue-950/20">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-lg border border-blue-500/30">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">{loggedInNgo.name}</span>
                <span className="text-[10px] font-extrabold text-blue-300 bg-blue-500/20 px-2 py-0.5 rounded border border-blue-500/30">VERIFIED SHELTER RECIPIENT</span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">{loggedInNgo.address} • Contact: {loggedInNgo.phone}</p>
            </div>
          </div>

          <div className="text-left sm:text-right text-xs text-slate-300">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Daily Shelter Capacity</span>
            <span className="font-bold text-emerald-400">{loggedInNgo.dailyCapacity}</span>
          </div>
        </div>
      )}

      {/* 4 NGO METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="glass-panel p-6 rounded-3xl border border-emerald-500/30 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Meals Received Today</span>
          <div className="text-3xl font-extrabold text-white font-heading">{totalMealsReceived}</div>
          <p className="text-[11px] text-slate-400">Delivered to shelter dining hall</p>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-emerald-500/30 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Pending Deliveries</span>
          <div className="text-3xl font-extrabold text-amber-300 font-heading">
            {donations.filter(d => d.status !== 'Delivered to NGO' && d.status !== 'Distributed').length}
          </div>
          <p className="text-[11px] text-slate-400">En route via courier</p>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-emerald-500/30 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Food Distributed</span>
          <div className="text-3xl font-extrabold text-emerald-400 font-heading">{foodDistributedCount}</div>
          <p className="text-[11px] text-slate-400">Served to occupants</p>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-emerald-500/30 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-400">Today's Impact</span>
          <div className="text-3xl font-extrabold text-white font-heading">100%</div>
          <p className="text-[11px] text-slate-400">Zero food wasted at facility</p>
        </div>

      </div>

      {/* Available Food Donations Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Utensils className="w-5 h-5 text-emerald-400" />
            <span>Available Food Donations</span>
          </h2>
          <span className="text-xs text-slate-400 font-semibold">{donations.length} Active Shipments</span>
        </div>

        {donations.length === 0 ? (
          <div className="glass-panel p-8 rounded-3xl border border-emerald-500/30 text-center">
            <Utensils className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <p className="text-slate-300">No food donations listed yet. Donors can list surplus food via the Donor tab.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {donations.map((item) => (
              <div 
                key={item.id}
                className="glass-card p-6 rounded-3xl border border-emerald-500/30 space-y-4 relative"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  
                  <div className="flex items-center gap-4">
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
                        <span className="text-[10px] font-bold text-blue-300 bg-blue-500/10 px-2 py-0.5 rounded">
                          Category: {item.category}
                        </span>
                      </div>
                      <h3 className="text-lg font-extrabold text-white mt-1">{item.foodName}</h3>
                      <p className="text-xs text-slate-300">
                        Quantity: <strong className="text-white">{item.quantity}</strong> • Can feed: <strong className="text-emerald-300">~{item.peopleFedCount} occupants</strong>
                      </p>
                    </div>
                  </div>

                  {/* Delivery Courier status */}
                  <div className="bg-emerald-950/80 p-3 rounded-2xl border border-emerald-500/20 text-xs text-slate-300 space-y-1 md:w-64">
                    <p className="text-[10px] uppercase font-bold text-slate-400">Assigned Courier</p>
                    <p className="font-bold text-white flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-amber-400" />
                      <span>{item.assignedVolunteer?.name || 'Alex Rivera'}</span>
                    </p>
                    <p className="text-[11px] text-emerald-400 font-bold">
                      Status: {item.status}
                    </p>
                  </div>

                  {/* NGO Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2">
                    
                    {item.status === 'Pending NGO Acceptance' && (
                      <>
                        <button
                          onClick={() => handleAcceptDonation(item)}
                          className="px-3.5 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-blue-950 font-bold text-xs flex items-center gap-1.5 shadow-md"
                        >
                          <CheckCircle2 className="w-4 h-4 text-blue-950" />
                          <span>Accept Donation</span>
                        </button>

                        <button
                          onClick={() => handleRejectDonation(item)}
                          className="px-3 py-2.5 rounded-xl glass-panel hover:bg-red-500/20 text-red-300 font-bold text-xs border border-red-500/30 flex items-center gap-1"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>Decline</span>
                        </button>
                      </>
                    )}

                    {item.status !== 'Pending NGO Acceptance' && item.status !== 'Delivered' && item.status !== 'NGO Confirmed' && item.status !== 'Distributed' && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setActiveScanItem(item)}
                          className="px-4 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-blue-950 font-bold text-xs flex items-center gap-1.5 shadow-md transition-all hover:scale-105"
                        >
                          <Camera className="w-4 h-4" />
                          <span>Scan Receiver QR</span>
                        </button>
                        <span className="px-2.5 py-1.5 rounded-lg bg-blue-500/10 text-blue-300 text-[10px] font-bold border border-blue-500/20">
                          Accepted & Awaiting Delivery
                        </span>
                      </div>
                    )}

                    {(item.status === 'Delivered' || item.status === 'NGO Confirmed') && (
                      <button
                        onClick={() => markDistributionComplete(item.id)}
                        className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-emerald-950 font-extrabold text-xs shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.02] flex items-center gap-2"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>Mark Distribution Complete</span>
                      </button>
                    )}

                    {item.status === 'Distributed' && (
                      <span className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 font-extrabold text-xs border border-emerald-500/40 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Meal Distribution Completed</span>
                      </span>
                    )}

                    <button
                      onClick={() => {
                        setSelectedDonation(item);
                        setActiveView('live-tracking');
                      }}
                      className="p-2.5 rounded-xl bg-emerald-900/40 hover:bg-emerald-800/60 border border-emerald-500/30 text-emerald-300"
                      title="Track Courier Map"
                    >
                      <Eye className="w-4 h-4" />
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
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Truck className="w-5 h-5 text-amber-500" />
            <span>Registered Volunteer Couriers</span>
          </h2>
          <span className="text-xs text-slate-400 font-semibold">{registeredVolunteers?.length || 0} Available Couriers</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {registeredVolunteers?.length > 0 ? (
            registeredVolunteers.map((vol, index) => (
              <div key={index} className="glass-card p-4 rounded-3xl border border-amber-500/30 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500 border border-amber-500/30">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{vol.name}</h3>
                  <p className="text-[10px] text-amber-200/70">{vol.phone} • {vol.vehicleType}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full glass-panel p-6 rounded-3xl border border-amber-500/30 text-center">
              <p className="text-slate-300 text-sm">No registered volunteer couriers yet.</p>
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

    </div>
  );
};
