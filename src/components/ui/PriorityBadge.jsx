"use client";

import React from 'react';
import { PRIORITY_TOKENS } from '@/design-system/tokens';

/**
 * Meridian Priority Badge
 * High/Critical/Medium/Low priority indicator with glowing beacon dot.
 */
export function PriorityBadge({
  priority = 'medium',
  size = 'md',
  showDot = true,
  pulse = false,
  className = '',
  ...props
}) {
  const key = String(priority).toLowerCase();
  const token = PRIORITY_TOKENS[key] || PRIORITY_TOKENS.medium;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[11px] rounded-md gap-1.5',
    md: 'px-2.5 py-1 text-[12px] rounded-lg gap-1.5',
    lg: 'px-3 py-1.5 text-[13px] rounded-lg gap-2',
  };

  const isCritical = key === 'critical';
  const shouldPulse = pulse || isCritical;

  return (
    <span
      style={{
        backgroundColor: token.bg,
        color: token.text,
        borderColor: token.border,
      }}
      className={`
        inline-flex items-center justify-center border font-sans font-semibold tracking-[-0.005em] select-none
        ${sizeClasses[size] || sizeClasses.md}
        ${className}
      `}
      {...props}
    >
      {showDot && (
        <span className="relative flex h-2 w-2 shrink-0 items-center justify-center">
          {shouldPulse && (
            <span
              style={{ backgroundColor: token.dot }}
              className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping"
            />
          )}
          <span
            style={{ backgroundColor: token.dot }}
            className="relative inline-flex h-1.5 w-1.5 rounded-full"
          />
        </span>
      )}
      <span>{token.label}</span>
    </span>
  );
}

export default PriorityBadge;
