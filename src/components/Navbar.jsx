import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, 
  HeartHandshake, 
  ShieldCheck, 
  BarChart3, 
  MapPin, 
  Bell, 
  User, 
  Menu,
  X,
  Camera,
  Truck,
  Building2,
  Smartphone,
  LogOut
} from 'lucide-react';

export const Navbar = ({ onOpenAuth }) => {
  const { 
    activeView, 
    setActiveView, 
    unreadNotifCount, 
    currentUser, 
    setSmsModalOpen,
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
    'landing': { id: 'landing', label: 'Home', mobileLabel: 'Landing Page', icon: null },
    'donor': { id: 'donor', label: 'Donor', mobileLabel: 'Donor Dashboard', icon: HeartHandshake },
    'ai-analyzer': { id: 'ai-analyzer', label: 'Food Quality Check', mobileLabel: 'Food Quality Check', icon: Camera, iconColor: 'text-emerald-400' },
    'volunteer': { id: 'volunteer', label: 'Volunteers', mobileLabel: 'Volunteer Hub', icon: Truck },
    'ngo': { id: 'ngo', label: 'NGOs', mobileLabel: 'NGO Shelters', icon: Building2 },
    'live-tracking': { id: 'live-tracking', label: 'Live Map', mobileLabel: 'Live GPS Tracker', icon: MapPin, iconColor: 'text-emerald-400' },
    'impact': { id: 'impact', label: 'Impact', mobileLabel: 'Impact & Analytics', icon: BarChart3 },
    'admin': { id: 'admin', label: 'Admin', mobileLabel: 'Admin Dashboard', icon: ShieldCheck }
  };

  const getTabsForRole = (role) => {
    if (!role) return ['landing'];
    if (role === 'donor') return ['landing', 'donor', 'ai-analyzer', 'volunteer', 'ngo', 'live-tracking', 'impact'];
    if (role === 'volunteer') return ['landing', 'volunteer', 'donor', 'ngo', 'live-tracking', 'impact'];
    if (role === 'ngo') return ['landing', 'ngo', 'donor', 'volunteer', 'live-tracking', 'impact'];
    if (role === 'admin') return ['landing', 'admin', 'donor', 'volunteer', 'ngo', 'live-tracking', 'impact'];
    return ['landing'];
  };

  const visibleTabIds = getTabsForRole(currentRole);

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-emerald-500/20 bg-emerald-950/90 backdrop-blur-md">
      <div className="max-w-[1440px] mx-auto px-3 sm:px-5 lg:px-6 h-20 flex items-center justify-between gap-2">
        
        {/* Brand Logo */}
        <div 
          onClick={() => handleNavClick('landing')}
          className="flex items-center gap-2.5 cursor-pointer group shrink-0"
        >
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-emerald-500/30 group-hover:scale-105 transition-transform border border-emerald-500/50">
            <img src="/logo.jpg" alt="FoodBridge AI Logo" className="w-full h-full object-cover" />
            <div className="absolute -inset-1 rounded-xl bg-emerald-400/20 blur-sm -z-10 group-hover:bg-emerald-400/40 transition-colors"></div>
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-lg font-extrabold tracking-tight text-white font-heading">
                FoodBridge <span className="text-emerald-400">AI</span>
              </span>
              <span className="px-1.5 py-0.2 text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                LIVE
              </span>
            </div>
            <p className="text-[10px] text-emerald-200/70 font-medium tracking-wide hidden sm:block">Zero Food Waste • Zero Hunger</p>
          </div>
        </div>

        {/* Center Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1 bg-emerald-900/30 p-1 rounded-full border border-emerald-500/20 overflow-x-auto no-scrollbar">
          {visibleTabIds.map(tabId => {
            const tab = ALL_TABS[tabId];
            const Icon = tab.icon;
            const isActive = activeView === tabId;
            return (
              <button
                key={tabId}
                onClick={() => handleNavClick(tabId)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all flex items-center gap-1 whitespace-nowrap ${
                  isActive 
                    ? 'bg-emerald-500 text-emerald-950 shadow-md shadow-emerald-500/20 font-bold' 
                    : 'text-slate-300 hover:text-white hover:bg-emerald-800/40'
                }`}
              >
                {Icon && <Icon className={`w-3.5 h-3.5 ${tab.iconColor || ''}`} />}
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Right Actions: Mobile SMS Alerts, Notifications, User Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          
          {/* Mobile SMS Alerts Button */}
          <button
            onClick={() => setSmsModalOpen(true)}
            className="px-2.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-[11px] font-extrabold transition-all flex items-center gap-1 shrink-0"
            title="Configure Mobile SMS Notifications"
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden xl:inline">SMS Alerts</span>
          </button>

          {/* Notifications Button */}
          <button 
            onClick={() => handleNavClick('notifications')}
            className="relative p-2 rounded-xl bg-emerald-900/40 text-slate-200 hover:text-white hover:bg-emerald-800/60 border border-emerald-500/30 transition-all shrink-0"
            title="Notifications"
          >
            <Bell className="w-3.5 h-3.5" />
            {unreadNotifCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-bold text-emerald-950 animate-bounce">
                {unreadNotifCount}
              </span>
            )}
          </button>

          {/* User Profile Button */}
          <button
            onClick={isLoggedIn ? logout : onOpenAuth}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-emerald-950 font-bold text-[11px] sm:text-xs shadow-md shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95 shrink-0"
          >
            {isLoggedIn ? <LogOut className="w-3.5 h-3.5 shrink-0" /> : <User className="w-3.5 h-3.5 shrink-0" />}
            <span className="truncate max-w-[90px] sm:max-w-[110px]">{isLoggedIn ? (currentUser?.name?.split(' ')[0]) : 'Sign In'}</span>
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-emerald-900/40 border border-emerald-500/30 text-slate-200 shrink-0"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-emerald-500/20 bg-emerald-950/95 p-4 space-y-2">
          {visibleTabIds.map(tabId => {
            const tab = ALL_TABS[tabId];
            return (
              <button 
                key={tabId}
                onClick={() => handleNavClick(tabId)} 
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-emerald-800/40 ${tab.iconColor || 'text-slate-200'}`}
              >
                {tab.mobileLabel}
              </button>
            );
          })}
          
          <button onClick={() => { setSmsModalOpen(true); setMobileMenuOpen(false); }} className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-amber-300 hover:bg-emerald-800/40 flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-emerald-400" />
            <span>Mobile Phone SMS Alerts</span>
          </button>
        </div>
      )}
    </header>
  );
};
