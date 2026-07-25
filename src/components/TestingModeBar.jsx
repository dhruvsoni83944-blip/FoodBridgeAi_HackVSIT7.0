import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  HeartHandshake, 
  Truck, 
  Building2, 
  ShieldCheck, 
  Zap, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export const TestingModeBar = () => {
  const { currentRole, switchRole, selectedDonation } = useApp();

  return (
    <div className="w-full bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 border-b border-emerald-500/30 py-2 px-4 sm:px-6 text-xs text-slate-200">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        
        {/* Left: Hackathon MVP Indicator */}
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-emerald-500 text-emerald-950 font-extrabold text-[10px] uppercase tracking-wider flex items-center gap-1">
            <Zap className="w-3 h-3 fill-emerald-950" /> Live Demo Mode
          </span>
          <span className="text-slate-300 font-medium hidden md:inline">
            Real-Time Multi-Dashboard State Synchronization Engine
          </span>
        </div>

        {/* Center: Live Status Ticker */}
        {selectedDonation && (
          <div className="hidden lg:flex items-center gap-2 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/30">
            <span className="text-slate-400 font-semibold">Active Item:</span>
            <span className="font-bold text-white max-w-[150px] truncate">{selectedDonation.foodName}</span>
            <span className="text-slate-500">•</span>
            <span className="font-extrabold text-emerald-400 uppercase text-[10px]">{selectedDonation.status}</span>
          </div>
        )}

        {/* Right: Instant Persona Switcher Bar */}
        <div className="flex items-center gap-1 bg-emerald-950/90 p-1 rounded-xl border border-emerald-500/30">
          <span className="text-[10px] font-bold text-emerald-400 uppercase px-2 hidden sm:inline">Switch Persona:</span>
          
          <button
            onClick={() => switchRole('donor')}
            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all flex items-center gap-1 ${
              currentRole === 'donor' 
                ? 'bg-emerald-500 text-emerald-950 shadow-sm' 
                : 'text-slate-300 hover:text-white hover:bg-emerald-800/40'
            }`}
          >
            <HeartHandshake className="w-3 h-3" />
            <span>Donor</span>
          </button>

          <button
            onClick={() => switchRole('volunteer')}
            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all flex items-center gap-1 ${
              currentRole === 'volunteer' 
                ? 'bg-amber-400 text-amber-950 shadow-sm' 
                : 'text-slate-300 hover:text-white hover:bg-emerald-800/40'
            }`}
          >
            <Truck className="w-3 h-3" />
            <span>Volunteer</span>
          </button>

          <button
            onClick={() => switchRole('ngo')}
            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all flex items-center gap-1 ${
              currentRole === 'ngo' 
                ? 'bg-blue-400 text-blue-950 shadow-sm' 
                : 'text-slate-300 hover:text-white hover:bg-emerald-800/40'
            }`}
          >
            <Building2 className="w-3 h-3" />
            <span>NGO</span>
          </button>

          <button
            onClick={() => switchRole('admin')}
            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all flex items-center gap-1 ${
              currentRole === 'admin' 
                ? 'bg-purple-400 text-purple-950 shadow-sm' 
                : 'text-slate-300 hover:text-white hover:bg-emerald-800/40'
            }`}
          >
            <ShieldCheck className="w-3 h-3" />
            <span>Admin</span>
          </button>
        </div>

      </div>
    </div>
  );
};
