import React, { useState } from 'react';
import { 
  BarChart3, 
  Utensils, 
  Leaf, 
  Users, 
  Droplets, 
  Sparkles, 
  Sliders, 
  TrendingUp, 
  CheckCircle2,
  Award
} from 'lucide-react';

export const AIImpactPredictor = () => {
  const [weightKg, setWeightKg] = useState(50);
  const [foodCategory, setFoodCategory] = useState('Cooked Meals');

  // Multipliers based on category
  const multipliers = {
    'Cooked Meals': { mealsPerKg: 2.5, co2PerKg: 2.6, waterPerKg: 190 },
    'Bakery & Pastries': { mealsPerKg: 2.2, co2PerKg: 1.8, waterPerKg: 140 },
    'Fresh Produce': { mealsPerKg: 2.8, co2PerKg: 1.2, waterPerKg: 210 },
    'Packaged Goods': { mealsPerKg: 2.4, co2PerKg: 2.2, waterPerKg: 160 },
  };

  const currentMult = multipliers[foodCategory] || multipliers['Cooked Meals'];

  const mealsServed = Math.floor(weightKg * currentMult.mealsPerKg);
  const wasteReducedTons = (weightKg / 1000).toFixed(3);
  const carbonSavedKg = (weightKg * currentMult.co2PerKg).toFixed(1);
  const waterSavedLiters = Math.floor(weightKg * currentMult.waterPerKg);

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 space-y-8 shadow-sm">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EBF1FE] text-[#1D52F2] text-xs font-bold border border-[#1D52F2]/30">
            <Sparkles className="w-3.5 h-3.5 text-[#1D52F2]" />
            <span>Environmental Impact Predictor Model</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">AI Impact Prediction Engine</h2>
          <p className="text-xs text-slate-500">
            Simulate the social and ecological savings of rescuing any quantity of surplus food.
          </p>
        </div>

        <span className="px-3.5 py-1.5 rounded-full bg-[#F0F8EC] border border-[#63A644]/30 text-[#63A644] text-xs font-extrabold flex items-center gap-1.5">
          <Award className="w-4 h-4 text-[#63A644]" />
          <span>UN SDG 12.3 & 2.1 Compliant</span>
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Column: Interactive Sliders & Category Selector (5 Cols) */}
        <div className="lg:col-span-5 bg-[#F8FAFC] p-6 rounded-3xl border border-slate-200 space-y-6">
          
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#1D52F2]" />
            <span>Simulation Parameters</span>
          </h3>

          {/* Quantity Slider */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-slate-700">Surplus Food Weight (kg)</label>
              <span className="font-black text-[#1D52F2] bg-[#EBF1FE] px-3 py-1 rounded-xl text-sm border border-[#1D52F2]/20">
                {weightKg} kg
              </span>
            </div>

            <input 
              type="range" 
              min="5" 
              max="500" 
              step="5"
              value={weightKg}
              onChange={(e) => setWeightKg(Number(e.target.value))}
              className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#1D52F2]"
            />
            
            <div className="flex justify-between text-[10px] text-slate-500 font-semibold">
              <span>5 kg (Small Cafe)</span>
              <span>250 kg (Hotel Banquet)</span>
              <span>500 kg (Convention)</span>
            </div>
          </div>

          {/* Food Category Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">Food Category Type</label>
            <div className="grid grid-cols-2 gap-2">
              {Object.keys(multipliers).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFoodCategory(cat)}
                  className={`p-2.5 rounded-xl text-xs font-bold transition-all text-left border cursor-pointer ${
                    foodCategory === cat 
                      ? 'bg-[#1D52F2] text-white border-[#1D52F2] shadow-xs' 
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Info pill */}
          <div className="p-3 rounded-2xl bg-white border border-slate-200 text-[11px] text-slate-500 leading-relaxed flex items-start gap-2 shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-[#63A644] shrink-0 mt-0.5" />
            <span>AI model dynamically calculates nutritional yield, meals produced, and water resource savings.</span>
          </div>

        </div>

        {/* Right Column: 4 Result Cards (7 Cols) */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Card 1: Estimated Meals Served */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3 relative overflow-hidden group hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#EBF1FE] flex items-center justify-center text-[#1D52F2] group-hover:scale-110 transition-transform">
              <Utensils className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Estimated Meals Served</p>
              <div className="text-3xl sm:text-4xl font-black text-slate-900 font-heading mt-1">
                {mealsServed.toLocaleString()} <span className="text-base text-[#1D52F2] font-bold">Meals</span>
              </div>
            </div>
            <p className="text-[11px] text-[#63A644] font-bold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> Direct hunger mitigation
            </p>
          </div>

          {/* Card 2: Food Waste Reduced */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3 relative overflow-hidden group hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#F0F8EC] flex items-center justify-center text-[#63A644] group-hover:scale-110 transition-transform">
              <Leaf className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Food Waste Reduced</p>
              <div className="text-3xl sm:text-4xl font-black text-slate-900 font-heading mt-1">
                {weightKg} <span className="text-base text-slate-500 font-bold">kg ({wasteReducedTons} Tons)</span>
              </div>
            </div>
            <p className="text-[11px] text-[#63A644] font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> 100% diverted from landfill
            </p>
          </div>

          {/* Card 3: Estimated People Fed */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3 relative overflow-hidden group hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#FEF3EB] flex items-center justify-center text-[#F26B1D] group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Estimated People Fed</p>
              <div className="text-3xl sm:text-4xl font-black text-slate-900 font-heading mt-1">
                {mealsServed.toLocaleString()} <span className="text-base text-[#F26B1D] font-bold">People</span>
              </div>
            </div>
            <p className="text-[11px] text-[#F26B1D] font-bold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> Direct hunger mitigation
            </p>
          </div>

          {/* Card 4: Water Saved */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3 relative overflow-hidden group hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#EBF1FE] flex items-center justify-center text-[#1D52F2] group-hover:scale-110 transition-transform">
              <Droplets className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Virtual Water Saved</p>
              <div className="text-3xl sm:text-4xl font-black text-slate-900 font-heading mt-1">
                {waterSavedLiters.toLocaleString()} <span className="text-base text-[#1D52F2] font-bold">Liters</span>
              </div>
            </div>
            <p className="text-[11px] text-[#1D52F2] font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Agricultural footprint saved
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
