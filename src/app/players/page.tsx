"use client"

import { useState, useCallback } from "react"
import { StatsSummary } from "@/components/players/stats-summary"
import { PlayerGrid } from "@/components/players/player-grid"
import { CreatePlayerModal } from "@/components/players/create-player-modal"
import { BottomNav } from "@/components/layout/bottom-nav"
import { usePlayers } from "@/hooks/use-players"
import { deletePlayer } from "@/lib/api"

export default function PlayersPage() {
  const { players, isLoading, error, refetch } = usePlayers()
  const [modalOpen, setModalOpen] = useState(false)
  const openModal = useCallback(() => setModalOpen(true), [])
  const closeModal = useCallback(() => setModalOpen(false), [])

  const handleDeletePlayer = useCallback(
    async (id: number) => {
      try {
        await deletePlayer(id)
        refetch()
      } catch (err) {
        console.error("Failed to delete player:", err)
      }
    },
    [refetch],
  )

  return (
    <>
      <div className="flex-1 bg-dot-pattern px-4 sm:px-6 py-6 md:py-8 pb-28 md:pb-8 max-w-7xl mx-auto w-full">
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/30 rounded-xl text-destructive text-sm">
            {error}
          </div>
        )}

        <StatsSummary players={players} isLoading={isLoading} />
        <PlayerGrid
          players={players}
          isLoading={isLoading}
          onAddPlayer={openModal}
          onDeletePlayer={handleDeletePlayer}
        />
      </div>

      <BottomNav onAction={openModal} />
      <CreatePlayerModal
        open={modalOpen}
        onClose={closeModal}
        onPlayerChange={refetch}
      />
    </>
  )
}
