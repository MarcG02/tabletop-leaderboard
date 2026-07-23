import { Users, TrendingUp, Award, CalendarCheck } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import type { Player } from "@/data/players"

interface StatsSummaryProps {
  players: Player[]
  isLoading: boolean
}

export function StatsSummary({ players, isLoading }: StatsSummaryProps) {
  const totalPlayers = players.length
  const avgWinRate =
    totalPlayers > 0
      ? Math.round(
          players.reduce((sum, p) => sum + p.winRate, 0) / totalPlayers,
        )
      : 0
  const mvp = players.find((p) => p.rank === 1)
  const activeMatches = players.reduce((sum, p) => sum + p.matchesPlayed, 0)

  const stats = [
    {
      label: "Total Players",
      value: isLoading ? null : String(totalPlayers),
      icon: <Users className="size-6" />,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      label: "Avg Win Rate",
      value: isLoading ? null : `${avgWinRate}%`,
      icon: <TrendingUp className="size-6" />,
      iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
      iconColor: "text-emerald-700 dark:text-emerald-300",
    },
    {
      label: "MVP Rank",
      value: isLoading ? null : mvp?.name ?? "—",
      icon: <Award className="size-6" />,
      iconBg: "bg-amber-100 dark:bg-amber-900/30",
      iconColor: "text-amber-800 dark:text-amber-200",
    },
    {
      label: "Active Matches",
      value: isLoading ? null : String(activeMatches),
      icon: <CalendarCheck className="size-6" />,
      iconBg: "bg-red-100 dark:bg-red-900/30",
      iconColor: "text-red-700 dark:text-red-300",
    },
  ]

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-12">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-card p-4 sm:p-6 rounded-xl shadow-sm border flex items-center gap-4"
        >
          <div className={`${stat.iconBg} ${stat.iconColor} p-3 rounded-lg`}>
            {stat.icon}
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">
              {stat.label}
            </p>
            {isLoading ? (
              <Skeleton className="h-7 w-16 mt-0.5" />
            ) : (
              <p className="text-2xl font-semibold tracking-tight">
                {stat.value}
              </p>
            )}
          </div>
        </div>
      ))}
    </section>
  )
}
