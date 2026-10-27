"use client"

import React, { useState } from 'react'
import {
  WorkflowIcon, CheckIcon, CheckDoubleIcon, RocketIcon,
  TargetIcon, ZapIcon, LayersIcon, KanbanBoardIcon
} from '@/components/Icons'
import {
  X, CheckCircle2, ArrowRight, Play, Check,
  Clock, ShieldCheck, Sparkles, ChevronRight, Layers, Split, HelpCircle,
  Eye, GitPullRequest, Laptop, Server, Palette, Bug, Cloud
} from 'lucide-react'
import { PARALLEL_TRACKS } from '@/Lib/parallelTracks'

const STAGES = [
  {
    id: 'TODO',
    title: 'To do',
    subtitle: 'Backlog & Scope Ready',
    badge: 'Ready to Claim',
    bg: 'bg-stone-50',
    border: 'border-stone-200',
    accent: '#78716c',
    icon: TargetIcon,
    description: 'User stories, deliverables, and specs have been defined. Any team member can assign themselves or pick up this task when ready.',
    guidance: [
      'Ensure acceptance criteria and due dates are specified.',
      'Check if the task can run in parallel or depends on other deliverables.',
      'Assign to the relevant discipline track (Frontend, Backend, Design, etc.).'
    ]
  },
  {
    id: 'IN_PROGRESS',
    title: 'In progress',
    subtitle: 'Active Development & Execution',
    badge: 'In Flight',
    bg: 'bg-amber-50/40',
    border: 'border-amber-200/70',
    accent: '#d97706',
    icon: ZapIcon,
    description: 'Work is currently happening. Git feature branches are open, mockups are in Figma, or API endpoints are being written.',
    guidance: [
      'Keep subtasks updated so teammates can follow progress.',
      'If you hit a roadblock, flag it early or switch to another parallel track.',
      'Aim to keep each in-progress task focused and scoped to 1-3 days.'
    ]
  },
  {
    id: 'REVIEW',
    title: 'Under review',
    subtitle: 'Verification, QA & Approvals',
    badge: 'Review Phase',
    bg: 'bg-sky-50/40',
    border: 'border-sky-200/70',
    accent: '#0284c7',
    icon: CheckDoubleIcon,
    description: 'Deliverable is ready for peer evaluation. Includes Pull Request code review, design critique, QA edge cases, or client demo sign-off.',
    guidance: [
      'Provide test credentials, screenshots, or PR links in the description.',
      'Reviewers test on preview deployments before signing off.',
      'Security and QA checks verify regression resistance.'
    ]
  },
  {
    id: 'DONE',
    title: 'Done',
    subtitle: 'Shipped, Deployed & Verified',
    badge: 'Completed',
    bg: 'bg-emerald-50/40',
    border: 'border-emerald-200/70',
    accent: '#059669',
    icon: CheckCircle2,
    description: 'Code is merged and deployed to production or staging. Acceptance criteria verified. Ready for release notes and stakeholder inspection.',
    guidance: [
      'Verify that all subtasks are checked off.',
      'Release notes and changelogs automatically reflect completed tasks.',
      'Can be reopened at any time if regressions are discovered.'
    ]
  }
]

