import type {
  Match,
  Team,
  DoubleEliminationBracket,
  SingleEliminationBracket,
} from "@bracketcore/registry"

/** Extended match type with editor-only fields */
export interface EditorMatch extends Match {
  /** Which team forfeited, if any */
  forfeitTeamId?: string
  /** Match notes */
  notes?: string
  /** Stream URL for the match */
  streamUrl?: string
  /** Venue/location for the match */
  venue?: string
}

/** Extended double elimination bracket with editor features */
export interface EditorDoubleEliminationBracket extends Omit<DoubleEliminationBracket, "grandFinal"> {
  grandFinal?: EditorMatch
  /** Second grand final if bracket reset was triggered */
  grandFinalReset?: EditorMatch
}

/** Extended single elimination bracket with third place match */
export interface EditorSingleEliminationBracket extends SingleEliminationBracket {
  /** Optional third place match */
  thirdPlaceMatch?: EditorMatch
}

/** Bracket validation error */
export interface ValidationError {
  matchId: string
  type: "orphaned_team" | "invalid_propagation" | "score_exceeds_bo" | "bye_not_advanced"
  message: string
}

/** Scheduling conflict between matches */
export interface ScheduleConflict {
  matchIds: [string, string]
  reason: "same_team" | "time_overlap"
  teamId?: string
}

/** Team statistics calculated from bracket results */
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

/** History entry for undo/redo */
export interface HistoryEntry {
  bracket: DoubleEliminationBracket
  teams: Team[]
  timestamp: number
}

/** Valid bracket sizes (power of 2) */
export type BracketSize = 4 | 8 | 16 | 32

/** The special BYE team */
export const BYE_TEAM: Team = {
  id: "bye",
  name: "BYE",
  seed: 999,
}

/** Check if a team is the BYE team */
export function isByeTeam(team: Team | null | undefined): boolean {
  return team?.id === BYE_TEAM.id
}
