"use client"

import React from 'react';

const I = ({ size = 18, className = '', strokeWidth = 1.75, children }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`inline-block shrink-0 transition-transform ${className}`}
  >
    {children}
  </svg>
);

// Bespoke Luxury Icon Suite
export const HomeIcon = (p) => (
  <I {...p}>
    <path d="M3 10.5 12 3l9 7.5v10a1.5 1.5 0 0 1-1.5 1.5H4.5A1.5 1.5 0 0 1 3 20.5v-10z" />
    <path d="M9 22v-7a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v7" />
  </I>
);

export const FolderIcon = (p) => (
  <I {...p}>
    <path d="M2.5 7.5A2.5 2.5 0 0 1 5 5h3.8a2.5 2.5 0 0 1 1.77.73L12 7.2h7A2.5 2.5 0 0 1 21.5 9.7v8.8a2.5 2.5 0 0 1-2.5 2.5H5a2.5 2.5 0 0 1-2.5-2.5V7.5z" />
  </I>
);

export const GridIcon = (p) => (
  <I {...p}>
    <rect x="3.5" y="3.5" width="7" height="7" rx="2" />
    <rect x="13.5" y="3.5" width="7" height="7" rx="2" />
    <rect x="13.5" y="13.5" width="7" height="7" rx="2" />
    <rect x="3.5" y="13.5" width="7" height="7" rx="2" />
  </I>
);

export const BarChartIcon = (p) => (
  <I {...p}>
    <path d="M12 20V9" />
    <path d="M18 20V4" />
    <path d="M6 20v-5" />
    <circle cx="12" cy="6" r="1" fill="currentColor" />
    <circle cx="18" cy="2.5" r="1" fill="currentColor" />
    <circle cx="6" cy="12.5" r="1" fill="currentColor" />
  </I>
);

export const UsersIcon = (p) => (
  <I {...p}>
    <circle cx="9" cy="7.5" r="3.5" />
    <path d="M2.5 19.5a6.5 6.5 0 0 1 13 0" />
    <path d="M16 4.5a3.5 3.5 0 0 1 0 6.5" />
    <path d="M21.5 19.5a6.5 6.5 0 0 0-4.5-5.5" />
  </I>
);

export const MessageIcon = (p) => (
  <I {...p}>
    <path d="M21 13.5a6.5 6.5 0 0 1-6.5 6.5H6.8l-3.3 2v-8.5A6.5 6.5 0 0 1 10 7h4.5A6.5 6.5 0 0 1 21 13.5z" />
    <circle cx="9" cy="13.5" r="1" fill="currentColor" />
    <circle cx="13.5" cy="13.5" r="1" fill="currentColor" />
    <circle cx="17.5" cy="13.5" r="1" fill="currentColor" />
  </I>
);

export const CreditCardIcon = (p) => (
  <I {...p}>
    <rect x="2" y="5" width="20" height="14" rx="3" />
    <line x1="2" y1="10" x2="22" y2="10" />
    <circle cx="6.5" cy="15" r="1.5" fill="currentColor" />
    <circle cx="10.5" cy="15" r="1.5" />
  </I>
);

export const SettingsIcon = (p) => (
  <I {...p}>
    <circle cx="12" cy="12" r="3.5" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </I>
);

export const BellIcon = (p) => (
  <I {...p}>
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    <circle cx="17.5" cy="5.5" r="2.5" fill="#f43f5e" stroke="white" strokeWidth="1" />
  </I>
);

export const PlusIcon = (p) => (
  <I {...p}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </I>
);

export const SearchIcon = (p) => (
  <I {...p}>
    <circle cx="11" cy="11" r="7.5" />
    <line x1="21" y1="21" x2="16.3" y2="16.3" />
  </I>
);

export const ChevronDownIcon = (p) => (
  <I {...p}>
    <polyline points="6 9 12 15 18 9" />
  </I>
);

export const ChevronRightIcon = (p) => (
  <I {...p}>
    <polyline points="9 18 15 12 9 6" />
  </I>
);

export const ChevronLeftIcon = (p) => (
  <I {...p}>
    <polyline points="15 18 9 12 15 6" />
  </I>
);

export const TrendingUpIcon = (p) => (
  <I {...p}>
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </I>
);

export const CheckIcon = (p) => (
  <I {...p}>
    <polyline points="20 6 9 17 4 12" />
  </I>
);

export const CheckDoubleIcon = (p) => (
  <I {...p}>
    <path d="m18 6-8.5 8.5L5 10" />
    <path d="m22 10-8.5 8.5L11 16" />
  </I>
);

