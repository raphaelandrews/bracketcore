import type { Round } from "../types";
import { MatchCard, type MatchCardProps } from "./match-card";
import { cn } from "../lib/cn";

export interface RoundColumnProps {
  round: Round;
  className?: string;
  matchProps?: Partial<Omit<MatchCardProps, "match">>;
}

export function RoundColumn({ round, className, matchProps }: RoundColumnProps) {
  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <h3 className="text-sm font-medium text-muted-foreground whitespace-nowrap">
        {round.name}
      </h3>
      <div className="flex flex-col justify-around gap-6 flex-1">
        {round.matches.map((match) => (
          <MatchCard key={match.id} match={match} {...matchProps} />
        ))}
      </div>
    </div>
  );
}
