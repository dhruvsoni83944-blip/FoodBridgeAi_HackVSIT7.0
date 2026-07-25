import React, { useState } from 'react';
import { X, Camera, Sparkles, CheckCircle2, QrCode } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const QRScannerModal = ({ isOpen, onClose, donation, scanType }) => {
  const { scanPickupQR, scanDeliveryQR } = useApp();
  const [isScanning, setIsScanning] = useState(false);

  if (!isOpen || !donation) return null;

  const handleSimulateScan = () => {
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md glass-panel rounded-3xl p-6 border border-emerald-500/40 shadow-2xl space-y-6 text-center">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-emerald-900/40 text-slate-300 hover:text-white hover:bg-emerald-800/60 border border-emerald-500/30"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 mb-2">
            <Camera className="w-4 h-4 text-emerald-400" />
            <span>AI Optical Chain Verification</span>
          </div>
          <h3 className="text-xl font-extrabold text-white">
            {scanType === 'pickup' ? 'Scan Donor Pickup QR' : 'Scan Receiver NGO QR'}
          </h3>
          <p className="text-xs text-slate-300 mt-1">Donation #{donation.id} • {donation.foodName}</p>
        </div>

        {/* Camera Reticle Container */}
        <div className="relative w-64 h-64 mx-auto rounded-2xl overflow-hidden border-2 border-emerald-500/50 bg-slate-950 flex items-center justify-center">
          
          <div className="absolute inset-0 bg-grid-pattern opacity-40"></div>

          {/* Scanner laser animation */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-400 animate-scanline z-10 shadow-lg shadow-emerald-400"></div>

          {/* Reticle brackets */}
          <div className="absolute inset-6 border border-emerald-400/40 rounded-xl pointer-events-none flex flex-col justify-between p-2">
            <div className="flex justify-between">
              <span className="w-4 h-4 border-t-2 border-l-2 border-emerald-400"></span>
              <span className="w-4 h-4 border-t-2 border-r-2 border-emerald-400"></span>
            </div>
            <div className="flex justify-between">
              <span className="w-4 h-4 border-b-2 border-l-2 border-emerald-400"></span>
              <span className="w-4 h-4 border-b-2 border-r-2 border-emerald-400"></span>
            </div>
          </div>

          {/* Dummy QR visual inside camera */}
          <QrCode className="w-24 h-24 text-emerald-400/40 animate-pulse" />

          {isScanning && (
            <div className="absolute inset-0 bg-emerald-950/80 backdrop-blur-xs flex flex-col items-center justify-center space-y-2 z-20">
              <div className="w-10 h-10 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs font-bold text-emerald-300">Verifying Cryptographic Pass...</p>
            </div>
          )}
        </div>

        {/* Scan Button */}
        <button
          onClick={handleSimulateScan}
          disabled={isScanning}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-emerald-950 font-extrabold text-xs shadow-xl shadow-emerald-500/25 transition-all hover:scale-105 flex items-center justify-center gap-2"
        >
          <Camera className="w-4 h-4" />
          <span>{scanType === 'pickup' ? 'Simulate Scan Pickup Pass' : 'Simulate Scan NGO Delivery Pass'}</span>
        </button>

      </div>
    </div>
  );
};
