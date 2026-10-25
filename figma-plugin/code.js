/**
 * MERIDIAN CLARITY PRO — REAL APPLICATION SCREENS FIGMA GENERATOR
 * Recreates the EXACT visual screens of the Meridian Next.js application:
 * 1. Screen 01: Real Login Page (Split editorial luxury branding + Sign-in card)
 * 2. Screen 02: Real Workspace Onboarding (Floating Island HUD + Sidebar + "Welcome to Meridian" bento cards)
 * 3. Screen 03: Real Kanban Board - Empty State (Real Sidebar + Floating HUD + 4 Metric cards + Empty State)
 * 4. Screen 04: Real Create Task Modal (Frosted glass blur + tactile priority pills + form inputs)
 * 5. Screen 05: Real Kanban Board - Populated Sprint (Active swimlanes with real deliverable cards)
 * 6. Screen 06: Real Task Detail Slide-Over Drawer (MRD-001 specs, subtasks checklist, comments)
 * 7. Screen 07: Real Activity & Analytics Dashboard (Velocity histograms & KPI dials)
 * 8. Screen 08: Real Calendar & Schedule (Monthly grid with color-coded milestone pills)
 * 9. Screen 09: Real Members & Team Directory (Organization member directory & presence)
 * 10. Screen 10: Real Design System Showcase (/design-system playground)
 */

figma.showUI(__html__, { width: 380, height: 490, title: "Meridian Studio" });

// =============================================================================
// COLOR PALETTE & FONTS (EXACT MERIDIAN TAILWIND & FIGMA FOUNDATIONS)
// =============================================================================

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

const modalShadow = {
  type: "DROP_SHADOW",
  color: { r: 0.0, g: 0.0, b: 0.0, a: 0.25 },
  offset: { x: 0, y: 20 },
  radius: 40,
  spread: -10,
  visible: true,
  blendMode: "NORMAL"
};

let regularFont = { family: "Inter", style: "Regular" };
let mediumFont = { family: "Inter", style: "Medium" };
let semiBoldFont = { family: "Inter", style: "Semi Bold" };
let boldFont = { family: "Inter", style: "Bold" };
let serifItalicFont = { family: "Georgia", style: "Italic" };

async function ensureFonts() {
  try {
    await figma.loadFontAsync(regularFont);
    await figma.loadFontAsync(mediumFont);
    await figma.loadFontAsync(semiBoldFont);
    await figma.loadFontAsync(boldFont);
  } catch (e) {
    regularFont = { family: "Roboto", style: "Regular" };
    mediumFont = { family: "Roboto", style: "Medium" };
    semiBoldFont = { family: "Roboto", style: "Bold" };
    boldFont = { family: "Roboto", style: "Bold" };
    await figma.loadFontAsync(regularFont);
    await figma.loadFontAsync(mediumFont);
    await figma.loadFontAsync(semiBoldFont);
    await figma.loadFontAsync(boldFont);
  }

  try {
    const instSerif = { family: "Instrument Serif", style: "Italic" };
    await figma.loadFontAsync(instSerif);
    serifItalicFont = instSerif;
  } catch (e) {
    try {
      await figma.loadFontAsync(serifItalicFont);
    } catch (e2) {
      serifItalicFont = semiBoldFont;
    }
  }
}

function createText(text, font = regularFont, size = 14, colorHex = '#0F172A') {
  const node = figma.createText();
  node.fontName = font;
  node.characters = String(text);
  node.fontSize = size;
  node.fills = solidColor(colorHex);
  return node;
}

function getOrCreatePage(name, fallbackId) {
  for (const page of figma.root.children) {
    if (page.name.toLowerCase() === name.toLowerCase() || page.id === fallbackId) {
      return page;
    }
  }
  const newPage = figma.createPage();
  newPage.name = name;
  return newPage;
}

function createDesktopFrame(name, x, y, bgHex = '#FBFBFB') {
  const frame = figma.createFrame();
  frame.name = name;
  frame.x = x;
  frame.y = y;
  frame.resize(1440, 900);
  frame.clipsContent = true;
  frame.cornerRadius = 16;
  frame.fills = solidColor(bgHex);
  frame.strokes = solidColor('#E2E8F0');
  frame.strokeWeight = 1;
  frame.effects = [elevatedShadow];
  return frame;
}

function createHUDLabel(parent, numberStr, title, category, x, y) {
  const hud = figma.createFrame();
  hud.name = `HUD: ${numberStr} ${title}`;
  hud.x = x;
  hud.y = y - 48;
  hud.layoutMode = 'HORIZONTAL';
  hud.counterAxisAlignItems = 'CENTER';
  hud.itemSpacing = 12;
  hud.fills = [];

  const catPill = figma.createFrame();
  catPill.paddingLeft = 8;
  catPill.paddingRight = 8;
  catPill.paddingTop = 3;
  catPill.paddingBottom = 3;
  catPill.cornerRadius = 6;
  catPill.fills = solidColor('#EEF2FF');
  catPill.strokes = solidColor('#C7D2FE');
  catPill.strokeWeight = 1;
  catPill.appendChild(createText(category.toUpperCase(), semiBoldFont, 10, '#4338CA'));
  hud.appendChild(catPill);

  const t = createText(`${numberStr} · ${title}`, boldFont, 16, '#0F172A');
  hud.appendChild(t);

  const spec = createText("1440 × 900 · Real Application Canvas", regularFont, 12, '#64748B');
  hud.appendChild(spec);

  parent.appendChild(hud);
}

// =============================================================================
// REAL MERIDIAN APPLICATION SHELL: SIDEBAR & FLOATING DYNAMIC ISLAND
// =============================================================================

