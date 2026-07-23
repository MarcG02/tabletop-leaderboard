export interface Match {
  id: number
  gameName: string
  date: string
  participants: { id: number; name: string }[]
  winnerId: number | null
  winnerName: string
}

export interface MatchStat {
  label: string
  value: string
  /** e.g. "emoji_events", "groups", "timeline" */
  icon: string
  bgColor: string
  iconColor: string
}
