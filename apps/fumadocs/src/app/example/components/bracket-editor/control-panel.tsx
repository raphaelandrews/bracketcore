"use client"

import { ChevronDown, ChevronUp } from "lucide-react"
import type { Match, Team } from "@bracketcore/registry"
import { TeamsEditor } from "./teams-editor"
import { SettingsPanel } from "./settings-panel"
import { MatchEditorPanel } from "./match-editor-panel"

interface ControlPanelProps {
  teams: Team[]
  onTeamNameChange: (index: number, name: string) => void
  connectorStyle: "default" | "simple"
  onConnectorStyleChange: (style: "default" | "simple") => void
  bestOf: number
  onBestOfChange: (bestOf: number) => void
  selectedMatch: Match | null
  onMatchUpdate: (match: Match) => void
  isExpanded: boolean
  onToggle: () => void
}

export function ControlPanel({
  teams,
  onTeamNameChange,
  connectorStyle,
  onConnectorStyleChange,
  bestOf,
  onBestOfChange,
  selectedMatch,
  onMatchUpdate,
  isExpanded,
  onToggle,
}: ControlPanelProps) {
  return (
    <div className="border-t bg-card/95 backdrop-blur-sm">
      {/* Panel Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-2 hover:bg-muted/50 transition-colors"
      >
        <span className="text-sm font-medium">
          {selectedMatch
            ? `Editing: ${selectedMatch.teams[0].team?.name ?? "TBD"} vs ${selectedMatch.teams[1].team?.name ?? "TBD"}`
            : "Bracket Editor"}
        </span>
        {isExpanded ? (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        )}
      </button>

      {/* Panel Content */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <TeamsEditor
              teams={teams}
              onTeamNameChange={onTeamNameChange}
            />
            <SettingsPanel
              connectorStyle={connectorStyle}
              onConnectorStyleChange={onConnectorStyleChange}
              bestOf={bestOf}
              onBestOfChange={onBestOfChange}
            />
            <MatchEditorPanel
              match={selectedMatch}
              onUpdate={onMatchUpdate}
              bestOf={bestOf}
            />
          </div>
        </div>
      )}
    </div>
  )
}
