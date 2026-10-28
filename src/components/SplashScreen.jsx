import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

export const SplashScreen = ({ isOpen, onClose }) => {
  const [progress, setProgress] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);

  const steps = [
    "Calibrating Neural Food Freshness Scanner...",
    "Connecting 628+ Verified Shelter Capacities...",
    "Activating 4,520 Standby Eco Volunteer Couriers...",
    "Live Zero-Waste Rescue Grid Ready."
  ];

  // Lock body scroll when splash screen is visible
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Smooth sequence animation
  useEffect(() => {
    if (!isOpen) {
      setProgress(0);
      setStepIndex(0);
      return;
    }

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            onClose();
          }, 350);
          return 100;
        }
        const next = prev + 5;
        if (next > 75) setStepIndex(3);
        else if (next > 50) setStepIndex(2);
        else if (next > 25) setStepIndex(1);
        return next;
      });
    }, 50);

    return () => clearInterval(timer);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div 
      className="fixed inset-0 top-0 left-0 right-0 bottom-0 w-screen h-screen min-h-[100dvh] z-[999999] flex flex-col items-center justify-center bg-[#F2F2F2] text-slate-900 overflow-hidden m-0 p-4 select-none animate-in fade-in duration-300"
    >
      {/* Background Palette Glows (Blue #1D52F2, Green #63A644, Orange #F26B1D) */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-[#1D52F2]/18 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-[#63A644]/18 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/3 right-1/3 w-80 h-80 bg-[#F26B1D]/15 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDelay: '2s' }}></div>
      
      {/* Grid Pattern Texture */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none"></div>

      {/* Centerpiece Content Card */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center max-w-md w-full px-6 py-8">
        
        {/* Animated Halos & Brand Logo */}
        <div className="relative flex items-center justify-center mb-8">
          {/* Outer Pulsing Orange Ring */}
          <div className="w-52 h-52 rounded-full border-2 border-[#F26B1D]/30 animate-ping absolute" style={{ animationDuration: '3s' }}></div>
          {/* Middle Green Ring */}
          <div className="w-40 h-40 rounded-full border border-[#63A644]/40 animate-pulse absolute" style={{ animationDuration: '2s' }}></div>
          {/* Inner Blue Ring */}
          <div className="w-28 h-28 rounded-full border-2 border-[#1D52F2]/50 absolute animate-spin" style={{ animationDuration: '6s' }}></div>

          {/* Logo Container Tile */}
          <div className="w-24 h-24 rounded-3xl bg-white p-2.5 shadow-2xl border-2 border-white flex items-center justify-center relative z-10 hover:scale-105 transition-transform">
            <img 
              src="/logo.jpg" 
              alt="FoodBridge AI Logo" 
              className="w-full h-full object-contain rounded-2xl" 
            />
          </div>
        </div>

        {/* Brand Headline with Color Palette Accents */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#1D52F2]/20 text-[#1D52F2] text-xs font-black tracking-wide uppercase shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#1D52F2] animate-pulse" />
            <span>AI Food Rescue Network</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 font-heading">
            FoodBridge <span className="text-gradient-brand">AI</span>
          </h1>
          
          <div className="flex items-center justify-center gap-2 pt-0.5">
            <span className="w-2 h-2 rounded-full bg-[#63A644] animate-ping"></span>
            <p className="text-xs sm:text-sm font-bold text-slate-600 tracking-wide">
              Zero Food Waste • Zero Hunger
            </p>
          </div>
        </div>

        {/* Progress Tracker Card */}
        <div className="w-full mt-8 bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-slate-200 shadow-lg space-y-3">
          
          {/* Progress Bar Track */}
          <div className="w-full h-3 rounded-full bg-[#F2F2F2] overflow-hidden border border-slate-200 p-0.5 shadow-inner">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-[#1D52F2] via-[#63A644] to-[#F26B1D] transition-all duration-150 ease-out shadow-xs"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          {/* Status Label & Percentage */}
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono text-slate-600 truncate pr-2 text-left font-medium">
              {steps[stepIndex]}
            </span>
            <span className="font-black text-[#1D52F2] font-mono shrink-0">
              {progress}%
            </span>
          </div>

        </div>

        {/* Skip to Experience Action Button */}
        <button
          onClick={onClose}
          className="mt-6 px-6 py-3 rounded-2xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 text-xs font-black shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer group"
        >
          <span>Skip to Experience</span>
          <ArrowRight className="w-4 h-4 text-[#1D52F2] group-hover:translate-x-1 transition-transform" />
        </button>

      </div>

      {/* Footer Credentials */}
      <div className="absolute bottom-6 text-[11px] text-slate-500 font-semibold flex items-center gap-3">
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#1D52F2]"></span>
          Blue #1D52F2
        </span>
        <span>•</span>
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#63A644]"></span>
          Green #63A644
        </span>
        <span>•</span>
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#F26B1D]"></span>
          Orange #F26B1D
        </span>
      </div>

    </div>,
    document.body
  );
};
