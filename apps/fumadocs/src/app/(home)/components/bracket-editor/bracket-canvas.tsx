"use client"

import { DoubleElimination, type DoubleEliminationBracket, type Match } from "@bracketcore/registry"

interface BracketCanvasProps {
  bracket: DoubleEliminationBracket
  connectorStyle: "default" | "simple"
  onMatchClick: (match: Match) => void
}

export function BracketCanvas({ bracket, connectorStyle, onMatchClick }: BracketCanvasProps) {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-br from-muted/30 via-background to-muted/20" />

      <div
        className="absolute inset-0 opacity-[0.03] rounded-xl"
        style={{
          backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />

      <div
        className="relative flex items-center justify-center overflow-x-auto p-8 min-h-[420px]"
        style={{ "--bracket-match-gap": "2.5rem" } as React.CSSProperties}
      >
        <DoubleElimination
          bracket={bracket}
          connectorStyle={connectorStyle}
          onMatchClick={onMatchClick}
        />
      </div>
    </div>
  )
}
