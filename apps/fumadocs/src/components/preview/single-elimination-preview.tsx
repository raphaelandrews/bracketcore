"use client";

import {
  SingleElimination,
  type SingleEliminationBracket,
  type Match,
} from "@bracketcore/registry";

function makeMatch(
  id: string,
  round: number,
  position: number,
  nameA: string,
  scoreA: number,
  nameB: string,
  scoreB: number,
  bestOf: number,
  status: Match["status"] = "completed",
): Match {
  const aWins = scoreA > scoreB;
  const done = status === "completed";
  return {
    id,
    round,
    position,
    bestOf,
    status,
    teams: [
      {
        team: { id: nameA.toLowerCase().replace(/\s+/g, "-"), name: nameA },
        score: scoreA,
        isWinner: done ? aWins : undefined,
      },
      {
        team: { id: nameB.toLowerCase().replace(/\s+/g, "-"), name: nameB },
        score: scoreB,
        isWinner: done ? !aWins : undefined,
      },
    ],
  };
}

const sampleBracket: SingleEliminationBracket = {
  type: "single-elimination",
  rounds: [
    {
      name: "Quarter-finals",
      matches: [
        makeMatch("qf-1", 0, 0, "Team Liquid", 2, "OG", 0, 3), // Liquid
        makeMatch("qf-2", 0, 1, "Evil Geniuses", 2, "Team Secret", 0, 3), // EG
        makeMatch("qf-3", 0, 2, "NaVi", 1, "Virtus.pro", 2, 3), // VP
        makeMatch("qf-4", 0, 3, "LGD", 0, "Invictus Gaming", 2, 3), // IG
      ],
    },
    {
      name: "Semi-finals",
      matches: [
        makeMatch("sf-1", 1, 0, "Team Liquid", 0, "Evil Geniuses", 2, 3), // EG
        makeMatch("sf-2", 1, 1, "Virtus.pro", 1, "Invictus Gaming", 2, 3), // IG
      ],
    },
    {
      name: "Grand Final",
      matches: [makeMatch("gf", 2, 0, "Evil Geniuses", 3, "Invictus Gaming", 1, 5)], // EG
    },
  ],
};

export function SingleEliminationPreview() {
  return (
    <div className="not-prose overflow-x-auto rounded-xl border border-border">
      <SingleElimination bracket={sampleBracket} />
    </div>
  );
}

export function SingleEliminationSimplePreview() {
  return (
    <div className="not-prose overflow-x-auto rounded-xl border border-border">
      <SingleElimination bracket={sampleBracket} connectorStyle="simple" />
    </div>
  );
}
