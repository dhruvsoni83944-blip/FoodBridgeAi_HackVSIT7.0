import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, 
  HeartHandshake, 
  Truck, 
  Building2, 
  ArrowRight, 
  CheckCircle2, 
  Users, 
  Utensils, 
  Activity,
  RotateCcw,
  ShieldCheck
} from 'lucide-react';
import { SplashScreen } from './SplashScreen';

export const LandingPage = ({ onOpenAuth }) => {
  const { 
    impactStats, 
    setActiveView, 
    isLoggedIn, 
    triggerConfetti, 
    showToast, 
    registeredNGOs, 
    currentRole, 
    currentUser, 
    donations = [] 
  } = useApp();

  const isNgoRole = currentRole === 'ngo';

  // Splash Screen Intro State (plays on initial load or on replay)
  const [showSplash, setShowSplash] = useState(() => {
    try {
      return !sessionStorage.getItem('fb_splash_seen');
    } catch {
      return true;
    }
  });

  // Animated numbers effect
  const [animatedStats, setAnimatedStats] = useState({
    meals: 0,
    people: 0,
    volunteers: 0,
    ngos: 0
  });

  // Hero Card 3D Tilt / Parallax State
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHoveringHero, setIsHoveringHero] = useState(false);
  const heroCardRef = useRef(null);

  // Hero Interactive Telemetry Mode (Courier, Freshness, Eco)
  const [telemetryMode, setTelemetryMode] = useState('courier'); // 'courier' | 'freshness' | 'eco'

  // Handle Parallax Mouse Movement
  const handleHeroMouseMove = (e) => {
    if (!heroCardRef.current) return;
    const rect = heroCardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -8; // -8 to 8 deg
    const rotateY = ((x - centerX) / centerX) * 8;  // -8 to 8 deg

    setTilt({ x: rotateX, y: rotateY });
  };

  const handleHeroMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHoveringHero(false);
  };

  // Replay Splash
  const replaySplash = () => {
    setShowSplash(true);
  };



  // Animated KPI Stats
  useEffect(() => {
    const duration = 2000;
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
    setActiveView(view);
  };

  return (
    <div className="space-y-20 pb-20 relative overflow-hidden">
      
      {/* ============================================================ */}
      {/* CINEMATIC SPLASH SCREEN INTRO ANIMATION (100% FULLSCREEN PORTAL) */}
      {/* ============================================================ */}
      <SplashScreen 
        isOpen={showSplash} 
        onClose={() => {
          setShowSplash(false);
          try {
            sessionStorage.setItem('fb_splash_seen', 'true');
          } catch (e) {
            console.warn(e);
          }
        }} 
      />

      {/* ============================================================ */}
      {/* REBUILT HERO SECTION WITH PARALLAX & DYNAMIC INTERACTIONS */}
      {/* ============================================================ */}
      <section className="relative pt-8 lg:pt-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        {/* Dynamic Morphing Background Ambient Orbs */}
        <div 
          className="absolute top-10 left-10 w-96 h-96 bg-[#1D52F2]/12 rounded-full blur-3xl pointer-events-none -z-10 animate-morph-orb transition-transform duration-700"
          style={{
            transform: `translate(${tilt.y * 3}px, ${tilt.x * -3}px)`
          }}
        ></div>
        <div 
          className="absolute top-48 right-12 w-96 h-96 bg-[#63A644]/12 rounded-full blur-3xl pointer-events-none -z-10 animate-morph-orb transition-transform duration-700"
          style={{
            animationDelay: '-4s',
            transform: `translate(${tilt.y * -2.5}px, ${tilt.x * 2.5}px)`
          }}
        ></div>
        <div 
          className="absolute bottom-10 left-1/3 w-80 h-80 bg-[#F26B1D]/10 rounded-full blur-3xl pointer-events-none -z-10 animate-morph-orb transition-transform duration-700"
          style={{
            animationDelay: '-8s',
            transform: `translate(${tilt.x * 2}px, ${tilt.y * 2}px)`
          }}
        ></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Typography & CTAs */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            
            {/* Top Pill Bar with Replay Splash Action */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#1D52F2]/20 text-[#1D52F2] text-xs font-black tracking-wide uppercase shadow-xs">
                <Sparkles className="w-4 h-4 text-[#1D52F2] animate-pulse" />
                <span>
                  {isNgoRole 
                    ? 'Verified NGO Shelter Recipient Grid • Surplus Inflow' 
                    : 'Next-Gen Real-Time Food Rescue Grid'}
                </span>
              </div>

              <button
                onClick={replaySplash}
                title="Replay cinematic intro animation"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 hover:bg-white text-slate-600 hover:text-[#1D52F2] text-[11px] font-bold border border-slate-200 shadow-2xs transition-all hover:scale-105 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3 text-[#1D52F2]" />
                <span>Replay Intro</span>
              </button>
            </div>

            {/* Main Headline with Brand Gradient */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.08]">
              {isNgoRole ? (
                <>
                  <span className="block">Receive Surplus Meals,</span>
                  <span className="text-gradient-brand block mt-1">Feed Your Community.</span>
                </>
              ) : (
                <>
                  <span className="block">Zero Food Waste,</span>
                  <span className="text-gradient-brand block mt-1">Zero Hunger.</span>
                </>
              )}
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              {isNgoRole ? (
                `Empowering community shelters, food banks, and dining facilities with automated surplus food dispatches from verified commercial kitchens. Verified with Gemini Vision AI, tracked via live GPS, and delivered directly to your doorstep at zero cost.`
              ) : (
                `Connecting commercial kitchens, restaurants, and households with certified community shelters & on-call electric couriers in under 15 minutes. Powered by neural freshness detection and automated Section 80G tax receipting.`
              )}
            </p>

            {/* Interactive Primary Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-1">
              {isNgoRole ? (
                <>
                  <button
                    onClick={() => setActiveView('ngo')}
                    className="group px-8 py-4 rounded-2xl bg-[#63A644] hover:bg-[#4B8233] text-white font-extrabold text-base shadow-xl shadow-[#63A644]/25 transition-all hover:scale-105 active:scale-95 flex items-center gap-3 cursor-pointer"
                  >
                    <Building2 className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                    <span>View Available Food Donations</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                  </button>

                  <button
                    onClick={() => setActiveView('ai-analyzer')}
                    className="px-6 py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-base border border-slate-200 shadow-sm transition-all hover:border-[#1D52F2]/50 hover:text-[#1D52F2] flex items-center gap-2.5 cursor-pointer hover:scale-105"
                  >
                    <Sparkles className="w-5 h-5 text-[#1D52F2]" />
                    <span>AI Quality Analyzer</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      if (isLoggedIn) {
                        handleAction('donor', 'donor');
                      } else {
                        onOpenAuth();
                      }
                    }}
                    className="group px-8 py-4 rounded-2xl bg-[#1D52F2] hover:bg-[#133BB5] text-white font-extrabold text-base shadow-xl shadow-[#1D52F2]/25 transition-all hover:scale-105 active:scale-95 flex items-center gap-3 cursor-pointer"
                  >
                    <HeartHandshake className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                    <span>Donate Surplus Food</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                  </button>

                  <button
                    onClick={() => setActiveView('ai-analyzer')}
                    className="px-6 py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-base border border-slate-200 shadow-sm transition-all hover:border-[#63A644]/50 hover:text-[#63A644] flex items-center gap-2.5 cursor-pointer hover:scale-105"
                  >
                    <Sparkles className="w-5 h-5 text-[#63A644]" />
                    <span>AI Quality Analyzer</span>
                  </button>
                </>
              )}
            </div>

            {/* Feature Badges */}
            <div className="pt-3 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-700 font-semibold">
              {isNgoRole ? (
                <>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#63A644]" />
                    <span>100% Free Food Allocations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#1D52F2]" />
                    <span>Gemini AI Freshness Verified</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#F26B1D]" />
                    <span>Direct Doorstep Delivery to Shelter</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#63A644]" />
                    <span>99.4% AI Freshness Precision</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#1D52F2]" />
                    <span>Instant Section 80G Tax Pass</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#F26B1D]" />
                    <span>14 Mins Avg Courier Pickup</span>
                  </div>
                </>
              )}
            </div>

          </div>

          {/* Right Column: 3D Parallax Interactive Showcase Card */}
          <div className="lg:col-span-5 perspective-1000">
            
            {/* Interactive Telemetry Tab Selector above Card */}
            <div className="flex items-center justify-between bg-white p-1.5 rounded-2xl border border-slate-200 mb-3 shadow-xs">
              <button
                onClick={() => setTelemetryMode('courier')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  telemetryMode === 'courier'
                    ? 'bg-[#FEF3EB] text-[#F26B1D] shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Truck className="w-3.5 h-3.5" />
                <span>Courier Fleet</span>
              </button>

              <button
                onClick={() => setTelemetryMode('freshness')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  telemetryMode === 'freshness'
                    ? 'bg-[#F0F8EC] text-[#63A644] shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Freshness AI</span>
              </button>

              <button
                onClick={() => setTelemetryMode('eco')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  telemetryMode === 'eco'
                    ? 'bg-[#EBF1FE] text-[#1D52F2] shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Eco Impact</span>
              </button>
            </div>

            {/* 3D Tilting Card Container */}
            <div 
              ref={heroCardRef}
              onMouseMove={handleHeroMouseMove}
              onMouseEnter={() => setIsHoveringHero(true)}
              onMouseLeave={handleHeroMouseLeave}
              className="relative rounded-3xl p-3.5 bg-white border border-slate-200 shadow-2xl preserve-3d transition-transform duration-200 ease-out group cursor-pointer"
              style={{
                transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${isHoveringHero ? 1.02 : 1})`,
                boxShadow: isHoveringHero ? '0 25px 50px -12px rgba(29, 82, 242, 0.2)' : '0 15px 35px -5px rgba(0, 0, 0, 0.08)'
              }}
            >
              {/* Authentic Realistic Photography */}
              <div className="relative rounded-2xl overflow-hidden h-[380px] sm:h-[440px] bg-slate-900">
                <img 
                  src="/hero_realistic.jpg" 
                  alt="FoodBridge AI Surplus Rescue Kitchen & Courier" 
                  className="w-full h-full object-cover rounded-2xl transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&auto=format&fit=crop&q=80";
                  }}
                />

                {/* Subtle gradient vignette for readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/30 pointer-events-none"></div>

                {/* Floating 3D Badge 1: Top Right Live Match Radar */}
                <div 
                  className="absolute top-4 right-4 px-3.5 py-2 rounded-2xl bg-white/95 backdrop-blur-md border border-[#63A644]/40 text-slate-900 text-xs font-bold flex items-center gap-2.5 shadow-xl translate-z-24 transition-transform duration-300"
                  style={{
                    transform: `translate(${tilt.y * 0.8}px, ${tilt.x * -0.8}px)`
                  }}
                >
                  <div className="relative">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#63A644] animate-ping absolute"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-[#63A644] relative"></div>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-slate-400 font-extrabold">Smart Match</p>
                    <p className="text-xs font-black text-slate-900">99.4% Match Rate</p>
                  </div>
                </div>

                {/* Floating 3D Badge 2: Top Left Live Beacon */}
                <div 
                  className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold flex items-center gap-2 shadow-lg translate-z-12"
                >
                  <span className="w-2 h-2 rounded-full bg-[#F26B1D] animate-pulse"></span>
                  <span>Real-Time Logistics</span>
                </div>

                {/* Dynamic Bottom Interactive Overlay HUD */}
                <div 
                  className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-white/95 backdrop-blur-lg border border-slate-200 shadow-2xl translate-z-36 text-slate-900 transition-all duration-300"
                >
                  {telemetryMode === 'courier' && (
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-[#FEF3EB] text-[#F26B1D]">
                          <Truck className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-extrabold text-slate-900">Eco EV Courier</span>
                            <span className="px-1.5 py-0.5 rounded bg-[#F0F8EC] text-[#63A644] text-[9px] font-black uppercase">Eco EV</span>
                          </div>
                          <p className="text-[11px] text-slate-500 font-medium">1.2 km away • ETA 14 Mins Pickup</p>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => setActiveView('live-tracking')}
                        className="px-4 py-2 rounded-xl bg-[#1D52F2] hover:bg-[#133BB5] text-white text-xs font-black shadow-md shadow-[#1D52F2]/20 transition-all hover:scale-105 cursor-pointer shrink-0"
                      >
                        Track Live
                      </button>
                    </div>
                  )}

                  {telemetryMode === 'freshness' && (
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-[#F0F8EC] text-[#63A644]">
                          <Activity className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-extrabold text-slate-900">Gourmet Catering Buffet</span>
                            <span className="px-1.5 py-0.5 rounded bg-[#F0F8EC] text-[#63A644] text-[9px] font-black uppercase">Grade A</span>
                          </div>
                          <p className="text-[11px] text-slate-500 font-medium">62°C Hygienic Safe • 4.5h Fresh Window</p>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => setActiveView('ai-analyzer')}
                        className="px-4 py-2 rounded-xl bg-[#63A644] hover:bg-[#4B8233] text-white text-xs font-black shadow-md shadow-[#63A644]/20 transition-all hover:scale-105 cursor-pointer shrink-0"
                      >
                        Analyze
                      </button>
                    </div>
                  )}

                  {telemetryMode === 'eco' && (
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-[#EBF1FE] text-[#1D52F2]">
                          <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-extrabold text-slate-900">{impactStats.mealsSaved.toLocaleString()} Meals Rescued</span>
                            <span className="px-1.5 py-0.5 rounded bg-[#EBF1FE] text-[#1D52F2] text-[9px] font-black uppercase">Live</span>
                          </div>
                          <p className="text-[11px] text-slate-500 font-medium">{impactStats.peopleFed.toLocaleString()} Beneficiaries Fed Across {registeredNGOs?.length || 0} Shelters</p>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => setActiveView('impact')}
                        className="px-4 py-2 rounded-xl bg-[#1D52F2] hover:bg-[#133BB5] text-white text-xs font-black shadow-md shadow-[#1D52F2]/20 transition-all hover:scale-105 cursor-pointer shrink-0"
                      >
                        Impact
                      </button>
                    </div>
                  )}

                </div>

              </div>

            </div>

            {/* Interactive hint */}
            <p className="text-center text-[11px] text-slate-400 mt-2 font-medium">
              💡 Hover & tilt to explore 3D optical depth • Click tabs to preview telemetry
            </p>

          </div>

        </div>

      </section>

      {/* ============================================================ */}
      {/* LIVE IMPACT COUNTERS SECTION */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl p-8 lg:p-10 bg-white border border-slate-200 shadow-sm overflow-hidden">
          
          <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none"></div>

          <div className="text-center mb-8 relative z-10">
            <span className="text-xs font-black tracking-widest text-[#1D52F2] uppercase">National Real-Time Network Impact</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">Transforming Surplus into Smiles</h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            
            {/* Counter 1: Meals Saved */}
            <div className="p-6 rounded-2xl bg-[#F2F2F2] border border-slate-200 text-center group hover:border-[#1D52F2]/40 transition-all hover:-translate-y-1">
              <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-[#EBF1FE] flex items-center justify-center text-[#1D52F2] group-hover:scale-110 transition-transform shadow-xs">
                <Utensils className="w-6 h-6" />
              </div>
              <div className="text-3xl sm:text-4xl font-black text-slate-900 font-heading tracking-tight">
                {animatedStats.meals.toLocaleString()}+
              </div>
              <p className="text-xs font-bold text-[#1D52F2] mt-1 uppercase tracking-wider">Meals Saved</p>
              <p className="text-[11px] text-slate-500 mt-0.5">High quality surplus rescued</p>
            </div>

            {/* Counter 2: People Fed */}
            <div className="p-6 rounded-2xl bg-[#F2F2F2] border border-slate-200 text-center group hover:border-[#63A644]/40 transition-all hover:-translate-y-1">
              <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-[#F0F8EC] flex items-center justify-center text-[#63A644] group-hover:scale-110 transition-transform shadow-xs">
                <Users className="w-6 h-6" />
              </div>
              <div className="text-3xl sm:text-4xl font-black text-slate-900 font-heading tracking-tight">
                {animatedStats.people.toLocaleString()}+
              </div>
              <p className="text-xs font-bold text-[#63A644] mt-1 uppercase tracking-wider">People Fed</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Served at shelters & centers</p>
            </div>

            {/* Counter 3: Active Volunteers */}
            <div className="p-6 rounded-2xl bg-[#F2F2F2] border border-slate-200 text-center group hover:border-[#F26B1D]/40 transition-all hover:-translate-y-1">
              <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-[#FEF3EB] flex items-center justify-center text-[#F26B1D] group-hover:scale-110 transition-transform shadow-xs">
                <Truck className="w-6 h-6" />
              </div>
              <div className="text-3xl sm:text-4xl font-black text-slate-900 font-heading tracking-tight">
                {animatedStats.volunteers.toLocaleString()}+
              </div>
              <p className="text-xs font-bold text-[#F26B1D] mt-1 uppercase tracking-wider">Active Volunteers</p>
              <p className="text-[11px] text-slate-500 mt-0.5">On standby for quick dispatch</p>
            </div>

            {/* Counter 4: NGOs Connected */}
            <div className="p-6 rounded-2xl bg-[#F2F2F2] border border-slate-200 text-center group hover:border-[#1D52F2]/40 transition-all hover:-translate-y-1">
              <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-[#EBF1FE] flex items-center justify-center text-[#1D52F2] group-hover:scale-110 transition-transform shadow-xs">
                <Building2 className="w-6 h-6" />
              </div>
              <div className="text-3xl sm:text-4xl font-black text-slate-900 font-heading tracking-tight">
                {animatedStats.ngos.toLocaleString()}+
              </div>
              <p className="text-xs font-bold text-[#1D52F2] mt-1 uppercase tracking-wider">NGOs Connected</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Verified community partners</p>
            </div>

          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* HOW FOODBRIDGE AI WORKS */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <span className="px-3 py-1 rounded-full bg-[#EBF1FE] text-[#1D52F2] text-xs font-bold uppercase tracking-wider border border-[#1D52F2]/20">
            {isNgoRole ? 'Shelter Recipient Workflow' : 'Automated 4-Step Ecosystem'}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
            {isNgoRole ? 'How FoodBridge AI Feeds Your Shelter' : 'How FoodBridge AI Operates'}
          </h2>
          <p className="text-slate-600 text-sm max-w-xl mx-auto">
            {isNgoRole 
              ? 'From local kitchen surplus listing to your shelter dining tables in 4 seamless steps.' 
              : 'From kitchen surplus upload to shelter dining tables in 4 seamless AI-driven steps.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Step 1 */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition-all hover:-translate-y-1">
            <div className="w-10 h-10 rounded-xl bg-[#EBF1FE] text-[#1D52F2] font-black flex items-center justify-center text-base">
              01
            </div>
            <h3 className="text-lg font-extrabold text-slate-900">
              {isNgoRole ? 'Donor Lists Surplus' : 'Post Surplus Food'}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {isNgoRole
                ? 'Certified restaurants, banquet halls, and hotels list prepared meals with preparation time and food details.'
                : 'Hotels, wedding halls, restaurants, or households upload excess food photos and details in under 30 seconds.'}
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition-all hover:-translate-y-1">
            <div className="w-10 h-10 rounded-xl bg-[#F0F8EC] text-[#63A644] font-black flex items-center justify-center text-base">
              02
            </div>
            <h3 className="text-lg font-extrabold text-slate-900">
              {isNgoRole ? 'AI Matches Your Shelter' : 'AI Smart Match'}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {isNgoRole
                ? 'Our matching engine pairs the donation with your shelter based on your daily capacity, location, and dietary preference.'
                : 'Our AI algorithm evaluates freshness window, distance matrix, and shelter capacity to select the optimal NGO recipient.'}
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition-all hover:-translate-y-1">
            <div className="w-10 h-10 rounded-xl bg-[#FEF3EB] text-[#F26B1D] font-black flex items-center justify-center text-base">
              03
            </div>
            <h3 className="text-lg font-extrabold text-slate-900">
              {isNgoRole ? 'Eco Courier Delivery' : 'Volunteer Dispatch'}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {isNgoRole
                ? 'Electric couriers transport the meals in thermal-insulated containers directly to your shelter address.'
                : 'Nearby volunteers accept pickup on their app dashboard and follow optimized turn-by-turn navigation route lines.'}
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition-all hover:-translate-y-1">
            <div className="w-10 h-10 rounded-xl bg-[#EBF1FE] text-[#1D52F2] font-black flex items-center justify-center text-base">
              04
            </div>
            <h3 className="text-lg font-extrabold text-slate-900">
              {isNgoRole ? 'QR Verify & Feed Occupants' : 'Verified Delivery'}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {isNgoRole
                ? 'Your shelter confirms reception with the digital QR pass, verifies quality, and serves fresh meals to occupants.'
                : 'NGO confirms meal reception, updates live impact metrics, and issues automated digital tax deduction certificate.'}
            </p>
          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* CTA BANNER */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl p-8 sm:p-12 text-center space-y-6 relative overflow-hidden bg-gradient-to-br from-[#1D52F2] via-[#133BB5] to-[#0F2D8A] text-white shadow-xl">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-white text-2xl font-bold">
            <Sparkles className="w-8 h-8" />
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight font-heading">
            {isNgoRole ? 'Keep Your Shelter Dining Facility Fully Stocked' : 'Ready to Make Zero Waste a Reality?'}
          </h2>
          <p className="text-blue-100 text-sm sm:text-base max-w-xl mx-auto">
            {isNgoRole 
              ? 'Connect with nearby commercial donors and receive fresh surplus meals delivered at zero delivery cost.'
              : 'Join thousands of restaurants, NGOs, and volunteers making an immediate impact today.'}
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-4">
            {isNgoRole ? (
              <>
                <button 
                  onClick={() => setActiveView('ngo')}
                  className="px-8 py-4 rounded-2xl bg-[#63A644] hover:bg-[#4B8233] text-white font-black text-sm shadow-xl shadow-[#63A644]/30 transition-all hover:scale-105 cursor-pointer flex items-center gap-2"
                >
                  <Building2 className="w-4 h-4 text-white" />
                  <span>Access Shelter Allocations</span>
                </button>
                <button 
                  onClick={() => setActiveView('ai-analyzer')}
                  className="px-8 py-4 rounded-2xl bg-white hover:bg-slate-100 text-[#1D52F2] font-black text-sm shadow-md transition-all hover:scale-105 cursor-pointer flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-[#1D52F2]" />
                  <span>AI Food Quality Analyzer</span>
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => {
                    if (isLoggedIn) {
                      handleAction('donor', 'donor');
                    } else {
                      onOpenAuth();
                    }
                  }}
                  className="px-8 py-4 rounded-2xl bg-[#F26B1D] hover:bg-[#C9510C] text-white font-black text-sm shadow-xl shadow-[#F26B1D]/30 transition-all hover:scale-105 cursor-pointer"
                >
                  Start Donating Today
                </button>
                <button 
                  onClick={() => {
                    if (isLoggedIn) {
                      handleAction('volunteer', 'volunteer');
                    } else {
                      onOpenAuth();
                    }
                  }}
                  className="px-8 py-4 rounded-2xl bg-white hover:bg-slate-100 text-[#1D52F2] font-black text-sm shadow-md transition-all hover:scale-105 cursor-pointer"
                >
                  Join as Volunteer
                </button>
              </>
            )}
          </div>
        </div>
      </section>

    </div>
  );
};
