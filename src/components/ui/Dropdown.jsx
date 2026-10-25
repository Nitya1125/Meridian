"use client";

import React, { useState, useRef, useEffect } from 'react';

/**
 * Meridian Dropdown Menu
 * Floating contextual menu with tactile hover states and obsidian/stone styling.
 */
export function Dropdown({
  trigger,
  items = [],
  align = 'right', // 'left' | 'right'
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <div onClick={() => setIsOpen((prev) => !prev)} className="cursor-pointer">
        {trigger}
      </div>

      {isOpen && (
        <div
          className={`
            absolute z-50 mt-1.5 w-52 rounded-xl bg-white border border-stone-200/90
            shadow-[0_12px_32px_-4px_rgba(18,19,22,0.12)] p-1.5
            transition-all duration-150 ease-[cubic-bezier(0.16,1,0.3,1)]
            animate-in fade-in zoom-in-95
            ${align === 'right' ? 'right-0' : 'left-0'}
          `}
        >
          {items.map((item, idx) => {
            if (item.type === 'divider') {
              return <div key={idx} className="my-1 border-t border-stone-100" />;
            }

            const isDanger = item.danger;

            return (
              <button
                key={item.id || idx}
                type="button"
                disabled={item.disabled}
                onClick={() => {
                  item.onClick?.();
                  setIsOpen(false);
                }}
                className={`
                  w-full flex items-center justify-between px-3 py-2 text-[12.5px] font-sans font-medium rounded-lg
                  transition-colors duration-100 text-left
                  ${
                    item.disabled
                      ? 'text-stone-300 cursor-not-allowed'
                      : isDanger
                      ? 'text-rose-600 hover:bg-rose-50 hover:text-rose-700'
                      : 'text-stone-700 hover:bg-stone-50 hover:text-stone-900'
                  }
                `}
              >
                <div className="flex items-center gap-2">
                  {item.icon && <span className="w-4 h-4 shrink-0 flex items-center justify-center">{item.icon}</span>}
                  <span>{item.label}</span>
                </div>
                {item.shortcut && (
                  <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider">
                    {item.shortcut}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Dropdown;
