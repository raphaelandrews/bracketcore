"use client"

import { CalendarIcon, MinusIcon, PlusIcon, XIcon } from "lucide-react"
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

const statuses: { label: string; value: MatchStatus }[] = [
  { label: "Upcoming", value: "upcoming" },
  { label: "Live", value: "live" },
  { label: "Completed", value: "completed" },
]

interface MatchEditorPanelProps {
  match: Match | null
  onUpdate: (match: Match) => void
  bestOf: number
}

export function MatchEditorPanel({ match, onUpdate, bestOf }: MatchEditorPanelProps) {
  if (!match) {
    return (
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">Match</p>
        <p className="text-xs text-muted-foreground">
          Click a match to edit
        </p>
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
    <div className="space-y-2">
      <p className="text-xs font-medium text-muted-foreground">
        {match.teams[0].team?.name ?? "TBD"} vs {match.teams[1].team?.name ?? "TBD"}
      </p>

      {!hasTeams && (
        <div className="rounded-md bg-muted p-2 text-xs text-muted-foreground text-center">
          Waiting for teams...
        </div>
      )}

      <div className="space-y-2">
        {/* Status */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground shrink-0">Status</span>
          <div className="flex gap-1">
            {statuses.map((s) => (
              <Button
                key={s.value}
                size="xs"
                variant={status === s.value ? "default" : "outline"}
                onClick={() => setStatus(s.value)}
                disabled={!hasTeams}
              >
                {s.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Scores */}
        <div className="flex items-center gap-4">
          {match.teams.map((mt, i) => (
            <div key={i} className="flex items-center gap-1">
              <span className="text-xs truncate max-w-16">{mt.team?.name ?? "TBD"}</span>
              <Button
                size="icon-xs"
                variant="outline"
                onClick={() => setScore(i as 0 | 1, -1)}
                disabled={mt.score <= 0 || !hasTeams}
              >
                <MinusIcon className="size-3" />
              </Button>
              <span className="w-6 text-center tabular-nums text-sm font-medium">
                {mt.score}
              </span>
              <Button
                size="icon-xs"
                variant="outline"
                onClick={() => setScore(i as 0 | 1, 1)}
                disabled={!hasTeams}
              >
                <PlusIcon className="size-3" />
              </Button>
              {status === "completed" && (
                <Button
                  size="xs"
                  variant={mt.isWinner ? "default" : "outline"}
                  onClick={() => toggleWinner(i as 0 | 1)}
                  disabled={!hasTeams}
                  className="ml-1"
                >
                  {mt.isWinner ? "W" : "L"}
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Best of and Schedule */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground">BO</span>
            {bestOfOptions.map((bo) => (
              <Button
                key={bo ?? "none"}
                size="xs"
                variant={match.bestOf === bo ? "default" : "outline"}
                onClick={() => setBestOfMatch(bo)}
              >
                {bo ?? "—"}
              </Button>
            ))}
          </div>

          <div className="flex items-center gap-1">
            <Popover>
              <PopoverTrigger
                className={cn(
                  buttonVariants({ variant: "outline", size: "xs" }),
                  "justify-start text-left font-normal",
                  !match.scheduledAt && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-1 h-3 w-3" />
                {scheduledDate ? (
                  scheduledDate.toLocaleString(undefined, {
                    month: 'numeric', day: 'numeric',
                    hour: 'numeric', minute: '2-digit'
                  })
                ) : (
                  <span>Schedule</span>
                )}
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
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
                variant="outline"
                onClick={clearScheduledAt}
              >
                <XIcon className="size-3" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
