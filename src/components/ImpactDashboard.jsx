import React from 'react';
import { useApp } from '../context/AppContext';
import { topVolunteers } from '../data/mockData';
import { 
  BarChart3, 
  Utensils, 
  Leaf, 
  Users, 
  Award, 
  Flame, 
  TrendingUp, 
  Globe, 
  CheckCircle2, 
  Sparkles,
  Zap
} from 'lucide-react';

export const ImpactDashboard = () => {
  const { impactStats } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-emerald-500/40 text-emerald-300 text-xs font-extrabold uppercase tracking-wider">
          <BarChart3 className="w-4 h-4 text-emerald-400" />
          <span>Sustainability & Social Impact Analytics</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white">National Impact Dashboard</h1>
        <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto">
          Measuring the real-world reduction of food waste, greenhouse emissions, and hunger mitigation across the country.
        </p>
      </div>

      {/* 4 CORE KPI IMPACT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* KPI 1: Meals Saved */}
        <div className="glass-panel p-6 rounded-3xl border border-emerald-500/30 space-y-3 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Total Meals Saved</span>
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
              <Utensils className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-white font-heading">
            {impactStats.mealsSaved.toLocaleString()}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+14.2% from last week</span>
          </div>
        </div>

        {/* KPI 2: Food Waste Reduced */}
        <div className="glass-panel p-6 rounded-3xl border border-emerald-500/30 space-y-3 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Food Waste Reduced</span>
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
              <Leaf className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-white font-heading">
            {impactStats.wasteReducedTons} <span className="text-lg font-bold text-slate-400">Tons</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Prevented landfill decay</span>
          </div>
        </div>

        {/* KPI 3: Carbon Emissions Saved */}
        <div className="glass-panel p-6 rounded-3xl border border-emerald-500/30 space-y-3 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">CO2 Emissions Saved</span>
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
              <Globe className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-white font-heading">
            {(impactStats.carbonSavedKg / 1000).toFixed(1)} <span className="text-lg font-bold text-slate-400">Tons CO2e</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Equivalent to planting 8,400 trees</span>
          </div>
        </div>

        {/* KPI 4: People Helped */}
        <div className="glass-panel p-6 rounded-3xl border border-emerald-500/30 space-y-3 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">People Helped</span>
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-white font-heading">
            {impactStats.peopleFed.toLocaleString()}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Across 628 registered shelters</span>
          </div>
        </div>

      </div>

      {/* CHARTS & LEADERBOARD GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Visual Charts (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Weekly Rescue Trend Chart */}
          <div className="glass-panel p-6 rounded-3xl border border-emerald-500/30 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Weekly Food Rescue Volume</h3>
                <p className="text-xs text-slate-400">Meals saved per day over the last 7 days</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold">
                +28.5% Growth
              </span>
            </div>

            {/* Custom SVG Responsive Bar Chart */}
            <div className="h-56 flex items-end justify-between gap-3 pt-6 px-2 border-b border-emerald-500/20">
              {[
                { day: 'Mon', count: 18400, height: '65%' },
                { day: 'Tue', count: 21200, height: '75%' },
                { day: 'Wed', count: 19800, height: '70%' },
                { day: 'Thu', count: 24500, height: '85%' },
                { day: 'Fri', count: 28900, height: '95%' },
                { day: 'Sat', count: 31200, height: '100%' },
                { day: 'Sun', count: 26400, height: '90%' },
              ].map((bar) => (
                <div key={bar.day} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="w-full bg-emerald-950 rounded-t-xl overflow-hidden h-44 relative flex items-end">
                    <div 
                      className="w-full bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-xl transition-all duration-700 group-hover:from-emerald-500 group-hover:to-emerald-300"
                      style={{ height: bar.height }}
                    >
                      <div className="absolute top-1 left-1/2 -translate-x-1/2 text-[9px] font-bold text-emerald-950 opacity-0 group-hover:opacity-100 transition-opacity">
                        {(bar.count / 1000).toFixed(1)}k
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-400">{bar.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Food Category Distribution Breakdown */}
          <div className="glass-panel p-6 rounded-3xl border border-emerald-500/30 space-y-4">
            <h3 className="text-base font-bold text-white">Food Rescue Breakdown by Category</h3>
            
            <div className="space-y-3">
              {[
                { name: "Cooked Meals (Banquets & Caterers)", pct: 45, color: "bg-emerald-500" },
                { name: "Bakery & Fresh Pastries", pct: 25, color: "bg-emerald-400" },
                { name: "Fresh Organic Produce", pct: 18, color: "bg-amber-400" },
                { name: "Packaged & Dairy Goods", pct: 12, color: "bg-blue-400" },
              ].map(cat => (
                <div key={cat.name} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-300">{cat.name}</span>
                    <span className="text-emerald-400 font-bold">{cat.pct}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-emerald-950 overflow-hidden">
                    <div className={`h-full ${cat.color} rounded-full`} style={{ width: `${cat.pct}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Top Volunteers Leaderboard (5 Cols) */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-3xl border border-emerald-500/30 shadow-2xl space-y-6">
          
          <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-bold text-white">Top Volunteer Champions</h2>
            </div>
            <span className="text-xs text-amber-400 font-bold">Leaderboard</span>
          </div>

          <div className="space-y-3">
            {topVolunteers.map((vol) => (
              <div 
                key={vol.rank}
                className="glass-card p-3.5 rounded-2xl border border-emerald-500/20 flex items-center justify-between gap-3 group hover:border-amber-400/50"
              >
                <div className="flex items-center gap-3">
                  <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-extrabold text-xs ${
                    vol.rank === 1 ? 'bg-amber-400 text-amber-950 shadow-md shadow-amber-400/30' :
                    vol.rank === 2 ? 'bg-slate-300 text-slate-950' :
                    vol.rank === 3 ? 'bg-amber-700 text-white' : 'bg-emerald-900/60 text-slate-400'
                  }`}>
                    #{vol.rank}
                  </span>

                  <img 
                    src={vol.avatar} 
                    alt={vol.name}
                    className="w-10 h-10 object-cover rounded-full border border-emerald-500/30"
                  />

                  <div>
                    <h3 className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">{vol.name}</h3>
                    <span className="text-[10px] font-semibold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded">
                      {vol.badge}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xs font-extrabold text-emerald-400">{vol.points} pts</p>
                  <p className="text-[10px] text-slate-400">{vol.pickups} Pickups</p>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
};
