"use client";

import {
  DoubleElimination,
  type DoubleEliminationBracket,
  type Match,
} from "@bracketcore/registry";

function m(
  id: string,
  round: number,
  position: number,
  a: string,
  sa: number,
  b: string,
  sb: number,
  bo: number,
): Match {
  const aWins = sa > sb;
  return {
    id,
    round,
    position,
    bestOf: bo,
    status: "completed",
    teams: [
      {
        team: { id: a.toLowerCase().replace(/\s+/g, "-"), name: a },
        score: sa,
        isWinner: aWins,
      },
      {
        team: { id: b.toLowerCase().replace(/\s+/g, "-"), name: b },
        score: sb,
        isWinner: !aWins,
      },
    ],
  };
}

const bracket: DoubleEliminationBracket = {
  type: "double-elimination",
  upper: [
    {
      name: "UB Round 1",
      matches: [
        m("ub1-1", 0, 0, "Team A", 2, "Team B", 0, 3),
        m("ub1-2", 0, 1, "Team C", 2, "Team D", 1, 3),
      ],
    },
    {
      name: "UB Final",
      matches: [m("ub2-1", 1, 0, "Team A", 2, "Team C", 1, 3)],
    },
  ],
  lower: [
    {
      name: "LB Round 1",
      matches: [m("lb1-1", 0, 0, "Team B", 2, "Team D", 0, 3)],
    },
    {
      name: "LB Final",
      matches: [m("lb2-1", 1, 0, "Team C", 2, "Team B", 0, 3)],
    },
  ],
  grandFinal: m("gf", 0, 0, "Team A", 3, "Team C", 1, 5),
};

export function DoubleEliminationExample() {
  return (
    <div className="flex w-full overflow-auto p-4 justify-center">
      <DoubleElimination bracket={bracket} />
    </div>
  );
}
