"use client"

import { CalendarIcon, MinusIcon, PlusIcon, XIcon, SwordsIcon, ClockIcon, PlayIcon, TrophyIcon } from "lucide-react"
import type { Match, MatchStatus } from "@bracketcore/registry"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/cn"

const statuses: { label: string; value: MatchStatus; icon: React.ReactNode; color: string }[] = [
  { label: "Upcoming", value: "upcoming", icon: <ClockIcon className="size-3" />, color: "text-muted-foreground" },
  { label: "Live", value: "live", icon: <PlayIcon className="size-3" />, color: "text-green-500" },
  { label: "Completed", value: "completed", icon: <TrophyIcon className="size-3" />, color: "text-primary" },
]

interface MatchEditorPanelProps {
  match: Match | null
  onUpdate: (match: Match) => void
  bestOf: number
}

export function MatchEditorPanel({ match, onUpdate, bestOf }: MatchEditorPanelProps) {
  if (!match) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center size-6 rounded-md bg-muted text-muted-foreground">
            <SwordsIcon className="size-3.5" />
          </div>
          <h3 className="text-sm font-medium text-muted-foreground">Match Editor</h3>
        </div>
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <div className="size-10 rounded-full bg-muted/50 flex items-center justify-center mb-3">
            <SwordsIcon className="size-5 text-muted-foreground/50" />
          </div>
          <p className="text-sm text-muted-foreground">
            Click a match to edit
          </p>
        </div>
      </div>
    )
  }

  const hasTeams = !!(match.teams[0].team && match.teams[1].team)
  const status = match.status ?? "upcoming"
  const effectiveBestOf = match.bestOf ?? bestOf

  function setStatus(next: MatchStatus) {
    if (!match || !hasTeams) return
    const updated = structuredClone(match)
    updated.status = next

    if (next === "completed") {
      const [a, b] = updated.teams
      if (a.score !== b.score) {
        a.isWinner = a.score > b.score
        b.isWinner = b.score > a.score
      } else {
        a.isWinner = false
        b.isWinner = false
      }
    } else {
      updated.teams[0].isWinner = false
      updated.teams[1].isWinner = false
    }

    onUpdate(updated)
  }

  function setScore(teamIndex: 0 | 1, delta: number) {
    if (!match || !hasTeams) return

    const currentScore = match.teams[teamIndex].score
    const nextScore = currentScore + delta

    if (nextScore < 0) return

    const maxScore = Math.ceil(effectiveBestOf / 2)
    const otherScore = match.teams[teamIndex === 0 ? 1 : 0].score

    if (nextScore > maxScore) return
    if (nextScore + otherScore > effectiveBestOf) return

    const updated = structuredClone(match)
    updated.teams[teamIndex].score = nextScore

    if (nextScore === maxScore) {
      updated.status = "completed"
      const [a, b] = updated.teams
      a.isWinner = a.score > b.score
      b.isWinner = b.score > a.score
    }

    if (updated.status === "completed") {
      const [a, b] = updated.teams
      if (a.score < maxScore && b.score < maxScore) {
        if (a.score === b.score) {
          a.isWinner = false
          b.isWinner = false
        } else {
          a.isWinner = a.score > b.score
          b.isWinner = b.score > a.score
        }
      }
    }

    onUpdate(updated)
  }

  function toggleWinner(teamIndex: 0 | 1) {
    if (!match || match.status !== "completed" || !hasTeams) return
    const updated = structuredClone(match)
    const otherIndex = teamIndex === 0 ? 1 : 0
    const wasWinner = updated.teams[teamIndex].isWinner
    updated.teams[teamIndex].isWinner = !wasWinner
    updated.teams[otherIndex].isWinner = wasWinner
    onUpdate(updated)
  }

  function setBestOfMatch(value: number | undefined) {
    if (!match) return
    const updated = structuredClone(match)
    updated.bestOf = value
    updated.teams[0].score = 0
    updated.teams[1].score = 0
    updated.teams[0].isWinner = false
    updated.teams[1].isWinner = false
    updated.status = "upcoming"
    onUpdate(updated)
  }

  const scheduledDate = match.scheduledAt
    ? match.scheduledAt instanceof Date
      ? match.scheduledAt
      : new Date(match.scheduledAt)
    : undefined

  function setScheduledDate(date: Date | undefined) {
    if (!match) return
    const updated = structuredClone(match)

    if (date) {
      const nextTime = updated.scheduledAt
        ? (updated.scheduledAt instanceof Date ? updated.scheduledAt : new Date(updated.scheduledAt))
        : new Date()

      if (!updated.scheduledAt) {
        nextTime.setHours(12, 0, 0, 0)
      }

      const newDate = new Date(date)
      newDate.setHours(nextTime.getHours(), nextTime.getMinutes(), 0, 0)
      updated.scheduledAt = newDate
    } else {
      updated.scheduledAt = undefined
    }
    onUpdate(updated)
  }

  function setScheduledTime(timeStr: string) {
    if (!match || !scheduledDate) return
    const [hours, minutes] = timeStr.split(":").map(Number)
    const updated = structuredClone(match)
    const d = new Date(scheduledDate)
    d.setHours(hours, minutes)
    updated.scheduledAt = d
    onUpdate(updated)
  }

  function clearScheduledAt() {
    if (!match) return
    const updated = structuredClone(match)
    updated.scheduledAt = undefined
    onUpdate(updated)
  }

  const bestOfOptions = [undefined, 1, 3, 5, 7] as const

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center size-6 rounded-md bg-primary/10 text-primary">
          <SwordsIcon className="size-3.5" />
        </div>
        <h3 className="text-sm font-medium truncate">
          {match.teams[0].team?.name ?? "TBD"} vs {match.teams[1].team?.name ?? "TBD"}
        </h3>
      </div>

      {!hasTeams ? (
        <div className="rounded-md bg-muted/50 border border-dashed p-4 text-center">
          <ClockIcon className="size-5 text-muted-foreground mx-auto mb-2" />
          <p className="text-xs text-muted-foreground">
            Waiting for teams to be determined
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Status */}
          <div className="space-y-1.5">
            <span className="text-xs text-muted-foreground">Status</span>
            <div className="flex rounded-lg border bg-muted/50 p-0.5">
              {statuses.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setStatus(s.value)}
                  disabled={!hasTeams}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 text-xs font-medium rounded-md transition-all",
                    status === s.value
                      ? "bg-background shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                    status === s.value && s.color
                  )}
                >
                  {s.icon}
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Scores */}
          <div className="space-y-1.5">
            <span className="text-xs text-muted-foreground">Score</span>
            <div className="flex items-center gap-3">
              {match.teams.map((mt, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex-1 flex items-center gap-2 p-2 rounded-lg border transition-colors",
                    mt.isWinner && status === "completed" && "bg-primary/5 border-primary/30"
                  )}
                >
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "text-xs font-medium truncate",
                      mt.isWinner && status === "completed" && "text-primary"
                    )}>
                      {mt.team?.name ?? "TBD"}
                    </p>
                    {status === "completed" && (
                      <p className="text-[10px] text-muted-foreground">
                        {mt.isWinner ? "Winner" : ""}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      size="icon-xs"
                      variant="ghost"
                      onClick={() => setScore(i as 0 | 1, -1)}
                      disabled={mt.score <= 0 || !hasTeams}
                      className="size-6"
                    >
                      <MinusIcon className="size-3" />
                    </Button>
                    <span className={cn(
                      "w-8 text-center tabular-nums text-lg font-semibold",
                      mt.isWinner && status === "completed" && "text-primary"
                    )}>
                      {mt.score}
                    </span>
                    <Button
                      size="icon-xs"
                      variant="ghost"
                      onClick={() => setScore(i as 0 | 1, 1)}
                      disabled={!hasTeams}
                      className="size-6"
                    >
                      <PlusIcon className="size-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Best Of Override & Schedule */}
          <div className="flex items-start gap-3">
            {/* Best Of Override */}
            <div className="space-y-1.5 flex-1">
              <span className="text-xs text-muted-foreground">Override BO</span>
              <div className="flex rounded-md border bg-muted/50 p-0.5">
                {bestOfOptions.map((bo) => (
                  <button
                    key={bo ?? "none"}
                    onClick={() => setBestOfMatch(bo)}
                    className={cn(
                      "flex-1 px-2 py-1 text-xs font-medium rounded transition-all",
                      match.bestOf === bo
                        ? "bg-background shadow-sm text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {bo ? `${bo}` : "—"}
                  </button>
                ))}
              </div>
            </div>

            {/* Schedule */}
            <div className="space-y-1.5">
              <span className="text-xs text-muted-foreground">Schedule</span>
              <div className="flex items-center gap-1">
                <Popover>
                  <PopoverTrigger
                    className={cn(
                      buttonVariants({ variant: "outline", size: "sm" }),
                      "h-8 justify-start text-left font-normal text-xs",
                      !match.scheduledAt && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-1.5 size-3" />
                    {scheduledDate ? (
                      scheduledDate.toLocaleString(undefined, {
                        month: 'short', day: 'numeric',
                        hour: 'numeric', minute: '2-digit'
                      })
                    ) : (
                      <span>Set time</span>
                    )}
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                      mode="single"
                      selected={scheduledDate}
                      onSelect={setScheduledDate}
                      initialFocus
                    />
                    <div className="p-3 border-t">
                      <Input
                        type="time"
                        className="text-sm"
                        value={scheduledDate ? `${String(scheduledDate.getHours()).padStart(2, '0')}:${String(scheduledDate.getMinutes()).padStart(2, '0')}` : ""}
                        onChange={(e) => setScheduledTime(e.target.value)}
                        disabled={!scheduledDate}
                      />
                    </div>
                  </PopoverContent>
                </Popover>
                {match.scheduledAt && (
                  <Button
                    size="icon-xs"
                    variant="ghost"
                    onClick={clearScheduledAt}
                    className="size-8"
                  >
                    <XIcon className="size-3" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
