"use client"

import type { Game } from "@/data/games"
import { Gamepad2, CalendarDays, Trash2 } from "lucide-react"
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

interface GameCardProps {
  game: Game
  onDelete?: (id: number) => void
}

export function GameCard({ game, onDelete }: GameCardProps) {
  const formattedDate = new Date(game.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })

  return (
    <div className="bg-card p-6 rounded-xl shadow-sm border border-border/30 hover-lift group relative">
      {/* Icon */}
      <div className="mb-5">
        <div className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 p-3 rounded-lg inline-flex">
          <Gamepad2 className="size-7" />
        </div>
      </div>

      {/* Game info */}
      <div className="mb-4">
        <h4 className="text-lg font-semibold truncate">{game.name}</h4>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1.5">
          <CalendarDays className="size-3.5" />
          <span>Added {formattedDate}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between pt-4 border-t border-border/30">
        <span className="text-sm text-muted-foreground">
          <strong className="text-foreground font-semibold">{game.matchesCount}</strong>{" "}
          match{game.matchesCount !== 1 ? "es" : ""} played
        </span>

        {/* Delete (shown on hover) */}
        <div className="opacity-0 group-hover:opacity-100 sm:opacity-100 transition-opacity">
          <AlertDialog>
            <AlertDialogTrigger
              className="p-2 hover:bg-red-50 dark:hover:bg-red-950 rounded-full text-red-600 dark:text-red-400 transition-colors cursor-pointer touch-target inline-flex items-center justify-center"
              aria-label="Delete game"
            >
              <Trash2 className="size-4" />
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Game</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete <strong>{game.name}</strong>?
                  This will permanently remove it and all its match history.
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDelete?.(game.id)}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  )
}
