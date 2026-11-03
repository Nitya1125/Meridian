"use client";

import React from 'react';

/**
 * Meridian Tactile Checkbox
 */
export function Checkbox({
  checked = false,
  onChange = () => {},
  label = null,
  description = null,
  disabled = false,
  className = '',
  id,
  ...props
}) {
  const generatedId = React.useId();
  const checkboxId = id || generatedId;

  return (
    <label
      htmlFor={checkboxId}
      className={`inline-flex items-start gap-2.5 cursor-pointer select-none ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${className}`}
    >
      <div className="relative flex items-center pt-0.5">
        <input
          id={checkboxId}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
          {...props}
        />
        <div
          className={`
            w-4.5 h-4.5 rounded-md border flex items-center justify-center
            transition-all duration-150 ease-[cubic-bezier(0.16,1,0.3,1)]
            ${
              checked
                ? 'bg-[#111318] border-[#111318] text-white shadow-xs'
                : 'bg-white border-stone-300 hover:border-stone-400'
            }
          `}
        >
          {checked && (
            <svg
              className="w-3 h-3 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="3"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </div>
      </div>

      {(label || description) && (
        <div className="flex flex-col">
          {label && (
            <span className="font-sans text-[13px] font-semibold text-stone-800 leading-tight">
              {label}
            </span>
          )}
          {description && (
            <span className="font-sans text-[11.5px] text-stone-500 leading-tight mt-0.5">
              {description}
            </span>
          )}
        </div>
      )}
    </label>
  );
}

export default Checkbox;
