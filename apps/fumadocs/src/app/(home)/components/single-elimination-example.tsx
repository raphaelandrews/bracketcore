"use client";

import { SingleElimination, type SingleEliminationBracket, type Match } from "@bracketcore/registry";

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

const sampleBracket: SingleEliminationBracket = {
  type: "single-elimination",
  rounds: [
    {
      name: "Semi-finals",
      matches: [
        m("sf-1", 0, 0, "Team Liquid", 2, "Evil Geniuses", 0, 3),
        m("sf-2", 0, 1, "Virtus.pro", 1, "Invictus Gaming", 2, 3),
      ],
    },
    {
      name: "Grand Final",
      matches: [m("gf", 1, 0, "Team Liquid", 3, "Invictus Gaming", 1, 5)],
    },
  ],
};

export function SingleEliminationExample() {
  return (
    <div className="flex w-full overflow-auto p-4 justify-center">
      <SingleElimination bracket={sampleBracket} />
    </div>
  );
}
