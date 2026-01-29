import type { SingleEliminationBracket, Match } from "@/bracketcore/bracket-types";
import { RoundColumn } from "@/bracketcore/round-column";
import { BracketConnector } from "@/bracketcore/bracket-connector";
import { cn } from "@/bracketcore/cn";

export interface SingleEliminationProps {
  bracket: SingleEliminationBracket;
  className?: string;
  onMatchClick?: (match: Match) => void;
}

export function SingleElimination({
  bracket,
  className,
  onMatchClick,
}: SingleEliminationProps) {
  return (
    <div className={cn("flex items-start gap-0 overflow-x-auto p-4", className)}>
      {bracket.rounds.map((round, i) => (
        <div key={round.name} className="flex items-center">
          {i > 0 && (
            <BracketConnector
              sourceCount={bracket.rounds[i - 1]!.matches.length}
              targetCount={round.matches.length}
            />
          )}
          <RoundColumn round={round} matchProps={{ onMatchClick }} />
        </div>
      ))}
    </div>
  );
}
