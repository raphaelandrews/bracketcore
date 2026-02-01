"use client";

import { GroupStage, type GroupStageBracket, type Match } from "@bracketcore/registry";

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

const bracket: GroupStageBracket = {
  type: "group-stage",
  groups: [
    {
      name: "Group A",
      teams: [team("Team Liquid"), team("OG"), team("Evil Geniuses"), team("Team Secret")],
      matches: [
        m("ga-1", 0, 0, "Team Liquid", 2, "OG", 0, 3),
        m("ga-2", 0, 1, "Evil Geniuses", 2, "Team Secret", 1, 3),
        m("ga-3", 1, 0, "Team Liquid", 2, "Evil Geniuses", 1, 3),
        m("ga-4", 1, 1, "OG", 2, "Team Secret", 0, 3),
        m("ga-5", 2, 0, "Team Liquid", 2, "Team Secret", 0, 3),
        m("ga-6", 2, 1, "Evil Geniuses", 2, "OG", 1, 3),
      ],
      standings: [
        { team: team("Team Liquid"), wins: 3, losses: 0, draws: 0, points: 9, differential: 6 },
        { team: team("Evil Geniuses"), wins: 2, losses: 1, draws: 0, points: 6, differential: 2 },
        { team: team("OG"), wins: 1, losses: 2, draws: 0, points: 3, differential: -2 },
        { team: team("Team Secret"), wins: 0, losses: 3, draws: 0, points: 0, differential: -6 },
      ],
    },
    {
      name: "Group B",
      teams: [team("NaVi"), team("Virtus.pro"), team("LGD"), team("Invictus Gaming")],
      matches: [
        m("gb-1", 0, 0, "NaVi", 2, "Virtus.pro", 1, 3),
        m("gb-2", 0, 1, "LGD", 0, "Invictus Gaming", 2, 3),
        m("gb-3", 1, 0, "NaVi", 2, "LGD", 0, 3),
        m("gb-4", 1, 1, "Virtus.pro", 2, "Invictus Gaming", 1, 3),
        m("gb-5", 2, 0, "NaVi", 1, "Invictus Gaming", 2, 3),
        m("gb-6", 2, 1, "LGD", 2, "Virtus.pro", 1, 3),
      ],
      standings: [
        { team: team("NaVi"), wins: 2, losses: 1, draws: 0, points: 6, differential: 3 },
        { team: team("Invictus Gaming"), wins: 2, losses: 1, draws: 0, points: 6, differential: 1 },
        { team: team("Virtus.pro"), wins: 1, losses: 2, draws: 0, points: 3, differential: -1 },
        { team: team("LGD"), wins: 1, losses: 2, draws: 0, points: 3, differential: -3 },
      ],
    },
  ],
};

export function GroupStagePreview() {
  return (
    <div className="not-prose overflow-x-auto rounded-xl">
      <GroupStage bracket={bracket} />
    </div>
  );
}
