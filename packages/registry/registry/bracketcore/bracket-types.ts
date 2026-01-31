export interface Team {
  id: string;
  name: string;
  logo?: string;
  seed?: number;
}

export interface MatchTeam {
  team: Team | null;
  score: number;
  isWinner?: boolean;
}

export interface Match {
  id: string;
  /** Round index (0-based) */
  round: number;
  /** Position within the round (0-based) */
  position: number;
  /** Best-of series count (e.g. 1, 3, 5) */
  bestOf?: number;
  /** Scheduled date/time (Date object or ISO string) */
  scheduledAt?: Date | string;
  /** Status label (e.g. "Live", "Upcoming") */
  status?: MatchStatus;
  teams: [MatchTeam, MatchTeam];
}

export type MatchStatus = "upcoming" | "live" | "completed";

export interface Round {
  name: string;
  matches: Match[];
}

// --- Single Elimination ---

export interface SingleEliminationBracket {
  type: "single-elimination";
  rounds: Round[];
}

// --- Double Elimination ---

export interface DoubleEliminationBracket {
  type: "double-elimination";
  upper: Round[];
  lower: Round[];
  grandFinal: Match;
}

// --- Swiss ---

export interface SwissStanding {
  team: Team;
  wins: number;
  losses: number;
  /** Buchholz or similar tiebreaker */
  tiebreaker?: number;
  status?: "advancing" | "eliminated" | "pending";
}

export interface SwissRound {
  name: string;
  /** Win-loss record label for this round (e.g. "1:0", "0:1") */
  record?: string;
  matches: Match[];
}

export interface SwissBracket {
  type: "swiss";
  rounds: SwissRound[];
  standings: SwissStanding[];
  /** Number of wins to advance */
  winsToAdvance: number;
  /** Number of losses to be eliminated */
  lossesToEliminate: number;
}

// --- Group Stage ---

export interface GroupStanding {
  team: Team;
  wins: number;
  losses: number;
  draws: number;
  points: number;
  /** Map/game differential */
  differential: number;
}

export interface Group {
  name: string;
  teams: Team[];
  matches: Match[];
  standings: GroupStanding[];
}

export interface GroupStageBracket {
  type: "group-stage";
  groups: Group[];
}

// --- Union type ---

export type Bracket =
  | SingleEliminationBracket
  | DoubleEliminationBracket
  | SwissBracket
  | GroupStageBracket;
