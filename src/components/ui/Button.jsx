"use client";

import React from 'react';

/**
 * Meridian Tactile Button
 * Implements neo-skeuomorphic tactile depression, kinetic spring curves,
 * and haute-horlogerie luxury variants.
 */
export const Button = React.forwardRef(function Button(
  {
    children,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    leftIcon = null,
    rightIcon = null,
    disabled = false,
    fullWidth = false,
    className = '',
    type = 'button',
    ...props
  },
  ref
) {
  // Size Scale
  const sizeClasses = {
    xs: 'h-7 px-2.5 text-[11px] font-semibold rounded-md gap-1.5',
    sm: 'h-8 px-3 text-[12.5px] font-semibold rounded-lg gap-1.5',
    md: 'h-9.5 px-4 text-[13.5px] font-semibold rounded-xl gap-2',
    lg: 'h-11 px-5 text-[14.5px] font-bold rounded-xl gap-2.5',
  };

  // Luxury Variant Styles
  const variantClasses = {
    primary:
      'bg-[#111318] text-white border border-white/10 shadow-[0_2px_8px_-2px_rgba(17,19,24,0.35)] hover:bg-[#1f222b] hover:shadow-[0_4px_14px_-2px_rgba(17,19,24,0.45)] hover:border-white/20',
    brand:
      'bg-[#4F46E5] text-white border border-[#4338CA] shadow-[0_2px_8px_-2px_rgba(79,70,229,0.4)] hover:bg-[#4338CA] hover:shadow-[0_4px_14px_-2px_rgba(79,70,229,0.5)]',
    secondary:
      'bg-[#F4F0E6] text-[#1C1917] border border-[#E7E1D6] hover:bg-[#ECE5D8] hover:border-[#D8CFBF] shadow-[0_1px_2px_rgba(0,0,0,0.03)]',
    outline:
      'bg-white text-[#1C1917] border border-stone-200/90 hover:bg-[#FAF8F5] hover:border-stone-300 shadow-[0_1px_2px_rgba(0,0,0,0.04)]',
    ghost:
      'bg-transparent text-[#44403C] hover:bg-[#F1EEE8] hover:text-[#1C1917] border border-transparent',
    danger:
      'bg-[#FFE4E6] text-[#BE123C] border border-[#FECDD3] hover:bg-[#FDD5DA] hover:border-[#FDA4AF]',
    dangerSolid:
      'bg-[#E11D48] text-white border border-[#BE123C] shadow-[0_2px_8px_rgba(225,29,72,0.35)] hover:bg-[#BE123C]',
    soft:
      'bg-[#EDE9FE] text-[#6D28D9] border border-[#DDD6FE] hover:bg-[#E3DCFD]',
    obsidian:
      'bg-[#111318] text-[#F8F6F0] border border-white/15 shadow-[0_12px_28px_-6px_rgba(0,0,0,0.5)] hover:border-white/30',
  };

  const isDisabled = disabled || isLoading;

  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      className={`
        relative inline-flex items-center justify-center select-none cursor-pointer
        font-sans tracking-[-0.01em] transition-all duration-150 ease-[cubic-bezier(0.16,1,0.3,1)]
        active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40 focus-visible:ring-offset-1
        ${sizeClasses[size] || sizeClasses.md}
        ${variantClasses[variant] || variantClasses.primary}
        ${fullWidth ? 'w-full' : ''}
        ${isDisabled ? 'opacity-50 cursor-not-allowed pointer-events-none active:scale-100' : ''}
        ${className}
      `}
      {...props}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin -ml-0.5 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3.5"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Loading...</span>
        </>
      ) : (
        <>
          {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
});

export default Button;
