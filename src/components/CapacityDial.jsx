"use client"

import React from "react";
import { PASTEL } from "@/Lib/meridianTheme";

export default function CapacityDial({
  value = 68,
  tint = "peach",
  size = 64,
  strokeWidth = 7,
  label = "Allocated"
}) {
  const c = PASTEL[tint] || PASTEL.peach;
  const r = (size - strokeWidth * 2) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (Math.min(Math.max(value, 0), 100) / 100) * circ;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="w-full h-full -rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={c.border}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={c.solid}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(0.16,1,0.3,1)" }}
        />
      </svg>
      <span
        className="stat-number absolute inset-0 flex items-center justify-center text-[13px] font-extrabold"
        style={{ color: c.text }}
      >
        {value}%
      </span>
    </div>
  );
}
