"use client"

import { useState, useEffect, useCallback } from "react"
import type { Match } from "@/data/matches"
import { getMatches } from "@/lib/api"

interface UseMatchesReturn {
  matches: Match[]
  isLoading: boolean
  error: string | null
  refetch: () => void
}

export function useMatches(): UseMatchesReturn {
  const [matches, setMatches] = useState<Match[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getMatches()
      const mapped: Match[] = data.map((m) => ({
        id: m.id,
        gameName: m.game.name,
        date: m.played_at,
        participants: m.players.map((p) => ({
          id: p.id,
          name: p.name,
        })),
        winnerId: m.winner?.id ?? null,
        winnerName: m.winner?.name ?? "",
      }))
      setMatches(mapped)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch matches")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  return { matches, isLoading, error, refetch: fetchData }
}
