"use client"

import { Loader2, Plus } from "lucide-react"
import type { Game } from "@/data/games"
import { GameCard } from "@/components/games/game-card"

interface GameGridProps {
  games: Game[]
  isLoading: boolean
  onAddGame: () => void
  onDeleteGame: (id: number) => void
}

export function GameGrid({
  games,
  isLoading,
  onAddGame,
  onDeleteGame,
}: GameGridProps) {
  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">
            Game Library
          </h3>
          <p className="text-muted-foreground">
            Browse registered games and track their match history.
          </p>
        </div>
        <button
          onClick={onAddGame}
          className="cursor-pointer inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-medium hover:opacity-90 active:scale-95 transition-all shadow-lg"
        >
          <Plus className="size-5" />
          Add Game
        </button>
      </div>

      {/* Game Cards Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          <Loader2 className="size-6 animate-spin mr-2" />
          Loading games...
        </div>
      ) : games.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <p className="text-lg font-medium">No games yet</p>
          <p className="text-sm mt-1">
            Click &quot;Add Game&quot; to register the first one.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {games.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              onDelete={onDeleteGame}
            />
          ))}
        </div>
      )}
    </>
  )
}