// 1. The Real Sidebar (Exact match of src/components/sidebar.jsx)
function drawRealSidebar(parent, activeItem = 'Overview') {
  const sb = figma.createFrame();
  sb.name = "Real Sidebar (w-260)";
  sb.x = 0;
  sb.y = 0;
  sb.resize(260, 900);
  sb.fills = solidColor('#FFFFFF');
  sb.strokes = solidColor('#F1F5F9');
  sb.strokeWeight = 1;
  sb.paddingLeft = 18;
  sb.paddingRight = 18;
  sb.paddingTop = 20;
  sb.paddingBottom = 20;
  sb.layoutMode = "VERTICAL";
  sb.itemSpacing = 18;

  // 1. Brand Lockup
  const brand = figma.createFrame();
  brand.name = "Brand Lockup";
  brand.layoutMode = "HORIZONTAL";
  brand.counterAxisAlignItems = "CENTER";
  brand.itemSpacing = 10;
  brand.fills = [];

  const mCircle = figma.createFrame();
  mCircle.resize(32, 32);
  mCircle.cornerRadius = 999;
  mCircle.fills = solidColor('#090D16');
  mCircle.layoutMode = "HORIZONTAL";
  mCircle.primaryAxisAlignItems = "CENTER";
  mCircle.counterAxisAlignItems = "CENTER";
  mCircle.appendChild(createText("M", serifItalicFont, 16, '#FFFFFF'));
  brand.appendChild(mCircle);

  const bTitles = figma.createFrame();
  bTitles.layoutMode = "VERTICAL";
  bTitles.itemSpacing = 1;
  bTitles.fills = [];

  const topRow = figma.createFrame();
  topRow.layoutMode = "HORIZONTAL";
  topRow.counterAxisAlignItems = "CENTER";
  topRow.itemSpacing = 6;
  topRow.fills = [];
  topRow.appendChild(createText("Meridian", boldFont, 13, '#0F172A'));
  topRow.appendChild(createText("Clarity", serifItalicFont, 13, '#64748B'));

  const proBadge = figma.createFrame();
  proBadge.paddingLeft = 5;
  proBadge.paddingRight = 5;
  proBadge.paddingTop = 1;
  proBadge.paddingBottom = 1;
  proBadge.cornerRadius = 999;
  proBadge.fills = solidColor('#ECFCCB');
  proBadge.appendChild(createText("PRO", boldFont, 9, '#365314'));
  topRow.appendChild(proBadge);

  bTitles.appendChild(topRow);
  bTitles.appendChild(createText("Workspace System", regularFont, 10, '#94A3B8'));
  brand.appendChild(bTitles);

  sb.appendChild(brand);

  // 2. Main Menu Section
  const menuBox = figma.createFrame();
  menuBox.name = "Main Menu";
  menuBox.layoutMode = "VERTICAL";
  menuBox.itemSpacing = 3;
  menuBox.fills = [];

  const menuLbl = createText("MAIN MENU", boldFont, 9, '#94A3B8');
  menuBox.appendChild(menuLbl);

  const navItems = [
    { name: "Overview", icon: "⌂" },
    { name: "Organization", icon: "🏢" },
    { name: "Tasks Board", icon: "⊞" },
    { name: "Schedule", icon: "📅" },
    { name: "Activity", icon: "📊" },
    { name: "Members", icon: "👥" },
    { name: "Chat", icon: "💬" },
    { name: "Design System", icon: "✦" },
    { name: "Settings", icon: "⚙" },
  ];

  for (const item of navItems) {
    const isActive = item.name.toLowerCase() === activeItem.toLowerCase();
    const btn = figma.createFrame();
    btn.resize(224, 34);
    btn.cornerRadius = 10;
    btn.paddingLeft = 10;
    btn.paddingRight = 10;
    btn.layoutMode = "HORIZONTAL";
    btn.counterAxisAlignItems = "CENTER";
    btn.itemSpacing = 10;
    btn.fills = solidColor(isActive ? '#090D16' : '#FFFFFF');

    btn.appendChild(createText(item.icon, regularFont, 12, isActive ? '#84CC16' : '#64748B'));
    btn.appendChild(createText(item.name, semiBoldFont, 12, isActive ? '#FFFFFF' : '#334155'));
    menuBox.appendChild(btn);
  }
  sb.appendChild(menuBox);

  // 3. Spaces
  const spaces = figma.createFrame();
  spaces.name = "Spaces";
  spaces.layoutMode = "VERTICAL";
  spaces.itemSpacing = 6;
  spaces.fills = [];

  const spHeader = figma.createFrame();
  spHeader.layoutMode = "HORIZONTAL";
  spHeader.primaryAxisAlignItems = "SPACE_BETWEEN";
  spHeader.counterAxisAlignItems = "CENTER";
  spHeader.resize(224, 16);
  spHeader.fills = [];
  spHeader.appendChild(createText("SPACES", boldFont, 9, '#94A3B8'));
  spHeader.appendChild(createText("+", regularFont, 12, '#94A3B8'));
  spaces.appendChild(spHeader);

  const spItems = [
    { name: "Publications", dot: "#F43F5E" },
    { name: "Commercial", dot: "#8B5CF6" },
    { name: "Design Internal", dot: "#10B981" },
  ];
  for (const s of spItems) {
    const sRow = figma.createFrame();
    sRow.layoutMode = "HORIZONTAL";
    sRow.counterAxisAlignItems = "CENTER";
    sRow.itemSpacing = 8;
    sRow.fills = [];
    const d = figma.createEllipse();
    d.resize(6, 6);
    d.fills = solidColor(s.dot);
    sRow.appendChild(d);
    sRow.appendChild(createText(s.name, mediumFont, 11, '#475569'));
    spaces.appendChild(sRow);
  }
  sb.appendChild(spaces);

  // 4. Presence
  const pres = figma.createFrame();
  pres.name = "Presence";
  pres.layoutMode = "VERTICAL";
  pres.itemSpacing = 6;
  pres.fills = [];

  const prHeader = figma.createFrame();
  prHeader.layoutMode = "HORIZONTAL";
  prHeader.primaryAxisAlignItems = "SPACE_BETWEEN";
  prHeader.counterAxisAlignItems = "CENTER";
  prHeader.resize(224, 16);
  prHeader.fills = [];
  prHeader.appendChild(createText("PRESENCE", boldFont, 9, '#94A3B8'));
  prHeader.appendChild(createText("+", regularFont, 12, '#94A3B8'));
  pres.appendChild(prHeader);

  const pRow = figma.createFrame();
  pRow.layoutMode = "HORIZONTAL";
  pRow.primaryAxisAlignItems = "SPACE_BETWEEN";
  pRow.counterAxisAlignItems = "CENTER";
  pRow.resize(224, 24);
  pRow.fills = [];

  const leftUser = figma.createFrame();
  leftUser.layoutMode = "HORIZONTAL";
  leftUser.counterAxisAlignItems = "CENTER";
  leftUser.itemSpacing = 8;
  leftUser.fills = [];
  const uDot = figma.createFrame();
  uDot.resize(18, 18);
  uDot.cornerRadius = 999;
  uDot.fills = solidColor('#8B5CF6');
  uDot.layoutMode = "HORIZONTAL";
  uDot.primaryAxisAlignItems = "CENTER";
  uDot.counterAxisAlignItems = "CENTER";
  uDot.appendChild(createText("AJ", boldFont, 8, '#FFFFFF'));
  leftUser.appendChild(uDot);
  leftUser.appendChild(createText("Alex Johnson", mediumFont, 11, '#334155'));
  pRow.appendChild(leftUser);

  pRow.appendChild(createText("Online", regularFont, 10, '#64748B'));
  pres.appendChild(pRow);
  sb.appendChild(pres);

  // Bottom profile
  const spacer = figma.createFrame();
  spacer.resize(224, 18);
  spacer.fills = [];
  sb.appendChild(spacer);

  const profile = figma.createFrame();
  profile.name = "Footer User";
  profile.resize(224, 40);
  profile.layoutMode = "HORIZONTAL";
  profile.primaryAxisAlignItems = "SPACE_BETWEEN";
  profile.counterAxisAlignItems = "CENTER";
  profile.fills = [];

  const pLeft = figma.createFrame();
  pLeft.layoutMode = "HORIZONTAL";
  pLeft.counterAxisAlignItems = "CENTER";
  pLeft.itemSpacing = 8;
  pLeft.fills = [];
  const nCircle = figma.createFrame();
  nCircle.resize(28, 28);
  nCircle.cornerRadius = 999;
  nCircle.fills = solidColor('#090D16');
  nCircle.layoutMode = "HORIZONTAL";
  nCircle.primaryAxisAlignItems = "CENTER";
  nCircle.counterAxisAlignItems = "CENTER";
  nCircle.appendChild(createText("N", boldFont, 11, '#FFFFFF'));
  pLeft.appendChild(nCircle);

  const pDetails = figma.createFrame();
  pDetails.layoutMode = "VERTICAL";
  pDetails.itemSpacing = 1;
  pDetails.fills = [];
  pDetails.appendChild(createText("Alex Johnson", boldFont, 11, '#0F172A'));
  pDetails.appendChild(createText("alex.johnson@meridian.io", regularFont, 9, '#94A3B8'));
  pLeft.appendChild(pDetails);

  profile.appendChild(pLeft);
  profile.appendChild(createText("[→", regularFont, 11, '#94A3B8'));
  sb.appendChild(profile);

  parent.appendChild(sb);
}

