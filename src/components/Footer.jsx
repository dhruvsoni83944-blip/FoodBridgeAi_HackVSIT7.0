import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, HeartHandshake, Globe, ShieldCheck, Heart } from 'lucide-react';

export const Footer = () => {
  const { setActiveView } = useApp();

  return (
    <footer className="border-t border-emerald-500/20 bg-emerald-950/90 text-slate-400 text-xs py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand */}
        <div className="space-y-3 md:col-span-1">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500 text-emerald-950 font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-lg font-extrabold text-white font-heading">
              FoodBridge <span className="text-emerald-400">AI</span>
            </span>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed">
            Eliminating food waste and hunger using AI routing telemetry, predictive freshness scoring, and volunteer dispatch networks.
          </p>
        </div>

        {/* Navigation Quick Links */}
        <div className="space-y-2">
          <h4 className="font-extrabold text-white uppercase text-[11px] tracking-wider text-emerald-400">Platform Portals</h4>
          <ul className="space-y-1.5 text-xs">
            <li><button onClick={() => setActiveView('donor')} className="hover:text-emerald-300 transition-colors">Donor Portal</button></li>
            <li><button onClick={() => setActiveView('ai-matching')} className="hover:text-emerald-300 transition-colors">AI Match Engine</button></li>
            <li><button onClick={() => setActiveView('volunteer')} className="hover:text-emerald-300 transition-colors">Volunteer Hub</button></li>
            <li><button onClick={() => setActiveView('ngo')} className="hover:text-emerald-300 transition-colors">NGO Queue</button></li>
          </ul>
        </div>

        {/* Live System Specs */}
        <div className="space-y-2">
          <h4 className="font-extrabold text-white uppercase text-[11px] tracking-wider text-emerald-400">Impact & Operations</h4>
          <ul className="space-y-1.5 text-xs">
            <li><button onClick={() => setActiveView('impact')} className="hover:text-emerald-300 transition-colors">Impact Analytics</button></li>
            <li><button onClick={() => setActiveView('live-tracking')} className="hover:text-emerald-300 transition-colors">Live GPS Telemetry</button></li>
            <li><button onClick={() => setActiveView('admin')} className="hover:text-emerald-300 transition-colors">Admin Governance</button></li>
          </ul>
        </div>

        {/* Support & Contact */}
        <div className="space-y-2">
          <h4 className="font-extrabold text-white uppercase text-[11px] tracking-wider text-emerald-400">Emergency Support</h4>
          <ul className="space-y-1.5 text-xs text-slate-400">
            <li>24/7 Dispatch Helpline: +1 (800) 555-FOOD</li>
            <li>Email: dispatch@foodbridge.ai</li>
            <li>Verified Network ID: FB-NAT-2026</li>
          </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-emerald-500/10 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-4">
        <p>© 2026 FoodBridge AI. Built for Zero Waste & Zero Hunger.</p>
        <p className="flex items-center gap-1">
          Made with <Heart className="w-3 h-3 text-emerald-400 fill-emerald-400" /> for Zero Waste Community
        </p>
      </div>
    </footer>
  );
};
