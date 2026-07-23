"use client"

import type { Player } from "@/data/players"
import { Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"
import { PlayerAvatar } from "@/components/players/player-avatar"

interface PlayerCardProps {
  player: Player
  onDelete?: (id: number) => void
}

export function PlayerCard({ player, onDelete }: PlayerCardProps) {
  return (
    <div className="bg-card p-6 rounded-xl shadow-sm border border-border/30 hover-lift group relative">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <PlayerAvatar name={player.name} size={64} className="shrink-0" />
          <div className="min-w-0">
            <h4 className="text-lg font-semibold truncate">{player.name}</h4>
            <span className="inline-block shrink-0 bg-muted px-2 py-0.5 rounded text-[10px] font-bold uppercase text-muted-foreground">
              Rank #{player.rank}
            </span>
          </div>
        </div>

        {/* Actions (hidden by default, show on hover) */}
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 sm:opacity-100 transition-opacity">
        <AlertDialog>
          <AlertDialogTrigger
            className="p-2 hover:bg-red-50 dark:hover:bg-red-950 rounded-full text-red-600 dark:text-red-400 transition-colors cursor-pointer touch-target inline-flex items-center justify-center"
            aria-label="Delete player"
          >
            <Trash2 className="size-4" />
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Player</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete <strong>{player.name}</strong>?
                This will permanently remove them from the leaderboard along
                with all their match history. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => onDelete?.(player.id)}>
                Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      </div>
      </div>

      {/* Stats */}
      <div className="space-y-3">
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground font-medium">Win Rate</span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400">
            {player.winRate}%
          </span>
        </div>
        <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
          <div
            className="bg-emerald-500 dark:bg-emerald-400 h-full rounded-full transition-all"
            style={{ width: `${player.winRate}%` }}
          />
        </div>

        {/* Wins / Matches */}
        <div className="pt-1 text-sm text-muted-foreground">
          {player.wins} win{player.wins !== 1 ? "s" : ""} / {player.matchesPlayed} match
          {player.matchesPlayed !== 1 ? "es" : ""} played
        </div>
      </div>
    </div>
  )
}
