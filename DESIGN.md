# Meridian Clarity Pro — Design System Specification (DESIGN.md)

**Design System Code:** `MERIDIAN-KINETIC-2.0`  
**Aesthetic Benchmark:** RonDesignLab / Haute-Horlogerie Editorial SaaS  
**Visual Mood:** Warm Alabaster Canvas • Editorial Italic Serifs • Tactile Neo-Skeuomorphism • Kinetic Mechanical Spring Physics • Precision Tabular Telemetry  
**Award Tier:** $1,000,000+ Awwwards Site of the Year / Apple Design Award Caliber  

---

## 1. Design Manifesto: "Tactile Luxury, Editorial Precision"

For the last decade, enterprise software has suffered from "sterile minimalism" — flat, clinical gray boxes, lifeless buttons, and cold hospital-white backgrounds that reduce intellectual work to a chore.

**Meridian Clarity Pro** rejects flat digital sterility. We believe:
1. **Work is Craft:** An orchestrator for world-class creators should look and feel like a bespoke Swiss chronograph, a high-end Leica camera, or a precision mechanical synthesizer from Teenage Engineering.
2. **Warmth Over Sterile White:** Natural daylight is warm. Our foundation is built upon warm alabaster, crushed stone, and linen hues (`#FAF8F5`, `#F4F0E6`), providing soothing optical comfort during 12-hour sprint cycles.
3. **The High-Low Typographic Contrast:** Utilitarian geometric sans (`Urbanist`, `Plus Jakarta Sans`) provides crisp architectural framing, while literary italic serifs (`Instrument Serif`) impart editorial soul and artistic gravity.
4. **Mechanical Tactility (Neo-Skeuomorphism 2.0):** Buttons depress with weight; sliding segmented pills stretch with kinetic momentum; cards have soft bevels, ambient occlusion shadows, and tactile grip textures.

```
                  ┌──────────────────────────────────────────────┐
                  │          THE MERIDIAN DESIGN MATRIX          │
                  └──────────────────────┬───────────────────────┘
                                         │
        ┌────────────────────────────────┼────────────────────────────────┐
        ▼                                ▼                                ▼
┌──────────────────────┐      ┌──────────────────────┐      ┌──────────────────────┐
│   WARM SUBSTRATE     │      │  HAUTE TYPOGRAPHY    │      │  TACTILE PHYSICS     │
│  • Alabaster Canvas  │      │  • Instrument Serif  │      │  • Kinetic Springs   │
│  • Soft Bento Tiles  │      │  • Urbanist Sans     │      │  • Elastic Pills     │
│  • Obsidian Docks    │      │  • Futura Tabular    │      │  • Multi-Tier Depth  │
└──────────────────────┘      └──────────────────────┘      └──────────────────────┘
```

---

## 2. Spatial Canvas & Material Foundations

The interface is organized in physical depth layers, avoiding generic 1D flat planes.

```
[Layer 4: Overlays] ─── Modals, Drawers, Dynamic Island (Obsidian #111318 + Backdrop Blur)
[Layer 3: Floating] ─── Kinetic Member Cards, Dragging Kanban Cards (14px-32px Shadow)
[Layer 2: Surfaces] ─── Bento White Tiles (#FFFFFF, 24px Radius, 1px Subtle Stone Border)
[Layer 1: Canvas]   ─── Alabaster & Warm Linen Canvas (#FAF8F5 / #F4F0E6)
```

### 2.1 Canvas Tokens

| Token | CSS Variable | Hex Value | Usage / Description |
| :--- | :--- | :--- | :--- |
| **Canvas Primary** | `--bg-canvas` | `#FAF8F5` | The primary atmospheric backdrop; soft warm linen |
| **Canvas Subtle** | `--bg-canvas-subtle` | `#F4F0E6` | Secondary sidebars, recessed wells, card tracks |
| **Canvas Warm** | `--bg-canvas-warm` | `#F8F6F0` | Header bands, inactive pill button wells |
| **Surface Tile** | `--card-bg` | `#FFFFFF` | Bento cards, Kanban tiles, dynamic containers |
| **Surface Border** | `--card-border` | `rgba(0, 0, 0, 0.06)` | Micro-fine hairline structural divider |
| **Obsidian Dock** | `--dark-dock` | `#111318` | Floating Dynamic Island, Command Palette, Dark HUDs |

