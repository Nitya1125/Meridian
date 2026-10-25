"use client";

import React, { useEffect } from 'react';

/**
 * Meridian Kinetic Modal
 * Backdrop blur, scale-fade kinetic choreography, escape & outside-click dismiss.
 */
export function Modal({
  isOpen = false,
  onClose = () => {},
  title = null,
  description = null,
  children,
  footer = null,
  size = 'md', // 'sm' | 'md' | 'lg' | 'xl'
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

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#0F1117]/60 backdrop-blur-md transition-opacity duration-200 animate-in fade-in"
      />

      {/* Modal Surface */}
      <div
        className={`
          relative w-full bg-white rounded-[24px] border border-stone-200/80
          shadow-[0_24px_48px_-12px_rgba(18,19,22,0.25)] overflow-hidden z-10
          transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]
          animate-in zoom-in-95 fade-in
          ${sizeClasses[size] || sizeClasses.md}
          ${className}
        `}
      >
        {/* Header */}
        {(title || description) && (
          <div className="px-6 pt-6 pb-4 border-b border-stone-100 flex items-start justify-between">
            <div>
              {title && (
                <h3 className="font-sans text-[18px] font-bold text-stone-900 tracking-tight">
                  {title}
                </h3>
              )}
              {description && (
                <p className="font-sans text-[13px] text-stone-500 mt-1">
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
        )}

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(85vh-140px)]">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 bg-[#FAF8F5] border-t border-stone-100 flex items-center justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export default Modal;
