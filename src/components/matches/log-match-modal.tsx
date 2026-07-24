"use client"

import { useEffect, useRef, useState } from "react"
import { X, Loader2 } from "lucide-react"
import { createMatch, getPlayers, getGames, createGame } from "@/lib/api"
import { PlayerAvatar } from "@/components/players/player-avatar"
import type { PlayerOut, GameOut } from "@/lib/types"

interface LogMatchModalProps {
  open: boolean
  onClose: () => void
  onMatchCreated: () => void
}

function getTodayStr(): string {
  const d = new Date()
  return d.toISOString().slice(0, 10)
}

export function LogMatchModal({
  open,
  onClose,
  onMatchCreated,
}: LogMatchModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const [games, setGames] = useState<GameOut[]>([])
  const [gamesLoading, setGamesLoading] = useState(false)
  const [selectedGameId, setSelectedGameId] = useState<number | "new">("" as any)
  const [newGameName, setNewGameName] = useState("")
  const [playedAt, setPlayedAt] = useState(getTodayStr())
  const [playerIds, setPlayerIds] = useState<number[]>([])
  const [winnerId, setWinnerId] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [players, setPlayers] = useState<PlayerOut[]>([])
  const [playersLoading, setPlayersLoading] = useState(false)

  // Fetch games and players when modal opens
  useEffect(() => {
    if (!open) return

    setGamesLoading(true)
    setPlayersLoading(true)

    Promise.all([
      getGames(),
      getPlayers(),
    ])
      .then(([gamesData, playersData]) => {
        setGames(gamesData)
        setPlayers(playersData)
      })
      .catch(() => setError("Failed to load data"))
      .finally(() => {
        setGamesLoading(false)
        setPlayersLoading(false)
      })
  }, [open])

  // Lock body scroll when modal is open
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  // Handle escape key
  useEffect(() => {
    if (!open) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [open, onClose])

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setSelectedGameId("" as any)
      setNewGameName("")
      setPlayedAt(getTodayStr())
      setPlayerIds([])
      setWinnerId(null)
      setError(null)
    }
  }, [open])

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === dialogRef.current) onClose()
  }

  // Toggle participant selection
  const toggleParticipant = (id: number) => {
    setPlayerIds((prev) => {
      const next = prev.includes(id)
        ? prev.filter((pid) => pid !== id)
        : [...prev, id]
      // Clear winner if they were just deselected
      if (winnerId !== null && !next.includes(winnerId)) {
        setWinnerId(null)
      }
      return next
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Resolve game_id: either selected or create new
    let gameId: number

    if (selectedGameId === "new") {
      if (!newGameName.trim()) {
        setError("Enter a name for the new game.")
        return
      }
    } else if (selectedGameId) {
      gameId = selectedGameId
    } else {
      setError("Select a game or create a new one.")
      return
    }

    if (playerIds.length < 2) {
      setError("Select at least 2 participants.")
      return
    }
    if (winnerId === null) {
      setError("Select a winner.")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      // If creating a new game, do that first
      if (selectedGameId === "new") {
        const created = await createGame(newGameName.trim())
        gameId = created.id
      }

      await createMatch({
        game_id: gameId!,
        player_ids: playerIds,
        winner_id: winnerId,
        played_at: playedAt,
      })

      onMatchCreated()
      onClose()
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to create match."
      setError(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedPlayers = players.filter((p) => playerIds.includes(p.id))

  if (!open) return null

  return (
    <div
      ref={dialogRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-all duration-300"
    >
      <div className="bg-card w-[calc(100%-2rem)] sm:w-full max-w-lg rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto overscroll-contain mx-4 sm:mx-auto">
        <div className="p-4 sm:p-6 md:p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-2xl font-semibold text-foreground">
                Log New Match
              </h3>
              <p className="text-sm text-muted-foreground">
                Record a game session.
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
            {/* Game Selection */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Game
              </label>

              {gamesLoading ? (
                <div className="flex items-center gap-2 p-3 text-muted-foreground text-sm">
                  <Loader2 className="size-4 animate-spin" />
                  Loading games...
                </div>
              ) : (
                <>
                  <select
                    value={selectedGameId as string | number}
                    onChange={(e) =>
                      setSelectedGameId(
                        e.target.value === "new"
                          ? "new"
                          : Number(e.target.value),
                      )
                    }
                    disabled={isSubmitting}
                    className="w-full bg-background p-3 rounded-lg border border-input focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  >
                    <option value="" disabled>
                      Select a game…
                    </option>
                    {games.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.name}
                      </option>
                    ))}
                    <option value="new">+ Create new game</option>
                  </select>

                  {selectedGameId === "new" && (
                    <input
                      className="w-full bg-background p-3 rounded-lg border border-input focus:ring-2 focus:ring-primary focus:border-transparent outline-none mt-2"
                      placeholder="New game name"
                      type="text"
                      value={newGameName}
                      onChange={(e) => setNewGameName(e.target.value)}
                      disabled={isSubmitting}
                      autoFocus
                    />
                  )}
                </>
              )}
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Date
              </label>
              <input
                className="w-full bg-background p-3 rounded-lg border border-input focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                type="date"
                value={playedAt}
                onChange={(e) => setPlayedAt(e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            {/* Participants */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Participants
              </label>
              <div className="max-h-48 sm:max-h-64 overflow-y-auto border border-input rounded-lg divide-y divide-border">
                {playersLoading ? (
                  <div className="p-4 text-center text-muted-foreground text-sm">
                    Loading players...
                  </div>
                ) : players.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground text-sm">
                    No players found. Create a player first.
                  </div>
                ) : (
                  players.map((player) => {
                    const isSelected = playerIds.includes(player.id)
                    return (
                      <label
                        key={player.id}
                        className={`flex items-center gap-3 p-3 cursor-pointer transition-colors ${
                          isSelected ? "bg-primary/5" : "hover:bg-muted/50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleParticipant(player.id)}
                          disabled={isSubmitting}
                          className="size-4 accent-primary"
                        />
                        <PlayerAvatar name={player.name} size={32} />
                        <span className="text-sm font-medium">
                          {player.name}
                        </span>
                      </label>
                    )
                  })
                )}
              </div>
              {playerIds.length > 0 && (
                <p className="text-xs text-muted-foreground mt-1">
                  {playerIds.length} participant
                  {playerIds.length !== 1 ? "s" : ""} selected
                </p>
              )}
            </div>

            {/* Winner */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Winner
              </label>
              <div className="border border-input rounded-lg divide-y divide-border">
                {selectedPlayers.length === 0 ? (
                  <div className="p-3 text-center text-muted-foreground text-sm">
                    Select participants first
                  </div>
                ) : (
                  selectedPlayers.map((player) => (
                    <label
                      key={player.id}
                      className={`flex items-center gap-3 p-3 cursor-pointer transition-colors ${
                        winnerId === player.id
                          ? "bg-primary/5"
                          : "hover:bg-muted/50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="winner"
                        checked={winnerId === player.id}
                        onChange={() => setWinnerId(player.id)}
                        disabled={isSubmitting}
                        className="size-4 accent-primary"
                      />
                      <PlayerAvatar name={player.name} size={32} />
                      <span className="text-sm font-medium">
                        {player.name}
                      </span>
                    </label>
                  ))
                )}
              </div>
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
                  "Save Match"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
