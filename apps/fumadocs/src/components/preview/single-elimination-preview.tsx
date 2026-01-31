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
  status: Match["status"] = "completed"
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
        makeMatch("qf-1", 0, 0, "Spirit", 2, "Falcons", 0, 3),
        makeMatch("qf-2", 0, 1, "Vitality", 2, "The MongolZ", 0, 3),
        makeMatch("qf-3", 0, 2, "FURIA", 1, "Natus Vincere", 2, 3),
        makeMatch("qf-4", 0, 3, "MOUZ", 0, "FaZe", 2, 3),
      ],
    },
    {
      name: "Semi-finals",
      matches: [
        makeMatch("sf-1", 1, 0, "Spirit", 0, "Vitality", 2, 3),
        makeMatch("sf-2", 1, 1, "Natus Vincere", 1, "FaZe", 2, 3),
      ],
    },
    {
      name: "Grand Final",
      matches: [makeMatch("gf", 2, 0, "Vitality", 3, "FaZe", 1, 5)],
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
