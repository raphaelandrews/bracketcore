import type {
  DoubleEliminationBracket,
  SingleEliminationBracket,
  Match,
  Team,
  Round,
} from "@bracketcore/registry"
import type {
  ValidationError,
  ScheduleConflict,
  TeamStats,
  BracketSize,
} from "./bracket-editor-types"
import { BYE_TEAM, isByeTeam } from "./bracket-editor-types"

/**
 * Generate standard tournament seeding pairs.
 * For 8 teams: [[1,8], [4,5], [2,7], [3,6]]
 * This ensures highest seeds face lowest seeds and avoids top seeds meeting early.
 */
export function generateSeeding(size: number): [number, number][] {
  if (size === 2) return [[1, 2]]
  const half = generateSeeding(size / 2)
  const result: [number, number][] = []
  for (const [a, b] of half) {
    result.push([a, size + 1 - a])
    result.push([b, size + 1 - b])
  }
  return result
}

/**
 * Apply standard seeding to teams based on their seed values.
 * Returns teams ordered for bracket placement.
 */
export function applySeeding(teams: Team[], bracketSize: BracketSize): Team[] {
  const sortedTeams = [...teams].sort((a, b) => (a.seed ?? 999) - (b.seed ?? 999))
  const seeding = generateSeeding(bracketSize)
  const result: Team[] = []

  for (const [seedA, seedB] of seeding) {
    const teamA = sortedTeams[seedA - 1] ?? null
    const teamB = sortedTeams[seedB - 1] ?? null
    if (teamA) result.push(teamA)
    if (teamB) result.push(teamB)
  }

  return result
}

/**
 * Get quick score options for a given bestOf value.
 * Returns all valid final score combinations.
 */
export function getQuickScores(bestOf: number): [number, number][] {
  const winsNeeded = Math.ceil(bestOf / 2)
  const scores: [number, number][] = []

  for (let loserScore = 0; loserScore < winsNeeded; loserScore++) {
    // Winner takes the series
    scores.push([winsNeeded, loserScore])
    // Also add the reverse
    scores.push([loserScore, winsNeeded])
  }

  return scores
}

/**
 * Validate a double elimination bracket for common errors.
 */
export function validateBracket(
  bracket: DoubleEliminationBracket,
  globalBestOf: number
): ValidationError[] {
  const errors: ValidationError[] = []

  function validateMatch(match: Match, bracket: string) {
    const effectiveBestOf = match.bestOf ?? globalBestOf
    const maxScore = Math.ceil(effectiveBestOf / 2)

    // Check scores don't exceed bestOf
    for (const mt of match.teams) {
      if (mt.score > maxScore) {
        errors.push({
          matchId: match.id,
          type: "score_exceeds_bo",
          message: `Score ${mt.score} exceeds max ${maxScore} for BO${effectiveBestOf}`,
        })
      }
    }

    // Check BYE matches are auto-advanced
    const hasBye = match.teams.some((mt) => isByeTeam(mt.team))
    const hasRealTeam = match.teams.some((mt) => mt.team && !isByeTeam(mt.team))
    if (hasBye && hasRealTeam && match.status !== "completed") {
      errors.push({
        matchId: match.id,
        type: "bye_not_advanced",
        message: "Match with BYE should be auto-completed",
      })
    }

    // Check for orphaned teams (completed match but winner not propagated)
    if (match.status === "completed") {
      const winner = match.teams.find((t) => t.isWinner)
      if (!winner?.team) {
        errors.push({
          matchId: match.id,
          type: "invalid_propagation",
          message: "Completed match has no winner set",
        })
      }
    }
  }

  for (const round of bracket.upper) {
    for (const match of round.matches) {
      validateMatch(match, "upper")
    }
  }

  for (const round of bracket.lower) {
    for (const match of round.matches) {
      validateMatch(match, "lower")
    }
  }

  if (bracket.grandFinal) {
    validateMatch(bracket.grandFinal, "grandFinal")
  }

  return errors
}

/**
 * Detect scheduling conflicts in the bracket.
 * Default overlap window is 45 minutes.
 */
