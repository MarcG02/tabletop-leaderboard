"use client"

import { useState, useEffect, useCallback } from "react"
import type { Game } from "@/data/games"
import { getGames, getMatches, deleteGame } from "@/lib/api"

type UseGamesReturn = {
  games: Game[]
  isLoading: boolean
  error: string | null
  refetch: () => void
  deleteGameById: (id: number) => Promise<void>
}

export function useGames(): UseGamesReturn {
  const [games, setGames] = useState<Game[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [fetchKey, setFetchKey] = useState(0)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const [gameList, matches] = await Promise.all([
          getGames(),
          getMatches(),
        ])
        if (cancelled) return

        // Count matches per game
        const matchCounts = new Map<number, number>()
        for (const m of matches) {
          matchCounts.set(m.game.id, (matchCounts.get(m.game.id) ?? 0) + 1)
        }

        const mapped: Game[] = gameList.map((g) => ({
          id: g.id,
          name: g.name,
          createdAt: g.created_at,
          matchesCount: matchCounts.get(g.id) ?? 0,
        }))

        setGames(mapped)
        setError(null)
      } catch (err) {
        if (cancelled) return
        const msg =
          err instanceof Error ? err.message : "Failed to fetch game data"
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

  const deleteGameById = useCallback(
    async (id: number) => {
      await deleteGame(id)
      setGames((prev) => prev.filter((g) => g.id !== id))
    },
    [],
  )

  return { games, isLoading, error, refetch, deleteGameById }
}