export const ClockIcon = (p) => (
  <I {...p}>
    <circle cx="12" cy="12" r="9.5" />
    <polyline points="12 6.5 12 12 15.5 14" />
  </I>
);

export const AlertIcon = (p) => (
  <I {...p}>
    <circle cx="12" cy="12" r="9.5" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <circle cx="12" cy="16" r="0.75" fill="currentColor" />
  </I>
);

export const CalendarIcon = (p) => (
  <I {...p}>
    <rect x="3" y="4" width="18" height="17" rx="3" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="9.5" x2="21" y2="9.5" />
    <circle cx="8" cy="14" r="1" fill="currentColor" />
    <circle cx="12" cy="14" r="1" fill="currentColor" />
    <circle cx="16" cy="14" r="1" fill="currentColor" />
  </I>
);

export const ZapIcon = (p) => (
  <I {...p}>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="currentColor" fillOpacity="0.15" />
  </I>
);

export const StarIcon = (p) => (
  <I {...p}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </I>
);

export const AttachIcon = (p) => (
  <I {...p}>
    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
  </I>
);

export const SmileIcon = (p) => (
  <I {...p}>
    <circle cx="12" cy="12" r="9.5" />
    <path d="M8 14s1.5 2.5 4 2.5 4-2.5 4-2.5" />
    <circle cx="9" cy="9.5" r="1" fill="currentColor" />
    <circle cx="15" cy="9.5" r="1" fill="currentColor" />
  </I>
);

export const SendIcon = (p) => (
  <I {...p}>
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </I>
);

export const HashIcon = (p) => (
  <I {...p}>
    <line x1="4" y1="9" x2="20" y2="9" />
    <line x1="4" y1="15" x2="20" y2="15" />
    <line x1="10" y1="3" x2="8" y2="21" />
    <line x1="16" y1="3" x2="14" y2="21" />
  </I>
);

export const LockIcon = (p) => (
  <I {...p}>
    <rect x="3.5" y="10.5" width="17" height="11" rx="2.5" />
    <path d="M7 10.5V7a5 5 0 0 1 10 0v3.5" />
  </I>
);

export const UserIcon = (p) => (
  <I {...p}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </I>
);

export const MoreHorizontalIcon = (p) => (
  <I {...p}>
    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    <circle cx="19" cy="12" r="1.5" fill="currentColor" />
    <circle cx="5" cy="12" r="1.5" fill="currentColor" />
  </I>
);

export const FilterIcon = (p) => (
  <I {...p}>
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </I>
);

export const DownloadIcon = (p) => (
  <I {...p}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </I>
);

export const TagIcon = (p) => (
  <I {...p}>
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
    <circle cx="7" cy="7" r="1.5" fill="currentColor" />
  </I>
);

export const ActivityIcon = (p) => (
  <I {...p}>
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </I>
);

export const ShieldIcon = (p) => (
  <I {...p}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </I>
);

export const ShareIcon = (p) => (
  <I {...p}>
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </I>
);

export const SortIcon = (p) => (
  <I {...p}>
    <line x1="4" y1="6" x2="14" y2="6" />
    <line x1="4" y1="12" x2="11" y2="12" />
    <line x1="4" y1="18" x2="8" y2="18" />
    <polyline points="17 14 20 17 23 14" />
    <line x1="20" y1="7" x2="20" y2="17" />
  </I>
);

export const ArrowUpRightIcon = (p) => (
  <I {...p}>
    <line x1="7" y1="17" x2="17" y2="7" />
    <polyline points="7 7 17 7 17 17" />
  </I>
);

export const ArrowRightIcon = (p) => (
  <I {...p}>
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </I>
);

export const SparklesIcon = (p) => (
  <I {...p}>
    <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3z" fill="currentColor" fillOpacity="0.2" />
  </I>
);

export const MicIcon = (p) => (
  <I {...p}>
    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line x1="12" y1="19" x2="12" y2="22" />
  </I>
);

export const VideoIcon = (p) => (
  <I {...p}>
    <polygon points="23 7 16 12 23 17 23 7" />
    <rect x="1" y="5" width="15" height="14" rx="3" />
  </I>
);

export const PhoneIcon = (p) => (
  <I {...p}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </I>
);

export const CheckCircleIcon = (p) => (
  <I {...p}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </I>
);

export const SlidersIcon = (p) => (
  <I {...p}>
    <line x1="4" y1="21" x2="4" y2="14" />
    <line x1="4" y1="10" x2="4" y2="3" />
    <line x1="12" y1="21" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12" y2="3" />
    <line x1="20" y1="21" x2="20" y2="16" />
    <line x1="20" y1="12" x2="20" y2="3" />
    <line x1="1" y1="14" x2="7" y2="14" />
    <line x1="9" y1="8" x2="15" y2="8" />
    <line x1="17" y1="16" x2="23" y2="16" />
  </I>
);

