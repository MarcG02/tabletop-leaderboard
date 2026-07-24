"use client"

import { useState, useEffect, useCallback } from "react"
import type { Player } from "@/data/players"
import { getPlayers, getLeaderboard } from "@/lib/api"
import { getStoredToken } from "@/lib/auth-store"

type UsePlayersReturn = {
  players: Player[]
  isLoading: boolean
  error: string | null
  refetch: () => void
}

export function usePlayers(): UsePlayersReturn {
  const [players, setPlayers] = useState<Player[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [fetchKey, setFetchKey] = useState(0)

  useEffect(() => {
    let cancelled = false

    async function load() {
      const token = getStoredToken()
      try {
        const [playerList, leaderboard] = await Promise.all([
          getPlayers(token ?? undefined),
          getLeaderboard(undefined, token ?? undefined),
        ])
        if (cancelled) return

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
        setError(null)
      } catch (err) {
        if (cancelled) return
        const msg =
          err instanceof Error ? err.message : "Failed to fetch player data"
        setError(msg)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [fetchKey])

  const refetch = useCallback(() => {
    setIsLoading(true)
    setFetchKey((k) => k + 1)
  }, [])

  return { players, isLoading, error, refetch }
}