---

## 3. The Signature Color Palette & Pastel Ecosystem

RonDesignLab interfaces are celebrated for their **curated pastel harmony**. Unlike harsh primary colors (raw blues, neon greens), Meridian uses **Candy Tint Pastels**: ultra-soft container tints paired with deeply saturated, high-contrast foreground typography and delicate accent borders.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        MERIDIAN SIGNATURE PASTEL ECOSYSTEM                             │
├────────────────────┬────────────────────┬────────────────────┬─────────────────────────┤
│  LAVENDER          │  PEACH / AMBER     │  SPRING LIME       │  ARCTIC SKY             │
│  Bg: #EDE9FE       │  Bg: #FFEDD5       │  Bg: #ECFCCB       │  Bg: #E0F2FE            │
│  Text: #6D28D9     │  Text: #C2410C     │  Text: #3F6212     │  Text: #0369A1          │
│  Border: #DDD6FE   │  Border: #FDBA74   │  Border: #D9F99D   │  Border: #BAE6FD        │
├────────────────────┼────────────────────┼────────────────────┼─────────────────────────┤
│  EDITORIAL ROSE    │  MINT EMERALD      │  SOLAR GOLD        │  DARK OBSIDIAN          │
│  Bg: #FFE4E6       │  Bg: #DCFCE7       │  Bg: #FEF9C3       │  Bg: #111318            │
│  Text: #BE123C     │  Text: #15803D     │  Text: #854D0E     │  Text: #FFFFFF          │
│  Border: #FECDD3   │  Border: #BBF7D0   │  Border: #FEF08A   │  Border: rgba(255,255,255,0.12)
└────────────────────┴────────────────────┴────────────────────┴─────────────────────────┘
```

### 3.1 Mathematical Contrast Formula
Every pastel pairing satisfies **WCAG AA (minimum 4.5:1)**:
* **Background:** Lightness `L = 92% – 97%` (delicate ambient wash).
* **Text / Icon:** Lightness `L = 25% – 38%` (deep optical weight, never washed out).
* **Border:** Lightness `L = 78% – 86%` (crisp container definition).

### 3.2 Striped Kinetic Progress Gradients
For active velocity indicators, sprint burndown bars, and lineup deliverables, Meridian utilizes 45-degree diagonal candy striping:

```css
/* Striped Kinetic Bar Fill Tokens */
.striped-bar-green {
  background: repeating-linear-gradient(
    -45deg,
    #a3e635,
    #a3e635 6px,
    #84cc16 6px,
    #84cc16 12px
  );
}

.striped-bar-orange {
  background: repeating-linear-gradient(
    -45deg,
    #fb923c,
    #fb923c 6px,
    #f97316 6px,
    #f97316 12px
  );
}

.striped-bar-purple {
  background: repeating-linear-gradient(
    -45deg,
    #c084fc,
    #c084fc 6px,
    #a855f7 6px,
    #a855f7 12px
  );
}
```

---

## 4. The Haute-Horlogerie Typography System

Typography in Meridian is treated like luxury print editorial mixed with telemetry dials on a supercar dashboard.

```
       ┌────────────────────────────────────────────────────────┐
       │               THE TRI-TYPOGRAPHIC STACK                │
       └───────────────────────────┬────────────────────────────┘
                                   │
         ┌─────────────────────────┼─────────────────────────┐
         ▼                         ▼                         ▼
 ┌───────────────┐         ┌───────────────┐         ┌───────────────┐
 │   EDITORIAL   │         │  UI STRUCTURE │         │   TELEMETRY   │
 │Instrument Ser.│         │ Urbanist / PJS│         │Futura / Mono  │
 │Italic Accents │         │ Geometric Sans│         │Tabular Dial   │
 └───────────────┘         └───────────────┘         └───────────────┘
