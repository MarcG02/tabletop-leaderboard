"use client"

import { useState, useMemo, useEffect, startTransition } from "react"
import { toast } from "sonner"
import { useMatches } from "@/hooks/use-matches"
import { MatchesFilters } from "@/components/matches/matches-filters"
import { MatchesTable } from "@/components/matches/matches-table"
import { MatchesPagination } from "@/components/matches/matches-pagination"
import { MatchesStats } from "@/components/matches/matches-stats"
import { BottomNav } from "@/components/layout/bottom-nav"
import { LogMatchModal } from "@/components/matches/log-match-modal"

const ITEMS_PER_PAGE = 10

export default function MatchesPage() {
  const { matches, isLoading, error, refetch } = useMatches()
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState({ game: "", dateFrom: "", dateTo: "" })
  const [logMatchOpen, setLogMatchOpen] = useState(false)

  // Check URL for ?logMatch=true on mount and auto-open modal
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get("logMatch") === "true") {
      startTransition(() => setLogMatchOpen(true))
      window.history.replaceState({}, "", "/matches")
    }
  }, [])

  // Get unique game names
  const games = useMemo(() => {
    const names = new Set(matches.map((m) => m.gameName))
    return [...names].sort()
  }, [matches])

  // Apply filters
  const filtered = useMemo(() => {
    return matches.filter((m) => {
      if (filters.game && m.gameName !== filters.game) return false
      if (filters.dateFrom && new Date(m.date) < new Date(filters.dateFrom)) return false
      if (filters.dateTo && new Date(m.date) > new Date(filters.dateTo)) return false
      return true
    })
  }, [matches, filters])

  // Paginate
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  // Reset page when filters change
  const handleFiltersChange = (newFilters: typeof filters) => {
    setFilters(newFilters)
    setPage(1)
  }

  useEffect(() => {
    if (error) startTransition(() => { toast.error(error); });
  }, [error]);

  return (
    <>
      <div className="flex-1 bg-dot-pattern px-4 sm:px-6 py-6 md:py-8 pb-28 md:pb-8 max-w-7xl mx-auto w-full space-y-8 md:space-y-12">
        <MatchesFilters
          games={games}
          onFiltersChange={handleFiltersChange}
          onLogMatch={() => setLogMatchOpen(true)}
        />

        <section className="flex flex-col gap-6">
          <div className="flex flex-col xs:flex-row xs:justify-between xs:items-end gap-1">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">Recent Activity</h3>
            <p className="text-muted-foreground text-sm xs:text-base">
              Showing {filtered.length} match{filtered.length !== 1 ? "es" : ""}
            </p>
          </div>

          <MatchesTable matches={paginated} isLoading={isLoading} />
          <MatchesPagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </section>

        <MatchesStats matches={matches} isLoading={isLoading} />
      </div>

      <BottomNav onAction={() => setLogMatchOpen(true)} />

      <LogMatchModal
        open={logMatchOpen}
        onClose={() => setLogMatchOpen(false)}
        onMatchCreated={refetch}
      />
    </>
  )
}
