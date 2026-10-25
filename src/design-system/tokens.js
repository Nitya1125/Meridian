// ==============================================================================
// MERIDIAN DESIGN SYSTEM — CORE TOKENS & FOUNDATIONS
// Conforms to Figma Foundations (Node 1:2) & DESIGN.md (MERIDIAN-KINETIC-2.0)
// ==============================================================================

/**
 * 1. PRIMITIVE COLOR RAMPS (from Figma Foundations Board)
 * Direct alias references; do not apply directly to components unless creating a token.
 */
export const PRIMITIVES = {
  slate: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
  },
  indigo: {
    50: '#EEF2FF',
    100: '#E0E7FF',
    200: '#C7D2FE',
    300: '#A5B4FC',
    400: '#818CF8',
    500: '#6366F1',
    600: '#4F46E5',
    700: '#4338CA',
    900: '#312E81',
  },
  violet: {
    50: '#F5F3FF',
    100: '#EDE9FE',
    300: '#C4B5FD',
    500: '#8B5CF6',
    600: '#7C3AED',
    700: '#6D28D9',
    900: '#4C1D95',
  },
  emerald: {
    50: '#ECFDF5',
    100: '#D1FAE5',
    300: '#6EE7B7',
    500: '#10B981',
    600: '#059669',
    700: '#047857',
    900: '#064E3B',
  },
  amber: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    300: '#FCD34D',
    500: '#F59E0B',
    600: '#D97706',
    700: '#B45309',
    900: '#78350F',
  },
  rose: {
    50: '#FFF1F2',
    100: '#FFE4E6',
    200: '#FECDD3',
    300: '#FDA4AF',
    500: '#F43F5E',
    600: '#E11D48',
    700: '#BE123C',
    900: '#881337',
  },
  sky: {
    50: '#F0F9FF',
    100: '#E0F2FE',
    300: '#7DD3FC',
    500: '#0EA5E9',
    600: '#0284C7',
    700: '#0369A1',
    900: '#0C4A6E',
  },
  orange: {
    50: '#FFF7ED',
    100: '#FFEDD5',
    300: '#FDBA74',
    500: '#F97316',
    600: '#EA580C',
    700: '#C2410C',
    900: '#7C2D12',
  },
  teal: {
    50: '#F0FDFA',
    100: '#CCFBF1',
    300: '#5EEAD4',
    500: '#14B8A6',
    600: '#0D9488',
    700: '#0F766E',
    900: '#134E4A',
  },
};

/**
 * 2. SIGNATURE PASTEL ECOSYSTEM (DESIGN.md Section 3)
 * Every pastel pairing satisfies WCAG AA (>= 4.5:1 contrast).
 */
export const PASTELS = {
  lavender: {
    name: 'Lavender',
    bg: '#EDE9FE',
    text: '#6D28D9',
    border: '#DDD6FE',
    solid: '#8B5CF6',
    hoverBg: '#E4DEFD',
  },
  peach: {
    name: 'Peach / Amber',
    bg: '#FFEDD5',
    text: '#C2410C',
    border: '#FDBA74',
    solid: '#F97316',
    hoverBg: '#FFE3C2',
  },
  lime: {
    name: 'Spring Lime',
    bg: '#ECFCCB',
    text: '#3F6212',
    border: '#D9F99D',
    solid: '#84CC16',
    hoverBg: '#E2F9B8',
  },
  sky: {
    name: 'Arctic Sky',
    bg: '#E0F2FE',
    text: '#0369A1',
    border: '#BAE6FD',
    solid: '#0EA5E9',
    hoverBg: '#D0ECFD',
  },
  rose: {
    name: 'Editorial Rose',
    bg: '#FFE4E6',
    text: '#BE123C',
    border: '#FECDD3',
    solid: '#F43F5E',
    hoverBg: '#FFD7DC',
  },
  mint: {
    name: 'Mint Emerald',
    bg: '#DCFCE7',
    text: '#15803D',
    border: '#BBF7D0',
    solid: '#10B981',
    hoverBg: '#CEF9DC',
  },
  gold: {
    name: 'Solar Gold',
    bg: '#FEF9C3',
    text: '#854D0E',
    border: '#FEF08A',
    solid: '#EAB308',
    hoverBg: '#FEF5A7',
  },
  stone: {
    name: 'Warm Stone',
    bg: '#F1EEE8',
    text: '#57534E',
    border: '#E7E1D6',
    solid: '#78716C',
    hoverBg: '#E8E3D9',
  },
  obsidian: {
    name: 'Dark Obsidian',
    bg: '#111318',
    text: '#FFFFFF',
    border: 'rgba(255, 255, 255, 0.12)',
    solid: '#1C1917',
    hoverBg: '#1B1E26',
  },
};

