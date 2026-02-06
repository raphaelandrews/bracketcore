"use client"

import { useCallback, useState } from "react"
import type {
  DoubleEliminationBracket,
  Match,
  Team,
} from "@bracketcore/registry"

const DEFAULT_TEAMS: Team[] = [
  { id: "t1", name: "Team Alpha", seed: 1 },
  { id: "t2", name: "Team Bravo", seed: 2 },
  { id: "t3", name: "Team Charlie", seed: 3 },
  { id: "t4", name: "Team Delta", seed: 4 },
]

const UB1_1 = "ub1-1"
const UB1_2 = "ub1-2"
const UB_FINAL = "ub-final"
const LB1 = "lb1"
const LB_FINAL = "lb-final"
const GF = "gf"

const BRACKET_FLOW: Record<string, { winner?: [string, 0 | 1]; loser?: [string, 0 | 1] }> = {
  [UB1_1]: { winner: [UB_FINAL, 0], loser: [LB1, 0] },
  [UB1_2]: { winner: [UB_FINAL, 1], loser: [LB1, 1] },
  [UB_FINAL]: { winner: [GF, 0], loser: [LB_FINAL, 1] },
  [LB1]: { winner: [LB_FINAL, 0] },
  [LB_FINAL]: { winner: [GF, 1] },
}

function getDownstream(matchId: string): string[] {
  const result: string[] = []
  const flow = BRACKET_FLOW[matchId]
  if (!flow) return result
  if (flow.winner) {
    result.push(flow.winner[0])
    result.push(...getDownstream(flow.winner[0]))
  }
  if (flow.loser) {
    result.push(flow.loser[0])
    result.push(...getDownstream(flow.loser[0]))
  }
  return [...new Set(result)]
}