export function detectConflicts(
  bracket: DoubleEliminationBracket,
  overlapMinutes = 45
): ScheduleConflict[] {
  const conflicts: ScheduleConflict[] = []
  const allMatches: Match[] = []

  for (const round of bracket.upper) {
    allMatches.push(...round.matches)
  }
  for (const round of bracket.lower) {
    allMatches.push(...round.matches)
  }
  if (bracket.grandFinal) {
    allMatches.push(bracket.grandFinal)
  }

  // Only check matches with scheduled times
  const scheduledMatches = allMatches.filter((m) => m.scheduledAt)

  for (let i = 0; i < scheduledMatches.length; i++) {
    for (let j = i + 1; j < scheduledMatches.length; j++) {
      const matchA = scheduledMatches[i]
      const matchB = scheduledMatches[j]

      const timeA = new Date(matchA.scheduledAt!).getTime()
      const timeB = new Date(matchB.scheduledAt!).getTime()
      const diffMinutes = Math.abs(timeA - timeB) / (1000 * 60)

      if (diffMinutes < overlapMinutes) {
        // Check if same team is in both matches
        const teamsA = matchA.teams.map((t) => t.team?.id).filter(Boolean)
        const teamsB = matchB.teams.map((t) => t.team?.id).filter(Boolean)
        const overlappingTeam = teamsA.find((id) => teamsB.includes(id))

        if (overlappingTeam) {
          conflicts.push({
            matchIds: [matchA.id, matchB.id],
            reason: "same_team",
            teamId: overlappingTeam,
          })
        }
      }
    }
  }

  return conflicts
}

/**
 * Compute statistics for each team in the bracket.
 */
export function computeTeamStats(bracket: DoubleEliminationBracket): TeamStats[] {
  const statsMap = new Map<string, TeamStats>()

  function processMatch(match: Match) {
    if (match.status !== "completed") return

    for (let i = 0; i < 2; i++) {
      const mt = match.teams[i]
      const team = mt.team
      if (!team || isByeTeam(team)) continue

      let stats = statsMap.get(team.id)
      if (!stats) {
        stats = {
          teamId: team.id,
          teamName: team.name,
          matchesPlayed: 0,
          matchesWon: 0,
          matchesLost: 0,
          mapsPlayed: 0,
          mapsWon: 0,
          mapsLost: 0,
        }
        statsMap.set(team.id, stats)
      }

      stats.matchesPlayed++
      if (mt.isWinner) {
        stats.matchesWon++
      } else {
        stats.matchesLost++
      }

      stats.mapsWon += mt.score
      stats.mapsLost += match.teams[1 - i].score
      stats.mapsPlayed += mt.score + match.teams[1 - i].score
    }
  }

  for (const round of bracket.upper) {
    for (const match of round.matches) {
      processMatch(match)
    }
  }
  for (const round of bracket.lower) {
    for (const match of round.matches) {
      processMatch(match)
    }
  }
  if (bracket.grandFinal) {
    processMatch(bracket.grandFinal)
  }

  return Array.from(statsMap.values()).sort((a, b) => {
    // Sort by matches won, then by map differential
    if (b.matchesWon !== a.matchesWon) return b.matchesWon - a.matchesWon
    return b.mapsWon - b.mapsLost - (a.mapsWon - a.mapsLost)
  })
}

/**
 * Convert a double elimination bracket to single elimination.
 * Only keeps the upper bracket.
 */
export function convertToSingleElimination(
  de: DoubleEliminationBracket
): SingleEliminationBracket {
  // Clone upper bracket rounds and add grand final as the final round
  const rounds: Round[] = de.upper.map((r) => ({
    name: r.name.replace("UB ", ""),
    matches: structuredClone(r.matches),
  }))

  if (de.grandFinal) {
    rounds.push({
      name: "Final",
      matches: [structuredClone(de.grandFinal)],
    })
  }

  return {
    type: "single-elimination",
    rounds,
  }
}

/**
 * Convert a single elimination bracket to double elimination.
 * Creates empty lower bracket structure.
 */
