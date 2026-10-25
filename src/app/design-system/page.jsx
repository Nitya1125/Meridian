"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Button,
  Badge,
  PriorityBadge,
  TagBadge,
  StatusBadge,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Input,
  Textarea,
  Select,
  Switch,
  Checkbox,
  Avatar,
  AvatarGroup,
  TactileTabs,
  ProgressBar,
  KpiDial,
  Modal,
  Drawer,
  Tooltip,
  Divider,
  Dropdown,
  Icon,
} from '@/components/ui';
import {
  PRIMITIVES,
  PASTELS,
  PRIORITY_TOKENS,
  TAG_TOKENS,
  STATUS_TOKENS,
  TYPOGRAPHY,
} from '@/design-system/tokens';

export default function DesignSystemPage() {
  const [activeTab, setActiveTab] = useState('components');
  const [activeBtnVariant, setActiveBtnVariant] = useState('primary');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [switchChecked, setSwitchChecked] = useState(true);
  const [checkboxChecked, setCheckboxChecked] = useState(true);
  const [inputText, setInputText] = useState('Design System 2.0');
  const [segmentedValue, setSegmentedValue] = useState('in_progress');
  const [progressVal, setProgressVal] = useState(65);
  const [isBtnLoading, setIsBtnLoading] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState('');

  const copyCode = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(''), 2000);
  };

  const sampleUsers = [
    { name: 'Kacie Velasquez', status: 'online' },
    { name: 'Alex Johnson', status: 'flow' },
    { name: 'Devon Lane', status: 'away' },
    { name: 'Marcus Sterling', status: 'online' },
    { name: 'Elena Rostova', status: 'away' },
    { name: 'Liam Vance', status: 'online' },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 pb-24 selection:bg-indigo-500/20 selection:text-indigo-900">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#FAF8F5]/85 backdrop-blur-md border-b border-stone-200/80 px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors text-[13px] font-semibold"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Meridian
            </Link>
            <span className="text-stone-300">/</span>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse" />
              <h1 className="font-sans font-extrabold text-[15px] tracking-tight text-stone-900">
                MERIDIAN DESIGN SYSTEM
              </h1>
              <Badge tint="lavender" size="xs" className="font-mono">
                v2.0
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <TactileTabs
              options={[
                { id: 'components', label: 'Components' },
                { id: 'foundations', label: 'Foundations & Colors' },
                { id: 'typography', label: 'Typography' },
              ]}
              value={activeTab}
              onChange={setActiveTab}
              size="sm"
            />
          </div>
        </div>
      </header>

      {/* Hero Header */}
      <section className="max-w-7xl mx-auto px-6 pt-12 pb-8">
        <div className="max-w-3xl">
          <Badge tint="stone" size="sm" className="mb-3 font-mono">
            TACTILE LUXURY • EDITORIAL PRECISION
          </Badge>
          <h2 className="font-serif text-5xl lg:text-6xl text-stone-900 tracking-[-0.03em] leading-[1.08]">
            The <span className="italic font-normal text-indigo-700">living</span> system for Meridian.
          </h2>
          <p className="mt-4 font-sans text-[15px] text-stone-600 leading-relaxed max-w-2xl">
            A cohesive library of design tokens, neo-skeuomorphic tactile controls, calibrated WCAG AA
            pastels, and kinetic spring physics. Every future feature in Meridian imports from{' '}
            <code className="px-1.5 py-0.5 rounded bg-stone-200/80 font-mono text-[12.5px] font-semibold text-stone-800">
              @/components/ui
            </code>
            .
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button
              variant="primary"
              size="sm"
              onClick={() => copyCode("import { Button, Badge, Card, Input, Avatar, Modal } from '@/components/ui';", 'import-all')}
            >
              {copiedSnippet === 'import-all' ? 'Copied Import Statement!' : 'Copy UI Barrel Import'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(true)}
            >
              Test Modal Dialog
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsDrawerOpen(true)}
            >
              Test Slide-over Drawer
            </Button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* TAB 1: COMPONENTS SHOWCASE                                               */}
      {/* ========================================================================= */}
      {activeTab === 'components' && (
        <main className="max-w-7xl mx-auto px-6 space-y-12">
          {/* Section: Buttons */}
          <Card variant="default" padding="lg">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div>
                <span className="font-mono text-[11px] font-bold text-indigo-600 tracking-wider uppercase">01 / Actions</span>
                <h3 className="font-sans text-[18px] font-bold text-stone-900">Tactile Buttons</h3>
                <p className="text-[13px] text-stone-500">Neo-skeuomorphic depress with active:scale-[0.98] and kinetic spring curve.</p>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={isBtnLoading}
                  onChange={setIsBtnLoading}
                  label="Loading State"
                  size="sm"
                />
              </div>
            </div>

            <div className="mt-6 space-y-6">
              <div>
                <h4 className="text-[12px] font-mono uppercase text-stone-400 font-semibold mb-3">Variants</h4>
                <div className="flex flex-wrap items-center gap-3">
                  <Button variant="primary" isLoading={isBtnLoading}>Primary Obsidian</Button>
                  <Button variant="brand" isLoading={isBtnLoading}>Brand Indigo</Button>
                  <Button variant="secondary" isLoading={isBtnLoading}>Secondary Stone</Button>
                  <Button variant="outline" isLoading={isBtnLoading}>Outline</Button>
                  <Button variant="ghost" isLoading={isBtnLoading}>Ghost</Button>
                  <Button variant="danger" isLoading={isBtnLoading}>Danger Soft</Button>
                  <Button variant="dangerSolid" isLoading={isBtnLoading}>Danger Solid</Button>
                  <Button variant="soft" isLoading={isBtnLoading}>Pastel Soft</Button>
                </div>
              </div>

              <div>
                <h4 className="text-[12px] font-mono uppercase text-stone-400 font-semibold mb-3">Sizes Scale</h4>
                <div className="flex flex-wrap items-end gap-3">
                  <Button size="xs" variant="primary">Size XS (28px)</Button>
                  <Button size="sm" variant="primary">Size SM (32px)</Button>
                  <Button size="md" variant="primary">Size MD (38px)</Button>
                  <Button size="lg" variant="primary">Size LG (44px)</Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Section: Badges & Pills */}
          <Card variant="default" padding="lg">
            <div className="pb-4 border-b border-stone-100">
              <span className="font-mono text-[11px] font-bold text-indigo-600 tracking-wider uppercase">02 / Indicators</span>
              <h3 className="font-sans text-[18px] font-bold text-stone-900">Badges, Priority & Domain Tags</h3>
              <p className="text-[13px] text-stone-500">Curated pastel ecosystem, glowing telemetry dots, and Figma domain categories.</p>
            </div>

            <div className="mt-6 space-y-6">
              <div>
                <h4 className="text-[12px] font-mono uppercase text-stone-400 font-semibold mb-3">Priority Badges (with telemetry beacon)</h4>
                <div className="flex flex-wrap items-center gap-3">
                  <PriorityBadge priority="critical" size="md" />
                  <PriorityBadge priority="high" size="md" />
                  <PriorityBadge priority="medium" size="md" />
                  <PriorityBadge priority="low" size="md" />
                </div>
              </div>

              <div>
                <h4 className="text-[12px] font-mono uppercase text-stone-400 font-semibold mb-3">Status Badges</h4>
                <div className="flex flex-wrap items-center gap-3">
                  <StatusBadge status="todo" />
                  <StatusBadge status="in_progress" />
                  <StatusBadge status="in_review" />
                  <StatusBadge status="done" />
                </div>
              </div>

              <div>
                <h4 className="text-[12px] font-mono uppercase text-stone-400 font-semibold mb-3">Figma Domain Tags</h4>
                <div className="flex flex-wrap items-center gap-2.5">
                  <TagBadge tag="auth" />
                  <TagBadge tag="backend" />
                  <TagBadge tag="frontend" />
                  <TagBadge tag="design" />
                  <TagBadge tag="payments" />
                  <TagBadge tag="security" />
                  <TagBadge tag="mobile" />
                  <TagBadge tag="infra" />
                  <TagBadge tag="testing" />
                </div>
              </div>

              <div>
                <h4 className="text-[12px] font-mono uppercase text-stone-400 font-semibold mb-3">Calibrated 7-Pastel Wash (WCAG AA Contrast)</h4>
                <div className="flex flex-wrap items-center gap-2.5">
                  <Badge tint="lavender">Lavender (#6D28D9)</Badge>
                  <Badge tint="peach">Peach (#C2410C)</Badge>
                  <Badge tint="lime">Lime (#3F6212)</Badge>
                  <Badge tint="sky">Sky (#0369A1)</Badge>
                  <Badge tint="rose">Rose (#BE123C)</Badge>
                  <Badge tint="mint">Mint (#15803D)</Badge>
                  <Badge tint="gold">Gold (#854D0E)</Badge>
                  <Badge tint="stone">Stone (#57534E)</Badge>
                </div>
              </div>
            </div>
          </Card>

          {/* Section: Form Controls & Inputs */}
          <Card variant="default" padding="lg">
            <div className="pb-4 border-b border-stone-100">
              <span className="font-mono text-[11px] font-bold text-indigo-600 tracking-wider uppercase">03 / Form Primitives</span>
              <h3 className="font-sans text-[18px] font-bold text-stone-900">Inputs, Toggles & Selects</h3>
              <p className="text-[13px] text-stone-500">3px focus ring halo from Figma Foundations, clean micro-labels, error states.</p>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Input
                label="Task Title"
                placeholder="e.g. Design System Tokens"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                hint="Max 60 characters for crisp Kanban display"
                required
              />

              <Input
                label="Assignee Search"
                placeholder="Search teammates..."
                leftIcon={
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <circle cx="11" cy="11" r="8" strokeWidth="2" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                }
              />

              <Input
                label="API Secret Key"
                value="sk_live_99214_invalid_token"
                readOnly
                error="Invalid API token format: missing signature"
              />

              <Select
                label="Sprint Status"
                options={[
                  { value: 'todo', label: 'To Do (Ready for Dev)' },
                  { value: 'in_progress', label: 'In Progress' },
                  { value: 'in_review', label: 'In Code Review' },
                  { value: 'done', label: 'Done & Deployed' },
                ]}
                defaultValue="in_progress"
              />

              <div className="flex flex-col gap-3 justify-center pt-5">
                <Switch
                  checked={switchChecked}
                  onChange={setSwitchChecked}
                  label="Mechanical Spring Switch"
                  description="Kinetic stretch on toggle"
                />
                <Checkbox
                  checked={checkboxChecked}
                  onChange={setCheckboxChecked}
                  label="Tactile Checkbox"
                  description="Subtask complete confirmation"
                />
              </div>

              <div className="flex flex-col justify-center pt-2">
                <label className="block font-sans text-[12.5px] font-semibold text-stone-700 mb-1.5">
                  Contextual Dropdown
                </label>
                <Dropdown
                  trigger={
                    <Button variant="outline" size="md" fullWidth>
                      <span>Task Options</span>
                      <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </Button>
                  }
                  items={[
                    { id: 'edit', label: 'Edit Task Specs', shortcut: '⌘E' },
                    { id: 'assign', label: 'Reassign Member' },
                    { id: 'duplicate', label: 'Duplicate Task' },
                    { type: 'divider' },
                    { id: 'delete', label: 'Delete Task', danger: true, shortcut: '⌫' },
                  ]}
                />
              </div>

              <div className="col-span-1 md:col-span-2 lg:col-span-3">
                <Textarea
                  label="Task Description"
                  rows={2}
                  placeholder="Detail the sprint deliverables, acceptance criteria, and edge cases..."
                  hint="Supports Markdown formatting"
                />
              </div>
            </div>
          </Card>

          {/* Section: Tactile Tabs & Progress Bars */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card variant="default" padding="lg">
              <div className="pb-4 border-b border-stone-100">
                <span className="font-mono text-[11px] font-bold text-indigo-600 tracking-wider uppercase">04 / Kinetic Tabs</span>
                <h3 className="font-sans text-[18px] font-bold text-stone-900">Tactile Segmented Controls</h3>
                <p className="text-[13px] text-stone-500">Direction-aware stretching indicator pill that snaps into position.</p>
              </div>

              <div className="mt-6 space-y-6">
                <div>
                  <h4 className="text-[12px] font-mono uppercase text-stone-400 font-semibold mb-3">Light Substrate</h4>
                  <TactileTabs
                    options={[
                      { id: 'todo', label: 'To Do', count: 12 },
                      { id: 'in_progress', label: 'In Progress', count: 4 },
                      { id: 'done', label: 'Completed', count: 28 },
                    ]}
                    value={segmentedValue}
                    onChange={setSegmentedValue}
                    size="md"
                  />
                </div>

                <div>
                  <h4 className="text-[12px] font-mono uppercase text-stone-400 font-semibold mb-3">Obsidian Dock</h4>
                  <TactileTabs
                    options={[
                      { id: 'day', label: '24h' },
                      { id: 'week', label: '7 Days' },
                      { id: 'month', label: '30 Days' },
                      { id: 'quarter', label: 'Sprint 24' },
                    ]}
                    value="week"
                    onChange={() => {}}
                    variant="obsidian"
                    size="sm"
                  />
                </div>
              </div>
            </Card>

            <Card variant="default" padding="lg">
              <div className="pb-4 border-b border-stone-100">
                <span className="font-mono text-[11px] font-bold text-indigo-600 tracking-wider uppercase">05 / Velocity Meters</span>
                <h3 className="font-sans text-[18px] font-bold text-stone-900">Striped Kinetic Progress</h3>
                <p className="text-[13px] text-stone-500">45-degree diagonal candy striping from DESIGN.md Section 3.2.</p>
              </div>

              <div className="mt-6 space-y-4">
                <ProgressBar
                  value={progressVal}
                  color="green"
                  striped
                  showLabel
                  subtasks={{ completed: 4, total: 6 }}
                />

                <ProgressBar
                  value={85}
                  color="orange"
                  striped
                  showLabel
                />

                <ProgressBar
                  value={40}
                  color="purple"
                  striped
                  showLabel
                />

                <ProgressBar
                  value={70}
                  color="sky"
                  size="sm"
                />

                <div className="pt-2 flex items-center gap-3">
                  <Button size="xs" variant="secondary" onClick={() => setProgressVal(Math.max(10, progressVal - 15))}>
                    -15% Velocity
                  </Button>
                  <Button size="xs" variant="secondary" onClick={() => setProgressVal(Math.min(100, progressVal + 15))}>
                    +15% Velocity
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Section: Telemetry KPI Dials & Avatars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <KpiDial
              label="Active Sprint Velocity"
              value="1,482"
              delta="+18.4%"
              tint="purple"
              subtitle="Story points completed vs. prior cycle"
              sparkData={[40, 65, 50, 85, 60, 95, 75]}
            />
            <KpiDial
              label="Cycle Lead Time"
              value="2.4d"
              delta="-12.1%"
              tint="lime"
              subtitle="Average time to commit & release"
              sparkData={[75, 60, 80, 50, 40, 35, 30]}
            />
            <Card variant="default" padding="lg" className="flex flex-col justify-between">
              <div>
                <span className="font-mono text-[11px] font-bold text-indigo-600 tracking-wider uppercase">06 / Studio Team</span>
                <h3 className="font-sans text-[18px] font-bold text-stone-900 mt-1">Avatars & Presence</h3>
                <p className="text-[13px] text-stone-500">Presence halos (online pulse, in-flow amber, away stone) and stacked groups.</p>
              </div>

              <div className="my-6">
                <h4 className="text-[11px] font-mono uppercase text-stone-400 font-semibold mb-2">Avatar Stack (+N counter)</h4>
                <AvatarGroup users={sampleUsers} max={4} size="md" />
              </div>

              <div className="flex items-center gap-3">
                <Avatar name="Kacie Velasquez" size="lg" status="online" />
                <div>
                  <div className="text-[13.5px] font-bold text-stone-900">Kacie Velasquez</div>
                  <div className="text-[11.5px] font-medium text-lime-600">Active in Sprint Flow</div>
                </div>
              </div>
            </Card>
          </div>
        </main>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: FOUNDATIONS & COLOR PALETTES                                       */}
      {/* ========================================================================= */}
      {activeTab === 'foundations' && (
        <main className="max-w-7xl mx-auto px-6 space-y-12">
          {/* Primitive Ramps */}
          <Card variant="default" padding="lg">
            <div className="pb-4 border-b border-stone-100">
              <span className="font-mono text-[11px] font-bold text-indigo-600 tracking-wider uppercase">Figma Foundations / Primitive Colors</span>
              <h3 className="font-sans text-[18px] font-bold text-stone-900">9 Primitive Swatch Ramps</h3>
              <p className="text-[13px] text-stone-500">Extracted from node 1:2. Semantic tokens alias these; never apply primitives directly in components.</p>
            </div>

            <div className="mt-6 space-y-6">
              {Object.entries(PRIMITIVES).map(([rampName, ramp]) => (
                <div key={rampName}>
                  <div className="text-[13px] font-bold font-mono text-stone-800 uppercase mb-2">{rampName}</div>
                  <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                    {Object.entries(ramp).map(([step, hex]) => (
                      <div
                        key={step}
                        className="flex flex-col group cursor-pointer"
                        onClick={() => copyCode(hex, `${rampName}-${step}`)}
                      >
                        <div
                          style={{ backgroundColor: hex }}
                          className="h-12 w-full rounded-lg border border-black/5 shadow-xs transition-transform group-hover:scale-105"
                        />
                        <div className="mt-1 flex items-center justify-between text-[11px] font-mono text-stone-600">
                          <span>{step}</span>
                          <span className="text-[10px] text-stone-400 group-hover:text-indigo-600">
                            {copiedSnippet === `${rampName}-${step}` ? 'Copied!' : hex}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Semantic Light & Dark Mapping */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card variant="default" padding="lg">
              <h3 className="font-sans text-[16px] font-bold text-stone-900 mb-2">Spatial Canvas & Surfaces</h3>
              <p className="text-[13px] text-stone-500 mb-4">Depth layering replacing flat digital sterility.</p>
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-[#FAF8F5] border border-stone-200/80 flex items-center justify-between">
                  <div>
                    <div className="text-[13px] font-bold text-stone-900">Canvas Primary</div>
                    <div className="text-[11px] text-stone-500">Atmospheric warm linen backdrop</div>
                  </div>
                  <code className="text-[12px] font-mono font-bold text-stone-700">#FAF8F5</code>
                </div>

                <div className="p-3 rounded-xl bg-[#F4F0E6] border border-stone-300/80 flex items-center justify-between">
                  <div>
                    <div className="text-[13px] font-bold text-stone-900">Canvas Subtle</div>
                    <div className="text-[11px] text-stone-500">Recessed card tracks, well substrate</div>
                  </div>
                  <code className="text-[12px] font-mono font-bold text-stone-700">#F4F0E6</code>
                </div>

                <div className="p-3 rounded-xl bg-[#111318] text-white flex items-center justify-between">
                  <div>
                    <div className="text-[13px] font-bold text-white">Dark Obsidian</div>
                    <div className="text-[11px] text-stone-400">Floating Dynamic Island & Modals</div>
                  </div>
                  <code className="text-[12px] font-mono font-bold text-amber-400">#111318</code>
                </div>
              </div>
            </Card>

            <Card variant="default" padding="lg">
              <h3 className="font-sans text-[16px] font-bold text-stone-900 mb-2">Elevation & Shadow Physics</h3>
              <p className="text-[13px] text-stone-500 mb-4">Ambient occlusion multi-layer shadows (no muddy harsh drops).</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-white border border-stone-100 shadow-[0_1px_2px_rgba(18,19,22,0.04)] text-center">
                  <div className="text-[12px] font-bold font-mono text-stone-700">Elevation XS</div>
                  <div className="text-[10px] text-stone-400 mt-1">1px subtle offset</div>
                </div>
                <div className="p-4 rounded-xl bg-white border border-stone-100 shadow-[0_4px_16px_-2px_rgba(18,19,22,0.06)] text-center">
                  <div className="text-[12px] font-bold font-mono text-stone-700">Elevation MD</div>
                  <div className="text-[10px] text-stone-400 mt-1">Resting bento card</div>
                </div>
                <div className="p-4 rounded-xl bg-white border border-stone-100 shadow-[0_14px_32px_-4px_rgba(18,19,22,0.08)] text-center">
                  <div className="text-[12px] font-bold font-mono text-stone-700">Elevation LG</div>
                  <div className="text-[10px] text-stone-400 mt-1">Hover lift state</div>
                </div>
                <div className="p-4 rounded-xl bg-white border border-indigo-400 ring-3 ring-indigo-500/20 text-center">
                  <div className="text-[12px] font-bold font-mono text-indigo-700">Focus Ring Halo</div>
                  <div className="text-[10px] text-stone-400 mt-1">3px keyboard halo</div>
                </div>
              </div>
            </Card>
          </div>
        </main>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: TYPOGRAPHY                                                        */}
      {/* ========================================================================= */}
      {activeTab === 'typography' && (
        <main className="max-w-7xl mx-auto px-6 space-y-12">
          <Card variant="default" padding="lg">
            <div className="pb-4 border-b border-stone-100">
              <span className="font-mono text-[11px] font-bold text-indigo-600 tracking-wider uppercase">Editorial Stack</span>
              <h3 className="font-sans text-[18px] font-bold text-stone-900">The Tri-Typographic Hierarchy</h3>
              <p className="text-[13px] text-stone-500">Instrument Serif (Soul) + Urbanist / PJS (Backbone) + JetBrains Mono (Precision Dial).</p>
            </div>

            <div className="mt-6 space-y-8 divide-y divide-stone-100">
              <div className="pt-4 flex flex-col md:flex-row md:items-baseline justify-between gap-4">
                <div className="w-56 shrink-0">
                  <div className="text-[13px] font-bold font-mono text-stone-800">Hero Display</div>
                  <div className="text-[11px] text-stone-400">Instrument Serif Italic · 56/64</div>
                </div>
                <div className="font-serif italic text-5xl text-stone-900 leading-tight">
                  Where <span className="text-indigo-700">exceptional</span> teams build iconic products.
                </div>
              </div>

              <div className="pt-6 flex flex-col md:flex-row md:items-baseline justify-between gap-4">
                <div className="w-56 shrink-0">
                  <div className="text-[13px] font-bold font-mono text-stone-800">Page Title</div>
                  <div className="text-[11px] text-stone-400">Urbanist Bold · 36/44</div>
                </div>
                <div className="font-sans text-[34px] font-extrabold text-stone-900 tracking-tight">
                  Plan the sprint, ship the work
                </div>
              </div>

              <div className="pt-6 flex flex-col md:flex-row md:items-baseline justify-between gap-4">
                <div className="w-56 shrink-0">
                  <div className="text-[13px] font-bold font-mono text-stone-800">Card Header</div>
                  <div className="text-[11px] text-stone-400">Urbanist SemiBold · 16/24</div>
                </div>
                <div className="font-sans text-[16px] font-bold text-stone-900">
                  Design System 2.0 Tokens & Component Specs
                </div>
              </div>

              <div className="pt-6 flex flex-col md:flex-row md:items-baseline justify-between gap-4">
                <div className="w-56 shrink-0">
                  <div className="text-[13px] font-bold font-mono text-stone-800">Body Primary</div>
                  <div className="text-[11px] text-stone-400">Urbanist Regular · 14/20</div>
                </div>
                <div className="font-sans text-[14px] text-stone-600 leading-relaxed max-w-xl">
                  Meridian Clarity Pro rejects flat digital sterility. An orchestrator for world-class creators
                  should look and feel like a bespoke Swiss chronograph, delivering tactile confidence with every interaction.
                </div>
              </div>

              <div className="pt-6 flex flex-col md:flex-row md:items-baseline justify-between gap-4">
                <div className="w-56 shrink-0">
                  <div className="text-[13px] font-bold font-mono text-stone-800">Micro Telemetry & Mono</div>
                  <div className="text-[11px] text-stone-400">JetBrains Mono · 12/16</div>
                </div>
                <div className="flex items-center gap-4">
                  <code className="font-mono text-[13px] font-bold text-stone-800 bg-stone-100 px-2 py-1 rounded">
                    MRD-041
                  </code>
                  <span className="font-mono text-[12px] text-stone-500">
                    42.5 hrs logged • 1,482 units • +18.4%
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </main>
      )}

      {/* Interactive Modal Demo */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Design System Component"
        description="Configure your reusable component with calibrated tokens."
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setIsModalOpen(false)}>
              Commit to Library
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Component Identifier" defaultValue="TactilePillSwitch" />
          <Select
            label="Domain Category"
            options={['Design', 'Frontend', 'Backend', 'Auth', 'Infra']}
          />
          <Textarea label="Acceptance Criteria" rows={2} placeholder="Specify interaction physics and props..." />
        </div>
      </Modal>

      {/* Interactive Drawer Demo */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Component Specifications"
        description="Detailed telemetry and prop contracts."
        footer={
          <Button variant="primary" fullWidth onClick={() => setIsDrawerOpen(false)}>
            Close Drawer
          </Button>
        }
      >
        <div className="space-y-4 text-stone-600 text-[13.5px]">
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80">
            <span className="font-mono font-bold text-stone-900 block mb-1">import location</span>
            <code className="text-indigo-600 font-mono text-[12px]">
              {"import { Button } from '@/components/ui';"}
            </code>
          </div>
          <p>
            This slide-over drawer utilizes Meridian spring choreography with cubic-bezier(0.16, 1, 0.3, 1) ease.
          </p>
          <ProgressBar value={75} color="green" striped showLabel />
        </div>
      </Drawer>
    </div>
  );
}
