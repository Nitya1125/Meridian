"use client";

import React from 'react';

/**
 * Meridian Luxury Input
 * Features Figma 3px focus ring halo, warm substrate surface, and precision iconography slots.
 */
export const Input = React.forwardRef(function Input(
  {
    label = null,
    error = null,
    hint = null,
    required = false,
    leftIcon = null,
    rightIcon = null,
    size = 'md',
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
        {leftIcon && (
          <div className="absolute left-3 flex items-center pointer-events-none text-stone-400">
            {leftIcon}
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          className={`
            w-full font-sans bg-white border text-stone-900 placeholder:text-stone-400
            transition-all duration-150 ease-[cubic-bezier(0.16,1,0.3,1)]
            focus:outline-none focus:bg-white
            ${
              error
                ? 'border-rose-400 focus:border-rose-500 focus:ring-3 focus:ring-rose-500/20'
                : 'border-stone-200/90 hover:border-stone-300 focus:border-indigo-600 focus:ring-3 focus:ring-indigo-600/15'
            }
            ${sizeClasses[size] || sizeClasses.md}
            ${leftIcon ? 'pl-9.5' : ''}
            ${rightIcon ? 'pr-9.5' : ''}
            ${disabled ? 'bg-stone-50 text-stone-400 cursor-not-allowed border-stone-200' : ''}
            ${className}
          `}
          {...props}
        />

        {rightIcon && (
          <div className="absolute right-3 flex items-center text-stone-400">
            {rightIcon}
          </div>
        )}
      </div>

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

export default Input;
