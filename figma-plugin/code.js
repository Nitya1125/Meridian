/**
 * MERIDIAN CLARITY PRO — FIGMA DESIGN & SCREEN STUDIO
 * Generates:
 * 1. Design System & Components on Page "Components" (Node 1:4)
 * 2. All 11 Full-Fidelity Application Screens (1440x900) on Page "Screens" (Node 1:5)
 */

figma.showUI(__html__, { width: 380, height: 490, title: "Meridian Studio" });

// =============================================================================
// GLOBAL HELPERS & PALETTE
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

let regularFont = { family: "Inter", style: "Regular" };
let mediumFont = { family: "Inter", style: "Medium" };
let semiBoldFont = { family: "Inter", style: "Semi Bold" };
let boldFont = { family: "Inter", style: "Bold" };

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

// =============================================================================
// SCREEN DRAWING PRIMITIVES
// =============================================================================

function createDesktopFrame(name, x, y, bgHex = '#F8FAFC') {
  const frame = figma.createFrame();
  frame.name = name;
  frame.x = x;
  frame.y = y;
  frame.resize(1440, 900);
  frame.clipsContent = true;
  frame.cornerRadius = 16;
  frame.fills = solidColor(bgHex);
  frame.strokes = solidColor('#CBD5E1');
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

  const spec = createText("1440 × 900 · Desktop", regularFont, 12, '#64748B');
  hud.appendChild(spec);

  parent.appendChild(hud);
}

// Standard Application Sidebar
function drawSidebar(parent, activeItem = 'Dashboard') {
  const sb = figma.createFrame();
  sb.name = "Sidebar";
  sb.x = 0;
  sb.y = 0;
  sb.resize(240, 900);
  sb.fills = solidColor('#FFFFFF');
  sb.strokes = solidColor('#E2E8F0');
  sb.strokeWeight = 1;
  sb.paddingLeft = 20;
  sb.paddingRight = 20;
  sb.paddingTop = 24;
  sb.paddingBottom = 24;
  sb.layoutMode = "VERTICAL";
  sb.primaryAxisSizingMode = "FIXED";
  sb.counterAxisSizingMode = "FIXED";
  sb.itemSpacing = 24;

  // 1. Logo Lockup
  const brand = figma.createFrame();
  brand.name = "Brand Header";
  brand.layoutMode = "HORIZONTAL";
  brand.counterAxisAlignItems = "CENTER";
  brand.itemSpacing = 10;
  brand.fills = [];

  const logoBox = figma.createFrame();
  logoBox.resize(32, 32);
  logoBox.cornerRadius = 9;
  logoBox.fills = solidColor('#0F172A');
  logoBox.layoutMode = "HORIZONTAL";
  logoBox.primaryAxisAlignItems = "CENTER";
  logoBox.counterAxisAlignItems = "CENTER";
  logoBox.appendChild(createText("M", boldFont, 16, '#FFFFFF'));
  brand.appendChild(logoBox);

  const brandInfo = figma.createFrame();
  brandInfo.layoutMode = "VERTICAL";
  brandInfo.itemSpacing = 1;
  brandInfo.fills = [];
  brandInfo.appendChild(createText("Meridian", boldFont, 14, '#0F172A'));
  brandInfo.appendChild(createText("Clarity PRO", semiBoldFont, 10, '#6366F1'));
  brand.appendChild(brandInfo);
  sb.appendChild(brand);

  // 2. Org Switcher
  const orgBox = figma.createFrame();
  orgBox.name = "Org Switcher";
  orgBox.resize(200, 36);
  orgBox.cornerRadius = 8;
  orgBox.fills = solidColor('#F8FAFC');
  orgBox.strokes = solidColor('#E2E8F0');
  orgBox.strokeWeight = 1;
  orgBox.paddingLeft = 10;
  orgBox.paddingRight = 10;
  orgBox.layoutMode = "HORIZONTAL";
  orgBox.primaryAxisAlignItems = "SPACE_BETWEEN";
  orgBox.counterAxisAlignItems = "CENTER";
  orgBox.appendChild(createText("Acme Labs Inc.", semiBoldFont, 12, '#334155'));
  orgBox.appendChild(createText("▾", regularFont, 10, '#64748B'));
  sb.appendChild(orgBox);

  // 3. Navigation Links
  const navList = figma.createFrame();
  navList.name = "Nav List";
  navList.layoutMode = "VERTICAL";
  navList.itemSpacing = 4;
  navList.fills = [];

  const navItems = [
    { name: "Dashboard", icon: "▦" },
    { name: "Tasks & Board", icon: "⊞" },
    { name: "Analytics", icon: "📈" },
    { name: "Calendar", icon: "📅" },
    { name: "Team Directory", icon: "👥" },
    { name: "Settings", icon: "⚙" }
  ];

  for (const item of navItems) {
    const isActive = item.name.toLowerCase().includes(activeItem.toLowerCase());
    const navBtn = figma.createFrame();
    navBtn.name = `Nav: ${item.name}`;
    navBtn.resize(200, 34);
    navBtn.cornerRadius = 8;
    navBtn.paddingLeft = 12;
    navBtn.paddingRight = 12;
    navBtn.layoutMode = "HORIZONTAL";
    navBtn.counterAxisAlignItems = "CENTER";
    navBtn.itemSpacing = 10;
    navBtn.fills = solidColor(isActive ? '#0F172A' : '#FFFFFF');

    navBtn.appendChild(createText(item.icon, regularFont, 12, isActive ? '#FFFFFF' : '#64748B'));
    navBtn.appendChild(createText(item.name, semiBoldFont, 12, isActive ? '#FFFFFF' : '#475569'));
    navList.appendChild(navBtn);
  }
  sb.appendChild(navList);

  // 4. Spaces / Project tags
  const spaces = figma.createFrame();
  spaces.name = "Spaces";
  spaces.layoutMode = "VERTICAL";
  spaces.itemSpacing = 6;
  spaces.fills = [];
  spaces.appendChild(createText("ACTIVE SPACES", semiBoldFont, 10, '#94A3B8'));

  const spaceItems = [
    { title: "Core Web Engine", dot: "#8B5CF6" },
    { title: "Mobile App 2.0", dot: "#F97316" },
    { title: "Infrastructure", dot: "#10B981" }
  ];
  for (const sp of spaceItems) {
    const sRow = figma.createFrame();
    sRow.layoutMode = "HORIZONTAL";
    sRow.counterAxisAlignItems = "CENTER";
    sRow.itemSpacing = 8;
    sRow.fills = [];

    const d = figma.createEllipse();
    d.resize(6, 6);
    d.fills = solidColor(sp.dot);
    sRow.appendChild(d);
    sRow.appendChild(createText(sp.title, mediumFont, 11, '#475569'));
    spaces.appendChild(sRow);
  }
  sb.appendChild(spaces);

  // 5. User Profile Footer
  const spacer = figma.createFrame();
  spacer.resize(200, 160);
  spacer.fills = [];
  sb.appendChild(spacer);

  const profile = figma.createFrame();
  profile.name = "User Profile";
  profile.resize(200, 48);
  profile.cornerRadius = 10;
  profile.paddingLeft = 8;
  profile.paddingRight = 8;
  profile.layoutMode = "HORIZONTAL";
  profile.counterAxisAlignItems = "CENTER";
  profile.itemSpacing = 10;
  profile.fills = solidColor('#F8FAFC');
  profile.strokes = solidColor('#E2E8F0');
  profile.strokeWeight = 1;

  const av = figma.createFrame();
  av.resize(30, 30);
  av.cornerRadius = 999;
  av.fills = solidColor('#F3E8FF');
  av.layoutMode = "HORIZONTAL";
  av.primaryAxisAlignItems = "CENTER";
  av.counterAxisAlignItems = "CENTER";
  av.appendChild(createText("SN", boldFont, 10, '#581C87'));
  profile.appendChild(av);

  const uInfo = figma.createFrame();
  uInfo.layoutMode = "VERTICAL";
  uInfo.itemSpacing = 1;
  uInfo.fills = [];
  uInfo.appendChild(createText("Smit Nayi", boldFont, 11, '#0F172A'));
  uInfo.appendChild(createText("Lead Engineer", regularFont, 9, '#64748B'));
  profile.appendChild(uInfo);

  sb.appendChild(profile);
  parent.appendChild(sb);
}

