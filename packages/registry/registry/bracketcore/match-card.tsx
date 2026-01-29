import type { Match, MatchTeam } from "@/bracketcore/bracket-types";
import { cn } from "@/bracketcore/cn";

export interface MatchCardProps {
  match: Match;
  className?: string;
  onMatchClick?: (match: Match) => void;
}

function TeamRow({ entry, isTop }: { entry: MatchTeam; isTop: boolean }) {
  const isWinner = entry.isWinner === true;
  const isLoser = entry.isWinner === false;

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-2 px-2 py-1.5",
        isTop ? "rounded-t" : "rounded-b",
        isWinner && "bg-muted/50",
        isLoser && "opacity-50"
      )}
    >
      <div className="flex items-center gap-2 min-w-0">
        {entry.team?.logo && (
          <img
            src={entry.team.logo}
            alt={entry.team.name}
            className="h-4 w-4 shrink-0 object-contain"
          />
        )}
        <span
          className={cn(
            "truncate text-sm",
            isWinner && "font-semibold",
            !entry.team && "text-muted-foreground italic"
          )}
        >
          {entry.team?.name ?? "TBD"}
        </span>
      </div>
      <span
        className={cn(
          "text-sm tabular-nums shrink-0",
          isWinner && "font-semibold"
        )}
      >
        {entry.score}
      </span>
    </div>
  );
}

export function MatchCard({ match, className, onMatchClick }: MatchCardProps) {
  const bestOfLabel = match.bestOf ? `BO${match.bestOf}` : undefined;

  return (
    <div
      className={cn(
        "w-52 rounded border border-border bg-card text-card-foreground shadow-sm",
        onMatchClick && "cursor-pointer hover:border-primary/50",
        className
      )}
      onClick={onMatchClick ? () => onMatchClick(match) : undefined}
    >
      {(match.scheduledAt || bestOfLabel) && (
        <div className="flex items-center justify-between px-2 py-1 text-xs text-muted-foreground border-b border-border">
          {match.scheduledAt && <span>{match.scheduledAt}</span>}
          {bestOfLabel && <span>{bestOfLabel}</span>}
        </div>
      )}
      <TeamRow entry={match.teams[0]} isTop={true} />
      <div className="border-t border-border" />
      <TeamRow entry={match.teams[1]} isTop={false} />
    </div>
  );
}
