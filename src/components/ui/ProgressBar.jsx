"use client";

import React from 'react';

const STRIPED_GRADIENTS = {
  green:
    'repeating-linear-gradient(-45deg, #a3e635, #a3e635 6px, #84cc16 6px, #84cc16 12px)',
  orange:
    'repeating-linear-gradient(-45deg, #fb923c, #fb923c 6px, #f97316 6px, #f97316 12px)',
  purple:
    'repeating-linear-gradient(-45deg, #c084fc, #c084fc 6px, #a855f7 6px, #a855f7 12px)',
  sky:
    'repeating-linear-gradient(-45deg, #38bdf8, #38bdf8 6px, #0284c7 6px, #0284c7 12px)',
  rose:
    'repeating-linear-gradient(-45deg, #fb7185, #fb7185 6px, #e11d48 6px, #e11d48 12px)',
};

const SOLID_COLORS = {
  green: '#10B981',
  orange: '#F97316',
  purple: '#8B5CF6',
  sky: '#0EA5E9',
  rose: '#F43F5E',
  indigo: '#4F46E5',
  stone: '#57534E',
};

/**
 * Meridian Kinetic Progress Bar
 * Supports standard smooth fills, candy-striped velocity meters, and fractional counters.
 */
export function ProgressBar({
  value = 0,
  max = 100,
  striped = false,
  color = 'indigo', // 'green' | 'orange' | 'purple' | 'sky' | 'rose' | 'indigo' | 'stone'
  size = 'md',      // 'xs' | 'sm' | 'md' | 'lg'
  showLabel = false,
  subtasks = null,  // e.g. { completed: 3, total: 5 }
  className = '',
  ...props
}) {
  const percentage = Math.min(
    100,
    Math.max(
      0,
      subtasks
        ? Math.round((subtasks.completed / (subtasks.total || 1)) * 100)
        : Math.round(((value || 0) / (max || 100)) * 100)
    )
  );

  const sizeClasses = {
    xs: 'h-1.5 rounded-full',
    sm: 'h-2 rounded-full',
    md: 'h-2.5 rounded-full',
    lg: 'h-3.5 rounded-full',
  };

  const backgroundStyle = striped
    ? { background: STRIPED_GRADIENTS[color] || STRIPED_GRADIENTS.green }
    : { backgroundColor: SOLID_COLORS[color] || SOLID_COLORS.indigo };

  return (
    <div className={`w-full ${className}`} {...props}>
      {(showLabel || subtasks) && (
        <div className="flex items-center justify-between mb-1.5 font-sans text-[12px] font-semibold text-stone-600">
          {subtasks ? (
            <span>
              {subtasks.completed}/{subtasks.total} Subtasks completed
            </span>
          ) : (
            <span>Progress</span>
          )}
          <span className="font-mono font-bold text-stone-800">{percentage}%</span>
        </div>
      )}

      <div
        className={`
          w-full bg-[#EAE6DD] overflow-hidden p-0.5 border border-black/5 shadow-inner
          ${sizeClasses[size] || sizeClasses.md}
        `}
      >
        <div
          style={{
            width: `${percentage}%`,
            ...backgroundStyle,
          }}
          className={`
            h-full rounded-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
          `}
        />
      </div>
    </div>
  );
}

export default ProgressBar;
