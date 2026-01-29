import type { Match, MatchTeam } from "../types";
import { cn } from "../lib/cn";

export interface MatchCardProps {
  match: Match;
  className?: string;
  onMatchClick?: (match: Match) => void;
}

function TeamRow({ entry }: { entry: MatchTeam }) {
  const isWinner = entry.isWinner === true;
  const isLoser = entry.isWinner === false;

  return (
    <div
      className={cn(
        "bracket-team-row",
        "flex items-center gap-2 px-2.5 py-1.5",
        "border-l-2",
        isWinner && "border-l-emerald-500 bg-emerald-500/5",
        isLoser && "border-l-red-500/40",
        !isWinner && !isLoser && "border-l-transparent"
      )}
    >
      <div className="flex items-center gap-2 min-w-0 flex-1">
        {entry.team?.logo && (
          <img
            src={entry.team.logo}
            alt={entry.team.name}
            className="h-4 w-4 shrink-0 object-contain"
          />
        )}
        <span
          className={cn(
            "truncate text-sm leading-none",
            isWinner && "font-semibold text-[var(--bracket-fg,hsl(var(--card-foreground)))]",
            isLoser && "text-[var(--bracket-muted,hsl(var(--muted-foreground)))]",
            !isWinner && !isLoser && "text-[var(--bracket-fg,hsl(var(--card-foreground)))]",
            !entry.team && "text-[var(--bracket-muted,hsl(var(--muted-foreground)))] italic"
          )}
        >
          {entry.team?.name ?? "TBD"}
        </span>
      </div>
      <span
        className={cn(
          "text-sm tabular-nums shrink-0 leading-none font-medium",
          isWinner && "text-[var(--bracket-fg,hsl(var(--card-foreground)))]",
          isLoser && "text-[var(--bracket-muted,hsl(var(--muted-foreground)))]"
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
        "bracket-match-card",
        "w-[var(--bracket-match-width,13rem)] rounded-md border",
        "border-[var(--bracket-border,hsl(var(--border)))]",
        "bg-[var(--bracket-card,hsl(var(--card)))]",
        "text-[var(--bracket-fg,hsl(var(--card-foreground)))]",
        "shadow-sm overflow-hidden",
        onMatchClick && "cursor-pointer hover:border-[var(--bracket-accent,hsl(var(--primary)))]/50 transition-colors",
        className
      )}
      onClick={onMatchClick ? () => onMatchClick(match) : undefined}
    >
      {(match.scheduledAt || bestOfLabel) && (
        <div className="flex items-center justify-between px-2.5 py-1 text-xs text-[var(--bracket-muted,hsl(var(--muted-foreground)))] border-b border-[var(--bracket-border,hsl(var(--border)))]">
          {match.scheduledAt && <span>{match.scheduledAt}</span>}
          {bestOfLabel && <span className="ml-auto">{bestOfLabel}</span>}
        </div>
      )}
      <TeamRow entry={match.teams[0]} />
      <div className="border-t border-[var(--bracket-border,hsl(var(--border)))]" />
      <TeamRow entry={match.teams[1]} />
    </div>
  );
}
