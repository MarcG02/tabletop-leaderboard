"use client"

import { useState, useCallback, useEffect, startTransition } from "react"
import { toast } from "sonner"
import { GameGrid } from "@/components/games/game-grid"
import { CreateGameModal } from "@/components/games/create-game-modal"
import { BottomNav } from "@/components/layout/bottom-nav"
import { useGames } from "@/hooks/use-games"
import { getErrorMessage } from "@/lib/api-error"

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
        toast.error(getErrorMessage(err, "Failed to delete game"))
      }
    },
    [deleteGameById],
  )

  useEffect(() => {
    if (error) startTransition(() => { toast.error(error); });
  }, [error]);

  return (
    <>
      <div className="flex-1 bg-dot-pattern px-4 sm:px-6 py-6 md:py-8 pb-28 md:pb-8 max-w-7xl mx-auto w-full">
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
