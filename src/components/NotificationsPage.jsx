import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Bell, 
  CheckCircle2, 
  Truck, 
  Building2, 
  HeartHandshake,
  Clock, 
  Sparkles, 
  Check,
  ShieldCheck,
  Filter,
  User
} from 'lucide-react';

export const NotificationsPage = () => {
  const { 
    notifications, 
    userNotifications = [], 
    markNotificationsRead, 
    currentRole, 
    currentUser 
  } = useApp();

  const [viewScope, setViewScope] = useState('personal'); // 'personal' | 'all'

  // Decide which notifications to display
  const displayedList = (viewScope === 'all' && currentRole === 'admin') 
    ? notifications 
    : userNotifications;

  const roleColor = currentRole === 'volunteer' 
    ? 'text-[#F26B1D] bg-[#FEF3EB] border-[#F26B1D]/20' 
    : currentRole === 'ngo' 
    ? 'text-[#63A644] bg-[#F0F8EC] border-[#63A644]/20' 
    : 'text-[#1D52F2] bg-[#EBF1FE] border-[#1D52F2]/20';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EBF1FE] text-[#1D52F2] text-xs font-bold border border-[#1D52F2]/30">
            <Bell className="w-3.5 h-3.5" />
            <span>Distributed Notification Hub</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 mt-1">Live Notifications</h1>
          
          <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-500">
            <span>Inbox for:</span>
            <span className={`px-2 py-0.5 rounded-full font-bold border ${roleColor} flex items-center gap-1`}>
              <User className="w-3 h-3" />
              <span>{currentUser?.name || 'Dhruv'}</span>
              <span className="opacity-60">• {currentRole.toUpperCase()}</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {currentRole === 'admin' && (
            <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 text-xs font-bold">
              <button
                onClick={() => setViewScope('personal')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  viewScope === 'personal' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Personal ({userNotifications.length})
              </button>
              <button
                onClick={() => setViewScope('all')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  viewScope === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                All Platform ({notifications.length})
              </button>
            </div>
          )}

          <button
            onClick={markNotificationsRead}
            className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0"
          >
            <Check className="w-4 h-4 text-[#63A644]" />
            <span>Mark All Read</span>
          </button>
        </div>
      </div>

      {/* Notification Cards List */}
      <div className="space-y-4">
        {displayedList.length === 0 ? (
          <div className="text-center py-16 bg-white border border-slate-200 rounded-3xl space-y-3 shadow-sm px-6">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#EBF1FE] flex items-center justify-center text-[#1D52F2]">
              <Bell className="w-7 h-7 text-[#1D52F2]/60" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900">No Notifications for Your Profile Yet</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              You are viewing the distributed inbox for <strong>{currentUser?.name || 'Dhruv'}</strong> ({currentRole.toUpperCase()}). When donors publish surplus food, shelters accept, and couriers complete QR handovers, your personalized notifications will appear here.
            </p>
          </div>
        ) : (
          displayedList.map((n) => {
            const isVolunteer = n.type === 'volunteer' || n.targetRole === 'volunteer';
            const isNGO = n.type === 'ngo' || n.targetRole === 'ngo';
            const isDelivered = n.type === 'delivered';
            const isDonor = n.type === 'donor' || n.targetRole === 'donor';

            return (
              <div 
                key={n.id}
                className={`p-5 rounded-2xl border transition-all flex items-start justify-between gap-4 bg-white shadow-xs hover:shadow-sm ${
                  !n.read 
                    ? 'border-[#1D52F2]/40 bg-[#EBF1FE]/25 ring-1 ring-[#1D52F2]/10' 
                    : 'border-slate-200'
                }`}
              >
                <div className="flex items-start gap-4">
                  
                  {/* Category / Role Icon */}
                  <div className={`p-3 rounded-2xl shrink-0 ${
                    isDelivered 
                      ? 'bg-[#F0F8EC] text-[#63A644]' 
                      : isVolunteer 
                      ? 'bg-[#FEF3EB] text-[#F26B1D]' 
                      : isNGO 
                      ? 'bg-[#F0F8EC] text-[#63A644]' 
                      : 'bg-[#EBF1FE] text-[#1D52F2]'
                  }`}>
                    {isDelivered ? (
                      <CheckCircle2 className="w-5 h-5 text-[#63A644]" />
                    ) : isVolunteer ? (
                      <Truck className="w-5 h-5 text-[#F26B1D]" />
                    ) : isNGO ? (
                      <Building2 className="w-5 h-5 text-[#63A644]" />
                    ) : (
                      <HeartHandshake className="w-5 h-5 text-[#1D52F2]" />
                    )}
                  </div>

                  <div className="space-y-1.5">
                    {/* Header with Title & Recipient Tag */}
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-extrabold text-slate-900">{n.title}</h3>
                      
                      {/* Recipient Targeting Tag */}
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        isVolunteer
                          ? 'bg-[#FEF3EB] text-[#F26B1D] border-[#F26B1D]/20'
                          : isNGO
                          ? 'bg-[#F0F8EC] text-[#63A644] border-[#63A644]/20'
                          : 'bg-[#EBF1FE] text-[#1D52F2] border-[#1D52F2]/20'
                      }`}>
                        {n.recipientName 
                          ? `To: ${n.recipientName} (${(n.recipientRole || n.targetRole || 'user').toUpperCase()})`
                          : n.targetRole === 'all'
                          ? 'Broadcast: All'
                          : `To: ${n.targetRole?.toUpperCase()}`}
                      </span>

                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-[#1D52F2] animate-pulse"></span>
                      )}
                    </div>

                    {/* Message Body */}
                    <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">{n.message}</p>
                    
                    {/* Timestamp */}
                    <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-1 font-medium">
                      <Clock className="w-3 h-3" />
                      <span>{n.time}</span>
                    </p>
                  </div>

                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