```

### 4.1 Font Family Roles
1. **The Soul — `Instrument Serif`:**
   - Reserved for emotional emphasis, headline keywords, and editorial highlights.
   - Always rendered in italic with slight negative tracking (`-0.02em`).
   - *Example:* "Where *exceptional* teams build *iconic products*."
2. **The Backbone — `Urbanist` & `Plus Jakarta Sans`:**
   - High legibility geometric sans for navigation labels, section titles, card headers, and button text.
   - Clean, round x-height with open apertures.
3. **The Precision Gauge — `Futura` & `JetBrains Mono`:**
   - Tabular figures (`tnum`, `lnum`) for KPIs, percentage deltas, countdown clocks, and ticket IDs (`MRD-042`).
   - Ensures numbers do not shift or jitter when updating in real time.

### 4.2 Typographic Hierarchy Scale

| Scale Role | Font Family | Size | Weight | Tracking | Line-Height | CSS / Utility |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Hero Display** | Instrument Serif Italic + Urbanist | 56px–64px | 400 Italic / 800 | -0.03em | 1.08 | `font-serif text-5xl lg:text-6xl leading-[1.08]` |
| **Page Title** | Urbanist / Display Sans | 32px–36px | 800 | -0.025em | 1.15 | `text-3xl lg:text-4xl font-extrabold tracking-tight` |
| **Section Header** | Instrument Serif + Sans Accent | 24px–27px | 400 / 700 | -0.02em | 1.20 | `urbanist-lead font-semibold` |
| **Card Header** | Urbanist / Plus Jakarta Sans | 16px–18px | 700 | -0.015em | 1.30 | `text-base font-bold text-stone-900` |
| **Body Primary** | Urbanist / General Sans | 14px | 500 | -0.012em | 1.55 | `text-sm text-stone-600 body-refined` |
| **Body Caption** | Plus Jakarta Sans | 12px | 500 | -0.01em | 1.45 | `text-xs text-stone-500 font-medium` |
| **KPI Stat Dial** | Futura / League Spartan | 28px–38px | 800 | -0.035em | 1.00 | `stat-number text-3xl font-extrabold` |
| **Micro Telemetry** | JetBrains Mono | 10px–11px | 700 | +0.04em | 1.25 | `tech-badge uppercase font-mono` |

---

## 5. Elevation, Shadow Physics & Surface Geometry

Surfaces in Meridian do not use harsh, muddy black drop-shadows. Shadows are computed using **ambient occlusion** (multiple soft layers with warm tinting).

```css
/* Level 1: Resting Bento Card */
.bento-card {
  background: #ffffff;
  border-radius: 24px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 
    0 4px 20px -2px rgba(18, 19, 22, 0.03),
    0 2px 6px -1px rgba(18, 19, 22, 0.02);
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

/* Level 2: Interactive Lift on Hover */
.bento-card-interactive:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 14px 32px -4px rgba(18, 19, 22, 0.08),
    0 4px 12px -2px rgba(18, 19, 22, 0.04);
}

/* Level 3: Obsidian Floating Island */
.dynamic-island {
  background: #111318;
  border-radius: 9999px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 
    0 20px 40px -8px rgba(0, 0, 0, 0.45),
    0 4px 12px rgba(0, 0, 0, 0.2);
}

/* Level 4: Dragging Kanban Card State */
.card-dragging {
  opacity: 0.5;
  transform: scale(0.97) rotate(1.2deg);
  box-shadow: 0 24px 48px -12px rgba(18, 19, 22, 0.25);
}

/* Level 5: Glassmorphic Frosted Shroud */
.glass-card {
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.65);
  border-radius: 24px;
}
```

---

## 6. Signature Component Specifications & Motion Specs

### 6.1 Component: Tactile Segmented Control (`TactileSegmentedControl.jsx`)

The mechanical jewel of the interface. Replacing standard HTML tabs, this switch features an elastic indicator pill that physically stretches and snaps into place.

```
       [  To Do  ]   [ In Progress ]   [ Done ]
       ┌─────────────────────────┐
       │ (==== Stretching Pill ==) ──> Snaps to active target
       └─────────────────────────┘
