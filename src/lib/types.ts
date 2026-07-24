export type PlayerOut = {
  id: number;
  name: string;
  created_at: string;
};

export type LeaderboardEntry = {
  player_id: number;
  player_name: string;
  wins: number;
  matches_played: number;
  win_rate: number;
};

export type GameOut = {
  id: number;
  name: string;
  created_at: string;
};

export type GameCreate = {
  name: string;
};

export type CreateMatchRequest = {
  game_id: number;
  player_ids: number[];
  winner_id?: number | null;
  played_at?: string | null;
  notes?: string | null;
};

// Match API types
export type MatchResponse = {
  id: number;
  game: GameOut;
  winner: PlayerOut | null;
  players: PlayerOut[];
  played_at: string;
  notes: string | null;
};
