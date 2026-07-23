"use client";

import { useState } from "react";
import { Filter, Plus } from "lucide-react";

interface MatchesFiltersProps {
  games: string[];
  onFiltersChange: (filters: {
    game: string;
    dateFrom: string;
    dateTo: string;
  }) => void;
  onLogMatch: () => void;
}

export function MatchesFilters({
  games,
  onFiltersChange,
  onLogMatch,
}: MatchesFiltersProps) {
  const [game, setGame] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const applyFilters = () => onFiltersChange({ game, dateFrom, dateTo });

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      <div className="sm:col-span-2 md:col-span-3 bg-card p-4 sm:p-6 rounded-xl flex flex-wrap items-start sm:items-center gap-4 border">
        <div className="flex flex-col gap-1 min-w-0">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Filter by Game
          </span>
          <select
            value={game}
            onChange={(e) => setGame(e.target.value)}
            className="bg-background rounded-lg border px-4 py-2 text-sm font-medium w-full sm:w-auto sm:min-w-[180px]"
          >
            <option value="">All Games</option>
            {games.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Date Range
          </span>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 min-w-0">
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="bg-background rounded-lg border px-3 py-2 text-sm w-full sm:w-auto"
            />
            <span className="text-muted-foreground text-xs text-center">to</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="bg-background rounded-lg border px-3 py-2 text-sm w-full sm:w-auto"
            />
          </div>
        </div>
        <button
          onClick={applyFilters}
          className="flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-lg font-medium hover:bg-secondary/20 transition-all h-[42px] self-start sm:self-end cursor-pointer"
        >
          <Filter className="size-4" />
          Apply Filters
        </button>
      </div>

      <div
        onClick={onLogMatch}
        className="md:col-span-1 bg-primary p-4 sm:p-6 rounded-xl text-primary-foreground flex flex-col justify-center items-center gap-2 sm:gap-3 hover-lift transition-all cursor-pointer"
      >
        <Plus className="size-8 sm:size-10" />
        <span className="font-semibold text-sm sm:text-base">
          Log New Match
        </span>
      </div>
    </section>
  );
}