// Standard Dynamic Top Header
function drawHeader(parent, breadcrumb = "Dashboard") {
  const h = figma.createFrame();
  h.name = "Dynamic Top Header";
  h.x = 240;
  h.y = 0;
  h.resize(1200, 68);
  h.fills = solidColor('#FFFFFF');
  h.strokes = solidColor('#E2E8F0');
  h.strokeWeight = 1;
  h.paddingLeft = 28;
  h.paddingRight = 28;
  h.layoutMode = "HORIZONTAL";
  h.primaryAxisAlignItems = "SPACE_BETWEEN";
  h.counterAxisAlignItems = "CENTER";

  // Breadcrumbs
  const bc = figma.createFrame();
  bc.layoutMode = "HORIZONTAL";
  bc.counterAxisAlignItems = "CENTER";
  bc.itemSpacing = 8;
  bc.fills = [];
  bc.appendChild(createText("Workspace", regularFont, 13, '#94A3B8'));
  bc.appendChild(createText("/", regularFont, 13, '#CBD5E1'));
  bc.appendChild(createText(breadcrumb, boldFont, 13, '#0F172A'));
  h.appendChild(bc);

  // Right Utility Cluster
  const cluster = figma.createFrame();
  cluster.layoutMode = "HORIZONTAL";
  cluster.counterAxisAlignItems = "CENTER";
  cluster.itemSpacing = 14;
  cluster.fills = [];

  // Sprint Assurance Pill
  const sprintPill = figma.createFrame();
  sprintPill.paddingLeft = 10;
  sprintPill.paddingRight = 10;
  sprintPill.paddingTop = 5;
  sprintPill.paddingBottom = 5;
  sprintPill.cornerRadius = 999;
  sprintPill.fills = solidColor('#ECFCCB');
  sprintPill.strokes = solidColor('#D9F99D');
  sprintPill.strokeWeight = 1;
  sprintPill.appendChild(createText("Sprint 24 · 4 days left · 88% on track", boldFont, 11, '#365314'));
  cluster.appendChild(sprintPill);

  // Search Box
  const searchBox = figma.createFrame();
  searchBox.resize(240, 36);
  searchBox.cornerRadius = 8;
  searchBox.paddingLeft = 10;
  searchBox.paddingRight = 10;
  searchBox.fills = solidColor('#F8FAFC');
  searchBox.strokes = solidColor('#E2E8F0');
  searchBox.strokeWeight = 1;
  searchBox.layoutMode = "HORIZONTAL";
  searchBox.primaryAxisAlignItems = "SPACE_BETWEEN";
  searchBox.counterAxisAlignItems = "CENTER";
  searchBox.appendChild(createText("Search tasks, docs... ⌘K", regularFont, 11, '#94A3B8'));
  cluster.appendChild(searchBox);

  // + New Task Button
  const btnNew = figma.createFrame();
  btnNew.resize(100, 36);
  btnNew.cornerRadius = 8;
  btnNew.fills = solidColor('#4F46E5');
  btnNew.effects = [subtleShadow];
  btnNew.layoutMode = "HORIZONTAL";
  btnNew.primaryAxisAlignItems = "CENTER";
  btnNew.counterAxisAlignItems = "CENTER";
  btnNew.appendChild(createText("+ New Task", semiBoldFont, 12, '#FFFFFF'));
  cluster.appendChild(btnNew);

  h.appendChild(cluster);
  parent.appendChild(h);
}

// =============================================================================
// SCREEN 01: LOGIN SCREEN
// =============================================================================
function drawScreen01_Login(parent, x, y) {
  createHUDLabel(parent, "01", "Authentication & Login", "Authentication Flow", x, y);
  const screen = createDesktopFrame("01 / Screen - Login", x, y);

  // Left Showcase Panel
  const left = figma.createFrame();
  left.name = "Left Showcase";
  left.x = 0;
  left.y = 0;
  left.resize(720, 900);
  left.fills = solidColor('#FAF8F5');
  left.strokes = solidColor('#E7E5E4');
  left.strokeWeight = 1;
  left.paddingTop = 64;
  left.paddingBottom = 64;
  left.paddingLeft = 64;
  left.paddingRight = 64;
  left.layoutMode = "VERTICAL";
  left.itemSpacing = 36;

  // Brand Header
  const bHeader = figma.createFrame();
  bHeader.layoutMode = "HORIZONTAL";
  bHeader.counterAxisAlignItems = "CENTER";
  bHeader.itemSpacing = 12;
  bHeader.fills = [];
  const mBox = figma.createFrame();
  mBox.resize(36, 36);
  mBox.cornerRadius = 10;
  mBox.fills = solidColor('#0F172A');
  mBox.layoutMode = "HORIZONTAL";
  mBox.primaryAxisAlignItems = "CENTER";
  mBox.counterAxisAlignItems = "CENTER";
  mBox.appendChild(createText("M", boldFont, 18, '#FFFFFF'));
  bHeader.appendChild(mBox);
  bHeader.appendChild(createText("Meridian Clarity PRO", boldFont, 18, '#0F172A'));
  left.appendChild(bHeader);

  // Headline
  const headBox = figma.createFrame();
  headBox.layoutMode = "VERTICAL";
  headBox.itemSpacing = 12;
  headBox.fills = [];
  headBox.appendChild(createText("Where exceptional teams\nbuild iconic products.", boldFont, 40, '#0F172A'));
  headBox.appendChild(createText("Meridian unifies your deliverables, sprint velocity, calendar schedules, and presence into one ultra-premium workspace.", regularFont, 14, '#64748B'));
  left.appendChild(headBox);

  // 4 Bento Feature Cards
  const bentoGrid = figma.createFrame();
  bentoGrid.name = "Bento Feature Grid";
  bentoGrid.layoutMode = "VERTICAL";
  bentoGrid.itemSpacing = 12;
  bentoGrid.fills = [];

  const row1 = figma.createFrame();
  row1.layoutMode = "HORIZONTAL";
  row1.itemSpacing = 12;
  row1.fills = [];

  const feats = [
    { title: "Interactive Kanban", sub: "Pastel swimlanes & triage", ...PASTELS.Lavender },
    { title: "Sprint Dynamic HUD", sub: "Live counters & video telemetry", ...PASTELS.Lime },
    { title: "Speedometer Analytics", sub: "Capacity & burn-up metrics", ...PASTELS.Peach },
    { title: "Team Directory", sub: "Real-time presence tracking", ...PASTELS.Sky },
  ];

  for (let i = 0; i < 4; i++) {
    const f = feats[i];
    const card = figma.createFrame();
    card.resize(280, 80);
    card.cornerRadius = 12;
    card.paddingTop = 14;
    card.paddingBottom = 14;
    card.paddingLeft = 16;
    card.paddingRight = 16;
    card.fills = solidColor(f.bg);
    card.strokes = solidColor(f.border);
    card.strokeWeight = 1;
    card.layoutMode = "VERTICAL";
    card.itemSpacing = 4;
    card.appendChild(createText(f.title, boldFont, 13, f.text));
    card.appendChild(createText(f.sub, regularFont, 11, f.text));

    if (i < 2) row1.appendChild(card);
  }
  bentoGrid.appendChild(row1);
  left.appendChild(bentoGrid);

  // Quote
  const quote = figma.createFrame();
  quote.resize(580, 60);
  quote.cornerRadius = 10;
  quote.paddingLeft = 16;
  quote.paddingRight = 16;
  quote.paddingTop = 12;
  quote.paddingBottom = 12;
  quote.fills = solidColor('#FFFFFF');
  quote.strokes = solidColor('#E7E5E4');
  quote.strokeWeight = 1;
  quote.appendChild(createText("“Meridian cut our sprint triage latency by 64% in two cycles.” — Head of Engineering", regularFont, 12, '#475569'));
  left.appendChild(quote);
  screen.appendChild(left);

  // Right Form Container
  const right = figma.createFrame();
  right.name = "Right Auth Form";
  right.x = 720;
  right.y = 0;
  right.resize(720, 900);
  right.fills = solidColor('#FFFFFF');
  right.layoutMode = "HORIZONTAL";
  right.primaryAxisAlignItems = "CENTER";
  right.counterAxisAlignItems = "CENTER";

  const formBox = figma.createFrame();
  formBox.name = "Auth Box";
  formBox.resize(400, 520);
  formBox.layoutMode = "VERTICAL";
  formBox.itemSpacing = 16;
  formBox.fills = [];

  formBox.appendChild(createText("Welcome back", boldFont, 26, '#0F172A'));
  formBox.appendChild(createText("Enter your credentials to access your workspace.", regularFont, 13, '#64748B'));

  // Quick Demo Login
  const demoBtn = figma.createFrame();
  demoBtn.resize(400, 40);
  demoBtn.cornerRadius = 10;
  demoBtn.fills = solidColor('#EEF2FF');
  demoBtn.strokes = solidColor('#C7D2FE');
  demoBtn.strokeWeight = 1;
  demoBtn.layoutMode = "HORIZONTAL";
  demoBtn.primaryAxisAlignItems = "CENTER";
  demoBtn.counterAxisAlignItems = "CENTER";
  demoBtn.appendChild(createText("⚡ Quick Demo Workspace Login", boldFont, 13, '#4338CA'));
  formBox.appendChild(demoBtn);

  // Divider
  const div = figma.createFrame();
  div.layoutMode = "HORIZONTAL";
  div.primaryAxisAlignItems = "CENTER";
  div.counterAxisAlignItems = "CENTER";
  div.resize(400, 16);
  div.fills = [];
  div.appendChild(createText("— OR CONTINUE WITH —", semiBoldFont, 10, '#94A3B8'));
  formBox.appendChild(div);

  // SSO Buttons
  const ssoRow = figma.createFrame();
  ssoRow.layoutMode = "HORIZONTAL";
  ssoRow.itemSpacing = 12;
  ssoRow.fills = [];

  const gBtn = figma.createFrame();
  gBtn.resize(194, 38);
  gBtn.cornerRadius = 8;
  gBtn.fills = solidColor('#FFFFFF');
  gBtn.strokes = solidColor('#E2E8F0');
  gBtn.strokeWeight = 1;
  gBtn.layoutMode = "HORIZONTAL";
  gBtn.primaryAxisAlignItems = "CENTER";
  gBtn.counterAxisAlignItems = "CENTER";
  gBtn.appendChild(createText("Google SSO", semiBoldFont, 12, '#334155'));
  ssoRow.appendChild(gBtn);

  const ghBtn = figma.createFrame();
  ghBtn.resize(194, 38);
  ghBtn.cornerRadius = 8;
  ghBtn.fills = solidColor('#FFFFFF');
  ghBtn.strokes = solidColor('#E2E8F0');
  ghBtn.strokeWeight = 1;
  ghBtn.layoutMode = "HORIZONTAL";
  ghBtn.primaryAxisAlignItems = "CENTER";
  ghBtn.counterAxisAlignItems = "CENTER";
  ghBtn.appendChild(createText("GitHub SSO", semiBoldFont, 12, '#334155'));
  ssoRow.appendChild(ghBtn);
  formBox.appendChild(ssoRow);

  // Inputs
  function drawInput(label, val) {
    const box = figma.createFrame();
    box.layoutMode = "VERTICAL";
    box.itemSpacing = 6;
    box.fills = [];
    box.appendChild(createText(label, semiBoldFont, 11, '#475569'));
    const inp = figma.createFrame();
    inp.resize(400, 40);
    inp.cornerRadius = 8;
    inp.fills = solidColor('#FFFFFF');
    inp.strokes = solidColor('#CBD5E1');
    inp.strokeWeight = 1;
    inp.paddingLeft = 12;
    inp.paddingRight = 12;
    inp.layoutMode = "HORIZONTAL";
    inp.counterAxisAlignItems = "CENTER";
    inp.appendChild(createText(val, regularFont, 13, '#0F172A'));
    box.appendChild(inp);
    return box;
  }

  formBox.appendChild(drawInput("Work Email", "smit@meridian.io"));
  formBox.appendChild(drawInput("Password", "••••••••••••"));

  // Submit Button
  const subBtn = figma.createFrame();
  subBtn.resize(400, 44);
  subBtn.cornerRadius = 10;
  subBtn.fills = solidColor('#0F172A');
  subBtn.layoutMode = "HORIZONTAL";
  subBtn.primaryAxisAlignItems = "CENTER";
  subBtn.counterAxisAlignItems = "CENTER";
  subBtn.appendChild(createText("Sign In to Workspace", boldFont, 14, '#FFFFFF'));
  formBox.appendChild(subBtn);

  formBox.appendChild(createText("Don't have an account? Sign up here", regularFont, 12, '#6366F1'));
  right.appendChild(formBox);
  screen.appendChild(right);

  parent.appendChild(screen);
}

