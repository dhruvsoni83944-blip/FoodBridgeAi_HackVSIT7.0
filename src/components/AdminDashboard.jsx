import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  Users, 
  Building2, 
  HeartHandshake, 
  Clock, 
  BarChart3, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  Truck,
  Utensils,
  Leaf,
  Droplets,
  Globe
} from 'lucide-react';

export const AdminDashboard = () => {
  const { donations, impactStats, showToast } = useApp();

  const totalDonationsCount = 12480 + donations.length;
  const pendingRequestsCount = donations.filter(d => d.status === 'Waiting for AI Matching' || d.status === 'Donation Created' || d.status === 'AI Matching').length;
  const acceptedRequestsCount = donations.filter(d => d.status !== 'Waiting for AI Matching' && d.status !== 'Donation Created').length;

  const [usersList, setUsersList] = useState([
    { id: "usr_d1", name: "Grand Palace Hotel", role: "Donor", email: "contact@grandpalace.com", status: "Verified", date: "2026-07-20" },
    { id: "usr_n1", name: "Hope Shelter", role: "NGO", email: "dispatch@hopeshelter.org", status: "Verified", date: "2026-07-18" },
    { id: "usr_v1", name: "Alex Rivera", role: "Volunteer", email: "alex.r@gmail.com", status: "Verified", date: "2026-07-21" },
    { id: "usr_d2", name: "Oceanic Seafood Buffet", role: "Donor", email: "donations@oceanic.com", status: "Pending Verification", date: "2026-07-24" },
    { id: "usr_n2", name: "Sunshine Care Home", role: "NGO", email: "info@sunshinecare.org", status: "Verified", date: "2026-07-15" },
  ]);

  const handleVerifyUser = (id) => {
    setUsersList((prev) => prev.map(u => u.id === id ? { ...u, status: "Verified" } : u));
    showToast(`User ${id} credentials verified! License granted.`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-emerald-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Command Center • HQ Operational Admin</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white">National FoodBridge Admin Panel</h1>
          <p className="text-slate-300 text-xs sm:text-sm">
            Monitor real-time system metrics, approve user licenses, track active volunteer dispatch, and inspect ecological impact telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            System Status: 100% Operational
          </span>
        </div>
      </div>

      {/* ADMIN METRICS DASHBOARD GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-6">
        
        {/* Metric 1: Total Donations */}
        <div className="glass-panel p-6 rounded-3xl border border-emerald-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Total Donations</span>
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
              <HeartHandshake className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white font-heading">{totalDonationsCount.toLocaleString()}</div>
          <p className="text-[11px] text-slate-400">Total food donations logged</p>
        </div>

        {/* Metric 2: Pending Requests */}
        <div className="glass-panel p-6 rounded-3xl border border-emerald-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Pending Requests</span>
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-amber-300 font-heading">{pendingRequestsCount}</div>
          <p className="text-[11px] text-slate-400">Awaiting AI Match & Dispatch</p>
        </div>

        {/* Metric 3: Accepted Requests */}
        <div className="glass-panel p-6 rounded-3xl border border-emerald-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Accepted Requests</span>
            <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-blue-300 font-heading">{acceptedRequestsCount}</div>
          <p className="text-[11px] text-slate-400">Accepted by Volunteers / NGOs</p>
        </div>

        {/* Metric 4: Active Volunteers */}
        <div className="glass-panel p-6 rounded-3xl border border-emerald-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Active Volunteers</span>
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
              <Truck className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white font-heading">{impactStats.activeVolunteers.toLocaleString()}</div>
          <p className="text-[11px] text-slate-400">On standby for quick dispatch</p>
        </div>

        {/* Metric 5: Registered NGOs */}
        <div className="glass-panel p-6 rounded-3xl border border-emerald-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Registered NGOs</span>
            <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white font-heading">{impactStats.ngosConnected}</div>
          <p className="text-[11px] text-slate-400">Verified shelter partners</p>
        </div>

        {/* Metric 6: Meals Saved */}
        <div className="glass-panel p-6 rounded-3xl border border-emerald-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Meals Saved</span>
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
              <Utensils className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-emerald-400 font-heading">{impactStats.mealsSaved.toLocaleString()}</div>
          <p className="text-[11px] text-slate-400">Surplus meals rescued</p>
        </div>

        {/* Metric 7: People Fed */}
        <div className="glass-panel p-6 rounded-3xl border border-emerald-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400">People Fed</span>
            <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white font-heading">{impactStats.peopleFed.toLocaleString()}</div>
          <p className="text-[11px] text-slate-400">Beneficiaries served</p>
        </div>

        {/* Metric 8: Carbon Reduction */}
        <div className="glass-panel p-6 rounded-3xl border border-emerald-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Carbon Reduction</span>
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
              <Globe className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-emerald-300 font-heading">
            {(impactStats.carbonSavedKg / 1000).toFixed(1)} Tons
          </div>
          <p className="text-[11px] text-slate-400">CO2e emissions prevented</p>
        </div>

        {/* Metric 9: Water Saved */}
        <div className="glass-panel p-6 rounded-3xl border border-emerald-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Water Saved</span>
            <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400">
              <Droplets className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-blue-300 font-heading">
            {(impactStats.mealsSaved * 180 / 1000).toFixed(0)}k Liters
          </div>
          <p className="text-[11px] text-slate-400">Agricultural water footprint saved</p>
        </div>

      </div>

      {/* USER VERIFICATION TABLE */}
      <div className="glass-panel p-6 rounded-3xl border border-emerald-500/30 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-emerald-500/20 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white">User Verification & Governance</h2>
            <p className="text-xs text-slate-400">Approve organization credentials and manage access permissions.</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-emerald-950/80 text-emerald-400 uppercase font-extrabold border-b border-emerald-500/20">
              <tr>
                <th className="p-3">User ID & Name</th>
                <th className="p-3">Role</th>
                <th className="p-3">Email Address</th>
                <th className="p-3">Registration Date</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-500/10 text-slate-300">
              {usersList.map((u) => (
                <tr key={u.id} className="hover:bg-emerald-900/20 transition-colors">
                  <td className="p-3 font-bold text-white">
                    {u.name}
                    <span className="block text-[10px] text-slate-500 font-mono">{u.id}</span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      u.role === 'donor' || u.role === 'Donor' ? 'bg-emerald-500/20 text-emerald-300' :
                      u.role === 'ngo' || u.role === 'NGO' ? 'bg-blue-500/20 text-blue-300' : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="p-3 font-mono">{u.email}</td>
                  <td className="p-3 text-slate-400">{u.date || u.registeredAt || 'Recent'}</td>
                  <td className="p-3">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-extrabold uppercase ${
                      u.verificationStatus === 'Verified' || u.status === 'Verified' ? 'text-emerald-400' : 'text-amber-400'
                    }`}>
                      {(u.verificationStatus === 'Verified' || u.status === 'Verified') ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                      {u.verificationStatus || u.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    {(u.verificationStatus === 'Pending' || u.status === 'Pending Verification') ? (
                      <div className="flex justify-end gap-2">
                        {u.fssaiCertificate && (
                          <a 
                            href={u.fssaiCertificate} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 font-bold text-[11px] border border-blue-500/30 transition-all"
                          >
                            View Cert
                          </a>
                        )}
                        <button
                          onClick={() => handleVerifyUser(u.id)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-[11px] shadow-sm transition-all"
                        >
                          Approve FSSAI
                        </button>
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-500 font-semibold">Active License</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
