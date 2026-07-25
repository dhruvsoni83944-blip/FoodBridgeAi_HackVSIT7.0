import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { sendMobileSMS } from '../services/smsService';
import { 
  X, 
  Send, 
  Smartphone, 
  Truck, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  Building2, 
  Sparkles,
  QrCode
} from 'lucide-react';

export const SendVolunteerSMSModal = ({ isOpen, onClose, donation }) => {
  const { showToast } = useApp();

  const item = donation || {
    id: "DON-8092",
    foodName: "Surplus Gourmet Banquet Buffet",
    quantity: "45 kg",
    pickupAddress: "Grand Palace Hotel, 742 Evergreen Terrace",
    contactNumber: "+1 (555) 234-5678",
    recommendedNgo: { name: "Hope Community Shelter" },
    assignedVolunteer: {
      name: "Alex Rivera",
      phone: "+1 (555) 456-7890",
      vehicle: "Eco EV Scooter (Plate: FB-992)",
      photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
    }
  };

  const volunteer = item.assignedVolunteer || {
    name: "Alex Rivera",
    phone: "+1 (555) 456-7890",
    vehicle: "Eco EV Scooter"
  };

  const [volunteerPhone, setVolunteerPhone] = useState(volunteer.phone || "+1 (555) 456-7890");
  const [smsContent, setSmsContent] = useState("");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (item) {
      setVolunteerPhone(volunteer.phone || "+1 (555) 456-7890");
      setSmsContent(
        `📲 [FoodBridge AI Donation Pass]: Hi ${volunteer.name}, pickup for '${item.foodName}' (${item.quantity}) is ready at ${item.pickupAddress}. Matched NGO: ${item.recommendedNgo?.name || 'Hope Shelter'}. Contact Donor: ${item.contactNumber || '+1 (555) 234-5678'}. QR Code: ${item.qrPassCode || 'FOODBRIDGE-' + item.id}`
      );
    }
  }, [item]);

  if (!isOpen) return null;

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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto no-scrollbar"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/40 shadow-2xl space-y-6 my-auto max-h-[85vh] overflow-y-auto"
      >
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-emerald-900/40 text-slate-300 hover:text-white hover:bg-emerald-800/60 border border-emerald-500/30"
          title="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-emerald-500/20 pb-4">
          <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30 uppercase">
              Send SMS to Volunteer
            </div>
            <h2 className="text-xl font-extrabold text-white">Donation Receiving SMS Dispatch</h2>
            <p className="text-xs text-slate-300">Send pickup location, food pass & QR code directly to volunteer's phone.</p>
          </div>
        </div>

        {/* Volunteer & Receiver NGO Summary Card */}
        <div className="p-4 rounded-2xl glass-card border border-emerald-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src={volunteer.photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"} 
                alt={volunteer.name}
                className="w-12 h-12 object-cover rounded-full border-2 border-amber-400"
              />
              <div>
                <span className="text-[10px] font-bold text-amber-400 uppercase">Assigned Courier</span>
                <h3 className="text-sm font-bold text-white">{volunteer.name}</h3>
                <p className="text-[11px] text-slate-300">{volunteer.vehicle}</p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold text-blue-400 uppercase">Destination NGO</span>
              <p className="text-xs font-bold text-white">{item.recommendedNgo?.name || 'Hope Community Shelter'}</p>
            </div>
          </div>
        </div>

        {/* SMS Dispatch Form */}
        <div className="space-y-4">
          
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Volunteer Mobile Phone Number *</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-amber-400 absolute left-3.5 top-3.5" />
              <input 
                type="tel" 
                value={volunteerPhone}
                onChange={(e) => setVolunteerPhone(e.target.value)}
                placeholder="+1 (555) 456-7890 or +91 XXXXXXXXXX"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-emerald-950/90 border border-emerald-500/30 text-white placeholder-slate-500 text-xs font-mono focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">SMS Message Content (Pre-filled)</label>
            <textarea
              rows="4"
              value={smsContent}
              onChange={(e) => setSmsContent(e.target.value)}
              className="w-full p-3 rounded-xl bg-emerald-950/90 border border-emerald-500/30 text-emerald-200 text-xs font-mono leading-relaxed focus:outline-none focus:border-emerald-400"
            />
          </div>

          <button
            onClick={handleDispatchSMS}
            disabled={isSending}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-amber-950 font-extrabold text-xs shadow-xl shadow-amber-500/25 transition-all hover:scale-[1.01] flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>{isSending ? 'Dispatching Receiving SMS...' : `Send Donation Receiving SMS to ${volunteer.name}`}</span>
          </button>

        </div>

      </div>
    </div>
  );
};
