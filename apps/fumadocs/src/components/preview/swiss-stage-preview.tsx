"use client";

import { SwissStage, type SwissBracket, type Match } from "@bracketcore/registry";

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
        m("r1-1", 0, 0, "Team Liquid", 1, "OG", 0, 1),
        m("r1-2", 0, 1, "Evil Geniuses", 1, "Team Secret", 0, 1),
        m("r1-3", 0, 2, "NaVi", 1, "Virtus.pro", 0, 1),
        m("r1-4", 0, 3, "LGD", 0, "Invictus Gaming", 1, 1),
      ],
    },
    {
      name: "Round 2",
      record: "1-0 / 0-1",
      matches: [
        m("r2-1", 1, 0, "Team Liquid", 1, "NaVi", 0, 1),
        m("r2-2", 1, 1, "Evil Geniuses", 0, "Invictus Gaming", 1, 1),
        m("r2-3", 1, 2, "OG", 1, "LGD", 0, 1),
        m("r2-4", 1, 3, "Team Secret", 1, "Virtus.pro", 0, 1),
      ],
    },
    {
      name: "Round 3",
      record: "2-0 / 1-1 / 0-2",
      matches: [
        m("r3-1", 2, 0, "Team Liquid", 2, "Invictus Gaming", 1, 3),
        m("r3-2", 2, 1, "OG", 0, "Evil Geniuses", 2, 3),
        m("r3-3", 2, 2, "Team Secret", 2, "NaVi", 0, 3),
        m("r3-4", 2, 3, "LGD", 0, "Virtus.pro", 2, 3),
      ],
    },
  ],
  standings: [
    { team: team("Team Liquid"), wins: 3, losses: 0, status: "advancing" },
    { team: team("Evil Geniuses"), wins: 2, losses: 1, status: "advancing" },
    { team: team("Invictus Gaming"), wins: 2, losses: 1, status: "advancing" },
    { team: team("Team Secret"), wins: 2, losses: 1, status: "pending" },
    { team: team("OG"), wins: 1, losses: 2, status: "pending" },
    { team: team("NaVi"), wins: 1, losses: 2, status: "pending" },
    { team: team("Virtus.pro"), wins: 1, losses: 2, status: "eliminated" },
    { team: team("LGD"), wins: 0, losses: 3, status: "eliminated" },
  ],
};

export function SwissStagePreview() {
  return (
    <div className="not-prose overflow-x-auto rounded-xl border border-border">
      <SwissStage bracket={bracket} />
    </div>
  );
}