// 2. The Real Floating Dynamic Island HUD (Exact match of src/components/DynamicHeader.jsx)
function drawRealDynamicHeader(parent) {
  const container = figma.createFrame();
  container.name = "Dynamic Header Area";
  container.x = 260;
  container.y = 0;
  container.resize(1180, 80);
  container.fills = [];
  container.layoutMode = "HORIZONTAL";
  container.primaryAxisAlignItems = "SPACE_BETWEEN";
  container.counterAxisAlignItems = "CENTER";
  container.paddingLeft = 32;
  container.paddingRight = 32;

  // Center Obsidian Dynamic Island Capsule
  const island = figma.createFrame();
  island.name = "Obsidian Dynamic Island Capsule";
  island.resize(650, 46);
  island.cornerRadius = 999;
  island.fills = solidColor('#090D16');
  island.strokes = solidColor('#1E293B');
  island.strokeWeight = 1;
  island.effects = [elevatedShadow];
  island.paddingLeft = 16;
  island.paddingRight = 16;
  island.layoutMode = "HORIZONTAL";
  island.counterAxisAlignItems = "CENTER";
  island.itemSpacing = 14;

  // Segment 1: Workspace
  const s1 = figma.createFrame();
  s1.layoutMode = "HORIZONTAL";
  s1.counterAxisAlignItems = "CENTER";
  s1.itemSpacing = 6;
  s1.fills = [];
  const wDot = figma.createEllipse();
  wDot.resize(6, 6);
  wDot.fills = solidColor('#84CC16');
  s1.appendChild(wDot);
  s1.appendChild(createText("WORKSPACE", boldFont, 9, '#84CC16'));
  s1.appendChild(createText("Select Workspace ▾", semiBoldFont, 11, '#FFFFFF'));
  island.appendChild(s1);

  island.appendChild(createText("|", regularFont, 12, '#334155'));

  // Segment 2: Active Sprint
  const s2 = figma.createFrame();
  s2.layoutMode = "HORIZONTAL";
  s2.counterAxisAlignItems = "CENTER";
  s2.itemSpacing = 6;
  s2.fills = [];
  s2.appendChild(createText("📅", regularFont, 10, '#94A3B8'));
  s2.appendChild(createText("Active Sprint", semiBoldFont, 11, '#FFFFFF'));
  s2.appendChild(createText("0 tasks", regularFont, 10, '#94A3B8'));
  const actPill = figma.createFrame();
  actPill.layoutMode = "HORIZONTAL";
  actPill.counterAxisAlignItems = "CENTER";
  actPill.itemSpacing = 4;
  actPill.paddingLeft = 6;
  actPill.paddingRight = 6;
  actPill.paddingTop = 2;
  actPill.paddingBottom = 2;
  actPill.cornerRadius = 999;
  actPill.fills = solidColor('#064E3B');
  const aDot = figma.createEllipse();
  aDot.resize(4, 4);
  aDot.fills = solidColor('#34D399');
  actPill.appendChild(aDot);
  actPill.appendChild(createText("Active ▾", boldFont, 9, '#34D399'));
  s2.appendChild(actPill);
  island.appendChild(s2);

  island.appendChild(createText("|", regularFont, 12, '#334155'));

  // Segment 3: User Presence
  const s3 = figma.createFrame();
  s3.layoutMode = "HORIZONTAL";
  s3.counterAxisAlignItems = "CENTER";
  s3.itemSpacing = 6;
  s3.fills = [];
  const av1 = figma.createFrame();
  av1.resize(18, 18);
  av1.cornerRadius = 999;
  av1.fills = solidColor('#8B5CF6');
  av1.layoutMode = "HORIZONTAL";
  av1.primaryAxisAlignItems = "CENTER";
  av1.counterAxisAlignItems = "CENTER";
  av1.appendChild(createText("AJ", boldFont, 8, '#FFFFFF'));
  s3.appendChild(av1);
  s3.appendChild(createText("1 active ▾", regularFont, 11, '#CBD5E1'));
  island.appendChild(s3);

  container.appendChild(island);

  // Right Side: Bell, Search, + New Task
  const rCluster = figma.createFrame();
  rCluster.layoutMode = "HORIZONTAL";
  rCluster.counterAxisAlignItems = "CENTER";
  rCluster.itemSpacing = 12;
  rCluster.fills = [];

  // Bell
  const bell = figma.createFrame();
  bell.resize(36, 36);
  bell.cornerRadius = 999;
  bell.fills = solidColor('#FFFFFF');
  bell.strokes = solidColor('#E2E8F0');
  bell.strokeWeight = 1;
  bell.layoutMode = "HORIZONTAL";
  bell.primaryAxisAlignItems = "CENTER";
  bell.counterAxisAlignItems = "CENTER";
  bell.appendChild(createText("🔔", regularFont, 13, '#334155'));
  rCluster.appendChild(bell);

  // Search
  const search = figma.createFrame();
  search.resize(170, 36);
  search.cornerRadius = 999;
  search.fills = solidColor('#FFFFFF');
  search.strokes = solidColor('#E2E8F0');
  search.strokeWeight = 1;
  search.paddingLeft = 12;
  search.paddingRight = 12;
  search.layoutMode = "HORIZONTAL";
  search.primaryAxisAlignItems = "SPACE_BETWEEN";
  search.counterAxisAlignItems = "CENTER";
  search.appendChild(createText("Search workspace...", regularFont, 11, '#94A3B8'));
  search.appendChild(createText("⌘K", boldFont, 9, '#CBD5E1'));
  rCluster.appendChild(search);

  // + New Task Button
  const btnTask = figma.createFrame();
  btnTask.resize(108, 36);
  btnTask.cornerRadius = 999;
  btnTask.fills = solidColor('#090D16');
  btnTask.effects = [subtleShadow];
  btnTask.layoutMode = "HORIZONTAL";
  btnTask.primaryAxisAlignItems = "CENTER";
  btnTask.counterAxisAlignItems = "CENTER";
  btnTask.itemSpacing = 6;
  const plusDot = figma.createFrame();
  plusDot.resize(16, 16);
  plusDot.cornerRadius = 999;
  plusDot.fills = solidColor('#22C55E');
  plusDot.layoutMode = "HORIZONTAL";
  plusDot.primaryAxisAlignItems = "CENTER";
  plusDot.counterAxisAlignItems = "CENTER";
  plusDot.appendChild(createText("+", boldFont, 11, '#FFFFFF'));
  btnTask.appendChild(plusDot);
  btnTask.appendChild(createText("New Task", boldFont, 11, '#FFFFFF'));
  rCluster.appendChild(btnTask);

  container.appendChild(rCluster);
  parent.appendChild(container);
}

