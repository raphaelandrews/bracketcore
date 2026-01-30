"use client";

import {
  SingleElimination,
  type SingleEliminationBracket,
  type Match,
} from "@bracketcore/registry";

const bracket: SingleEliminationBracket = {
  type: "single-elimination",
  rounds: [
    {
      name: "Quarter-finals",
      matches: [
        match("qf-1", 0, 0, "Spirit", 2, "Falcons", 0, "BO3"),
        match("qf-2", 0, 1, "Vitality", 2, "The MongolZ", 0, "BO3"),
        match("qf-3", 0, 2, "FURIA", 1, "Natus Vincere", 2, "BO3"),
        match("qf-4", 0, 3, "MOUZ", 0, "FaZe", 2, "BO3"),
      ],
    },
    {
      name: "Semi-finals",
      matches: [
        match("sf-1", 1, 0, "Spirit", 0, "Vitality", 2, "BO3"),
        match("sf-2", 1, 1, "Natus Vincere", 1, "FaZe", 2, "BO3"),
      ],
    },
    {
      name: "Grand Final",
      matches: [
        match("gf", 2, 0, "Vitality", 3, "FaZe", 1, "BO5"),
      ],
    },
  ],
};

function match(
  id: string,
  round: number,
  position: number,
  nameA: string,
  scoreA: number,
  nameB: string,
  scoreB: number,
  bestOf: string
): Match {
  const aWins = scoreA > scoreB;
  return {
    id,
    round,
    position,
    bestOf: Number(bestOf.replace("BO", "")),
    status: "completed",
    teams: [
      {
        team: { id: nameA.toLowerCase().replace(/\s+/g, "-"), name: nameA },
        score: scoreA,
        isWinner: aWins,
      },
      {
        team: { id: nameB.toLowerCase().replace(/\s+/g, "-"), name: nameB },
        score: scoreB,
        isWinner: !aWins,
      },
    ],
  };
}

export function SingleEliminationDemo() {
  return (
    <div className="rounded-xl border border-fd-border overflow-x-auto">
      <SingleElimination
        bracket={bracket}
        onMatchClick={(m: Match) =>
          console.log("clicked", m.id, m.teams[0].team?.name, "vs", m.teams[1].team?.name)
        }
      />
    </div>
  );
}
