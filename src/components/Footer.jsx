import React from 'react';
import { useApp } from '../context/AppContext';
import { Heart, ArrowUpRight } from 'lucide-react';

export const Footer = () => {
  const { setActiveView } = useApp();

  return (
    <footer className="border-t border-slate-200 bg-white text-slate-600 text-xs py-12 px-4 sm:px-6 lg:px-8 shadow-inner mt-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand */}
        <div className="space-y-3 md:col-span-1">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl border border-slate-200 bg-white p-0.5 shadow-sm">
              <img src="/logo.jpg" alt="FoodBridge AI Logo" className="w-full h-full object-contain rounded-lg" />
            </div>
            <span className="text-lg font-black text-slate-900 font-heading">
              FoodBridge <span className="text-[#1D52F2]">AI</span>
            </span>
          </div>
          <p className="text-slate-500 text-xs leading-relaxed">
            Eliminating food waste and hunger using AI routing telemetry, predictive freshness scoring, and volunteer dispatch networks.
          </p>
          <div className="flex items-center gap-2 pt-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#F0F8EC] text-[#63A644] border border-[#63A644]/20">
              <span className="w-1.5 h-1.5 rounded-full bg-[#63A644]"></span>
              Active Mission 2026
            </span>
          </div>
        </div>

        {/* Navigation Quick Links */}
        <div className="space-y-2.5">
          <h4 className="font-extrabold uppercase text-[11px] tracking-wider text-[#1D52F2]">Platform Portals</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={() => setActiveView('learn-more')} className="text-slate-600 hover:text-[#1D52F2] font-semibold transition-colors flex items-center gap-1 cursor-pointer">
                <span>Learn More & Mission</span>
                <ArrowUpRight className="w-3 h-3 text-slate-400" />
              </button>
            </li>
            <li>
              <button onClick={() => setActiveView('donor')} className="text-slate-600 hover:text-[#1D52F2] transition-colors flex items-center gap-1 cursor-pointer">
                <span>Donor Portal</span>
                <ArrowUpRight className="w-3 h-3 text-slate-400" />
              </button>
            </li>
            <li>
              <button onClick={() => setActiveView('ai-matching')} className="text-slate-600 hover:text-[#1D52F2] transition-colors flex items-center gap-1 cursor-pointer">
                <span>AI Match Engine</span>
                <ArrowUpRight className="w-3 h-3 text-slate-400" />
              </button>
            </li>
            <li>
              <button onClick={() => setActiveView('volunteer')} className="text-slate-600 hover:text-[#1D52F2] transition-colors flex items-center gap-1 cursor-pointer">
                <span>Volunteer Hub</span>
                <ArrowUpRight className="w-3 h-3 text-slate-400" />
              </button>
            </li>
            <li>
              <button onClick={() => setActiveView('ngo')} className="text-slate-600 hover:text-[#1D52F2] transition-colors flex items-center gap-1 cursor-pointer">
                <span>NGO Shelters</span>
                <ArrowUpRight className="w-3 h-3 text-slate-400" />
              </button>
            </li>
          </ul>
        </div>

        {/* Live System Specs */}
        <div className="space-y-2.5">
          <h4 className="font-extrabold uppercase text-[11px] tracking-wider text-[#63A644]">Impact & Operations</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={() => setActiveView('impact')} className="text-slate-600 hover:text-[#63A644] transition-colors flex items-center gap-1 cursor-pointer">
                <span>Impact & ESG Analytics</span>
                <ArrowUpRight className="w-3 h-3 text-slate-400" />
              </button>
            </li>
            <li>
              <button onClick={() => setActiveView('live-tracking')} className="text-slate-600 hover:text-[#63A644] transition-colors flex items-center gap-1 cursor-pointer">
                <span>Live GPS Telemetry</span>
                <ArrowUpRight className="w-3 h-3 text-slate-400" />
              </button>
            </li>
            <li>
              <button onClick={() => setActiveView('admin')} className="text-slate-600 hover:text-[#63A644] transition-colors flex items-center gap-1 cursor-pointer">
                <span>Admin Governance</span>
                <ArrowUpRight className="w-3 h-3 text-slate-400" />
              </button>
            </li>
          </ul>
        </div>

        {/* Support & Contact */}
        <div className="space-y-2.5">
          <h4 className="font-extrabold uppercase text-[11px] tracking-wider text-[#F26B1D]">Emergency Support</h4>
          <ul className="space-y-2 text-xs text-slate-600">
            <li className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-800">Dispatch Helpline:</span> +1 (800) 555-FOOD
            </li>
            <li className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-800">Email:</span> dispatch@foodbridge.ai
            </li>
            <li className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-800">Verified Network:</span> FB-NAT-2026
            </li>
          </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-4">
        <p>© 2026 FoodBridge AI. Built for Zero Waste & Zero Hunger.</p>
        <p className="flex items-center gap-1.5 font-medium">
          Powered by <span className="text-[#1D52F2] font-semibold">AI Dispatch</span> & <Heart className="w-3.5 h-3.5 text-[#F26B1D] fill-[#F26B1D]" /> for Global Communities
        </p>
      </div>
    </footer>
  );
};