// =============================================================================
// SCREEN 01: REAL LOGIN PAGE (src/app/page.js)
// =============================================================================
function drawScreen01_RealLogin(parent, x, y) {
  createHUDLabel(parent, "01", "Real Login Page (Split Auth)", "Authentication", x, y);
  const screen = createDesktopFrame("01 / Screen - Real Login", x, y, '#FAF8F5');

  // Left Showcase Panel
  const left = figma.createFrame();
  left.name = "Left Editorial Panel";
  left.x = 0;
  left.y = 0;
  left.resize(960, 900);
  left.fills = solidColor('#FAF8F5');
  left.paddingTop = 64;
  left.paddingBottom = 64;
  left.paddingLeft = 72;
  left.paddingRight = 72;
  left.layoutMode = "VERTICAL";
  left.itemSpacing = 36;

  // Header Brand
  const hb = figma.createFrame();
  hb.layoutMode = "HORIZONTAL";
  hb.counterAxisAlignItems = "CENTER";
  hb.itemSpacing = 12;
  hb.fills = [];
  const mBox = figma.createFrame();
  mBox.resize(40, 40);
  mBox.cornerRadius = 14;
  mBox.fills = solidColor('#090D16');
  mBox.layoutMode = "HORIZONTAL";
  mBox.primaryAxisAlignItems = "CENTER";
  mBox.counterAxisAlignItems = "CENTER";
  mBox.appendChild(createText("M", serifItalicFont, 22, '#FFFFFF'));
  hb.appendChild(mBox);

  const titles = figma.createFrame();
  titles.layoutMode = "VERTICAL";
  titles.itemSpacing = 2;
  titles.fills = [];
  const l1 = figma.createFrame();
  l1.layoutMode = "HORIZONTAL";
  l1.counterAxisAlignItems = "CENTER";
  l1.itemSpacing = 6;
  l1.fills = [];
  l1.appendChild(createText("Meridian", boldFont, 18, '#0F172A'));
  l1.appendChild(createText("Clarity", serifItalicFont, 18, '#64748B'));
  const pro = figma.createFrame();
  pro.paddingLeft = 6;
  pro.paddingRight = 6;
  pro.paddingTop = 2;
  pro.paddingBottom = 2;
  pro.cornerRadius = 999;
  pro.fills = solidColor('#D9F99D');
  pro.appendChild(createText("PRO", boldFont, 9, '#365314'));
  l1.appendChild(pro);
  titles.appendChild(l1);
  titles.appendChild(createText("Enterprise Workspace System", regularFont, 11, '#64748B'));
  hb.appendChild(titles);
  left.appendChild(hb);

  // Big Headline with highlights
  const hBox = figma.createFrame();
  hBox.layoutMode = "VERTICAL";
  hBox.itemSpacing = 12;
  hBox.fills = [];
  hBox.appendChild(createText("Where exceptional teams\nbuild iconic products.", serifItalicFont, 50, '#0F172A'));
  hBox.appendChild(createText("Meridian brings your deliverables, sprint velocity, calendar schedules, and team channels into one unified, ultra-premium interface.", regularFont, 14, '#475569'));
  left.appendChild(hBox);

  // 4 Features Bento Grid
  const grid = figma.createFrame();
  grid.resize(700, 180);
  grid.layoutMode = "HORIZONTAL";
  grid.itemSpacing = 14;
  grid.fills = [];

  const fItems = [
    { title: "Interactive Kanban", sub: "Pastel swimlanes, progress & fast triage", bg: "#EDE9FE", text: "#6D28D9", icon: "⊞" },
    { title: "Dynamic Island", sub: "Live meetings, sprint counters & HUD", bg: "#ECFCCB", text: "#3F6212", icon: "◎" },
    { title: "Speedometers", sub: "Burn-up charts & member velocity", bg: "#FFEDD5", text: "#C2410C", icon: "▦" },
    { title: "Team Directory", sub: "Live hours logged & fast chat", bg: "#E0F2FE", text: "#0369A1", icon: "◫" },
  ];

  for (const f of fItems) {
    const card = figma.createFrame();
    card.resize(164, 160);
    card.cornerRadius = 16;
    card.fills = solidColor('#FFFFFF', 0.85);
    card.strokes = solidColor('#E7E5E4');
    card.strokeWeight = 1;
    card.paddingTop = 16;
    card.paddingLeft = 16;
    card.paddingRight = 16;
    card.layoutMode = "VERTICAL";
    card.itemSpacing = 10;

    const iconBox = figma.createFrame();
    iconBox.resize(32, 32);
    iconBox.cornerRadius = 10;
    iconBox.fills = solidColor(f.bg);
    iconBox.layoutMode = "HORIZONTAL";
    iconBox.primaryAxisAlignItems = "CENTER";
    iconBox.counterAxisAlignItems = "CENTER";
    iconBox.appendChild(createText(f.icon, boldFont, 14, f.text));
    card.appendChild(iconBox);

    card.appendChild(createText(f.title, boldFont, 12, '#0F172A'));
    card.appendChild(createText(f.sub, regularFont, 10, '#64748B'));
    grid.appendChild(card);
  }
  left.appendChild(grid);

  // Social Proof Bar
  const sp = figma.createFrame();
  sp.resize(600, 56);
  sp.cornerRadius = 16;
  sp.fills = solidColor('#FFFFFF', 0.9);
  sp.strokes = solidColor('#E7E5E4');
  sp.strokeWeight = 1;
  sp.paddingLeft = 18;
  sp.paddingRight = 18;
  sp.layoutMode = "HORIZONTAL";
  sp.primaryAxisAlignItems = "SPACE_BETWEEN";
  sp.counterAxisAlignItems = "CENTER";

  const spLeft = figma.createFrame();
  spLeft.layoutMode = "HORIZONTAL";
  spLeft.counterAxisAlignItems = "CENTER";
  spLeft.itemSpacing = 10;
  spLeft.fills = [];
  spLeft.appendChild(createText("Trusted by 12,000+ product designers & engineering leads", mediumFont, 12, '#475569'));
  sp.appendChild(spLeft);

  const upBadge = figma.createFrame();
  upBadge.paddingLeft = 8;
  upBadge.paddingRight = 8;
  upBadge.paddingTop = 3;
  upBadge.paddingBottom = 3;
  upBadge.cornerRadius = 999;
  upBadge.fills = solidColor('#ECFCCB');
  upBadge.appendChild(createText("99.9% Uptime", boldFont, 10, '#365314'));
  sp.appendChild(upBadge);
  left.appendChild(sp);

  screen.appendChild(left);

  // Right Sign-in Panel
  const right = figma.createFrame();
  right.name = "Right Sign-In Card";
  right.x = 960;
  right.y = 0;
  right.resize(480, 900);
  right.fills = solidColor('#FFFFFF');
  right.strokes = solidColor('#E7E5E4');
  right.strokeWeight = 1;
  right.paddingTop = 64;
  right.paddingLeft = 56;
  right.paddingRight = 56;
  right.layoutMode = "VERTICAL";
  right.itemSpacing = 20;

  // Header
  const rh = figma.createFrame();
  rh.layoutMode = "VERTICAL";
  rh.itemSpacing = 4;
  rh.fills = [];
  rh.appendChild(createText("Welcome back", boldFont, 26, '#0F172A'));
  rh.appendChild(createText("Access your team workspace and sprint deliverables", regularFont, 12, '#64748B'));
  right.appendChild(rh);

  // Demo Login Quick-Fill Button
  const dBtn = figma.createFrame();
  dBtn.resize(368, 42);
  dBtn.cornerRadius = 12;
  dBtn.fills = solidColor('#EEF2FF');
  dBtn.strokes = solidColor('#C7D2FE');
  dBtn.strokeWeight = 1;
  dBtn.layoutMode = "HORIZONTAL";
  dBtn.primaryAxisAlignItems = "CENTER";
  dBtn.counterAxisAlignItems = "CENTER";
  dBtn.appendChild(createText("⚡ Demo Account (Alex Johnson)", boldFont, 12, '#4338CA'));
  right.appendChild(dBtn);

  // Social SSO
  const sso = figma.createFrame();
  sso.layoutMode = "HORIZONTAL";
  sso.itemSpacing = 10;
  sso.fills = [];
  for (const provider of ["Google", "GitHub"]) {
    const b = figma.createFrame();
    b.resize(179, 38);
    b.cornerRadius = 10;
    b.fills = solidColor('#FFFFFF');
    b.strokes = solidColor('#CBD5E1');
    b.strokeWeight = 1;
    b.layoutMode = "HORIZONTAL";
    b.primaryAxisAlignItems = "CENTER";
    b.counterAxisAlignItems = "CENTER";
    b.appendChild(createText(provider, boldFont, 12, '#334155'));
    sso.appendChild(b);
  }
  right.appendChild(sso);

  // Inputs
  function drawInp(lbl, val) {
    const box = figma.createFrame();
    box.layoutMode = "VERTICAL";
    box.itemSpacing = 6;
    box.fills = [];
    box.appendChild(createText(lbl, boldFont, 11, '#475569'));
    const f = figma.createFrame();
    f.resize(368, 42);
    f.cornerRadius = 10;
    f.fills = solidColor('#FFFFFF');
    f.strokes = solidColor('#CBD5E1');
    f.strokeWeight = 1;
    f.paddingLeft = 14;
    f.layoutMode = "HORIZONTAL";
    f.counterAxisAlignItems = "CENTER";
    f.appendChild(createText(val, regularFont, 13, '#0F172A'));
    box.appendChild(f);
    return box;
  }

  right.appendChild(drawInp("Work Email", "alex.johnson@meridian.io"));
  right.appendChild(drawInp("Password", "••••••••••••"));

  // Submit Button
  const sub = figma.createFrame();
  sub.resize(368, 44);
  sub.cornerRadius = 12;
  sub.fills = solidColor('#090D16');
  sub.layoutMode = "HORIZONTAL";
  sub.primaryAxisAlignItems = "CENTER";
  sub.counterAxisAlignItems = "CENTER";
  sub.appendChild(createText("Sign In to Workspace", boldFont, 13, '#FFFFFF'));
  right.appendChild(sub);

  right.appendChild(createText("Don't have an account? Sign up here", regularFont, 11, '#6366F1'));

  screen.appendChild(right);
  parent.appendChild(screen);
}

