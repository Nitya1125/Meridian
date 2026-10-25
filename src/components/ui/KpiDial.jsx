"use client";

import React from 'react';
import Card from './Card';
import Badge from './Badge';

/**
 * Meridian Telemetry KPI Dial Card
 * Precision tabular telemetry counter with delta percentage badge and spark column meters.
 */
export function KpiDial({
  label = 'Total Completed',
  value = '1,482',
  delta = '+18.4%',
  deltaPositive = true,
  tint = 'purple', // 'purple' | 'amber' | 'sky' | 'lime' | 'rose'
  subtitle = 'vs. last sprint cycle',
  sparkData = [35, 60, 45, 80, 50, 95, 75],
  days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
  className = '',
  ...props
}) {
  const tintConfigs = {
    purple: { bar: '#8B5CF6', hoverBar: '#7C3AED', badge: 'lavender' },
    amber: { bar: '#F59E0B', hoverBar: '#D97706', badge: 'peach' },
    sky: { bar: '#0EA5E9', hoverBar: '#0284C7', badge: 'sky' },
    lime: { bar: '#84CC16', hoverBar: '#65A30D', badge: 'lime' },
    rose: { bar: '#F43F5E', hoverBar: '#E11D48', badge: 'rose' },
  };

  const cfg = tintConfigs[tint] || tintConfigs.purple;

  return (
    <Card variant="default" padding="lg" className={`w-full ${className}`} {...props}>
      <div className="flex items-center justify-between">
        <span className="font-sans text-[11px] font-bold tracking-[0.08em] uppercase text-stone-500">
          {label}
        </span>
        {delta && (
          <Badge
            tint={cfg.badge}
            size="sm"
            className="font-mono font-bold"
          >
            {delta}
          </Badge>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="font-sans font-extrabold text-[34px] lg:text-[38px] text-stone-900 leading-none tracking-tight tabular-nums">
          {value}
        </span>
      </div>

      {subtitle && (
        <p className="mt-1 font-sans text-[12px] text-stone-400">{subtitle}</p>
      )}

      {sparkData && sparkData.length > 0 && (
        <div className="mt-5 pt-4 border-t border-stone-100">
          <div className="flex items-end justify-between h-14 gap-1.5">
            {sparkData.map((val, idx) => (
              <div
                key={idx}
                className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group cursor-pointer"
              >
                <div
                  style={{
                    height: `${val}%`,
                    backgroundColor: cfg.bar,
                  }}
                  className="w-full max-w-[14px] rounded-t-sm transition-all duration-300 group-hover:scale-y-105 opacity-80 group-hover:opacity-100"
                />
                <span className="text-[10px] font-mono font-medium text-stone-400 group-hover:text-stone-700">
                  {days[idx % days.length]}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}

export default KpiDial;
