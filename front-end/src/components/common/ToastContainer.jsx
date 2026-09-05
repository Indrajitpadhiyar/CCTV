import React from 'react';
import { useCase } from '../../context/CaseContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts, removeToast } = useCase();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const getBg = () => {
          switch (toast.type) {
            case 'success':
              return 'bg-[#0B2545] border-emerald-500 text-white';
            case 'error':
            case 'critical':
              return 'bg-[#C0392B] border-red-300 text-white';
            case 'warning':
              return 'bg-amber-800 border-amber-400 text-white';
            default:
              return 'bg-[#0B2545] border-[#C9A227] text-white';
          }
        };

        const getIcon = () => {
          switch (toast.type) {
            case 'success':
              return <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
            case 'error':
            case 'critical':
              return <AlertCircle className="w-5 h-5 text-red-200 shrink-0" />;
            case 'warning':
              return <AlertTriangle className="w-5 h-5 text-amber-300 shrink-0" />;
            default:
              return <Info className="w-5 h-5 text-[#C9A227] shrink-0" />;
          }
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-lg border shadow-xl transition-all animate-in slide-in-from-right duration-200 ${getBg()}`}
          >
            {getIcon()}
            <div className="flex-1 text-xs">
              <p className="font-semibold leading-snug">{toast.message}</p>
              <span className="text-[10px] opacity-75 font-mono mt-0.5 block">{toast.timestamp}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-white/70 hover:text-white p-0.5 rounded-sm transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