export default function WorkflowGuideModal({ open, onClose }) {
  const [activeTab, setActiveTab] = useState('stages') // 'stages' | 'parallel' | 'shortcuts'

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-3xl border border-stone-200 shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100 bg-stone-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E5F722] border border-stone-300 shadow-xs flex items-center justify-center text-stone-900 font-bold">
              <WorkflowIcon size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-extrabold text-stone-900 font-urbanist tracking-tight">
                  Sprint Workflow & Concurrency Guide
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-violet-100 text-violet-800 border border-violet-200">
                  Team Blueprint
                </span>
              </div>
              <p className="text-xs text-stone-500 font-medium">
                Designed so engineers, designers, and project managers speak the exact same language.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
            title="Close Guide"
          >
            <X size={16} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-4 pb-2 border-b border-stone-100 bg-white">
          <button
            onClick={() => setActiveTab('stages')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'stages'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <TargetIcon size={14} />
            <span>4 Sprint Stages</span>
          </button>

          <button
            onClick={() => setActiveTab('parallel')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'parallel'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <ZapIcon size={14} />
            <span>Parallel Streams</span>
            <span className="px-1.5 py-0.2 rounded-full text-[9px] font-extrabold bg-amber-400 text-stone-900">
              Active
            </span>
          </button>

          <button
            onClick={() => setActiveTab('shortcuts')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'shortcuts'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <LayersIcon size={14} />
            <span>1-Click Moves & Views</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* TAB 1: 4 STAGES */}
          {activeTab === 'stages' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-violet-50 border border-violet-100 text-xs text-violet-900 font-medium flex items-center gap-2.5">
                <Sparkles size={16} className="text-violet-600 shrink-0" />
                <span>
                  Every task on our board progresses through 4 canonical stages. You can drag cards or use the 1-click stage buttons on any card.
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {STAGES.map(stage => {
                  const Icon = stage.icon
                  return (
                    <div
                      key={stage.id}
                      className={`p-4 rounded-3xl border ${stage.bg} ${stage.border} flex flex-col justify-between`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-7 h-7 rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-2xs"
                              style={{ backgroundColor: stage.accent }}
                            >
                              <Icon size={14} />
                            </div>
                            <span className="text-sm font-extrabold text-stone-900">
                              {stage.title}
                            </span>
                          </div>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white text-stone-600 border border-stone-200">
                            {stage.badge}
                          </span>
                        </div>
                        <p className="text-xs text-stone-600 font-medium leading-relaxed mb-3">
                          {stage.description}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-stone-200/60 space-y-1">
                        {stage.guidance.map((tip, i) => (
                          <div key={i} className="flex items-start gap-1.5 text-[11px] text-stone-500">
                            <span className="text-stone-400 mt-0.5">▪</span>
                            <span>{tip}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* TAB 2: PARALLEL STREAMS */}
          {activeTab === 'parallel' && (
            <div className="space-y-5">
              <div className="p-4 rounded-3xl bg-gradient-to-r from-amber-50 via-purple-50 to-sky-50 border border-stone-200">
                <div className="flex items-center gap-2 font-bold text-xs text-stone-900 mb-1">
                  <span className="px-2 py-0.5 rounded-full bg-amber-400 text-stone-900 font-extrabold inline-flex items-center gap-1">
                    <ZapIcon size={11} className="fill-stone-900" />
                    <span>CONCURRENCY</span>
                  </span>
                  <span>Why Parallel Streams?</span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  In traditional task boards, tasks often sit in a single queue waiting for previous blockers. With <strong>Meridian Parallel Streams</strong>, each discipline operates in its own dedicated lane (Frontend, Backend, Design, QA, DevOps) so teams move forward concurrently without waiting for sequential sign-offs.
                </p>
              </div>

              <div>
                <h4 className="text-xs font-extrabold text-stone-800 uppercase tracking-wider mb-3">
                  Canonical Parallel Streams
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {PARALLEL_TRACKS.map(track => (
                    <div
                      key={track.id}
                      className={`p-3.5 rounded-2xl border ${track.bg} ${track.border} flex flex-col justify-between`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-stone-200 text-stone-700">
                          {track.code}
                        </span>
                        <span className={`w-2 h-2 rounded-full ${track.dot}`} />
                      </div>
                      <h5 className="text-xs font-extrabold text-stone-900 mb-1">
                        {track.name}
                      </h5>
                      <p className="text-[11px] text-stone-600 leading-snug">
                        {track.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <h5 className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-emerald-600" />
                  <span>How to mark a task as Parallel:</span>
                </h5>
                <p className="text-xs text-stone-600">
                  When creating or editing any task, ensure the <strong>Run in Parallel</strong> toggle is enabled. Tasks without cross-stream blocking dependencies will display the Parallel badge so teammates know they can pick it up right away.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: SHORTCUTS & 1-CLICK MOVES */}
          {activeTab === 'shortcuts' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-3xl bg-white border border-stone-200 shadow-2xs space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-stone-900 text-white flex items-center justify-center text-xs font-bold">
                      <Play size={12} />
                    </div>
                    <span className="text-xs font-extrabold text-stone-900">
                      1-Click Stage Controls
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    You don&apos;t always have to drag and drop! Every task card now features tactile 1-click stage buttons:
                  </p>
                  <ul className="text-xs text-stone-600 space-y-1.5 pt-1">
                    <li className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-700 font-mono font-bold text-[10px] inline-flex items-center gap-1">
                        <Play size={9} className="fill-stone-700" />
                        <span>Start</span>
                      </span>
                      <span>Instantly moves a To Do task into In Progress.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-700 font-mono font-bold text-[10px] inline-flex items-center gap-1">
                        <Check size={9} />
                        <span>Review</span>
                      </span>
                      <span>Submits in-flight work for peer/QA inspection.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-700 font-mono font-bold text-[10px] inline-flex items-center gap-1">
                        <CheckCircle2 size={9} />
                        <span>Done</span>
                      </span>
                      <span>Marks deliverable verified and shipped.</span>
                    </li>
                  </ul>
                </div>

                <div className="p-4 rounded-3xl bg-white border border-stone-200 shadow-2xs space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-violet-600 text-white flex items-center justify-center text-xs font-bold">
                      <Layers size={14} />
                    </div>
                    <span className="text-xs font-extrabold text-stone-900">
                      Board Views & Swimlanes
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Toggle between views at the top of the board to suit your workflow:
                  </p>
                  <ul className="text-xs text-stone-600 space-y-1.5 pt-1">
                    <li className="flex items-center gap-2">
                      <span className="font-bold text-stone-900">Columns Board:</span>
                      <span>Traditional 4-column kanban board.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="font-bold text-stone-900">Parallel Swimlanes:</span>
                      <span>Horizontal tracks showing each stream&apos;s independent 4 columns.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="font-bold text-stone-900">Filter by Stream:</span>
                      <span>Focus on just Frontend, Backend, or QA tasks.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-stone-100 bg-stone-50/70 flex items-center justify-between">
          <span className="text-[11px] text-stone-500 font-medium">
            Meridian Project Management System • Live Sync
          </span>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-2xl bg-stone-900 hover:bg-black text-white text-xs font-bold shadow-xs transition-all cursor-pointer active:scale-95"
          >
            Got it, back to board →
          </button>
        </div>
      </div>
    </div>
  )
}