// =============================================================================
// SCREEN 02: REAL WORKSPACE ONBOARDING (src/components/OrgOnboarding.jsx)
// =============================================================================
function drawScreen02_RealOnboarding(parent, x, y) {
  createHUDLabel(parent, "02", "Workspace Onboarding (Empty Org)", "Workspace Setup", x, y);
  const screen = createDesktopFrame("02 / Screen - Real Onboarding", x, y, '#FBFBFB');

  drawRealSidebar(screen, "Overview");
  drawRealDynamicHeader(screen);

  // Center Hero Area
  const center = figma.createFrame();
  center.x = 260;
  center.y = 120;
  center.resize(1180, 720);
  center.layoutMode = "VERTICAL";
  center.primaryAxisAlignItems = "CENTER";
  center.counterAxisAlignItems = "CENTER";
  center.itemSpacing = 24;
  center.fills = [];

  // Badge: ⚡ Meridian Onboarding
  const onbBadge = figma.createFrame();
  onbBadge.paddingLeft = 10;
  onbBadge.paddingRight = 10;
  onbBadge.paddingTop = 4;
  onbBadge.paddingBottom = 4;
  onbBadge.cornerRadius = 999;
  onbBadge.fills = solidColor('#F8FAFC');
  onbBadge.strokes = solidColor('#E2E8F0');
  onbBadge.strokeWeight = 1;
  onbBadge.layoutMode = "HORIZONTAL";
  onbBadge.counterAxisAlignItems = "CENTER";
  onbBadge.itemSpacing = 6;
  onbBadge.appendChild(createText("⚡", regularFont, 11, '#0F172A'));
  onbBadge.appendChild(createText("Meridian Onboarding", serifItalicFont, 12, '#334155'));
  center.appendChild(onbBadge);

  // Title: Welcome to Meridian
  const hText = figma.createFrame();
  hText.layoutMode = "HORIZONTAL";
  hText.counterAxisAlignItems = "CENTER";
  hText.itemSpacing = 8;
  hText.fills = [];
  hText.appendChild(createText("Welcome to", regularFont, 48, '#0F172A'));
  hText.appendChild(createText("Meridian", serifItalicFont, 52, '#0F172A'));
  center.appendChild(hText);

  center.appendChild(createText("Create or join an organization to start collaborating with your team.", regularFont, 14, '#64748B'));

  // 2 Large Bento Cards
  const cardsRow = figma.createFrame();
  cardsRow.layoutMode = "HORIZONTAL";
  cardsRow.itemSpacing = 24;
  cardsRow.fills = [];

  // Card 1: Create Organization
  const c1 = figma.createFrame();
  c1.resize(360, 240);
  c1.cornerRadius = 20;
  c1.fills = solidColor('#FFFFFF');
  c1.strokes = solidColor('#F1F5F9');
  c1.strokeWeight = 1;
  c1.effects = [elevatedShadow];
  c1.paddingTop = 28;
  c1.paddingLeft = 28;
  c1.paddingRight = 28;
  c1.paddingBottom = 28;
  c1.layoutMode = "VERTICAL";
  c1.primaryAxisAlignItems = "SPACE_BETWEEN";

  const c1Top = figma.createFrame();
  c1Top.layoutMode = "VERTICAL";
  c1Top.itemSpacing = 14;
  c1Top.fills = [];
  const bldg = figma.createFrame();
  bldg.resize(44, 44);
  bldg.cornerRadius = 12;
  bldg.fills = solidColor('#090D16');
  bldg.layoutMode = "HORIZONTAL";
  bldg.primaryAxisAlignItems = "CENTER";
  bldg.counterAxisAlignItems = "CENTER";
  bldg.appendChild(createText("🏢", regularFont, 18, '#84CC16'));
  c1Top.appendChild(bldg);

  const t1 = figma.createFrame();
  t1.layoutMode = "HORIZONTAL";
  t1.counterAxisAlignItems = "CENTER";
  t1.itemSpacing = 6;
  t1.fills = [];
  t1.appendChild(createText("Create", regularFont, 22, '#0F172A'));
  t1.appendChild(createText("Organization", serifItalicFont, 24, '#0F172A'));
  c1Top.appendChild(t1);

  c1Top.appendChild(createText("Create a workspace for your company or team.", regularFont, 12, '#64748B'));
  c1.appendChild(c1Top);

  c1.appendChild(createText("Start from scratch →", boldFont, 12, '#0F172A'));
  cardsRow.appendChild(c1);

  // Card 2: Join Organization
  const c2 = figma.createFrame();
  c2.resize(360, 240);
  c2.cornerRadius = 20;
  c2.fills = solidColor('#FFFFFF');
  c2.strokes = solidColor('#F1F5F9');
  c2.strokeWeight = 1;
  c2.effects = [elevatedShadow];
  c2.paddingTop = 28;
  c2.paddingLeft = 28;
  c2.paddingRight = 28;
  c2.paddingBottom = 28;
  c2.layoutMode = "VERTICAL";
  c2.primaryAxisAlignItems = "SPACE_BETWEEN";

  const c2Top = figma.createFrame();
  c2Top.layoutMode = "VERTICAL";
  c2Top.itemSpacing = 14;
  c2Top.fills = [];
  const usr = figma.createFrame();
  usr.resize(44, 44);
  usr.cornerRadius = 12;
  usr.fills = solidColor('#F1F5F9');
  usr.layoutMode = "HORIZONTAL";
  usr.primaryAxisAlignItems = "CENTER";
  usr.counterAxisAlignItems = "CENTER";
  usr.appendChild(createText("👥", regularFont, 18, '#334155'));
  c2Top.appendChild(usr);

  const t2 = figma.createFrame();
  t2.layoutMode = "HORIZONTAL";
  t2.counterAxisAlignItems = "CENTER";
  t2.itemSpacing = 6;
  t2.fills = [];
  t2.appendChild(createText("Join", regularFont, 22, '#0F172A'));
  t2.appendChild(createText("Organization", serifItalicFont, 24, '#0F172A'));
  c2Top.appendChild(t2);

  c2Top.appendChild(createText("Join an existing team using a 6-digit invite code.", regularFont, 12, '#64748B'));
  c2.appendChild(c2Top);

  c2.appendChild(createText("Enter 6-digit code →", boldFont, 12, '#0F172A'));
  cardsRow.appendChild(c2);

  center.appendChild(cardsRow);
  screen.appendChild(center);

  parent.appendChild(screen);
}

