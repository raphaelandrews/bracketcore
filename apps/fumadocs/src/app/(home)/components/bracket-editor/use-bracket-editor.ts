"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
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
  { id: "t1", name: "Team Spirit", seed: 1 },
  { id: "t2", name: "Gaimin Gladiators", seed: 2 },
  { id: "t3", name: "Team Liquid", seed: 3 },
  { id: "t4", name: "LGD Gaming", seed: 4 },
  { id: "t5", name: "Team Secret", seed: 5 },
  { id: "t6", name: "OG", seed: 6 },
  { id: "t7", name: "BetBoom Team", seed: 7 },
  { id: "t8", name: "Team Falcons", seed: 8 },
  { id: "t9", name: "Xtreme Gaming", seed: 9 },
  { id: "t10", name: "Azure Ray", seed: 10 },
  { id: "t11", name: "Tundra Esports", seed: 11 },
  { id: "t12", name: "Shopify Rebellion", seed: 12 },
  { id: "t13", name: "Nigma Galaxy", seed: 13 },
  { id: "t14", name: "Evil Geniuses", seed: 14 },
  { id: "t15", name: "Team DK", seed: 15 },
  { id: "t16", name: "Execration", seed: 16 },
  { id: "t17", name: "Alliance", seed: 17 },
  { id: "t18", name: "Mineski", seed: 18 },
  { id: "t19", name: "Team Aster", seed: 19 },
  { id: "t20", name: "EHOME", seed: 20 },
  { id: "t21", name: "Vici Gaming", seed: 21 },
  { id: "t22", name: "Invictus Gaming", seed: 22 },
  { id: "t23", name: "Wings Gaming", seed: 23 },
  { id: "t24", name: "Newbee", seed: 24 },
  { id: "t25", name: "TNC Predator", seed: 25 },
  { id: "t26", name: "MVP Phoenix", seed: 26 },
  { id: "t27", name: "Digital Chaos", seed: 27 },
  { id: "t28", name: "CDEC Gaming", seed: 28 },
  { id: "t29", name: "Royal Never Give Up", seed: 29 },
  { id: "t30", name: "Quincy Crew", seed: 30 },
  { id: "t31", name: "beastcoast", seed: 31 },
  { id: "t32", name: "Entity", seed: 32 },
  { id: "t33", name: "FaZe Clan", seed: 33 },
  { id: "t34", name: "Natus Vincere", seed: 34 },
  { id: "t35", name: "Team Vitality", seed: 35 },
  { id: "t36", name: "G2 Esports", seed: 36 },
  { id: "t37", name: "MOUZ", seed: 37 },
  { id: "t38", name: "Monte", seed: 38 },
  { id: "t39", name: "Virtus.pro", seed: 39 },
  { id: "t40", name: "Cloud9", seed: 40 },
  { id: "t41", name: "Astralis", seed: 41 },
  { id: "t42", name: "Heroic", seed: 42 },
  { id: "t43", name: "Eternal Fire", seed: 43 },
  { id: "t44", name: "Complexity", seed: 44 },
  { id: "t45", name: "FURIA Esports", seed: 45 },
  { id: "t46", name: "The MongolZ", seed: 46 },
  { id: "t47", name: "BIG", seed: 47 },
  { id: "t48", name: "MIBR", seed: 48 },
  { id: "t49", name: "Fnatic", seed: 49 },
  { id: "t50", name: "Ninjas in Pyjamas", seed: 50 },
  { id: "t51", name: "ENCE", seed: 51 },
  { id: "t52", name: "Gambit Esports", seed: 52 },
  { id: "t53", name: "SK Gaming", seed: 53 },
  { id: "t54", name: "Luminosity Gaming", seed: 54 },
  { id: "t55", name: "Team Envy", seed: 55 },
  { id: "t56", name: "100 Thieves", seed: 56 },
  { id: "t57", name: "NRG Esports", seed: 57 },
  { id: "t58", name: "North", seed: 58 },
  { id: "t59", name: "GODSENT", seed: 59 },
  { id: "t60", name: "Dignitas", seed: 60 },
  { id: "t61", name: "VeryGames", seed: 61 },
  { id: "t62", name: "TITAN", seed: 62 },
  { id: "t63", name: "iBUYPOWER", seed: 63 },
  { id: "t64", name: "OpTic Gaming", seed: 64 },
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

