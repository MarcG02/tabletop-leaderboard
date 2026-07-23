"use client"

import { useState, useEffect, useCallback } from "react"
import type { Game } from "@/data/games"
import { getGames, getMatches, deleteGame } from "@/lib/api"
import type { GameOut } from "@/lib/api"

interface UseGamesReturn {
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

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const [gameList, matches] = await Promise.all([
        getGames(),
        getMatches(),
      ])

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
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to fetch game data"
      setError(msg)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const deleteGameById = useCallback(
    async (id: number) => {
      await deleteGame(id)
      setGames((prev) => prev.filter((g) => g.id !== id))
    },
    [],
  )

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { games, isLoading, error, refetch: fetchData, deleteGameById }
}
