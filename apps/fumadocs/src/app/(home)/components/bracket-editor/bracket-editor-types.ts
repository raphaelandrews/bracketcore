import type {
  Match,
  Team,
  DoubleEliminationBracket,
  SingleEliminationBracket,
} from "@bracketcore/registry"

export interface EditorMatch extends Match {
  forfeitTeamId?: string
  notes?: string
  streamUrl?: string
  venue?: string
}

export interface EditorDoubleEliminationBracket extends Omit<DoubleEliminationBracket, "grandFinal"> {
  grandFinal?: EditorMatch
  grandFinalReset?: EditorMatch
}

export interface EditorSingleEliminationBracket extends SingleEliminationBracket {
  thirdPlaceMatch?: EditorMatch
}

export interface ValidationError {
  matchId: string
  type: "orphaned_team" | "invalid_propagation" | "score_exceeds_bo" | "bye_not_advanced"
  message: string
}

export interface ScheduleConflict {
  matchIds: [string, string]
  reason: "same_team" | "time_overlap"
  teamId?: string
}

export interface TeamStats {
  teamId: string
  teamName: string
  matchesPlayed: number
  matchesWon: number
  matchesLost: number
  mapsPlayed: number
  mapsWon: number
  mapsLost: number
}

export interface HistoryEntry {
  bracket: DoubleEliminationBracket
  teams: Team[]
  timestamp: number
}

export type BracketSize = 4 | 8 | 16 | 32 | 64

export const BYE_TEAM: Team = {
  id: "bye",
  name: "BYE",
  seed: 999,
}

export function isByeTeam(team: Team | null | undefined): boolean {
  return team?.id === BYE_TEAM.id
}