function getRandomTeams(count: number): Team[] {
  const shuffled = [...DEFAULT_TEAMS].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count).map((t, i) => ({ ...t, seed: i + 1 }))
}

export function useBracketEditor() {
  // Core state
  // Initialize with deterministic data for SSR/Hydration match
  const [teams, setTeams] = useState<Team[]>(() => DEFAULT_TEAMS.slice(0, 4))
  const [bracketSize, setBracketSize] = useState<BracketSize>(4)
  const [bracket, setBracket] = useState<DoubleEliminationBracket>(() =>
    buildBracketForSize(DEFAULT_TEAMS.slice(0, 4), 4),
  )

  // Randomize teams on client mount to satisfy user request
  useEffect(() => {
    const randomTeams = getRandomTeams(4)
    setTeams(randomTeams)
    setBracket(buildBracketForSize(randomTeams, 4))
  }, [])
  const [bestOf, setBestOf] = useState<number>(3)
  const [connectorStyle, setConnectorStyle] = useState<"default" | "simple">("default")
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null)
  const [isPanelExpanded, setIsPanelExpanded] = useState(true)

  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  const bracketFlow = useMemo(() => buildBracketFlow(bracketSize), [bracketSize])

  const validationErrors = useMemo(
    () => validateBracket(bracket, bestOf),
    [bracket, bestOf]
  )

  const scheduleConflicts = useMemo(
    () => detectConflicts(bracket),
    [bracket]
  )

  const teamStats = useMemo(
    () => computeTeamStats(bracket),
    [bracket]
  )

  const quickScores = useMemo(
    () => getQuickScores(selectedMatch?.bestOf ?? bestOf),
    [selectedMatch?.bestOf, bestOf]
  )

  const pushHistory = useCallback((newBracket: DoubleEliminationBracket, newTeams: Team[]) => {
    setHistory((prev) => {
      const newHistory = prev.slice(0, historyIndex + 1)
      newHistory.push({
        bracket: structuredClone(newBracket),
        teams: structuredClone(newTeams),
        timestamp: Date.now(),
      })
      return newHistory.slice(-MAX_HISTORY)
    })
    setHistoryIndex((prev) => Math.min(prev + 1, MAX_HISTORY - 1))
  }, [historyIndex])
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

  const handleTeamNameChange = useCallback((teamId: string, name: string) => {
    const newTeams = teams.map((t) =>
      t.id === teamId ? { ...t, name } : t
    )
    setTeams(newTeams)

    setBracket((prev) => {
      const b = structuredClone(prev)

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

    const effectiveBestOf = updated.bestOf ?? bestOf
    updated.teams[winningTeamIndex].score = Math.ceil(effectiveBestOf / 2)

    handleMatchUpdate(updated)
  }, [selectedMatch, bestOf, handleMatchUpdate])

  const handleSwapTeams = useCallback(() => {
    if (!selectedMatch) return
    const updated = structuredClone(selectedMatch)
    const [teamA, teamB] = updated.teams
    updated.teams = [teamB, teamA]
    handleMatchUpdate(updated)
  }, [selectedMatch, handleMatchUpdate])

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

  const handleReset = useCallback(() => {
    const newBracket = buildBracketForSize(teams, bracketSize)
    setBracket(newBracket)
    setBestOf(3)
    setSelectedMatch(null)
    pushHistory(newBracket, teams)
  }, [teams, bracketSize, pushHistory])

  const handleShuffle = useCallback(() => {
    const shuffled = [...teams].sort(() => Math.random() - 0.5)
    setTeams(shuffled)
    const newBracket = buildBracketForSize(shuffled, bracketSize)
    setBracket(newBracket)
    setSelectedMatch(null)
    pushHistory(newBracket, shuffled)
  }, [teams, bracketSize, pushHistory])

  const handleSeedByRank = useCallback(() => {
    const seeded = applySeeding(teams, bracketSize)
    setTeams(seeded)
    const newBracket = buildBracketForSize(seeded, bracketSize)
    setBracket(newBracket)
    setSelectedMatch(null)
    pushHistory(newBracket, seeded)
  }, [teams, bracketSize, pushHistory])

  const handleBracketSizeChange = useCallback((newSize: BracketSize) => {
    setBracketSize(newSize)

    let newTeams = [...teams]
    if (newTeams.length < newSize) {
      const existingIds = new Set(newTeams.map((t) => t.id))

      const availableTeams = DEFAULT_TEAMS.filter((t) => !existingIds.has(t.id))

      const shuffledAvailable = [...availableTeams].sort(() => Math.random() - 0.5)

      const neededCount = newSize - newTeams.length
      const teamsToAdd = shuffledAvailable.slice(0, neededCount)

      for (let i = 0; i < teamsToAdd.length; i++) {
        newTeams.push({
          ...teamsToAdd[i],
          seed: newTeams.length + 1,
        })
      }

      while (newTeams.length < newSize) {
        newTeams.push({
          id: `t${newTeams.length + 1}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          name: `Team ${newTeams.length + 1}`,
          seed: newTeams.length + 1,
        })
      }
    } else if (newTeams.length > newSize) {
      newTeams = newTeams.slice(0, newSize)
    }

    setTeams(newTeams)
    const newBracket = buildBracketForSize(newTeams, newSize)
    setBracket(newBracket)
    setSelectedMatch(null)
    pushHistory(newBracket, newTeams)
  }, [teams, pushHistory])

  const handleAddTeam = useCallback(() => {
    const existingIds = new Set(teams.map((t) => t.id))
    const availableTeams = DEFAULT_TEAMS.filter((t) => !existingIds.has(t.id))

    let newTeam: Team
    if (availableTeams.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableTeams.length)
      newTeam = {
        ...availableTeams[randomIndex],
        seed: teams.length + 1,
      }
    } else {
      newTeam = {
        id: `t${teams.length + 1}-${Date.now()}`,
        name: `Team ${teams.length + 1}`,
        seed: teams.length + 1,
      }
    }

    const newTeams = [...teams, newTeam]
    setTeams(newTeams)

    const newSize = Math.pow(2, Math.ceil(Math.log2(newTeams.length))) as BracketSize
    if (newSize !== bracketSize && [4, 8, 16, 32, 64].includes(newSize)) {
      setBracketSize(newSize as BracketSize)
      const teamsWithByes = fillWithByes(newTeams, newSize as BracketSize)
      let newBracket = buildBracketForSize(teamsWithByes, newSize as BracketSize)
      newBracket = handleByeAdvancement(newBracket)
      setBracket(newBracket)
      pushHistory(newBracket, newTeams)
    } else {
      const teamsWithByes = fillWithByes(newTeams, bracketSize)
      let newBracket = buildBracketForSize(teamsWithByes, bracketSize)
      newBracket = handleByeAdvancement(newBracket)
      setBracket(newBracket)
      pushHistory(newBracket, newTeams)
    }
  }, [teams, bracketSize, pushHistory])

  const handleRemoveTeam = useCallback((teamId: string) => {
    const newTeams = teams.filter((t) => t.id !== teamId)
    if (newTeams.length < 2) return

    setTeams(newTeams)

    const newSize = Math.pow(2, Math.ceil(Math.log2(Math.max(newTeams.length, 2)))) as BracketSize
    if (newSize !== bracketSize && [4, 8, 16, 32, 64].includes(newSize)) {
      setBracketSize(newSize as BracketSize)
    }

    const teamsWithByes = fillWithByes(newTeams, (newSize as BracketSize) || bracketSize)
    let newBracket = buildBracketForSize(teamsWithByes, (newSize as BracketSize) || bracketSize)
    newBracket = handleByeAdvancement(newBracket)
    setBracket(newBracket)
    setSelectedMatch(null)
    pushHistory(newBracket, newTeams)
  }, [teams, bracketSize, pushHistory])

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

  const handleDuplicate = useCallback(() => {
    const data = JSON.stringify(
      { teams, bracket, bestOf, connectorStyle, bracketSize },
      null,
      2
    )
    navigator.clipboard.writeText(data)
  }, [teams, bracket, bestOf, connectorStyle, bracketSize])

  return {
    teams,
    bracket,
    bestOf,
    setBestOf,
    connectorStyle,
    setConnectorStyle,
    selectedMatch,
    isPanelExpanded,
    bracketSize,

    canUndo,
    canRedo,
    undo,
    redo,

    validationErrors,
    scheduleConflicts,
    teamStats,
    quickScores,

    togglePanel,

    handleTeamNameChange,
    handleAddTeam,
    handleRemoveTeam,
    handleMatchClick,
    handleMatchUpdate,
    handleForfeit,
    handleSwapTeams,
    handleQuickScore,
    handleMatchNotesChange,
    handleMatchStreamUrlChange,
    handleMatchVenueChange,
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
