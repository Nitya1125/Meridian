"use client";

import React from 'react';
import * as BespokeIcons from '../Icons';

/**
 * Meridian Unified Icon Component
 * Connects directly to the 33-icon suite from Figma Icons & Logo (1:3) and Icons.jsx.
 */
export function Icon({
  name,
  size = 18,
  strokeWidth = 1.75,
  className = '',
  ...props
}) {
  // Normalize name e.g. "home" -> "HomeIcon", "Home" -> "HomeIcon", "IconlyHome" -> "IconlyHome"
  let iconComponent = null;

  if (typeof name === 'string') {
    const capitalized = name.charAt(0).toUpperCase() + name.slice(1);
    const possibleNames = [
      `${capitalized}Icon`,
      capitalized,
      `Iconly${capitalized}`,
      name,
    ];

    for (const n of possibleNames) {
      if (BespokeIcons[n]) {
        iconComponent = BespokeIcons[n];
        break;
      }
    }
  } else if (React.isValidElement(name) || typeof name === 'function') {
    const CustomIcon = name;
    return <CustomIcon size={size} strokeWidth={strokeWidth} className={className} {...props} />;
  }

  if (!iconComponent) {
    // Fallback dot
    return (
      <span
        style={{ width: size, height: size }}
        className={`inline-block rounded-full bg-stone-300 ${className}`}
        {...props}
      />
    );
  }

  const Rendered = iconComponent;
  return <Rendered size={size} strokeWidth={strokeWidth} className={className} {...props} />;
}

export * from '../Icons';
export default Icon;
