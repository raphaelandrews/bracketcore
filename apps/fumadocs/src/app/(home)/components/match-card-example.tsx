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
      team: { id: "team-liquid", name: "Team Liquid" },
      score: 2,
      isWinner: true,
    },
    {
      team: { id: "og", name: "OG" },
      score: 0,
      isWinner: false,
    },
  ],
};

export function MatchCardExample() {
  return (
    <div className="flex w-full overflow-auto p-4 justify-center">
      <MatchCard match={completed} />
    </div>
  );
}
