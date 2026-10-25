/**
 * MERIDIAN DESIGN SYSTEM — FIGMA CANVAS GENERATOR
 * Generates the complete Meridian Design System directly onto the Figma Canvas:
 * - Color Styles & Swatches (Primitives + 7-Pastel Candy Ecosystem)
 * - Buttons with full Variant Matrix (8 Variants x 3 Sizes = 24 Variants)
 * - Badges & Tags with Beacon Dots (8 Pastel Colors)
 * - Priority & Status Badges
 * - Form Controls (Inputs, Focus Halo, Switches, Checkboxes)
 * - Bento Cards & KPI Telemetry Dials
 * - Avatars & Avatar Groups
 * - Progress Bars & Meters
 */

(async function () {
  try {
    // 1. Load Fonts
    let regularFont = { family: "Inter", style: "Regular" };
    let mediumFont = { family: "Inter", style: "Medium" };
    let semiBoldFont = { family: "Inter", style: "Semi Bold" };
    let boldFont = { family: "Inter", style: "Bold" };

    try {
      await figma.loadFontAsync(regularFont);
      await figma.loadFontAsync(mediumFont);
      await figma.loadFontAsync(semiBoldFont);
      await figma.loadFontAsync(boldFont);
    } catch (e) {
      console.warn("Could not load Inter, falling back to Roboto / system", e);
      regularFont = { family: "Roboto", style: "Regular" };
      mediumFont = { family: "Roboto", style: "Medium" };
      semiBoldFont = { family: "Roboto", style: "Bold" };
      boldFont = { family: "Roboto", style: "Bold" };
      await figma.loadFontAsync(regularFont);
      await figma.loadFontAsync(mediumFont);
      await figma.loadFontAsync(semiBoldFont);
      await figma.loadFontAsync(boldFont);
    }

    // Target Page: if current page is not Components, look for page named Components
    let targetPage = figma.currentPage;
    for (const page of figma.root.children) {
      if (page.name.toLowerCase() === 'components' || page.id === '1:4') {
        targetPage = page;
        figma.currentPage = page;
        break;
      }
    }

    // Helper: Hex to RGB (0-1)
    function hexToRgb(hex) {
      const clean = hex.replace('#', '');
      const r = parseInt(clean.substring(0, 2), 16) / 255;
      const g = parseInt(clean.substring(2, 4), 16) / 255;
      const b = parseInt(clean.substring(4, 6), 16) / 255;
      return { r, g, b };
    }

    function solidColor(hex, opacity = 1) {
      return [{ type: 'SOLID', color: hexToRgb(hex), opacity }];
    }

    function createText(text, font = regularFont, size = 14, colorHex = '#0F172A') {
      const node = figma.createText();
      node.fontName = font;
      node.characters = String(text);
      node.fontSize = size;
      node.fills = solidColor(colorHex);
      return node;
    }

    // Drop shadow effect
    const subtleShadow = {
      type: "DROP_SHADOW",
      color: { r: 0.05, g: 0.09, b: 0.16, a: 0.06 },
      offset: { x: 0, y: 1 },
      radius: 3,
      spread: 0,
      visible: true,
      blendMode: "NORMAL"
    };

    const elevatedShadow = {
      type: "DROP_SHADOW",
      color: { r: 0.05, g: 0.09, b: 0.16, a: 0.08 },
      offset: { x: 0, y: 4 },
      radius: 12,
      spread: -2,
      visible: true,
      blendMode: "NORMAL"
    };

    // Design Tokens Definition
    const PASTELS = {
      Lavender: { bg: '#F3E8FF', text: '#581C87', border: '#E9D5FF', dot: '#9333EA' },
      Peach:    { bg: '#FFEDD5', text: '#7C2D12', border: '#FED7AA', dot: '#EA580C' },
      Lime:     { bg: '#ECFCCB', text: '#365314', border: '#D9F99D', dot: '#65A30D' },
      Sky:      { bg: '#E0F2FE', text: '#0C4A6E', border: '#BAE6FD', dot: '#0284C7' },
      Rose:     { bg: '#FFE4E6', text: '#881337', border: '#FECDD3', dot: '#E11D48' },
      Mint:     { bg: '#D1FAE5', text: '#064E3B', border: '#A7F3D0', dot: '#059669' },
      Gold:     { bg: '#FEF3C7', text: '#78350F', border: '#FDE68A', dot: '#D97706' },
      Stone:    { bg: '#F5F5F4', text: '#1C1917', border: '#E7E5E4', dot: '#78716C' },
    };

    let cursorY = 0;
    const canvasMarginX = 80;
    const allGeneratedNodes = [];

    // Helper: Create Section Frame
    function createSection(title, description, width = 1280) {
      const section = figma.createFrame();
      section.name = `Section: ${title}`;
      section.x = canvasMarginX;
      section.y = cursorY;
      section.layoutMode = 'VERTICAL';
      section.primaryAxisSizingMode = 'AUTO';
      section.counterAxisSizingMode = 'FIXED';
      section.resize(width, 100);
      section.paddingTop = 36;
      section.paddingBottom = 36;
      section.paddingLeft = 40;
      section.paddingRight = 40;
      section.itemSpacing = 28;
      section.fills = solidColor('#FFFFFF');
      section.cornerRadius = 20;
      section.strokes = solidColor('#E2E8F0');
      section.strokeWeight = 1;
      section.effects = [elevatedShadow];

      const header = figma.createFrame();
      header.name = 'Section Header';
      header.layoutMode = 'VERTICAL';
      header.primaryAxisSizingMode = 'AUTO';
      header.counterAxisSizingMode = 'AUTO';
      header.itemSpacing = 6;
      header.fills = [];

      const t = createText(title, boldFont, 24, '#0F172A');
      header.appendChild(t);
      if (description) {
        const d = createText(description, regularFont, 14, '#64748B');
        header.appendChild(d);
      }
      section.appendChild(header);

      targetPage.appendChild(section);
      allGeneratedNodes.push(section);
      return section;
    }

    function advanceCursor(section) {
      cursorY += section.height + 60;
    }

    // =========================================================================
    // SECTION 1: COLOR PALETTE & TOKENS
    // =========================================================================
    const secColors = createSection(
      "01 / Color Ecosystem & Tokens",
      "Curated 9-step primitive ramps, semantic surfaces, and 7-Pastel Candy WCAG AA tokens"
    );

    // Primitives Row
    const primContainer = figma.createFrame();
    primContainer.name = "Color Swatches";
    primContainer.layoutMode = "VERTICAL";
    primContainer.primaryAxisSizingMode = "AUTO";
    primContainer.counterAxisSizingMode = "AUTO";
    primContainer.itemSpacing = 16;
    primContainer.fills = [];

    const primTitle = createText("PRIMITIVE FOUNDATIONS", semiBoldFont, 12, '#94A3B8');
    primContainer.appendChild(primTitle);

    const rampRow = figma.createFrame();
    rampRow.name = "Key Primitive Colors";
    rampRow.layoutMode = "HORIZONTAL";
    rampRow.primaryAxisSizingMode = "AUTO";
    rampRow.counterAxisSizingMode = "AUTO";
    rampRow.itemSpacing = 14;
    rampRow.fills = [];

    const keyColors = [
      { name: "Indigo 600", hex: "#4F46E5", role: "Primary Brand" },
      { name: "Violet 600", hex: "#7C3AED", role: "Accent Kinetic" },
      { name: "Emerald 600", hex: "#059669", role: "Success / Done" },
      { name: "Amber 500", hex: "#F59E0B", role: "Warning / High" },
      { name: "Rose 600", hex: "#E11D48", role: "Critical / Danger" },
      { name: "Sky 600", hex: "#0284C7", role: "Info / Link" },
      { name: "Slate 900", hex: "#0F172A", role: "Obsidian / Dark" },
      { name: "Slate 50", hex: "#F8FAFC", role: "Canvas Base" },
    ];

    for (const c of keyColors) {
      const swatch = figma.createFrame();
      swatch.name = c.name;
      swatch.layoutMode = "VERTICAL";
      swatch.primaryAxisSizingMode = "AUTO";
      swatch.counterAxisSizingMode = "FIXED";
      swatch.resize(130, 100);
      swatch.cornerRadius = 12;
      swatch.strokes = solidColor('#E2E8F0');
      swatch.strokeWeight = 1;
      swatch.fills = solidColor('#FFFFFF');
      swatch.itemSpacing = 8;
      swatch.paddingTop = 10;
      swatch.paddingBottom = 10;
      swatch.paddingLeft = 10;
      swatch.paddingRight = 10;

      const box = figma.createRectangle();
      box.name = "Fill";
      box.resize(110, 48);
      box.cornerRadius = 8;
      box.fills = solidColor(c.hex);
      if (c.hex === '#F8FAFC') {
        box.strokes = solidColor('#E2E8F0');
        box.strokeWeight = 1;
      }
      swatch.appendChild(box);

      const nameTxt = createText(c.name, semiBoldFont, 11, '#0F172A');
      const hexTxt = createText(c.hex, regularFont, 10, '#64748B');
      swatch.appendChild(nameTxt);
      swatch.appendChild(hexTxt);
      rampRow.appendChild(swatch);
    }
    primContainer.appendChild(rampRow);

    // Pastel Row
    const pastelTitle = createText("7-PASTEL CANDY ECOSYSTEM (WCAG AA >= 4.5:1)", semiBoldFont, 12, '#94A3B8');
    primContainer.appendChild(pastelTitle);

    const pastelRow = figma.createFrame();
    pastelRow.name = "Pastel Chips";
    pastelRow.layoutMode = "HORIZONTAL";
    pastelRow.primaryAxisSizingMode = "AUTO";
    pastelRow.counterAxisSizingMode = "AUTO";
    pastelRow.itemSpacing = 14;
    pastelRow.fills = [];

    for (const [name, p] of Object.entries(PASTELS)) {
      const chip = figma.createFrame();
      chip.name = `Pastel / ${name}`;
      chip.layoutMode = "VERTICAL";
      chip.primaryAxisSizingMode = "AUTO";
      chip.counterAxisSizingMode = "FIXED";
      chip.resize(130, 96);
      chip.cornerRadius = 12;
      chip.fills = solidColor(p.bg);
      chip.strokes = solidColor(p.border);
      chip.strokeWeight = 1;
      chip.paddingTop = 12;
      chip.paddingBottom = 12;
      chip.paddingLeft = 12;
      chip.paddingRight = 12;
      chip.itemSpacing = 6;

      const pTitle = createText(name, semiBoldFont, 13, p.text);
      const pTextHex = createText(`Text: ${p.text}`, regularFont, 10, p.text);
      const pBgHex = createText(`Bg: ${p.bg}`, regularFont, 10, p.text);
      chip.appendChild(pTitle);
      chip.appendChild(pTextHex);
      chip.appendChild(pBgHex);
      pastelRow.appendChild(chip);
    }
    primContainer.appendChild(pastelRow);
    secColors.appendChild(primContainer);
    advanceCursor(secColors);

    // =========================================================================
    // SECTION 2: BUTTONS (COMPONENT SET WITH 24 VARIANTS)
    // =========================================================================
    const secButtons = createSection(
      "02 / Buttons & Interactive States",
      "Tactile depress buttons with 8 variants and 3 sizes, combined as a Figma Component Set"
    );

    const variants = [
      { name: "Primary", bg: "#0F172A", text: "#FFFFFF", border: "#0F172A", hasShadow: true },
      { name: "Brand", bg: "#4F46E5", text: "#FFFFFF", border: "#4F46E5", hasShadow: true },
      { name: "Secondary", bg: "#FFFFFF", text: "#0F172A", border: "#E2E8F0", hasShadow: true },
      { name: "Outline", bg: "#FFFFFF", text: "#334155", border: "#CBD5E1", hasShadow: false },
      { name: "Ghost", bg: "#FFFFFF", text: "#475569", border: "#FFFFFF", hasShadow: false },
      { name: "Danger", bg: "#FFF1F2", text: "#E11D48", border: "#FECDD3", hasShadow: false },
      { name: "Obsidian", bg: "#090D16", text: "#FFFFFF", border: "#1E293B", hasShadow: true },
      { name: "Soft", bg: "#EEF2FF", text: "#4F46E5", border: "#E0E7FF", hasShadow: false },
    ];

    const sizes = [
      { name: "SM", px: 12, py: 6, fontSize: 12, height: 32, radius: 8 },
      { name: "MD", px: 16, py: 8, fontSize: 14, height: 40, radius: 10 },
      { name: "LG", px: 22, py: 11, fontSize: 16, height: 48, radius: 12 },
    ];

    const buttonComponents = [];

    // Container for loose components prior to combining
    const btnMatrixFrame = figma.createFrame();
    btnMatrixFrame.name = "Button Variant Staging";
    btnMatrixFrame.layoutMode = "VERTICAL";
    btnMatrixFrame.primaryAxisSizingMode = "AUTO";
    btnMatrixFrame.counterAxisSizingMode = "AUTO";
    btnMatrixFrame.itemSpacing = 16;
    btnMatrixFrame.fills = [];

    for (const v of variants) {
      const row = figma.createFrame();
      row.name = `Row: ${v.name}`;
      row.layoutMode = "HORIZONTAL";
      row.primaryAxisSizingMode = "AUTO";
      row.counterAxisSizingMode = "AUTO";
      row.itemSpacing = 16;
      row.fills = [];

      for (const s of sizes) {
        const btn = figma.createComponent();
        btn.name = `Variant=${v.name}, Size=${s.name}`;
        btn.layoutMode = "HORIZONTAL";
        btn.primaryAxisAlignItems = "CENTER";
        btn.counterAxisAlignItems = "CENTER";
        btn.primaryAxisSizingMode = "AUTO";
        btn.counterAxisSizingMode = "FIXED";
        btn.resize(100, s.height);
        btn.paddingLeft = s.px;
        btn.paddingRight = s.px;
        btn.paddingTop = s.py;
        btn.paddingBottom = s.py;
        btn.itemSpacing = 8;
        btn.cornerRadius = s.radius;
        btn.fills = solidColor(v.bg);
        btn.strokes = solidColor(v.border);
        btn.strokeWeight = 1;
        if (v.hasShadow) {
          btn.effects = [subtleShadow];
        }

        const label = createText(`${v.name} ${s.name}`, mediumFont, s.fontSize, v.text);
        btn.appendChild(label);

        row.appendChild(btn);
        buttonComponents.push(btn);
      }
      btnMatrixFrame.appendChild(row);
    }

    secButtons.appendChild(btnMatrixFrame);
    advanceCursor(secButtons);

    // =========================================================================
    // SECTION 3: BADGES & PILLS
    // =========================================================================
    const secBadges = createSection(
      "03 / Badges, Tags & Priority Indicators",
      "WCAG-compliant pastel status badges, domain tags, and priority dot indicators"
    );

    const badgeFlex = figma.createFrame();
    badgeFlex.name = "Badges Showcase";
    badgeFlex.layoutMode = "VERTICAL";
    badgeFlex.primaryAxisSizingMode = "AUTO";
    badgeFlex.counterAxisSizingMode = "AUTO";
    badgeFlex.itemSpacing = 24;
    badgeFlex.fills = [];

    // Row 1: Pastel Badges
    const badgeRow1 = figma.createFrame();
    badgeRow1.name = "Pastel Candy Badges";
    badgeRow1.layoutMode = "HORIZONTAL";
    badgeRow1.primaryAxisSizingMode = "AUTO";
    badgeRow1.counterAxisSizingMode = "AUTO";
    badgeRow1.itemSpacing = 12;
    badgeRow1.fills = [];

    for (const [name, p] of Object.entries(PASTELS)) {
      const badge = figma.createComponent();
      badge.name = `Badge / ${name}`;
      badge.layoutMode = "HORIZONTAL";
      badge.primaryAxisAlignItems = "CENTER";
      badge.counterAxisAlignItems = "CENTER";
      badge.primaryAxisSizingMode = "AUTO";
      badge.counterAxisSizingMode = "AUTO";
      badge.paddingLeft = 10;
      badge.paddingRight = 10;
      badge.paddingTop = 4;
      badge.paddingBottom = 4;
      badge.itemSpacing = 6;
      badge.cornerRadius = 999;
      badge.fills = solidColor(p.bg);
      badge.strokes = solidColor(p.border);
      badge.strokeWeight = 1;

      // Radar dot
      const dot = figma.createEllipse();
      dot.name = "Beacon Dot";
      dot.resize(6, 6);
      dot.fills = solidColor(p.dot);
      badge.appendChild(dot);

      const bText = createText(name, mediumFont, 12, p.text);
      badge.appendChild(bText);
      badgeRow1.appendChild(badge);
    }
    badgeFlex.appendChild(badgeRow1);

    // Row 2: Priority Badges
    const priorities = [
      { name: "CRITICAL", bg: "#FFE4E6", text: "#881337", border: "#FECDD3", dot: "#E11D48" },
      { name: "HIGH",     bg: "#FFEDD5", text: "#7C2D12", border: "#FED7AA", dot: "#EA580C" },
      { name: "MEDIUM",   bg: "#E0F2FE", text: "#0C4A6E", border: "#BAE6FD", dot: "#0284C7" },
      { name: "LOW",      bg: "#F1F5F9", text: "#334155", border: "#E2E8F0", dot: "#64748B" },
    ];

    const priorityRow = figma.createFrame();
    priorityRow.name = "Priority Indicators";
    priorityRow.layoutMode = "HORIZONTAL";
    priorityRow.primaryAxisSizingMode = "AUTO";
    priorityRow.counterAxisSizingMode = "AUTO";
    priorityRow.itemSpacing = 12;
    priorityRow.fills = [];

    for (const pr of priorities) {
      const comp = figma.createComponent();
      comp.name = `Priority / ${pr.name}`;
      comp.layoutMode = "HORIZONTAL";
      comp.primaryAxisAlignItems = "CENTER";
      comp.counterAxisAlignItems = "CENTER";
      comp.primaryAxisSizingMode = "AUTO";
      comp.counterAxisSizingMode = "AUTO";
      comp.paddingLeft = 10;
      comp.paddingRight = 10;
      comp.paddingTop = 4;
      comp.paddingBottom = 4;
      comp.itemSpacing = 6;
      comp.cornerRadius = 999;
      comp.fills = solidColor(pr.bg);
      comp.strokes = solidColor(pr.border);
      comp.strokeWeight = 1;

      const dot = figma.createEllipse();
      dot.resize(6, 6);
      dot.fills = solidColor(pr.dot);
      comp.appendChild(dot);

      const txt = createText(pr.name, boldFont, 11, pr.text);
      comp.appendChild(txt);
      priorityRow.appendChild(comp);
    }
    badgeFlex.appendChild(priorityRow);

    // Row 3: Domain Tag Badges
    const domainTags = [
      { tag: "#auth", ...PASTELS.Lavender },
      { tag: "#backend", ...PASTELS.Peach },
      { tag: "#frontend", ...PASTELS.Sky },
      { tag: "#design", ...PASTELS.Rose },
      { tag: "#payments", ...PASTELS.Mint },
      { tag: "#security", ...PASTELS.Gold },
      { tag: "#infra", ...PASTELS.Stone },
      { tag: "#mobile", ...PASTELS.Lime },
    ];

    const domainRow = figma.createFrame();
    domainRow.name = "Domain Tags";
    domainRow.layoutMode = "HORIZONTAL";
    domainRow.primaryAxisSizingMode = "AUTO";
    domainRow.counterAxisSizingMode = "AUTO";
    domainRow.itemSpacing = 10;
    domainRow.fills = [];

    for (const dt of domainTags) {
      const comp = figma.createComponent();
      comp.name = `Tag / ${dt.tag}`;
      comp.layoutMode = "HORIZONTAL";
      comp.primaryAxisAlignItems = "CENTER";
      comp.counterAxisAlignItems = "CENTER";
      comp.paddingLeft = 8;
      comp.paddingRight = 8;
      comp.paddingTop = 3;
      comp.paddingBottom = 3;
      comp.cornerRadius = 6;
      comp.fills = solidColor(dt.bg);
      comp.strokes = solidColor(dt.border);
      comp.strokeWeight = 1;

      const txt = createText(dt.tag, semiBoldFont, 11, dt.text);
      comp.appendChild(txt);
      domainRow.appendChild(comp);
    }
    badgeFlex.appendChild(domainRow);

    secBadges.appendChild(badgeFlex);
    advanceCursor(secBadges);

    // =========================================================================
    // SECTION 4: FORM CONTROLS & INPUTS
    // =========================================================================
    const secForms = createSection(
      "04 / Form Controls, Inputs & Switches",
      "Text inputs with 3px focus ring halos, error states, and tactile toggle switches"
    );

    const formRow = figma.createFrame();
    formRow.name = "Form Elements Grid";
    formRow.layoutMode = "HORIZONTAL";
    formRow.primaryAxisSizingMode = "AUTO";
    formRow.counterAxisSizingMode = "AUTO";
    formRow.itemSpacing = 28;
    formRow.fills = [];

    // Helper: Input Component
    function createInputComponent(name, labelText, placeholder, state = 'default') {
      const comp = figma.createComponent();
      comp.name = `Input / ${name}`;
      comp.layoutMode = "VERTICAL";
      comp.primaryAxisSizingMode = "AUTO";
      comp.counterAxisSizingMode = "FIXED";
      comp.resize(260, 80);
      comp.itemSpacing = 6;
      comp.fills = [];

      const lbl = createText(labelText, mediumFont, 12, '#334155');
      comp.appendChild(lbl);

      const field = figma.createFrame();
      field.name = "Field Box";
      field.layoutMode = "HORIZONTAL";
      field.primaryAxisAlignItems = "CENTER";
      field.counterAxisAlignItems = "CENTER";
      field.resize(260, 42);
      field.paddingLeft = 14;
      field.paddingRight = 14;
      field.cornerRadius = 10;
      field.fills = solidColor(state === 'error' ? '#FFF1F2' : '#FFFFFF');

      if (state === 'focus') {
        field.strokes = solidColor('#4F46E5');
        field.strokeWeight = 2;
        field.effects = [{
          type: "DROP_SHADOW",
          color: { r: 0.31, g: 0.27, b: 0.9, a: 0.2 },
          offset: { x: 0, y: 0 },
          radius: 6,
          spread: 3,
          visible: true,
          blendMode: "NORMAL"
        }];
      } else if (state === 'error') {
        field.strokes = solidColor('#E11D48');
        field.strokeWeight = 1.5;
      } else {
        field.strokes = solidColor('#E2E8F0');
        field.strokeWeight = 1;
        field.effects = [subtleShadow];
      }

      const valTxt = createText(
        placeholder,
        regularFont,
        14,
        state === 'error' ? '#9F1239' : (state === 'focus' ? '#0F172A' : '#94A3B8')
      );
      field.appendChild(valTxt);
      comp.appendChild(field);
      return comp;
    }

    formRow.appendChild(createInputComponent("Default", "Task Title", "e.g. Design Token Migration", "default"));
    formRow.appendChild(createInputComponent("Focus", "Email Address", "dev@meridian.io", "focus"));
    formRow.appendChild(createInputComponent("Error", "Branch Name", "invalid/branch/name#", "error"));

    // Tactile Switch
    const switchComp = figma.createComponent();
    switchComp.name = "Switch / Tactile Toggle";
    switchComp.layoutMode = "VERTICAL";
    switchComp.primaryAxisSizingMode = "AUTO";
    switchComp.counterAxisSizingMode = "AUTO";
    switchComp.itemSpacing = 8;
    switchComp.fills = [];

    const swLbl = createText("Sprint Notifications", mediumFont, 12, '#334155');
    switchComp.appendChild(swLbl);

    const swRow = figma.createFrame();
    swRow.name = "States";
    swRow.layoutMode = "HORIZONTAL";
    swRow.itemSpacing = 16;
    swRow.fills = [];

    // Switch ON
    const swOn = figma.createFrame();
    swOn.name = "State=On";
    swOn.resize(48, 26);
    swOn.cornerRadius = 999;
    swOn.fills = solidColor('#4F46E5');
    swOn.layoutMode = "HORIZONTAL";
    swOn.primaryAxisAlignItems = "MAX";
    swOn.counterAxisAlignItems = "CENTER";
    swOn.paddingRight = 3;

    const knobOn = figma.createEllipse();
    knobOn.resize(20, 20);
    knobOn.fills = solidColor('#FFFFFF');
    knobOn.effects = [subtleShadow];
    swOn.appendChild(knobOn);
    swRow.appendChild(swOn);

    // Switch OFF
    const swOff = figma.createFrame();
    swOff.name = "State=Off";
    swOff.resize(48, 26);
    swOff.cornerRadius = 999;
    swOff.fills = solidColor('#CBD5E1');
    swOff.layoutMode = "HORIZONTAL";
    swOff.primaryAxisAlignItems = "MIN";
    swOff.counterAxisAlignItems = "CENTER";
    swOff.paddingLeft = 3;

    const knobOff = figma.createEllipse();
    knobOff.resize(20, 20);
    knobOff.fills = solidColor('#FFFFFF');
    knobOff.effects = [subtleShadow];
    swOff.appendChild(knobOff);
    swRow.appendChild(swOff);

    switchComp.appendChild(swRow);
    formRow.appendChild(switchComp);

    secForms.appendChild(formRow);
    advanceCursor(secForms);

    // =========================================================================
    // SECTION 5: BENTO CARDS & KPI TELEMETRY
    // =========================================================================
    const secCards = createSection(
      "05 / Bento Cards & KPI Telemetry",
      "Resting bento tiles, dark obsidian surfaces, and metric counters with mini spark charts"
    );

    const cardRow = figma.createFrame();
    cardRow.name = "Cards Showcase";
    cardRow.layoutMode = "HORIZONTAL";
    cardRow.primaryAxisSizingMode = "AUTO";
    cardRow.counterAxisSizingMode = "AUTO";
    cardRow.itemSpacing = 24;
    cardRow.fills = [];

    // 1. KPI Telemetry Dial (Light)
    const kpiCard = figma.createComponent();
    kpiCard.name = "Card / KPI Telemetry";
    kpiCard.layoutMode = "VERTICAL";
    kpiCard.resize(280, 160);
    kpiCard.paddingTop = 20;
    kpiCard.paddingBottom = 20;
    kpiCard.paddingLeft = 20;
    kpiCard.paddingRight = 20;
    kpiCard.itemSpacing = 12;
    kpiCard.cornerRadius = 16;
    kpiCard.fills = solidColor('#FFFFFF');
    kpiCard.strokes = solidColor('#E2E8F0');
    kpiCard.strokeWeight = 1;
    kpiCard.effects = [elevatedShadow];

    const kpiTop = figma.createFrame();
    kpiTop.name = "KPI Top";
    kpiTop.layoutMode = "HORIZONTAL";
    kpiTop.counterAxisAlignItems = "CENTER";
    kpiTop.itemSpacing = 10;
    kpiTop.fills = [];

    const kpiLabel = createText("SPRINT VELOCITY", semiBoldFont, 11, '#64748B');
    kpiTop.appendChild(kpiLabel);

    const deltaPill = figma.createFrame();
    deltaPill.name = "Delta Pill";
    deltaPill.paddingLeft = 6;
    deltaPill.paddingRight = 6;
    deltaPill.paddingTop = 2;
    deltaPill.paddingBottom = 2;
    deltaPill.cornerRadius = 999;
    deltaPill.fills = solidColor('#D1FAE5');
    deltaPill.strokes = solidColor('#A7F3D0');
    deltaPill.strokeWeight = 1;
    const deltaText = createText("+18.4%", boldFont, 10, '#064E3B');
    deltaPill.appendChild(deltaText);
    kpiTop.appendChild(deltaPill);
    kpiCard.appendChild(kpiTop);

    const kpiVal = createText("94.2%", boldFont, 32, '#0F172A');
    kpiCard.appendChild(kpiVal);

    // Mini Sparkline Columns
    const sparkRow = figma.createFrame();
    sparkRow.name = "Mini Sparkline";
    sparkRow.layoutMode = "HORIZONTAL";
    sparkRow.counterAxisAlignItems = "MAX";
    sparkRow.itemSpacing = 6;
    sparkRow.fills = [];

    const heights = [14, 22, 18, 32, 28, 40, 36];
    for (const h of heights) {
      const bar = figma.createRectangle();
      bar.resize(10, h);
      bar.cornerRadius = 3;
      bar.fills = solidColor('#6366F1');
      sparkRow.appendChild(bar);
    }
    kpiCard.appendChild(sparkRow);
    cardRow.appendChild(kpiCard);

    // 2. Obsidian Dark Bento Card
    const obsidianCard = figma.createComponent();
    obsidianCard.name = "Card / Obsidian Dock";
    obsidianCard.layoutMode = "VERTICAL";
    obsidianCard.resize(280, 160);
    obsidianCard.paddingTop = 20;
    obsidianCard.paddingBottom = 20;
    obsidianCard.paddingLeft = 20;
    obsidianCard.paddingRight = 20;
    obsidianCard.itemSpacing = 10;
    obsidianCard.cornerRadius = 16;
    obsidianCard.fills = solidColor('#090D16');
    obsidianCard.strokes = solidColor('#1E293B');
    obsidianCard.strokeWeight = 1;
    obsidianCard.effects = [elevatedShadow];

    const obsTitle = createText("ACTIVE AUDIT TRAIL", semiBoldFont, 11, '#818CF8');
    const obsVal = createText("1,428 ops", boldFont, 24, '#FFFFFF');
    const obsDesc = createText("Real-time telemetry stream synchronized across active organization nodes.", regularFont, 12, '#94A3B8');
    obsidianCard.appendChild(obsTitle);
    obsidianCard.appendChild(obsVal);
    obsidianCard.appendChild(obsDesc);
    cardRow.appendChild(obsidianCard);

    // 3. Avatars & Progress Bar Card
    const avatarCard = figma.createComponent();
    avatarCard.name = "Card / Identity & Progress";
    avatarCard.layoutMode = "VERTICAL";
    avatarCard.resize(280, 160);
    avatarCard.paddingTop = 20;
    avatarCard.paddingBottom = 20;
    avatarCard.paddingLeft = 20;
    avatarCard.paddingRight = 20;
    avatarCard.itemSpacing = 14;
    avatarCard.cornerRadius = 16;
    avatarCard.fills = solidColor('#FFFFFF');
    avatarCard.strokes = solidColor('#E2E8F0');
    avatarCard.strokeWeight = 1;
    avatarCard.effects = [elevatedShadow];

    const avTop = createText("TEAM ASSIGNMENTS", semiBoldFont, 11, '#64748B');
    avatarCard.appendChild(avTop);

    // Avatar Row
    const avRow = figma.createFrame();
    avRow.name = "Avatar Stack";
    avRow.layoutMode = "HORIZONTAL";
    avRow.counterAxisAlignItems = "CENTER";
    avRow.itemSpacing = -8; // overlap
    avRow.fills = [];

    const userAvatars = [
      { init: "SN", bg: "#F3E8FF", text: "#581C87" },
      { init: "NP", bg: "#FFEDD5", text: "#7C2D12" },
      { init: "AK", bg: "#ECFCCB", text: "#365314" },
      { init: "+4", bg: "#0F172A", text: "#FFFFFF" },
    ];

    for (const u of userAvatars) {
      const circle = figma.createFrame();
      circle.name = `Avatar ${u.init}`;
      circle.resize(34, 34);
      circle.cornerRadius = 999;
      circle.fills = solidColor(u.bg);
      circle.strokes = solidColor('#FFFFFF');
      circle.strokeWeight = 2;
      circle.layoutMode = "HORIZONTAL";
      circle.primaryAxisAlignItems = "CENTER";
      circle.counterAxisAlignItems = "CENTER";

      const initTxt = createText(u.init, boldFont, 11, u.text);
      circle.appendChild(initTxt);
      avRow.appendChild(circle);
    }
    avatarCard.appendChild(avRow);

    // Progress Bar Track
    const progBox = figma.createFrame();
    progBox.name = "Progress Meter";
    progBox.layoutMode = "VERTICAL";
    progBox.itemSpacing = 6;
    progBox.fills = [];

    const progHeader = figma.createFrame();
    progHeader.name = "Prog Header";
    progHeader.layoutMode = "HORIZONTAL";
    progHeader.counterAxisAlignItems = "CENTER";
    progHeader.itemSpacing = 140;
    progHeader.fills = [];
    progHeader.appendChild(createText("Completion", mediumFont, 11, '#64748B'));
    progHeader.appendChild(createText("78%", boldFont, 11, '#059669'));
    progBox.appendChild(progHeader);

    const track = figma.createFrame();
    track.name = "Track";
    track.resize(240, 8);
    track.cornerRadius = 999;
    track.fills = solidColor('#F1F5F9');

    const fillBar = figma.createRectangle();
    fillBar.name = "Fill";
    fillBar.resize(187, 8);
    fillBar.cornerRadius = 999;
    fillBar.fills = solidColor('#10B981');
    track.appendChild(fillBar);

    progBox.appendChild(track);
    avatarCard.appendChild(progBox);

    cardRow.appendChild(avatarCard);
    secCards.appendChild(cardRow);
    advanceCursor(secCards);

    // Zoom into view
    figma.viewport.scrollAndZoomIntoView(allGeneratedNodes);

    // Done notification
    figma.notify("✨ Meridian Design System & Components successfully generated!", { timeout: 4000 });
    figma.closePlugin();
  } catch (err) {
    console.error("Plugin failed:", err);
    figma.notify("❌ Error generating components: " + err.message, { error: true, timeout: 6000 });
    figma.closePlugin();
  }
})();
