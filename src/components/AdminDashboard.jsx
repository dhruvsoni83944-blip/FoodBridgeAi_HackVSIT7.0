import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { getAllUsers, updateUserProfile } from '../services/db';
import { adminAPI } from '../services/api';
import { 
  ShieldCheck, 
  Users, 
  Building2, 
  HeartHandshake, 
  Clock, 
  CheckCircle2, 
  Truck,
  Utensils,
  Droplets,
  Leaf,
  Filter
} from 'lucide-react';

export const AdminDashboard = () => {
  const { donations, impactStats, registeredVolunteers, registeredNGOs, showToast } = useApp();

  const totalDonationsCount = donations.length;
  const pendingRequestsCount = donations.filter(d => d.status === 'Waiting for AI Matching' || d.status === 'Donation Created' || d.status === 'AI Matching' || d.status === 'Pending NGO Acceptance').length;
  const acceptedRequestsCount = donations.filter(d => d.status !== 'Waiting for AI Matching' && d.status !== 'Donation Created' && d.status !== 'Pending NGO Acceptance').length;

  const [usersList, setUsersList] = useState([]);
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('ALL');
  const [loadingUsers, setLoadingUsers] = useState(false);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const params = {};
      if (selectedRoleFilter !== 'ALL') {
        params.role = selectedRoleFilter;
      }
      const res = await adminAPI.getUsers(params);
      if (res?.data?.data) {
        setUsersList(res.data.data);
      }
    } catch (err) {
      console.warn("Could not fetch users via admin API, falling back to local:", err?.response?.data || err.message);
      const stored = await getAllUsers();
      const cleanStored = stored.filter(u => !u.name?.includes('Royal Horizon') && u.id !== 'usr_donor_1');
      if (selectedRoleFilter !== 'ALL') {
        setUsersList(cleanStored.filter(u => String(u.role).toUpperCase() === selectedRoleFilter));
      } else {
        setUsersList(cleanStored);
      }
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [selectedRoleFilter, registeredVolunteers, registeredNGOs]);

  const handleVerifyUser = async (id) => {
    try {
      await adminAPI.verifyUser(id, true);
    } catch {
      await updateUserProfile(id, { status: "Verified", verificationStatus: "Verified" });
    }
    setUsersList((prev) => prev.map(u => u.id === id ? { ...u, isVerified: true, status: "Verified", verificationStatus: "Verified" } : u));
    showToast(`User credentials verified! License granted.`, "success");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EBF1FE] text-[#1D52F2] text-xs font-bold border border-[#1D52F2]/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Command Center • HQ Operational Admin</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900">National FoodBridge Admin Panel</h1>
          <p className="text-slate-600 text-xs sm:text-sm">
            Monitor real-time system metrics, approve user licenses, track active volunteer dispatch, and inspect ecological impact telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-full bg-[#F0F8EC] border border-[#63A644]/30 text-[#63A644] text-xs font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#63A644] animate-ping"></span>
            System Status: 100% Operational
          </span>
        </div>
      </div>

      {/* ADMIN METRICS DASHBOARD GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-6">
        
        {/* Metric 1: Total Donations */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1D52F2]">Total Donations</span>
            <div className="p-2.5 rounded-xl bg-[#EBF1FE] text-[#1D52F2]">
              <HeartHandshake className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 font-heading">{totalDonationsCount.toLocaleString()}</div>
          <p className="text-[11px] text-slate-500">Total food donations logged</p>
        </div>

        {/* Metric 2: Pending Requests */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F26B1D]">Pending Requests</span>
            <div className="p-2.5 rounded-xl bg-[#FEF3EB] text-[#F26B1D]">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-[#F26B1D] font-heading">{pendingRequestsCount}</div>
          <p className="text-[11px] text-slate-500">Awaiting AI Match & Dispatch</p>
        </div>

        {/* Metric 3: Accepted Requests */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#63A644]">Accepted Requests</span>
            <div className="p-2.5 rounded-xl bg-[#F0F8EC] text-[#63A644]">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-[#63A644] font-heading">{acceptedRequestsCount}</div>
          <p className="text-[11px] text-slate-500">Accepted by Volunteers / NGOs</p>
        </div>

        {/* Metric 4: Active Volunteers */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F26B1D]">Active Volunteers</span>
            <div className="p-2.5 rounded-xl bg-[#FEF3EB] text-[#F26B1D]">
              <Truck className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 font-heading">{impactStats.activeVolunteers.toLocaleString()}</div>
          <p className="text-[11px] text-slate-500">On standby for quick dispatch</p>
        </div>

        {/* Metric 5: Registered NGOs */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1D52F2]">Registered NGOs</span>
            <div className="p-2.5 rounded-xl bg-[#EBF1FE] text-[#1D52F2]">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 font-heading">{impactStats.ngosConnected}</div>
          <p className="text-[11px] text-slate-500">Verified shelter partners</p>
        </div>

        {/* Metric 6: Meals Saved */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#63A644]">Meals Saved</span>
            <div className="p-2.5 rounded-xl bg-[#F0F8EC] text-[#63A644]">
              <Utensils className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-[#63A644] font-heading">{impactStats.mealsSaved.toLocaleString()}</div>
          <p className="text-[11px] text-slate-500">Surplus meals rescued</p>
        </div>

        {/* Metric 7: People Fed */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1D52F2]">People Fed</span>
            <div className="p-2.5 rounded-xl bg-[#EBF1FE] text-[#1D52F2]">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 font-heading">{impactStats.peopleFed.toLocaleString()}</div>
          <p className="text-[11px] text-slate-500">Beneficiaries served</p>
        </div>

        {/* Metric 8: Food Waste Diverted */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#63A644]">Food Waste Diverted</span>
            <div className="p-2.5 rounded-xl bg-[#F0F8EC] text-[#63A644]">
              <Leaf className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-[#63A644] font-heading">
            {(impactStats.totalWasteKg || 0) >= 1000 
              ? `${((impactStats.totalWasteKg || 0) / 1000).toFixed(2)} Tons` 
              : `${(impactStats.totalWasteKg || 0).toFixed(1)} kg`}
          </div>
          <p className="text-[11px] text-slate-500">Rescued from landfill decay</p>
        </div>

        {/* Metric 9: Water Saved */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1D52F2]">Water Saved</span>
            <div className="p-2.5 rounded-xl bg-[#EBF1FE] text-[#1D52F2]">
              <Droplets className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-[#1D52F2] font-heading">
            {(impactStats.mealsSaved * 180 / 1000).toFixed(0)}k Liters
          </div>
          <p className="text-[11px] text-slate-500">Agricultural water footprint saved</p>
        </div>

      </div>

      {/* USER VERIFICATION TABLE */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-lg font-black text-slate-900">User Directory & Governance</h2>
            <p className="text-xs text-slate-500">PostgreSQL authenticated user accounts categorized by platform role.</p>
          </div>

          {/* Role Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-[#F8FAFC] p-1.5 rounded-2xl border border-slate-200 text-xs">
            {[
              { id: 'ALL', label: 'All Users' },
              { id: 'DONOR', label: 'Donors' },
              { id: 'NGO', label: 'NGOs' },
              { id: 'VOLUNTEER', label: 'Volunteers' },
              { id: 'ADMIN', label: 'Admins' }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedRoleFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                  selectedRoleFilter === tab.id
                    ? 'bg-[#1D52F2] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] text-slate-700 uppercase font-black border-b border-slate-200">
              <tr>
                <th className="p-3">User ID & Name</th>
                <th className="p-3">Role</th>
                <th className="p-3">Email Address</th>
                <th className="p-3">Registration Date</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-600">
              {usersList && usersList.length > 0 ? (
                usersList.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-bold text-slate-900">
                      {u.name}
                      <span className="block text-[10px] text-slate-400 font-mono">{u.id}</span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        String(u.role).toUpperCase() === 'DONOR' ? 'bg-[#EBF1FE] text-[#1D52F2]' :
                        String(u.role).toUpperCase() === 'NGO' ? 'bg-[#F0F8EC] text-[#63A644]' :
                        String(u.role).toUpperCase() === 'ADMIN' ? 'bg-slate-800 text-white' : 'bg-[#FEF3EB] text-[#F26B1D]'
                      }`}>
                        {String(u.role).toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-slate-600">{u.email}</td>
                    <td className="p-3 text-slate-500">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : (u.date || u.registeredAt || 'Recent')}
                    </td>
                    <td className="p-3">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-extrabold uppercase ${
                        u.isVerified || u.verificationStatus === 'Verified' || u.status === 'Verified' ? 'text-[#63A644]' : 'text-[#F26B1D]'
                      }`}>
                        {(u.isVerified || u.verificationStatus === 'Verified' || u.status === 'Verified') ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                        {u.isVerified ? 'VERIFIED' : (u.verificationStatus || u.status || 'PENDING')}
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
                              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[11px] border border-slate-200 transition-all"
                            >
                              View Cert
                            </a>
                          )}
                          <button
                            onClick={() => handleVerifyUser(u.id)}
                            className="px-3 py-1.5 rounded-lg bg-[#63A644] hover:bg-[#4B8233] text-white font-bold text-[11px] shadow-xs transition-all cursor-pointer"
                          >
                            Approve FSSAI
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-semibold">Active License</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400">
                    <p className="font-semibold text-slate-600">No registered users found</p>
                    <p className="text-[11px] text-slate-400 mt-1">Users will appear here in real-time as they register or sign up.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
