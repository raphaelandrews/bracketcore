"use client";

import * as React from "react";
import { MinusIcon, PlusIcon, XIcon } from "lucide-react";
import type { Match, MatchStatus, Team } from "@bracketcore/registry";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarSeparator,
} from "@/components/ui/sidebar";

const statuses: { label: string; value: MatchStatus }[] = [
  { label: "Upcoming", value: "upcoming" },
  { label: "Live", value: "live" },
  { label: "Completed", value: "completed" },
];

interface EditorSidebarProps extends React.ComponentProps<typeof Sidebar> {
  teams: Team[];
  onTeamNameChange: (index: number, name: string) => void;
  connectorStyle: "default" | "simple";
  onConnectorStyleChange: (style: "default" | "simple") => void;
  selectedMatch: Match | null;
  onMatchUpdate: (match: Match) => void;
}

export function EditorSidebar({
  teams,
  onTeamNameChange,
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
                  <input
                    type="text"
                    value={team.name}
                    onChange={(e) => onTeamNameChange(i, e.target.value)}
                    className="h-7 w-full rounded-md border bg-transparent px-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                    aria-label={`Team ${i + 1} name`}
                  />
                </div>
              ))}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Connectors</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="flex gap-1 px-2">
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
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <MatchEditorSection match={selectedMatch} onUpdate={onMatchUpdate} />
      </SidebarContent>
    </Sidebar>
  );
}

function MatchEditorSection({
  match,
  onUpdate,
}: {
  match: Match | null;
  onUpdate: (match: Match) => void;
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

  const status = match.status ?? "upcoming";

  function setStatus(next: MatchStatus) {
    if (!match) return;
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
    if (!match) return;
    const updated = structuredClone(match);
    const newScore = updated.teams[teamIndex].score + delta;
    if (newScore < 0) return;
    updated.teams[teamIndex].score = newScore;

    if (updated.status === "completed") {
      const [a, b] = updated.teams;
      if (a.score !== b.score) {
        a.isWinner = a.score > b.score;
        b.isWinner = b.score > a.score;
      } else {
        a.isWinner = false;
        b.isWinner = false;
      }
    }

    onUpdate(updated);
  }

  function toggleWinner(teamIndex: 0 | 1) {
    if (!match || match.status !== "completed") return;
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
    onUpdate(updated);
  }

  function setScheduledAt(value: string) {
    if (!match) return;
    const updated = structuredClone(match);
    updated.scheduledAt = value ? new Date(value) : undefined;
    onUpdate(updated);
  }

  function clearScheduledAt() {
    if (!match) return;
    const updated = structuredClone(match);
    updated.scheduledAt = undefined;
    onUpdate(updated);
  }

  const bestOfOptions = [undefined, 1, 3, 5, 7] as const;

  const scheduledValue = match.scheduledAt
    ? (() => {
        const d =
          match.scheduledAt instanceof Date
            ? match.scheduledAt
            : new Date(match.scheduledAt);
        if (Number.isNaN(d.getTime())) return "";
        const pad = (n: number) => String(n).padStart(2, "0");
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
      })()
    : "";

  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        {match.teams[0].team?.name ?? "TBD"} vs{" "}
        {match.teams[1].team?.name ?? "TBD"}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <div className="px-2 space-y-4">
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground">Status</p>
            <div className="flex gap-1">
              {statuses.map((s) => (
                <Button
                  key={s.value}
                  size="xs"
                  variant={status === s.value ? "default" : "outline"}
                  onClick={() => setStatus(s.value)}
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
                  {bo ? `BO${bo}` : "None"}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground">
              Scheduled
            </p>
            <div className="flex items-center gap-1">
              <input
                type="datetime-local"
                value={scheduledValue}
                onChange={(e) => setScheduledAt(e.target.value)}
                className="h-7 w-full rounded-md border bg-transparent px-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
              />
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
                  disabled={mt.score <= 0}
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
