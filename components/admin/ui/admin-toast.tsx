'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, X, Info } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

// Global toast state
let toastListeners: ((toasts: Toast[]) => void)[] = [];
let toasts: Toast[] = [];

const updateToasts = (newToasts: Toast[]) => {
  toasts = newToasts;
  toastListeners.forEach(listener => listener(toasts));
};

export const toast = {
  success: (title: string, message?: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    updateToasts([...toasts, { id, type: 'success', title, message }]);
    setTimeout(() => {
      updateToasts(toasts.filter(t => t.id !== id));
    }, 5000);
  },
  error: (title: string, message?: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    updateToasts([...toasts, { id, type: 'error', title, message }]);
    setTimeout(() => {
      updateToasts(toasts.filter(t => t.id !== id));
    }, 7000);
  },
  warning: (title: string, message?: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    updateToasts([...toasts, { id, type: 'warning', title, message }]);
    setTimeout(() => {
      updateToasts(toasts.filter(t => t.id !== id));
    }, 5000);
  },
  info: (title: string, message?: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    updateToasts([...toasts, { id, type: 'info', title, message }]);
    setTimeout(() => {
      updateToasts(toasts.filter(t => t.id !== id));
    }, 5000);
  },
};

const toastConfig = {
  success: {
    icon: CheckCircle,
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    iconColor: 'text-green-600',
    titleColor: 'text-green-800',
  },
  error: {
    icon: XCircle,
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    iconColor: 'text-red-600',
    titleColor: 'text-red-800',
  },
  warning: {
    icon: AlertCircle,
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    iconColor: 'text-amber-600',
    titleColor: 'text-amber-800',
  },
  info: {
    icon: Info,
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    iconColor: 'text-blue-600',
    titleColor: 'text-blue-800',
  },
};

function ToastItem({ toast: t, onClose }: { toast: Toast; onClose: () => void }) {
  const config = toastConfig[t.type];
  const Icon = config.icon;

  return (
    <div
      className={`
        flex items-start gap-4 p-4 rounded-xl border shadow-lg
        ${config.bgColor} ${config.borderColor}
        animate-in slide-in-from-right duration-300
      `}
    >
      <Icon className={`w-6 h-6 flex-shrink-0 ${config.iconColor}`} />
      <div className="flex-1 min-w-0">
        <p className={`text-base font-semibold ${config.titleColor}`}>{t.title}</p>
        {t.message && (
          <p className="text-sm text-slate-600 mt-1">{t.message}</p>
        )}
      </div>
      <button
        onClick={onClose}
        className="p-1 text-slate-400 hover:text-slate-600 rounded transition-colors"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}

export function AdminToastContainer() {
  const [currentToasts, setCurrentToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const listener = (newToasts: Toast[]) => setCurrentToasts([...newToasts]);
    toastListeners.push(listener);
    return () => {
      toastListeners = toastListeners.filter(l => l !== listener);
    };
  }, []);

  if (currentToasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 space-y-3 max-w-md w-full">
      {currentToasts.map(t => (
        <ToastItem
          key={t.id}
          toast={t}
          onClose={() => updateToasts(toasts.filter(toast => toast.id !== t.id))}
        />
      ))}
    </div>
  );
}
