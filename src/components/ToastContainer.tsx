import { useGlobalData } from '../context/DataContext';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export function ToastContainer() {
  const { toasts, removeToast } = useGlobalData();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => {
        let Icon = Info;
        let bgColor = 'bg-slate-800';
        let txColor = 'text-white';
        let borderColor = 'border-slate-700';

        if (toast.type === 'success') {
          Icon = CheckCircle;
          bgColor = 'bg-green-50';
          txColor = 'text-green-800';
          borderColor = 'border-green-200';
        } else if (toast.type === 'error') {
          Icon = AlertCircle;
          bgColor = 'bg-red-50';
          txColor = 'text-red-800';
          borderColor = 'border-red-200';
        } else if (toast.type === 'info') {
          bgColor = 'bg-blue-50';
          txColor = 'text-blue-800';
          borderColor = 'border-blue-200';
        }

        return (
          <div 
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border animate-in slide-in-from-right-8 fade-in duration-300 ${bgColor} ${borderColor} ${txColor}`}
          >
            <Icon className="w-5 h-5 shrink-0" />
            <p className="text-sm font-medium">{toast.message}</p>
            <button 
              onClick={() => removeToast(toast.id)}
              className="ml-2 opacity-50 hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
