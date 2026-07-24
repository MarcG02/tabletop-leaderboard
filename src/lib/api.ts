"use server";

import {
  CreateMatchRequest,
  GameOut,
  LeaderboardEntry,
  MatchResponse,
  PlayerOut,
} from "./types";

const API_BASE = process.env.API_BASE || "";

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new ApiError(`API ${res.status} on ${path}: ${body}`, res.status);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export async function getPlayers(): Promise<PlayerOut[]> {
  return request<PlayerOut[]>("/players");
}

export async function createPlayer(name: string): Promise<PlayerOut> {
  return request<PlayerOut>("/players", {
    method: "POST",
    body: JSON.stringify({ name }),
  });
}

export async function deletePlayer(id: number): Promise<void> {
  return request<void>(`/players/${id}`, { method: "DELETE" });
}

export async function getGames(): Promise<GameOut[]> {
  return request<GameOut[]>("/games");
}

export async function createGame(name: string): Promise<GameOut> {
  return request<GameOut>("/games", {
    method: "POST",
    body: JSON.stringify({ name }),
  });
}

export async function deleteGame(id: number): Promise<void> {
  return request<void>(`/games/${id}`, { method: "DELETE" });
}

export async function getLeaderboard(gameId?: number): Promise<LeaderboardEntry[]> {
  const params = gameId !== undefined ? `?game_id=${gameId}` : "";
  return request<LeaderboardEntry[]>(`/leaderboard${params}`);
}

export async function getMatches(): Promise<MatchResponse[]> {
  return request<MatchResponse[]>("/matches");
}

export async function createMatch(data: CreateMatchRequest): Promise<MatchResponse> {
  return request<MatchResponse>("/matches", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
