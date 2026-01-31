"use client";

import {
  DoubleElimination1,
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

const bracketRatio2: DoubleEliminationBracket = {
  type: "double-elimination",
  upper: [
    {
      name: "UB Round 1",
      matches: [
        m("r2-ub1-1", 0, 0, "Team Liquid", 2, "OG", 1, 3),
        m("r2-ub1-2", 0, 1, "PSG.LGD", 2, "Evil Geniuses", 0, 3),
        m("r2-ub1-3", 0, 2, "Tundra", 1, "Team Spirit", 2, 3),
        m("r2-ub1-4", 0, 3, "Gaimin Gladiators", 0, "BetBoom", 2, 3),
      ],
    },
    {
      name: "UB Semi-final",
      matches: [
        m("r2-ub2-1", 1, 0, "Team Liquid", 2, "PSG.LGD", 0, 3),
        m("r2-ub2-2", 1, 1, "Team Spirit", 1, "BetBoom", 2, 3),
      ],
    },
    {
      name: "UB Final",
      matches: [m("r2-ub3-1", 2, 0, "Team Liquid", 2, "BetBoom", 1, 3)],
    },
  ],
  lower: [
    {
      name: "LB Round 1",
      matches: [
        m("r2-lb1-1", 0, 0, "OG", 2, "Evil Geniuses", 1, 3),
        m("r2-lb1-2", 0, 1, "Tundra", 0, "Gaimin Gladiators", 2, 3),
        m("r2-lb1-3", 0, 2, "Alliance", 2, "Fnatic", 1, 3),
        m("r2-lb1-4", 0, 3, "Beastcoast", 0, "Thunder Awaken", 2, 3),
      ],
    },
    {
      name: "LB Round 2",
      matches: [
        m("r2-lb2-1", 1, 0, "OG", 0, "PSG.LGD", 2, 3),
        m("r2-lb2-2", 1, 1, "Gaimin Gladiators", 2, "Team Spirit", 0, 3),
        m("r2-lb2-3", 1, 2, "Alliance", 1, "Xtreme Gaming", 2, 3),
        m("r2-lb2-4", 1, 3, "Thunder Awaken", 2, "Talon", 0, 3),
      ],
    },
    {
      name: "LB Round 3",
      matches: [
        m("r2-lb3-1", 2, 0, "PSG.LGD", 2, "Gaimin Gladiators", 1, 3),
        m("r2-lb3-2", 2, 1, "Xtreme Gaming", 0, "Thunder Awaken", 2, 3),
      ],
    },
    {
      name: "LB Round 4",
      matches: [
        m("r2-lb4-1", 3, 0, "PSG.LGD", 2, "BetBoom", 1, 3),
        m("r2-lb4-2", 3, 1, "Thunder Awaken", 0, "Team Liquid", 2, 3),
      ],
    },
    {
      name: "LB Semi-final",
      matches: [m("r2-lb5-1", 4, 0, "PSG.LGD", 2, "Team Liquid", 1, 3)],
    },
    {
      name: "LB Final",
      matches: [m("r2-lb6-1", 5, 0, "PSG.LGD", 3, "BetBoom", 2, 5)],
    },
  ],
  grandFinal: m("r2-gf", 0, 0, "Team Liquid", 3, "PSG.LGD", 1, 5),
};

const bracketLBStartsEarlier: DoubleEliminationBracket = {
  type: "double-elimination",
  upper: [
    {
      name: "UB Round 1",
      matches: [
        m("ub1-1", 0, 0, "UB Team 1", 2, "UB Team 2", 1, 3), // Loser -> LB R2
        m("ub1-2", 0, 1, "UB Team 3", 2, "UB Team 4", 0, 3),
        m("ub1-3", 0, 2, "UB Team 5", 2, "UB Team 6", 0, 3),
        m("ub1-4", 0, 3, "UB Team 7", 2, "UB Team 8", 1, 3),
      ],
    },
    {
      name: "UB Round 2",
      matches: [
        m("ub2-1", 1, 0, "UB Team 1", 2, "UB Team 3", 1, 3), // Loser -> LB R4
        m("ub2-2", 1, 1, "UB Team 5", 0, "UB Team 7", 2, 3),
      ],
    },
    {
      name: "UB Final",
      matches: [m("ub3-1", 2, 0, "UB Team 1", 2, "UB Team 7", 1, 3)], // Loser -> LB Final
    },
  ],
  lower: [
    {
      name: "LB Round 1",
      matches: [
        m("lb1-1", 0, 0, "LB Team 1", 2, "LB Team 2", 0, 3), // Winner -> LB R2
        m("lb1-2", 0, 1, "LB Team 3", 2, "LB Team 4", 0, 3),
        m("lb1-3", 0, 2, "LB Team 5", 2, "LB Team 6", 0, 3),
        m("lb1-4", 0, 3, "LB Team 7", 2, "LB Team 8", 0, 3),
      ],
    },
    {
      name: "LB Round 2",
      matches: [
        // Winners from LB R1 vs Losers from UB R1
        m("lb2-1", 1, 0, "LB Team 1", 2, "UB Team 2", 1, 3),
        m("lb2-2", 1, 1, "LB Team 3", 2, "UB Team 4", 1, 3),
        m("lb2-3", 1, 2, "LB Team 5", 2, "UB Team 6", 1, 3),
        m("lb2-4", 1, 3, "LB Team 7", 2, "UB Team 8", 1, 3),
      ],
    },
    {
      name: "LB Round 3",
      matches: [
        m("lb3-1", 2, 0, "LB Team 1", 2, "LB Team 3", 1, 3),
        m("lb3-2", 2, 1, "LB Team 5", 2, "LB Team 7", 0, 3),
      ],
    },
    {
      name: "LB Round 4",
      matches: [
        // Winners from LB R3 vs Losers from UB R2
        m("lb4-1", 3, 0, "LB Team 1", 2, "UB Team 3", 1, 3),
        m("lb4-2", 3, 1, "LB Team 5", 2, "UB Team 5", 1, 3),
      ],
    },
    {
      name: "LB Semi-final",
      matches: [m("lb5-1", 4, 0, "LB Team 1", 2, "LB Team 5", 1, 3)],
    },
    {
      name: "LB Final",
      matches: [m("lb6-1", 5, 0, "LB Team 1", 3, "UB Team 7", 2, 5)],
    },
  ],
  grandFinal: m("gf", 0, 0, "UB Team 1", 3, "LB Team 1", 1, 5),
};

export function DoubleElimination1Preview() {
  return (
    <div className="not-prose overflow-x-auto rounded-xl border border-border">
      <DoubleElimination1 bracket={bracket} />
    </div>
  );
}

export function DoubleElimination1Ratio2() {
  return (
    <div className="not-prose overflow-x-auto rounded-xl border border-border">
      <DoubleElimination1 bracket={bracketRatio2} />
    </div>
  );
}

export function DoubleElimination1LBStartsEarlier() {
  return (
    <div className="not-prose overflow-x-auto rounded-xl border border-border">
      {/* Align UB Round 1 to LB Round 2 (index 1) */}
      <DoubleElimination1 bracket={bracketLBStartsEarlier} ubAlignToLBRound={1} />
    </div>
  );
}
