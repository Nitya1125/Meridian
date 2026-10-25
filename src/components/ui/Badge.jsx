"use client";

import React from 'react';
import { PASTELS } from '@/design-system/tokens';

/**
 * Meridian Pastel Badge / Pill
 * Calibrated against WCAG AA >= 4.5:1 contrast formula.
 */
export function Badge({
  children,
  tint = 'stone',
  size = 'md',
  dot = false,
  dotColor = null,
  pulse = false,
  variant = 'pastel', // 'pastel' | 'outline' | 'solid'
  className = '',
  icon = null,
  ...props
}) {
  const pastelConfig = PASTELS[tint] || PASTELS.stone;

  const sizeClasses = {
    xs: 'px-1.5 py-0.5 text-[10px] font-bold rounded gap-1',
    sm: 'px-2 py-0.5 text-[11px] font-semibold rounded-md gap-1.5',
    md: 'px-2.5 py-1 text-[12px] font-semibold rounded-lg gap-1.5',
    lg: 'px-3 py-1.5 text-[13px] font-semibold rounded-lg gap-2',
  };

  let styleObj = {};
  if (variant === 'pastel') {
    styleObj = {
      backgroundColor: pastelConfig.bg,
      color: pastelConfig.text,
      borderColor: pastelConfig.border,
    };
  } else if (variant === 'outline') {
    styleObj = {
      backgroundColor: 'transparent',
      color: pastelConfig.text,
      borderColor: pastelConfig.border,
    };
  } else if (variant === 'solid') {
    styleObj = {
      backgroundColor: pastelConfig.solid || pastelConfig.text,
      color: '#FFFFFF',
      borderColor: 'transparent',
    };
  }

  const resolvedDotColor = dotColor || pastelConfig.text;

  return (
    <span
      style={styleObj}
      className={`
        inline-flex items-center justify-center border font-sans select-none tracking-[-0.005em]
        transition-colors duration-150
        ${sizeClasses[size] || sizeClasses.md}
        ${className}
      `}
      {...props}
    >
      {dot && (
        <span className="relative flex h-2 w-2 shrink-0 items-center justify-center">
          {pulse && (
            <span
              style={{ backgroundColor: resolvedDotColor }}
              className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping"
            />
          )}
          <span
            style={{ backgroundColor: resolvedDotColor }}
            className="relative inline-flex h-1.5 w-1.5 rounded-full"
          />
        </span>
      )}
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
}

export default Badge;