// =============================================================================
// SCREEN 02: SIGNUP SCREEN
// =============================================================================
function drawScreen02_Signup(parent, x, y) {
  createHUDLabel(parent, "02", "Signup & Onboarding Flow", "Authentication Flow", x, y);
  const screen = createDesktopFrame("02 / Screen - Signup", x, y);

  // Similar split, with step indicator and password strength meter
  const left = figma.createFrame();
  left.resize(600, 900);
  left.fills = solidColor('#090D16');
  left.paddingLeft = 56;
  left.paddingTop = 64;
  left.layoutMode = "VERTICAL";
  left.itemSpacing = 24;

  left.appendChild(createText("M E R I D I A N", boldFont, 12, '#818CF8'));
  left.appendChild(createText("Build at the speed\nof clarity.", boldFont, 36, '#FFFFFF'));
  left.appendChild(createText("Join 14,000+ engineers streamlining deliverables.", regularFont, 14, '#94A3B8'));

  const statBento = figma.createFrame();
  statBento.resize(480, 180);
  statBento.cornerRadius = 14;
  statBento.fills = solidColor('#0F172A');
  statBento.strokes = solidColor('#1E293B');
  statBento.strokeWeight = 1;
  statBento.paddingTop = 20;
  statBento.paddingLeft = 20;
  statBento.layoutMode = "VERTICAL";
  statBento.itemSpacing = 8;
  statBento.appendChild(createText("SPRINT VELOCITY MULTIPLIER", semiBoldFont, 11, '#34D399'));
  statBento.appendChild(createText("3.4x Faster", boldFont, 32, '#FFFFFF'));
  statBento.appendChild(createText("Eliminate sprint triage silos with automated real-time backlog syncing.", regularFont, 12, '#94A3B8'));
  left.appendChild(statBento);

  screen.appendChild(left);

  // Right Sign Up Card
  const right = figma.createFrame();
  right.x = 600;
  right.resize(840, 900);
  right.fills = solidColor('#FFFFFF');
  right.layoutMode = "HORIZONTAL";
  right.primaryAxisAlignItems = "CENTER";
  right.counterAxisAlignItems = "CENTER";

  const form = figma.createFrame();
  form.resize(440, 560);
  form.layoutMode = "VERTICAL";
  form.itemSpacing = 16;
  form.fills = [];

  form.appendChild(createText("Create your workspace account", boldFont, 24, '#0F172A'));
  form.appendChild(createText("Get started free — no credit card required.", regularFont, 13, '#64748B'));

  // Form Inputs
  function formField(lbl, val) {
    const f = figma.createFrame();
    f.layoutMode = "VERTICAL";
    f.itemSpacing = 6;
    f.fills = [];
    f.appendChild(createText(lbl, semiBoldFont, 11, '#475569'));
    const b = figma.createFrame();
    b.resize(440, 40);
    b.cornerRadius = 8;
    b.strokes = solidColor('#CBD5E1');
    b.strokeWeight = 1;
    b.paddingLeft = 12;
    b.layoutMode = "HORIZONTAL";
    b.counterAxisAlignItems = "CENTER";
    b.appendChild(createText(val, regularFont, 13, '#0F172A'));
    f.appendChild(b);
    return f;
  }

  form.appendChild(formField("Full Name", "Smit Nayi"));
  form.appendChild(formField("Work Email", "smit@meridian.io"));
  form.appendChild(formField("Password", "••••••••••••"));

  // Password Strength Meter
  const pwMeter = figma.createFrame();
  pwMeter.layoutMode = "VERTICAL";
  pwMeter.itemSpacing = 6;
  pwMeter.fills = [];
  pwMeter.appendChild(createText("Password Strength: Strong", mediumFont, 11, '#059669'));

  const barRow = figma.createFrame();
  barRow.layoutMode = "HORIZONTAL";
  barRow.itemSpacing = 6;
  barRow.fills = [];
  for (let i = 0; i < 4; i++) {
    const b = figma.createRectangle();
    b.resize(105, 4);
    b.cornerRadius = 2;
    b.fills = solidColor('#10B981');
    barRow.appendChild(b);
  }
  pwMeter.appendChild(barRow);
  form.appendChild(pwMeter);

  const btnCreate = figma.createFrame();
  btnCreate.resize(440, 44);
  btnCreate.cornerRadius = 10;
  btnCreate.fills = solidColor('#4F46E5');
  btnCreate.layoutMode = "HORIZONTAL";
  btnCreate.primaryAxisAlignItems = "CENTER";
  btnCreate.counterAxisAlignItems = "CENTER";
  btnCreate.appendChild(createText("Create Free Account", boldFont, 14, '#FFFFFF'));
  form.appendChild(btnCreate);

  right.appendChild(form);
  screen.appendChild(right);

  parent.appendChild(screen);
}

