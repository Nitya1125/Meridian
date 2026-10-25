"use client";

import React from 'react';

/**
 * Meridian Select Dropdown
 */
export const Select = React.forwardRef(function Select(
  {
    label = null,
    error = null,
    hint = null,
    required = false,
    options = [],
    size = 'md',
    fullWidth = true,
    className = '',
    containerClassName = '',
    disabled = false,
    children,
    id,
    ...props
  },
  ref
) {
  const generatedId = React.useId();
  const inputId = id || generatedId;

  const sizeClasses = {
    sm: 'h-8 px-2.5 text-[12.5px] rounded-lg',
    md: 'h-10 px-3.5 text-[13.5px] rounded-xl',
    lg: 'h-11 px-4 text-[14.5px] rounded-xl',
  };

  return (
    <div className={`${fullWidth ? 'w-full' : 'inline-block'} ${containerClassName}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block font-sans text-[12.5px] font-semibold text-stone-700 mb-1.5"
        >
          {label}
          {required && <span className="text-rose-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        <select
          ref={ref}
          id={inputId}
          disabled={disabled}
          className={`
            w-full font-sans bg-white border text-stone-900 pr-9 appearance-none cursor-pointer
            transition-all duration-150 ease-[cubic-bezier(0.16,1,0.3,1)]
            focus:outline-none focus:bg-white
            ${
              error
                ? 'border-rose-400 focus:border-rose-500 focus:ring-3 focus:ring-rose-500/20'
                : 'border-stone-200/90 hover:border-stone-300 focus:border-indigo-600 focus:ring-3 focus:ring-indigo-600/15'
            }
            ${sizeClasses[size] || sizeClasses.md}
            ${disabled ? 'bg-stone-50 text-stone-400 cursor-not-allowed border-stone-200' : ''}
            ${className}
          `}
          {...props}
        >
          {children ? (
            children
          ) : (
            options.map((opt) => (
              <option key={opt.value ?? opt} value={opt.value ?? opt}>
                {opt.label ?? opt}
              </option>
            ))
          )}
        </select>

        <div className="absolute right-3 pointer-events-none text-stone-400">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {error ? (
        <p className="mt-1 font-sans text-[11.5px] font-medium text-rose-600">{error}</p>
      ) : hint ? (
        <p className="mt-1 font-sans text-[11.5px] text-stone-500">{hint}</p>
      ) : null}
    </div>
  );
});

export default Select;
