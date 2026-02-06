"use client"

import { DoubleElimination, type DoubleEliminationBracket, type Match } from "@bracketcore/registry"

interface BracketCanvasProps {
  bracket: DoubleEliminationBracket
  connectorStyle: "default" | "simple"
  onMatchClick: (match: Match) => void
}

export function BracketCanvas({ bracket, connectorStyle, onMatchClick }: BracketCanvasProps) {
  return (
    <div
      className="flex items-center justify-center overflow-x-auto p-6 min-h-[400px]"
      style={{ "--bracket-match-gap": "2.5rem" } as React.CSSProperties}
    >
      <DoubleElimination
        bracket={bracket}
        connectorStyle={connectorStyle}
        onMatchClick={onMatchClick}
      />
    </div>
  )
}