// =============================================================================
// SCREEN 03: FORGOT PASSWORD & RESET OTP
// =============================================================================
function drawScreen03_ForgotPass(parent, x, y) {
  createHUDLabel(parent, "03", "Password Recovery & OTP Verification", "Authentication Flow", x, y);
  const screen = createDesktopFrame("03 / Screen - Forgot Password", x, y, '#F1F5F9');

  // Centered Modal
  const modal = figma.createFrame();
  modal.name = "OTP Modal";
  modal.x = 490;
  modal.y = 170;
  modal.resize(460, 520);
  modal.cornerRadius = 16;
  modal.fills = solidColor('#FFFFFF');
  modal.strokes = solidColor('#E2E8F0');
  modal.strokeWeight = 1;
  modal.effects = [elevatedShadow];
  modal.paddingTop = 36;
  modal.paddingBottom = 36;
  modal.paddingLeft = 36;
  modal.paddingRight = 36;
  modal.layoutMode = "VERTICAL";
  modal.itemSpacing = 20;

  const iconCircle = figma.createFrame();
  iconCircle.resize(48, 48);
  iconCircle.cornerRadius = 999;
  iconCircle.fills = solidColor('#EEF2FF');
  iconCircle.layoutMode = "HORIZONTAL";
  iconCircle.primaryAxisAlignItems = "CENTER";
  iconCircle.counterAxisAlignItems = "CENTER";
  iconCircle.appendChild(createText("🔒", regularFont, 20, '#4F46E5'));
  modal.appendChild(iconCircle);

  modal.appendChild(createText("Reset your password", boldFont, 22, '#0F172A'));
  modal.appendChild(createText("We sent a 6-digit verification code to smit@meridian.io. Please enter it below.", regularFont, 13, '#64748B'));

  // 6-digit OTP Box
  const otpRow = figma.createFrame();
  otpRow.name = "OTP Inputs";
  otpRow.layoutMode = "HORIZONTAL";
  otpRow.itemSpacing = 10;
  otpRow.fills = [];

  const digits = ["5", "8", "2", "9", "", ""];
  for (let i = 0; i < 6; i++) {
    const box = figma.createFrame();
    box.resize(54, 56);
    box.cornerRadius = 10;
    box.fills = solidColor(i === 4 ? '#EEF2FF' : '#F8FAFC');
    box.strokes = solidColor(i === 4 ? '#4F46E5' : '#CBD5E1');
    box.strokeWeight = i === 4 ? 2 : 1;
    box.layoutMode = "HORIZONTAL";
    box.primaryAxisAlignItems = "CENTER";
    box.counterAxisAlignItems = "CENTER";
    box.appendChild(createText(digits[i] || (i === 4 ? "|" : "•"), boldFont, 20, i === 4 ? '#4F46E5' : '#0F172A'));
    otpRow.appendChild(box);
  }
  modal.appendChild(otpRow);

  const btnVerify = figma.createFrame();
  btnVerify.resize(388, 44);
  btnVerify.cornerRadius = 10;
  btnVerify.fills = solidColor('#0F172A');
  btnVerify.layoutMode = "HORIZONTAL";
  btnVerify.primaryAxisAlignItems = "CENTER";
  btnVerify.counterAxisAlignItems = "CENTER";
  btnVerify.appendChild(createText("Verify Code & Continue", boldFont, 13, '#FFFFFF'));
  modal.appendChild(btnVerify);

  modal.appendChild(createText("Didn't receive email? Resend code (42s)", mediumFont, 12, '#64748B'));

  screen.appendChild(modal);
  parent.appendChild(screen);
}

// =============================================================================
// SCREEN 04: ORGANIZATION SETUP
// =============================================================================
function drawScreen04_OrgSetup(parent, x, y) {
  createHUDLabel(parent, "04", "Organization Onboarding", "Onboarding", x, y);
  const screen = createDesktopFrame("04 / Screen - Org Setup", x, y, '#FAF8F5');

  const card = figma.createFrame();
  card.x = 450;
  card.y = 140;
  card.resize(540, 580);
  card.cornerRadius = 20;
  card.fills = solidColor('#FFFFFF');
  card.strokes = solidColor('#E2E8F0');
  card.strokeWeight = 1;
  card.effects = [elevatedShadow];
  card.paddingTop = 36;
  card.paddingBottom = 36;
  card.paddingLeft = 40;
  card.paddingRight = 40;
  card.layoutMode = "VERTICAL";
  card.itemSpacing = 20;

  card.appendChild(createText("Create your organization", boldFont, 24, '#0F172A'));
  card.appendChild(createText("Set up your workspace team boundaries and custom domain.", regularFont, 13, '#64748B'));

  // Org Name
  const nameF = figma.createFrame();
  nameF.layoutMode = "VERTICAL";
  nameF.itemSpacing = 6;
  nameF.fills = [];
  nameF.appendChild(createText("Organization Name", semiBoldFont, 11, '#475569'));
  const nInp = figma.createFrame();
  nInp.resize(460, 40);
  nInp.cornerRadius = 8;
  nInp.strokes = solidColor('#CBD5E1');
  nInp.strokeWeight = 1;
  nInp.paddingLeft = 12;
  nInp.layoutMode = "HORIZONTAL";
  nInp.counterAxisAlignItems = "CENTER";
  nInp.appendChild(createText("Meridian Tech Labs", regularFont, 13, '#0F172A'));
  nameF.appendChild(nInp);
  card.appendChild(nameF);

  // URL Slug
  const slugF = figma.createFrame();
  slugF.layoutMode = "VERTICAL";
  slugF.itemSpacing = 6;
  slugF.fills = [];
  slugF.appendChild(createText("Workspace URL Slug", semiBoldFont, 11, '#475569'));
  const sInp = figma.createFrame();
  sInp.resize(460, 40);
  sInp.cornerRadius = 8;
  sInp.strokes = solidColor('#CBD5E1');
  sInp.strokeWeight = 1;
  sInp.paddingLeft = 12;
  sInp.layoutMode = "HORIZONTAL";
  sInp.counterAxisAlignItems = "CENTER";
  sInp.appendChild(createText("meridian.io/workspace/meridian-tech", regularFont, 13, '#6366F1'));
  slugF.appendChild(sInp);
  card.appendChild(slugF);

  // Team size cards
  card.appendChild(createText("Team Size", semiBoldFont, 11, '#475569'));
  const sizeRow = figma.createFrame();
  sizeRow.layoutMode = "HORIZONTAL";
  sizeRow.itemSpacing = 10;
  sizeRow.fills = [];

  const sizes = ["1 - 10", "11 - 50", "51 - 200", "200+"];
  for (let i = 0; i < sizes.length; i++) {
    const sCard = figma.createFrame();
    sCard.resize(107, 44);
    sCard.cornerRadius = 8;
    sCard.fills = solidColor(i === 1 ? '#EEF2FF' : '#FFFFFF');
    sCard.strokes = solidColor(i === 1 ? '#4F46E5' : '#E2E8F0');
    sCard.strokeWeight = i === 1 ? 2 : 1;
    sCard.layoutMode = "HORIZONTAL";
    sCard.primaryAxisAlignItems = "CENTER";
    sCard.counterAxisAlignItems = "CENTER";
    sCard.appendChild(createText(sizes[i], boldFont, 12, i === 1 ? '#4338CA' : '#334155'));
    sizeRow.appendChild(sCard);
  }
  card.appendChild(sizeRow);

  const btnDone = figma.createFrame();
  btnDone.resize(460, 44);
  btnDone.cornerRadius = 10;
  btnDone.fills = solidColor('#0F172A');
  btnDone.layoutMode = "HORIZONTAL";
  btnDone.primaryAxisAlignItems = "CENTER";
  btnDone.counterAxisAlignItems = "CENTER";
  btnDone.appendChild(createText("Launch Workspace", boldFont, 14, '#FFFFFF'));
  card.appendChild(btnDone);

  screen.appendChild(card);
  parent.appendChild(screen);
}

