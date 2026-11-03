"use client";

import React from 'react';

/**
 * Meridian Card & Bento Tile System
 * Ambient occlusion elevation, tactile lift on hover, glass and obsidian variants.
 */
export const Card = React.forwardRef(function Card(
  {
    children,
    variant = 'default', // 'default' | 'interactive' | 'obsidian' | 'glass' | 'subtle'
    padding = 'md',     // 'none' | 'sm' | 'md' | 'lg' | 'xl'
    radius = '2xl',     // 'lg' | 'xl' | '2xl' | '3xl'
    className = '',
    onClick = null,
    ...props
  },
  ref
) {
  const radiusClasses = {
    lg: 'rounded-xl',
    xl: 'rounded-2xl',
    '2xl': 'rounded-[20px]',
    '3xl': 'rounded-[24px]',
  };

  const paddingClasses = {
    none: 'p-0',
    sm: 'p-3.5',
    md: 'p-5',
    lg: 'p-6',
    xl: 'p-8',
  };

  const variantClasses = {
    default:
      'bg-white border border-stone-200/70 shadow-[0_4px_20px_-2px_rgba(18,19,22,0.03),0_2px_6px_-1px_rgba(18,19,22,0.02)]',
    interactive:
      'bg-white border border-stone-200/70 shadow-[0_4px_20px_-2px_rgba(18,19,22,0.03)] hover:-translate-y-0.5 hover:shadow-[0_14px_32px_-4px_rgba(18,19,22,0.08),0_4px_12px_-2px_rgba(18,19,22,0.04)] hover:border-stone-300 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer active:scale-[0.99]',
    obsidian:
      'bg-[#111318] text-[#FAF8F5] border border-white/10 shadow-[0_20px_40px_-8px_rgba(0,0,0,0.45),0_4px_12px_rgba(0,0,0,0.2)]',
    glass:
      'bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_8px_24px_-4px_rgba(18,19,22,0.05)]',
    subtle:
      'bg-[#F8F6F0] border border-[#E7E1D6] shadow-none',
  };

  return (
    <div
      ref={ref}
      onClick={onClick}
      className={`
        relative overflow-hidden
        ${radiusClasses[radius] || radiusClasses['2xl']}
        ${paddingClasses[padding] || paddingClasses.md}
        ${variantClasses[variant] || variantClasses.default}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
});

export function CardHeader({ children, className = '', ...props }) {
  return (
    <div className={`flex items-center justify-between pb-3 border-b border-stone-100 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '', ...props }) {
  return (
    <h3 className={`font-sans text-[16px] font-bold text-stone-900 tracking-[-0.015em] ${className}`} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className = '', ...props }) {
  return (
    <p className={`font-sans text-[13px] text-stone-500 mt-0.5 ${className}`} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ children, className = '', ...props }) {
  return <div className={`pt-3 ${className}`} {...props}>{children}</div>;
}

export function CardFooter({ children, className = '', ...props }) {
  return (
    <div className={`mt-4 pt-3 border-t border-stone-100 flex items-center justify-between ${className}`} {...props}>
      {children}
    </div>
  );
}

export default Card;
