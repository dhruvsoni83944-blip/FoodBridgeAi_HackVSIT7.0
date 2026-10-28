import React from 'react';
import { X, QrCode, ShieldCheck, CheckCircle2, Copy } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const QRModal = ({ isOpen, onClose, donation, type = 'pickup' }) => {
  const { showToast } = useApp();

  if (!isOpen || !donation) return null;

  const isPickup = type === 'pickup';
  const qrCodeText = isPickup 
    ? `FOODBRIDGE-PICKUP-${donation.id}-${donation.createdAt || 'VERIFIED'}`
    : `FOODBRIDGE-DELIVERY-${donation.id}-${donation.acceptedNgo?.id || 'SHELTER'}`;

  const copyQR = () => {
    navigator.clipboard.writeText(qrCodeText);
    showToast(`${isPickup ? 'Pickup' : 'Delivery'} QR Verification token copied!`, "info");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 border border-slate-200 shadow-2xl space-y-6 text-center">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 border border-slate-200 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border mb-2 ${
            isPickup 
              ? 'bg-[#EBF1FE] text-[#1D52F2] border-[#1D52F2]/30' 
              : 'bg-[#F0F8EC] text-[#63A644] border-[#63A644]/30'
          }`}>
            <QrCode className="w-4 h-4" />
            <span>{isPickup ? 'Donor Pickup Verification Pass' : 'NGO Shelter Delivery Pass'}</span>
          </div>
          <h3 className="text-xl font-black text-slate-900">{donation.foodName}</h3>
          <p className="text-xs text-slate-500 mt-0.5">Donation ID: {donation.id}</p>
        </div>

        {/* Generated QR Code Visual Canvas */}
        <div className={`p-4 rounded-2xl bg-white mx-auto w-48 h-48 flex flex-col items-center justify-center border-4 shadow-md relative group ${
          isPickup ? 'border-[#1D52F2]' : 'border-[#63A644]'
        }`}>
          
          <div className="w-40 h-40 bg-slate-900 rounded-xl relative p-2 flex flex-col justify-between">
            
            {/* Top Corners */}
            <div className="flex justify-between">
              <div className={`w-10 h-10 border-4 p-1 flex items-center justify-center ${isPickup ? 'border-[#1D52F2]' : 'border-[#63A644]'}`}>
                <div className={`w-4 h-4 ${isPickup ? 'bg-[#1D52F2]' : 'bg-[#63A644]'}`}></div>
              </div>
              <div className={`w-10 h-10 border-4 p-1 flex items-center justify-center ${isPickup ? 'border-[#1D52F2]' : 'border-[#63A644]'}`}>
                <div className={`w-4 h-4 ${isPickup ? 'bg-[#1D52F2]' : 'bg-[#63A644]'}`}></div>
              </div>
            </div>

            {/* Center Watermark */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className={`px-2 py-1 rounded-lg text-white flex items-center justify-center font-black text-[11px] shadow-md uppercase tracking-wider ${
                isPickup ? 'bg-[#1D52F2]' : 'bg-[#63A644]'
              }`}>
                {isPickup ? 'PICKUP' : 'DELIVERY'}
              </div>
            </div>

            {/* Bottom Corner */}
            <div className="flex justify-between">
              <div className={`w-10 h-10 border-4 p-1 flex items-center justify-center ${isPickup ? 'border-[#1D52F2]' : 'border-[#63A644]'}`}>
                <div className={`w-4 h-4 ${isPickup ? 'bg-[#1D52F2]' : 'bg-[#63A644]'}`}></div>
              </div>
              <div className="grid grid-cols-2 gap-1 w-10 h-10">
                <div className={isPickup ? 'bg-[#1D52F2]' : 'bg-[#63A644]'}></div>
                <div className={isPickup ? 'bg-[#63A644]' : 'bg-[#1D52F2]'}></div>
                <div className={isPickup ? 'bg-[#F26B1D]' : 'bg-[#63A644]'}></div>
              </div>
            </div>

          </div>

        </div>

        <div className="space-y-2 text-xs text-slate-600">
          <p className="font-bold text-slate-800">
            {isPickup ? (
              <span>Show this QR to Volunteer Courier upon arrival at your pickup address.</span>
            ) : (
              <span>Show this QR to Volunteer Courier upon arrival at your shelter to confirm safe delivery.</span>
            )}
          </p>
          <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-slate-200 text-[11px] font-mono flex items-center justify-between text-slate-700">
            <span className="truncate max-w-[200px]">{qrCodeText}</span>
            <button onClick={copyQR} className="text-[#1D52F2] hover:text-[#133BB5] cursor-pointer" title="Copy Token">
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <button
          onClick={onClose}
          className={`w-full py-3 rounded-2xl text-white font-bold text-xs shadow-md transition-all cursor-pointer ${
            isPickup ? 'bg-[#1D52F2] hover:bg-[#133BB5] shadow-[#1D52F2]/25' : 'bg-[#63A644] hover:bg-[#4B8233] shadow-[#63A644]/25'
          }`}
        >
          Done & Close Pass
        </button>

      </div>
    </div>
  );
};
