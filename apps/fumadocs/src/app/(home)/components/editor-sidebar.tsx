"use client";

import * as React from "react";
import { CalendarIcon, MinusIcon, PlusIcon, XIcon } from "lucide-react";
import type { Match, MatchStatus, Team } from "@bracketcore/registry";
import { parse, format } from "date-fns";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/cn";

const statuses: { label: string; value: MatchStatus }[] = [
  { label: "Upcoming", value: "upcoming" },
  { label: "Live", value: "live" },
  { label: "Completed", value: "completed" },
];

interface EditorSidebarProps extends React.ComponentProps<typeof Sidebar> {
  teams: Team[];
  onTeamNameChange: (index: number, name: string) => void;
  bestOf: number;
  onBestOfChange: (bestOf: number) => void;
  connectorStyle: "default" | "simple";
  onConnectorStyleChange: (style: "default" | "simple") => void;
  selectedMatch: Match | null;
  onMatchUpdate: (match: Match) => void;
}

export function EditorSidebar({
  teams,
  onTeamNameChange,
  bestOf,
  onBestOfChange,
  connectorStyle,
  onConnectorStyleChange,
  selectedMatch,
  onMatchUpdate,
  ...props
}: EditorSidebarProps) {
  return (
    <Sidebar variant="floating" {...props}>
      <SidebarHeader>
        <div className="flex flex-col gap-0.5 px-2 py-1.5">
          <span className="font-semibold text-sm">Bracket Editor</span>
          <span className="text-xs text-muted-foreground">
            Click a match to edit
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Teams</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="flex flex-col gap-2 px-2">
              {teams.map((team, i) => (
                <div key={team.id} className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground w-4 shrink-0">
                    {i + 1}.
                  </span>
                  <Input
                    type="text"
                    value={team.name}
                    onChange={(e) => onTeamNameChange(i, e.target.value)}
                    className="h-7 text-sm"
                    aria-label={`Team ${i + 1} name`}
                  />
                </div>
              ))}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="flex flex-col gap-2 px-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Connector</span>
                <div className="flex gap-1">
                  <Button
                    size="xs"
                    variant={connectorStyle === "default" ? "default" : "outline"}
                    onClick={() => onConnectorStyleChange("default")}
                  >
                    Curved
                  </Button>
                  <Button
                    size="xs"
                    variant={connectorStyle === "simple" ? "default" : "outline"}
                    onClick={() => onConnectorStyleChange("simple")}
                  >
                    Straight
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Best of</span>
                <div className="flex gap-1">
                  {[1, 3, 5, 7].map((num) => (
                    <Button
                      key={num}
                      size="xs"
                      variant={bestOf === num ? "default" : "outline"}
                      onClick={() => onBestOfChange(num)}
                    >
                      {num}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <MatchEditorSection
          match={selectedMatch}
          onUpdate={onMatchUpdate}
          bestOf={bestOf}
        />
      </SidebarContent>
    </Sidebar>
  );
}

function MatchEditorSection({
  match,
  onUpdate,
  bestOf,
}: {
  match: Match | null;
  onUpdate: (match: Match) => void;
  bestOf: number;
}) {
  if (!match) {
    return (
      <SidebarGroup>
        <SidebarGroupLabel>Match</SidebarGroupLabel>
        <SidebarGroupContent>
          <p className="px-2 text-xs text-muted-foreground">
            Select a match to edit
          </p>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }

  const hasTeams = !!(match.teams[0].team && match.teams[1].team);
  const status = match.status ?? "upcoming";
  const effectiveBestOf = match.bestOf ?? bestOf;

  function setStatus(next: MatchStatus) {
    if (!match || !hasTeams) return;
    const updated = structuredClone(match);
    updated.status = next;

    if (next === "completed") {
      const [a, b] = updated.teams;
      if (a.score !== b.score) {
        a.isWinner = a.score > b.score;
        b.isWinner = b.score > a.score;
      } else {
        a.isWinner = false;
        b.isWinner = false;
      }
    } else {
      updated.teams[0].isWinner = false;
      updated.teams[1].isWinner = false;
    }

    onUpdate(updated);
  }

  function setScore(teamIndex: 0 | 1, delta: number) {
    if (!match || !hasTeams) return;

    // Validate score limits
    const currentScore = match.teams[teamIndex].score;
    const nextScore = currentScore + delta;

    if (nextScore < 0) return;

    const maxScore = Math.ceil(effectiveBestOf / 2);
    const otherScore = match.teams[teamIndex === 0 ? 1 : 0].score;

    // Prevent going over match point
    if (nextScore > maxScore) return;

    // Prevent total games > effectiveBestOf
    if (nextScore + otherScore > effectiveBestOf) return;

    const updated = structuredClone(match);
    updated.teams[teamIndex].score = nextScore;

    // Auto-complete if someone reaches max score
    if (nextScore === maxScore) {
      updated.status = "completed";
      const [a, b] = updated.teams;
      a.isWinner = a.score > b.score;
      b.isWinner = b.score > a.score;
    }

    // If game was completed and we reduce score below winning threshold, reopen it or adjust winner
    if (updated.status === "completed") {
      const [a, b] = updated.teams;
      if (a.score < maxScore && b.score < maxScore) {
        // Reset winner if no one has reached max score anymore
        if (a.score === b.score) {
          a.isWinner = false;
          b.isWinner = false;
        } else {
          a.isWinner = a.score > b.score;
          b.isWinner = b.score > a.score;
        }
      }
    }

    onUpdate(updated);
  }

  function toggleWinner(teamIndex: 0 | 1) {
    if (!match || match.status !== "completed" || !hasTeams) return;
    const updated = structuredClone(match);
    const otherIndex = teamIndex === 0 ? 1 : 0;
    const wasWinner = updated.teams[teamIndex].isWinner;
    updated.teams[teamIndex].isWinner = !wasWinner;
    updated.teams[otherIndex].isWinner = wasWinner;
    onUpdate(updated);
  }

  function setBestOf(value: number | undefined) {
    if (!match) return;
    const updated = structuredClone(match);
    updated.bestOf = value;

    // Reset scores when bestOf changes to avoid invalid states
    updated.teams[0].score = 0;
    updated.teams[1].score = 0;
    updated.teams[0].isWinner = false;
    updated.teams[1].isWinner = false;
    updated.status = "upcoming";

    onUpdate(updated);
  }

  // ScheduledAt helpers
  const scheduledDate = match.scheduledAt
    ? match.scheduledAt instanceof Date
      ? match.scheduledAt
      : new Date(match.scheduledAt)
    : undefined;

  function setScheduledDate(date: Date | undefined) {
    if (!match) return;
    const updated = structuredClone(match);

    if (date) {
      // Preserve time if modifying existing date, otherwise default to 12:00
      const nextTime = updated.scheduledAt
        ? (updated.scheduledAt instanceof Date ? updated.scheduledAt : new Date(updated.scheduledAt))
        : new Date();

      // If no previous time, default to 12:00 to avoid timezone edge cases on day boundaries
      if (!updated.scheduledAt) {
        nextTime.setHours(12, 0, 0, 0);
      }

      const newDate = new Date(date);
      newDate.setHours(nextTime.getHours(), nextTime.getMinutes(), 0, 0);
      updated.scheduledAt = newDate;
    } else {
      updated.scheduledAt = undefined;
    }
    onUpdate(updated);
  }

  function setScheduledTime(timeStr: string) {
    if (!match || !scheduledDate) return;
    const [hours, minutes] = timeStr.split(":").map(Number);
    const updated = structuredClone(match);
    const d = new Date(scheduledDate);
    d.setHours(hours, minutes);
    updated.scheduledAt = d;
    onUpdate(updated);
  }

  function clearScheduledAt() {
    if (!match) return;
    const updated = structuredClone(match);
    updated.scheduledAt = undefined;
    onUpdate(updated);
  }

  const bestOfOptions = [undefined, 1, 3, 5, 7] as const;

  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        {match.teams[0].team?.name ?? "TBD"} vs{" "}
        {match.teams[1].team?.name ?? "TBD"}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <div className="px-2 space-y-4">
          {!hasTeams && (
            <div className="rounded-md bg-muted p-2 text-xs text-muted-foreground text-center">
              Waiting for teams to be determined...
            </div>
          )}

          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground">Status</p>
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

          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground">
              Best of
            </p>
            <div className="flex gap-1">
              {bestOfOptions.map((bo) => (
                <Button
                  key={bo ?? "none"}
                  size="xs"
                  variant={match.bestOf === bo ? "default" : "outline"}
                  onClick={() => setBestOf(bo)}
                >
                  {bo ? `BO${bo}` : "Default"}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground">
              Scheduled
            </p>
            <div className="flex items-center gap-1">
              <Popover>
                <PopoverTrigger
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "w-full h-7 justify-start text-left font-normal text-xs px-2",
                    !match.scheduledAt && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-3 w-3" />
                  {scheduledDate ? (
                    scheduledDate.toLocaleString(undefined, {
                      year: 'numeric', month: 'numeric', day: 'numeric',
                      hour: 'numeric', minute: '2-digit'
                    })
                  ) : (
                    <span>Pick a date</span>
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

          {match.teams.map((mt, i) => (
            <div key={i} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{mt.team?.name ?? "TBD"}</p>
                {status === "completed" && (
                  <Button
                    size="xs"
                    variant={mt.isWinner ? "default" : "outline"}
                    onClick={() => toggleWinner(i as 0 | 1)}
                    disabled={!hasTeams}
                  >
                    {mt.isWinner ? "Winner" : "Loser"}
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="icon-xs"
                  variant="outline"
                  onClick={() => setScore(i as 0 | 1, -1)}
                  disabled={mt.score <= 0 || !hasTeams}
                >
                  <MinusIcon className="size-3" />
                </Button>
                <span className="w-8 text-center tabular-nums font-medium">
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
              </div>
            </div>
          ))}
        </div>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
