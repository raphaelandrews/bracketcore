import type { SwissBracket, Match } from "./bracket-types";
import { MatchCard } from "./match-card";
import { cn } from "./cn";

export interface SwissStageProps {
  bracket: SwissBracket;
  className?: string;
  onMatchClick?: (match: Match) => void;
}

function StandingsTable({ bracket }: { bracket: SwissBracket }) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-border text-muted-foreground">
          <th className="text-left py-2 px-3 font-medium">#</th>
          <th className="text-left py-2 px-3 font-medium">Team</th>
          <th className="text-center py-2 px-3 font-medium">W</th>
          <th className="text-center py-2 px-3 font-medium">L</th>
          <th className="text-left py-2 px-3 font-medium">Status</th>
        </tr>
      </thead>
      <tbody>
        {bracket.standings.map((s, i) => (
          <tr key={s.team.id} className="border-b border-border last:border-0">
            <td className="py-2 px-3 text-muted-foreground">{i + 1}</td>
            <td className="py-2 px-3 flex items-center gap-2">
              {s.team.logo && (
                <img
                  src={s.team.logo}
                  alt={s.team.name}
                  className="h-4 w-4 object-contain"
                />
              )}
              <span className={cn(s.status === "eliminated" && "opacity-50")}>
                {s.team.name}
              </span>
            </td>
            <td className="py-2 px-3 text-center tabular-nums">{s.wins}</td>
            <td className="py-2 px-3 text-center tabular-nums">{s.losses}</td>
            <td className="py-2 px-3">
              {s.status === "advancing" && (
                <span className="text-emerald-500 text-xs font-medium">
                  Advanced
                </span>
              )}
              {s.status === "eliminated" && (
                <span className="text-red-500 text-xs font-medium">
                  Eliminated
                </span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function SwissStage({
  bracket,
  className,
  onMatchClick,
}: SwissStageProps) {
  return (
    <div className={cn("flex flex-col gap-8 p-4", className)}>
      <div className="flex gap-6 overflow-x-auto">
        {bracket.rounds.map((round) => (
          <div key={round.name} className="flex flex-col gap-2 min-w-fit">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                {round.name}
              </h3>
              {round.record && (
                <span className="text-xs text-muted-foreground/70">
                  {round.record}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-4">
              {round.matches.map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  onMatchClick={onMatchClick}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <section className="rounded border border-border bg-card">
        <h3 className="text-sm font-medium px-3 py-2 border-b border-border">
          Standings
        </h3>
        <StandingsTable bracket={bracket} />
      </section>
    </div>
  );
}
