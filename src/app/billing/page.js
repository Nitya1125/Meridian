"use client"

import React, { useState } from 'react'
import Sidebar from '@/components/sidebar'
import ProtectedRoute from '@/components/ProtectedRoute'
import DynamicHeader from '@/components/DynamicHeader'
import {
  CheckIcon, DownloadIcon, ZapIcon, ShieldIcon, PlusIcon,
  CreditCardIcon, ArrowUpRightIcon
} from '@/components/Icons'
import { toast } from 'react-hot-toast'

const initialInvoices = [
  { id: 'INV-2026-008', date: 'Aug 1, 2026', amount: '$79.00', status: 'Paid', period: 'Aug 2026' },
  { id: 'INV-2026-007', date: 'Jul 1, 2026', amount: '$79.00', status: 'Paid', period: 'Jul 2026' },
  { id: 'INV-2026-006', date: 'Jun 1, 2026', amount: '$79.00', status: 'Paid', period: 'Jun 2026' },
  { id: 'INV-2026-005', date: 'May 1, 2026', amount: '$79.00', status: 'Paid', period: 'May 2026' },
  { id: 'INV-2026-004', date: 'Apr 1, 2026', amount: '$79.00', status: 'Paid', period: 'Apr 2026' },
]

const usageData = [
  { label: 'Team Members', used: 12, limit: 20, unit: 'seats', color: '#6366f1' },
  { label: 'Project Spaces', used: 8, limit: 25, unit: 'spaces', color: '#10b981' },
  { label: 'Storage', used: 4.2, limit: 10, unit: 'GB', color: '#f59e0b' },
  { label: 'API Queries', used: 18400, limit: 50000, unit: '/mo', color: '#8b5cf6' },
]

const plansList = [
  {
    id: 'starter',
    name: 'Starter',
    price: '$29',
    period: '/month',
    features: ['Up to 5 members', '10 projects', '5 GB storage', 'Basic analytics', 'Community support'],
  },
  {
    id: 'pro',
    name: 'Pro Workspace',
    price: '$79',
    period: '/month',
    popular: true,
    features: ['Up to 20 members', 'Unlimited projects', '10 GB storage', 'Advanced analytics & speedometer', 'Priority 24/7 support', 'Custom integrations', 'Full audit trail'],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '$199',
    period: '/month',
    features: ['Unlimited members', 'Unlimited projects', '100 GB storage', 'Custom analytics pipeline', 'Dedicated support engineer', 'SSO & SAML Auth', '99.99% SLA guarantee'],
  },
]

export default function BillingPage() {
  const [selectedPlan, setSelectedPlan] = useState('pro')

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen w-full bg-[#FAF8F5]">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Canvas */}
        <main className="flex-1 min-w-0 px-4 py-6 sm:px-6 lg:px-8 overflow-y-auto pt-16 lg:pt-6">

          <DynamicHeader
            onOpenNewTask={() => toast.success('Add card modal')}
            onOpenSearch={() => {
              const evt = new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true })
              window.dispatchEvent(evt)
            }}
          />

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7">
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-normal text-stone-950 tracking-tight font-serif">
                Workspace <em className="italic font-serif font-normal text-stone-900">Billing & Subscriptions</em>
              </h1>
              <p className="text-xs sm:text-sm text-stone-500 font-medium mt-1.5">
                Manage your workspace subscription plan, resource utilization, and invoices
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-full border border-emerald-200">
                ● Pro Plan Active
              </span>
            </div>
          </div>

          {/* Usage Meters Bento Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {usageData.map(item => {
              const pct = Math.round((item.used / item.limit) * 100)
              return (
                <div key={item.label} className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-2xs">
                  <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
                    <span className="font-bold">{item.label}</span>
                    <span className="font-mono text-stone-800 font-bold">{item.used}/{item.limit} {item.unit}</span>
                  </div>

                  <div className="text-2xl font-extrabold text-stone-900 font-mono mb-3">
                    {pct}%
                  </div>

                  <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-lime-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Pricing Tier Matrix */}
          <div className="mb-10">
            <h2 className="text-2xl sm:text-3xl font-normal text-stone-950 mb-5 font-serif">
              Subscription <em className="italic font-serif font-normal text-stone-800">Tiers & Workspace Capacity</em>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plansList.map(plan => {
                const isSelected = selectedPlan === plan.id
                return (
                  <div
                    key={plan.id}
                    onClick={() => {
                      setSelectedPlan(plan.id)
                      toast.success(`Switched to ${plan.name}`)
                    }}
                    className={`rounded-3xl p-6 flex flex-col justify-between transition-all cursor-pointer relative ${isSelected
                      ? 'bg-[#111318] text-white shadow-xl scale-102 border border-white/20'
                      : 'bg-white text-stone-900 border border-stone-200/80 shadow-2xs hover:shadow-md'
                      }`}
                  >
                    {plan.popular && (
                      <span className="absolute -top-3 right-6 text-[10px] font-bold px-3 py-0.5 rounded-full bg-lime-400 text-stone-950 font-mono shadow-xs">
                        CURRENT PLAN
                      </span>
                    )}

                    <div>
                      <div className="text-sm font-bold tracking-tight mb-1">
                        {plan.name}
                      </div>

                      <div className="flex items-baseline gap-1 my-4">
                        <span className="text-3xl font-extrabold font-mono">{plan.price}</span>
                        <span className={`text-xs ${isSelected ? 'text-stone-400' : 'text-stone-500'}`}>{plan.period}</span>
                      </div>

                      <div className="space-y-2.5 my-6 text-xs">
                        {plan.features.map(f => (
                          <div key={f} className="flex items-center gap-2">
                            <span className={isSelected ? 'text-lime-400 font-bold' : 'text-emerald-600 font-bold'}>✓</span>
                            <span className={isSelected ? 'text-stone-300' : 'text-stone-700'}>{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      type="button"
                      className={`w-full py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${isSelected
                        ? 'bg-lime-400 text-stone-950 hover:bg-lime-300'
                        : 'bg-[#111318] text-white hover:bg-black'
                        }`}
                    >
                      {isSelected ? 'Active Plan' : 'Upgrade'}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Invoices Table */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-2xs mb-10">
            <h2 className="text-2xl sm:text-3xl font-normal text-stone-950 mb-5 font-serif">
              Billing History & <em className="italic font-serif font-normal text-stone-800">Invoices</em>
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-stone-200 text-stone-400 font-bold uppercase text-[10px] tracking-wider">
                    <th className="pb-3 pl-2">Invoice ID</th>
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Amount</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 pr-2 text-right">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {initialInvoices.map(inv => (
                    <tr key={inv.id} className="hover:bg-stone-50/80 transition-colors">
                      <td className="py-3.5 pl-2 font-mono font-bold text-stone-800">{inv.id}</td>
                      <td className="py-3.5 text-stone-600">{inv.date}</td>
                      <td className="py-3.5 font-mono font-bold text-stone-900">{inv.amount}</td>
                      <td className="py-3.5">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono">
                          {inv.status}
                        </span>
                      </td>
                      <td className="py-3.5 pr-2 text-right">
                        <button
                          onClick={() => toast.success(`Downloading PDF for ${inv.id}`)}
                          className="p-1 rounded-lg text-stone-400 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
                        >
                          <DownloadIcon size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>
    </ProtectedRoute>
  )
}