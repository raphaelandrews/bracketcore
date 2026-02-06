"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { Match, Team } from "@bracketcore/registry"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  UsersIcon,
  SettingsIcon,
  SwordsIcon,
  Undo2Icon,
  Redo2Icon,
  AlertCircleIcon,
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
  onTeamNameChange: (index: number, name: string) => void
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
  // Undo/redo
  canUndo: boolean
  canRedo: boolean
  onUndo: () => void
  onRedo: () => void
  // Validation
  validationErrors: ValidationError[]
  scheduleConflicts: ScheduleConflict[]
  // Team stats
  teamStats: TeamStats[]
  // Match editor extras
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
  const [activeTab, setActiveTab] = React.useState("teams")
  const [showStats, setShowStats] = React.useState(false)

  const hasIssues = validationErrors.length > 0 || scheduleConflicts.length > 0

  return (
    <div className="bg-background border-t">
      {/* Header with undo/redo */}
      <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/30">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
            className="size-7"
          >
            <Undo2Icon className="size-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={onRedo}
            disabled={!canRedo}
            title="Redo (Ctrl+Shift+Z)"
            className="size-7"
          >
            <Redo2Icon className="size-3.5" />
          </Button>
        </div>

        {hasIssues && (
          <div className="flex items-center gap-1.5 text-yellow-600 dark:text-yellow-400">
            <AlertCircleIcon className="size-3.5" />
            <span className="text-xs font-medium">
              {validationErrors.length + scheduleConflicts.length} issue(s)
            </span>
          </div>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="overflow-x-auto scrollbar-none border-b">
          <TabsList className="bg-transparent h-12 p-0 w-full justify-start rounded-none min-w-max border-b-0">
            <TabsTrigger
              value="teams"
              className="h-full rounded-none border-0 border-transparent px-4 data-[state=active]:bg-transparent data-[state=active]:border-primary data-[state=active]:shadow-none flex-shrink-0 transition-colors"
            >
              <UsersIcon className="mr-2 size-4" />
              Teams
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className={cn(
                "h-full rounded-none border-0 border-transparent px-4 data-[state=active]:bg-transparent data-[state=active]:border-primary data-[state=active]:shadow-none flex-shrink-0 transition-colors",
                hasIssues && "text-yellow-600 dark:text-yellow-400"
              )}
            >
              <SettingsIcon className="mr-2 size-4" />
              Settings
              {hasIssues && (
                <span className="ml-2 flex size-1.5 rounded-full bg-yellow-500" />
              )}
            </TabsTrigger>
            <TabsTrigger
              value="match"
              className="h-full rounded-none border-0 border-transparent px-4 data-[state=active]:bg-transparent data-[state=active]:border-primary data-[state=active]:shadow-none flex-shrink-0 transition-colors"
            >
              <SwordsIcon className="mr-2 size-4" />
              Match Details
              {selectedMatch && (
                <span className="ml-2 flex size-1.5 rounded-full bg-primary" />
              )}
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="overflow-hidden">
          <motion.div
            initial={false}
            animate={{ height: "auto" }}
            transition={{ type: "spring", bounce: 0, duration: 0.3 }}
          >
            <div className="p-4 max-w-3xl mx-auto">
              <AnimatePresence mode="wait" initial={false}>
                {activeTab === "teams" && (
                  <motion.div
                    key="teams"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex justify-end mb-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => setShowStats(!showStats)}
                      >
                        {showStats ? "Hide Stats" : "Show Stats"}
                      </Button>
                    </div>
                    <TeamsEditor
                      teams={teams}
                      onTeamNameChange={onTeamNameChange}
                      onAddTeam={onAddTeam}
                      onRemoveTeam={onRemoveTeam}
                      teamStats={teamStats}
                      showStats={showStats}
                    />
                  </motion.div>
                )}
                {activeTab === "settings" && (
                  <motion.div
                    key="settings"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
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
                  </motion.div>
                )}
                {activeTab === "match" && (
                  <motion.div
                    key="match"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
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
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </Tabs>
    </div>
  )
}
