import type { DoubleEliminationBracket, Match, Round } from "./bracket-types";
import { MatchCard } from "./match-card";
import { cn } from "./cn";

export interface DoubleElimination1Props {
  bracket: DoubleEliminationBracket;
  className?: string;
  onMatchClick?: (match: Match) => void;
  /**
   * The LB round index that the first UB round should align with.
   * Useful when LB starts "earlier" (has preliminary rounds) than UB.
   * Default: 0.
   */
  ubAlignToLBRound?: number;
  connectorStyle?: "default" | "simple";
}

// Each match occupies 2 grid rows (one per team row).
// Row computation builds bottom-up: round 1 matches are evenly spaced,
// subsequent rounds are centered between their two feeder matches.

interface MatchPos {
  topRow: number;
  botRow: number;
}

function computeBracketRows(
  rounds: Round[],
  startRow: number,
  connectorTypes: Array<"merge" | "straight">,
): MatchPos[][] {
  const result: MatchPos[][] = [];

  // Round 1: matches stacked sequentially
  const r0: MatchPos[] = [];
  for (let i = 0; i < rounds[0]!.matches.length; i++) {
    const top = startRow + i * 2;
    r0.push({ topRow: top, botRow: top + 1 });
  }
  result.push(r0);

  // Subsequent rounds
  for (let r = 1; r < rounds.length; r++) {
    const prev = result[r - 1]!;
    const curr: MatchPos[] = [];
    const connType = connectorTypes[r - 1];

    if (connType === "merge") {
      // 2→1: center between pairs
      for (let i = 0; i < rounds[r]!.matches.length; i++) {
        const feederA = prev[i * 2]!;
        const feederB = prev[i * 2 + 1]!;
        const center = Math.floor((feederA.topRow + feederB.botRow) / 2);
        curr.push({ topRow: center, botRow: center + 1 });
      }
    } else {
      // straight: same rows as previous round
      for (let i = 0; i < rounds[r]!.matches.length; i++) {
        curr.push({ ...prev[i]! });
      }
    }

    result.push(curr);
  }

  return result;
}

function computeConnectorTypes(rounds: Round[]): Array<"merge" | "straight"> {
  const types: Array<"merge" | "straight"> = [];
  for (let i = 0; i < rounds.length - 1; i++) {
    types.push(rounds[i + 1]!.matches.length < rounds[i]!.matches.length ? "merge" : "straight");
  }
  return types;
}

