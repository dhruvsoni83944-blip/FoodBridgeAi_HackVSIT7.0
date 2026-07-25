import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, 
  HeartHandshake, 
  Truck, 
  Building2, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  TrendingUp, 
  CheckCircle2, 
  Users, 
  Utensils, 
  Globe,
  Zap
} from 'lucide-react';

export const LandingPage = ({ onOpenAuth }) => {
  const { impactStats, setActiveView, switchRole, isLoggedIn } = useApp();

  // Animated numbers effect
  const [animatedStats, setAnimatedStats] = useState({
    meals: 0,
    people: 0,
    volunteers: 0,
    ngos: 0
  });

  useEffect(() => {
    const duration = 2000; // ms
    const steps = 50;
    const stepTime = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      setAnimatedStats({
        meals: Math.floor(impactStats.mealsSaved * progress),
        people: Math.floor(impactStats.peopleFed * progress),
        volunteers: Math.floor(impactStats.activeVolunteers * progress),
        ngos: Math.floor(impactStats.ngosConnected * progress)
      });

      if (step >= steps) {
        clearInterval(timer);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [impactStats]);

  const handleAction = (role, view) => {
    switchRole(role);
    setActiveView(view);
  };

  return (
    <div className="space-y-20 pb-20">
      
      {/* HERO SECTION */}
      <section className="relative pt-12 lg:pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        {/* Glowing Background Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none -z-10"></div>
        <div className="absolute top-10 left-10 w-72 h-72 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none -z-10 animate-float"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Text Column */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-emerald-500/40 text-emerald-300 text-xs font-semibold tracking-wide uppercase shadow-lg shadow-emerald-950">
              <Sparkles className="w-4 h-4 text-emerald-400 animate-spin-slow" />
              <span>Next-Gen AI Food Waste Elimination Network</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1]">
              <span className="block">No Food Wasted,</span>
              <span className="text-gradient block mt-1">No One Hungry.</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
              Connecting restaurants, hotels, wedding halls, households, NGOs, and volunteers in real-time. Powered by AI route optimization and predictive decay scoring to rescue every surplus meal.
            </p>

            {/* Action Button: Single Bold Donate Surplus Food CTA */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              
              <button
                onClick={() => {
                  if (isLoggedIn) {
                    handleAction('donor', 'donor');
                  } else {
                    onOpenAuth();
                  }
                }}
                className="group px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-emerald-950 font-extrabold text-base shadow-xl shadow-emerald-500/25 transition-all hover:scale-105 active:scale-95 flex items-center gap-3"
              >
                <HeartHandshake className="w-5 h-5 text-emerald-950" />
                <span>Donate Surplus Food</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

            </div>

            {/* Micro badges */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-400 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>AI Freshness Guaranteed</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>100% Tax Receipt Eligible</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Sub-15 Min Dispatch</span>
              </div>
            </div>

          </div>

          {/* Right Hero Illustration Column */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Glass container around generated image */}
              <div className="relative rounded-3xl p-3 glass-panel border border-emerald-500/30 shadow-2xl shadow-emerald-950 overflow-hidden group">
                <img 
                  src="/hero_food_donation.jpg" 
                  alt="Food Donation AI Illustration" 
                  className="w-full h-80 sm:h-96 object-cover rounded-2xl transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop&q=80";
                  }}
                />

                {/* AI Scanner overlay pill */}
                <div className="absolute top-6 right-6 px-4 py-2 rounded-xl glass-panel border border-emerald-400/50 text-white text-xs font-semibold flex items-center gap-2 shadow-lg backdrop-blur-md">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></div>
                  <span>AI Smart Match: 99.4% Match</span>
                </div>

                {/* Floating mini stats card */}
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl glass-panel border border-emerald-500/40 backdrop-blur-md flex items-center justify-between text-white shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
                      <Zap className="w-5 h-5 animate-bounce" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-300">Live Express Delivery</p>
                      <p className="text-sm font-extrabold text-emerald-300">14 Mins Avg Pickup Time</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setActiveView('live-tracking')}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500 text-emerald-950 text-xs font-bold hover:bg-emerald-400 transition-colors"
                  >
                    Track
                  </button>
                </div>

              </div>

            </div>
          </div>

        </div>

      </section>

      {/* LIVE IMPACT COUNTERS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl p-8 lg:p-10 glass-panel border border-emerald-500/30 overflow-hidden shadow-2xl">
          
          {/* Subtle Grid background */}
          <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none"></div>

          <div className="text-center mb-8">
            <span className="text-xs font-bold tracking-widest text-emerald-400 uppercase">National Real-Time Network Impact</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">Transforming Surplus into Smiles</h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            
            {/* Counter 1: Meals Saved */}
            <div className="p-6 rounded-2xl glass-card text-center group">
              <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                <Utensils className="w-6 h-6" />
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-white font-heading tracking-tight">
                {animatedStats.meals.toLocaleString()}+
              </div>
              <p className="text-xs font-semibold text-emerald-300 mt-1 uppercase tracking-wider">Meals Saved</p>
              <p className="text-[11px] text-slate-400 mt-1">High quality surplus rescued</p>
            </div>

            {/* Counter 2: People Fed */}
            <div className="p-6 rounded-2xl glass-card text-center group">
              <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-white font-heading tracking-tight">
                {animatedStats.people.toLocaleString()}+
              </div>
              <p className="text-xs font-semibold text-emerald-300 mt-1 uppercase tracking-wider">People Fed</p>
              <p className="text-[11px] text-slate-400 mt-1">Served at shelters & centers</p>
            </div>

            {/* Counter 3: Active Volunteers */}
            <div className="p-6 rounded-2xl glass-card text-center group">
              <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                <Truck className="w-6 h-6" />
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-white font-heading tracking-tight">
                {animatedStats.volunteers.toLocaleString()}+
              </div>
              <p className="text-xs font-semibold text-amber-300 mt-1 uppercase tracking-wider">Active Volunteers</p>
              <p className="text-[11px] text-slate-400 mt-1">On standby for quick dispatch</p>
            </div>

            {/* Counter 4: NGOs Connected */}
            <div className="p-6 rounded-2xl glass-card text-center group">
              <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                <Building2 className="w-6 h-6" />
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-white font-heading tracking-tight">
                {animatedStats.ngos.toLocaleString()}+
              </div>
              <p className="text-xs font-semibold text-blue-300 mt-1 uppercase tracking-wider">NGOs Connected</p>
              <p className="text-[11px] text-slate-400 mt-1">Verified community partners</p>
            </div>

          </div>
        </div>
      </section>

      {/* HOW FOODBRIDGE AI WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-wider border border-emerald-500/20">
            Automated 4-Step Ecosystem
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">How FoodBridge AI Operates</h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">From kitchen surplus upload to shelter dining tables in 4 seamless AI-driven steps.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Step 1 */}
          <div className="p-6 rounded-3xl glass-card relative border border-emerald-500/20 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 font-extrabold flex items-center justify-center text-lg">
              01
            </div>
            <h3 className="text-lg font-bold text-white">Post Surplus Food</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Hotels, wedding halls, restaurants, or households upload excess food photos and details in under 30 seconds.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-6 rounded-3xl glass-card relative border border-emerald-500/20 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 font-extrabold flex items-center justify-center text-lg">
              02
            </div>
            <h3 className="text-lg font-bold text-white">AI Smart Match</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Our AI algorithm evaluates freshness window, distance matrix, and shelter capacity to select the optimal NGO recipient.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-6 rounded-3xl glass-card relative border border-emerald-500/20 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 font-extrabold flex items-center justify-center text-lg">
              03
            </div>
            <h3 className="text-lg font-bold text-white">Volunteer Dispatch</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Nearby volunteers accept pickup on their app dashboard and follow optimized turn-by-turn navigation route lines.
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-6 rounded-3xl glass-card relative border border-emerald-500/20 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 font-extrabold flex items-center justify-center text-lg">
              04
            </div>
            <h3 className="text-lg font-bold text-white">Verified Delivery</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              NGO confirms meal reception, updates live impact metrics, and issues automated digital tax deduction certificate.
            </p>
          </div>

        </div>
      </section>

      {/* CTA FOOTER BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl p-8 sm:p-12 glass-panel border border-emerald-500/40 text-center space-y-6 relative overflow-hidden bg-gradient-to-r from-emerald-950 via-emerald-900/60 to-emerald-950 shadow-2xl">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-2xl font-bold animate-pulse">
            <Sparkles className="w-8 h-8" />
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Ready to Make Zero Waste a Reality?
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
            Join thousands of restaurants, NGOs, and volunteers making an immediate impact today.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <button 
              onClick={() => {
                if (isLoggedIn) {
                  handleAction('donor', 'donor');
                } else {
                  onOpenAuth();
                }
              }}
              className="px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-extrabold text-sm shadow-xl shadow-emerald-500/30 transition-all hover:scale-105"
            >
              Start Donating Today
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
