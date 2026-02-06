'use client';

import { useState, useRef, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/src/style.css';

type DatePickerProps = {
  value: string;
  onChange: (value: string) => void;
  min?: Date;
  max?: Date;
  placeholder?: string;
  id?: string;
  disabled?: boolean;
  className?: string;
  'aria-label'?: string;
};

function formatForInput(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function DatePicker({
  value,
  onChange,
  min,
  max,
  placeholder = 'Select date',
  id,
  disabled,
  className = '',
  'aria-label': ariaLabel,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const selectedDate = value ? new Date(value + 'T12:00:00') : undefined;

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        id={id}
        disabled={disabled}
        aria-label={ariaLabel}
        aria-expanded={open}
        onClick={() => !disabled && setOpen((o) => !o)}
        className={
          className
            ? `flex w-full items-center justify-between gap-2 ${className}`
            : 'flex w-full items-center justify-between gap-2 rounded-lg border border-[--color-border] bg-[--color-background] px-3 py-2.5 text-left text-white placeholder:text-[--color-muted] focus:border-[--color-primary] focus:outline-none focus:ring-2 focus:ring-[--color-primary]/20'
        }
      >
        <span className={value ? 'text-white' : 'text-[--color-muted]'}>
          {value ? formatForInput(new Date(value + 'T12:00:00')) : placeholder}
        </span>
        <svg
          className="ml-auto h-5 w-5 text-[--color-muted]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </button>
      {open && (
        <div
          className="rdp-dark absolute left-0 top-full z-50 mt-2 rounded-xl border border-[--color-border] bg-[--color-card] p-4 shadow-xl"
          role="dialog"
          aria-label="Calendar"
        >
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={(d) => {
              if (d) {
                onChange(formatForInput(d));
                setOpen(false);
              }
            }}
            disabled={(date) => {
              if (min && date < min) return true;
              if (max && date > max) return true;
              return false;
            }}
            defaultMonth={selectedDate || new Date()}
          />
        </div>
      )}
    </div>
  );
}
