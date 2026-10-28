import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  HeartHandshake, 
  ShieldCheck, 
  BarChart3, 
  MapPin, 
  Bell, 
  Menu,
  X,
  Camera,
  Truck,
  Building2,
  LogOut,
  BookOpen,
  Utensils
} from 'lucide-react';

export const Navbar = ({ onOpenAuth }) => {
  const { 
    activeView, 
    setActiveView, 
    unreadNotifCount, 
    currentUser, 
    currentRole, 
    isLoggedIn,
    logout
  } = useApp();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (viewId) => {
    setActiveView(viewId);
    setMobileMenuOpen(false);
  };

  const ALL_TABS = {
    'landing': { id: 'landing', label: 'Home', mobileLabel: 'Home Dashboard', icon: null },
    'learn-more': { id: 'learn-more', label: 'Learn More', mobileLabel: 'Learn More & Mission', icon: BookOpen, iconColor: 'text-[#1D52F2]' },
    'donor': { id: 'donor', label: 'Donor Hub', mobileLabel: 'Donor Dashboard', icon: HeartHandshake },
    'ai-analyzer': { id: 'ai-analyzer', label: 'Quality Check', mobileLabel: 'Food Quality Check', icon: Camera, iconColor: 'text-[#63A644]' },
    'volunteer': { 
      id: 'volunteer', 
      label: currentRole === 'volunteer' ? 'Deliveries' : 'Volunteers', 
      mobileLabel: currentRole === 'volunteer' ? 'My Deliveries' : 'Volunteer Hub', 
      icon: Truck 
    },
    'ngo': { id: 'ngo', label: 'NGO Shelters', mobileLabel: 'NGO Shelters', icon: Building2 },
    'live-tracking': { id: 'live-tracking', label: 'Live GPS', mobileLabel: 'Live GPS Tracker', icon: MapPin, iconColor: 'text-[#1D52F2]' },
    'impact': { id: 'impact', label: 'Impact & ESG', mobileLabel: 'Impact & Analytics', icon: BarChart3 },
    'admin': { id: 'admin', label: 'Admin', mobileLabel: 'Admin Dashboard', icon: ShieldCheck }
  };

  const getTabsForRole = (role) => {
    if (!role) return ['landing', 'learn-more', 'impact'];
    if (role === 'donor') return ['landing', 'learn-more', 'donor', 'ai-analyzer', 'live-tracking', 'impact'];
    if (role === 'volunteer') return ['landing', 'learn-more', 'volunteer', 'live-tracking', 'impact'];
    if (role === 'ngo') return ['landing', 'learn-more', 'ngo', 'ai-analyzer', 'live-tracking', 'impact'];
    if (role === 'admin') return ['landing', 'learn-more', 'admin', 'donor', 'volunteer', 'ngo', 'ai-analyzer', 'live-tracking', 'impact'];
    return ['landing', 'learn-more', 'impact'];
  };

  const visibleTabIds = getTabsForRole(currentRole);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/90 shadow-xs">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-3">
        
        {/* Brand Logo */}
        <div 
          onClick={() => handleNavClick('landing')}
          className="flex items-center gap-3 cursor-pointer group shrink-0"
        >
          <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl overflow-hidden shadow-md shadow-[#1D52F2]/15 group-hover:scale-105 transition-all border border-slate-200 bg-white p-1">
            <img src="/logo.jpg" alt="FoodBridge AI Logo" className="w-full h-full object-contain rounded-xl" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black tracking-tight text-slate-900 font-heading">
                FoodBridge <span className="text-[#1D52F2]">AI</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-semibold tracking-wide hidden sm:block">Zero Food Waste • Zero Hunger</p>
          </div>
        </div>

        {/* Center Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#F2F2F2] p-1.5 rounded-full border border-slate-200 overflow-x-auto no-scrollbar shadow-inner">
          {visibleTabIds.map(tabId => {
            const tab = ALL_TABS[tabId];
            const Icon = tab.icon;
            const isActive = activeView === tabId;
            return (
              <button
                key={tabId}
                onClick={() => handleNavClick(tabId)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  isActive 
                    ? 'bg-[#1D52F2] text-white shadow-md shadow-[#1D52F2]/30 font-bold' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                }`}
              >
                {Icon && <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : (tab.iconColor || 'text-slate-500')}`} />}
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Right Actions: Notifications, Themed Food & Helping Sign-In Button */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          
          {/* Notifications Button */}
          <button 
            onClick={() => handleNavClick('notifications')}
            className="relative p-2.5 rounded-xl bg-slate-100 text-slate-700 hover:text-slate-900 hover:bg-slate-200/80 border border-slate-200 transition-all shrink-0 cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#F26B1D] text-[10px] font-bold text-white shadow-xs animate-bounce">
                {unreadNotifCount}
              </span>
            )}
          </button>

          {/* Customized Food & Helping Login / Mission Button */}
          <button
            onClick={isLoggedIn ? logout : onOpenAuth}
            className="group flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-[#1D52F2] via-[#1D52F2] to-[#133BB5] hover:from-[#133BB5] hover:to-[#0F2D8A] text-white font-black text-xs shadow-md shadow-[#1D52F2]/25 transition-all hover:scale-[1.03] active:scale-[0.98] shrink-0 border border-white/20 cursor-pointer"
            title={isLoggedIn ? "Click to Log Out" : "Join the Food Rescue Mission & Sign In"}
          >
            {isLoggedIn ? (
              <>
                <div className="w-5 h-5 rounded-full bg-white/20 border border-white/40 flex items-center justify-center text-white shrink-0">
                  <Utensils className="w-3 h-3 text-white" />
                </div>
                <span className="truncate max-w-[90px] sm:max-w-[130px]">
                  {currentUser?.name?.split(' ')[0]}
                </span>
                <LogOut className="w-3.5 h-3.5 text-blue-200 group-hover:text-white transition-colors ml-0.5" />
              </>
            ) : (
              <>
                <div className="p-1 rounded-lg bg-white/15 text-white flex items-center justify-center shrink-0">
                  <HeartHandshake className="w-3.5 h-3.5 text-white animate-pulse" />
                </div>
                <span className="flex items-center gap-1.5">
                  <span>Rescue Food</span>
                  <span className="opacity-60">•</span>
                  <span className="font-extrabold text-[#F0F8EC]">Sign In</span>
                </span>
              </>
            )}
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 shrink-0 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white/98 backdrop-blur-xl p-4 space-y-1.5 shadow-xl">
          {visibleTabIds.map(tabId => {
            const tab = ALL_TABS[tabId];
            const Icon = tab.icon;
            const isActive = activeView === tabId;
            return (
              <button 
                key={tabId}
                onClick={() => handleNavClick(tabId)} 
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2.5 transition-colors ${
                  isActive 
                    ? 'bg-[#1D52F2] text-white' 
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {Icon && <Icon className={`w-4 h-4 ${isActive ? 'text-white' : (tab.iconColor || 'text-slate-500')}`} />}
                <span>{tab.mobileLabel}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
