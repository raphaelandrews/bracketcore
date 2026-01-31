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
  bo: number
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
        m("ub1-1", 0, 0, "Spirit", 2, "Falcons", 0, 3),
        m("ub1-2", 0, 1, "Vitality", 2, "The MongolZ", 1, 3),
        m("ub1-3", 0, 2, "FURIA", 0, "Natus Vincere", 2, 3),
        m("ub1-4", 0, 3, "MOUZ", 1, "FaZe", 2, 3),
      ],
    },
    {
      name: "UB Semi-final",
      matches: [
        m("ub2-1", 1, 0, "Spirit", 2, "Vitality", 1, 3),
        m("ub2-2", 1, 1, "Natus Vincere", 0, "FaZe", 2, 3),
      ],
    },
    {
      name: "UB Final",
      matches: [m("ub3-1", 2, 0, "Spirit", 2, "FaZe", 1, 3)],
    },
  ],
  lower: [
    {
      name: "LB Round 1",
      matches: [
        m("lb1-1", 0, 0, "Falcons", 2, "The MongolZ", 0, 3),
        m("lb1-2", 0, 1, "FURIA", 1, "MOUZ", 2, 3),
      ],
    },
    {
      name: "LB Round 2",
      matches: [
        m("lb2-1", 1, 0, "Vitality", 2, "Falcons", 1, 3),
        m("lb2-2", 1, 1, "Natus Vincere", 2, "MOUZ", 0, 3),
      ],
    },
    {
      name: "LB Semi-final",
      matches: [m("lb3-1", 2, 0, "Vitality", 2, "Natus Vincere", 1, 3)],
    },
    {
      name: "LB Final",
      matches: [m("lb4-1", 3, 0, "FaZe", 2, "Vitality", 1, 3)],
    },
  ],
  grandFinal: m("gf", 0, 0, "Spirit", 3, "FaZe", 2, 5),
};

export function DoubleEliminationPreview() {
  return (
    <div className="not-prose overflow-x-auto rounded-xl border border-border">
      <DoubleElimination bracket={bracket} />
    </div>
  );
}
