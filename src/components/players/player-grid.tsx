"use client";

import { UserPlus, Loader2 } from "lucide-react";
import type { Player } from "@/data/players";
import { PlayerCard } from "@/components/players/player-card";

interface PlayerGridProps {
  players: Player[];
  isLoading: boolean;
  onAddPlayer: () => void;
  onDeletePlayer: (id: number) => void;
}

export function PlayerGrid({
  players,
  isLoading,
  onAddPlayer,
  onDeletePlayer,
}: PlayerGridProps) {
  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">
            Roster Management
          </h3>
          <p className="text-muted-foreground">
            Edit profiles and monitor individual performance metrics.
          </p>
        </div>
        <button
          onClick={onAddPlayer}
          className="cursor-pointer inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-medium hover:opacity-90 active:scale-95 transition-all shadow-lg"
        >
          <UserPlus className="size-5" />
          Create Player
        </button>
      </div>

      {/* Player Cards Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          <Loader2 className="size-6 animate-spin mr-2" />
          Loading players...
        </div>
      ) : players.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <p className="text-lg font-medium">No players yet</p>
          <p className="text-sm mt-1">
            Click &quot;Create Player&quot; to add the first one.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {players.map((player) => (
            <PlayerCard
              key={player.id}
              player={player}
              onDelete={onDeletePlayer}
            />
          ))}
        </div>
      )}
    </>
  );
}