// =============================================================================
// SCREEN 05: MAIN DASHBOARD OVERVIEW
// =============================================================================
function drawScreen05_Dashboard(parent, x, y) {
  createHUDLabel(parent, "05", "Main Workspace Dashboard", "Core Workspace", x, y);
  const screen = createDesktopFrame("05 / Screen - Dashboard", x, y);

  drawSidebar(screen, "Dashboard");
  drawHeader(screen, "Dashboard Overview");

  const content = figma.createFrame();
  content.name = "Content Area";
  content.x = 264;
  content.y = 88;
  content.resize(1148, 788);
  content.layoutMode = "VERTICAL";
  content.itemSpacing = 20;
  content.fills = [];

  // 1. Welcome Banner
  const banner = figma.createFrame();
  banner.resize(1148, 72);
  banner.cornerRadius = 12;
  banner.fills = solidColor('#FFFFFF');
  banner.strokes = solidColor('#E2E8F0');
  banner.strokeWeight = 1;
  banner.paddingLeft = 24;
  banner.paddingRight = 24;
  banner.layoutMode = "HORIZONTAL";
  banner.primaryAxisAlignItems = "SPACE_BETWEEN";
  banner.counterAxisAlignItems = "CENTER";

  const bText = figma.createFrame();
  bText.layoutMode = "VERTICAL";
  bText.itemSpacing = 2;
  bText.fills = [];
  bText.appendChild(createText("Good morning, Smit 👋", boldFont, 18, '#0F172A'));
  bText.appendChild(createText("Sprint 24 is progressing on track. You have 3 deliverables due this week.", regularFont, 12, '#64748B'));
  banner.appendChild(bText);

  content.appendChild(banner);

  // 2. 4 Metric KPI Cards Row
  const kpiRow = figma.createFrame();
  kpiRow.name = "KPI Cards Row";
  kpiRow.layoutMode = "HORIZONTAL";
  kpiRow.itemSpacing = 16;
  kpiRow.fills = [];

  const metrics = [
    { label: "TOTAL DELIVERABLES", val: "42", sub: "+8 from last sprint", ...PASTELS.Lavender },
    { label: "IN PROGRESS", val: "14", sub: "3 currently in review", ...PASTELS.Peach },
    { label: "SPRINT VELOCITY", val: "94.2%", sub: "+18.4% acceleration", ...PASTELS.Lime },
    { label: "COMPLETED", val: "28", sub: "On pace for sprint goal", ...PASTELS.Sky },
  ];

  for (const m of metrics) {
    const card = figma.createFrame();
    card.resize(275, 110);
    card.cornerRadius = 14;
    card.fills = solidColor('#FFFFFF');
    card.strokes = solidColor('#E2E8F0');
    card.strokeWeight = 1;
    card.paddingTop = 16;
    card.paddingBottom = 16;
    card.paddingLeft = 18;
    card.paddingRight = 18;
    card.layoutMode = "VERTICAL";
    card.itemSpacing = 6;
    card.effects = [subtleShadow];

    card.appendChild(createText(m.label, semiBoldFont, 10, '#64748B'));
    card.appendChild(createText(m.val, boldFont, 28, '#0F172A'));
    card.appendChild(createText(m.sub, mediumFont, 11, m.text));
    kpiRow.appendChild(card);
  }
  content.appendChild(kpiRow);

  // 3. Two-Column Layout: Active Lineup (Left) + Telemetry & Feed (Right)
  const mainGrid = figma.createFrame();
  mainGrid.layoutMode = "HORIZONTAL";
  mainGrid.itemSpacing = 16;
  mainGrid.fills = [];

  // Left Lineup Table (width 740)
  const lineup = figma.createFrame();
  lineup.name = "Active Lineup Container";
  lineup.resize(740, 520);
  lineup.cornerRadius = 14;
  lineup.fills = solidColor('#FFFFFF');
  lineup.strokes = solidColor('#E2E8F0');
  lineup.strokeWeight = 1;
  lineup.paddingTop = 20;
  lineup.paddingBottom = 20;
  lineup.paddingLeft = 24;
  lineup.paddingRight = 24;
  lineup.layoutMode = "VERTICAL";
  lineup.itemSpacing = 16;
  lineup.effects = [subtleShadow];

  const lHeader = figma.createFrame();
  lHeader.layoutMode = "HORIZONTAL";
  lHeader.primaryAxisAlignItems = "SPACE_BETWEEN";
  lHeader.counterAxisAlignItems = "CENTER";
  lHeader.resize(692, 28);
  lHeader.fills = [];
  lHeader.appendChild(createText("ACTIVE LINEUP & DELIVERABLES", boldFont, 13, '#0F172A'));
  lHeader.appendChild(createText("View all 42 items →", semiBoldFont, 11, '#4F46E5'));
  lineup.appendChild(lHeader);

  // Deliverable rows
  const deliverables = [
    { id: "MRD-001", title: "Design Token Migration & Tailwind v4 System", tag: "#Dev", prog: 85, color: "#10B981" },
    { id: "MRD-002", title: "API Gateway Multi-Tenant Routing Engine", tag: "#Backend", prog: 60, color: "#6366F1" },
    { id: "MRD-003", title: "Speedometer & Capacity Gauges in Canvas", tag: "#Design", prog: 45, color: "#F59E0B" },
    { id: "MRD-004", title: "Stripe Subscription Invoicing Webhooks", tag: "#Commercial", prog: 20, color: "#EC4899" },
  ];

  for (const d of deliverables) {
    const row = figma.createFrame();
    row.resize(692, 70);
    row.cornerRadius = 10;
    row.fills = solidColor('#F8FAFC');
    row.strokes = solidColor('#E2E8F0');
    row.strokeWeight = 1;
    row.paddingLeft = 16;
    row.paddingRight = 16;
    row.layoutMode = "HORIZONTAL";
    row.counterAxisAlignItems = "CENTER";
    row.primaryAxisAlignItems = "SPACE_BETWEEN";

    const leftCol = figma.createFrame();
    leftCol.layoutMode = "VERTICAL";
    leftCol.itemSpacing = 4;
    leftCol.fills = [];
    leftCol.appendChild(createText(`${d.id} · ${d.tag}`, semiBoldFont, 10, '#64748B'));
    leftCol.appendChild(createText(d.title, boldFont, 13, '#0F172A'));
    row.appendChild(leftCol);

    // Progress bar
    const barBox = figma.createFrame();
    barBox.layoutMode = "VERTICAL";
    barBox.counterAxisAlignItems = "MAX";
    barBox.itemSpacing = 4;
    barBox.fills = [];
    barBox.appendChild(createText(`${d.prog}% Complete`, mediumFont, 11, '#475569'));

    const tr = figma.createFrame();
    tr.resize(120, 6);
    tr.cornerRadius = 999;
    tr.fills = solidColor('#E2E8F0');
    const fl = figma.createRectangle();
    fl.resize(Math.round((d.prog / 100) * 120), 6);
    fl.cornerRadius = 999;
    fl.fills = solidColor(d.color);
    tr.appendChild(fl);
    barBox.appendChild(tr);
    row.appendChild(barBox);

    lineup.appendChild(row);
  }
  mainGrid.appendChild(lineup);

  // Right Telemetry & Feed (width 392)
  const rightCol = figma.createFrame();
  rightCol.layoutMode = "VERTICAL";
  rightCol.itemSpacing = 16;
  rightCol.fills = [];

  // Capacity Dial Card
  const capCard = figma.createFrame();
  capCard.resize(392, 220);
  capCard.cornerRadius = 14;
  capCard.fills = solidColor('#090D16');
  capCard.strokes = solidColor('#1E293B');
  capCard.strokeWeight = 1;
  capCard.paddingTop = 20;
  capCard.paddingLeft = 20;
  capCard.paddingRight = 20;
  capCard.layoutMode = "VERTICAL";
  capCard.itemSpacing = 10;
  capCard.appendChild(createText("SPRINT TEAM CAPACITY", semiBoldFont, 10, '#818CF8'));
  capCard.appendChild(createText("82% Allocated", boldFont, 24, '#FFFFFF'));
  capCard.appendChild(createText("18 of 22 active engineers have reached optimal sprint load.", regularFont, 12, '#94A3B8'));
  rightCol.appendChild(capCard);

  // Live Audit Stream
  const feedCard = figma.createFrame();
  feedCard.resize(392, 284);
  feedCard.cornerRadius = 14;
  feedCard.fills = solidColor('#FFFFFF');
  feedCard.strokes = solidColor('#E2E8F0');
  feedCard.strokeWeight = 1;
  feedCard.paddingTop = 18;
  feedCard.paddingLeft = 18;
  feedCard.paddingRight = 18;
  feedCard.layoutMode = "VERTICAL";
  feedCard.itemSpacing = 12;
  feedCard.appendChild(createText("LIVE AUDIT & ACTIVITY FEED", boldFont, 12, '#0F172A'));

  const events = [
    { user: "SN", text: "MRD-001 moved to In Review", time: "2m ago" },
    { user: "NP", text: "New PR submitted for Analytics API", time: "14m ago" },
    { user: "AK", text: "Completed 4 subtasks in Sprint 24", time: "1h ago" },
  ];
  for (const ev of events) {
    const eRow = figma.createFrame();
    eRow.layoutMode = "HORIZONTAL";
    eRow.counterAxisAlignItems = "CENTER";
    eRow.itemSpacing = 10;
    eRow.fills = [];

    const av = figma.createFrame();
    av.resize(24, 24);
    av.cornerRadius = 999;
    av.fills = solidColor('#F3E8FF');
    av.layoutMode = "HORIZONTAL";
    av.primaryAxisAlignItems = "CENTER";
    av.counterAxisAlignItems = "CENTER";
    av.appendChild(createText(ev.user, boldFont, 9, '#581C87'));
    eRow.appendChild(av);

    const txtBox = figma.createFrame();
    txtBox.layoutMode = "VERTICAL";
    txtBox.itemSpacing = 1;
    txtBox.fills = [];
    txtBox.appendChild(createText(ev.text, semiBoldFont, 11, '#334155'));
    txtBox.appendChild(createText(ev.time, regularFont, 9, '#94A3B8'));
    eRow.appendChild(txtBox);
    feedCard.appendChild(eRow);
  }
  rightCol.appendChild(feedCard);

  mainGrid.appendChild(rightCol);
  content.appendChild(mainGrid);

  screen.appendChild(content);
  parent.appendChild(screen);
}