```

#### Interaction Physics:
1. **Resting State:** Active pill possesses an inset border and a soft ambient drop shadow.
2. **Kinetic Transition:** When changing active option, the pill calculates target position and applies `transform: scaleX(1.15)` dynamically.
3. **Directional Origin:**
   - If moving right: `transform-origin: left center`
   - If moving left: `transform-origin: right center`
4. **Depress Feedback:** While pressing down on a segment, container scales to `active:scale-[0.98]`.

---

### 6.2 Component: High-Impact Metric Card (`MetricCard.jsx`)

Displays 7-day sprint telemetry with interactive bar columns and glowing focus accents.

```
┌─────────────────────────────────────────────────────────────────┐
│ ⊞ TOTAL COMPLETED                                     [ +18.4% ]│
│ 1,482                                                           │
│                                                                 │
│       ■               ■               ■                         │
│   ■   ■       ■       ■       ■       ■       ■                 │
│   ■   ■   ■   ■   ■   ■   ■   ■   ■   ■   ■   ■   ■   ■         │
│  Mon Tue Wed Thu Fri Sat Sun                                    │
└─────────────────────────────────────────────────────────────────┘
```

#### Features:
* **Entry Animation:** Bars grow vertically from baseline (`scaleY(0)` to `scaleY(1)`) via `@keyframes barGrow` over 600ms.
* **Hover Interaction:** Hovering over any day column highlights the bar with saturated accent color (`accentHex`) and displays a floating micro-tooltip with exact task count.
* **Theming:** Configured via preset color palettes (`purple`, `amber`, `sky`, `lime`, `rose`).

---

### 6.3 Component: Interactive Drag-and-Drop Kanban Card

The daily workhorse. Designed for maximum information density without sacrificing beauty.

```
┌─────────────────────────────────────────────────────────────────┐
│ MRD-001                                      [High Priority ●]  │
│ Design System 2.0 Tokens & Component Specs                     │
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ [ Live High-Fidelity UI Mockup Preview Frame ]              │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ ▰▰▰▱▱ 3/5 Subtasks completed                                    │
│                                                                 │
│ [Design] [Internal Tasks]                    (KV) (AJ) +1       │
└─────────────────────────────────────────────────────────────────┘
```

#### Anatomy:
1. **Top Header:** Monospace ticket badge (`MRD-001`) left-aligned; priority pill right-aligned with glowing dot.
2. **Title:** Bold 14px sans typography with 2-line optical truncation.
3. **Mockup Frame:** 16:9 rounded image container showcasing actual Figma/PNG exports.
4. **Subtask Meter:** Fractional progress bar showing real-time checklist completion.
5. **Footer:** Soft pastel category tags and overlapping assignee circle avatars.

---

### 6.4 Component: Floating Dynamic Island HUD (`DynamicHeader.jsx`)

Hovering above the viewport like the bridge of a starship, the Dynamic Island delivers persistent situational awareness.

```
┌───────────────────────────────────────────────────────────────────────┐
│ ⚡ Sprint 24 • 04d 12h remaining  |  ● 4 Live in Standup  |  [+ New]  │
└───────────────────────────────────────────────────────────────────────┘
```

#### Interaction States:
* **Normal Pill State:** Width ~380px, height 40px, rounded-full, dark obsidian `#111318`.
* **Live Beacon:** Green pulsing beacon (`pulse-slow`) indicating ongoing team sync.
* **Expanded State on Click:** Expands downward into an interactive sprint summary HUD displaying team blockers and active burn rate.

---

### 6.5 Component: Kinetic Member Card (`KineticMemberCard.jsx`)

Presents team members not as static roster entries, but as active contributors in a live studio.

```
┌─────────────────────────────────────────────────────────────────┐
│ (Avatar ●)  Kacie Velasquez                       [LEAD DESIGN] │
│             kacie@meridian.design                               │
│                                                                 │
│ Workload: 4 Active Projects  •  12 Sprint Tasks                 │
│ Time Logged: [▰▰▰▰▰▰▰▱▱] 34.5 hrs this week                     │
│                                                                 │
│ [ Quick Message ✉ ]                           [ View Profile → ] │
└─────────────────────────────────────────────────────────────────┘
```

