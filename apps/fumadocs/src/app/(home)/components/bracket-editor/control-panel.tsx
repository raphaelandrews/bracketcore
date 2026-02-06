"use client"

import * as React from "react"
import type { Match, Team } from "@bracketcore/registry"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  UsersIcon,
  SettingsIcon,
  SwordsIcon,
  Undo2Icon,
  Redo2Icon,
  AlertCircleIcon,
  BarChartIcon,
} from "lucide-react"
import { TeamsEditor } from "./teams-editor"
import { SettingsPanel } from "./settings-panel"
import { MatchEditorPanel } from "./match-editor-panel"
import type {
  BracketSize,
  ValidationError,
  ScheduleConflict,
  TeamStats,
} from "./bracket-editor-types"
import { cn } from "@/lib/cn"

interface ControlPanelProps {
  teams: Team[]
  onTeamNameChange: (teamId: string, name: string) => void
  onAddTeam: () => void
  onRemoveTeam: (teamId: string) => void
  connectorStyle: "default" | "simple"
  onConnectorStyleChange: (style: "default" | "simple") => void
  bestOf: number
  onBestOfChange: (bestOf: number) => void
  bracketSize: BracketSize
  onBracketSizeChange: (size: BracketSize) => void
  selectedMatch: Match | null
  onMatchUpdate: (match: Match) => void
  onReset: () => void
  onShuffle: () => void
  onSeedByRank: () => void
  onAutoSchedule: () => void
  onImport: (data: string) => void
  onExport: () => void
  onDuplicate: () => void
  isExpanded: boolean
  onToggle: () => void
  canUndo: boolean
  canRedo: boolean
  onUndo: () => void
  onRedo: () => void
  validationErrors: ValidationError[]
  scheduleConflicts: ScheduleConflict[]
  teamStats: TeamStats[]
  quickScores: [number, number][]
  onForfeit: (teamIndex: 0 | 1) => void
  onSwapTeams: () => void
  onQuickScore: (scoreA: number, scoreB: number) => void
  onNotesChange: (notes: string) => void
  onStreamUrlChange: (streamUrl: string) => void
  onVenueChange: (venue: string) => void
}

export function ControlPanel({
  teams,
  onTeamNameChange,
  onAddTeam,
  onRemoveTeam,
  connectorStyle,
  onConnectorStyleChange,
  bestOf,
  onBestOfChange,
  bracketSize,
  onBracketSizeChange,
  selectedMatch,
  onMatchUpdate,
  onReset,
  onShuffle,
  onSeedByRank,
  onAutoSchedule,
  onImport,
  onExport,
  onDuplicate,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  validationErrors,
  scheduleConflicts,
  teamStats,
  quickScores,
  onForfeit,
  onSwapTeams,
  onQuickScore,
  onNotesChange,
  onStreamUrlChange,
  onVenueChange,
}: ControlPanelProps) {
  const [showStats, setShowStats] = React.useState(false)

  const hasIssues = validationErrors.length > 0 || scheduleConflicts.length > 0

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-fit w-full px-4">
      <div className="flex items-center gap-2 p-2 rounded-xl border bg-background/95 shadow-lg overflow-x-auto scrollbar-none">
        {/* Undo/Redo Group */}
        <div className="flex items-center gap-1 border-r pr-2 mr-1">
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
            className="size-8"
          >
            <Undo2Icon className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={onRedo}
            disabled={!canRedo}
            title="Redo (Ctrl+Shift+Z)"
            className="size-8"
          >
            <Redo2Icon className="size-4" />
          </Button>
        </div>

        {/* Teams Popover */}
        <Popover>
          <PopoverTrigger
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "h-8 gap-2")}
          >
            <UsersIcon className="size-4" />
            Teams
            <span className="bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full text-[10px]">
              {teams.length}
            </span>
          </PopoverTrigger>
          <PopoverContent className="w-[400px] p-4" align="start" sideOffset={8}>
            <div className="flex justify-end mb-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs gap-1.5"
                onClick={() => setShowStats(!showStats)}
              >
                <BarChartIcon className="size-3.5" />
                {showStats ? "Hide Stats" : "Show Stats"}
              </Button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              <TeamsEditor
                teams={teams}
                onTeamNameChange={onTeamNameChange}
                onAddTeam={onAddTeam}
                onRemoveTeam={onRemoveTeam}
                teamStats={teamStats}
                showStats={showStats}
              />
            </div>
          </PopoverContent>
        </Popover>

        {/* Settings Popover */}
        <Popover>
          <PopoverTrigger
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "h-8 gap-2",
              hasIssues && "text-yellow-600 dark:text-yellow-400"
            )}
          >
            <SettingsIcon className="size-4" />
            Settings
            {hasIssues && (
              <span className="flex size-2 rounded-full bg-yellow-500 animate-pulse" />
            )}
          </PopoverTrigger>
          <PopoverContent className="w-[340px] p-4" align="start" sideOffset={8}>
            <SettingsPanel
              connectorStyle={connectorStyle}
              onConnectorStyleChange={onConnectorStyleChange}
              bestOf={bestOf}
              onBestOfChange={onBestOfChange}
              bracketSize={bracketSize}
              onBracketSizeChange={onBracketSizeChange}
              onReset={onReset}
              onShuffle={onShuffle}
              onSeedByRank={onSeedByRank}
              onAutoSchedule={onAutoSchedule}
              onImport={onImport}
              onExport={onExport}
              onDuplicate={onDuplicate}
              validationErrors={validationErrors}
              scheduleConflicts={scheduleConflicts}
            />
          </PopoverContent>
        </Popover>

        {/* Match Editor Popover */}
        <Popover>
          <PopoverTrigger
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "h-8 gap-2 transition-colors",
              selectedMatch
                ? "bg-primary/10 text-primary hover:bg-primary/20"
                : "text-muted-foreground"
            )}
          >
            <SwordsIcon className="size-4" />
            Match Details
            {selectedMatch && <span className="flex size-2 rounded-full bg-primary" />}
          </PopoverTrigger>
          <PopoverContent className="w-[360px] p-4" align="start" sideOffset={8}>
            <MatchEditorPanel
              match={selectedMatch}
              onUpdate={onMatchUpdate}
              bestOf={bestOf}
              quickScores={quickScores}
              onForfeit={onForfeit}
              onSwapTeams={onSwapTeams}
              onQuickScore={onQuickScore}
              onNotesChange={onNotesChange}
              onStreamUrlChange={onStreamUrlChange}
              onVenueChange={onVenueChange}
            />
          </PopoverContent>
        </Popover>

        {/* Issue Indicator (Global) */}
        {hasIssues && (
          <div className="ml-auto flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20">
            <AlertCircleIcon className="size-3.5" />
            <span className="text-[10px] font-medium">
              {validationErrors.length + scheduleConflicts.length} issue(s)
            </span>
          </div>
        )}
      </div>
    </div>
  )
}