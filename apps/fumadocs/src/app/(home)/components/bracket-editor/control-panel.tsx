"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { Match, Team } from "@bracketcore/registry"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UsersIcon, SettingsIcon, SwordsIcon } from "lucide-react"
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
  onReset: () => void
  onShuffle: () => void
  onAutoSchedule: () => void
  onImport: (data: string) => void
  onExport: () => void
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
  onReset,
  onShuffle,
  onAutoSchedule,
  onImport,
  onExport,
}: ControlPanelProps) {
  const [activeTab, setActiveTab] = React.useState("teams")

  return (
    <div className="bg-background border-t">
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
              className="h-full rounded-none border-0 border-transparent px-4 data-[state=active]:bg-transparent data-[state=active]:border-primary data-[state=active]:shadow-none flex-shrink-0 transition-colors"
            >
              <SettingsIcon className="mr-2 size-4" />
              Settings
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
                    <TeamsEditor
                      teams={teams}
                      onTeamNameChange={onTeamNameChange}
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
                      onReset={onReset}
                      onShuffle={onShuffle}
                      onAutoSchedule={onAutoSchedule}
                      onImport={onImport}
                      onExport={onExport}
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
