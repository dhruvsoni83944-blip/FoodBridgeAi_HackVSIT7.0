import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Bell, 
  CheckCircle2, 
  Truck, 
  Building2, 
  Clock, 
  Sparkles, 
  Check 
} from 'lucide-react';

export const NotificationsPage = () => {
  const { notifications, markNotificationsRead } = useApp();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
            <Bell className="w-3.5 h-3.5" />
            <span>Activity Stream</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">Live Notifications</h1>
        </div>

        <button
          onClick={markNotificationsRead}
          className="px-4 py-2 rounded-xl glass-panel hover:bg-emerald-800/40 border border-emerald-500/30 text-emerald-300 text-xs font-bold transition-all flex items-center gap-1.5"
        >
          <Check className="w-4 h-4" />
          <span>Mark All Read</span>
        </button>
      </div>

      {/* Notification Cards List */}
      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="text-center py-16 glass-panel rounded-3xl space-y-3">
            <Bell className="w-10 h-10 mx-auto text-slate-500" />
            <p className="text-sm font-semibold text-slate-400">No new notifications right now.</p>
          </div>
        ) : (
          notifications.map((n) => (
            <div 
              key={n.id}
              className={`glass-card p-5 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                !n.read 
                  ? 'border-emerald-500/50 bg-emerald-950/70 shadow-lg shadow-emerald-950' 
                  : 'border-emerald-500/20 opacity-80'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-2xl shrink-0 ${
                  n.type === 'volunteer' 
                    ? 'bg-amber-500/20 text-amber-400' 
                    : n.type === 'delivered' 
                    ? 'bg-emerald-500/20 text-emerald-400' 
                    : 'bg-blue-500/20 text-blue-400'
                }`}>
                  {n.type === 'volunteer' ? <Truck className="w-5 h-5" /> :
                   n.type === 'delivered' ? <CheckCircle2 className="w-5 h-5" /> :
                   <Building2 className="w-5 h-5" />}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">{n.title}</h3>
                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{n.message}</p>
                  <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3" />
                    <span>{n.time}</span>
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