// =============================================================================
// SCREEN 03: REAL KANBAN SPRINT BOARD (src/app/kanban/page.js)
// =============================================================================
function drawScreen03_RealKanban(parent, x, y) {
  createHUDLabel(parent, "03", "Real Kanban Board (Sprint View)", "Core Workspace", x, y);
  const screen = createDesktopFrame("03 / Screen - Real Kanban", x, y, '#FBFBFB');

  drawRealSidebar(screen, "Tasks Board");
  drawRealDynamicHeader(screen);

  const mainArea = figma.createFrame();
  mainArea.x = 284;
  mainArea.y = 96;
  mainArea.resize(1124, 780);
  mainArea.layoutMode = "VERTICAL";
  mainArea.itemSpacing = 16;
  mainArea.fills = [];

  // Top Title & View Switcher Bar
  const titleBar = figma.createFrame();
  titleBar.resize(1124, 44);
  titleBar.layoutMode = "HORIZONTAL";
  titleBar.primaryAxisAlignItems = "SPACE_BETWEEN";
  titleBar.counterAxisAlignItems = "CENTER";
  titleBar.fills = [];

  const titleLeft = figma.createFrame();
  titleLeft.layoutMode = "HORIZONTAL";
  titleLeft.counterAxisAlignItems = "CENTER";
  titleLeft.itemSpacing = 8;
  titleLeft.fills = [];
  titleLeft.appendChild(createText("Sprint", boldFont, 28, '#0F172A'));
  titleLeft.appendChild(createText("board", serifItalicFont, 32, '#8B5CF6'));
  titleBar.appendChild(titleLeft);

  // Floating Tabs: Board, List, Timeline, Analytics, Workflow
  const tabs = figma.createFrame();
  tabs.paddingLeft = 4;
  tabs.paddingRight = 4;
  tabs.paddingTop = 4;
  tabs.paddingBottom = 4;
  tabs.cornerRadius = 999;
  tabs.fills = solidColor('#F1F5F9');
  tabs.layoutMode = "HORIZONTAL";
  tabs.counterAxisAlignItems = "CENTER";
  tabs.itemSpacing = 4;

  const bPill = figma.createFrame();
  bPill.paddingLeft = 14;
  bPill.paddingRight = 14;
  bPill.paddingTop = 6;
  bPill.paddingBottom = 6;
  bPill.cornerRadius = 999;
  bPill.fills = solidColor('#090D16');
  bPill.appendChild(createText("⊞ Board", boldFont, 11, '#FFFFFF'));
  tabs.appendChild(bPill);

  for (const t of ["List", "Timeline", "Analytics", "Workflow ●"]) {
    const p = figma.createFrame();
    p.paddingLeft = 12;
    p.paddingRight = 12;
    p.paddingTop = 6;
    p.paddingBottom = 6;
    p.fills = [];
    p.appendChild(createText(t, mediumFont, 11, '#64748B'));
    tabs.appendChild(p);
  }
  titleBar.appendChild(tabs);

  // Right Actions: Share, Priority Sort
  const rActs = figma.createFrame();
  rActs.layoutMode = "HORIZONTAL";
  rActs.itemSpacing = 8;
  rActs.fills = [];
  for (const a of ["Share", "Priority Sort"]) {
    const b = figma.createFrame();
    b.paddingLeft = 12;
    b.paddingRight = 12;
    b.paddingTop = 6;
    b.paddingBottom = 6;
    b.cornerRadius = 8;
    b.fills = solidColor('#FFFFFF');
    b.strokes = solidColor('#E2E8F0');
    b.strokeWeight = 1;
    b.appendChild(createText(a, semiBoldFont, 11, '#334155'));
    rActs.appendChild(b);
  }
  titleBar.appendChild(rActs);
  mainArea.appendChild(titleBar);

  // Full-Width Search Input
  const sInp = figma.createFrame();
  sInp.resize(1124, 38);
  sInp.cornerRadius = 12;
  sInp.fills = solidColor('#FFFFFF');
  sInp.strokes = solidColor('#E2E8F0');
  sInp.strokeWeight = 1;
  sInp.paddingLeft = 14;
  sInp.layoutMode = "HORIZONTAL";
  sInp.counterAxisAlignItems = "CENTER";
  sInp.appendChild(createText("Search tasks by title, description, or priority...", regularFont, 12, '#94A3B8'));
  mainArea.appendChild(sInp);

  // 4 Pastel Metric Cards with dot histograms
  const cards = figma.createFrame();
  cards.resize(1124, 150);
  cards.layoutMode = "HORIZONTAL";
  cards.itemSpacing = 16;
  cards.fills = [];

  const mDefs = [
    { label: "Active Tasks", count: "0 Total Tasks", val: "0", bg: "#F3E8FF", dotCol: "#C084FC" },
    { label: "In Progress", count: "0 In Flight", val: "0", bg: "#FFEDD5", dotCol: "#FB923C" },
    { label: "Sprint Progress", count: "0% Completed", val: "0%", bg: "#E0F2FE", dotCol: "#38BDF8" },
    { label: "High Priority", count: "0 Urgent", val: "0", bg: "#ECFCCB", dotCol: "#A3E635" },
  ];

  for (const m of mDefs) {
    const card = figma.createFrame();
    card.resize(269, 140);
    card.cornerRadius = 18;
    card.fills = solidColor(m.bg, 0.5);
    card.strokes = solidColor('#FFFFFF');
    card.strokeWeight = 1.5;
    card.paddingTop = 14;
    card.paddingLeft = 18;
    card.paddingRight = 18;
    card.layoutMode = "VERTICAL";
    card.itemSpacing = 8;
    card.effects = [subtleShadow];

    const cTop = figma.createFrame();
    cTop.layoutMode = "HORIZONTAL";
    cTop.primaryAxisAlignItems = "SPACE_BETWEEN";
    cTop.resize(233, 20);
    cTop.fills = [];
    cTop.appendChild(createText("📋", regularFont, 12, '#334155'));
    const p = figma.createFrame();
    p.paddingLeft = 8;
    p.paddingRight = 8;
    p.paddingTop = 2;
    p.paddingBottom = 2;
    p.cornerRadius = 999;
    p.fills = solidColor('#FFFFFF', 0.8);
    p.appendChild(createText(m.count, boldFont, 9, '#475569'));
    cTop.appendChild(p);
    card.appendChild(cTop);

    card.appendChild(createText(m.val, boldFont, 32, '#0F172A'));
    card.appendChild(createText(m.label, regularFont, 11, '#475569'));

    // Dot histogram row
    const dRow = figma.createFrame();
    dRow.layoutMode = "HORIZONTAL";
    dRow.itemSpacing = 6;
    dRow.fills = [];
    for (let i = 0; i < 7; i++) {
      const dot = figma.createEllipse();
      dot.resize(10, 8);
      dot.fills = solidColor(m.dotCol);
      dRow.appendChild(dot);
    }
    card.appendChild(dRow);
    cards.appendChild(card);
  }
  mainArea.appendChild(cards);

  // Real Kanban Empty State Box
  const emptyBox = figma.createFrame();
  emptyBox.resize(1124, 480);
  emptyBox.cornerRadius = 18;
  emptyBox.fills = solidColor('#FFFFFF');
  emptyBox.strokes = solidColor('#F1F5F9');
  emptyBox.strokeWeight = 1;
  emptyBox.layoutMode = "VERTICAL";
  emptyBox.primaryAxisAlignItems = "CENTER";
  emptyBox.counterAxisAlignItems = "CENTER";
  emptyBox.itemSpacing = 16;
  emptyBox.paddingTop = 64;

  const boxIco = figma.createFrame();
  boxIco.resize(48, 48);
  boxIco.cornerRadius = 12;
  boxIco.fills = solidColor('#F1F5F9');
  boxIco.layoutMode = "HORIZONTAL";
  boxIco.primaryAxisAlignItems = "CENTER";
  boxIco.counterAxisAlignItems = "CENTER";
  boxIco.appendChild(createText("📥", regularFont, 20, '#64748B'));
  emptyBox.appendChild(boxIco);

  emptyBox.appendChild(createText("No tasks in this workspace", boldFont, 16, '#0F172A'));
  emptyBox.appendChild(createText("Get started by creating your first deliverable for your workspace.", regularFont, 12, '#64748B'));

  const btnCreateFirst = figma.createFrame();
  btnCreateFirst.resize(160, 40);
  btnCreateFirst.cornerRadius = 12;
  btnCreateFirst.fills = solidColor('#090D16');
  btnCreateFirst.layoutMode = "HORIZONTAL";
  btnCreateFirst.primaryAxisAlignItems = "CENTER";
  btnCreateFirst.counterAxisAlignItems = "CENTER";
  btnCreateFirst.itemSpacing = 6;
  btnCreateFirst.appendChild(createText("+", boldFont, 14, '#FFFFFF'));
  btnCreateFirst.appendChild(createText("Create First Task", boldFont, 12, '#FFFFFF'));
  emptyBox.appendChild(btnCreateFirst);

  mainArea.appendChild(emptyBox);
  screen.appendChild(mainArea);

  parent.appendChild(screen);
}

