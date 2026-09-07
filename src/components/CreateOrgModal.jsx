"use client"

import React, { useState } from 'react'
import { useOrg } from '@/context/OrgContext'
import { createOrganization } from '@/Service/organization'
import { BuildingIcon, CopyIcon, CheckIcon, PlusIcon } from '@/components/Icons'
import { toast } from 'react-hot-toast'

export default function CreateOrgModal() {
  const { isCreateModalOpen, closeCreateModal, addRealOrg } = useOrg()
  const [name, setName] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [createdOrg, setCreatedOrg] = useState(null)
  const [copied, setCopied] = useState(false)

  if (!isCreateModalOpen) return null

  const handleCreate = async (e) => {
    e.preventDefault()
    if (loading) return
    if (!name.trim()) {
      toast.error('Organization Name is required')
      return
    }
    if (!companyName.trim()) {
      toast.error('Company Name is required')
      return
    }
    if (!description.trim()) {
      toast.error('Description is required')
      return
    }

    try {
      setLoading(true)
      const res = await createOrganization({
        name: name.trim(),
        company_name: companyName.trim(),
        description: description.trim()
      })

      if (res && res.success) {
        const newOrgData = {
          id: res.organization_id,
          name: name.trim(),
          company_name: companyName.trim(),
          companyName: companyName.trim(),
          description: description.trim(),
          invite_code: res.invite_code,
          code: res.invite_code,
          created_by: res.created_by,
          role: 'Owner / Leader'
        }
        addRealOrg(newOrgData)
        setCreatedOrg(newOrgData)
        toast.success(res.message || 'Organization created successfully!')
      } else {
        toast.error(res?.message || 'Failed to create organization')
      }
    } catch (err) {
      toast.error(err.message || 'An error occurred while creating organization')
    } finally {
      setLoading(false)
    }
  }

  const handleCopyCode = () => {
    if (createdOrg?.invite_code) {
      navigator.clipboard?.writeText(String(createdOrg.invite_code))
      setCopied(true)
      toast.success('Invite code copied to clipboard!')
      setTimeout(() => setCopied(false), 2500)
    }
  }

  const handleClose = () => {
    setName('')
    setCompanyName('')
    setDescription('')
    setCreatedOrg(null)
    setCopied(false)
    closeCreateModal()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="fixed inset-0"
        onClick={handleClose}
      />

      <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-200 z-10">
        {!createdOrg ? (
          <>
            {/* Form Header */}
            <div className="flex items-center gap-3.5 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[#111318] text-lime-400 flex items-center justify-center shadow-md">
                <BuildingIcon size={22} strokeWidth={2} />
              </div>
              <div>
                <h2 className="text-2xl font-normal text-stone-950 font-serif tracking-tight">
                  Create <em className="italic font-serif font-normal text-stone-800">Organization</em>
                </h2>
                <p className="text-xs text-stone-500 font-medium">Set up a new workspace for your company or team</p>
              </div>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  Organization Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acme Studio"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs font-medium bg-white rounded-2xl border border-stone-200 outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-200 transition-all font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  Company Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acme Corp"
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs font-medium bg-white rounded-2xl border border-stone-200 outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-200 transition-all font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  Description <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Briefly describe your team's project goals and scope..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs font-medium bg-white rounded-2xl border border-stone-200 outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-200 transition-all font-sans resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-5 py-2.5 rounded-2xl border border-stone-200 text-xs font-bold text-stone-600 hover:bg-stone-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-[#111318] hover:bg-stone-900 text-xs font-bold text-white shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <PlusIcon size={14} strokeWidth={2.5} className="text-lime-400" />
                      <span>Create Organization</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </>
        ) : (
          /* Success State */
          <div className="text-center py-2">
            <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-600 flex items-center justify-center shadow-xs">
              <CheckIcon size={28} strokeWidth={2.5} />
            </div>

            <h2 className="text-2xl font-normal text-stone-950 font-serif tracking-tight mb-1">
              Organization <em className="italic font-serif font-normal text-stone-800">Created Successfully</em>
            </h2>
            <p className="text-xs text-stone-500 font-medium mb-6">
              You are now set up as <span className="font-bold text-stone-900 bg-lime-100 text-lime-900 px-2 py-0.5 rounded-md">Owner / Leader</span> of <strong className="text-stone-900">{createdOrg.name}</strong>
            </p>

            {/* Invite Code Box */}
            <div className="bg-[#FAF8F5] border border-stone-200/80 rounded-2xl p-5 mb-6 text-left">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 font-mono">Organization Invite Code</span>
                <span className="text-[11px] font-bold text-stone-600 bg-stone-200/60 px-2 py-0.5 rounded-md">6-Digit Code</span>
              </div>

              <div className="flex items-center justify-between gap-3 bg-white p-3 rounded-xl border border-stone-200 shadow-2xs">
                <span className="font-mono text-2xl font-black tracking-widest text-stone-900">
                  {createdOrg.invite_code}
                </span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#111318] hover:bg-stone-900 text-white text-xs font-bold transition-all cursor-pointer"
                >
                  {copied ? (
                    <>
                      <CheckIcon size={14} className="text-lime-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <CopyIcon size={14} />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-[11px] text-stone-500 mt-3 leading-normal">
                Share this code with people you want to invite to your organization. They can join instantly using the Join Organization option.
              </p>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="w-full py-3 rounded-2xl bg-[#111318] hover:bg-black text-white text-xs font-bold shadow-md transition-all cursor-pointer"
            >
              Go to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
