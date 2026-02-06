"use client"

import { useCallback, useMemo, useState } from "react"
import type {
  DoubleEliminationBracket,
  Match,
  Team,
} from "@bracketcore/registry"
import type {
  BracketSize,
  ValidationError,
  ScheduleConflict,
  TeamStats,
  EditorMatch,
  HistoryEntry,
} from "./bracket-editor-types"
import { BYE_TEAM, isByeTeam } from "./bracket-editor-types"
import {
  buildBracketForSize,
  buildBracketFlow,
  applySeeding,
  fillWithByes,
  handleByeAdvancement,
  validateBracket,
  detectConflicts,
  computeTeamStats,
  getQuickScores,
} from "./bracket-utils"

const DEFAULT_TEAMS: Team[] = [
  { id: "t1", name: "Team Alpha", seed: 1 },
  { id: "t2", name: "Team Bravo", seed: 2 },
  { id: "t3", name: "Team Charlie", seed: 3 },
  { id: "t4", name: "Team Delta", seed: 4 },
]

const MAX_HISTORY = 50

function getDownstream(
  matchId: string,
  bracketFlow: Record<string, { winner?: [string, 0 | 1]; loser?: [string, 0 | 1] }>
): string[] {
  const result: string[] = []
  const flow = bracketFlow[matchId]
  if (!flow) return result
  if (flow.winner) {
    result.push(flow.winner[0])
    result.push(...getDownstream(flow.winner[0], bracketFlow))
  }
  if (flow.loser) {
    result.push(flow.loser[0])
    result.push(...getDownstream(flow.loser[0], bracketFlow))
  }
  return [...new Set(result)]
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
  // Core state
  const [teams, setTeams] = useState<Team[]>(DEFAULT_TEAMS)
  const [bracketSize, setBracketSize] = useState<BracketSize>(4)
  const [bracket, setBracket] = useState<DoubleEliminationBracket>(() =>
    buildBracketForSize(DEFAULT_TEAMS, 4),
  )
  const [bestOf, setBestOf] = useState<number>(3)
  const [connectorStyle, setConnectorStyle] = useState<"default" | "simple">("default")
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null)
  const [isPanelExpanded, setIsPanelExpanded] = useState(true)

  // History for undo/redo
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  // Compute bracket flow based on size
  const bracketFlow = useMemo(() => buildBracketFlow(bracketSize), [bracketSize])

  // Validation and conflicts
  const validationErrors = useMemo(
    () => validateBracket(bracket, bestOf),
    [bracket, bestOf]
  )

  const scheduleConflicts = useMemo(
    () => detectConflicts(bracket),
    [bracket]
  )

  // Team statistics
  const teamStats = useMemo(
    () => computeTeamStats(bracket),
    [bracket]
  )

  // Quick scores for current bestOf
  const quickScores = useMemo(
    () => getQuickScores(selectedMatch?.bestOf ?? bestOf),
    [selectedMatch?.bestOf, bestOf]
  )

  // Push current state to history
  const pushHistory = useCallback((newBracket: DoubleEliminationBracket, newTeams: Team[]) => {
    setHistory((prev) => {
      // Slice off any "future" states if we're in the middle of history
      const newHistory = prev.slice(0, historyIndex + 1)
      newHistory.push({
        bracket: structuredClone(newBracket),
        teams: structuredClone(newTeams),
        timestamp: Date.now(),
      })
      // Keep only last MAX_HISTORY entries
      return newHistory.slice(-MAX_HISTORY)
    })
    setHistoryIndex((prev) => Math.min(prev + 1, MAX_HISTORY - 1))
  }, [historyIndex])

  // Undo
  const canUndo = historyIndex > 0
  const undo = useCallback(() => {
    if (!canUndo) return
    const entry = history[historyIndex - 1]
    if (entry) {
      setBracket(structuredClone(entry.bracket))
      setTeams(structuredClone(entry.teams))
      setHistoryIndex((prev) => prev - 1)
      setSelectedMatch(null)
    }
  }, [canUndo, history, historyIndex])

  // Redo
  const canRedo = historyIndex < history.length - 1
  const redo = useCallback(() => {
    if (!canRedo) return
    const entry = history[historyIndex + 1]
    if (entry) {
      setBracket(structuredClone(entry.bracket))
      setTeams(structuredClone(entry.teams))
      setHistoryIndex((prev) => prev + 1)
      setSelectedMatch(null)
    }
  }, [canRedo, history, historyIndex])

  // Update bracket with history tracking
  const updateBracketWithHistory = useCallback((
    updater: (prev: DoubleEliminationBracket) => DoubleEliminationBracket,
    currentTeams?: Team[]
  ) => {
    setBracket((prev) => {
      const next = updater(prev)
      pushHistory(next, currentTeams ?? teams)
      return next
    })
  }, [pushHistory, teams])

  const handleTeamNameChange = useCallback((index: number, name: string) => {
    const newTeams = teams.map((t, i) =>
      i === index ? { ...t, name } : t
    )
    setTeams(newTeams)

    setBracket((prev) => {
      const b = structuredClone(prev)
      const teamId = teams[index].id

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

      pushHistory(b, newTeams)
      return b
    })
  }, [teams, pushHistory])

  const handleMatchClick = useCallback((match: Match) => {
    setSelectedMatch(match)
    setIsPanelExpanded(true)
  }, [])

  const handleMatchUpdate = useCallback((updated: Match) => {
    // Validation: Prevent completing if scores are tied
    if (updated.status === "completed") {
      const [a, b] = updated.teams
      if (a.score === b.score) {
        updated.status = "live"
      }
    }

    setBracket((prev) => {
      let b = updateMatchInBracket(prev, updated)
      const prevMatch = findMatch(prev, updated.id)
      const wasCompleted = prevMatch?.status === "completed"
      const isCompleted = updated.status === "completed"

      if (isCompleted) {
        const winner = updated.teams.find((t) => t.isWinner)?.team ?? null
        const loser = updated.teams.find((t) => !t.isWinner)?.team ?? null
        const flow = bracketFlow[updated.id]

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
        const downstream = getDownstream(updated.id, bracketFlow)
        const flow = bracketFlow[updated.id]

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
            for (const [, flowInfo] of Object.entries(bracketFlow)) {
              if (flowInfo.winner && flowInfo.winner[0] === dsId) {
                const sourceInChain =
                  downstream.includes(
                    Object.keys(bracketFlow).find(
                      (k) =>
                        bracketFlow[k].winner?.[0] === dsId || bracketFlow[k].loser?.[0] === dsId,
                    ) ?? "",
                  ) ||
                  Object.keys(bracketFlow).find((k) => bracketFlow[k].winner?.[0] === dsId) ===
                  updated.id
                if (sourceInChain) {
                  reset.teams[flowInfo.winner[1]].team = null
                }
              }
              if (flowInfo.loser && flowInfo.loser[0] === dsId) {
                const sourceId = Object.keys(bracketFlow).find(
                  (k) => bracketFlow[k].loser?.[0] === dsId,
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

      pushHistory(b, teams)
      return b
    })

    setSelectedMatch(updated)
  }, [bracketFlow, teams, pushHistory])

  // Forfeit a team in the selected match
  const handleForfeit = useCallback((teamIndex: 0 | 1) => {
    if (!selectedMatch) return
    const hasTeams = !!(selectedMatch.teams[0].team && selectedMatch.teams[1].team)
    if (!hasTeams) return

    const updated = structuredClone(selectedMatch) as EditorMatch
    const forfeitingTeam = updated.teams[teamIndex].team
    const winningTeamIndex = teamIndex === 0 ? 1 : 0

    updated.forfeitTeamId = forfeitingTeam?.id
    updated.status = "completed"
    updated.teams[teamIndex].score = 0
    updated.teams[teamIndex].isWinner = false
    updated.teams[winningTeamIndex].isWinner = true
    // Give winner enough maps to win the series
    const effectiveBestOf = updated.bestOf ?? bestOf
    updated.teams[winningTeamIndex].score = Math.ceil(effectiveBestOf / 2)

    handleMatchUpdate(updated)
  }, [selectedMatch, bestOf, handleMatchUpdate])

  // Swap teams in the selected match
  const handleSwapTeams = useCallback(() => {
    if (!selectedMatch) return
    const updated = structuredClone(selectedMatch)
    const [teamA, teamB] = updated.teams
    updated.teams = [teamB, teamA]
    handleMatchUpdate(updated)
  }, [selectedMatch, handleMatchUpdate])

  // Apply quick score
  const handleQuickScore = useCallback((scoreA: number, scoreB: number) => {
    if (!selectedMatch) return
    const hasTeams = !!(selectedMatch.teams[0].team && selectedMatch.teams[1].team)
    if (!hasTeams) return

    const updated = structuredClone(selectedMatch)
    updated.teams[0].score = scoreA
    updated.teams[1].score = scoreB
    updated.status = "completed"
    updated.teams[0].isWinner = scoreA > scoreB
    updated.teams[1].isWinner = scoreB > scoreA

    handleMatchUpdate(updated)
  }, [selectedMatch, handleMatchUpdate])

  // Update match notes/metadata
  const handleMatchNotesChange = useCallback((notes: string) => {
    if (!selectedMatch) return
    const updated = structuredClone(selectedMatch) as EditorMatch
    updated.notes = notes
    handleMatchUpdate(updated)
  }, [selectedMatch, handleMatchUpdate])

  const handleMatchStreamUrlChange = useCallback((streamUrl: string) => {
    if (!selectedMatch) return
    const updated = structuredClone(selectedMatch) as EditorMatch
    updated.streamUrl = streamUrl
    handleMatchUpdate(updated)
  }, [selectedMatch, handleMatchUpdate])

  const handleMatchVenueChange = useCallback((venue: string) => {
    if (!selectedMatch) return
    const updated = structuredClone(selectedMatch) as EditorMatch
    updated.venue = venue
    handleMatchUpdate(updated)
  }, [selectedMatch, handleMatchUpdate])

  const togglePanel = useCallback(() => {
    setIsPanelExpanded((prev) => !prev)
  }, [])

  // Reset bracket
  const handleReset = useCallback(() => {
    const newBracket = buildBracketForSize(teams, bracketSize)
    setBracket(newBracket)
    setBestOf(3)
    setSelectedMatch(null)
    pushHistory(newBracket, teams)
  }, [teams, bracketSize, pushHistory])

  // Shuffle teams randomly
  const handleShuffle = useCallback(() => {
    const shuffled = [...teams].sort(() => Math.random() - 0.5)
    setTeams(shuffled)
    const newBracket = buildBracketForSize(shuffled, bracketSize)
    setBracket(newBracket)
    setSelectedMatch(null)
    pushHistory(newBracket, shuffled)
  }, [teams, bracketSize, pushHistory])

  // Apply standard tournament seeding
  const handleSeedByRank = useCallback(() => {
    const seeded = applySeeding(teams, bracketSize)
    setTeams(seeded)
    const newBracket = buildBracketForSize(seeded, bracketSize)
    setBracket(newBracket)
    setSelectedMatch(null)
    pushHistory(newBracket, seeded)
  }, [teams, bracketSize, pushHistory])

  // Change bracket size
  const handleBracketSizeChange = useCallback((newSize: BracketSize) => {
    setBracketSize(newSize)

    // Adjust teams to match new size
    let newTeams = [...teams]
    if (newTeams.length < newSize) {
      // Add new default teams
      for (let i = newTeams.length; i < newSize; i++) {
        newTeams.push({
          id: `t${i + 1}`,
          name: `Team ${i + 1}`,
          seed: i + 1,
        })
      }
    } else if (newTeams.length > newSize) {
      // Trim teams to size
      newTeams = newTeams.slice(0, newSize)
    }

    setTeams(newTeams)
    const newBracket = buildBracketForSize(newTeams, newSize)
    setBracket(newBracket)
    setSelectedMatch(null)
    pushHistory(newBracket, newTeams)
  }, [teams, pushHistory])

  // Add a new team
  const handleAddTeam = useCallback(() => {
    const newTeam: Team = {
      id: `t${teams.length + 1}-${Date.now()}`,
      name: `Team ${teams.length + 1}`,
      seed: teams.length + 1,
    }
    const newTeams = [...teams, newTeam]
    setTeams(newTeams)

    // Determine new bracket size (next power of 2)
    const newSize = Math.pow(2, Math.ceil(Math.log2(newTeams.length))) as BracketSize
    if (newSize !== bracketSize && [4, 8, 16, 32].includes(newSize)) {
      setBracketSize(newSize as BracketSize)
      // Fill remaining slots with BYEs
      const teamsWithByes = fillWithByes(newTeams, newSize as BracketSize)
      let newBracket = buildBracketForSize(teamsWithByes, newSize as BracketSize)
      newBracket = handleByeAdvancement(newBracket)
      setBracket(newBracket)
      pushHistory(newBracket, newTeams)
    } else {
      // Just update the current bracket with the new team in first round
      const teamsWithByes = fillWithByes(newTeams, bracketSize)
      let newBracket = buildBracketForSize(teamsWithByes, bracketSize)
      newBracket = handleByeAdvancement(newBracket)
      setBracket(newBracket)
      pushHistory(newBracket, newTeams)
    }
  }, [teams, bracketSize, pushHistory])

  // Remove a team
  const handleRemoveTeam = useCallback((teamId: string) => {
    const newTeams = teams.filter((t) => t.id !== teamId)
    if (newTeams.length < 2) return // Minimum 2 teams

    setTeams(newTeams)

    // Determine appropriate bracket size
    const newSize = Math.pow(2, Math.ceil(Math.log2(Math.max(newTeams.length, 2)))) as BracketSize
    if (newSize !== bracketSize && [4, 8, 16, 32].includes(newSize)) {
      setBracketSize(newSize as BracketSize)
    }

    const teamsWithByes = fillWithByes(newTeams, (newSize as BracketSize) || bracketSize)
    let newBracket = buildBracketForSize(teamsWithByes, (newSize as BracketSize) || bracketSize)
    newBracket = handleByeAdvancement(newBracket)
    setBracket(newBracket)
    setSelectedMatch(null)
    pushHistory(newBracket, newTeams)
  }, [teams, bracketSize, pushHistory])

  // Auto-schedule matches
  const handleAutoSchedule = useCallback(() => {
    const start = new Date()
    start.setMinutes(0, 0, 0)
    start.setHours(start.getHours() + 1)

    const DURATION_MINS = 45

    setBracket((prev) => {
      const b = structuredClone(prev)
      let matchCount = 0

      function scheduleMatches(matches: Match[]) {
        for (const m of matches) {
          const time = new Date(start.getTime() + matchCount * DURATION_MINS * 60000)
          m.scheduledAt = time
          matchCount++
        }
      }

      for (const round of b.upper) scheduleMatches(round.matches)
      for (const round of b.lower) scheduleMatches(round.matches)
      if (b.grandFinal) scheduleMatches([b.grandFinal])

      pushHistory(b, teams)
      return b
    })
  }, [teams, pushHistory])

  // Import bracket from JSON
  const handleImport = useCallback((data: string) => {
    try {
      const parsed = JSON.parse(data)
      if (parsed.teams) setTeams(parsed.teams)
      if (parsed.bracket) setBracket(parsed.bracket)
      if (parsed.bestOf) setBestOf(parsed.bestOf)
      if (parsed.connectorStyle) setConnectorStyle(parsed.connectorStyle)
      if (parsed.bracketSize) setBracketSize(parsed.bracketSize)

      if (parsed.bracket && parsed.teams) {
        pushHistory(parsed.bracket, parsed.teams)
      }
    } catch (e) {
      console.error("Failed to import bracket", e)
    }
  }, [pushHistory])

  // Export bracket to JSON
  const handleExport = useCallback(() => {
    const data = JSON.stringify(
      { teams, bracket, bestOf, connectorStyle, bracketSize },
      null,
      2
    )
    const blob = new Blob([data], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "bracket.json"
    a.click()
    URL.revokeObjectURL(url)
  }, [teams, bracket, bestOf, connectorStyle, bracketSize])

  // Copy bracket to clipboard
  const handleDuplicate = useCallback(() => {
    const data = JSON.stringify(
      { teams, bracket, bestOf, connectorStyle, bracketSize },
      null,
      2
    )
    navigator.clipboard.writeText(data)
  }, [teams, bracket, bestOf, connectorStyle, bracketSize])

  return {
    // Core state
    teams,
    bracket,
    bestOf,
    setBestOf,
    connectorStyle,
    setConnectorStyle,
    selectedMatch,
    isPanelExpanded,
    bracketSize,

    // Undo/redo
    canUndo,
    canRedo,
    undo,
    redo,

    // Validation & stats
    validationErrors,
    scheduleConflicts,
    teamStats,
    quickScores,

    // Panel controls
    togglePanel,

    // Team management
    handleTeamNameChange,
    handleAddTeam,
    handleRemoveTeam,

    // Match management
    handleMatchClick,
    handleMatchUpdate,
    handleForfeit,
    handleSwapTeams,
    handleQuickScore,
    handleMatchNotesChange,
    handleMatchStreamUrlChange,
    handleMatchVenueChange,

    // Bracket management
    handleReset,
    handleShuffle,
    handleSeedByRank,
    handleBracketSizeChange,
    handleAutoSchedule,
    handleImport,
    handleExport,
    handleDuplicate,
  }
}
