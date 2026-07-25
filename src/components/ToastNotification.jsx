import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastNotification = () => {
  const { toastMessage } = useApp();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="flex items-center gap-3 px-4 py-3 rounded-2xl glass-panel border border-emerald-500/50 shadow-2xl shadow-emerald-950/80 max-w-md">
        <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div className="text-xs">
          <p className="font-semibold text-white">FoodBridge Notification</p>
          <p className="text-slate-300 mt-0.5">{toastMessage.message}</p>
        </div>
      </div>
    </div>
  );
};
