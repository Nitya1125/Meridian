"use client";

import React, { useState } from 'react';
import { PASTELS } from '@/design-system/tokens';

const PASTEL_KEYS = ['lavender', 'peach', 'lime', 'sky', 'rose', 'mint', 'gold'];

function getHashColor(name = '') {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % PASTEL_KEYS.length;
  return PASTELS[PASTEL_KEYS[index]];
}

function getInitials(name = '') {
  if (!name) return 'U';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return parts[0].slice(0, 2).toUpperCase();
}

/**
 * Meridian Avatar
 * Deterministic pastel initials, image fallback, and luxury presence beacons.
 */
export function Avatar({
  src = null,
  name = 'User',
  size = 'md',
  status = null, // 'online' | 'flow' | 'away' | null
  className = '',
  ...props
}) {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    xs: 'w-5.5 h-5.5 text-[9.5px]',
    sm: 'w-7 h-7 text-[11px]',
    md: 'w-9 h-9 text-[12.5px]',
    lg: 'w-11 h-11 text-[14.5px]',
    xl: 'w-14 h-14 text-[18px]',
  };

  const statusDotSizes = {
    xs: 'w-1.5 h-1.5 -bottom-0.5 -right-0.5 border',
    sm: 'w-2 h-2 -bottom-0.5 -right-0.5 border',
    md: 'w-2.5 h-2.5 bottom-0 right-0 border-2',
    lg: 'w-3 h-3 bottom-0.5 right-0.5 border-2',
    xl: 'w-3.5 h-3.5 bottom-1 right-1 border-2',
  };

  const pastel = getHashColor(name);
  const initials = getInitials(name);

  return (
    <div className={`relative inline-flex shrink-0 ${className}`} {...props}>
      <div
        style={
          !src || imageError
            ? {
                backgroundColor: pastel.bg,
                color: pastel.text,
                borderColor: pastel.border,
              }
            : undefined
        }
        className={`
          relative flex items-center justify-center rounded-full font-sans font-bold select-none overflow-hidden
          border border-black/5 shadow-xs
          ${sizeClasses[size] || sizeClasses.md}
        `}
      >
        {src && !imageError ? (
          <img
            src={src}
            alt={name}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <span>{initials}</span>
        )}
      </div>

      {status && (
        <span
          className={`
            absolute rounded-full border-white flex items-center justify-center
            ${statusDotSizes[size] || statusDotSizes.md}
            ${
              status === 'online'
                ? 'bg-lime-500'
                : status === 'flow'
                ? 'bg-amber-500'
                : 'bg-stone-400'
            }
          `}
        >
          {status === 'online' && (
            <span className="absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75 animate-ping" />
          )}
        </span>
      )}
    </div>
  );
}

export default Avatar;
