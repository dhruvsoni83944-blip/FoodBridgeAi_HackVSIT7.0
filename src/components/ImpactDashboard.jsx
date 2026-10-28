import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  BarChart3, 
  Utensils, 
  Leaf, 
  Users, 
  Award, 
  TrendingUp, 
  CheckCircle2, 
  Package
} from 'lucide-react';

export const ImpactDashboard = () => {
  const { impactStats, registeredVolunteers, registeredNGOs, donations } = useApp();

  // Compute real dynamic total weight in kg
  const totalWasteKg = impactStats.totalWasteKg !== undefined 
    ? impactStats.totalWasteKg 
    : donations.reduce((acc, d) => {
        const match = String(d.quantity || '').match(/(\d+(\.\d+)?)/);
        return acc + (match ? parseFloat(match[0]) : 10);
      }, 0);

  const wasteDisplay = totalWasteKg >= 1000
    ? { val: (totalWasteKg / 1000).toFixed(2), unit: 'Tons' }
    : { val: totalWasteKg > 0 ? totalWasteKg.toFixed(1) : '0', unit: 'kg' };

  // Calculate real daily rescue volume from live donations
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const getDonationMeals = (d) => {
    if (Number(d.peopleFedCount) > 0) return Number(d.peopleFedCount);
    const match = String(d.quantity || '').match(/(\d+(\.\d+)?)/);
    if (match) return Math.floor(parseFloat(match[0]) * 2.5);
    return 10;
  };

  const getDonationDayIdx = (d) => {
    let dateObj = null;
    if (d.createdTimestamp) {
      dateObj = new Date(d.createdTimestamp);
    } else if (d.createdDate) {
      dateObj = new Date(d.createdDate);
    } else if (d.createdAt && !isNaN(Date.parse(d.createdAt))) {
      dateObj = new Date(d.createdAt);
    }
    if (!dateObj || isNaN(dateObj.getTime())) {
      dateObj = new Date();
    }
    // Convert so Monday = 0, Sunday = 6
    return (dateObj.getDay() + 6) % 7;
  };

  const currentDayIdx = (new Date().getDay() + 6) % 7;

  const weeklyData = dayNames.map((day, idx) => {
    const dayDonations = donations.filter(d => getDonationDayIdx(d) === idx);
    const meals = dayDonations.reduce((acc, d) => acc + getDonationMeals(d), 0);
    return {
      day,
      count: meals,
      donationsCount: dayDonations.length,
      isToday: idx === currentDayIdx
    };
  });

  const totalWeeklyMeals = weeklyData.reduce((sum, item) => sum + item.count, 0);
  const maxWeeklyMeals = Math.max(...weeklyData.map(w => w.count), 1);

  // Compute real category breakdown from live donations
  const categoryColors = {
    'Cooked Meals': 'bg-[#1D52F2]',
    'Bakery & Pastries': 'bg-[#63A644]',
    'Packaged Foods': 'bg-[#3B82F6]',
    'Raw Ingredients': 'bg-[#8B5CF6]',
    'Fresh Produce': 'bg-[#F26B1D]',
    'Beverages & Dairy': 'bg-[#06B6D4]'
  };

  const categoryCounts = {};
  donations.forEach(d => {
    const cat = d.category || 'Cooked Meals';
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });

  const totalDonationsCount = donations.length;
  const categoriesList = Object.entries(categoryCounts).map(([name, count]) => ({
    name,
    count,
    pct: totalDonationsCount > 0 ? Math.round((count / totalDonationsCount) * 100) : 0,
    color: categoryColors[name] || 'bg-[#1D52F2]'
  })).sort((a, b) => b.count - a.count);

  // Sort volunteers by points and completed pickups
  const sortedVolunteers = [...registeredVolunteers].sort((a, b) => {
    return (b.points || 0) - (a.points || 0) || (b.completedPickups || 0) - (a.completedPickups || 0);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EBF1FE] text-[#1D52F2] text-xs font-black uppercase tracking-wider border border-[#1D52F2]/30 shadow-xs">
          <BarChart3 className="w-4 h-4 text-[#1D52F2]" />
          <span>Sustainability & Social Impact Analytics</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900">National Impact Dashboard</h1>
        <p className="text-slate-600 text-xs sm:text-sm max-w-xl mx-auto">
          Measuring the real-world reduction of food waste, hunger mitigation, and community relief across the country.
        </p>
      </div>

      {/* 3 CORE REAL KPI IMPACT CARDS (CO2 emissions removed as requested) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        {/* KPI 1: Meals Saved */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-3 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1D52F2]">Total Meals Saved</span>
            <div className="p-2.5 rounded-xl bg-[#EBF1FE] text-[#1D52F2]">
              <Utensils className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-slate-900 font-heading">
            {impactStats.mealsSaved.toLocaleString()}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#1D52F2] font-bold">
            <TrendingUp className="w-4 h-4" />
            <span>Rescued from {donations.length} live donation{donations.length === 1 ? '' : 's'}</span>
          </div>
        </div>

        {/* KPI 2: Food Waste Reduced */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-3 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#63A644]">Food Waste Reduced</span>
            <div className="p-2.5 rounded-xl bg-[#F0F8EC] text-[#63A644]">
              <Leaf className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-slate-900 font-heading">
            {wasteDisplay.val} <span className="text-lg font-bold text-slate-500">{wasteDisplay.unit}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#63A644] font-bold">
            <TrendingUp className="w-4 h-4" />
            <span>Prevented landfill decay</span>
          </div>
        </div>

        {/* KPI 3: People Helped */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-3 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F26B1D]">People Helped</span>
            <div className="p-2.5 rounded-xl bg-[#FEF3EB] text-[#F26B1D]">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-slate-900 font-heading">
            {impactStats.peopleFed.toLocaleString()}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#F26B1D] font-bold">
            <TrendingUp className="w-4 h-4" />
            <span>Across {registeredNGOs.length} registered shelter{registeredNGOs.length === 1 ? '' : 's'}</span>
          </div>
        </div>

      </div>

      {/* CHARTS & LEADERBOARD GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Visual Charts (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Weekly Rescue Trend Chart */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Weekly Food Rescue Volume</h3>
                <p className="text-xs text-slate-500">Meals saved per day over the current week</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#F0F8EC] text-[#63A644] text-xs font-bold border border-[#63A644]/30">
                {totalWeeklyMeals > 0 ? `${totalWeeklyMeals.toLocaleString()} Meals Logged` : '0 Active Rescues'}
              </span>
            </div>

            {/* Responsive Bar Chart */}
            <div className="h-56 flex items-end justify-between gap-3 pt-6 px-2 border-b border-slate-200">
              {weeklyData.map((bar) => {
                const heightPercent = bar.count > 0 
                  ? Math.max(16, Math.round((bar.count / maxWeeklyMeals) * 100)) 
                  : 4;
                
                const barColor = bar.isToday 
                  ? 'from-[#63A644] to-[#84CC16]' 
                  : bar.count > 0 
                    ? 'from-[#1D52F2] to-[#3B82F6]' 
                    : 'from-slate-200 to-slate-300';

                return (
                  <div key={bar.day} className="flex-1 flex flex-col items-center gap-2 group">
                    <div className="w-full bg-slate-100 rounded-t-xl overflow-hidden h-44 relative flex items-end">
                      <div 
                        className={`w-full bg-gradient-to-t ${barColor} rounded-t-xl transition-all duration-700 shadow-xs`}
                        style={{ height: `${heightPercent}%` }}
                      >
                        <div className="absolute top-1 left-1/2 -translate-x-1/2 text-[9px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-slate-900/80 px-1.5 py-0.5 rounded shadow-xs pointer-events-none">
                          {bar.count >= 1000 ? `${(bar.count / 1000).toFixed(1)}k` : `${bar.count} meals`}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className={`text-[11px] font-bold ${bar.isToday ? 'text-[#63A644]' : 'text-slate-600'}`}>
                        {bar.day}
                      </span>
                      {bar.isToday && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#63A644] mt-0.5" title="Today"></span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Food Category Distribution Breakdown */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-slate-900">Food Rescue Breakdown by Category</h3>
              <span className="text-xs font-bold text-slate-500">{totalDonationsCount} Total Listings</span>
            </div>

            {categoriesList.length > 0 ? (
              <div className="space-y-3.5">
                {categoriesList.map(cat => (
                  <div key={cat.name} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-700">{cat.name} ({cat.count} listing{cat.count === 1 ? '' : 's'})</span>
                      <span className="text-slate-900 font-extrabold">{cat.pct}%</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                      <div 
                        className={`h-full ${cat.color} rounded-full transition-all duration-500`} 
                        style={{ width: `${Math.max(cat.pct, 4)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-slate-400 text-xs font-medium">
                No donations listed yet. When donors list surplus food, the category breakdown will appear here.
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Top Volunteers Leaderboard (5 Cols) */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-[#F26B1D]" />
              <h2 className="text-lg font-black text-slate-900">Top Volunteer Champions</h2>
            </div>
            <span className="text-xs text-[#F26B1D] font-extrabold bg-[#FEF3EB] px-2.5 py-0.5 rounded-full border border-[#F26B1D]/20">Leaderboard</span>
          </div>

          {sortedVolunteers && sortedVolunteers.length > 0 ? (
            <div className="space-y-3">
              {sortedVolunteers.map((vol, idx) => (
                <div 
                  key={vol.id || idx}
                  className="p-3.5 rounded-2xl border border-slate-200 bg-[#F8FAFC] flex items-center justify-between gap-3 group hover:border-[#1D52F2]/30 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs ${
                      idx === 0 ? 'bg-[#F26B1D] text-white shadow-xs' :
                      idx === 1 ? 'bg-[#1D52F2] text-white' :
                      idx === 2 ? 'bg-[#63A644] text-white' : 'bg-slate-200 text-slate-700'
                    }`}>
                      #{idx + 1}
                    </span>

                    <img 
                      src={vol.photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"} 
                      alt={vol.name}
                      className="w-10 h-10 object-cover rounded-full border border-slate-200"
                    />

                    <div>
                      <h3 className="text-xs font-bold text-slate-900 group-hover:text-[#1D52F2] transition-colors">{vol.name}</h3>
                      <span className="text-[10px] font-semibold text-[#F26B1D] bg-[#FEF3EB] px-2 py-0.5 rounded">
                        {vol.vehicle || "Eco Courier"}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-xs font-black text-[#63A644]">{vol.points || 0} pts</p>
                    <p className="text-[10px] text-slate-500">{vol.completedPickups || 0} Pickups</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-[#F8FAFC] rounded-2xl border border-dashed border-slate-200">
              <Award className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-700">No Volunteer Couriers Yet</p>
              <p className="text-[11px] text-slate-400 mt-1 max-w-[240px] mx-auto">Volunteers who register will appear on this community leaderboard.</p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
