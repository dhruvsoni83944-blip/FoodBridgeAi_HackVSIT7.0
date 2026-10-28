import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { sendMobileSMS } from '../services/smsService';
import { 
  X, 
  Send, 
  Truck, 
  Phone
} from 'lucide-react';

export const SendVolunteerSMSModal = ({ isOpen, onClose, donation }) => {
  const { showToast, selectedDonation, donations } = useApp();

  const item = donation || selectedDonation || (donations && donations.length > 0 ? donations[0] : null);

  const volunteer = item?.assignedVolunteer || {
    name: "Volunteer Courier",
    phone: "+1 (555) 019-2831",
    vehicle: "Eco Courier"
  };

  const [volunteerPhone, setVolunteerPhone] = useState(volunteer.phone || "+1 (555) 019-2831");
  const [smsContent, setSmsContent] = useState("");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (item) {
      setVolunteerPhone(volunteer.phone || "+1 (555) 019-2831");
      setSmsContent(
        `📲 [FoodBridge AI Pass]: Hi ${volunteer.name}, pickup for '${item.foodName}' (${item.quantity}) is ready at ${item.pickupAddress}. Matched NGO: ${item.recommendedNgo?.name || 'Local Shelter'}. Contact Donor: ${item.contactNumber || '+1 (555) 019-2831'}. Code: ${item.qrPassCode || 'FOODBRIDGE-' + item.id}`
      );
    }
  }, [item, volunteer.name, volunteer.phone]);

  if (!isOpen || !item) return null;

  const handleDispatchSMS = async () => {
    setIsSending(true);
    setTimeout(async () => {
      await sendMobileSMS(volunteerPhone, smsContent, "volunteer_pickup_pass");
      setIsSending(false);
      showToast(`Donation Receiving SMS successfully sent to Volunteer ${volunteer.name} (${volunteerPhone})!`);
      onClose();
    }, 900);
  };

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto no-scrollbar"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-6 my-auto max-h-[85vh] overflow-y-auto"
      >
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 border border-slate-200 transition-colors cursor-pointer"
          title="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
          <div className="p-3 rounded-2xl bg-[#FEF3EB] text-[#F26B1D]">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FEF3EB] text-[#F26B1D] text-[10px] font-bold border border-[#F26B1D]/30 uppercase">
              Send SMS to Volunteer
            </div>
            <h2 className="text-xl font-black text-slate-900">Donation Receiving SMS Dispatch</h2>
            <p className="text-xs text-slate-500">Send pickup location, food pass & QR code directly to volunteer's phone.</p>
          </div>
        </div>

        {/* Volunteer & Receiver NGO Summary Card */}
        <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src={volunteer.photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"} 
                alt={volunteer.name}
                className="w-12 h-12 object-cover rounded-full border-2 border-[#F26B1D]"
              />
              <div>
                <span className="text-[10px] font-bold text-[#F26B1D] uppercase">Assigned Courier</span>
                <h3 className="text-sm font-extrabold text-slate-900">{volunteer.name}</h3>
                <p className="text-[11px] text-slate-500">{volunteer.vehicle}</p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold text-[#1D52F2] uppercase">Destination NGO</span>
              <p className="text-xs font-extrabold text-slate-900">{item.recommendedNgo?.name || 'Assigned Shelter'}</p>
            </div>
          </div>
        </div>

        {/* SMS Dispatch Form */}
        <div className="space-y-4">
          
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Volunteer Mobile Phone Number *</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-[#F26B1D] absolute left-3.5 top-3.5" />
              <input 
                type="tel" 
                value={volunteerPhone}
                onChange={(e) => setVolunteerPhone(e.target.value)}
                placeholder="+1 (555) 456-7890 or +91 XXXXXXXXXX"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#F8FAFC] border border-slate-200 text-slate-900 placeholder-slate-400 text-xs font-mono focus:outline-none focus:border-[#F26B1D] focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">SMS Message Content (Pre-filled)</label>
            <textarea
              rows="4"
              value={smsContent}
              onChange={(e) => setSmsContent(e.target.value)}
              className="w-full p-3 rounded-xl bg-[#F8FAFC] border border-slate-200 text-slate-800 text-xs font-mono leading-relaxed focus:outline-none focus:border-[#1D52F2] focus:bg-white"
            />
          </div>

          <button
            onClick={handleDispatchSMS}
            disabled={isSending}
            className="w-full py-4 rounded-2xl bg-[#F26B1D] hover:bg-[#C9510C] text-white font-black text-xs shadow-md shadow-[#F26B1D]/25 transition-all hover:scale-[1.01] flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>{isSending ? 'Dispatching Receiving SMS...' : `Send Donation Receiving SMS to ${volunteer.name}`}</span>
          </button>

        </div>

      </div>
    </div>
  );
};
