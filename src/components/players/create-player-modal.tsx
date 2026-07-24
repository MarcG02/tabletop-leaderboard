"use client"

import { useEffect, useRef, useState } from "react"
import { X, Loader2 } from "lucide-react"
import { createPlayer } from "@/lib/api"
import { getStoredToken } from "@/lib/auth-store"

interface CreatePlayerModalProps {
  open: boolean
  onClose: () => void
  onPlayerChange: () => void
}

export function CreatePlayerModal({
  open,
  onClose,
  onPlayerChange,
}: CreatePlayerModalProps) {
  if (!open) return null

  return (
    <CreatePlayerModalInner
      onClose={onClose}
      onPlayerChange={onPlayerChange}
    />
  )
}

function CreatePlayerModalInner({
  onClose,
  onPlayerChange,
}: {
  onClose: () => void
  onPlayerChange: () => void
}) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [name, setName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [onClose])

  // Focus input on mount
  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100)
  }, [])

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === dialogRef.current) onClose()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) {
      setError("Player name is required.")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const token = getStoredToken()
      await createPlayer(trimmed, token ?? undefined)
      onPlayerChange()
      onClose()
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to create player."
      setError(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      ref={dialogRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-all duration-300"
    >
      <div className="bg-card w-[calc(100%-2rem)] sm:w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 mx-4 sm:mx-auto">
        <div className="p-4 sm:p-6 md:p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-xl sm:text-2xl font-semibold text-foreground">
                New Player
              </h3>
              <p className="text-sm text-muted-foreground">
                Add a player to the leaderboard.
              </p>
            </div>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50 cursor-pointer"
              aria-label="Close"
            >
              <X className="size-7" />
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Player Name
              </label>
              <input
                ref={inputRef}
                className="w-full bg-background p-3 rounded-lg border border-input focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                placeholder="Enter player name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1 py-3 px-6 rounded-xl font-medium border border-border text-foreground hover:bg-muted transition-colors disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3 px-6 rounded-xl font-medium bg-primary text-primary-foreground hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Player"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
