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
  winsToAdvance: 2,
  lossesToEliminate: 2,
  rounds: [
    {
      name: "Round 1",
      record: "0-0",
      matches: [
        m("r1-1", 0, 0, "Team Liquid", 1, "OG", 0, 1),
        m("r1-2", 0, 1, "Evil Geniuses", 0, "Team Secret", 1, 1),
      ],
    },
    {
      name: "Round 2",
      record: "1-0 / 0-1",
      matches: [
        m("r2-1", 1, 0, "Team Liquid", 1, "Team Secret", 0, 1), // 1-0 match
        m("r2-2", 1, 1, "OG", 1, "Evil Geniuses", 0, 1), // 0-1 match
      ],
    },
  ],
  standings: [
    { team: team("Team Liquid"), wins: 2, losses: 0, status: "advancing" },
    { team: team("Team Secret"), wins: 1, losses: 1, status: "pending" },
    { team: team("OG"), wins: 1, losses: 1, status: "pending" },
    { team: team("Evil Geniuses"), wins: 0, losses: 2, status: "eliminated" },
  ],
};

export function SwissStageExample() {
  return (
    <div className="flex w-full overflow-auto p-4 justify-center">
      <SwissStage bracket={bracket} />
    </div>
  );
}