// =============================================================================
// SCREEN 06: KANBAN SPRINT BOARD
// =============================================================================
function drawScreen06_Kanban(parent, x, y) {
  createHUDLabel(parent, "06", "Kanban Sprint Board", "Core Workspace", x, y);
  const screen = createDesktopFrame("06 / Screen - Kanban", x, y);

  drawSidebar(screen, "Tasks & Board");
  drawHeader(screen, "Sprint Kanban Board");

  // Kanban Columns
  const boardArea = figma.createFrame();
  boardArea.x = 264;
  boardArea.y = 88;
  boardArea.resize(1148, 788);
  boardArea.layoutMode = "HORIZONTAL";
  boardArea.itemSpacing = 16;
  boardArea.fills = [];

  const columns = [
    { title: "To Do", count: "3", tint: "#F8FAFC" },
    { title: "In Progress", count: "4", tint: "#FFF7ED" },
    { title: "Under Review", count: "2", tint: "#F0F9FF" },
    { title: "Done", count: "6", tint: "#ECFDF5" },
  ];

  for (const col of columns) {
    const colFrame = figma.createFrame();
    colFrame.resize(275, 780);
    colFrame.cornerRadius = 14;
    colFrame.fills = solidColor(col.tint);
    colFrame.strokes = solidColor('#E2E8F0');
    colFrame.strokeWeight = 1;
    colFrame.paddingTop = 16;
    colFrame.paddingBottom = 16;
    colFrame.paddingLeft = 14;
    colFrame.paddingRight = 14;
    colFrame.layoutMode = "VERTICAL";
    colFrame.itemSpacing = 12;

    // Col Header
    const ch = figma.createFrame();
    ch.layoutMode = "HORIZONTAL";
    ch.primaryAxisAlignItems = "SPACE_BETWEEN";
    ch.counterAxisAlignItems = "CENTER";
    ch.resize(247, 24);
    ch.fills = [];
    ch.appendChild(createText(col.title, boldFont, 13, '#0F172A'));
    ch.appendChild(createText(col.count, boldFont, 11, '#64748B'));
    colFrame.appendChild(ch);

    // Cards in column
    for (let c = 0; c < 3; c++) {
      const card = figma.createFrame();
      card.resize(247, 100);
      card.cornerRadius = 10;
      card.fills = solidColor('#FFFFFF');
      card.strokes = solidColor('#CBD5E1');
      card.strokeWeight = 1;
      card.paddingLeft = 14;
      card.paddingRight = 14;
      card.paddingTop = 12;
      card.paddingBottom = 12;
      card.layoutMode = "VERTICAL";
      card.itemSpacing = 6;
      card.effects = [subtleShadow];

      const tagRow = figma.createFrame();
      tagRow.layoutMode = "HORIZONTAL";
      tagRow.primaryAxisAlignItems = "SPACE_BETWEEN";
      tagRow.resize(219, 16);
      tagRow.fills = [];
      tagRow.appendChild(createText("#Engineering", semiBoldFont, 10, '#6366F1'));
      tagRow.appendChild(createText("HIGH", boldFont, 9, '#EA580C'));
      card.appendChild(tagRow);

      card.appendChild(createText(`Refactor back-end query optimizer #${c + 1}`, boldFont, 12, '#0F172A'));
      card.appendChild(createText("Subtasks: 3 / 4 completed", regularFont, 10, '#64748B'));

      colFrame.appendChild(card);
    }

    boardArea.appendChild(colFrame);
  }

  screen.appendChild(boardArea);
  parent.appendChild(screen);
}

// =============================================================================
// SCREEN 07: TASK DETAIL DRAWER
// =============================================================================
function drawScreen07_TaskDrawer(parent, x, y) {
  createHUDLabel(parent, "07", "Task Detail & Subtasks Slide-Over", "Core Workspace", x, y);
  const screen = createDesktopFrame("07 / Screen - Task Drawer", x, y);

  drawSidebar(screen, "Tasks & Board");
  drawHeader(screen, "Sprint Kanban Board");

  // Dark scrim overlay
  const scrim = figma.createFrame();
  scrim.resize(1440, 900);
  scrim.fills = solidColor('#000000', 0.4);
  screen.appendChild(scrim);

  // Slide-over Drawer
  const drawer = figma.createFrame();
  drawer.name = "Slide-over Drawer";
  drawer.x = 900;
  drawer.y = 0;
  drawer.resize(540, 900);
  drawer.fills = solidColor('#FFFFFF');
  drawer.strokes = solidColor('#E2E8F0');
  drawer.strokeWeight = 1;
  drawer.effects = [elevatedShadow];
  drawer.paddingLeft = 32;
  drawer.paddingRight = 32;
  drawer.paddingTop = 32;
  drawer.paddingBottom = 32;
  drawer.layoutMode = "VERTICAL";
  drawer.itemSpacing = 20;

  // Header
  const dHead = figma.createFrame();
  dHead.layoutMode = "HORIZONTAL";
  dHead.primaryAxisAlignItems = "SPACE_BETWEEN";
  dHead.resize(476, 28);
  dHead.fills = [];
  dHead.appendChild(createText("MRD-008 · TASK DETAILS", semiBoldFont, 11, '#6366F1'));
  dHead.appendChild(createText("✕ Close", semiBoldFont, 12, '#64748B'));
  drawer.appendChild(dHead);

  drawer.appendChild(createText("React 19 Compiler Upgrade & Memoization Optimization", boldFont, 20, '#0F172A'));

  // Badges row
  const bRow = figma.createFrame();
  bRow.layoutMode = "HORIZONTAL";
  bRow.itemSpacing = 10;
  bRow.fills = [];
  bRow.appendChild(createText("STATUS: IN PROGRESS", boldFont, 11, '#C2410C'));
  bRow.appendChild(createText("PRIORITY: CRITICAL", boldFont, 11, '#BE123C'));
  drawer.appendChild(bRow);

  // Subtasks list
  drawer.appendChild(createText("SUBTASKS (4 / 5 DONE)", boldFont, 12, '#0F172A'));

  const subs = [
    { title: "Review React Compiler ESLint rules", done: true },
    { title: "Audit useCallback dependency arrays in Dashboard", done: true },
    { title: "Disable preserve-manual-memoization in eslint.config", done: true },
    { title: "Test production build bundle with next build", done: true },
    { title: "Merge PR into main branch", done: false },
  ];

  for (const s of subs) {
    const sRow = figma.createFrame();
    sRow.layoutMode = "HORIZONTAL";
    sRow.counterAxisAlignItems = "CENTER";
    sRow.itemSpacing = 10;
    sRow.fills = [];
    sRow.appendChild(createText(s.done ? "☑" : "☐", boldFont, 14, s.done ? '#10B981' : '#94A3B8'));
    sRow.appendChild(createText(s.title, regularFont, 12, s.done ? '#64748B' : '#0F172A'));
    drawer.appendChild(sRow);
  }

  // Comments area
  drawer.appendChild(createText("DISCUSSION & COMMENTS", boldFont, 12, '#0F172A'));
  const commBox = figma.createFrame();
  commBox.resize(476, 80);
  commBox.cornerRadius = 8;
  commBox.fills = solidColor('#F8FAFC');
  commBox.strokes = solidColor('#E2E8F0');
  commBox.strokeWeight = 1;
  commBox.paddingLeft = 12;
  commBox.paddingTop = 10;
  commBox.appendChild(createText("Smit: Build succeeded in 4.4s with 0 errors!", regularFont, 11, '#334155'));
  drawer.appendChild(commBox);

  screen.appendChild(drawer);
  parent.appendChild(screen);
}

