"use client";

import React from 'react';
import { TAG_TOKENS } from '@/design-system/tokens';

/**
 * Meridian Tag Badge
 * Categorical domain tags (Auth, Backend, Frontend, Design, Payments, Security, Mobile, Infra, Testing)
 * with dedicated token styling from Figma Foundations.
 */
export function TagBadge({
  tag = 'frontend',
  label = null,
  size = 'md',
  onRemove = null,
  className = '',
  ...props
}) {
  const key = String(tag).toLowerCase().replace(/[^a-z]/g, '');
  const token = TAG_TOKENS[key] || {
    label: tag,
    bg: '#F1F5F9',
    text: '#475569',
    border: '#CBD5E1',
  };

  const displayLabel = label || token.label || tag;

  const sizeClasses = {
    xs: 'px-1.5 py-0.5 text-[10px] rounded gap-1',
    sm: 'px-2 py-0.5 text-[11px] rounded-md gap-1.5',
    md: 'px-2.5 py-0.5 text-[12px] rounded-md gap-1.5',
    lg: 'px-3 py-1 text-[13px] rounded-lg gap-2',
  };

  return (
    <span
      style={{
        backgroundColor: token.bg,
        color: token.text,
        borderColor: token.border,
      }}
      className={`
        inline-flex items-center justify-center border font-sans font-medium select-none
        transition-all duration-150
        ${sizeClasses[size] || sizeClasses.md}
        ${className}
      `}
      {...props}
    >
      <span>{displayLabel}</span>
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(tag);
          }}
          className="ml-0.5 inline-flex h-3.5 w-3.5 items-center justify-center rounded-full hover:bg-black/10 focus:outline-none"
        >
          <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </span>
  );
}

export default TagBadge;
