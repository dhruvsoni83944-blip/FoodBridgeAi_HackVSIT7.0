import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { sendMobileSMS } from '../services/smsService';
import { 
  Phone, 
  Smartphone, 
  Send, 
  X, 
  CheckCircle2, 
  Sparkles, 
  Bell, 
  ShieldCheck,
  MessageSquare
} from 'lucide-react';

export const MobileSMSModal = ({ isOpen, onClose }) => {
  const { showToast, donations } = useApp();
  const [phoneNumber, setPhoneNumber] = useState("+1 (555) 019-2831");
  const [smsEnabled, setSmsEnabled] = useState(true);
  
  const [smsLogs, setSmsLogs] = useState([]);

  const [testSending, setTestSending] = useState(false);

  if (!isOpen) return null;

  const handleTestSMS = async () => {
    if (!phoneNumber) {
      showToast("Please enter a valid phone number", "info");
      return;
    }
    setTestSending(true);

    const activeItem = donations[0] || { foodName: "Surplus Food Package", quantity: "20 kg" };
    const msg = `📲 [FoodBridge AI Alert]: Donation Request '${activeItem.foodName}' (${activeItem.quantity}) received! Matched with verified shelter. Track on FoodBridge AI.`;

    setTimeout(async () => {
      const payload = await sendMobileSMS(phoneNumber, msg, "test_dispatch");
      setSmsLogs((prev) => [payload, ...prev]);
      setTestSending(false);
      showToast(`SMS alert dispatched to ${phoneNumber}! Check mobile phone preview screen.`);
    }, 800);
  };

  return (
    <>
      {/* Dark Overlay Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 z-[9998] bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200"
      />

      {/* Slide-Over Right Side Drawer */}
      <aside 
        onClick={(e) => e.stopPropagation()}
        className="fixed inset-y-0 right-0 z-[9999] w-full sm:w-[480px] lg:w-[520px] bg-white border-l border-slate-200 shadow-2xl p-6 sm:p-7 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300"
      >
        <div className="space-y-6">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-[#EBF1FE] text-[#1D52F2]">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FEF3EB] text-[#F26B1D] text-[10px] font-bold border border-[#F26B1D]/30 uppercase">
                  Twilio & Fast2SMS Integrated
                </div>
                <h2 className="text-xl font-black text-slate-900">Mobile SMS Alerts</h2>
                <p className="text-xs text-slate-500">Real-time mobile phone notification center.</p>
              </div>
            </div>

            {/* Close Button */}
            <button 
              onClick={onClose}
              className="p-2.5 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 border border-slate-200 transition-all shrink-0 cursor-pointer"
              title="Close Drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form & Controls */}
          <div className="space-y-5">
            
            {/* Phone Number Input */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">Mobile Phone Number *</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-[#1D52F2] absolute left-3.5 top-3.5" />
                <input 
                  type="tel" 
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+91 98765 43210 or +1 555-019-2831"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#F8FAFC] border border-slate-200 text-slate-900 placeholder-slate-400 text-xs font-mono focus:outline-none focus:border-[#1D52F2] focus:bg-white"
                />
              </div>
              <p className="text-[10px] text-slate-500">Enter international phone format (+country code).</p>
            </div>

            {/* Toggle Switch */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200">
              <div className="space-y-0.5">
                <p className="text-xs font-extrabold text-slate-900">Enable Real-Time SMS Notifications</p>
                <p className="text-[10px] text-slate-500">Dispatch SMS on donation creation & assignment.</p>
              </div>
              <button
                onClick={() => setSmsEnabled(!smsEnabled)}
                className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${smsEnabled ? 'bg-[#1D52F2]' : 'bg-slate-300'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${smsEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>

            {/* Test Button */}
            <button
              onClick={handleTestSMS}
              disabled={testSending}
              className="w-full py-3.5 rounded-2xl bg-[#1D52F2] hover:bg-[#133BB5] text-white font-black text-xs shadow-md shadow-[#1D52F2]/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{testSending ? 'Sending Mobile SMS Alert...' : 'Send Test SMS Alert to My Phone'}</span>
            </button>

            {/* Live Mobile Phone Mockup Preview */}
            <div className="space-y-2 pt-2">
              <p className="text-xs font-black text-[#1D52F2] uppercase tracking-wider flex items-center gap-1">
                <Smartphone className="w-4 h-4 text-[#1D52F2]" /> Live Phone Display Preview
              </p>

              <div className="w-full h-72 rounded-[28px] bg-slate-900 border-4 border-slate-700 p-3 shadow-xl relative flex flex-col overflow-hidden">
                {/* Phone Speaker Notch */}
                <div className="w-16 h-2.5 bg-slate-700 rounded-full mx-auto mb-2 shrink-0"></div>

                {/* SMS Header */}
                <div className="px-2 py-1 border-b border-slate-800 flex items-center justify-between text-[10px] text-slate-400 shrink-0">
                  <span className="font-mono text-[#3B82F6] font-bold">FOODBRIDGE SMS</span>
                  <span>{phoneNumber.substring(0, 12)}...</span>
                </div>

                {/* SMS Messages Feed */}
                <div className="flex-1 py-2 space-y-2 overflow-y-auto no-scrollbar">
                  {smsLogs.map((log) => (
                    <div key={log.id} className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-[10px] text-slate-100 leading-relaxed shadow-sm space-y-1 animate-in fade-in">
                      <div className="flex items-center justify-between text-[9px] font-bold text-[#60A5FA]">
                        <span>{log.sender}</span>
                        <span className="text-slate-400">{log.time}</span>
                      </div>
                      <p>{log.text}</p>
                      <div className="text-[8px] text-[#4ADE80] font-mono text-right flex items-center justify-end gap-1">
                        <CheckCircle2 className="w-2.5 h-2.5" /> {log.status}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Home indicator */}
                <div className="w-14 h-1 bg-slate-600 rounded-full mx-auto mt-1 shrink-0"></div>
              </div>
            </div>

          </div>

        </div>

        {/* Footer info */}
        <div className="pt-4 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
          <span className="flex items-center gap-1 font-medium">
            <ShieldCheck className="w-4 h-4 text-[#63A644]" /> Twilio Service Online
          </span>
          <button onClick={onClose} className="text-xs text-[#1D52F2] font-extrabold hover:underline cursor-pointer">
            Done
          </button>
        </div>

      </aside>
    </>
  );
};
