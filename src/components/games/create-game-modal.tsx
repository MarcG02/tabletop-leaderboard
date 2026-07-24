"use client"

import { useEffect, useRef, useState } from "react"
import { X, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { createGame } from "@/lib/api"
import { getErrorMessage } from "@/lib/api-error"
import { getStoredToken } from "@/lib/auth-store"

interface CreateGameModalProps {
  open: boolean
  onClose: () => void
  onGameCreated: () => void
}

export function CreateGameModal({
  open,
  onClose,
  onGameCreated,
}: CreateGameModalProps) {
  if (!open) return null

  return (
    <CreateGameModalInner
      onClose={onClose}
      onGameCreated={onGameCreated}
    />
  )
}

function CreateGameModalInner({
  onClose,
  onGameCreated,
}: {
  onClose: () => void
  onGameCreated: () => void
}) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [name, setName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

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
      toast.error("Game name is required.")
      return
    }

    setIsSubmitting(true)

    try {
      const token = getStoredToken()
      await createGame(trimmed, token ?? undefined)
      onGameCreated()
      onClose()
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to create game."))
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
                New Game
              </h3>
              <p className="text-sm text-muted-foreground">
                Register a board game for match tracking.
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

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Game Name
              </label>
              <input
                ref={inputRef}
                className="w-full bg-background p-3 rounded-lg border border-input focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                placeholder="Enter game name"
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
                  "Save Game"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
