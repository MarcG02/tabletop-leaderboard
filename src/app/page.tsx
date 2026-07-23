"use client"

import { useState, useMemo } from "react"
import { Trophy, Medal, Award, Users, Gamepad2, TrendingUp, Star, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { BottomNav } from "@/components/layout/bottom-nav"
import { PlayerAvatar } from "@/components/players/player-avatar"
import { usePlayers } from "@/hooks/use-players"
import { useMatches } from "@/hooks/use-matches"

const ITEMS_PER_PAGE = 10

type SortKey = "rank" | "wins" | "winRate" | "points"

const SORT_OPTIONS: { label: string; value: SortKey }[] = [
  { label: "Rank", value: "rank" },
  { label: "Wins", value: "wins" },
  { label: "Win %", value: "winRate" },
  { label: "Points", value: "points" },
]

export default function LeaderboardPage() {
  const { players, isLoading, error, refetch } = usePlayers()
  const { matches } = useMatches()
  const [sortBy, setSortBy] = useState<SortKey>("rank")
  const [page, setPage] = useState(1)
  const [showSortDropdown, setShowSortDropdown] = useState(false)

  // ── Stats ──────────────────────────────────────────
  const totalPlayers = players.length
  const gamesPlayed = matches.length

  const mostPlayedGame = useMemo(() => {
    if (matches.length === 0) return "—"
    const counts = new Map<string, number>()
    for (const m of matches) {
      counts.set(m.gameName, (counts.get(m.gameName) ?? 0) + 1)
    }
    let max = 0
    let top = ""
    for (const [name, count] of counts) {
      if (count > max) {
        max = count
        top = name
      }
    }
    return top
  }, [matches])

  const weeklyGrowth = "+12%"

  // ── Sorting ────────────────────────────────────────
  const sorted = useMemo(() => {
    const copy = [...players]
    switch (sortBy) {
      case "rank":
        return copy.sort((a, b) => a.rank - b.rank)
      case "wins":
        return copy.sort((a, b) => b.wins - a.wins)
      case "winRate":
        return copy.sort((a, b) => b.winRate - a.winRate)
      case "points":
        return copy.sort((a, b) => b.wins * 100 - a.wins * 100)
      default:
        return copy
    }
  }, [players, sortBy])

  // ── Pagination ────────────────────────────────────
  const totalPages = Math.max(1, Math.ceil(sorted.length / ITEMS_PER_PAGE))
  const paginated = sorted.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  // Reset page on sort change
  const handleSortChange = (key: SortKey) => {
    setSortBy(key)
    setPage(1)
    setShowSortDropdown(false)
  }

  // ── Top 3 ──────────────────────────────────────────
  const top3 = sorted.slice(0, 3)

  const pageStart = (page - 1) * ITEMS_PER_PAGE + 1
  const pageEnd = Math.min(page * ITEMS_PER_PAGE, sorted.length)

  return (
    <>
      <div className="flex-1 bg-dot-pattern px-4 sm:px-6 py-6 md:py-8 pb-28 md:pb-8 max-w-7xl mx-auto w-full">
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/30 rounded-xl text-destructive text-sm">
            {error}
          </div>
        )}

        {/* ── Spotlight Top 3 ────────────────────────────── */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 items-end pt-8 mb-12">
          {isLoading ? (
            <>
              <Skeleton className="h-40 rounded-2xl" />
              <Skeleton className="h-56 rounded-2xl" />
              <Skeleton className="h-32 rounded-2xl" />
            </>
          ) : top3.length > 0 ? (
            <>
              {/* Rank 2 — Silver */}
              {top3[1] && (
                <div className="order-2 md:order-2 flex flex-col items-center">
                  <div className="flex flex-col items-center mb-3">
                    <PlayerAvatar
                      name={top3[1].name}
                      size={96}
                      border
                      borderSize={4}
                      borderColor="#C0C0C0"
                      shadow
                    />
                    <p className="font-bold text-lg mt-2">{top3[1].name}</p>
                    <p className="text-sm text-muted-foreground">
                      {top3[1].wins} win{top3[1].wins !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="w-full h-32 bg-gradient-to-t from-silver-accent/20 to-transparent rounded-t-2xl flex items-start justify-center pt-3">
                    <Medal className="size-7 text-silver-accent" />
                  </div>
                </div>
              )}

              {/* Rank 1 — Gold (Champion) */}
              {top3[0] && (
                <div className="order-1 md:order-1 flex flex-col items-center">
                  <div className="flex flex-col items-center mb-3">
                    {/* Champion banner */}
                    <div className="bg-gradient-to-r from-gold-accent via-amber-400 to-gold-accent text-white text-xs font-bold px-4 py-1 rounded-full mb-2 shadow-md flex items-center gap-1">
                      <Trophy className="size-3.5" />
                      Champion
                    </div>
                    <div className="shadow-[0_0_20px_rgba(212,175,55,0.35)] rounded-full">
                      <PlayerAvatar
                        name={top3[0].name}
                        size={128}
                        border
                        borderSize={4}
                        borderColor="#D4AF37"
                      />
                    </div>
                    <p className="font-bold text-xl mt-3">{top3[0].name}</p>
                    <p className="text-sm text-muted-foreground">
                      {top3[0].wins} win{top3[0].wins !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="w-full h-48 bg-gradient-to-t from-gold-accent/20 to-transparent rounded-t-2xl flex items-start justify-center pt-4">
                    <Trophy className="size-8 text-gold-accent" />
                  </div>
                </div>
              )}

              {/* Rank 3 — Bronze */}
              {top3[2] && (
                <div className="order-3 md:order-3 flex flex-col items-center">
                  <div className="flex flex-col items-center mb-3">
                    <PlayerAvatar
                      name={top3[2].name}
                      size={96}
                      border
                      borderSize={4}
                      borderColor="#CD7F32"
                      shadow
                    />
                    <p className="font-bold text-lg mt-2">{top3[2].name}</p>
                    <p className="text-sm text-muted-foreground">
                      {top3[2].wins} win{top3[2].wins !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="w-full h-24 bg-gradient-to-t from-bronze-accent/20 to-transparent rounded-t-2xl flex items-start justify-center pt-3">
                    <Award className="size-7 text-bronze-accent" />
                  </div>
                </div>
              )}
            </>
          ) : null}
        </section>

        {/* ── Stats Summary ──────────────────────────────── */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6 mb-12">
          {/* Total Players */}
          <div className="bg-card p-4 sm:p-6 rounded-xl shadow-sm border flex items-center gap-4">
            <div className="bg-primary/10 text-primary p-3 rounded-lg">
              <Users className="size-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Total Players</p>
              {isLoading ? (
                <Skeleton className="h-7 w-16 mt-0.5" />
              ) : (
                <p className="text-2xl font-semibold tracking-tight">{totalPlayers}</p>
              )}
            </div>
          </div>

          {/* Games Played */}
          <div className="bg-card p-4 sm:p-6 rounded-xl shadow-sm border flex items-center gap-4">
            <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 p-3 rounded-lg">
              <Gamepad2 className="size-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Games Played</p>
              {isLoading ? (
                <Skeleton className="h-7 w-16 mt-0.5" />
              ) : (
                <p className="text-2xl font-semibold tracking-tight">{gamesPlayed}</p>
              )}
            </div>
          </div>

          {/* Weekly Growth */}
          <div className="bg-card p-4 sm:p-6 rounded-xl shadow-sm border flex items-center gap-4">
            <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 p-3 rounded-lg">
              <TrendingUp className="size-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Weekly Growth</p>
              <p className="text-2xl font-semibold tracking-tight text-emerald-600 dark:text-emerald-400">{weeklyGrowth}</p>
            </div>
          </div>

          {/* Most Played */}
          <div className="bg-card p-4 sm:p-6 rounded-xl shadow-sm border flex items-center gap-4">
            <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-3 rounded-lg">
              <Star className="size-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Most Played</p>
              {isLoading ? (
                <Skeleton className="h-7 w-24 mt-0.5" />
              ) : (
                <p className="text-lg font-semibold tracking-tight truncate max-w-[140px] sm:max-w-none">{mostPlayedGame}</p>
              )}
            </div>
          </div>
        </section>

        {/* ── Full Rankings Table ────────────────────────── */}
        <section className="bg-card rounded-2xl shadow-sm border overflow-hidden">
          {/* Header */}
          <div className="px-4 sm:px-6 py-4 sm:py-5 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-foreground">Full Rankings</h3>
              <p className="text-sm text-muted-foreground mt-0.5">
                {sorted.length} player{sorted.length !== 1 ? "s" : ""} competing
              </p>
            </div>

            {/* Sort dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border bg-background text-sm font-medium hover:bg-muted transition-colors cursor-pointer"
              >
                Sort: {SORT_OPTIONS.find((o) => o.value === sortBy)?.label}
                <ChevronDown className="size-4 text-muted-foreground" />
              </button>
              {showSortDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowSortDropdown(false)} />
                  <div className="absolute right-0 top-full mt-1 z-20 bg-card border rounded-xl shadow-xl py-1 min-w-[160px]">
                    {SORT_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => handleSortChange(opt.value)}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors cursor-pointer ${
                          sortBy === opt.value ? "font-semibold text-primary bg-primary/5" : ""
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Table */}
          {isLoading ? (
            <div className="p-6 space-y-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded-lg" />
              ))}
            </div>
          ) : sorted.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <p className="text-lg font-medium">No rankings yet</p>
              <p className="text-sm mt-1">Start logging matches to see the leaderboard.</p>
            </div>
          ) : (
            <>
              <div className="hidden sm:block">
                {/* Table header */}
                <div className="grid grid-cols-[40px_1fr_100px_80px_80px] lg:grid-cols-[60px_1fr_120px_100px_100px] gap-4 px-6 py-3 bg-muted/50 text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                  <span>Rank</span>
                  <span>Player Name</span>
                  <span className="text-right">Games Played</span>
                  <span className="text-right">Win %</span>
                  <span className="text-right">Points</span>
                </div>

                {/* Table rows */}
                <div>
                  {paginated.map((player, idx) => {
                    const points = player.wins * 100
                    return (
                      <div
                        key={player.id}
                        className={`grid grid-cols-[40px_1fr_100px_80px_80px] lg:grid-cols-[60px_1fr_120px_100px_100px] gap-4 px-3 sm:px-4 lg:px-6 py-3 sm:py-4 items-center ${
                          idx % 2 === 1 ? "bg-muted/30" : ""
                        } hover:bg-muted/50 transition-colors`}
                      >
                        {/* Rank */}
                        <span className="text-sm font-bold text-muted-foreground">
                          #{player.rank}
                        </span>

                        {/* Player Name */}
                        <div className="flex items-center gap-3 min-w-0">
                          <PlayerAvatar name={player.name} size={32} className="shrink-0" />
                          <span className="font-medium truncate">{player.name}</span>
                        </div>

                        {/* Games Played */}
                        <span className="text-sm text-right text-muted-foreground">
                          {player.matchesPlayed}
                        </span>

                        {/* Win % */}
                        <span
                          className={`text-sm text-right font-semibold ${
                            player.winRate >= 50
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-muted-foreground"
                          }`}
                        >
                          {player.winRate}%
                        </span>

                        {/* Points */}
                        <span className="text-sm text-right font-bold tabular-nums">
                          {points.toLocaleString()}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* ── Mobile Card List ─────────────────────────── */}
              <div className="block sm:hidden divide-y divide-border">
                {paginated.map((player) => {
                  const points = player.wins * 100
                  const rankColor =
                    player.rank === 1 ? "text-gold-accent" :
                    player.rank === 2 ? "text-silver-accent" :
                    player.rank === 3 ? "text-bronze-accent" :
                    "text-muted-foreground"

                  return (
                    <div key={player.id} className="flex items-center gap-3 px-4 py-3">
                      {/* Rank */}
                      <span className={`text-sm font-bold w-8 shrink-0 ${rankColor}`}>
                        #{player.rank}
                      </span>

                      {/* Avatar + Name */}
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <PlayerAvatar name={player.name} size={36} className="shrink-0" />
                        <span className="font-medium text-sm truncate">{player.name}</span>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-4 shrink-0">
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">W%</p>
                          <p className={`text-sm font-semibold tabular-nums ${
                            player.winRate >= 50 ? "text-emerald-600 dark:text-emerald-400" : ""
                          }`}>{player.winRate}%</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Pts</p>
                          <p className="text-sm font-bold tabular-nums">{points.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Pagination footer */}
              <div className="px-6 py-4 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-muted-foreground">
                  Showing {pageStart} to {pageEnd} of {sorted.length} player{sorted.length !== 1 ? "s" : ""}
                </p>

                {totalPages > 1 && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page <= 1}
                      className="p-2 rounded-lg border hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                      aria-label="Previous page"
                    >
                      <ChevronLeft className="size-4" />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`min-w-[36px] h-9 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                          p === page
                            ? "bg-primary text-primary-foreground"
                            : "border hover:bg-muted"
                        }`}
                      >
                        {p}
                      </button>
                    ))}

                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page >= totalPages}
                      className="p-2 rounded-lg border hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                      aria-label="Next page"
                    >
                      <ChevronRight className="size-4" />
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </section>
      </div>

      <BottomNav onAction={() => {}} />
    </>
  )
}
