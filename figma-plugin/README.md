# Meridian Design System — Figma Component Generator Plugin

This native Figma plugin automatically draws and constructs the entire **Meridian Design System** directly onto your Figma Canvas on the **Components** page (`1:4`).

---

## What It Generates on Your Figma Canvas

1. **Color Ecosystem & Tokens**:
   - 8 Key Primitive Ramp Swatches (`Indigo 600`, `Violet 600`, `Emerald 600`, `Amber 500`, `Rose 600`, `Sky 600`, `Slate 900`, `Slate 50`).
   - 7-Pastel Candy Ecosystem with WCAG AA >= 4.5:1 verified contrast chips (`Lavender`, `Peach`, `Lime`, `Sky`, `Rose`, `Mint`, `Gold`, `Stone`).
2. **Buttons Component Set (24 Variants)**:
   - 8 Variants: `Primary`, `Brand`, `Secondary`, `Outline`, `Ghost`, `Danger`, `Obsidian`, `Soft`.
   - 3 Sizes: `SM (32px)`, `MD (40px)`, `LG (48px)`.
   - Built with native Auto Layout, tactile elevation shadows, and proper padding.
3. **Badges, Tags & Priority Indicators**:
   - 8 Pastel Candy Badges with radar beacon dots.
   - 4 Priority Badges (`CRITICAL`, `HIGH`, `MEDIUM`, `LOW`).
   - 8 Domain Tags (`#auth`, `#backend`, `#frontend`, `#design`, `#payments`, `#security`, `#infra`, `#mobile`).
4. **Form Controls & Inputs**:
   - Text Inputs: `Default`, `Focus (with 3px Indigo Halo Ring)`, `Error (with red alert styling)`.
   - Tactile Switches / Toggles: `State=On` and `State=Off` with smooth sliding circular knobs.
5. **Bento Cards & KPI Telemetry**:
   - **KPI Telemetry Dial**: Large tabular velocity metric (`94.2%`), delta badge (`+18.4%`), and mini 7-column sparkline telemetry chart.
   - **Obsidian Dark Bento Card**: `#090D16` dark dock with subtle neon stroke.
   - **Identity & Progress Card**: Overlapping avatar stack with `+4` count and candy green progress bar meter.

---

## How to Run It in Figma (Takes 10 Seconds)

1. Open your **Meridian** file in the **Figma Desktop App**.
2. Switch to the **Components** page in the left sidebar (or stay on your current page).
3. Click the **Figma Menu (top left dropdown)** ➔ **Plugins** ➔ **Development** ➔ **Import plugin from manifest...**.
4. In the file picker, navigate to this project folder and select:
   ```
   d:\Github\Meridian\figma-plugin\manifest.json
   ```
5. Click **Open**. The plugin **"Meridian Design System Generator"** is now added to your development plugins!
6. Now click **Plugins** ➔ **Development** ➔ **Meridian Design System Generator** (or press `Ctrl + /` and type "Meridian Design System Generator").
7. ✨ The script runs immediately in 1 second, builds all 5 sections, organizes them neatly with auto-layout, and zooms straight into your newly created components!
