import React, { useState } from 'react';
import { X, Camera, Sparkles, CheckCircle2, QrCode } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const QRScannerModal = ({ isOpen, onClose, donation, scanType }) => {
  const { scanPickupQR, scanDeliveryQR } = useApp();
  const [isScanning, setIsScanning] = useState(false);

  if (!isOpen || !donation) return null;

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      if (scanType === 'pickup') {
        scanPickupQR(donation.id);
      } else {
        scanDeliveryQR(donation.id);
      }
      onClose();
    }, 1200);
  };

  const isPickup = scanType === 'pickup';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 border border-slate-200 shadow-2xl space-y-6 text-center">
        
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
            <Camera className="w-4 h-4" />
            <span>{isPickup ? 'Courier Optical Pickup Verification' : 'Courier Optical Delivery Verification'}</span>
          </div>
          <h3 className="text-xl font-black text-slate-900">
            {isPickup ? 'Scan Donor Pickup QR Code' : 'Scan NGO Shelter Delivery QR Code'}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {isPickup ? (
              <span>Handover of <strong>{donation.foodName}</strong> from Donor <strong>{donation.donorName || 'Registered Donor'}</strong></span>
            ) : (
              <span>Safe Delivery to <strong>{donation.acceptedNgo?.name || 'NGO Shelter'}</strong> • #{donation.id}</span>
            )}
          </p>
        </div>

        {/* Camera Reticle Container */}
        <div className="relative w-64 h-64 mx-auto rounded-2xl overflow-hidden border-2 border-slate-700 bg-slate-950 flex items-center justify-center shadow-inner">
          
          <div className="absolute inset-0 bg-grid-pattern opacity-30"></div>

          {/* Scanner laser animation */}
          <div className={`absolute top-0 left-0 right-0 h-1 animate-scanline z-10 shadow-lg ${
            isPickup ? 'bg-[#1D52F2] shadow-[#1D52F2]' : 'bg-[#63A644] shadow-[#63A644]'
          }`}></div>

          {/* Reticle brackets */}
          <div className={`absolute inset-6 border rounded-xl pointer-events-none flex flex-col justify-between p-2 ${
            isPickup ? 'border-[#1D52F2]/40' : 'border-[#63A644]/40'
          }`}>
            <div className="flex justify-between">
              <span className={`w-4 h-4 border-t-2 border-l-2 ${isPickup ? 'border-[#1D52F2]' : 'border-[#63A644]'}`}></span>
              <span className={`w-4 h-4 border-t-2 border-r-2 ${isPickup ? 'border-[#1D52F2]' : 'border-[#63A644]'}`}></span>
            </div>
            <div className="flex justify-between">
              <span className={`w-4 h-4 border-b-2 border-l-2 ${isPickup ? 'border-[#1D52F2]' : 'border-[#63A644]'}`}></span>
              <span className={`w-4 h-4 border-b-2 border-r-2 ${isPickup ? 'border-[#1D52F2]' : 'border-[#63A644]'}`}></span>
            </div>
          </div>

          {/* QR Code Visual Placeholder */}
          <QrCode className="w-24 h-24 text-slate-500 animate-pulse" />

          {isScanning && (
            <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-xs flex flex-col items-center justify-center space-y-2 z-20">
              <div className={`w-10 h-10 border-4 border-t-transparent rounded-full animate-spin ${
                isPickup ? 'border-[#1D52F2]' : 'border-[#63A644]'
              }`}></div>
              <p className="text-xs font-bold text-white">
                {isPickup ? 'Verifying Donor Handover Pass...' : 'Verifying Shelter Receipt Pass...'}
              </p>
            </div>
          )}
        </div>

        {/* Scan Button */}
        <button
          onClick={handleScan}
          disabled={isScanning}
          className={`w-full py-4 rounded-2xl text-white font-black text-xs shadow-md transition-all hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer ${
            isPickup ? 'bg-[#1D52F2] hover:bg-[#133BB5] shadow-[#1D52F2]/25' : 'bg-[#63A644] hover:bg-[#4B8233] shadow-[#63A644]/25'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>{isPickup ? 'Scan Donor Pickup QR Pass' : 'Scan NGO Shelter Delivery Pass'}</span>
        </button>

      </div>
    </div>
  );
};
