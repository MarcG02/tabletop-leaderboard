"use server";

import {
  CreateMatchRequest,
  GameOut,
  LeaderboardEntry,
  MatchResponse,
  PlayerLogin,
  PlayerOut,
  PlayerRegister,
  TokenOut,
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

type RequestOptions = RequestInit & { token?: string };

async function request<T>(path: string, options?: RequestOptions): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (options?.token) {
    headers["Authorization"] = `Bearer ${options.token}`;
  }

  const { token, ...fetchOptions } = options ?? {};

  const res = await fetch(`${API_BASE}${path}`, {
    headers,
    ...fetchOptions,
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new ApiError(`API ${res.status} on ${path}: ${body}`, res.status);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

// ── Auth ──────────────────────────────────────────────

export async function loginApi(
  data: PlayerLogin,
): Promise<TokenOut> {
  return request<TokenOut>("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function registerApi(
  data: PlayerRegister,
): Promise<TokenOut> {
  return request<TokenOut>("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getMe(token: string): Promise<PlayerOut> {
  return request<PlayerOut>("/auth/me", { token });
}

// ── Players ───────────────────────────────────────────

export async function getPlayers(token?: string): Promise<PlayerOut[]> {
  return request<PlayerOut[]>("/players", { token });
}

export async function createPlayer(name: string, token?: string): Promise<PlayerOut> {
  return request<PlayerOut>("/players", {
    method: "POST",
    body: JSON.stringify({ name }),
    token,
  });
}

export async function deletePlayer(id: number, token?: string): Promise<void> {
  return request<void>(`/players/${id}`, { method: "DELETE", token });
}

// ── Games ─────────────────────────────────────────────

export async function getGames(token?: string): Promise<GameOut[]> {
  return request<GameOut[]>("/games", { token });
}

export async function createGame(name: string, token?: string): Promise<GameOut> {
  return request<GameOut>("/games", {
    method: "POST",
    body: JSON.stringify({ name }),
    token,
  });
}

export async function deleteGame(id: number, token?: string): Promise<void> {
  return request<void>(`/games/${id}`, { method: "DELETE", token });
}

// ── Leaderboard ───────────────────────────────────────

export async function getLeaderboard(gameId?: number, token?: string): Promise<LeaderboardEntry[]> {
  const params = gameId !== undefined ? `?game_id=${gameId}` : "";
  return request<LeaderboardEntry[]>(`/leaderboard${params}`, { token });
}

// ── Matches ───────────────────────────────────────────

export async function getMatches(token?: string): Promise<MatchResponse[]> {
  return request<MatchResponse[]>("/matches", { token });
}

export async function createMatch(data: CreateMatchRequest, token?: string): Promise<MatchResponse> {
  return request<MatchResponse>("/matches", {
    method: "POST",
    body: JSON.stringify(data),
    token,
  });
}
