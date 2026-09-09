// Meridian Clarity Pro — Design Tokens, Typography & Health Calculators

export const FONTS = {
  sans: "'Urbanist', 'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
  serif: "'Instrument Serif', Georgia, serif",
  mono: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
};

export const TYPOGRAPHY = {
  // Haute-Horlogerie Tri-Typographic Stack Classes
  hero: "font-serif text-5xl lg:text-6xl leading-[1.08] tracking-[-0.03em]",
  pageTitle: "text-[32px] lg:text-[38px] font-extrabold leading-none tracking-tight text-stone-900",
  pageTitleAccent: "font-serif-italic font-normal text-violet-700",
  sectionHeader: "text-[17px] font-extrabold tracking-tight text-stone-900",
  sectionHeaderAccent: "font-serif-italic font-normal text-stone-500",
  cardHeader: "text-[16px] font-bold text-stone-900 tracking-[-0.015em]",
  subtitle: "mt-1.5 text-[13.5px] font-medium text-stone-500",
  body: "text-[14px] font-medium text-stone-600 leading-relaxed",
  caption: "text-[12px] font-medium text-stone-400",
  kpiStat: "tnum text-[38px] font-extrabold leading-none tracking-tight",
  techBadge: "tech-badge uppercase font-mono text-[10px] font-bold tracking-[0.06em]",
  tnum: "tnum font-variant-numeric: tabular-nums lining-nums",
};

export const PASTEL = {
  lavender: { bg: "#EDE9FE", text: "#6D28D9", border: "#DDD6FE", solid: "#a855f7" },
  peach: { bg: "#FFEDD5", text: "#C2410C", border: "#FDBA74", solid: "#f97316" },
  lime: { bg: "#ECFCCB", text: "#3F6212", border: "#D9F99D", solid: "#84cc16" },
  sky: { bg: "#E0F2FE", text: "#0369A1", border: "#BAE6FD", solid: "#0ea5e9" },
  rose: { bg: "#FFE4E6", text: "#BE123C", border: "#FECDD3", solid: "#f43f5e" },
  mint: { bg: "#DCFCE7", text: "#15803D", border: "#BBF7D0", solid: "#22c55e" },
  gold: { bg: "#FEF9C3", text: "#854D0E", border: "#FEF08A", solid: "#eab308" },
  stone: { bg: "#F1EEE8", text: "#57534e", border: "#E7E1D6", solid: "#78716c" },
};

export const PRIORITY_TINT = {
  Low: "stone",
  Medium: "sky",
  High: "peach",
  Critical: "rose",
};

export const STATUS_META = {
  todo: { label: "To do", tint: "stone" },
  in_progress: { label: "In progress", tint: "peach" },
  in_review: { label: "In review", tint: "sky" },
  done: { label: "Done", tint: "mint" },
};

const STALE_THRESHOLD = 4;

export function taskHealth(task) {
  let daysSinceUpdate = task?.updatedOffsetDays;
  if (daysSinceUpdate === undefined || daysSinceUpdate === null) {
    if (task?.updatedAt) {
      const diffMs = Date.now() - new Date(task.updatedAt).getTime();
      daysSinceUpdate = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
    } else {
      daysSinceUpdate = 1;
    }
  }

  const isDone = task?.status === "done" || task?.status === "ready" || task?.tab === "done";
  const stale = !isDone && daysSinceUpdate >= STALE_THRESHOLD;

  if (isDone) {
    return { kind: "done", stale: false, daysOverdue: 0, daysSinceUpdate, dueLabel: "Done", tint: "mint" };
  }

  let off = task?.dueOffsetDays;
  if (off === null || off === undefined) {
    if (task?.due) {
      const parsed = new Date(task.due);
      if (!isNaN(parsed.getTime())) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        parsed.setHours(0, 0, 0, 0);
        off = Math.round((parsed.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      }
    }
  }

  if (off === null || off === undefined) {
    return { kind: "undated", stale, daysOverdue: 0, daysSinceUpdate, dueLabel: "No date", tint: "stone" };
  }
  if (off < 0) {
    return { kind: "overdue", stale, daysOverdue: -off, daysSinceUpdate, dueLabel: `${-off}d overdue`, tint: "rose" };
  }
  if (off === 0) {
    return { kind: "due-today", stale, daysOverdue: 0, daysSinceUpdate, dueLabel: "Due today", tint: "peach" };
  }
  if (off <= 2) {
    return { kind: "due-soon", stale, daysOverdue: 0, daysSinceUpdate, dueLabel: off === 1 ? "Due tomorrow" : `Due in ${off}d`, tint: "gold" };
  }
  return { kind: "on-track", stale, daysOverdue: 0, daysSinceUpdate, dueLabel: `Due in ${off}d`, tint: "mint" };
}
