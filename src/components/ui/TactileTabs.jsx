"use client";

import React, { useRef, useState, useLayoutEffect } from 'react';

/**
 * Meridian Tactile Tabs / Segmented Control
 * Features kinetic stretching pill indicator with direction-aware origin.
 */
export function TactileTabs({
  options = [],
  value,
  onChange = () => {},
  size = 'md',
  variant = 'light', // 'light' | 'obsidian'
  className = '',
}) {
  const containerRef = useRef(null);
  const buttonRefs = useRef({});
  const [indicator, setIndicator] = useState({
    left: 0,
    width: 0,
    ready: false,
    stretching: false,
    direction: 'right',
  });
  const [prevVal, setPrevVal] = useState(value);

  const normalizedOptions = options.map((opt) => {
    if (typeof opt === 'string') {
      return { id: opt, label: opt.charAt(0).toUpperCase() + opt.slice(1) };
    }
    return opt;
  });

  useLayoutEffect(() => {
    const activeBtn = buttonRefs.current[value];
    const container = containerRef.current;

    if (activeBtn && container) {
      const containerRect = container.getBoundingClientRect();
      const btnRect = activeBtn.getBoundingClientRect();

      const newLeft = btnRect.left - containerRect.left;
      const newWidth = btnRect.width;

      const prevIdx = normalizedOptions.findIndex((o) => o.id === prevVal);
      const currentIdx = normalizedOptions.findIndex((o) => o.id === value);
      const direction = currentIdx >= prevIdx ? 'left center' : 'right center';
      const isMoving = indicator.ready && value !== prevVal;

      setPrevVal(value);

      if (isMoving) {
        setIndicator({
          left: newLeft,
          width: newWidth,
          ready: true,
          stretching: true,
          direction,
        });

        const timer = setTimeout(() => {
          setIndicator((prev) => ({ ...prev, stretching: false }));
        }, 180);
        return () => clearTimeout(timer);
      } else {
        setIndicator({
          left: newLeft,
          width: newWidth,
          ready: true,
          stretching: false,
          direction,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, normalizedOptions.length]);

  const sizeClasses = {
    sm: { container: 'p-0.5 gap-0.5 h-8', btn: 'px-2.5 py-1 text-[11.5px]' },
    md: { container: 'p-1 gap-1 h-9.5', btn: 'px-3 py-1.5 text-[12.5px]' },
    lg: { container: 'p-1.5 gap-1.5 h-11', btn: 'px-4 py-2 text-[14px]' },
  };

  const sc = sizeClasses[size] || sizeClasses.md;

  const isObsidian = variant === 'obsidian';

  return (
    <div
      ref={containerRef}
      className={`
        relative inline-flex items-center rounded-xl select-none
        ${sc.container}
        ${
          isObsidian
            ? 'bg-[#181A20] border border-white/10'
            : 'bg-[#F4F0E6] border border-[#E7E1D6]'
        }
        ${className}
      `}
    >
      {/* Kinetic Sliding Pill Indicator */}
      {indicator.ready && (
        <div
          style={{
            transform: `translateX(${indicator.left}px) scaleX(${indicator.stretching ? 1.08 : 1})`,
            width: `${indicator.width}px`,
            transformOrigin: indicator.direction,
          }}
          className={`
            absolute top-1 bottom-1 rounded-lg pointer-events-none
            transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]
            ${
              isObsidian
                ? 'bg-[#262A35] text-white shadow-sm border border-white/10'
                : 'bg-white text-stone-900 shadow-[0_2px_8px_-1px_rgba(18,19,22,0.08),0_1px_3px_rgba(18,19,22,0.04)] border border-black/5'
            }
          `}
        />
      )}

      {normalizedOptions.map((opt) => {
        const isActive = opt.id === value;
        return (
          <button
            key={opt.id}
            ref={(el) => (buttonRefs.current[opt.id] = el)}
            type="button"
            onClick={() => onChange(opt.id)}
            className={`
              relative z-10 inline-flex items-center justify-center font-sans font-semibold rounded-lg cursor-pointer
              transition-colors duration-150 ease-[cubic-bezier(0.16,1,0.3,1)]
              ${sc.btn}
              ${
                isActive
                  ? isObsidian
                    ? 'text-white'
                    : 'text-stone-950 font-bold'
                  : isObsidian
                  ? 'text-stone-400 hover:text-stone-200'
                  : 'text-stone-500 hover:text-stone-800'
              }
            `}
          >
            {opt.icon && <span className="mr-1.5">{opt.icon}</span>}
            <span>{opt.label}</span>
            {opt.count !== undefined && (
              <span
                className={`ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                  isActive
                    ? isObsidian
                      ? 'bg-white/20 text-white'
                      : 'bg-stone-100 text-stone-800'
                    : isObsidian
                    ? 'bg-white/10 text-stone-400'
                    : 'bg-stone-200/70 text-stone-600'
                }`}
              >
                {opt.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default TactileTabs;
