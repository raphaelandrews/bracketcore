"use client";

import { MatchCard } from "@bracketcore/registry";

export function MatchCardExample() {
  return (
    <div className="flex justify-center p-4">
      <MatchCard
        match={{
          id: "1",
          round: 1,
          position: 1,
          scheduledAt: "2024-02-23",
          status: "completed",
          teams: [
            {
              score: 3,
              isWinner: true,
              team: {
                id: "1",
                name: "Team A"
              }
            },
            {
              score: 1,
              isWinner: false,
              team: {
                id: "2",
                name: "Team B"
              }
            },
          ],
        }}
        onMatchClick={() => { }}
      />
    </div>
  );
}