export function convertToDoubleElimination(
  se: SingleEliminationBracket
): DoubleEliminationBracket {
  const numRounds = se.rounds.length
  if (numRounds === 0) {
    return {
      type: "double-elimination",
      upper: [],
      lower: [],
    }
  }

  // Upper bracket is all rounds except the final
  const upper: Round[] = se.rounds.slice(0, -1).map((r, i) => ({
    name: `UB Round ${i + 1}`,
    matches: structuredClone(r.matches),
  }))

  // Extract grand final from last round
  const finalRound = se.rounds[numRounds - 1]
  const grandFinal = finalRound?.matches[0]
    ? structuredClone(finalRound.matches[0])
    : undefined

  // Create empty lower bracket structure
  // Lower bracket has (numUpperRounds - 1) * 2 rounds for a standard DE
  const numUpperRounds = upper.length
  const lower: Round[] = []

  // For each upper bracket round (except first), losers drop down
  // Then there's a consolidation round
  for (let i = 0; i < numUpperRounds; i++) {
    const dropDownMatches = Math.max(1, Math.floor(upper[i]?.matches.length ?? 1))
    lower.push({
      name: `LB Round ${lower.length + 1}`,
      matches: Array.from({ length: dropDownMatches }, (_, j) => ({
        id: `lb${lower.length + 1}-${j + 1}`,
        round: lower.length,
        position: j,
        status: "upcoming" as const,
        teams: [
          { team: null, score: 0, isWinner: false },
          { team: null, score: 0, isWinner: false },
        ],
      })),
    })

    // Consolidation round (except after first LB round for small brackets)
    if (i < numUpperRounds - 1) {
      const consolidationMatches = Math.max(1, Math.floor(dropDownMatches / 2))
      lower.push({
        name: `LB Round ${lower.length + 1}`,
        matches: Array.from({ length: consolidationMatches }, (_, j) => ({
          id: `lb${lower.length + 1}-${j + 1}`,
          round: lower.length,
          position: j,
          status: "upcoming" as const,
          teams: [
            { team: null, score: 0, isWinner: false },
            { team: null, score: 0, isWinner: false },
          ],
        })),
      })
    }
  }

  return {
    type: "double-elimination",
    upper,
    lower,
    grandFinal,
  }
}

/**
 * Generate match IDs for a bracket of given size.
 */
export function generateMatchIds(
  size: BracketSize
): { upper: string[][]; lower: string[][]; grandFinal: string } {
  const numUpperRounds = Math.log2(size)
  const upper: string[][] = []
  const lower: string[][] = []

  // Upper bracket match IDs
  for (let r = 0; r < numUpperRounds; r++) {
    const matchesInRound = size / Math.pow(2, r + 1)
    upper.push(
      Array.from({ length: matchesInRound }, (_, i) => `ub${r + 1}-${i + 1}`)
    )
  }

  // Lower bracket match IDs
  // DE lower bracket has approximately 2*(numUpperRounds-1) rounds
  const numLowerRounds = 2 * (numUpperRounds - 1)
  let currentMatches = size / 4 // First LB round has size/4 matches

  for (let r = 0; r < numLowerRounds; r++) {
    lower.push(
      Array.from({ length: Math.max(1, currentMatches) }, (_, i) => `lb${r + 1}-${i + 1}`)
    )
    // Every other round halves the matches (consolidation rounds)
    if (r % 2 === 1) {
      currentMatches = Math.max(1, Math.floor(currentMatches / 2))
    }
  }

  return {
    upper,
    lower,
    grandFinal: "gf",
  }
}

/**
 * Build a bracket flow map for winner/loser progression.
 */
export function buildBracketFlow(
  size: BracketSize
): Record<string, { winner?: [string, 0 | 1]; loser?: [string, 0 | 1] }> {
  const ids = generateMatchIds(size)
  const flow: Record<string, { winner?: [string, 0 | 1]; loser?: [string, 0 | 1] }> = {}

  // Upper bracket flows
  for (let r = 0; r < ids.upper.length; r++) {
    const roundMatches = ids.upper[r]
    const nextRound = ids.upper[r + 1]
    const lowerRound = ids.lower[r * 2] // Losers go to LB

    for (let i = 0; i < roundMatches.length; i++) {
      const matchId = roundMatches[i]
      flow[matchId] = {}

      // Winner goes to next upper round
      if (nextRound) {
        const nextMatchIndex = Math.floor(i / 2)
        const slot = (i % 2) as 0 | 1
        flow[matchId].winner = [nextRound[nextMatchIndex], slot]
      } else {
        // Final upper round winner goes to grand final
        flow[matchId].winner = [ids.grandFinal, 0]
      }

      // Loser goes to lower bracket
      if (lowerRound) {
        const lbSlot = r === 0 ? (i % 2) as 0 | 1 : 1 as const
        const lbMatchIndex = r === 0 ? Math.floor(i / 2) : i
        if (ids.lower[r * 2] && ids.lower[r * 2][lbMatchIndex]) {
          flow[matchId].loser = [ids.lower[r * 2][lbMatchIndex], lbSlot]
        }
      }
    }
  }

  // Lower bracket flows
  for (let r = 0; r < ids.lower.length; r++) {
    const roundMatches = ids.lower[r]
    const nextRound = ids.lower[r + 1]

    for (let i = 0; i < roundMatches.length; i++) {
      const matchId = roundMatches[i]
      flow[matchId] = {}

      if (nextRound) {
        const nextMatchIndex = r % 2 === 1 ? Math.floor(i / 2) : i
        const slot = r % 2 === 1 ? (i % 2) as 0 | 1 : 0 as const
        if (nextRound[nextMatchIndex]) {
          flow[matchId].winner = [nextRound[nextMatchIndex], slot]
        }
      } else {
        // Final lower bracket winner goes to grand final
        flow[matchId].winner = [ids.grandFinal, 1]
      }
    }
  }

  return flow
}

