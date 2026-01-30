import type { SingleEliminationBracket, Match } from "./bracket-types";
import { MatchCard } from "./match-card";
import { cn } from "./cn";

export interface SingleEliminationProps {
  bracket: SingleEliminationBracket;
  className?: string;
  onMatchClick?: (match: Match) => void;
}

/**
 * Single elimination bracket with SVG connector lines.
 *
 * Uses CSS custom properties for sizing:
 * - `--bracket-match-width`  (default 13rem / 208px)
 * - `--bracket-match-height` (default 4.25rem / 68px)
 * - `--bracket-round-gap`    (default 3rem / 48px) — horizontal space between rounds
 * - `--bracket-match-gap`    (default 1rem / 16px)  — base vertical gap (round 0)
 */
export function SingleElimination({
  bracket,
  className,
  onMatchClick,
}: SingleEliminationProps) {
  const rounds = bracket.rounds;

  return (
    <div
      className={cn(
        "bracket-single-elimination",
        "inline-flex overflow-x-auto",
        "rounded-lg p-6",
        "bg-background",
        className
      )}
    >
      {rounds.map((round, roundIdx) => {
        const isLast = roundIdx === rounds.length - 1;
        return (
          <div key={round.name} className="flex">
            <RoundColumn
              roundIdx={roundIdx}
              name={round.name}
              matches={round.matches}
              onMatchClick={onMatchClick}
            />
            {!isLast && (
              <ConnectorColumn
                roundIdx={roundIdx}
                sourceCount={round.matches.length}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Internal: Round column
// ---------------------------------------------------------------------------

function RoundColumn({
  roundIdx,
  name,
  matches,
  onMatchClick,
}: {
  roundIdx: number;
  name: string;
  matches: Match[];
  onMatchClick?: (match: Match) => void;
}) {
  const exp = Math.pow(2, roundIdx);

  return (
    <div className="flex flex-col items-center shrink-0">
      <div className="text-xs font-medium text-muted-foreground mb-3 whitespace-nowrap">
        {name}
      </div>
      <div
        className="flex flex-col"
        style={
          {
            "--_base":
              "calc(var(--bracket-match-height, 4.25rem) + var(--bracket-match-gap, 1rem))",
            "--_slot": `calc(${exp} * var(--_base))`,
            "--_gap":
              "calc(var(--_slot) - var(--bracket-match-height, 4.25rem))",
            "--_pad": "calc(var(--_gap) / 2)",
            gap: "var(--_gap)",
            paddingTop: roundIdx > 0 ? "var(--_pad)" : undefined,
          } as React.CSSProperties
        }
      >
        {matches.map((match) => (
          <div
            key={match.id}
            style={
              {
                height: "var(--bracket-match-height, 4.25rem)",
              } as React.CSSProperties
            }
          >
            <MatchCard
              match={match}
              onMatchClick={onMatchClick}
              className="h-full"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Internal: SVG connector column between two rounds
// ---------------------------------------------------------------------------

function ConnectorColumn({
  roundIdx,
  sourceCount,
}: {
  roundIdx: number;
  sourceCount: number;
}) {
  const pairCount = Math.floor(sourceCount / 2);
  const exp = Math.pow(2, roundIdx);

  return (
    <div
      className="flex flex-col shrink-0"
      style={
        {
          "--_base":
            "calc(var(--bracket-match-height, 4.25rem) + var(--bracket-match-gap, 1rem))",
          "--_src-slot": `calc(${exp} * var(--_base))`,
          "--_pair-h": `calc(${exp * 2} * var(--_base))`,
          "--_pad":
            roundIdx > 0
              ? "calc((var(--_src-slot) - var(--bracket-match-height, 4.25rem)) / 2)"
              : "0px",
          width: "var(--bracket-round-gap, 3rem)",
          paddingTop: "var(--_pad)",
        } as React.CSSProperties
      }
    >
      {Array.from({ length: pairCount }, (_, i) => (
        <svg
          key={i}
          className="w-full text-border"
          style={{ height: `var(--_pair-h)` }}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden
        >
          <path
            d={[
              "M 0 25 H 50",
              "M 0 75 H 50",
              "M 50 25 V 75",
              "M 50 50 H 100",
            ].join(" ")}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      ))}
    </div>
  );
}