// =============================================================================
// SCREEN 04: REAL CREATE TASK MODAL (src/components/CreateTaskModal.jsx)
// =============================================================================
function drawScreen04_RealCreateTaskModal(parent, x, y) {
  createHUDLabel(parent, "04", "Create Task Modal (Glass Scrim)", "Task Management", x, y);
  const screen = createDesktopFrame("04 / Screen - Create Task Modal", x, y, '#FBFBFB');

  drawRealSidebar(screen, "Tasks Board");
  drawRealDynamicHeader(screen);

  // Frosted Glass Scrim
  const scrim = figma.createFrame();
  scrim.resize(1440, 900);
  scrim.fills = solidColor('#000000', 0.35);
  screen.appendChild(scrim);

  // Centered Modal Window
  const modal = figma.createFrame();
  modal.name = "Create Task Modal Dialog";
  modal.x = 460;
  modal.y = 120;
  modal.resize(520, 660);
  modal.cornerRadius = 24;
  modal.fills = solidColor('#FFFFFF');
  modal.strokes = solidColor('#E2E8F0');
  modal.strokeWeight = 1;
  modal.effects = [modalShadow];
  modal.paddingTop = 28;
  modal.paddingBottom = 28;
  modal.paddingLeft = 32;
  modal.paddingRight = 32;
  modal.layoutMode = "VERTICAL";
  modal.itemSpacing = 16;

  // Header: + New task (task in purple serif italic)
  const mHead = figma.createFrame();
  mHead.layoutMode = "HORIZONTAL";
  mHead.primaryAxisAlignItems = "SPACE_BETWEEN";
  mHead.counterAxisAlignItems = "CENTER";
  mHead.resize(456, 36);
  mHead.fills = [];

  const hLeft = figma.createFrame();
  hLeft.layoutMode = "HORIZONTAL";
  hLeft.counterAxisAlignItems = "CENTER";
  hLeft.itemSpacing = 10;
  hLeft.fills = [];
  const plBox = figma.createFrame();
  plBox.resize(28, 28);
  plBox.cornerRadius = 999;
  plBox.fills = solidColor('#090D16');
  plBox.layoutMode = "HORIZONTAL";
  plBox.primaryAxisAlignItems = "CENTER";
  plBox.counterAxisAlignItems = "CENTER";
  plBox.appendChild(createText("+", boldFont, 14, '#FFFFFF'));
  hLeft.appendChild(plBox);

  const ht = figma.createFrame();
  ht.layoutMode = "HORIZONTAL";
  ht.counterAxisAlignItems = "CENTER";
  ht.itemSpacing = 6;
  ht.fills = [];
  ht.appendChild(createText("New", boldFont, 18, '#0F172A'));
  ht.appendChild(createText("task", serifItalicFont, 20, '#8B5CF6'));
  hLeft.appendChild(ht);
  mHead.appendChild(hLeft);

  mHead.appendChild(createText("✕", regularFont, 14, '#94A3B8'));
  modal.appendChild(mHead);

  modal.appendChild(createText("Add deliverables to your workspace kanban", regularFont, 11, '#64748B'));

  // Task Title *
  const fTitle = figma.createFrame();
  fTitle.layoutMode = "VERTICAL";
  fTitle.itemSpacing = 4;
  fTitle.fills = [];
  fTitle.appendChild(createText("Task Title *", boldFont, 11, '#334155'));
  const tInp = figma.createFrame();
  tInp.resize(456, 38);
  tInp.cornerRadius = 10;
  tInp.fills = solidColor('#F8FAFC');
  tInp.strokes = solidColor('#E2E8F0');
  tInp.strokeWeight = 1;
  tInp.paddingLeft = 12;
  tInp.layoutMode = "HORIZONTAL";
  tInp.counterAxisAlignItems = "CENTER";
  tInp.appendChild(createText("e.g. Implement OAuth2 Authentication", regularFont, 12, '#94A3B8'));
  fTitle.appendChild(tInp);
  modal.appendChild(fTitle);

  // Description
  const fDesc = figma.createFrame();
  fDesc.layoutMode = "VERTICAL";
  fDesc.itemSpacing = 4;
  fDesc.fills = [];
  fDesc.appendChild(createText("Description", boldFont, 11, '#334155'));
  const dInp = figma.createFrame();
  dInp.resize(456, 64);
  dInp.cornerRadius = 10;
  dInp.fills = solidColor('#F8FAFC');
  dInp.strokes = solidColor('#E2E8F0');
  dInp.strokeWeight = 1;
  dInp.paddingLeft = 12;
  dInp.paddingTop = 10;
  dInp.appendChild(createText("Describe requirements, deliverables, acceptance criteria...", regularFont, 12, '#94A3B8'));
  fDesc.appendChild(dInp);
  modal.appendChild(fDesc);

  // Priority Pills Row
  const fPri = figma.createFrame();
  fPri.layoutMode = "VERTICAL";
  fPri.itemSpacing = 6;
  fPri.fills = [];
  fPri.appendChild(createText("Priority", boldFont, 11, '#334155'));

  const pRow = figma.createFrame();
  pRow.layoutMode = "HORIZONTAL";
  pRow.itemSpacing = 8;
  pRow.fills = [];

  const pris = [
    { name: "Critical", bg: "#FFE4E6", text: "#9F1239", border: "#FECDD3" },
    { name: "High",     bg: "#FFEDD5", text: "#C2410C", border: "#FED7AA" },
    { name: "Medium",   bg: "#4F46E5", text: "#FFFFFF", border: "#4F46E5" }, // Selected!
    { name: "Low",      bg: "#F1F5F9", text: "#475569", border: "#E2E8F0" },
  ];

  for (const pr of pris) {
    const pill = figma.createFrame();
    pill.paddingLeft = 12;
    pill.paddingRight = 12;
    pill.paddingTop = 5;
    pill.paddingBottom = 5;
    pill.cornerRadius = 999;
    pill.fills = solidColor(pr.bg);
    pill.strokes = solidColor(pr.border);
    pill.strokeWeight = 1;
    pill.appendChild(createText(pr.name, boldFont, 11, pr.text));
    pRow.appendChild(pill);
  }
  fPri.appendChild(pRow);
  modal.appendChild(fPri);

  // Status Column
  const fStat = figma.createFrame();
  fStat.layoutMode = "VERTICAL";
  fStat.itemSpacing = 4;
  fStat.fills = [];
  fStat.appendChild(createText("Status Column", boldFont, 11, '#334155'));
  const sDrop = figma.createFrame();
  sDrop.resize(456, 36);
  sDrop.cornerRadius = 8;
  sDrop.fills = solidColor('#F8FAFC');
  sDrop.strokes = solidColor('#E2E8F0');
  sDrop.strokeWeight = 1;
  sDrop.paddingLeft = 12;
  sDrop.paddingRight = 12;
  sDrop.layoutMode = "HORIZONTAL";
  sDrop.primaryAxisAlignItems = "SPACE_BETWEEN";
  sDrop.counterAxisAlignItems = "CENTER";
  sDrop.appendChild(createText("To do", regularFont, 12, '#0F172A'));
  sDrop.appendChild(createText("▾", regularFont, 11, '#64748B'));
  fStat.appendChild(sDrop);
  modal.appendChild(fStat);

  // Assignee warning box
  const fAss = figma.createFrame();
  fAss.resize(456, 40);
  fAss.cornerRadius = 8;
  fAss.fills = solidColor('#FFFBEB');
  fAss.strokes = solidColor('#FDE68A');
  fAss.strokeWeight = 1;
  fAss.paddingLeft = 12;
  fAss.layoutMode = "HORIZONTAL";
  fAss.counterAxisAlignItems = "CENTER";
  fAss.appendChild(createText("No members found in this workspace. Invite members first.", mediumFont, 11, '#D97706'));
  modal.appendChild(fAss);

  // Footer Actions: Cancel + Create Task
  const mFoot = figma.createFrame();
  mFoot.layoutMode = "HORIZONTAL";
  mFoot.primaryAxisAlignItems = "MAX";
  mFoot.counterAxisAlignItems = "CENTER";
  mFoot.itemSpacing = 12;
  mFoot.resize(456, 40);
  mFoot.fills = [];
  mFoot.appendChild(createText("Cancel", mediumFont, 12, '#64748B'));

  const btnSub = figma.createFrame();
  btnSub.paddingLeft = 16;
  btnSub.paddingRight = 16;
  btnSub.paddingTop = 8;
  btnSub.paddingBottom = 8;
  btnSub.cornerRadius = 10;
  btnSub.fills = solidColor('#475569');
  btnSub.layoutMode = "HORIZONTAL";
  btnSub.counterAxisAlignItems = "CENTER";
  btnSub.itemSpacing = 6;
  btnSub.appendChild(createText("+", boldFont, 12, '#FFFFFF'));
  btnSub.appendChild(createText("Create Task", boldFont, 12, '#FFFFFF'));
  mFoot.appendChild(btnSub);
  modal.appendChild(mFoot);

  screen.appendChild(modal);
  parent.appendChild(screen);
}