/**
 * Create a new empty match.
 */
export function createMatch(
  id: string,
  round: number,
  position: number,
  teamA: Team | null = null,
  teamB: Team | null = null
): Match {
  return {
    id,
    round,
    position,
    status: "upcoming",
    teams: [
      { team: teamA, score: 0, isWinner: false },
      { team: teamB, score: 0, isWinner: false },
    ],
  }
}

/**
 * Build a double elimination bracket for a given size.
 */
export function buildBracketForSize(
  teams: Team[],
  size: BracketSize
): DoubleEliminationBracket {
  const numUpperRounds = Math.log2(size)
  const ids = generateMatchIds(size)

  // Build upper bracket rounds
  const upper: Round[] = []
  for (let r = 0; r < numUpperRounds; r++) {
    const roundIds = ids.upper[r]
    const matches: Match[] = []

    for (let i = 0; i < roundIds.length; i++) {
      if (r === 0) {
        // First round: place teams
        const teamAIndex = i * 2
        const teamBIndex = i * 2 + 1
        matches.push(
          createMatch(
            roundIds[i],
            r,
            i,
            teams[teamAIndex] ?? null,
            teams[teamBIndex] ?? null
          )
        )
      } else {
        // Later rounds: empty matches
        matches.push(createMatch(roundIds[i], r, i))
      }
    }

    const roundName =
      r === numUpperRounds - 1
        ? "UB Final"
        : r === numUpperRounds - 2
          ? "UB Semifinal"
          : `UB Round ${r + 1}`

    upper.push({ name: roundName, matches })
  }

  // Build lower bracket rounds
  const lower: Round[] = []
  for (let r = 0; r < ids.lower.length; r++) {
    const roundIds = ids.lower[r]
    const matches = roundIds.map((id, i) => createMatch(id, r, i))

    const roundName =
      r === ids.lower.length - 1 ? "LB Final" : `LB Round ${r + 1}`

    lower.push({ name: roundName, matches })
  }

  // Grand final
  const grandFinal = createMatch(ids.grandFinal, 0, 0)

  return {
    type: "double-elimination",
    upper,
    lower,
    grandFinal,
  }
}

/**
 * Fill empty team slots with BYE teams.
 */
export function fillWithByes(teams: Team[], size: BracketSize): Team[] {
  const result = [...teams]
  while (result.length < size) {
    result.push({ ...BYE_TEAM, id: `bye-${result.length}` })
  }
  return result
}

/**
 * Auto-advance matches that have a BYE opponent.
 */
export function handleByeAdvancement(
  bracket: DoubleEliminationBracket
): DoubleEliminationBracket {
  const b = structuredClone(bracket)

  function advanceIfBye(match: Match): boolean {
    const [teamA, teamB] = match.teams
    const aIsBye = isByeTeam(teamA.team)
    const bIsBye = isByeTeam(teamB.team)

    if (aIsBye && !bIsBye && teamB.team) {
      // Team B wins automatically
      match.status = "completed"
      teamA.score = 0
      teamB.score = 1
      teamA.isWinner = false
      teamB.isWinner = true
      return true
    } else if (bIsBye && !aIsBye && teamA.team) {
      // Team A wins automatically
      match.status = "completed"
      teamA.score = 1
      teamB.score = 0
      teamA.isWinner = true
      teamB.isWinner = false
      return true
    }

    return false
  }

  for (const round of b.upper) {
    for (const match of round.matches) {
      advanceIfBye(match)
    }
  }

  for (const round of b.lower) {
    for (const match of round.matches) {
      advanceIfBye(match)
    }
  }

  return b
}
