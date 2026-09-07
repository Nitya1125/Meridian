"use client"

import React, { useState } from "react"
import { TrashIcon } from "./Icons"
import { toast } from "react-hot-toast"
import { deleteOrganization } from "@/Service/organization"
import { useOrg } from "@/context/OrgContext"

export default function DeleteOrgModal({ open, onClose, organization }) {
  const { fetchOrganizations } = useOrg()
  const [typedName, setTypedName] = useState("")
  const [deleting, setDeleting] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  if (!open || !organization) return null

  const targetName = organization.name || ""
  const isMatch = typedName.trim() === targetName.trim()

  const handleClose = () => {
    if (deleting) return
    setTypedName("")
    setErrorMsg("")
    onClose?.()
  }

  const handleDelete = async (e) => {
    e?.preventDefault()
    if (!isMatch || deleting) return

    setDeleting(true)
    setErrorMsg("")

    try {
      const res = await deleteOrganization(organization.id)

      if (res && res.success) {
        toast.success(res.message || "Organization deleted successfully")
        if (fetchOrganizations) {
          await fetchOrganizations()
        }
        handleClose()
      } else {
        const msg = res?.message || "Failed to delete organization"
        setErrorMsg(msg)
        toast.error(msg)
      }
    } catch (err) {
      const msg = err?.message || "An error occurred while deleting organization"
      setErrorMsg(msg)
      toast.error(msg)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[950] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={handleClose}
        className="fixed inset-0 bg-stone-950/50 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-md rounded-3xl bg-white p-6 sm:p-7 shadow-2xl border border-rose-200/80 animate-in zoom-in-95 duration-200 z-10">
        
        {/* Header */}
        <div className="flex items-center gap-3.5 pb-4 border-b border-stone-100">
          <div className="w-11 h-11 rounded-2xl bg-rose-100 text-rose-600 border border-rose-200 flex items-center justify-center shadow-2xs shrink-0">
            <TrashIcon size={20} strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-xl font-normal font-serif text-stone-950 leading-tight">
              Delete <em className="italic font-serif font-normal text-rose-600">Workspace</em>
            </h3>
            <p className="text-xs text-stone-500 font-medium mt-0.5">
              Permanent organization removal
            </p>
          </div>
        </div>

        {/* Warning Banner */}
        <div className="my-4 p-3.5 rounded-2xl bg-rose-50/80 border border-rose-200 text-xs text-rose-800 space-y-1">
          <div className="font-bold flex items-center gap-1.5 text-rose-900">
            <span>⚠</span>
            <span>Irreversible Action</span>
          </div>
          <p className="text-[11px] leading-relaxed text-rose-700 font-medium">
            This will permanently delete <strong className="text-rose-950 font-bold">{targetName}</strong> and remove all associated channels, tasks, and member permissions.
          </p>
        </div>

        {/* Error message card if failed */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 font-medium">
            {errorMsg}
          </div>
        )}

        {/* Confirmation Verification Form */}
        <form onSubmit={handleDelete} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5 leading-normal">
              To verify, please type <span className="font-mono font-bold text-stone-950 bg-stone-100 px-1.5 py-0.5 rounded border border-stone-200 select-all">{targetName}</span> below:
            </label>
            <input
              type="text"
              autoFocus
              disabled={deleting}
              value={typedName}
              onChange={(e) => {
                setTypedName(e.target.value)
                if (errorMsg) setErrorMsg("")
              }}
              placeholder={`Type "${targetName}" to confirm`}
              className={`w-full px-3.5 py-2.5 text-xs font-medium rounded-2xl bg-white border outline-none font-sans transition-all ${
                isMatch
                  ? "border-emerald-500 ring-2 ring-emerald-100 text-emerald-950"
                  : typedName
                    ? "border-stone-400 focus:border-stone-600"
                    : "border-stone-200 focus:border-stone-400"
              } disabled:opacity-60`}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-stone-100">
            <button
              type="button"
              onClick={handleClose}
              disabled={deleting}
              className="px-4 py-2.5 rounded-2xl border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-bold transition-all cursor-pointer disabled:opacity-40"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!isMatch || deleting}
              className="px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed active:scale-98"
            >
              {deleting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <TrashIcon size={14} strokeWidth={2.5} />
                  <span>Delete Organization</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  )
}
