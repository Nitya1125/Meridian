"use client";

import React from 'react';
import Avatar from './Avatar';

/**
 * Meridian Avatar Group
 * Stacks team member avatars with negative spacing and overflow pill.
 */
export function AvatarGroup({
  users = [],
  max = 4,
  size = 'md',
  className = '',
  ...props
}) {
  const visibleUsers = users.slice(0, max);
  const remainingCount = users.length - max;

  const overlapClasses = {
    xs: '-space-x-1.5',
    sm: '-space-x-2',
    md: '-space-x-2.5',
    lg: '-space-x-3',
  };

  const pillSizeClasses = {
    xs: 'w-5.5 h-5.5 text-[9px]',
    sm: 'w-7 h-7 text-[10.5px]',
    md: 'w-9 h-9 text-[11.5px]',
    lg: 'w-11 h-11 text-[13px]',
  };

  return (
    <div
      className={`inline-flex items-center ${overlapClasses[size] || overlapClasses.md} ${className}`}
      {...props}
    >
      {visibleUsers.map((user, idx) => (
        <div key={user.id || user.name || idx} className="ring-2 ring-white rounded-full">
          <Avatar
            src={user.avatar || user.src}
            name={user.name || user.email}
            size={size}
            status={user.status}
          />
        </div>
      ))}

      {remainingCount > 0 && (
        <div className="ring-2 ring-white rounded-full">
          <div
            className={`
              flex items-center justify-center rounded-full bg-stone-100 border border-stone-200
              font-sans font-bold text-stone-600 select-none
              ${pillSizeClasses[size] || pillSizeClasses.md}
            `}
          >
            +{remainingCount}
          </div>
        </div>
      )}
    </div>
  );
}

export default AvatarGroup;
