import type { DoubleEliminationBracket, Match } from "@/bracketcore/bracket-types";
import { SingleElimination } from "@/bracketcore/single-elimination";
import { MatchCard } from "@/bracketcore/match-card";
import { cn } from "@/bracketcore/cn";

export interface DoubleEliminationProps {
  bracket: DoubleEliminationBracket;
  className?: string;
  onMatchClick?: (match: Match) => void;
}

export function DoubleElimination({
  bracket,
  className,
  onMatchClick,
}: DoubleEliminationProps) {
  return (
    <div className={cn("flex flex-col gap-8 overflow-x-auto p-4", className)}>
      <section>
        <h2 className="text-sm font-medium text-emerald-500 mb-4">
          Upper Bracket
        </h2>
        <SingleElimination
          bracket={{ type: "single-elimination", rounds: bracket.upper }}
          onMatchClick={onMatchClick}
          className="p-0"
        />
      </section>

      <section>
        <h2 className="text-sm font-medium text-red-500 mb-4">
          Lower Bracket
        </h2>
        <SingleElimination
          bracket={{ type: "single-elimination", rounds: bracket.lower }}
          onMatchClick={onMatchClick}
          className="p-0"
        />
      </section>

      <section>
        <h2 className="text-sm font-medium text-muted-foreground mb-4">
          Grand Final
        </h2>
        <MatchCard match={bracket.grandFinal} onMatchClick={onMatchClick} />
      </section>
    </div>
  );
}
