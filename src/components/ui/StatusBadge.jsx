"use client";

import React from 'react';
import { STATUS_TOKENS } from '@/design-system/tokens';

const STATUS_ALIASES = {
  todo: 'info',
  'to-do': 'info',
  'to do': 'info',
  in_progress: 'warning',
  'in progress': 'warning',
  inprogress: 'warning',
  in_review: 'info',
  'in review': 'info',
  inreview: 'info',
  done: 'success',
  completed: 'success',
  ready: 'success',
  blocked: 'danger',
  failed: 'danger',
};

const STATUS_LABELS = {
  todo: 'To Do',
  in_progress: 'In Progress',
  in_review: 'In Review',
  done: 'Done',
  blocked: 'Blocked',
};

/**
 * Meridian Status Badge
 * Visual indicator for Task & Sprint life-cycle states.
 */
export function StatusBadge({
  status = 'todo',
  label = null,
  size = 'md',
  showDot = true,
  className = '',
  ...props
}) {
  const normKey = String(status).toLowerCase().trim();
  const tokenKey = STATUS_ALIASES[normKey] || 'info';
  const token = STATUS_TOKENS[tokenKey] || STATUS_TOKENS.info;

  const displayLabel = label || STATUS_LABELS[normKey] || status;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[11px] rounded-md gap-1.5',
    md: 'px-2.5 py-1 text-[12px] rounded-lg gap-1.5',
    lg: 'px-3 py-1.5 text-[13px] rounded-lg gap-2',
  };

  return (
    <span
      style={{
        backgroundColor: token.bg,
        color: token.text,
        borderColor: token.border,
      }}
      className={`
        inline-flex items-center justify-center border font-sans font-semibold select-none
        ${sizeClasses[size] || sizeClasses.md}
        ${className}
      `}
      {...props}
    >
      {showDot && (
        <span
          style={{ backgroundColor: token.solid }}
          className="inline-flex h-1.5 w-1.5 rounded-full shrink-0"
        />
      )}
      <span>{displayLabel}</span>
    </span>
  );
}

export default StatusBadge;
