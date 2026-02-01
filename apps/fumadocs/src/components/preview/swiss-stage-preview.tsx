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
  bo: number = 1
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
      matches: [
        m("r1-1", 0, 0, "Natus Vincere", 13, "SAW", 8),
        m("r1-2", 0, 1, "Vitality", 13, "paiN Gaming", 10),
        m("r1-3", 0, 2, "G2 Esports", 13, "Imperial", 11),
        m("r1-4", 0, 3, "FaZe Clan", 13, "The MongolZ", 10),
        m("r1-5", 0, 4, "Team Spirit", 13, "Complexity", 7),
        m("r1-6", 0, 5, "MOUZ", 13, "FURIA", 11),
        m("r1-7", 0, 6, "Virtus.pro", 13, "Astralis", 9),
        m("r1-8", 0, 7, "Heroic", 13, "Eternal Fire", 11),
      ],
    },
    {
      name: "Round 2",
      matches: [
        // 1-0 Pool
        m("r2-1", 1, 0, "Natus Vincere", 13, "Vitality", 9),
        m("r2-2", 1, 1, "G2 Esports", 13, "FaZe Clan", 10),
        m("r2-3", 1, 2, "Team Spirit", 13, "MOUZ", 7),
        m("r2-4", 1, 3, "Virtus.pro", 13, "Heroic", 11),
        // 0-1 Pool
        m("r2-5", 1, 4, "paiN Gaming", 13, "SAW", 8),
        m("r2-6", 1, 5, "The MongolZ", 13, "Imperial", 9),
        m("r2-7", 1, 6, "FURIA", 13, "Complexity", 7),
        m("r2-8", 1, 7, "Eternal Fire", 13, "Astralis", 9),
      ],
    },
    {
      name: "Round 3",
      matches: [
        // 2-0 Pool (Qualifiers) - BO3 commonly but let's do BO3
        m("r3-1", 2, 0, "Natus Vincere", 2, "G2 Esports", 1, 3),
        m("r3-2", 2, 1, "Team Spirit", 2, "Virtus.pro", 0, 3),
        // 1-1 Pool
        m("r3-3", 2, 2, "Vitality", 13, "FaZe Clan", 11),
        m("r3-4", 2, 3, "MOUZ", 13, "Heroic", 9),
        m("r3-5", 2, 4, "paiN Gaming", 13, "The MongolZ", 10),
        m("r3-6", 2, 5, "FURIA", 13, "Eternal Fire", 11),
        // 0-2 Pool (Elimination)
        m("r3-7", 2, 6, "Imperial", 2, "SAW", 0, 3),
        m("r3-8", 2, 7, "Astralis", 2, "Complexity", 0, 3),
      ],
    },
    {
      name: "Round 4",
      matches: [
        // 2-1 Pool (Qualifiers)
        m("r4-1", 3, 0, "G2 Esports", 2, "Virtus.pro", 1, 3),
        m("r4-2", 3, 1, "Vitality", 2, "MOUZ", 0, 3),
        m("r4-3", 3, 2, "paiN Gaming", 2, "FURIA", 1, 3),
        // 1-2 Pool (Elimination)
        m("r4-4", 3, 3, "FaZe Clan", 2, "Heroic", 1, 3),
        m("r4-5", 3, 4, "The MongolZ", 2, "Eternal Fire", 0, 3),
        m("r4-6", 3, 5, "Imperial", 2, "Astralis", 1, 3),
      ],
    },
    {
      name: "Round 5",
      matches: [
        // 2-2 Pool (Final/Decider)
        m("r5-1", 4, 0, "Virtus.pro", 2, "MOUZ", 1, 3),
        m("r5-2", 4, 1, "FaZe Clan", 2, "FURIA", 1, 3),
        m("r5-3", 4, 2, "The MongolZ", 2, "Imperial", 1, 3),
      ],
    },
  ],
  standings: [
    // 3-0 Qualified
    { team: team("Natus Vincere"), wins: 3, losses: 0, status: "advancing" },
    { team: team("Team Spirit"), wins: 3, losses: 0, status: "advancing" },
    // 3-1 Qualified
    { team: team("G2 Esports"), wins: 3, losses: 1, status: "advancing" },
    { team: team("Vitality"), wins: 3, losses: 1, status: "advancing" },
    { team: team("paiN Gaming"), wins: 3, losses: 1, status: "advancing" },
    // 3-2 Qualified
    { team: team("Virtus.pro"), wins: 3, losses: 2, status: "advancing" },
    { team: team("FaZe Clan"), wins: 3, losses: 2, status: "advancing" },
    { team: team("The MongolZ"), wins: 3, losses: 2, status: "advancing" },
    // 2-3 Eliminated
    { team: team("MOUZ"), wins: 2, losses: 3, status: "eliminated" },
    { team: team("FURIA"), wins: 2, losses: 3, status: "eliminated" },
    { team: team("Imperial"), wins: 2, losses: 3, status: "eliminated" },
    // 1-3 Eliminated
    { team: team("Heroic"), wins: 1, losses: 3, status: "eliminated" },
    { team: team("Eternal Fire"), wins: 1, losses: 3, status: "eliminated" },
    { team: team("Astralis"), wins: 1, losses: 3, status: "eliminated" },
    // 0-3 Eliminated
    { team: team("SAW"), wins: 0, losses: 3, status: "eliminated" },
    { team: team("Complexity"), wins: 0, losses: 3, status: "eliminated" },
  ],
};

export function SwissStagePreview() {
  return (
    <div className="not-prose overflow-x-auto rounded-xl">
      <SwissStage bracket={bracket} />
    </div>
  );
}
