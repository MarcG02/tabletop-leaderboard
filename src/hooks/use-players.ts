"use client"

import { useState, useEffect, useCallback } from "react"
import type { Player } from "@/data/players"
import { getPlayers, getLeaderboard } from "@/lib/api"

interface UsePlayersReturn {
  players: Player[]
  isLoading: boolean
  error: string | null
  refetch: () => void
}

export function usePlayers(): UsePlayersReturn {
  const [players, setPlayers] = useState<Player[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const [playerList, leaderboard] = await Promise.all([
        getPlayers(),
        getLeaderboard(),
      ])

      const lbMap = new Map(leaderboard.map((e) => [e.player_id, e]))

      const merged: Player[] = playerList.map((p) => {
        const lb = lbMap.get(p.id)
        return {
          id: p.id,
          name: p.name,
          wins: lb?.wins ?? 0,
          matchesPlayed: lb?.matches_played ?? 0,
          winRate: lb ? Math.round(lb.win_rate * 100) : 0,
          rank: 0, // assigned below
        }
      })

      merged.sort((a, b) => {
        if (b.wins !== a.wins) return b.wins - a.wins
        return b.winRate - a.winRate
      })
      merged.forEach((p, i) => {
        p.rank = i + 1
      })

      setPlayers(merged)
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to fetch player data"
      setError(msg)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { players, isLoading, error, refetch: fetchData }
}