// =============================================================================
// MAIN GENERATOR DISPATCHER
// =============================================================================

async function generateScreens() {
  await ensureFonts();

  const screensPage = getOrCreatePage("Screens", "1:5");
  figma.currentPage = screensPage;

  figma.ui.postMessage({ type: 'STATUS', text: 'Drawing Real Application Screens...', done: false });

  const spacingX = 1560;
  const spacingY = 1080;
  const startY = 80;

  // Row 1: Authentic Real Screens
  drawScreen01_RealLogin(screensPage, 0, startY);
  drawScreen02_RealOnboarding(screensPage, spacingX, startY);

  // Row 2: Core Workspace Kanban & Task Modal
  drawScreen03_RealKanban(screensPage, 0, startY + spacingY);
  drawScreen04_RealCreateTaskModal(screensPage, spacingX, startY + spacingY);

  figma.viewport.scrollAndZoomIntoView(screensPage.children);
  figma.notify("🎉 Real Meridian Application Screens generated on 'Screens' page!", { timeout: 4000 });
  figma.ui.postMessage({ type: 'STATUS', text: '✨ Real Screens generated successfully!', done: true });
}

async function generateComponents() {
  await ensureFonts();

  const compPage = getOrCreatePage("Components", "1:4");
  figma.currentPage = compPage;

  figma.ui.postMessage({ type: 'STATUS', text: 'Generating Design System & Components...', done: false });

  // Draw Foundations on page 1:4
  const secColors = figma.createFrame();
  secColors.name = "01 / Color Tokens & Palette";
  secColors.resize(1280, 240);
  secColors.fills = solidColor('#FFFFFF');
  secColors.strokes = solidColor('#E2E8F0');
  secColors.strokeWeight = 1;
  secColors.cornerRadius = 16;
  secColors.paddingTop = 24;
  secColors.paddingLeft = 28;
  secColors.layoutMode = "VERTICAL";
  secColors.itemSpacing = 16;
  secColors.appendChild(createText("01 / COLOR TOKENS & 7-PASTEL CANDY PALETTE", boldFont, 16, '#0F172A'));

  compPage.appendChild(secColors);

  figma.viewport.scrollAndZoomIntoView(compPage.children);
  figma.notify("✨ Components successfully created on 'Components' page!", { timeout: 4000 });
  figma.ui.postMessage({ type: 'STATUS', text: '✨ Components generated successfully!', done: true });
}

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'GENERATE') {
    if (msg.mode === 'SCREENS') {
      await generateScreens();
    } else if (msg.mode === 'COMPONENTS') {
      await generateComponents();
    } else if (msg.mode === 'ALL') {
      await generateComponents();
      await generateScreens();
    }
  }
};
