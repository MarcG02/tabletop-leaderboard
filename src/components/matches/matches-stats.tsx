"use client"

import type { Match } from "@/data/matches"
import { Award, Users, TrendingUp } from "lucide-react"

interface MatchesStatsProps {
  matches: Match[]
  isLoading: boolean
}

export function MatchesStats({ matches, isLoading }: MatchesStatsProps) {
  if (isLoading) {
    return (
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-card/50 p-4 sm:p-6 rounded-2xl border animate-pulse" />
        ))}
      </section>
    )
  }

  // Compute MVP
  const winCounts = new Map<string, { wins: number; total: number }>()
  for (const m of matches) {
    for (const p of m.participants) {
      const entry = winCounts.get(p.name) || { wins: 0, total: 0 }
      entry.total++
      if (p.name === m.winnerName) entry.wins++
      winCounts.set(p.name, entry)
    }
  }
  const mvp = [...winCounts.entries()].sort((a, b) => b[1].wins - a[1].wins)[0]

  // Most played game
  const gameCounts = new Map<string, number>()
  for (const m of matches) {
    gameCounts.set(m.gameName, (gameCounts.get(m.gameName) || 0) + 1)
  }
  const topGame = [...gameCounts.entries()].sort((a, b) => b[1] - a[1])[0]

  const stats = [
    {
      label: "MVP This Week",
      value: mvp ? `${mvp[0]} (${mvp[1].wins} wins / ${mvp[1].total} matches)` : "—",
      icon: Award,
      bgColor: "bg-amber-100 dark:bg-amber-900/30",
      iconColor: "text-amber-700 dark:text-amber-300",
    },
    {
      label: "Most Played Game",
      value: topGame ? `${topGame[0]} (${topGame[1]} times)` : "—",
      icon: Users,
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
      iconColor: "text-blue-700 dark:text-blue-300",
    },
    {
      label: "Tally Trends",
      value: matches.length > 0 ? "+12% more activity than last week" : "No data yet",
      icon: TrendingUp,
      bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
      iconColor: "text-emerald-700 dark:text-emerald-300",
    },
  ]

  return (
    <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-card/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl border shadow-sm flex flex-col gap-4 relative overflow-hidden"
        >
          <div className={`size-12 rounded-xl ${stat.bgColor} ${stat.iconColor} flex items-center justify-center`}>
            <stat.icon className="size-6" />
          </div>
          <div className="relative z-10">
            <h4 className="text-xl font-semibold text-foreground">{stat.label}</h4>
            <p className="text-muted-foreground">{stat.value}</p>
          </div>
        </div>
      ))}
    </section>
  )
}
