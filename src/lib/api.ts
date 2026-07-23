export type PlayerOut = {
  id: number
  name: string
  created_at: string
}

export type LeaderboardEntry = {
  player_id: number
  player_name: string
  wins: number
  matches_played: number
  win_rate: number
}

export type GameOut = {
  id: number
  name: string
  created_at: string
}

export type GameCreate = {
  name: string
}

const API_BASE = process.env.API_BASE || ""

class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.name = "ApiError"
    this.status = status
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  })
  if (!res.ok) {
    const body = await res.text().catch(() => "")
    throw new ApiError(
      `API ${res.status} on ${path}: ${body}`,
      res.status,
    )
  }
  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

export function getPlayers(): Promise<PlayerOut[]> {
  return request<PlayerOut[]>("/players")
}

export function createPlayer(name: string): Promise<PlayerOut> {
  return request<PlayerOut>("/players", {
    method: "POST",
    body: JSON.stringify({ name }),
  })
}

export function deletePlayer(id: number): Promise<void> {
  return request<void>(`/players/${id}`, { method: "DELETE" })
}

export function getGames(): Promise<GameOut[]> {
  return request<GameOut[]>("/games")
}

export function createGame(name: string): Promise<GameOut> {
  return request<GameOut>("/games", {
    method: "POST",
    body: JSON.stringify({ name }),
  })
}

export function deleteGame(id: number): Promise<void> {
  return request<void>(`/games/${id}`, { method: "DELETE" })
}

export function getLeaderboard(gameId?: number): Promise<LeaderboardEntry[]> {
  const params = gameId !== undefined ? `?game_id=${gameId}` : ""
  return request<LeaderboardEntry[]>(`/leaderboard${params}`)
}

// Match API types
export type MatchResponse = {
  id: number
  game: GameOut
  winner: PlayerOut | null
  players: PlayerOut[]
  played_at: string
  notes: string | null
}

export function getMatches(): Promise<MatchResponse[]> {
  return request<MatchResponse[]>("/matches")
}

export type CreateMatchRequest = {
  game_id: number
  player_ids: number[]
  winner_id?: number | null
  played_at?: string | null
  notes?: string | null
}

export function createMatch(data: CreateMatchRequest): Promise<MatchResponse> {
  return request<MatchResponse>("/matches", {
    method: "POST",
    body: JSON.stringify(data),
  })
}
