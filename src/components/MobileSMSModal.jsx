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
  
  const [smsLogs, setSmsLogs] = useState([
    {
      id: "sms-1",
      sender: "FOODBRIDGE-AI",
      text: "📲 [FoodBridge AI]: Mobile SMS Alert system connected! Instant SMS notifications enabled for all surplus donation requests.",
      time: "18:45",
      status: "Delivered"
    },
    {
      id: "sms-2",
      sender: "FOODBRIDGE-AI",
      text: "📲 [Donation Alert]: Surplus Banquet Buffet (45 kg) matched with Hope Community Shelter. Courier Alex Rivera assigned.",
      time: "18:46",
      status: "Delivered"
    }
  ]);

  const [testSending, setTestSending] = useState(false);

  if (!isOpen) return null;

  const handleTestSMS = async () => {
    if (!phoneNumber) {
      showToast("Please enter a valid phone number", "info");
      return;
    }
    setTestSending(true);

    const activeItem = donations[0] || { foodName: "Surplus Gourmet Meal", quantity: "30 kg" };
    const msg = `📲 [FoodBridge AI Alert]: Donation Request '${activeItem.foodName}' (${activeItem.quantity}) received! Matched with Hope Community Shelter. Track live on FoodBridge AI.`;

    setTimeout(async () => {
      const payload = await sendMobileSMS(phoneNumber, msg, "test_dispatch");
      setSmsLogs((prev) => [payload, ...prev]);
      setTestSending(false);
      showToast(`SMS alert dispatched to ${phoneNumber}! Check mobile phone preview screen.`);
    }, 800);
  };

  return (
    <>
      {/* Dark Overlay Backdrop with z-[9998] (Clicking anywhere outside closes drawer!) */}
      <div 
        onClick={onClose}
        className="fixed inset-0 z-[9998] bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
      />

      {/* Slide-Over Right Side Drawer with z-[9999] */}
      <aside 
        onClick={(e) => e.stopPropagation()}
        className="fixed inset-y-0 right-0 z-[9999] w-full sm:w-[480px] lg:w-[520px] bg-emerald-950 border-l border-emerald-500/40 shadow-2xl p-6 sm:p-7 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300"
      >
        <div className="space-y-6">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30 uppercase">
                  Twilio & Fast2SMS Integrated
                </div>
                <h2 className="text-xl font-extrabold text-white">Mobile SMS Alerts</h2>
                <p className="text-xs text-slate-300">Real-time mobile phone notification center.</p>
              </div>
            </div>

            {/* Close Button */}
            <button 
              onClick={onClose}
              className="p-2.5 rounded-xl bg-emerald-900/40 text-slate-300 hover:text-white hover:bg-emerald-800/60 border border-emerald-500/30 transition-all shrink-0"
              title="Close Drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form & Controls */}
          <div className="space-y-5">
            
            {/* Phone Number Input */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300">Mobile Phone Number *</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-emerald-400 absolute left-3.5 top-3.5" />
                <input 
                  type="tel" 
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+91 98765 43210 or +1 555-019-2831"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-emerald-900/40 border border-emerald-500/40 text-white placeholder-slate-500 text-xs font-mono focus:outline-none focus:border-emerald-400"
                />
              </div>
              <p className="text-[10px] text-slate-400">Enter international phone format (+country code).</p>
            </div>

            {/* Toggle Switch */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-emerald-900/30 border border-emerald-500/20">
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-white">Enable Real-Time SMS Notifications</p>
                <p className="text-[10px] text-slate-400">Dispatch SMS on donation creation & assignment.</p>
              </div>
              <button
                onClick={() => setSmsEnabled(!smsEnabled)}
                className={`w-12 h-6 rounded-full p-1 transition-colors ${smsEnabled ? 'bg-emerald-500' : 'bg-slate-700'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-emerald-950 transition-transform ${smsEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>

            {/* Test Button */}
            <button
              onClick={handleTestSMS}
              disabled={testSending}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-emerald-950 font-extrabold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>{testSending ? 'Sending Mobile SMS Alert...' : 'Send Test SMS Alert to My Phone'}</span>
            </button>

            {/* Live Mobile Phone Mockup Preview */}
            <div className="space-y-2 pt-2">
              <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                <Smartphone className="w-4 h-4 text-emerald-400" /> Live Phone Display Preview
              </p>

              <div className="w-full h-72 rounded-[28px] bg-slate-950 border-4 border-slate-800 p-3 shadow-2xl relative flex flex-col overflow-hidden">
                {/* Phone Speaker Notch */}
                <div className="w-16 h-3 bg-slate-800 rounded-full mx-auto mb-2 shrink-0"></div>

                {/* SMS Header */}
                <div className="px-2 py-1 border-b border-slate-800 flex items-center justify-between text-[10px] text-slate-400 shrink-0">
                  <span className="font-mono text-emerald-400 font-bold">FOODBRIDGE SMS</span>
                  <span>{phoneNumber.substring(0, 12)}...</span>
                </div>

                {/* SMS Messages Feed */}
                <div className="flex-1 py-2 space-y-2 overflow-y-auto no-scrollbar">
                  {smsLogs.map((log) => (
                    <div key={log.id} className="p-2.5 rounded-xl bg-emerald-950/90 border border-emerald-500/30 text-[10px] text-slate-200 leading-relaxed shadow-sm space-y-1 animate-in fade-in">
                      <div className="flex items-center justify-between text-[9px] font-bold text-emerald-400">
                        <span>{log.sender}</span>
                        <span className="text-slate-500">{log.time}</span>
                      </div>
                      <p>{log.text}</p>
                      <div className="text-[8px] text-emerald-300 font-mono text-right flex items-center justify-end gap-1">
                        <CheckCircle2 className="w-2.5 h-2.5" /> {log.status}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Home indicator */}
                <div className="w-14 h-1 bg-slate-700 rounded-full mx-auto mt-1 shrink-0"></div>
              </div>
            </div>

          </div>

        </div>

        {/* Footer info */}
        <div className="pt-4 border-t border-emerald-500/20 text-[11px] text-slate-400 flex items-center justify-between">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Twilio Service Online
          </span>
          <button onClick={onClose} className="text-xs text-emerald-400 font-bold hover:underline">
            Done
          </button>
        </div>

      </aside>
    </>
  );
};
