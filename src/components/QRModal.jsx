import React from 'react';
import { X, QrCode, ShieldCheck, CheckCircle2, Copy } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const QRModal = ({ isOpen, onClose, donation }) => {
  const { showToast } = useApp();

  if (!isOpen || !donation) return null;

  const qrCodeText = `FOODBRIDGE-${donation.id}-${donation.createdAt}`;

  const copyQR = () => {
    navigator.clipboard.writeText(qrCodeText);
    showToast("QR Verification token copied to clipboard!", "info");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm glass-panel rounded-3xl p-6 border border-emerald-500/40 shadow-2xl space-y-6 text-center">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-emerald-900/40 text-slate-300 hover:text-white hover:bg-emerald-800/60 border border-emerald-500/30"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 mb-2">
            <QrCode className="w-4 h-4 text-emerald-400" />
            <span>Digital Chain of Custody Pass</span>
          </div>
          <h3 className="text-xl font-extrabold text-white">{donation.foodName}</h3>
          <p className="text-xs text-slate-300 mt-1">Donation ID: {donation.id}</p>
        </div>

        {/* Generated QR Code Visual Canvas */}
        <div className="p-4 rounded-2xl bg-white mx-auto w-48 h-48 flex flex-col items-center justify-center border-4 border-emerald-500 shadow-xl relative group">
          
          {/* Stylized Vector QR Code Grid Pattern */}
          <div className="w-40 h-40 bg-emerald-950 rounded-xl relative p-2 flex flex-col justify-between">
            
            {/* Top Corners */}
            <div className="flex justify-between">
              <div className="w-10 h-10 border-4 border-emerald-400 p-1 flex items-center justify-center">
                <div className="w-4 h-4 bg-emerald-400"></div>
              </div>
              <div className="w-10 h-10 border-4 border-emerald-400 p-1 flex items-center justify-center">
                <div className="w-4 h-4 bg-emerald-400"></div>
              </div>
            </div>

            {/* Center Logo */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 rounded-lg bg-emerald-500 text-emerald-950 flex items-center justify-center font-extrabold text-xs shadow-md">
                FB
              </div>
            </div>

            {/* Bottom Corner */}
            <div className="flex justify-between">
              <div className="w-10 h-10 border-4 border-emerald-400 p-1 flex items-center justify-center">
                <div className="w-4 h-4 bg-emerald-400"></div>
              </div>
              <div className="grid grid-cols-2 gap-1 w-10 h-10">
                <div className="bg-emerald-400"></div>
                <div className="bg-emerald-400"></div>
                <div className="bg-emerald-400"></div>
              </div>
            </div>

          </div>

        </div>

        <div className="space-y-2 text-xs text-slate-300">
          <p className="font-semibold text-emerald-300">Show to Volunteer during Pickup or NGO during Delivery</p>
          <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/20 text-[11px] font-mono flex items-center justify-between text-slate-300">
            <span className="truncate max-w-[200px]">{qrCodeText}</span>
            <button onClick={copyQR} className="text-emerald-400 hover:text-emerald-300">
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-xs shadow-md"
        >
          Close Pass
        </button>

      </div>
    </div>
  );
};
