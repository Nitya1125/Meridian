"use client";

import React, { useState } from 'react';

/**
 * Meridian Micro-Tooltip
 * Dark obsidian HUD surface with precision telemetry typography.
 */
export function Tooltip({
  content,
  children,
  position = 'top', // 'top' | 'bottom' | 'left' | 'right'
  className = '',
}) {
  const [visible, setVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}

      {visible && content && (
        <div
          role="tooltip"
          className={`
            absolute z-50 pointer-events-none whitespace-nowrap
            bg-[#111318] text-[#FAF8F5] text-[11px] font-sans font-medium px-2.5 py-1 rounded-md
            border border-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.3)]
            transition-all duration-150 ease-[cubic-bezier(0.16,1,0.3,1)]
            animate-in fade-in zoom-in-95
            ${positionClasses[position] || positionClasses.top}
            ${className}
          `}
        >
          {content}
        </div>
      )}
    </div>
  );
}

export default Tooltip;
