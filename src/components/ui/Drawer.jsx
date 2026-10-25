"use client";

import React, { useEffect } from 'react';

/**
 * Meridian Slide-over Drawer
 * Smooth kinetic spring entrance from the right, backdrop blur, and tactile action bar.
 */
export function Drawer({
  isOpen = false,
  onClose = () => {},
  title = null,
  description = null,
  children,
  footer = null,
  width = 'md', // 'sm' | 'md' | 'lg' | 'xl'
  className = '',
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const widthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-xl',
    xl: 'max-w-2xl',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#0F1117]/50 backdrop-blur-xs transition-opacity duration-300"
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div
          className={`
            w-screen ${widthClasses[width] || widthClasses.md}
            bg-white shadow-[0_20px_50px_rgba(0,0,0,0.25)] border-l border-stone-200
            flex flex-col transform transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
            ${className}
          `}
        >
          {/* Header */}
          <div className="p-5 border-b border-stone-100 flex items-center justify-between">
            <div>
              {title && (
                <h3 className="font-sans text-[17px] font-bold text-stone-900 tracking-tight">
                  {title}
                </h3>
              )}
              {description && (
                <p className="font-sans text-[12.5px] text-stone-500 mt-0.5">
                  {description}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-stone-400 hover:text-stone-700 p-1.5 rounded-lg hover:bg-stone-100 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5">{children}</div>

          {/* Footer */}
          {footer && (
            <div className="p-4 bg-[#FAF8F5] border-t border-stone-100 flex items-center justify-end gap-3">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Drawer;
