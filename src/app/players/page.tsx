"use client";

import { useState, useCallback, useEffect, startTransition } from "react";
import { toast } from "sonner";
import { StatsSummary } from "@/components/players/stats-summary";
import { PlayerGrid } from "@/components/players/player-grid";
import { CreatePlayerModal } from "@/components/players/create-player-modal";
import { BottomNav } from "@/components/layout/bottom-nav";
import { usePlayers } from "@/hooks/use-players";
import { useAuth } from "@/hooks/use-auth";
import { deletePlayer } from "@/lib/api"
import { getStoredToken } from "@/lib/auth-store";

export default function PlayersPage() {
  const { players, isLoading, error, refetch } = usePlayers();
  const { user, logout } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = useCallback(() => setModalOpen(true), []);
  const closeModal = useCallback(() => setModalOpen(false), []);

  const handleDeletePlayer = useCallback(
    async (id: number) => {
      const token = getStoredToken();
      const result = await deletePlayer(id, token ?? undefined);
      if (result.ok) {
        // If the deleted player is the current user, log out immediately
        if (user?.id === id) {
          logout();
          return;
        }
        refetch();
      } else {
        toast.error(result.error);
      }
    },
    [refetch, user, logout],
  );

  useEffect(() => {
    if (error) startTransition(() => { toast.error(error); });
  }, [error]);

  return (
    <>
      <div className="flex-1 bg-dot-pattern px-4 sm:px-6 py-6 md:py-8 pb-28 md:pb-8 max-w-7xl mx-auto w-full">
        <StatsSummary players={players} isLoading={isLoading} />
        <PlayerGrid
          players={players}
          isLoading={isLoading}
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
  );
}