export const TrashIcon = (p) => (
  <I {...p}>
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </I>
);

// ── Additional Bespoke Luxury Replacement Icons (Zero Emojis) ──

export const ClipboardIcon = (p) => (
  <I {...p}>
    <rect x="8" y="2" width="8" height="4" rx="1" />
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <line x1="9" y1="12" x2="15" y2="12" />
    <line x1="9" y1="16" x2="13" y2="16" />
  </I>
);

export const TargetIcon = (p) => (
  <I {...p}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="5" />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
  </I>
);

export const RocketIcon = (p) => (
  <I {...p}>
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
    <path d="M9 12H4s.55-3.03 2-4.5c1.62-1.63 5-2.5 5-2.5" />
    <path d="M12 15v5s3.03-.55 4.5-2c1.63-1.62 2.5-5 2.5-5" />
  </I>
);

export const PackageIcon = (p) => (
  <I {...p}>
    <path d="m16.5 9.4-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </I>
);

export const PaletteIcon = (p) => (
  <I {...p}>
    <circle cx="13.5" cy="6.5" r="1" fill="currentColor" />
    <circle cx="17.5" cy="10.5" r="1" fill="currentColor" />
    <circle cx="8.5" cy="7.5" r="1" fill="currentColor" />
    <circle cx="6.5" cy="12.5" r="1" fill="currentColor" />
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.92 0 1.5-.58 1.5-1.5 0-.41-.17-.82-.41-1.12-.24-.31-.41-.71-.41-1.13 0-1.1.9-2 2-2h1.82c3.04 0 5.5-2.46 5.5-5.5 0-5.5-4.5-8.75-10-8.75z" />
  </I>
);

export const CodeIcon = (p) => (
  <I {...p}>
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </I>
);

export const GripVerticalIcon = (p) => (
  <I {...p}>
    <circle cx="9" cy="12" r="1.25" fill="currentColor" />
    <circle cx="9" cy="5" r="1.25" fill="currentColor" />
    <circle cx="9" cy="19" r="1.25" fill="currentColor" />
    <circle cx="15" cy="12" r="1.25" fill="currentColor" />
    <circle cx="15" cy="5" r="1.25" fill="currentColor" />
    <circle cx="15" cy="19" r="1.25" fill="currentColor" />
  </I>
);

export const ListIcon = (p) => (
  <I {...p}>
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" strokeWidth={3} />
    <line x1="3" y1="12" x2="3.01" y2="12" strokeWidth={3} />
    <line x1="3" y1="18" x2="3.01" y2="18" strokeWidth={3} />
  </I>
);

export const KanbanBoardIcon = (p) => (
  <I {...p}>
    <rect x="3" y="3" width="5" height="18" rx="1.5" />
    <rect x="10" y="3" width="5" height="12" rx="1.5" />
    <rect x="17" y="3" width="5" height="15" rx="1.5" />
  </I>
);

export const LayersIcon = (p) => (
  <I {...p}>
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
  </I>
);

export const WorkflowIcon = (p) => (
  <I {...p}>
    <rect x="3" y="3" width="6" height="6" rx="1.5" />
    <rect x="15" y="3" width="6" height="6" rx="1.5" />
    <rect x="9" y="15" width="6" height="6" rx="1.5" />
    <path d="M6 9v3a3 3 0 0 0 3 3h3m6-6v3a3 3 0 0 1-3 3" />
  </I>
);



export const ShieldLockIcon = (p) => (
  <I {...p}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <rect x="9.5" y="10.5" width="5" height="4" rx="1" />
    <path d="M10.5 10.5V9a1.5 1.5 0 0 1 3 0v1.5" />
  </I>
);

// ── Streamline Core Pop Style Icon Suite & Organization Suite ──

export const BuildingIcon = (p) => (
  <I {...p}>
    <rect x="4" y="2" width="16" height="20" rx="2" />
    <path d="M9 22v-4h6v4" />
    <path d="M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01" />
  </I>
);

export const UserPlusIcon = (p) => (
  <I {...p}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <line x1="19" y1="8" x2="19" y2="14" />
    <line x1="16" y1="11" x2="22" y2="11" />
  </I>
);

export const ThumbsUpIcon = (p) => (
  <I {...p}>
    <path d="M7 10v11H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3z" />
    <path d="M7 10l5-8a2 2 0 0 1 2 2v4h6a2 2 0 0 1 2 2v2a3.5 3.5 0 0 1-.5 1.8l-2.5 5.5A2.5 2.5 0 0 1 17 21H7" />
  </I>
);

