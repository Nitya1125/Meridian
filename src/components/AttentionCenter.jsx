"use client"

import React, { useState } from "react";
import {
  AlarmClock,
  MoonStar,
  Check,
  Bell,
  CalendarClock,
  ChevronDown,
  PartyPopper,
  ArrowRight
} from "lucide-react";
import { PASTEL, taskHealth } from "@/Lib/meridianTheme";

export default function AttentionCenter({
  tasks = [],
  onOpenTask,
  onReschedule,
  onMarkDone,
  onCaughtUp,
  onNudge,
  sprintName = "Sprint 24",
  sprintDaysLeft = 4
}) {
  const [filter, setFilter] = useState("all");
  const [menuFor, setMenuFor] = useState(null);

  const enriched = tasks
    .map((t) => ({ t, h: taskHealth(t) }))
    .filter(({ h }) => h.kind === "overdue" || h.stale);

  const overdue = enriched.filter(({ h }) => h.kind === "overdue");
  const stale = enriched.filter(({ h }) => h.kind !== "overdue" && h.stale);

  const shown =
    filter === "overdue"
      ? overdue
      : filter === "stale"
      ? stale
      : [...overdue, ...stale];

  const atRisk = overdue.length > 0;

  return (
    <div className="bento-card overflow-hidden">
      {/* Header — sprint risk context */}
      <div
        className="relative overflow-hidden px-6 pt-6 pb-5 transition-all duration-500"
        style={{
          background: atRisk
            ? "linear-gradient(120deg, #FFE4E6 0%, #FFEDD5 100%)"
            : "linear-gradient(120deg, #DCFCE7 0%, #ECFCCB 100%)",
        }}
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span
              className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/80 backdrop-blur shadow-2xs"
            >
              {atRisk ? (
                <AlarmClock className="h-6 w-6 text-rose-600" strokeWidth={2.2} />
              ) : (
                <PartyPopper className="h-6 w-6 text-lime-700" strokeWidth={2.2} />
              )}
            </span>
            <div>
              <h2 className="text-[19px] font-extrabold tracking-tight text-stone-900 leading-tight">
                {atRisk ? (
                  <>
                    Needs <span className="font-serif italic font-normal text-rose-700">attention</span>
                  </>
                ) : (
                  <>
                    All <span className="font-serif italic font-normal text-lime-800">clear</span>
                  </>
                )}
              </h2>
              <p className="mt-0.5 text-[12.5px] font-semibold text-stone-600">
                {sprintName} · {sprintDaysLeft} days left
                {atRisk
                  ? ` · ${overdue.length} overdue, ${stale.length} gone quiet`
                  : " · sprint on track, zero blockers"}
              </p>
            </div>
          </div>

          {enriched.length > 0 && (
            <span className="tnum stat-number flex h-8 items-center gap-1.5 rounded-full bg-white/80 px-3.5 text-[12px] font-extrabold text-stone-800 backdrop-blur shadow-2xs">
              <span
                className={
                  atRisk
                    ? "beacon inline-block h-2 w-2 rounded-full bg-rose-500"
                    : "inline-block h-2 w-2 rounded-full bg-lime-500"
                }
              />
              {enriched.length} to resolve
            </span>
          )}
        </div>

        {enriched.length > 0 && (
          <div className="mt-4 inline-flex rounded-full bg-white/70 p-1 backdrop-blur shadow-2xs">
            {[
              ["all", `All (${enriched.length})`],
              ["overdue", `Overdue (${overdue.length})`],
              ["stale", `Quiet (${stale.length})`],
            ].map(([f, label]) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`tactile rounded-full px-3.5 py-1.5 text-[12px] font-extrabold transition-all cursor-pointer ${
                  filter === f
                    ? "bg-white text-stone-900 shadow-xs"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Rows */}
      <div className="p-3">
        {shown.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-10 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-lime-100 text-lime-700">
              <Check className="h-6 w-6" strokeWidth={2.6} />
            </span>
            <p className="text-[14px] font-extrabold text-stone-900">
              Nothing {filter === "stale" ? "gone quiet" : filter === "overdue" ? "overdue" : "needs attention"}
            </p>
            <p className="text-[12.5px] font-medium text-stone-500">
              Everything in this view is active or resolved. Ship with confidence.
            </p>
          </div>
        ) : (
          <div className="space-y-1.5">
            {shown.map(({ t, h }) => {
              const od = h.kind === "overdue";
              const c = od ? PASTEL.rose : PASTEL.gold;
              const leadName = t.assigneeName || t.assignees?.[0]?.name || "Lead";
              const leadInitial = leadName[0] || "U";

              return (
                <div
                  key={t.id}
                  className="attn-row group flex flex-col gap-3 rounded-2xl border border-transparent p-3 transition-colors hover:border-stone-200/60 hover:bg-stone-50/80 sm:flex-row sm:items-center"
                >
                  {/* Status glyph */}
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                    style={{
                      background: c.bg,
                      color: c.text,
                      border: `1px solid ${c.border}`,
                    }}
                  >
                    {od ? (
                      <AlarmClock className="h-[18px] w-[18px] beacon rounded-full" strokeWidth={2.2} />
                    ) : (
                      <MoonStar className="h-[18px] w-[18px]" strokeWidth={2.2} />
                    )}
                  </span>

                  {/* Task details */}
                  <button
                    type="button"
                    onClick={() => onOpenTask && onOpenTask(t)}
                    className="tactile min-w-0 flex-1 text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <span className="tech-badge text-[9px] text-stone-400">
                        {t.taskId || t.code || "TASK"}
                      </span>
                      <span
                        className="tnum stat-number rounded-full px-2 py-0.5 text-[10px] font-extrabold"
                        style={{ background: c.bg, color: c.text }}
                      >
                        {od ? `${h.daysOverdue}d overdue` : `Quiet ${h.daysSinceUpdate}d`}
                      </span>
                    </div>
                    <div className="mt-0.5 truncate text-[13.5px] font-bold text-stone-900 group-hover:text-violet-700 transition-colors">
                      {t.title}
                    </div>
                    <div className="mt-0.5 text-[11.5px] font-medium text-stone-500">
                      {od
                        ? `Was due ${h.daysOverdue}d ago · sitting in ${t.status || t.tab || "todo"}`
                        : `No update in ${h.daysSinceUpdate} days · sitting in ${t.status || t.tab || "todo"}`}
                    </div>
                  </button>

                  {/* Assignee pill */}
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-2xs shrink-0"
                    style={{ background: t.color || "#8b5cf6" }}
                    title={leadName}
                  >
                    {leadInitial}
                  </div>

                  {/* Actions */}
                  <div className="flex shrink-0 items-center gap-1.5">
                    {od ? (
                      <>
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setMenuFor((m) => (m === t.id ? null : t.id))}
                            className="tactile flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-[12px] font-extrabold text-stone-700 border border-stone-200 shadow-2xs hover:bg-stone-50 cursor-pointer"
                          >
                            <CalendarClock className="h-3.5 w-3.5 text-stone-500" strokeWidth={2.2} />
                            <span>Reschedule</span>
                            <ChevronDown className="h-3 w-3 text-stone-400" strokeWidth={2.6} />
                          </button>

                          {menuFor === t.id && (
                            <>
                              <div
                                className="fixed inset-0 z-20"
                                onClick={() => setMenuFor(null)}
                              />
                              <div
                                className="palette-in absolute right-0 z-30 mt-1.5 w-44 rounded-2xl bg-white p-1.5 border border-stone-200/80 shadow-xl"
                              >
                                {[
                                  ["Tomorrow", 1],
                                  ["In 3 days", 3],
                                  ["Next week", 7],
                                ].map(([label, d]) => (
                                  <button
                                    key={label}
                                    type="button"
                                    onClick={() => {
                                      onReschedule && onReschedule(t.id, d);
                                      setMenuFor(null);
                                    }}
                                    className="tactile flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-[12.5px] font-bold text-stone-700 hover:bg-stone-100 cursor-pointer"
                                  >
                                    <span>{label}</span>
                                    <ArrowRight className="h-3.5 w-3.5 text-stone-400" strokeWidth={2.2} />
                                  </button>
                                ))}
                              </div>
                            </>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => onNudge && onNudge(t.id)}
                          className="tactile flex h-8 w-8 items-center justify-center rounded-full bg-white text-stone-500 hover:text-stone-900 border border-stone-200 shadow-2xs hover:bg-stone-50 cursor-pointer"
                          title="Nudge assignee"
                        >
                          <Bell className="h-[15px] w-[15px]" strokeWidth={2.2} />
                        </button>

                        <button
                          type="button"
                          onClick={() => onMarkDone && onMarkDone(t.id)}
                          className="tactile flex items-center gap-1 rounded-full bg-[#111318] px-3.5 py-1.5 text-[12px] font-extrabold text-white shadow-xs hover:bg-black cursor-pointer"
                        >
                          <Check className="h-3.5 w-3.5" strokeWidth={2.8} />
                          <span>Done</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => onNudge && onNudge(t.id)}
                          className="tactile flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-[12px] font-extrabold text-stone-700 border border-stone-200 shadow-2xs hover:bg-stone-50 cursor-pointer"
                        >
                          <Bell className="h-3.5 w-3.5 text-stone-500" strokeWidth={2.2} />
                          <span>Nudge</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onCaughtUp && onCaughtUp(t.id)}
                          className="tactile flex items-center gap-1 rounded-full bg-[#111318] px-3.5 py-1.5 text-[12px] font-extrabold text-white shadow-xs hover:bg-black cursor-pointer"
                        >
                          <Check className="h-3.5 w-3.5" strokeWidth={2.8} />
                          <span>Caught up</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