export function DoubleElimination1({
  bracket,
  className,
  onMatchClick,
  ubAlignToLBRound = 0,
  connectorStyle = "default",
}: DoubleElimination1Props) {
  const { upper, lower, grandFinal } = bracket;

  // LB dictates the specific columns because it has more rounds (usually).
  // LB Rounds: 0, 1, 2, ...
  // Grid Columns:
  // Col 0: LB R0 Match
  // Col 1: LB R0->R1 Connector
  // Col 2: LB R1 Match
  // Col 3: LB R1->R2 Connector
  // ...
  // Grid Col for LB Round i = i * 2 + 1 (1-based grid)

  const getLBCol = (rIdx: number) => 1 + rIdx * 2;

  // UB Alignment:
  // UB R0 aligns with LB R0 -> Col 1.
  // UB Final (last round) aligns with LB Final (last round).
  // UB Intermediate rounds are interpolated.

  const ubCount = upper.length;
  const lbCount = lower.length;


  // Function to map UB round index to Grid Column
  const getUBCol = (rIdx: number) => {
    const startInd = ubAlignToLBRound;
    const endInd = lbCount - 1;

    // Safety: if counts are small
    if (lbCount === 0) return 1 + rIdx * 2;

    if (rIdx === 0) return getLBCol(startInd);
    if (rIdx === ubCount - 1) return getLBCol(endInd);

    // Interpolate indices between startInd and endInd

    const step = (endInd - startInd) / (ubCount - 1);
    const targetLBIdx = Math.round(startInd + rIdx * step);
    return getLBCol(targetLBIdx);
  };

  const ubMatchCols: number[] = [];
  const ubConnCols: number[] = []; // Column where the connector STARTS
  const ubConnSpans: number[] = [];

  for (let i = 0; i < ubCount; i++) {
    ubMatchCols.push(getUBCol(i));
    if (i < ubCount - 1) {
      // Connector exists between current Round and Next Round
      const startCol = getUBCol(i) + 1; // Start right after current match
      const endCol = getUBCol(i + 1);   // End right before next match
      ubConnCols.push(startCol);
      ubConnSpans.push(endCol - startCol);
    }
  }

  const lbMatchCols: number[] = [];
  const lbConnCols: number[] = [];

  for (let i = 0; i < lbCount; i++) {
    lbMatchCols.push(getLBCol(i));
    if (i < lbCount - 1) {
      lbConnCols.push(getLBCol(i) + 1);
    }
  }

  // Grand Final Column
  const lastBracketCol = Math.max(
    lbMatchCols[lbMatchCols.length - 1] ?? 0,
    ubMatchCols[ubMatchCols.length - 1] ?? 0,
  );

  const gfConnCol = grandFinal ? lastBracketCol + 1 : 0;
  const gfMatchCol = grandFinal ? lastBracketCol + 2 : 0;
  const totalCols = grandFinal ? gfMatchCol : lastBracketCol;

  // --- Connector types ---
  // UB always matches

  const lbConnTypes = computeConnectorTypes(lower);

  // --- Row computation ---
  const headerRow = 1;
  const ubStartRow = 2;
  const ubRows = computeBracketRows(upper, ubStartRow, Array(upper.length - 1).fill("merge"));

  // Total rows used by UB
  const ubMaxRow =
    ubRows[0]!.length > 0 ? ubRows[0]![ubRows[0]!.length - 1]!.botRow : ubStartRow + 1;

  const gapRows = 2;
  const lbHeaderRow = ubMaxRow + gapRows + 1;
  const lbStartRow = lbHeaderRow + 1;
  const lbRows = computeBracketRows(lower, lbStartRow, lbConnTypes);

  // Total rows used by LB
  const lbMaxRow =
    lbRows[0]!.length > 0 ? lbRows[0]![lbRows[0]!.length - 1]!.botRow : lbStartRow + 1;

  const totalRows = lbMaxRow + 1;

  // Build grid-template-columns
  const colDefs: string[] = [];
  for (let c = 1; c <= totalCols; c++) {
    const isMatchCol = ubMatchCols.includes(c) || lbMatchCols.includes(c) || c === gfMatchCol;

    if (isMatchCol) {
      colDefs.push("var(--bracket-match-width, 11rem)");
    } else {
      colDefs.push("var(--bracket-round-gap, 3rem)");
    }
  }

  // Build grid-template-rows
  const rowDefs: string[] = [];
  for (let r = 1; r <= totalRows; r++) {
    if (r === headerRow || r === lbHeaderRow) {
      rowDefs.push("auto");
    } else if (r > ubMaxRow && r < lbHeaderRow) {
      // Gap rows
      rowDefs.push("var(--bracket-match-gap, 1rem)");
    } else {
      rowDefs.push(
        "calc(var(--bracket-match-height, calc(3.25rem + 1px)) / 2 + var(--bracket-match-gap, 1rem) / 2)",
      );
    }
  }

  // --- GF vertical positioning ---
  const ubFinalPos = ubRows[ubRows.length - 1]?.[0];
  const lbFinalPos = lbRows[lbRows.length - 1]?.[0];

  const gfRowStart = ubFinalPos ? ubFinalPos.topRow : ubStartRow;
  const gfRowEnd = lbFinalPos ? lbFinalPos.botRow + 1 : lbStartRow + 2;

  return (
    <div
      className={cn("inline-grid overflow-x-auto", "rounded-lg p-6", "bg-background", className)}
      style={{
        gridTemplateColumns: colDefs.join(" "),
        gridTemplateRows: rowDefs.join(" "),
      }}
    >
      {/* === UB Round Headers === */}
      {upper.map((round, i) => (
        <div
          key={`ub-header-${round.name}`}
          className="text-xs font-medium text-muted-foreground mb-1 whitespace-nowrap flex items-end justify-center"
          style={{
            gridRow: headerRow,
            gridColumn: ubMatchCols[i]!,
          }}
        >
          {round.name}
        </div>
      ))}

      {/* === UB Matches === */}
      {upper.map((round, ri) =>
        round.matches.map((match, mi) => {
          const pos = ubRows[ri]![mi]!;
          return (
            <GridMatch
              key={match.id}
              match={match}
              topRow={pos.topRow}
              col={ubMatchCols[ri]!}
              onMatchClick={onMatchClick}
            />
          );
        }),
      )}

      {/* === UB Connectors === */}
      {ubConnCols.map((col, i) => {
        const prevRound = ubRows[i]!;
        const nextRound = ubRows[i + 1]!;
        const span = ubConnSpans[i]!;

        return (
          <MergeConnectors
            key={`ub-conn-${i}`}
            prevPositions={prevRound}
            nextPositions={nextRound}
            gridCol={col}
            gridColSpan={span}
            style={connectorStyle}
          />
        );
      })}

      {/* === LB Round Headers === */}
      {lower.map((round, i) => (
        <div
          key={`lb-header-${round.name}`}
          className="text-xs font-medium text-muted-foreground mb-1 whitespace-nowrap flex items-end justify-center"
          style={{
            gridRow: lbHeaderRow,
            gridColumn: lbMatchCols[i]!,
          }}
        >
          {round.name}
        </div>
      ))}

      {/* === LB Matches === */}
      {lower.map((round, ri) =>
        round.matches.map((match, mi) => {
          const pos = lbRows[ri]![mi]!;
          return (
            <GridMatch
              key={match.id}
              match={match}
              topRow={pos.topRow}
              col={lbMatchCols[ri]!}
              onMatchClick={onMatchClick}
            />
          );
        }),
      )}

      {/* === LB Connectors === */}
      {lbConnCols.map((col, i) => {
        const prevRound = lbRows[i]!;
        const nextRound = lbRows[i + 1]!;
        const connType = lbConnTypes[i]!;
        if (connType === "merge") {
          return (
            <MergeConnectors
              key={`lb-conn-${i}`}
              prevPositions={prevRound}
              nextPositions={nextRound}
              gridCol={col}
              gridColSpan={1}
              style={connectorStyle}
            />
          );
        }
        return (
          <StraightConnectors
            key={`lb-conn-${i}`}
            positions={prevRound}
            gridCol={col}
            style={connectorStyle}
          />
        );
      })}

      {/* === Grand Final === */}
      {grandFinal && ubFinalPos && lbFinalPos && (
        <>
          {/* GF header */}
          <div
            className="text-xs font-medium text-muted-foreground mb-1 whitespace-nowrap flex items-end justify-center"
            style={{
              gridRow: headerRow,
              gridColumn: gfMatchCol,
            }}
          >
            Grand Final
          </div>

          {/* GF connector */}
          <GrandFinalConnector
            ubFinalPos={ubFinalPos}
            lbFinalPos={lbFinalPos}
            gridCol={gfConnCol}
          />

          {/* GF match card */}
          <div
            className="flex items-center"
            style={{
              gridRow: `${gfRowStart} / ${gfRowEnd}`,
              gridColumn: gfMatchCol,
              alignSelf: "center",
            }}
          >
            <div
              style={{
                height: "var(--bracket-match-height, calc(3.25rem + 1px))",
              }}
            >
              <MatchCard match={grandFinal} onMatchClick={onMatchClick} className="h-full" />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function GridMatch({
  match,
  topRow,
  col,
  onMatchClick,
}: {
  match: Match;
  topRow: number;
  col: number;
  onMatchClick?: (match: Match) => void;
}) {
  return (
    <div
      className="flex items-center"
      style={{
        gridRow: `${topRow} / ${topRow + 2}`,
        gridColumn: col,
      }}
    >
      <div
        style={{
          height: "var(--bracket-match-height, calc(3.25rem + 1px))",
          width: "100%",
        }}
      >
        <MatchCard match={match} onMatchClick={onMatchClick} className="h-full" />
      </div>
    </div>
  );
}

function MergeConnectors({
  prevPositions,
  nextPositions,
  gridCol,
  gridColSpan,
  style = "default",
}: {
  prevPositions: MatchPos[];
  nextPositions: MatchPos[];
  gridCol: number;
  gridColSpan: number;
  style?: "default" | "simple";
}) {
  const elements: React.ReactElement[] = [];

  for (let i = 0; i < nextPositions.length; i++) {
    const topFeeder = prevPositions[i * 2]!;
    const botFeeder = prevPositions[i * 2 + 1]!;

    const startRow = topFeeder.topRow;
    const endRow = botFeeder.botRow + 1;

    if (style === "simple") {

      elements.push(
        <div
          key={`merge-${i}`}
          className="relative"
          style={{
            gridRow: `${startRow} / ${endRow}`,
            gridColumn: gridColSpan > 1 ? `${gridCol} / ${gridCol + gridColSpan}` : gridCol,
          }}
        >
          {/* Top Path: Feeder Center */}
          <div
            className="absolute border-t border-r border-border"
            style={{
              top: "calc((var(--bracket-match-height, calc(3.25rem + 1px)) + var(--bracket-match-gap, 1rem)) / 2)",
              right: "50%",
              width: "50%",
              height: "calc(50% - var(--bracket-match-height) * 0.25 - (var(--bracket-match-height) + var(--bracket-match-gap)) / 2)",
            }}
          />
          {/* Top Inbound Stub */}
          <div
            className="absolute border-b border-border"
            style={{
              top: "calc(50% - var(--bracket-match-height) * 0.25)",
              left: "50%",
              width: "50%",
            }}
          />

          {/* Bot Path: Feeder Center */}
          <div
            className="absolute border-b border-r border-border"
            style={{
              bottom: "calc((var(--bracket-match-height, calc(3.25rem + 1px)) + var(--bracket-match-gap, 1rem)) / 2)",
              right: "50%",
              width: "50%",
              height: "calc(50% - var(--bracket-match-height) * 0.25 - (var(--bracket-match-height) + var(--bracket-match-gap)) / 2)",
            }}
          />
          {/* Bot Inbound Stub */}
          <div
            className="absolute border-b border-border"
            style={{
              bottom: "calc(50% - var(--bracket-match-height) * 0.25)",
              left: "50%",
              width: "50%",
            }}
          />
        </div>
      );
    } else {
      // Default SVG style
      elements.push(
        <div
          key={`merge-${i}`}
          className="relative"
          style={{
            gridRow: `${startRow} / ${endRow}`,
            gridColumn: gridColSpan > 1 ? `${gridCol} / ${gridCol + gridColSpan}` : gridCol,
          }}
        >
          <svg
            className="w-full h-full text-border"
            preserveAspectRatio="none"
            viewBox="0 0 100 100"
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
        </div>,
      );
    }
  }

  return <>{elements}</>;
}

function StraightConnectors({
  positions,
  gridCol,
  style = "default",
}: {
  positions: MatchPos[];
  gridCol: number;
  style?: "default" | "simple";
}) {
  return (
    <>
      {positions.map((pos, i) => (
        <div
          key={`straight-${i}`}
          className="relative"
          style={{
            gridRow: `${pos.topRow} / ${pos.botRow + 1}`,
            gridColumn: gridCol,
          }}
        >
          {style === "simple" ? (
            <>
              {/* Path from Source(Left) to Target Bottom Row (50% + 1/4H). 
                  Source is at 50% relative height (center of match). 
                  Target Bottom Row is at 50% + 1/4 Match Height. 
              */}
              <div
                className="absolute border-l border-b border-border"
                style={{
                  top: "50%",
                  left: "0",
                  width: "100%",
                  height: "calc(var(--bracket-match-height, calc(3.25rem + 1px)) * 0.25)",
                }}
              />
              {/* Stub for Top Row (Coming from nowhere/drop) */}
              <div
                className="absolute border-b border-border"
                style={{
                  top: "calc(50% - var(--bracket-match-height, calc(3.25rem + 1px)) * 0.25)",
                  left: "0",
                  width: "100%",
                }}
              />
            </>
          ) : (
            <svg
              className="w-full h-full text-border"
              preserveAspectRatio="none"
              viewBox="0 0 100 100"
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
          )}
        </div>
      ))}
    </>
  );
}

function GrandFinalConnector({
  ubFinalPos,
  lbFinalPos,
  gridCol,
}: {
  ubFinalPos: MatchPos;
  lbFinalPos: MatchPos;
  gridCol: number;
}) {
  const startRow = ubFinalPos.topRow;
  const endRow = lbFinalPos.botRow + 1;

  return (
    <div
      className="relative"
      style={{
        gridRow: `${startRow} / ${endRow}`,
        gridColumn: gridCol,
      }}
    >
      <svg
        className="w-full h-full text-border"
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
        aria-hidden
      >
        {/* Upper arm from UB final center */}
        <path
          d={`M 0 ${(100 * (ubFinalPos.topRow + 1 - startRow)) / (endRow - startRow)} H 50`}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          vectorEffect="non-scaling-stroke"
        />
        {/* Lower arm from LB final center */}
        <path
          d={`M 0 ${(100 * (lbFinalPos.topRow + 1 - startRow)) / (endRow - startRow)} H 50`}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          vectorEffect="non-scaling-stroke"
        />
        {/* Vertical bar */}
        <path
          d={`M 50 ${(100 * (ubFinalPos.topRow + 1 - startRow)) / (endRow - startRow)} V ${(100 * (lbFinalPos.topRow + 1 - startRow)) / (endRow - startRow)}`}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          vectorEffect="non-scaling-stroke"
        />
        {/* Output to GF */}
        <path
          d="M 50 50 H 100"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}
