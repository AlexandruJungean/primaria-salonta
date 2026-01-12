'use client';

import { useEffect, useRef } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { AdminButton } from './admin-button';

interface AdminConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning';
  loading?: boolean;
}

export function AdminConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Da, confirmă',
  cancelLabel = 'Nu, anulează',
  variant = 'danger',
  loading = false,
}: AdminConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const iconColors = {
    danger: 'bg-red-100 text-red-600',
    warning: 'bg-amber-100 text-amber-600',
  };

  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-0 z-50 bg-transparent p-0 m-0 max-w-none max-h-none w-full h-full"
      onClose={onClose}
    >
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50" 
        onClick={onClose}
      />
      
      {/* Dialog Content */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Icon */}
          <div className={`w-16 h-16 rounded-full ${iconColors[variant]} flex items-center justify-center mx-auto mb-4`}>
            <AlertTriangle className="w-8 h-8" />
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-slate-900 text-center mb-2">
            {title}
          </h3>

          {/* Message */}
          <p className="text-base text-slate-600 text-center mb-6">
            {message}
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <AdminButton
              variant="secondary"
              size="lg"
              onClick={onClose}
              disabled={loading}
              className="flex-1"
            >
              {cancelLabel}
            </AdminButton>
            <AdminButton
              variant={variant === 'danger' ? 'danger' : 'primary'}
              size="lg"
              onClick={onConfirm}
              loading={loading}
              className="flex-1"
            >
              {confirmLabel}
            </AdminButton>
          </div>
        </div>
      </div>
    </dialog>
  );
}
