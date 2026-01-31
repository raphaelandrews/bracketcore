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
      teams: [team("Spirit"), team("Vitality"), team("Falcons"), team("FURIA")],
      matches: [
        m("ga-1", 0, 0, "Spirit", 2, "Falcons", 0, 3),
        m("ga-2", 0, 1, "Vitality", 2, "FURIA", 1, 3),
        m("ga-3", 1, 0, "Spirit", 2, "Vitality", 1, 3),
        m("ga-4", 1, 1, "Falcons", 2, "FURIA", 0, 3),
        m("ga-5", 2, 0, "Spirit", 2, "FURIA", 0, 3),
        m("ga-6", 2, 1, "Vitality", 2, "Falcons", 1, 3),
      ],
      standings: [
        { team: team("Spirit"), wins: 3, losses: 0, draws: 0, points: 9, differential: 6 },
        { team: team("Vitality"), wins: 2, losses: 1, draws: 0, points: 6, differential: 2 },
        { team: team("Falcons"), wins: 1, losses: 2, draws: 0, points: 3, differential: -2 },
        { team: team("FURIA"), wins: 0, losses: 3, draws: 0, points: 0, differential: -6 },
      ],
    },
    {
      name: "Group B",
      teams: [team("FaZe"), team("Natus Vincere"), team("MOUZ"), team("The MongolZ")],
      matches: [
        m("gb-1", 0, 0, "FaZe", 2, "MOUZ", 1, 3),
        m("gb-2", 0, 1, "Natus Vincere", 0, "The MongolZ", 2, 3),
        m("gb-3", 1, 0, "FaZe", 2, "Natus Vincere", 0, 3),
        m("gb-4", 1, 1, "MOUZ", 2, "The MongolZ", 1, 3),
        m("gb-5", 2, 0, "FaZe", 1, "The MongolZ", 2, 3),
        m("gb-6", 2, 1, "Natus Vincere", 2, "MOUZ", 1, 3),
      ],
      standings: [
        { team: team("FaZe"), wins: 2, losses: 1, draws: 0, points: 6, differential: 3 },
        { team: team("The MongolZ"), wins: 2, losses: 1, draws: 0, points: 6, differential: 1 },
        { team: team("Natus Vincere"), wins: 1, losses: 2, draws: 0, points: 3, differential: -3 },
        { team: team("MOUZ"), wins: 1, losses: 2, draws: 0, points: 3, differential: -1 },
      ],
    },
  ],
};

export function GroupStagePreview() {
  return (
    <div className="not-prose overflow-x-auto rounded-xl border border-border">
      <GroupStage bracket={bracket} />
    </div>
  );
}