/**
 * 3. SEMANTIC CANVAS & SURFACES (Figma Foundations + DESIGN.md Section 2)
 */
export const SURFACES = {
  canvas: {
    primary: '#FAF8F5',   // Primary warm linen backdrop
    subtle: '#F4F0E6',    // Wells, tracks, secondary sidebars
    warm: '#F8F6F0',      // Pill wells, inactive tracks
  },
  tile: {
    bg: '#FFFFFF',
    border: 'rgba(0, 0, 0, 0.06)',
    borderStrong: 'rgba(0, 0, 0, 0.12)',
  },
  obsidian: {
    bg: '#111318',
    border: 'rgba(255, 255, 255, 0.12)',
    glow: 'rgba(0, 0, 0, 0.45)',
  },
};

/**
 * 4. STATUS TOKENS (Figma Foundations)
 */
export const STATUS_TOKENS = {
  success: {
    bg: '#ECFDF5',
    text: '#047857',
    border: '#A7F3D0',
    solid: '#10B981',
    label: 'Done',
  },
  warning: {
    bg: '#FFFBEB',
    text: '#B45309',
    border: '#FDE68A',
    solid: '#F59E0B',
    label: 'In Progress',
  },
  danger: {
    bg: '#FFF1F2',
    text: '#BE123C',
    border: '#FECDD3',
    solid: '#F43F5E',
    label: 'Blocked',
  },
  info: {
    bg: '#EFF6FF',
    text: '#1D4ED8',
    border: '#BFDBFE',
    solid: '#3B82F6',
    label: 'In Review',
  },
};

/**
 * 5. PRIORITY TOKENS (Figma Foundations: priority/*)
 */
export const PRIORITY_TOKENS = {
  critical: {
    label: 'Critical',
    bg: '#FFF1F2',
    text: '#BE123C',
    border: '#FECDD3',
    dot: '#E11D48',
    glow: 'rgba(225, 29, 72, 0.4)',
  },
  high: {
    label: 'High',
    bg: '#FFEDD5',
    text: '#C2410C',
    border: '#FDBA74',
    dot: '#F97316',
    glow: 'rgba(249, 115, 22, 0.4)',
  },
  medium: {
    label: 'Medium',
    bg: '#E0F2FE',
    text: '#0369A1',
    border: '#BAE6FD',
    dot: '#0EA5E9',
    glow: 'rgba(14, 165, 233, 0.35)',
  },
  low: {
    label: 'Low',
    bg: '#F1F5F9',
    text: '#475569',
    border: '#CBD5E1',
    dot: '#94A3B8',
    glow: 'rgba(148, 163, 184, 0.3)',
  },
};

/**
 * 6. DOMAIN TAG TOKENS (Figma Foundations: tag/*)
 */