// =============================================================================
// SCREEN 08: ANALYTICS & TELEMETRY
// =============================================================================
function drawScreen08_Analytics(parent, x, y) {
  createHUDLabel(parent, "08", "Analytics & Velocity Telemetry", "Analytics", x, y);
  const screen = createDesktopFrame("08 / Screen - Analytics", x, y);

  drawSidebar(screen, "Analytics");
  drawHeader(screen, "Performance Telemetry");

  const content = figma.createFrame();
  content.x = 264;
  content.y = 88;
  content.resize(1148, 788);
  content.layoutMode = "VERTICAL";
  content.itemSpacing = 20;
  content.fills = [];

  // Top Metric Dials
  const dialRow = figma.createFrame();
  dialRow.layoutMode = "HORIZONTAL";
  dialRow.itemSpacing = 16;
  dialRow.fills = [];

  const dials = [
    { title: "SPRINT COMPLETION RATE", val: "91.4%", delta: "+6.2%", ...PASTELS.Mint },
    { title: "AVERAGE CYCLE TIME", val: "2.4 Days", delta: "-18% faster", ...PASTELS.Sky },
    { title: "TOTAL STORY POINTS", val: "64 Pts", delta: "Target: 60 Pts", ...PASTELS.Lavender },
  ];

  for (const d of dials) {
    const card = figma.createFrame();
    card.resize(372, 110);
    card.cornerRadius = 14;
    card.fills = solidColor('#FFFFFF');
    card.strokes = solidColor('#E2E8F0');
    card.strokeWeight = 1;
    card.paddingTop = 16;
    card.paddingLeft = 20;
    card.layoutMode = "VERTICAL";
    card.itemSpacing = 6;
    card.appendChild(createText(d.title, semiBoldFont, 10, '#64748B'));
    card.appendChild(createText(d.val, boldFont, 30, '#0F172A'));
    card.appendChild(createText(d.delta, boldFont, 11, d.text));
    dialRow.appendChild(card);
  }
  content.appendChild(dialRow);

  // Big Chart Card: Weekly Velocity Histogram
  const chartCard = figma.createFrame();
  chartCard.resize(1148, 380);
  chartCard.cornerRadius = 16;
  chartCard.fills = solidColor('#FFFFFF');
  chartCard.strokes = solidColor('#E2E8F0');
  chartCard.strokeWeight = 1;
  chartCard.paddingTop = 24;
  chartCard.paddingLeft = 28;
  chartCard.paddingRight = 28;
  chartCard.layoutMode = "VERTICAL";
  chartCard.itemSpacing = 20;

  chartCard.appendChild(createText("WEEKLY VELOCITY HISTOGRAM (COMMITS & TASKS COMPLETED)", boldFont, 13, '#0F172A'));

  // Histogram Bars Row
  const barContainer = figma.createFrame();
  barContainer.resize(1092, 260);
  barContainer.layoutMode = "HORIZONTAL";
  barContainer.primaryAxisAlignItems = "SPACE_BETWEEN";
  barContainer.counterAxisAlignItems = "MAX";
  barContainer.fills = [];

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const heights = [140, 190, 160, 240, 210, 80, 60];

  for (let i = 0; i < 7; i++) {
    const col = figma.createFrame();
    col.layoutMode = "VERTICAL";
    col.counterAxisAlignItems = "CENTER";
    col.itemSpacing = 8;
    col.fills = [];

    const b = figma.createRectangle();
    b.resize(60, heights[i]);
    b.cornerRadius = 8;
    b.fills = solidColor('#4F46E5');
    col.appendChild(b);

    col.appendChild(createText(days[i], semiBoldFont, 12, '#64748B'));
    barContainer.appendChild(col);
  }
  chartCard.appendChild(barContainer);
  content.appendChild(chartCard);

  screen.appendChild(content);
  parent.appendChild(screen);
}

// =============================================================================
// SCREEN 09: CALENDAR
// =============================================================================
function drawScreen09_Calendar(parent, x, y) {
  createHUDLabel(parent, "09", "Calendar & Sprint Milestones", "Planning", x, y);
  const screen = createDesktopFrame("09 / Screen - Calendar", x, y);

  drawSidebar(screen, "Calendar");
  drawHeader(screen, "Sprint Calendar & Deadlines");

  const content = figma.createFrame();
  content.x = 264;
  content.y = 88;
  content.resize(1148, 788);
  content.layoutMode = "VERTICAL";
  content.itemSpacing = 16;
  content.fills = [];

  // Month navigation
  const calHeader = figma.createFrame();
  calHeader.resize(1148, 40);
  calHeader.layoutMode = "HORIZONTAL";
  calHeader.primaryAxisAlignItems = "SPACE_BETWEEN";
  calHeader.counterAxisAlignItems = "CENTER";
  calHeader.fills = [];
  calHeader.appendChild(createText("October 2026", boldFont, 18, '#0F172A'));
  calHeader.appendChild(createText("Month View · Today", semiBoldFont, 12, '#4F46E5'));
  content.appendChild(calHeader);

  // Calendar Grid (7 columns x 5 rows)
  const grid = figma.createFrame();
  grid.resize(1148, 680);
  grid.cornerRadius = 14;
  grid.fills = solidColor('#FFFFFF');
  grid.strokes = solidColor('#E2E8F0');
  grid.strokeWeight = 1;
  grid.paddingTop = 16;
  grid.paddingLeft = 16;
  grid.paddingRight = 16;
  grid.layoutMode = "VERTICAL";
  grid.itemSpacing = 10;

  // Day names
  const dRow = figma.createFrame();
  dRow.layoutMode = "HORIZONTAL";
  dRow.primaryAxisAlignItems = "SPACE_BETWEEN";
  dRow.resize(1116, 24);
  dRow.fills = [];
  for (const d of ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]) {
    dRow.appendChild(createText(d, semiBoldFont, 11, '#94A3B8'));
  }
  grid.appendChild(dRow);

  // Month rows mockup
  for (let r = 0; r < 4; r++) {
    const row = figma.createFrame();
    row.resize(1116, 130);
    row.layoutMode = "HORIZONTAL";
    row.itemSpacing = 10;
    row.fills = [];

    for (let c = 0; c < 7; c++) {
      const cell = figma.createFrame();
      cell.resize(150, 130);
      cell.cornerRadius = 8;
      cell.fills = solidColor('#F8FAFC');
      cell.strokes = solidColor('#E2E8F0');
      cell.strokeWeight = 1;
      cell.paddingTop = 8;
      cell.paddingLeft = 8;
      cell.paddingRight = 8;
      cell.layoutMode = "VERTICAL";
      cell.itemSpacing = 6;

      cell.appendChild(createText(String(r * 7 + c + 1), semiBoldFont, 12, '#334155'));

      if ((r + c) % 3 === 0) {
        const pill = figma.createFrame();
        pill.resize(134, 22);
        pill.cornerRadius = 4;
        pill.fills = solidColor('#EEF2FF');
        pill.paddingLeft = 6;
        pill.layoutMode = "HORIZONTAL";
        pill.counterAxisAlignItems = "CENTER";
        pill.appendChild(createText("MRD-004 Sprint Demo", boldFont, 9, '#4338CA'));
        cell.appendChild(pill);
      }
      row.appendChild(cell);
    }
    grid.appendChild(row);
  }
  content.appendChild(grid);

  screen.appendChild(content);
  parent.appendChild(screen);
}

// =============================================================================
// SCREEN 10: TEAM DIRECTORY
// =============================================================================
function drawScreen10_Team(parent, x, y) {
  createHUDLabel(parent, "10", "Team Directory & Presence", "Management", x, y);
  const screen = createDesktopFrame("10 / Screen - Team", x, y);

  drawSidebar(screen, "Team Directory");
  drawHeader(screen, "Team Directory & Member Workload");

  const content = figma.createFrame();
  content.x = 264;
  content.y = 88;
  content.resize(1148, 788);
  content.layoutMode = "VERTICAL";
  content.itemSpacing = 20;
  content.fills = [];

  // Member Grid (6 member cards)
  const mGrid = figma.createFrame();
  mGrid.layoutMode = "HORIZONTAL";
  mGrid.itemSpacing = 16;
  mGrid.fills = [];

  const members = [
    { name: "Smit Nayi", role: "Lead Engineer", tasks: "5 Tasks Active", ...PASTELS.Lavender },
    { name: "Nitya Patel", role: "Full Stack Architect", tasks: "4 Tasks Active", ...PASTELS.Peach },
    { name: "Aarav Kumar", role: "Product Designer", tasks: "3 Tasks Active", ...PASTELS.Sky },
  ];

  for (const m of members) {
    const card = figma.createFrame();
    card.resize(372, 220);
    card.cornerRadius = 14;
    card.fills = solidColor('#FFFFFF');
    card.strokes = solidColor('#E2E8F0');
    card.strokeWeight = 1;
    card.paddingTop = 24;
    card.paddingLeft = 24;
    card.paddingRight = 24;
    card.layoutMode = "VERTICAL";
    card.itemSpacing = 12;
    card.effects = [subtleShadow];

    const av = figma.createFrame();
    av.resize(48, 48);
    av.cornerRadius = 999;
    av.fills = solidColor(m.bg);
    av.layoutMode = "HORIZONTAL";
    av.primaryAxisAlignItems = "CENTER";
    av.counterAxisAlignItems = "CENTER";
    av.appendChild(createText(m.name.split(' ').map(n => n[0]).join(''), boldFont, 16, m.text));
    card.appendChild(av);

    card.appendChild(createText(m.name, boldFont, 16, '#0F172A'));
    card.appendChild(createText(m.role, semiBoldFont, 12, '#64748B'));
    card.appendChild(createText(m.tasks, mediumFont, 12, m.text));

    mGrid.appendChild(card);
  }
  content.appendChild(mGrid);

  screen.appendChild(content);
  parent.appendChild(screen);
}

