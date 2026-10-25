# Meridian Canvas Studio — Figma Plugin (Screens & Design System)

This native Figma plugin automatically draws and constructs the **entire Meridian application suite** directly onto your Figma canvas, organized across the **Components** (`1:4`) and **Screens** (`1:5`) pages.

---

## 💻 What It Generates

### Page "Screens" (`1:5`): 11 Full-Fidelity Desktop Screens (1440 × 900)
Arranged in an organized 4-column by 3-row layout with HUD specification headers:

#### 1. Authentication & Onboarding Flow (Row 1)
- **Screen 01 · Login**: Split layout with editorial brand showcase (headline, 4 bento feature cards with pastel chips, testimonials) and centered auth form (Demo Login quick-fill, Google & GitHub SSO, email/password inputs).
- **Screen 02 · Signup**: Multi-step registration, password strength meter with 4 color bars, and terms agreement.
- **Screen 03 · Forgot Password & Reset OTP**: Focused verification dialog with 6 discrete OTP digit boxes and focus ring.
- **Screen 04 · Organization Setup**: Workspace creation wizard (workspace name, slug `meridian.io/workspace/xyz`, team size cards).

#### 2. Core Workspace & Productivity (Row 2)
- **Screen 05 · Main Dashboard Overview**: Full sidebar, dynamic header with sprint assurance pill, search box, 4 KPI bento cards (Total Deliverables `42`, In Progress `14`, Velocity `94.2%`, Completed `28`), Active Lineup deliverable cards with progress bars, Capacity Dial gauge (`82% Allocated`), and live audit activity feed.
- **Screen 06 · Kanban Sprint Board**: 4 swimlanes (**To Do**, **In Progress**, **Under Review**, **Done**) with task cards, domain tags, priority indicators, subtask meters, and member initials.
- **Screen 07 · Task Detail Slide-Over**: Dark backdrop scrim with slide-over drawer showing task specifications, status/priority dropdowns, subtask checklist (`4/5 Done`), and real-time team comments discussion thread.

#### 3. Analytics, Planning & Management (Row 3)
- **Screen 08 · Analytics & Velocity Telemetry**: Top metric dials (Completion Rate `91.4%`, Cycle Time `2.4 Days`, Velocity `64 Pts`), Weekly Velocity Histogram bar chart (Mon through Sun), and sprint burnup indicators.
- **Screen 09 · Calendar & Sprint Milestones**: Month grid view with days 1–31, color-coded task deadline chips, sprint demo milestones, and today's highlighted indicator.
- **Screen 10 · Team Directory & Presence**: Team directory with workload metrics, online presence halos, member cards (Avatar, role, active tasks count).
- **Screen 11 · Workspace Settings & Billing**: Tabbed workspace configuration with organization profile and Pro plan subscription card ($29/mo, features checklist, invoice history).

---

### Page "Components" (`1:4`): Full Design System Library
- **Color Ecosystem**: 8 Primitive swatches + 7-Pastel Candy WCAG AA >= 4.5:1 chips.
- **Tactile Buttons**: `Primary`, `Brand`, `Secondary`, `Danger`, `Soft` variants with Auto Layout and subtle drop shadows.
- **Badges, Tags & Priority Indicators**: Beacon dots and domain pills.
- **Form Controls**: Focus halo inputs and tactile toggle switches.
- **Bento Cards & KPI Dials**: Metric cards with sparkline columns and obsidian dark docks.

---

## 🚀 How to Run in Figma (Takes 10 Seconds)

1. Open your **Meridian** file in the **Figma Desktop App**.
2. Click the **Figma Menu (top-left dropdown)** ➔ **Plugins** ➔ **Development** ➔ **Import plugin from manifest...**.
3. Select the manifest:
   ```
   d:\Github\Meridian\figma-plugin\manifest.json
   ```
4. Click **Open**.
5. Press `Ctrl + /` (or `Cmd + /` on Mac) and type:
   **Meridian Studio** (or go to **Plugins** ➔ **Development** ➔ **Meridian Design System Generator**).
6. A floating plugin window appears! Click:
   - **⚡ Generate Everything (Full Workspace)**: Generates all 11 screens on the **Screens** page AND the component suite on the **Components** page!
   - Or click **💻 Generate All 11 Screens** to build the screens only.
7. ✨ Watch Figma generate all 11 desktop screens and auto-zoom to fit!
