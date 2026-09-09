"use client"

import React, { useState } from "react";
import { PASTEL } from "@/Lib/meridianTheme";

const defaultWeeklyHours = [
  { day: "Mon", v: 14 },
  { day: "Tue", v: 22 },
  { day: "Wed", v: 36 },
  { day: "Thu", v: 28 },
  { day: "Fri", v: 42 },
  { day: "Sat", v: 18 },
  { day: "Sun", v: 12 },
];

export default function MetricBars({
  tint = "lime",
  highlight = 4,
  data = defaultWeeklyHours,
  unit = "h"
}) {
  const [hover, setHover] = useState(null);
  const c = PASTEL[tint] || PASTEL.lime;
  const max = Math.max(...data.map((d) => d.v), 1);

  return (
    <div className="flex h-16 items-end gap-1.5 pt-4">
      {data.map((d, i) => {
        const active = hover === i || (hover === null && i === highlight);

        return (
          <div
            key={d.day}
            className="group relative flex flex-1 flex-col items-center gap-1 cursor-pointer"
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
          >
            {active && (
              <div className="stat-number absolute -top-5 z-10 rounded-md bg-[#111318] px-1.5 py-0.5 text-[9px] font-bold text-white shadow-md whitespace-nowrap">
                {d.v}{unit}
              </div>
            )}
            <div className="flex h-10 w-full items-end">
              <div
                className="bar-grow w-full rounded-md transition-all duration-200"
                style={{
                  height: `${Math.max((d.v / max) * 100, 15)}%`,
                  background: active ? c.solid : c.border,
                  animationDelay: `${i * 45}ms`,
                }}
              />
            </div>
            <span className="text-[9px] font-bold text-stone-400 font-mono">{d.day[0]}</span>
          </div>
        );
      })}
    </div>
  );
}
