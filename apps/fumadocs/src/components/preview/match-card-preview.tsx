"use client";

import { MatchCard, type Match } from "@bracketcore/registry";

const completed: Match = {
  id: "demo-completed",
  round: 0,
  position: 0,
  bestOf: 3,
  status: "completed",
  teams: [
    {
      team: { id: "spirit", name: "Spirit" },
      score: 2,
      isWinner: true,
    },
    {
      team: { id: "falcons", name: "Falcons" },
      score: 0,
      isWinner: false,
    },
  ],
};

const live: Match = {
  id: "demo-live",
  round: 0,
  position: 0,
  bestOf: 5,
  status: "live",
  scheduledAt: "Live",
  teams: [
    {
      team: { id: "vitality", name: "Vitality" },
      score: 2,
    },
    {
      team: { id: "faze", name: "FaZe" },
      score: 1,
    },
  ],
};

const upcoming: Match = {
  id: "demo-upcoming",
  round: 0,
  position: 0,
  bestOf: 3,
  status: "upcoming",
  scheduledAt: "Aug 25, 18:00",
  teams: [
    {
      team: { id: "navi", name: "Natus Vincere" },
      score: 0,
    },
    {
      team: { id: "mouz", name: "MOUZ" },
      score: 0,
    },
  ],
};

const tbd: Match = {
  id: "demo-tbd",
  round: 0,
  position: 0,
  bestOf: 5,
  status: "upcoming",
  scheduledAt: "TBD",
  teams: [
    { team: null, score: 0 },
    { team: null, score: 0 },
  ],
};

export function MatchCardPreview() {
  return (
    <div className="not-prose flex flex-wrap gap-6 p-4 rounded-xl border border-fd-border">
      <div className="flex flex-col gap-2">
        <span className="text-xs text-fd-muted-foreground">Completed</span>
        <MatchCard match={completed} />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs text-fd-muted-foreground">Live</span>
        <MatchCard match={live} />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs text-fd-muted-foreground">Upcoming</span>
        <MatchCard match={upcoming} />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs text-fd-muted-foreground">TBD</span>
        <MatchCard match={tbd} />
      </div>
    </div>
  );
}