function mkMatch(
  id: string,
  round: number,
  position: number,
  teamA: Team | null,
  teamB: Team | null,
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

function buildInitialBracket(teams: Team[]): DoubleEliminationBracket {
  return {
    type: "double-elimination",
    upper: [
      {
        name: "UB Round 1",
        matches: [
          mkMatch(UB1_1, 0, 0, teams[0], teams[3]),
          mkMatch(UB1_2, 0, 1, teams[1], teams[2]),
        ],
      },
      {
        name: "UB Final",
        matches: [mkMatch(UB_FINAL, 1, 0, null, null)],
      },
    ],
    lower: [
      {
        name: "LB Round 1",
        matches: [mkMatch(LB1, 0, 0, null, null)],
      },
      {
        name: "LB Final",
        matches: [mkMatch(LB_FINAL, 1, 0, null, null)],
      },
    ],
    grandFinal: mkMatch(GF, 0, 0, null, null),
  }
}

function findMatch(bracket: DoubleEliminationBracket, id: string): Match | undefined {
  for (const round of bracket.upper) {
    for (const match of round.matches) {
      if (match.id === id) return match
    }
  }
  for (const round of bracket.lower) {
    for (const match of round.matches) {
      if (match.id === id) return match
    }
  }
  if (bracket.grandFinal?.id === id) return bracket.grandFinal
  return undefined
}

function updateMatchInBracket(
  bracket: DoubleEliminationBracket,
  updated: Match,
): DoubleEliminationBracket {
  const b = structuredClone(bracket)
  for (const round of b.upper) {
    for (let i = 0; i < round.matches.length; i++) {
      if (round.matches[i].id === updated.id) {
        round.matches[i] = updated
        return b
      }
    }
  }
  for (const round of b.lower) {
    for (let i = 0; i < round.matches.length; i++) {
      if (round.matches[i].id === updated.id) {
        round.matches[i] = updated
        return b
      }
    }
  }
  if (b.grandFinal?.id === updated.id) {
    b.grandFinal = updated
  }
  return b
}

export function useBracketEditor() {
  const [teams, setTeams] = useState<Team[]>(DEFAULT_TEAMS)
  const [bracket, setBracket] = useState<DoubleEliminationBracket>(() =>
    buildInitialBracket(DEFAULT_TEAMS),
  )
  const [bestOf, setBestOf] = useState<number>(3)
  const [connectorStyle, setConnectorStyle] = useState<"default" | "simple">("default")
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null)
  const [isPanelExpanded, setIsPanelExpanded] = useState(true)

  const handleTeamNameChange = useCallback((index: number, name: string) => {
    setTeams((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], name }
      return next
    })

    setBracket((prev) => {
      const b = structuredClone(prev)
      const teamId = DEFAULT_TEAMS[index].id

      function updateInMatches(matches: Match[]) {
        for (const match of matches) {
          for (const mt of match.teams) {
            if (mt.team?.id === teamId) {
              mt.team.name = name
            }
          }
        }
      }

      for (const round of b.upper) updateInMatches(round.matches)
      for (const round of b.lower) updateInMatches(round.matches)
      if (b.grandFinal) updateInMatches([b.grandFinal])

      return b
    })
  }, [])

  const handleMatchClick = useCallback((match: Match) => {
    setSelectedMatch(match)
    setIsPanelExpanded(true)
  }, [])

  const handleMatchUpdate = useCallback((updated: Match) => {
    setBracket((prev) => {
      let b = updateMatchInBracket(prev, updated)
      const prevMatch = findMatch(prev, updated.id)
      const wasCompleted = prevMatch?.status === "completed"
      const isCompleted = updated.status === "completed"

      if (isCompleted) {
        const winner = updated.teams.find((t) => t.isWinner)?.team ?? null
        const loser = updated.teams.find((t) => !t.isWinner)?.team ?? null
        const flow = BRACKET_FLOW[updated.id]

        if (flow?.winner) {
          const [targetId, slot] = flow.winner
          const target = findMatch(b, targetId)
          if (target) {
            const t = structuredClone(target)
            t.teams[slot].team = winner
            b = updateMatchInBracket(b, t)
          }
        }
        if (flow?.loser) {
          const [targetId, slot] = flow.loser
          const target = findMatch(b, targetId)
          if (target) {
            const t = structuredClone(target)
            t.teams[slot].team = loser
            b = updateMatchInBracket(b, t)
          }
        }
      } else if (wasCompleted && !isCompleted) {
        const downstream = getDownstream(updated.id)
        const flow = BRACKET_FLOW[updated.id]

        if (flow?.winner) {
          const [targetId, slot] = flow.winner
          const target = findMatch(b, targetId)
          if (target) {
            const t = structuredClone(target)
            t.teams[slot].team = null
            t.teams[slot].score = 0
            t.teams[slot].isWinner = false
            b = updateMatchInBracket(b, t)
          }
        }
        if (flow?.loser) {
          const [targetId, slot] = flow.loser
          const target = findMatch(b, targetId)
          if (target) {
            const t = structuredClone(target)
            t.teams[slot].team = null
            t.teams[slot].score = 0
            t.teams[slot].isWinner = false
            b = updateMatchInBracket(b, t)
          }
        }

        for (const dsId of downstream) {
          const dsMatch = findMatch(b, dsId)
          if (dsMatch && dsMatch.id !== updated.id) {
            const reset = structuredClone(dsMatch)
            reset.status = "upcoming"
            reset.teams[0].score = 0
            reset.teams[0].isWinner = false
            reset.teams[1].score = 0
            reset.teams[1].isWinner = false
            for (const [, flowInfo] of Object.entries(BRACKET_FLOW)) {
              if (flowInfo.winner && flowInfo.winner[0] === dsId) {
                const sourceInChain =
                  downstream.includes(
                    Object.keys(BRACKET_FLOW).find(
                      (k) =>
                        BRACKET_FLOW[k].winner?.[0] === dsId || BRACKET_FLOW[k].loser?.[0] === dsId,
                    ) ?? "",
                  ) ||
                  Object.keys(BRACKET_FLOW).find((k) => BRACKET_FLOW[k].winner?.[0] === dsId) ===
                  updated.id
                if (sourceInChain) {
                  reset.teams[flowInfo.winner[1]].team = null
                }
              }
              if (flowInfo.loser && flowInfo.loser[0] === dsId) {
                const sourceId = Object.keys(BRACKET_FLOW).find(
                  (k) => BRACKET_FLOW[k].loser?.[0] === dsId,
                )
                if (sourceId && (downstream.includes(sourceId) || sourceId === updated.id)) {
                  reset.teams[flowInfo.loser[1]].team = null
                }
              }
            }
            b = updateMatchInBracket(b, reset)
          }
        }
      }

      return b
    })

    setSelectedMatch(updated)
  }, [])

  const togglePanel = useCallback(() => {
    setIsPanelExpanded((prev) => !prev)
  }, [])

  return {
    teams,
    bracket,
    bestOf,
    setBestOf,
    connectorStyle,
    setConnectorStyle,
    selectedMatch,
    isPanelExpanded,
    togglePanel,
    handleTeamNameChange,
    handleMatchClick,
    handleMatchUpdate,
  }
}
