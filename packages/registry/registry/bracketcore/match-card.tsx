import type { Match, MatchTeam } from "./bracket-types";
import { cn } from "./cn";

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
            isWinner && "font-semibold text-(--bracket-fg,hsl(var(--card-foreground)))",
            isLoser && "text-(--bracket-muted,hsl(var(--muted-foreground)))",
            !isWinner && !isLoser && "text-(--bracket-fg,hsl(var(--card-foreground)))",
            !entry.team && "text-(--bracket-muted,hsl(var(--muted-foreground))) italic"
          )}
        >
          {entry.team?.name ?? "TBD"}
        </span>
      </div>
      <span
        className={cn(
          "text-sm tabular-nums shrink-0 leading-none font-medium",
          isWinner && "text-(--bracket-fg,hsl(var(--card-foreground)))",
          isLoser && "text-(--bracket-muted,hsl(var(--muted-foreground)))"
        )}
      >
        {entry.score}
      </span>
    </div>
  );
}

export function MatchCard({ match, className, onMatchClick }: MatchCardProps) {
  const bestOfLabel = match.bestOf ? `BO${match.bestOf}` : undefined;
  const isLive = match.status === "live";
  const showHeader = isLive || match.scheduledAt || bestOfLabel;

  return (
    <div
      className={cn(
        "bracket-match-card",
        "w-(--bracket-match-width,13rem) rounded-md border",
        "border-(--bracket-border,hsl(var(--border)))",
        "bg-(--bracket-card,hsl(var(--card)))",
        "text-(--bracket-fg,hsl(var(--card-foreground)))",
        "shadow-sm overflow-hidden",
        onMatchClick && "cursor-pointer hover:border-(--bracket-accent,hsl(var(--primary)))/50 transition-colors",
        className
      )}
      onClick={onMatchClick ? () => onMatchClick(match) : undefined}
    >
      {showHeader && (
        <div className="flex items-center justify-between px-2.5 py-1 text-xs text-(--bracket-muted,hsl(var(--muted-foreground))) border-b border-(--bracket-border,hsl(var(--border)))">
          <span className="flex items-center gap-1.5">
            {isLive && (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                </span>
                <span className="font-semibold uppercase">Live</span>
              </>
            )}
            {!isLive && match.scheduledAt && <span>{match.scheduledAt}</span>}
          </span>
          {bestOfLabel && <span className="ml-auto">{bestOfLabel}</span>}
        </div>
      )}
      <TeamRow entry={match.teams[0]} />
      <div className="border-t border-(--bracket-border,hsl(var(--border)))" />
      <TeamRow entry={match.teams[1]} />
    </div>
  );
}
