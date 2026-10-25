"use client";

import React from 'react';

/**
 * Meridian Divider
 * Subtle hairline structural divider with optional centered label.
 */
export function Divider({
  label = null,
  orientation = 'horizontal', // 'horizontal' | 'vertical'
  className = '',
}) {
  if (orientation === 'vertical') {
    return <div className={`w-[1px] h-full bg-stone-200/80 mx-2 self-stretch ${className}`} />;
  }

  if (label) {
    return (
      <div className={`relative flex items-center justify-center my-4 ${className}`}>
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-stone-200/80" />
        </div>
        <span className="relative bg-[#FAF8F5] px-3 font-sans text-[11px] font-semibold uppercase tracking-wider text-stone-400">
          {label}
        </span>
      </div>
    );
  }

  return <div className={`w-full border-t border-stone-200/80 my-3 ${className}`} />;
}

export default Divider;