// =============================================================================
// SCREEN 11: WORKSPACE SETTINGS & BILLING
// =============================================================================
function drawScreen11_Settings(parent, x, y) {
  createHUDLabel(parent, "11", "Workspace Settings & Billing", "Management", x, y);
  const screen = createDesktopFrame("11 / Screen - Settings", x, y);

  drawSidebar(screen, "Settings");
  drawHeader(screen, "Workspace Settings & Subscriptions");

  const content = figma.createFrame();
  content.x = 264;
  content.y = 88;
  content.resize(1148, 788);
  content.layoutMode = "VERTICAL";
  content.itemSpacing = 20;
  content.fills = [];

  // Settings Tabs
  const tabs = figma.createFrame();
  tabs.layoutMode = "HORIZONTAL";
  tabs.itemSpacing = 16;
  tabs.fills = [];
  tabs.appendChild(createText("General Settings", boldFont, 13, '#0F172A'));
  tabs.appendChild(createText("Team Members & Roles", mediumFont, 13, '#64748B'));
  tabs.appendChild(createText("Integrations (GitHub, Slack)", mediumFont, 13, '#64748B'));
  tabs.appendChild(createText("Billing & Subscriptions", boldFont, 13, '#4F46E5'));
  content.appendChild(tabs);

  // Pro Plan Bento Card
  const planCard = figma.createFrame();
  planCard.resize(720, 240);
  planCard.cornerRadius = 16;
  planCard.fills = solidColor('#090D16');
  planCard.strokes = solidColor('#1E293B');
  planCard.strokeWeight = 1;
  planCard.paddingTop = 24;
  planCard.paddingLeft = 28;
  planCard.paddingRight = 28;
  planCard.layoutMode = "VERTICAL";
  planCard.itemSpacing = 12;

  planCard.appendChild(createText("CURRENT SUBSCRIPTION", semiBoldFont, 11, '#818CF8'));
  planCard.appendChild(createText("Meridian Clarity PRO Tier", boldFont, 24, '#FFFFFF'));
  planCard.appendChild(createText("$29 / user / month · Renews Oct 31, 2026 via Visa ending in 4242", regularFont, 13, '#94A3B8'));

  const feats = figma.createFrame();
  feats.layoutMode = "HORIZONTAL";
  feats.itemSpacing = 24;
  feats.fills = [];
  feats.appendChild(createText("✓ Unlimited Sprints", semiBoldFont, 12, '#34D399'));
  feats.appendChild(createText("✓ GitHub Auto-sync", semiBoldFont, 12, '#34D399'));
  feats.appendChild(createText("✓ Velocity Telemetry", semiBoldFont, 12, '#34D399'));
  planCard.appendChild(feats);

  content.appendChild(planCard);
  screen.appendChild(content);
  parent.appendChild(screen);
}

// =============================================================================
// MAIN GENERATOR CONTROLLERS
// =============================================================================

async function generateScreens() {
  await ensureFonts();

  const screensPage = getOrCreatePage("Screens", "1:5");
  figma.currentPage = screensPage;

  figma.ui.postMessage({ type: 'STATUS', text: 'Drawing 11 desktop screens...', done: false });

  // Grid Layout Coordinates: 4 Columns x 3 Rows
  // Col 0: x = 0, Col 1: x = 1560, Col 2: x = 3120, Col 3: x = 4680
  // Row 0: y = 80, Row 1: y = 1120, Row 2: y = 2160
  const spacingX = 1560;
  const spacingY = 1080;
  const startY = 80;

  // Row 1: Auth & Onboarding
  drawScreen01_Login(screensPage, 0, startY);
  drawScreen02_Signup(screensPage, spacingX, startY);
  drawScreen03_ForgotPass(screensPage, spacingX * 2, startY);
  drawScreen04_OrgSetup(screensPage, spacingX * 3, startY);

  // Row 2: Core Workspace
  drawScreen05_Dashboard(screensPage, 0, startY + spacingY);
  drawScreen06_Kanban(screensPage, spacingX, startY + spacingY);
  drawScreen07_TaskDrawer(screensPage, spacingX * 2, startY + spacingY);

  // Row 3: Analytics, Planning & Management
  drawScreen08_Analytics(screensPage, 0, startY + spacingY * 2);
  drawScreen09_Calendar(screensPage, spacingX, startY + spacingY * 2);
  drawScreen10_Team(screensPage, spacingX * 2, startY + spacingY * 2);
  drawScreen11_Settings(screensPage, spacingX * 3, startY + spacingY * 2);

  figma.viewport.scrollAndZoomIntoView(screensPage.children);
  figma.notify("🎉 All 11 application screens generated on 'Screens' page!", { timeout: 4000 });
  figma.ui.postMessage({ type: 'STATUS', text: '✨ All 11 screens generated successfully!', done: true });
}

async function generateComponents() {
  await ensureFonts();

  const compPage = getOrCreatePage("Components", "1:4");
  figma.currentPage = compPage;

  figma.ui.postMessage({ type: 'STATUS', text: 'Generating Design System & Components...', done: false });

  // Call the component generation sections
  // Section 1: Color Palette
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

  const pRow = figma.createFrame();
  pRow.layoutMode = "HORIZONTAL";
  pRow.itemSpacing = 12;
  pRow.fills = [];
  for (const [name, p] of Object.entries(PASTELS)) {
    const chip = figma.createFrame();
    chip.resize(130, 80);
    chip.cornerRadius = 10;
    chip.fills = solidColor(p.bg);
    chip.strokes = solidColor(p.border);
    chip.strokeWeight = 1;
    chip.paddingLeft = 12;
    chip.paddingTop = 12;
    chip.layoutMode = "VERTICAL";
    chip.itemSpacing = 4;
    chip.appendChild(createText(name, boldFont, 12, p.text));
    chip.appendChild(createText(p.text, regularFont, 10, p.text));
    pRow.appendChild(chip);
  }
  secColors.appendChild(pRow);
  compPage.appendChild(secColors);

  // Section 2: Buttons Component Set
  const secBtns = figma.createFrame();
  secBtns.name = "02 / Button Variants";
  secBtns.y = 300;
  secBtns.resize(1280, 260);
  secBtns.fills = solidColor('#FFFFFF');
  secBtns.strokes = solidColor('#E2E8F0');
  secBtns.strokeWeight = 1;
  secBtns.cornerRadius = 16;
  secBtns.paddingTop = 24;
  secBtns.paddingLeft = 28;
  secBtns.layoutMode = "VERTICAL";
  secBtns.itemSpacing = 16;
  secBtns.appendChild(createText("02 / TACTILE BUTTONS (8 VARIANTS)", boldFont, 16, '#0F172A'));

  const bRow = figma.createFrame();
  bRow.layoutMode = "HORIZONTAL";
  bRow.itemSpacing = 14;
  bRow.fills = [];

  const btnDefs = [
    { name: "Primary", bg: "#0F172A", text: "#FFFFFF" },
    { name: "Brand", bg: "#4F46E5", text: "#FFFFFF" },
    { name: "Secondary", bg: "#FFFFFF", text: "#0F172A", stroke: "#E2E8F0" },
    { name: "Danger", bg: "#FFF1F2", text: "#E11D48", stroke: "#FECDD3" },
    { name: "Soft", bg: "#EEF2FF", text: "#4338CA" },
  ];

  for (const b of btnDefs) {
    const btn = figma.createComponent();
    btn.name = `Button / ${b.name}`;
    btn.resize(140, 40);
    btn.cornerRadius = 10;
    btn.fills = solidColor(b.bg);
    if (b.stroke) {
      btn.strokes = solidColor(b.stroke);
      btn.strokeWeight = 1;
    }
    btn.layoutMode = "HORIZONTAL";
    btn.primaryAxisAlignItems = "CENTER";
    btn.counterAxisAlignItems = "CENTER";
    btn.appendChild(createText(b.name, semiBoldFont, 13, b.text));
    bRow.appendChild(btn);
  }
  secBtns.appendChild(bRow);
  compPage.appendChild(secBtns);

  figma.viewport.scrollAndZoomIntoView(compPage.children);
  figma.notify("✨ Components successfully created on 'Components' page!", { timeout: 4000 });
  figma.ui.postMessage({ type: 'STATUS', text: '✨ Components generated successfully!', done: true });
}

// Message Listener from UI
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