* **Presence Halos:**
  - `Online`: Animated double-ring pulse (`#84cc16`).
  - `In Flow`: Amber focus ring (`#f59e0b`).
  - `Away`: Muted stone ring (`#a1a1aa`).
* **Tactile Quick Action:** Instant hover revealing direct 1:1 chat initiator.

---

## 7. Motion Choreography & Timing Physics

All animations in Meridian adhere to physical kinematics rather than linear robotic transitions.

```
                  ┌──────────────────────────────────────────────┐
                  │           THE MERIDIAN MOTION CURVE          │
                  │        cubic-bezier(0.16, 1, 0.3, 1)         │
                  └──────────────────────────────────────────────┘
                       1.0 ├───────────────╭───────────
                           │              ╭╯
                           │             ╭╯
                           │            ╭╯
                       0.0 └───╯────────┴───────────────
                               0.0           1.0
```

### 7.1 Motion Timing Reference Table

| Interaction Type | Duration | Easing Function | Description |
| :--- | :--- | :--- | :--- |
| **Micro-Hover / Color Shift** | 150ms | `cubic-bezier(0.16, 1, 0.3, 1)` | Buttons, nav links, tag pills |
| **Segmented Pill Stretch** | 240ms | `cubic-bezier(0.16, 1, 0.3, 1)` | Tactile indicator slide and snap |
| **Card Lift & Elevation** | 220ms | `cubic-bezier(0.16, 1, 0.3, 1)` | Bento tiles, member cards on hover |
| **Drawer Slide-Over** | 380ms | `cubic-bezier(0.16, 1, 0.3, 1)` | Right-hand Task Detail Drawer |
| **Modal Scale-Fade** | 280ms | `cubic-bezier(0.16, 1, 0.3, 1)` | Popups, command palette, invite modals |
| **Presence Beacon Pulse** | 2500ms | `cubic-bezier(0.4, 0, 0.6, 1)` | Infinite ambient status indicator loop |

---

## 8. Iconography & Visual Ornamentation Language

All icons within Meridian adhere to strict geometric alignment rules:
* **Stroke Weight:** Exactly `1.75px` or `2.0px` (never mismatched).
* **Corner Geometry:** `stroke-linecap="round"` and `stroke-linejoin="round"`.
* **Grid Bounds:** `24x24px` bounding box with `2px` inner padding.
* **Palette Sync:** Icons inherit their container's high-contrast color token (e.g., `#6D28D9` within `#EDE9FE` container).

---

## 9. Design System Audit Rubric (The $1,000,000 Award-Winning Standard)

Before any new page, widget, or component is committed to the Meridian codebase, it must be evaluated against this 8-point rubric:

- [ ] **1. No Pure Black / Cold White:** Background uses warm alabaster (`#FAF8F5`/`#F4F0E6`); dark elements use obsidian (`#111318`).
- [ ] **2. Editorial Italic Accent Present:** Top-level headlines feature an *Instrument Serif* italic highlight.
- [ ] **3. Tabular Precision for Numbers:** All metrics, hours, counts, and deltas utilize `tabular-nums` and the Futura/Mono font stack.
- [ ] **4. Multi-Layer Shadows:** No flat single-offset drop shadows; uses ambient occlusion layers.
- [ ] **5. Tactile Feedback on Click:** Interactive elements incorporate physical depress feedback (`active:scale-[0.98]`).
- [ ] **6. Curated Pastel System:** Pill tags, KPI backgrounds, and swimlanes adhere to the calibrated 7-pastel ecosystem.
- [ ] **7. Contrast AA Checked:** All text-on-pastel combinations exceed 4.5:1 contrast.
- [ ] **8. 60fps/120fps Kinetic Motion:** Motion uses the signature `cubic-bezier(0.16, 1, 0.3, 1)` curve without jank or layout thrashing.
