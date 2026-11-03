"use client";

import React from 'react';

/**
 * Meridian Textarea
 * Matches Meridian Input styling with comfortable multiline typography.
 */
export const Textarea = React.forwardRef(function Textarea(
  {
    label = null,
    error = null,
    hint = null,
    required = false,
    rows = 3,
    fullWidth = true,
    className = '',
    containerClassName = '',
    disabled = false,
    id,
    ...props
  },
  ref
) {
  const generatedId = React.useId();
  const inputId = id || generatedId;

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

      <textarea
        ref={ref}
        id={inputId}
        rows={rows}
        disabled={disabled}
        className={`
          w-full font-sans bg-white border text-stone-900 placeholder:text-stone-400 p-3
          text-[13.5px] rounded-xl transition-all duration-150 ease-[cubic-bezier(0.16,1,0.3,1)]
          focus:outline-none focus:bg-white resize-y
          ${
            error
              ? 'border-rose-400 focus:border-rose-500 focus:ring-3 focus:ring-rose-500/20'
              : 'border-stone-200/90 hover:border-stone-300 focus:border-indigo-600 focus:ring-3 focus:ring-indigo-600/15'
          }
          ${disabled ? 'bg-stone-50 text-stone-400 cursor-not-allowed border-stone-200' : ''}
          ${className}
        `}
        {...props}
      />

      {error ? (
        <p className="mt-1 font-sans text-[11.5px] font-medium text-rose-600 flex items-center gap-1">
          <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1 font-sans text-[11.5px] text-stone-500">{hint}</p>
      ) : null}
    </div>
  );
});

export default Textarea;
