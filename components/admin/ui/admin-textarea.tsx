import { forwardRef } from 'react';

interface AdminTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  hint?: string;
}

export const AdminTextarea = forwardRef<HTMLTextAreaElement, AdminTextareaProps>(
  ({ label, error, hint, className = '', id, rows = 4, ...props }, ref) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="space-y-2">
        <label
          htmlFor={inputId}
          className="block text-base font-medium text-slate-700"
        >
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <textarea
          ref={ref}
          id={inputId}
          rows={rows}
          className={`
            w-full px-4 py-3 text-base border rounded-lg
            bg-white text-slate-900 placeholder-slate-400
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            disabled:bg-slate-50 disabled:text-slate-500
            resize-y
            ${error ? 'border-red-500 focus:ring-red-500' : 'border-slate-300'}
            ${className}
          `}
          {...props}
        />
        {hint && !error && (
          <p className="text-sm text-slate-500">{hint}</p>
        )}
        {error && (
          <p className="text-sm text-red-600 font-medium">{error}</p>
        )}
      </div>
    );
  }
);

AdminTextarea.displayName = 'AdminTextarea';
