"use client"

import { useState, useCallback } from "react"
import { GameGrid } from "@/components/games/game-grid"
import { CreateGameModal } from "@/components/games/create-game-modal"
import { BottomNav } from "@/components/layout/bottom-nav"
import { useGames } from "@/hooks/use-games"

export default function GamesPage() {
  const { games, isLoading, error, refetch, deleteGameById } = useGames()
  const [modalOpen, setModalOpen] = useState(false)
  const openModal = useCallback(() => setModalOpen(true), [])
  const closeModal = useCallback(() => setModalOpen(false), [])

  const handleDeleteGame = useCallback(
    async (id: number) => {
      try {
        await deleteGameById(id)
      } catch (err) {
        console.error("Failed to delete game:", err)
      }
    },
    [deleteGameById],
  )

  return (
    <>
      <div className="flex-1 bg-dot-pattern px-4 sm:px-6 py-6 md:py-8 pb-28 md:pb-8 max-w-7xl mx-auto w-full">
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/30 rounded-xl text-destructive text-sm">
            {error}
          </div>
        )}

        <GameGrid
          games={games}
          isLoading={isLoading}
          onAddGame={openModal}
          onDeleteGame={handleDeleteGame}
        />
      </div>

      <BottomNav onAction={openModal} />
      <CreateGameModal
        open={modalOpen}
        onClose={closeModal}
        onGameCreated={refetch}
      />
    </>
  )
}
