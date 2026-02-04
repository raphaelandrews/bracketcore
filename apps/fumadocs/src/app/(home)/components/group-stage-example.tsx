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
        // ... (truncated matches for brevity if desired, but keeping all is fine for 4 teams)
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
  ],
};

export function GroupStageExample() {
  return (
    <div className="flex w-full overflow-auto p-4 justify-center">
      <GroupStage bracket={bracket} />
    </div>
  );
}
