import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  HeartHandshake, 
  Truck, 
  Building2, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Cpu, 
  Utensils, 
  ChevronDown, 
  ChevronUp, 
  Thermometer, 
  FileText
} from 'lucide-react';

export const LearnMorePage = () => {
  const { setActiveView } = useApp();
  const [activeFaq, setActiveFaq] = useState(null);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const faqs = [
    {
      q: "Who can donate surplus food through FoodBridge AI?",
      a: "Any registered entity or individual with safe, edible surplus food can donate. This includes luxury hotels, banquet halls, restaurants, corporate cafeterias, supermarkets, wedding caterers, and even households with excess buffet portions."
    },
    {
      q: "How does the AI Smart Match Engine select the recipient NGO?",
      a: "Our algorithm continuously evaluates three real-time vectors: 1) The Exponential Food Decay Curve (safe consumption window), 2) Spatial Proximity Matrix (distance in km between donor, volunteer, and shelter), and 3) Real-Time Shelter Intake Capacity. The recipient with the highest urgency-intake match score is prioritized automatically."
    },
    {
      q: "How does the automated Section 80G / 501(c)(3) tax receipt work?",
      a: "Once an NGO shelter scans the delivery QR code to confirm safe arrival, our system calculates the fair-market meal value based on category and weight. An official, cryptographically verified digital tax receipt is automatically issued to the donor's email and account dashboard."
    },
    {
      q: "What food safety and hygiene protocols are enforced?",
      a: "We adhere strictly to international food safety standards (FSSAI & WHO). Cooked hot meals must be packed above 60°C (140°F), and perishable items below 4°C (40°F). Volunteers transport food in thermal-insulated, tamper-evident carriers. AI vision analysis checks food appearance prior to courier dispatch."
    },
    {
      q: "What vehicles do volunteer couriers use?",
      a: "To achieve zero food waste without increasing city emissions, our volunteer fleet prioritizes Eco EV Scooters, E-Bikes, and electric delivery vans. For bulk catering rescue (>100 kg), volunteers with larger vehicles are dynamically assigned."
    }
  ];

  return (
    <div className="space-y-16 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Hero Header */}
      <div className="relative bg-white rounded-3xl p-8 sm:p-14 border border-slate-200 shadow-sm overflow-hidden text-center space-y-6">
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#1D52F2]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-[#63A644]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EBF1FE] text-[#1D52F2] text-xs font-black tracking-wide uppercase border border-[#1D52F2]/30">
          <Sparkles className="w-4 h-4 text-[#1D52F2]" />
          <span>The FoodBridge AI Architecture & Mission</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
          Bridging the Void Between <br />
          <span className="text-gradient-brand">Excess Surplus & Community Hunger</span>
        </h1>

        <p className="text-slate-600 text-sm sm:text-lg max-w-3xl mx-auto leading-relaxed">
          Over 40% of all food produced is wasted globally while millions experience nutritional scarcity. 
          FoodBridge AI transforms perishable surplus into immediate community nourishment through autonomous neural dispatch, zero-emission logistics, and end-to-end verification.
        </p>

        {/* Quick Action Badges */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => {
              setActiveView('donor');
            }}
            className="px-6 py-3.5 rounded-2xl bg-[#1D52F2] hover:bg-[#133BB5] text-white font-extrabold text-xs shadow-md shadow-[#1D52F2]/25 transition-all hover:scale-105 flex items-center gap-2 cursor-pointer"
          >
            <HeartHandshake className="w-4 h-4" />
            <span>Donate Surplus Food</span>
          </button>

          <button
            onClick={() => {
              setActiveView('volunteer');
            }}
            className="px-6 py-3.5 rounded-2xl bg-[#FEF3EB] hover:bg-[#F26B1D]/15 text-[#F26B1D] font-extrabold text-xs border border-[#F26B1D]/30 transition-all hover:scale-105 flex items-center gap-2 cursor-pointer"
          >
            <Truck className="w-4 h-4" />
            <span>Join Volunteer Fleet</span>
          </button>

          <button
            onClick={() => {
              setActiveView('ngo');
            }}
            className="px-6 py-3.5 rounded-2xl bg-[#F0F8EC] hover:bg-[#63A644]/15 text-[#63A644] font-extrabold text-xs border border-[#63A644]/30 transition-all hover:scale-105 flex items-center gap-2 cursor-pointer"
          >
            <Building2 className="w-4 h-4" />
            <span>Register NGO Shelter</span>
          </button>
        </div>
      </div>

      {/* 3-Pillar Ecosystem */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-black text-[#1D52F2] uppercase tracking-widest">Our Connected Ecosystem</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Three Roles, One Unified Rescue Network</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Pillar 1: Donors */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-5 hover:shadow-md hover:border-[#1D52F2]/40 transition-all group">
            <div className="w-14 h-14 rounded-2xl bg-[#EBF1FE] text-[#1D52F2] flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
              <Utensils className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[10px] font-black text-[#1D52F2] uppercase tracking-wider bg-[#EBF1FE] px-2.5 py-0.5 rounded-full border border-[#1D52F2]/20">
                Supply Side
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-2">Food Donors</h3>
              <p className="text-xs text-slate-500 mt-1">Hotels, Caterers, Restaurants & Households</p>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#63A644] shrink-0 mt-0.5" />
                <span><strong>Instant 30-Sec Listing:</strong> Upload surplus quantity, expiry window, and pickup coordinates.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#63A644] shrink-0 mt-0.5" />
                <span><strong>AI Freshness Verification:</strong> Real-time neural vision audit validates consumable quality.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#63A644] shrink-0 mt-0.5" />
                <span><strong>Automated Tax Receipts:</strong> Instant 80G tax credit calculation upon completed delivery.</span>
              </li>
            </ul>
          </div>

          {/* Pillar 2: Volunteers */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-5 hover:shadow-md hover:border-[#F26B1D]/40 transition-all group">
            <div className="w-14 h-14 rounded-2xl bg-[#FEF3EB] text-[#F26B1D] flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
              <Truck className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[10px] font-black text-[#F26B1D] uppercase tracking-wider bg-[#FEF3EB] px-2.5 py-0.5 rounded-full border border-[#F26B1D]/20">
                Logistics Core
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-2">Volunteer Couriers</h3>
              <p className="text-xs text-slate-500 mt-1">Eco EV Scooters, E-Bikes & Local Heroes</p>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#63A644] shrink-0 mt-0.5" />
                <span><strong>Zero-Emission Dispatch:</strong> EV routing cuts urban carbon footprint to absolute zero.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#63A644] shrink-0 mt-0.5" />
                <span><strong>Turn-by-Turn GPS:</strong> Real-time shortest path optimization avoids high-traffic bottlenecks.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#63A644] shrink-0 mt-0.5" />
                <span><strong>Optical QR Passes:</strong> Secure handoff verification from donor pickup to shelter drop.</span>
              </li>
            </ul>
          </div>

          {/* Pillar 3: NGOs */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-5 hover:shadow-md hover:border-[#63A644]/40 transition-all group">
            <div className="w-14 h-14 rounded-2xl bg-[#F0F8EC] text-[#63A644] flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
              <Building2 className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[10px] font-black text-[#63A644] uppercase tracking-wider bg-[#F0F8EC] px-2.5 py-0.5 rounded-full border border-[#63A644]/20">
                Beneficiary Frontline
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-2">NGO Shelters</h3>
              <p className="text-xs text-slate-500 mt-1">Community Kitchens, Orphanages & Night Shelters</p>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#63A644] shrink-0 mt-0.5" />
                <span><strong>Real-Time Capacity Balancing:</strong> Dispatches match shelter headcounts so food is consumed fresh.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#63A644] shrink-0 mt-0.5" />
                <span><strong>Dietary & Cold Storage Matching:</strong> Buffet vs raw grains matched to facility capabilities.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#63A644] shrink-0 mt-0.5" />
                <span><strong>Distribution Auditing:</strong> Transparent recipient verification protects food dignity.</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* AI Smart Matching Engine Details */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-slate-200 pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EBF1FE] text-[#1D52F2] text-xs font-bold border border-[#1D52F2]/30">
              <Cpu className="w-3.5 h-3.5" />
              <span>Algorithmic Optimization</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900">How the AI Smart Match Engine Works</h2>
          </div>
          <div className="px-5 py-3 rounded-2xl bg-[#F0F8EC] border border-[#63A644]/30 text-center shrink-0">
            <p className="text-[10px] font-black uppercase tracking-wider text-[#63A644]">Average Match Time</p>
            <p className="text-2xl font-black text-[#63A644] mt-0.5">Under 15 Mins</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-slate-200 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#EBF1FE] text-[#1D52F2] flex items-center justify-center font-black">
              01
            </div>
            <h4 className="text-base font-black text-slate-900">Decay Curve Window</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every prepared meal has a strict biological freshness half-life. The algorithm calculates priority weight based on preparation timestamp, ambient temperature, and dish category.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-slate-200 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#FEF3EB] text-[#F26B1D] flex items-center justify-center font-black">
              02
            </div>
            <h4 className="text-base font-black text-slate-900">Proximity Vector Routing</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Using real-time road graph matrices, the algorithm identifies couriers within a 2.5 km radius to execute pickup within 14 minutes and minimize en-route exposure.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-slate-200 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#F0F8EC] text-[#63A644] flex items-center justify-center font-black">
              03
            </div>
            <h4 className="text-base font-black text-slate-900">Intake Capacity Match</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Shelters report headcount needs dynamically. Dispatches are routed only to facilities capable of distributing the entire quantity immediately, avoiding secondary spoilage.
            </p>
          </div>

        </div>
      </div>

      {/* Safety & Compliance Standards */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-black text-[#63A644] uppercase tracking-widest">Hygiene & Safety Assured</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Food Safety & Compliance Protocols</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-slate-200 space-y-2 text-center">
            <div className="w-12 h-12 mx-auto rounded-xl bg-[#FEF3EB] text-[#F26B1D] flex items-center justify-center shadow-2xs">
              <Thermometer className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-extrabold text-slate-900">Thermal Integrity</h4>
            <p className="text-xs text-slate-500">Hot food stored &gt; 60°C; cold perishables kept &lt; 4°C during transport.</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-slate-200 space-y-2 text-center">
            <div className="w-12 h-12 mx-auto rounded-xl bg-[#EBF1FE] text-[#1D52F2] flex items-center justify-center shadow-2xs">
              <Clock className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-extrabold text-slate-900">Strict 4-Hour Rule</h4>
            <p className="text-xs text-slate-500">Cooked food must be distributed within 4 hours of preparation.</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-slate-200 space-y-2 text-center">
            <div className="w-12 h-12 mx-auto rounded-xl bg-[#F0F8EC] text-[#63A644] flex items-center justify-center shadow-2xs">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-extrabold text-slate-900">Tamper-Evident Seals</h4>
            <p className="text-xs text-slate-500">Insulated food containers are sealed with QR code serial tags.</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-slate-200 space-y-2 text-center">
            <div className="w-12 h-12 mx-auto rounded-xl bg-[#EBF1FE] text-[#1D52F2] flex items-center justify-center shadow-2xs">
              <FileText className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-extrabold text-slate-900">Section 80G Certified</h4>
            <p className="text-xs text-slate-500">Compliant with governmental donation liability & tax exemption acts.</p>
          </div>

        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-black text-[#1D52F2] uppercase tracking-widest">Common Inquiries</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-3 max-w-3xl mx-auto">
          {faqs.map((faq, idx) => (
            <div 
              key={idx}
              className="rounded-2xl border border-slate-200 bg-[#F8FAFC] overflow-hidden transition-all"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-extrabold text-slate-900 text-sm cursor-pointer hover:bg-slate-100/70"
              >
                <span>{faq.q}</span>
                {activeFaq === idx ? (
                  <ChevronUp className="w-4 h-4 text-[#1D52F2] shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                )}
              </button>

              {activeFaq === idx && (
                <div className="p-5 pt-0 text-xs text-slate-600 leading-relaxed border-t border-slate-200/50 bg-white">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Mission CTA */}
      <div className="rounded-3xl p-8 sm:p-12 text-center space-y-6 bg-gradient-to-br from-[#1D52F2] via-[#133BB5] to-[#0F2D8A] text-white shadow-xl">
        <h2 className="text-2xl sm:text-4xl font-black tracking-tight font-heading">
          Be Part of the Solution Today
        </h2>
        <p className="text-blue-100 text-xs sm:text-sm max-w-lg mx-auto">
          Every rescued dish feeds a neighbor and prevents greenhouse gas release. Step up and make a tangible difference.
        </p>
        <div className="flex flex-wrap justify-center gap-4 pt-2">
          <button
            onClick={() => {
              setActiveView('donor');
            }}
            className="px-8 py-4 rounded-2xl bg-[#F26B1D] hover:bg-[#C9510C] text-white font-black text-xs shadow-lg shadow-[#F26B1D]/30 transition-all hover:scale-105 cursor-pointer"
          >
            Start Donating Surplus Meals
          </button>
          <button
            onClick={() => {
              setActiveView('landing');
            }}
            className="px-8 py-4 rounded-2xl bg-white hover:bg-slate-100 text-[#1D52F2] font-black text-xs shadow-md transition-all hover:scale-105 cursor-pointer"
          >
            Return to Home Dashboard
          </button>
        </div>
      </div>

    </div>
  );
};
