'use client';

import { useState, useEffect, useRef } from 'react';
import { Calendar } from 'lucide-react';

interface AdminDateInputProps {
  label: string;
  value: string; // ISO format: YYYY-MM-DD
  onChange: (value: string) => void;
  required?: boolean;
  error?: string;
  disabled?: boolean;
}

// Convert ISO date (YYYY-MM-DD) to Romanian format (DD.MM.YYYY)
function isoToRo(isoDate: string): string {
  if (!isoDate) return '';
  const parts = isoDate.split('-');
  if (parts.length !== 3) return '';
  return `${parts[2]}.${parts[1]}.${parts[0]}`;
}

// Convert Romanian format (DD.MM.YYYY) to ISO date (YYYY-MM-DD)
function roToIso(roDate: string): string {
  if (!roDate) return '';
  const parts = roDate.split('.');
  if (parts.length !== 3) return '';
  const [day, month, year] = parts;
  if (day.length !== 2 || month.length !== 2 || year.length !== 4) return '';
  return `${year}-${month}-${day}`;
}

// Validate Romanian date format
function isValidRoDate(roDate: string): boolean {
  if (!roDate) return false;
  const parts = roDate.split('.');
  if (parts.length !== 3) return false;
  const [day, month, year] = parts.map(Number);
  if (isNaN(day) || isNaN(month) || isNaN(year)) return false;
  if (day < 1 || day > 31) return false;
  if (month < 1 || month > 12) return false;
  if (year < 1900 || year > 2100) return false;
  // Check if date is valid
  const date = new Date(year, month - 1, day);
  return date.getDate() === day && date.getMonth() === month - 1 && date.getFullYear() === year;
}

export function AdminDateInput({
  label,
  value,
  onChange,
  required = false,
  error,
  disabled = false,
}: AdminDateInputProps) {
  const [displayValue, setDisplayValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const inputId = label.toLowerCase().replace(/\s+/g, '-');

  // Sync display value when prop changes
  useEffect(() => {
    if (!isFocused) {
      setDisplayValue(isoToRo(value));
    }
  }, [value, isFocused]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value;
    
    // Only allow digits and dots
    input = input.replace(/[^\d.]/g, '');
    
    // Auto-insert dots
    if (input.length === 2 && !input.includes('.')) {
      input += '.';
    } else if (input.length === 5 && input.split('.').length === 2) {
      input += '.';
    }
    
    // Limit length
    if (input.length > 10) {
      input = input.slice(0, 10);
    }
    
    setDisplayValue(input);
    
    // If complete and valid, update the actual value
    if (input.length === 10 && isValidRoDate(input)) {
      onChange(roToIso(input));
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Reformat on blur if valid
    if (displayValue && isValidRoDate(displayValue)) {
      const isoDate = roToIso(displayValue);
      onChange(isoDate);
      setDisplayValue(isoToRo(isoDate));
    } else if (displayValue && !isValidRoDate(displayValue)) {
      // Reset to previous valid value
      setDisplayValue(isoToRo(value));
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleCalendarClick = () => {
    hiddenInputRef.current?.showPicker();
  };

  const handleHiddenDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setDisplayValue(isoToRo(newValue));
  };

  return (
    <div className="space-y-2">
      <label
        htmlFor={inputId}
        className="block text-base font-medium text-slate-700"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        <input
          id={inputId}
          type="text"
          value={displayValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder="ZZ.LL.AAAA"
          disabled={disabled}
          className={`
            w-full px-4 py-3 pr-12 text-base border rounded-lg
            bg-white text-slate-900 placeholder-slate-400
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            disabled:bg-slate-50 disabled:text-slate-500
            ${error ? 'border-red-500 focus:ring-red-500' : 'border-slate-300'}
          `}
        />
        <button
          type="button"
          onClick={handleCalendarClick}
          disabled={disabled}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 disabled:opacity-50"
          title="Deschide calendarul"
        >
          <Calendar className="w-5 h-5" />
        </button>
        {/* Hidden native date picker for calendar functionality */}
        <input
          ref={hiddenInputRef}
          type="date"
          value={value}
          onChange={handleHiddenDateChange}
          className="absolute opacity-0 w-0 h-0 overflow-hidden"
          tabIndex={-1}
        />
      </div>
      {error && (
        <p className="text-sm text-red-600 font-medium">{error}</p>
      )}
    </div>
  );
}
