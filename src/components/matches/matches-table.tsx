"use client"

import type { Match } from "@/data/matches"
import { ChevronRight, Rocket, Bird, Puzzle, Award, Loader2 } from "lucide-react"
import { PlayerAvatar } from "@/components/players/player-avatar"

interface MatchesTableProps {
  matches: Match[]
  isLoading: boolean
}

const GAME_ICONS: Record<string, typeof Rocket> = {
  "Terraforming Mars": Rocket,
  Wingspan: Bird,
  Catan: Puzzle,
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

export function MatchesTable({ matches, isLoading }: MatchesTableProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        <Loader2 className="size-6 animate-spin mr-2" />
        Loading matches...
      </div>
    )
  }

  if (matches.length === 0) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        <p className="text-lg font-medium">No matches found</p>
        <p className="text-sm mt-1">Log a match to get started.</p>
      </div>
    )
  }

  return (
    <div className="bg-card rounded-xl shadow-sm border overflow-hidden">
      <div className="hidden sm:block">
        <div className="overflow-x-auto -mx-4 sm:-mx-6">
        <div className="inline-block min-w-full align-middle px-4 sm:px-6">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-muted/50 border-b">
            <th className="px-4 sm:px-6 py-4 sm:py-5 font-medium text-muted-foreground uppercase text-xs tracking-widest">Game</th>
            <th className="px-4 sm:px-6 py-4 sm:py-5 font-medium text-muted-foreground uppercase text-xs tracking-widest">Date</th>
            <th className="px-4 sm:px-6 py-4 sm:py-5 font-medium text-muted-foreground uppercase text-xs tracking-widest">Participants</th>
            <th className="px-4 sm:px-6 py-4 sm:py-5 font-medium text-muted-foreground uppercase text-xs tracking-widest text-center">Winner</th>
            <th className="px-4 sm:px-6 py-4 sm:py-5 font-medium text-muted-foreground uppercase text-xs tracking-widest text-right">Details</th>
          </tr>
        </thead>
        <tbody>
          {matches.map((match, idx) => {
            const GameIcon = GAME_ICONS[match.gameName] || Puzzle
            const MAX_VISIBLE = 3
            const extra = match.participants.length - MAX_VISIBLE

            return (
              <tr
                key={match.id}
                className={`hover:bg-primary/5 transition-colors group ${idx % 2 === 1 ? "bg-muted/30" : ""}`}
              >
                <td className="px-4 sm:px-6 py-4 sm:py-5">
                  <div className="flex items-center gap-4">
                    <div className="size-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-700 dark:text-amber-300">
                      <GameIcon className="size-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{match.gameName}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 sm:px-6 py-4 sm:py-5 text-muted-foreground">{formatDate(match.date)}</td>
                <td className="px-4 sm:px-6 py-4 sm:py-5">
                  <div className="flex -space-x-2">
                    {match.participants.slice(0, MAX_VISIBLE).map((p) => (
                      <div
                        key={p.id}
                        title={p.name}
                        className="size-8 rounded-full border-2 border-background overflow-hidden shrink-0"
                      >
                        <PlayerAvatar name={p.name} size={32} />
                      </div>
                    ))}
                    {extra > 0 && (
                      <div className="size-8 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground">
                        +{extra}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-4 sm:px-6 py-4 sm:py-5">
                  <div className="flex justify-center">
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${match.winnerName ? "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800" : "bg-muted border-border/30"}`}>
                      {match.winnerName && <Award className="size-3.5 text-amber-600 dark:text-amber-400" />}
                      <span className="font-bold text-xs text-foreground">{match.winnerName}</span>
                    </div>
                  </div>
                </td>
                <td className="px-4 sm:px-6 py-4 sm:py-5 text-right">
                  <button className="p-2 text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                    <ChevronRight className="size-5" />
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
        </div>
      </div>
      </div>
      {/* ── Mobile Card List ─────────────────────────── */}
      <div className="block sm:hidden divide-y divide-border">
        {matches.map((match) => {
          const GameIcon = GAME_ICONS[match.gameName] || Puzzle
          const MAX_VISIBLE = 3
          const extra = match.participants.length - MAX_VISIBLE
          return (
            <div key={match.id} className="p-4 space-y-3">
              {/* Top row: Game icon + name + chevron */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="size-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-700 dark:text-amber-300 shrink-0">
                    <GameIcon className="size-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground text-sm truncate">{match.gameName}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(match.date)}</p>
                  </div>
                </div>
                <button className="p-2 text-muted-foreground hover:text-primary transition-colors cursor-pointer shrink-0" aria-label="Details">
                  <ChevronRight className="size-5" />
                </button>
              </div>

              {/* Participants row */}
              <div className="flex items-center justify-between">
                <div className="flex -space-x-2">
                  {match.participants.slice(0, MAX_VISIBLE).map((p) => (
                    <div
                      key={p.id}
                      title={p.name}
                      className="size-7 rounded-full border-2 border-background overflow-hidden shrink-0"
                    >
                      <PlayerAvatar name={p.name} size={28} />
                    </div>
                  ))}
                  {extra > 0 && (
                    <div className="size-7 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[9px] font-bold text-muted-foreground">
                      +{extra}
                    </div>
                  )}
                </div>

                {/* Winner badge */}
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border shrink-0 ${match.winnerName ? "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800" : "bg-muted border-border/30"}`}>
                  {match.winnerName && <Award className="size-3 text-amber-600 dark:text-amber-400" />}
                  <span className="font-bold text-[11px] text-foreground truncate max-w-[120px]">{match.winnerName || "TBD"}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
