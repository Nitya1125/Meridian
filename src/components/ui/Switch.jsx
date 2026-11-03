"use client";

import React from 'react';

/**
 * Meridian Tactile Switch
 * Mechanical toggle switch with kinetic spring physics.
 */
export function Switch({
  checked = false,
  onChange = () => {},
  label = null,
  description = null,
  size = 'md',
  disabled = false,
  className = '',
  id,
  ...props
}) {
  const generatedId = React.useId();
  const switchId = id || generatedId;

  const sizeConfigs = {
    sm: { track: 'w-7 h-4', thumb: 'w-3 h-3', translate: 'translate-x-3.5' },
    md: { track: 'w-9.5 h-5.5', thumb: 'w-4.5 h-4.5', translate: 'translate-x-4' },
    lg: { track: 'w-12 h-6.5', thumb: 'w-5.5 h-5.5', translate: 'translate-x-5.5' },
  };

  const cfg = sizeConfigs[size] || sizeConfigs.md;

  return (
    <label
      htmlFor={switchId}
      className={`inline-flex items-center gap-3 cursor-pointer select-none ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${className}`}
    >
      <div className="relative inline-flex items-center">
        <input
          id={switchId}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
          {...props}
        />
        <div
          className={`
            ${cfg.track} rounded-full transition-colors duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]
            p-0.5 border
            ${
              checked
                ? 'bg-[#111318] border-[#111318]'
                : 'bg-stone-200 border-stone-300'
            }
          `}
        >
          <div
            className={`
              ${cfg.thumb} rounded-full bg-white shadow-sm
              transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]
              ${checked ? cfg.translate : 'translate-x-0'}
            `}
          />
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

export default Switch;