export const HeartIcon = (p) => (
  <I {...p}>
    <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
  </I>
);

export const FlameIcon = (p) => (
  <I {...p}>
    <path d="M12 2c-.5 2.5-3 4.5-3 7.5a6 6 0 0 0 10.2 4.2A8 8 0 0 0 19 8c-2 2-3 2-3 2a4 4 0 0 1-4-8z" />
    <path d="M12 14a2 2 0 0 0-2 2c0 1.5 1.5 2.5 2 3.5.5-1 2-2 2-3.5a2 2 0 0 0-2-2z" />
  </I>
);

export const BulbIcon = (p) => (
  <I {...p}>
    <path d="M9 18h6" />
    <path d="M10 22h4" />
    <path d="M12 2a7 7 0 0 0-7 7c0 2.5 1.5 4.5 3 6h8c1.5-1.5 3-3.5 3-6a7 7 0 0 0-7-7z" />
    <line x1="12" y1="6" x2="12" y2="10" />
    <line x1="10" y1="8" x2="14" y2="8" />
  </I>
);

export const ClapIcon = (p) => (
  <I {...p}>
    <path d="M7.5 11.5l2-2a2.12 2.12 0 0 1 3 3L10 15" />
    <path d="M11 7.5l2-2a2.12 2.12 0 0 1 3 3L13.5 11" />
    <path d="M14.5 3.5l2-2a2.12 2.12 0 0 1 3 3L17 7" />
    <path d="M18 10l-6 6a4.24 4.24 0 0 1-6-6l6-6" />
    <path d="M2 18l3-3" />
    <path d="M6 22l3-3" />
  </I>
);

export const PartyIcon = (p) => (
  <I {...p}>
    <path d="M4 20l5-15 11 11z" />
    <path d="M15 4l1 3" />
    <path d="M20 9l-3 1" />
    <circle cx="18" cy="4" r="1" fill="currentColor" />
    <circle cx="14" cy="9" r="0.75" fill="currentColor" />
    <circle cx="21" cy="14" r="0.75" fill="currentColor" />
  </I>
);

export const EyeIcon = (p) => (
  <I {...p}>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </I>
);

export const CopyIcon = (p) => (
  <I {...p}>
    <rect x="9" y="9" width="13" height="13" rx="2.5" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </I>
);

export const MicrophoneIcon = (p) => (
  <I {...p}>
    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line x1="12" y1="19" x2="12" y2="22" />
    <line x1="8" y1="22" x2="16" y2="22" />
  </I>
);

export const PlayIcon = (p) => (
  <I {...p}>
    <polygon points="6 3 20 12 6 21 6 3" fill="currentColor" stroke="none" />
  </I>
);

export const PauseIcon = (p) => (
  <I {...p}>
    <rect x="6" y="4" width="4" height="16" rx="1" fill="currentColor" stroke="none" />
    <rect x="14" y="4" width="4" height="16" rx="1" fill="currentColor" stroke="none" />
  </I>
);

export const TimerIcon = (p) => (
  <I {...p}>
    <circle cx="12" cy="13" r="8" />
    <path d="M12 9v4l2.5 2" />
    <path d="M10 2h4" />
  </I>
);

export const CoffeeIcon = (p) => (
  <I {...p}>
    <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
    <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
    <line x1="6" y1="1" x2="6" y2="4" />
    <line x1="10" y1="1" x2="10" y2="4" />
    <line x1="14" y1="1" x2="14" y2="4" />
  </I>
);

export const GoogleMeetIcon = (p) => (
  <I {...p}>
    <rect x="3" y="5" width="13" height="14" rx="2.5" />
    <path d="M16 10l5-3v10l-5-3v-4z" />
  </I>
);

export const ZoomIcon = (p) => (
  <I {...p}>
    <path d="M15 10l4.5-3v10L15 14v-4z" />
    <rect x="3" y="6" width="12" height="12" rx="3" />
  </I>
);

export const FigmaIcon = (p) => (
  <I {...p}>
    <path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z" />
    <path d="M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z" />
    <path d="M12 9h3.5a3.5 3.5 0 1 1 0 7H12V9z" />
    <path d="M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5z" />
    <path d="M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0z" />
  </I>
);

export const NotionIcon = (p) => (
  <I {...p}>
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <path d="M9 8v8" />
    <path d="M9 8l6 8" />
    <path d="M15 8v8" />
  </I>
);

export const WaveformIcon = (p) => (
  <I {...p}>
    <path d="M2 10v4" />
    <path d="M6 6v12" />
    <path d="M10 3v18" />
    <path d="M14 8v8" />
    <path d="M18 5v14" />
    <path d="M22 10v4" />
  </I>
);
