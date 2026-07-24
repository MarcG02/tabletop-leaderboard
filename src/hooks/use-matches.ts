"use client"

import { useState, useEffect, useCallback } from "react"
import type { Match } from "@/data/matches"
import { getMatches } from "@/lib/api"
import { getStoredToken } from "@/lib/auth-store"

type UseMatchesReturn = {
  matches: Match[]
  isLoading: boolean
  error: string | null
  refetch: () => void
}

export function useMatches(): UseMatchesReturn {
  const [matches, setMatches] = useState<Match[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [fetchKey, setFetchKey] = useState(0)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const token = getStoredToken()
        const data = await getMatches(token ?? undefined)
        if (cancelled) return
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
        setError(null)
      } catch (err) {
        if (cancelled) return
        setError(err instanceof Error ? err.message : "Failed to fetch matches")
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

  return { matches, isLoading, error, refetch }
}
