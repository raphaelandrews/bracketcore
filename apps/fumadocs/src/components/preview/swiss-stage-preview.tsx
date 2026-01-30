"use client";

import {
  SwissStage,
  type SwissBracket,
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

function team(name: string) {
  return { id: name.toLowerCase().replace(/\s+/g, "-"), name };
}

const bracket: SwissBracket = {
  type: "swiss",
  winsToAdvance: 3,
  lossesToEliminate: 3,
  rounds: [
    {
      name: "Round 1",
      record: "0-0",
      matches: [
        m("r1-1", 0, 0, "Spirit", 1, "Falcons", 0, 1),
        m("r1-2", 0, 1, "Vitality", 1, "MOUZ", 0, 1),
        m("r1-3", 0, 2, "FaZe", 1, "FURIA", 0, 1),
        m("r1-4", 0, 3, "Natus Vincere", 0, "The MongolZ", 1, 1),
      ],
    },
    {
      name: "Round 2",
      record: "1-0 / 0-1",
      matches: [
        m("r2-1", 1, 0, "Spirit", 1, "FaZe", 0, 1),
        m("r2-2", 1, 1, "Vitality", 0, "The MongolZ", 1, 1),
        m("r2-3", 1, 2, "Falcons", 1, "Natus Vincere", 0, 1),
        m("r2-4", 1, 3, "MOUZ", 1, "FURIA", 0, 1),
      ],
    },
    {
      name: "Round 3",
      record: "2-0 / 1-1 / 0-2",
      matches: [
        m("r3-1", 2, 0, "Spirit", 2, "The MongolZ", 1, 3),
        m("r3-2", 2, 1, "Falcons", 0, "Vitality", 2, 3),
        m("r3-3", 2, 2, "MOUZ", 2, "FaZe", 0, 3),
        m("r3-4", 2, 3, "Natus Vincere", 0, "FURIA", 2, 3),
      ],
    },
  ],
  standings: [
    { team: team("Spirit"), wins: 3, losses: 0, status: "advancing" },
    { team: team("Vitality"), wins: 2, losses: 1, status: "advancing" },
    { team: team("The MongolZ"), wins: 2, losses: 1, status: "advancing" },
    { team: team("MOUZ"), wins: 2, losses: 1, status: "pending" },
    { team: team("Falcons"), wins: 1, losses: 2, status: "pending" },
    { team: team("FaZe"), wins: 1, losses: 2, status: "pending" },
    { team: team("FURIA"), wins: 1, losses: 2, status: "eliminated" },
    { team: team("Natus Vincere"), wins: 0, losses: 3, status: "eliminated" },
  ],
};

export function SwissStagePreview() {
  return (
    <div className="not-prose overflow-x-auto rounded-xl border border-fd-border">
      <SwissStage bracket={bracket} />
    </div>
  );
}