export const TAG_TOKENS = {
  auth: {
    label: 'Auth',
    bg: '#EDE9FE',
    text: '#6D28D9',
    border: '#DDD6FE',
  },
  backend: {
    label: 'Backend',
    bg: '#E0E7FF',
    text: '#4338CA',
    border: '#C7D2FE',
  },
  frontend: {
    label: 'Frontend',
    bg: '#E0F2FE',
    text: '#0369A1',
    border: '#BAE6FD',
  },
  design: {
    label: 'Design',
    bg: '#FCE7F3',
    text: '#BE185D',
    border: '#FBCFE8',
  },
  payments: {
    label: 'Payments',
    bg: '#DCFCE7',
    text: '#15803D',
    border: '#BBF7D0',
  },
  security: {
    label: 'Security',
    bg: '#FEF3C7',
    text: '#B45309',
    border: '#FDE68A',
  },
  mobile: {
    label: 'Mobile',
    bg: '#FFEDD5',
    text: '#C2410C',
    border: '#FDBA74',
  },
  infra: {
    label: 'Infra',
    bg: '#CCFBF1',
    text: '#0F766E',
    border: '#99F6E4',
  },
  testing: {
    label: 'Testing',
    bg: '#F1F5F9',
    text: '#334155',
    border: '#CBD5E1',
  },
};

/**
 * 7. SPACING SCALE (Figma Foundations: Section / Spacing)
 * 4px base increment
 */
export const SPACING = {
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
};

/**
 * 8. RADIUS SCALE (Figma Foundations: Section / Radius)
 */
export const RADIUS = {
  none: '0px',
  sm: '6px',     // Chips, tags, small badges
  md: '8px',     // Inputs, buttons (sm/md)
  lg: '12px',    // Standard buttons, small cards
  xl: '16px',    // Bento tiles, standard cards
  '2xl': '20px', // Modals, major panels, kanban columns
  '3xl': '24px', // Signature bento cards
  full: '9999px',// Pills, dynamic island, avatars
};

/**
 * 9. ELEVATION & SHADOW PHYSICS (Figma Foundations + DESIGN.md Section 5)
 */
export const ELEVATION = {
  xs: '0 1px 2px rgba(18, 19, 22, 0.04)',
  sm: '0 2px 6px -1px rgba(18, 19, 22, 0.05), 0 1px 3px rgba(18, 19, 22, 0.03)',
  md: '0 4px 16px -2px rgba(18, 19, 22, 0.06), 0 2px 6px -1px rgba(18, 19, 22, 0.03)',
  lg: '0 14px 32px -4px rgba(18, 19, 22, 0.08), 0 4px 12px -2px rgba(18, 19, 22, 0.04)',
  obsidian: '0 20px 40px -8px rgba(0, 0, 0, 0.45), 0 4px 12px rgba(0, 0, 0, 0.2)',
  focusRing: '0 0 0 3px rgba(99, 102, 241, 0.25)',
};

/**
 * 10. TYPOGRAPHY CLASS DICTIONARY
 * Implements the haute-horlogerie tri-typographic stack
 */
export const TYPOGRAPHY = {
  hero: "font-serif text-5xl lg:text-6xl leading-[1.08] tracking-[-0.03em]",
  pageTitle: "font-sans text-[32px] lg:text-[38px] font-extrabold leading-none tracking-tight text-stone-900",
  pageTitleAccent: "font-serif italic font-normal text-violet-700",
  sectionHeader: "font-sans text-[17px] font-extrabold tracking-tight text-stone-900",
  sectionHeaderAccent: "font-serif italic font-normal text-stone-500",
  cardHeader: "font-sans text-[16px] font-bold text-stone-900 tracking-[-0.015em]",
  subtitle: "font-sans text-[13.5px] font-medium text-stone-500",
  body: "font-sans text-[14px] font-medium text-stone-600 leading-relaxed",
  bodySm: "font-sans text-[13px] font-normal text-stone-500 leading-normal",
  caption: "font-sans text-[12px] font-medium text-stone-400",
  overline: "font-sans text-[11px] font-bold tracking-[0.08em] uppercase text-stone-500",
  kpiStat: "font-sans font-extrabold text-[36px] lg:text-[42px] leading-none tracking-tight tabular-nums",
  techBadge: "font-mono text-[10px] font-bold tracking-[0.06em] uppercase",
  monoSm: "font-mono text-[12px] font-medium text-stone-500",
};

/**
 * 11. KINETIC MOTION SPECS (DESIGN.md Section 7)
 */
export const MOTION = {
  ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
  duration: {
    fast: '150ms',
    normal: '240ms',
    smooth: '380ms',
    pulse: '2500ms',
  },
};
