import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastNotification = () => {
  const { toastMessage } = useApp();

  if (!toastMessage) return null;

  const isError = toastMessage.type === 'error';
  const isWarning = toastMessage.type === 'warning';
  const isInfo = toastMessage.type === 'info';

  return (
    <div className="fixed bottom-6 left-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white border border-slate-200 shadow-xl max-w-md">
        <div className={`p-2 rounded-xl ${
          isError ? 'bg-red-100 text-red-600' :
          isWarning ? 'bg-[#FEF3EB] text-[#F26B1D]' :
          isInfo ? 'bg-[#EBF1FE] text-[#1D52F2]' :
          'bg-[#F0F8EC] text-[#63A644]'
        }`}>
          {isError ? <AlertCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
        </div>
        <div className="text-xs">
          <p className="font-extrabold text-slate-900">FoodBridge Notification</p>
          <p className="text-slate-600 mt-0.5">{toastMessage.message}</p>
        </div>
      </div>
    </div>
  );
};
