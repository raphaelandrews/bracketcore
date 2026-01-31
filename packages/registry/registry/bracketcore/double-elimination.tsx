import type { DoubleEliminationBracket, Match } from "./bracket-types";
import { MatchCard } from "./match-card";
import { cn } from "./cn";

export interface DoubleEliminationProps {
  bracket: DoubleEliminationBracket;
  className?: string;
  onMatchClick?: (match: Match) => void;
}

/**
 * Double elimination bracket with aligned upper and lower rows.
 *
 * Uses CSS custom properties for sizing:
 * - `--bracket-match-width`  (default 13rem / 208px)
 * - `--bracket-match-height` (default calc(3.25rem + 1px) / 53px)
 * - `--bracket-round-gap`    (default 3rem / 48px)
 * - `--bracket-match-gap`    (default 1rem / 16px)
 */
export function DoubleElimination({
  bracket,
  className,
  onMatchClick,
}: DoubleEliminationProps) {
  const { upper, lower, grandFinal } = bracket;

  // Detect whether the lower bracket has more rounds than the upper bracket
  // ratio=2 means lower bracket has ~2x rounds (pairs of drop-down + play-off)
  // ratio=1 means lower bracket rounds map 1:1 to upper bracket rounds
  const ratio =
    lower.length > upper.length + (grandFinal ? 1 : 0) ? 2 : 1;

  // Precompute the max match count in the lower bracket (for exp calculation)
  const maxLBMatches = Math.max(...lower.map((r) => r.matches.length));

  // Compute exp (slot multiplier) for each lower bracket round
  const lbExps = lower.map((r) => maxLBMatches / r.matches.length);

  // Determine connector types for the lower bracket
  // "merge" = 2:1 (match count halves), "straight" = 1:1 (same match count)
  const lbConnectors: Array<"merge" | "straight"> = [];
  for (let i = 0; i < lower.length - 1; i++) {
    lbConnectors.push(
      lower[i + 1]!.matches.length < lower[i]!.matches.length
        ? "merge"
        : "straight"
    );
  }

  // Upper bracket columns — for ratio=2, connectors are double-wide
  const connectorWidth =
    ratio === 2
      ? "calc(var(--bracket-match-width, 13rem) + 2 * var(--bracket-round-gap, 3rem))"
      : "var(--bracket-round-gap, 3rem)";

  return (
    <div
      className={cn(
        "inline-flex flex-col gap-8 overflow-x-auto",
        "rounded-lg p-6",
        "bg-background",
        className
      )}
    >
      {/* Upper bracket */}
      <section>
        <div className="inline-flex">
          {upper.map((round, i) => {
            const isLast = i === upper.length - 1;
            const exp = Math.pow(2, i);
            return (
              <div key={round.name} className="flex">
                <RoundColumn
                  name={round.name}
                  matches={round.matches}
                  exp={exp}
                  onMatchClick={onMatchClick}
                />
                {!isLast && (
                  <MergeConnectorColumn
                    exp={exp}
                    pairCount={Math.floor(round.matches.length / 2)}
                    width={connectorWidth}
                  />
                )}
              </div>
            );
          })}

          {/* Grand Final as the last column of the upper row */}
          {grandFinal && (
            <div className="flex">
              <StraightConnectorColumn
                exp={Math.pow(2, upper.length - 1)}
                count={1}
              />
              <RoundColumn
                name="Grand Final"
                matches={[grandFinal]}
                exp={Math.pow(2, upper.length - 1)}
                onMatchClick={onMatchClick}
              />
            </div>
          )}
        </div>
      </section>

      {/* Lower bracket */}
      <section>
        <div className="inline-flex">
          {lower.map((round, i) => {
            const isLast = i === lower.length - 1;
            const exp = lbExps[i]!;
            return (
              <div key={round.name} className="flex">
                <RoundColumn
                  name={round.name}
                  matches={round.matches}
                  exp={exp}
                  onMatchClick={onMatchClick}
                />
                {!isLast &&
                  (lbConnectors[i] === "merge" ? (
                    <MergeConnectorColumn
                      exp={exp}
                      pairCount={Math.floor(round.matches.length / 2)}
                    />
                  ) : (
                    <StraightConnectorColumn
                      exp={exp}
                      count={round.matches.length}
                    />
                  ))}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Internal: Round column — renders a column of matches at a given exp height
// ---------------------------------------------------------------------------

function RoundColumn({
  name,
  matches,
  exp,
  onMatchClick,
}: {
  name: string;
  matches: Match[];
  exp: number;
  onMatchClick?: (match: Match) => void;
}) {
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
              "calc(var(--bracket-match-height, calc(3.25rem + 1px)) + var(--bracket-match-gap, 1rem))",
            "--_slot": `calc(${exp} * var(--_base))`,
          } as React.CSSProperties
        }
      >
        {matches.map((match) => (
          <div
            key={match.id}
            className="flex items-center"
            style={{ height: "var(--_slot)" } as React.CSSProperties}
          >
            <div
              style={
                {
                  height: "var(--bracket-match-height, calc(3.25rem + 1px))",
                } as React.CSSProperties
              }
            >
              <MatchCard
                match={match}
                onMatchClick={onMatchClick}
                className="h-full"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Internal: Merge connector (2:1) — pairs of matches converge into one
// ---------------------------------------------------------------------------

function MergeConnectorColumn({
  exp,
  pairCount,
  width,
}: {
  exp: number;
  pairCount: number;
  width?: string;
}) {
  return (
    <div className="flex flex-col shrink-0">
      <div className="text-xs mb-3 invisible" aria-hidden="true">
        &nbsp;
      </div>
      <div
        className="flex flex-col"
        style={
          {
            "--_base":
              "calc(var(--bracket-match-height, calc(3.25rem + 1px)) + var(--bracket-match-gap, 1rem))",
            "--_pair-h": `calc(${exp * 2} * var(--_base))`,
            width: width ?? "var(--bracket-round-gap, 3rem)",
          } as React.CSSProperties
        }
      >
        {Array.from({ length: pairCount }, (_, i) => (
          <svg
            key={i}
            className="w-full text-border"
            style={{ height: "var(--_pair-h)" }}
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
    </div>
  );
}

// ---------------------------------------------------------------------------
// Internal: Straight connector (1:1) — horizontal pass-through lines
// ---------------------------------------------------------------------------

function StraightConnectorColumn({
  exp,
  count,
}: {
  exp: number;
  count: number;
}) {
  return (
    <div className="flex flex-col shrink-0">
      <div className="text-xs mb-3 invisible" aria-hidden="true">
        &nbsp;
      </div>
      <div
        className="flex flex-col"
        style={
          {
            "--_base":
              "calc(var(--bracket-match-height, calc(3.25rem + 1px)) + var(--bracket-match-gap, 1rem))",
            "--_slot-h": `calc(${exp} * var(--_base))`,
            width: "var(--bracket-round-gap, 3rem)",
          } as React.CSSProperties
        }
      >
        {Array.from({ length: count }, (_, i) => (
          <svg
            key={i}
            className="w-full text-border"
            style={{ height: "var(--_slot-h)" }}
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden
          >
            <path
              d="M 0 50 H 100"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        ))}
      </div>
    </div>
  );
}
