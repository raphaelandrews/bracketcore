import type { DoubleEliminationBracket, Match } from "./bracket-types";
import { MatchCard } from "./match-card";
import { cn } from "./cn";

export interface DoubleEliminationProps {
  bracket: DoubleEliminationBracket;
  className?: string;
  onMatchClick?: (match: Match) => void;
}

export function DoubleElimination({ bracket, className, onMatchClick }: DoubleEliminationProps) {
  const { upper, lower, grandFinal } = bracket;

  const ratio = lower.length > upper.length + (grandFinal ? 1 : 0) ? 2 : 1;

  const maxLBMatches = Math.max(...lower.map((r) => r.matches.length));
  const lbExps = lower.map((r) => maxLBMatches / r.matches.length);

  const lbConnectors: Array<"merge" | "straight"> = [];
  for (let i = 0; i < lower.length - 1; i++) {
    lbConnectors.push(
      lower[i + 1]!.matches.length < lower[i]!.matches.length ? "merge" : "straight",
    );
  }

  const connectorWidth =
    ratio === 2
      ? "calc(var(--bracket-match-width, 11rem) + 2 * var(--bracket-round-gap, 3rem))"
      : "var(--bracket-round-gap, 3rem)";

  const ubLastExp = Math.pow(2, upper.length - 1);
  const lbLastExp = lbExps[lbExps.length - 1]!;

  const ubRow = (
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
      {grandFinal && (
        <StraightConnectorColumn
          exp={ubLastExp}
          count={1}
          width="calc(var(--bracket-match-width, 11rem) + var(--bracket-round-gap, 3rem))"
        />
      )}
    </div>
  );

  const lbRow = (
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
                <MergeConnectorColumn exp={exp} pairCount={Math.floor(round.matches.length / 2)} />
              ) : (
                <StraightConnectorColumn exp={exp} count={round.matches.length} />
              ))}
          </div>
        );
      })}
    </div>
  );

  if (grandFinal) {
    return (
      <div
        className={cn("inline-grid overflow-x-auto", "rounded-lg p-6", "bg-background", className)}
        style={
          {
            gridTemplateRows: "auto auto",
            gridTemplateColumns: "auto auto auto",
          } as React.CSSProperties
        }
      >
        <section style={{ gridRow: 1, gridColumn: 1 }}>{ubRow}</section>
        <section style={{ gridRow: 2, gridColumn: 1 }}>{lbRow}</section>

        {/* GF connector — unified column spanning both rows */}
        <GrandFinalConnectorColumn
          gridRow="1 / 3"
          gridColumn={2}
          ubExp={ubLastExp}
          lbExp={lbLastExp}
        />

        {/* GF card spanning both rows — same header+flex-1 structure as connector */}
        <div
          className="flex flex-col items-center shrink-0"
          style={
            {
              gridRow: "1 / 3",
              gridColumn: 3,
            } as React.CSSProperties
          }
        >
          <div className="text-xs font-medium text-muted-foreground mb-3 whitespace-nowrap">
            Grand Final
          </div>
          <div className="flex-1 flex items-center">
            <div
              style={
                {
                  height: "var(--bracket-match-height, calc(3.25rem + 1px))",
                } as React.CSSProperties
              }
            >
              <MatchCard match={grandFinal} onMatchClick={onMatchClick} className="h-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "inline-flex flex-col gap-8 overflow-x-auto",
        "rounded-lg p-6",
        "bg-background",
        className,
      )}
    >
      <section>{ubRow}</section>
      <section>{lbRow}</section>
    </div>
  );
}

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
      <div className="text-xs font-medium text-muted-foreground mb-3 whitespace-nowrap">{name}</div>
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
              <MatchCard match={match} onMatchClick={onMatchClick} className="h-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

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
              d={["M 0 25 H 50", "M 0 75 H 50", "M 50 25 V 75", "M 50 50 H 100"].join(" ")}
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

function GrandFinalConnectorColumn({
  gridRow,
  gridColumn,
  ubExp,
  lbExp,
}: {
  gridRow: string;
  gridColumn: number;
  ubExp: number;
  lbExp: number;
}) {
  return (
    <div
      className="flex flex-col w-full h-full"
      style={
        {
          gridRow,
          gridColumn,
          width: "var(--bracket-round-gap, 3rem)",
        } as React.CSSProperties
      }
    >
      {/* Spacer to match RoundColumn header height */}
      <div className="text-xs mb-3 invisible" aria-hidden="true">
        &nbsp;
      </div>

      <div
        className="relative w-full flex-1"
        style={
          {
            "--_base":
              "calc(var(--bracket-match-height, calc(3.25rem + 1px)) + var(--bracket-match-gap, 1rem))",
            "--_ub-h": `calc(${ubExp} * var(--_base))`,
            "--_lb-h": `calc(${lbExp} * var(--_base))`,
          } as React.CSSProperties
        }
      >
        {/* Upper Arm: Start at UB Center, go Down to GF Match Center */}
        <div
          className="absolute left-0 w-1/2 border-border"
          style={{
            top: "calc(var(--_ub-h) / 2 - 1px)",
            height: "calc(50% - var(--_ub-h) / 2 + 1px)",
            borderTopWidth: "2px",
            borderRightWidth: "2px",
          }}
        />

        {/* Lower Arm: Start at LB Center, go Up to GF Match Center */}
        <div
          className="absolute left-0 w-1/2 border-border"
          style={{
            bottom: "calc(var(--_lb-h) / 2 - 1px)",
            height: "calc(50% - var(--_lb-h) / 2 + 1px)",
            borderBottomWidth: "2px",
            borderRightWidth: "2px",
          }}
        />

        {/* Final Leg: Horizontal to right */}
        <div
          className="absolute right-0 w-1/2 border-border"
          style={{
            top: "calc(50% - 1px)",
            borderTopWidth: "2px",
          }}
        />
      </div>
    </div>
  );
}

function StraightConnectorColumn({
  exp,
  count,
  width,
}: {
  exp: number;
  count: number;
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
            "--_slot-h": `calc(${exp} * var(--_base))`,
            width: width ?? "var(--bracket-round-gap, 3rem)",
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
