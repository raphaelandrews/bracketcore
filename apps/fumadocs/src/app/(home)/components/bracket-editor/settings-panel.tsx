"use client"

import {
  SettingsIcon,
  SplineIcon,
  HashIcon,
  UsersIcon,
  AlertTriangleIcon,
  CopyIcon,
  ListOrderedIcon,
} from "lucide-react"
import { cn } from "@/lib/cn"
import { Button } from "@/components/ui/button"
import type { BracketSize, ScheduleConflict, ValidationError } from "./bracket-editor-types"

interface SettingsPanelProps {
  connectorStyle: "default" | "simple"
  onConnectorStyleChange: (style: "default" | "simple") => void
  bestOf: number
  onBestOfChange: (bestOf: number) => void
  bracketSize: BracketSize
  onBracketSizeChange: (size: BracketSize) => void
  onReset: () => void
  onShuffle: () => void
  onSeedByRank: () => void
  onAutoSchedule: () => void
  onImport: (data: string) => void
  onExport: () => void
  onDuplicate: () => void
  validationErrors: ValidationError[]
  scheduleConflicts: ScheduleConflict[]
}

export function SettingsPanel({
  connectorStyle,
  onConnectorStyleChange,
  bestOf,
  onBestOfChange,
  bracketSize,
  onBracketSizeChange,
  onReset,
  onShuffle,
  onSeedByRank,
  onAutoSchedule,
  onImport,
  onExport,
  onDuplicate,
  validationErrors,
  scheduleConflicts,
}: SettingsPanelProps) {
  const hasIssues = validationErrors.length > 0 || scheduleConflicts.length > 0

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center size-6 rounded-md bg-primary/10 text-primary">
          <SettingsIcon className="size-3.5" />
        </div>
        <h3 className="text-sm font-medium">Settings</h3>
      </div>

      <div className="space-y-3">
        {/* Bracket Size */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <UsersIcon className="size-3" />
            <span>Bracket Size</span>
          </div>
          <div className="flex rounded-lg border bg-muted/50 p-0.5">
            {([4, 8, 16, 32, 64] as BracketSize[]).map((size) => (
              <button
                key={size}
                onClick={() => onBracketSizeChange(size)}
                className={cn(
                  "flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                  bracketSize === size
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Connector Style */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <SplineIcon className="size-3" />
            <span>Connector Style</span>
          </div>
          <div className="flex rounded-lg border bg-muted/50 p-0.5">
            <button
              onClick={() => onConnectorStyleChange("default")}
              className={cn(
                "flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                connectorStyle === "default"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Curved
            </button>
            <button
              onClick={() => onConnectorStyleChange("simple")}
              className={cn(
                "flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                connectorStyle === "simple"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Straight
            </button>
          </div>
        </div>

        {/* Best Of */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <HashIcon className="size-3" />
            <span>Default Best Of</span>
          </div>
          <div className="flex rounded-lg border bg-muted/50 p-0.5">
            {[1, 3, 5, 7].map((num) => (
              <button
                key={num}
                onClick={() => onBestOfChange(num)}
                className={cn(
                  "flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                  bestOf === num
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                BO{num}
              </button>
            ))}
          </div>
        </div>

        {/* Validation/Conflict Status */}
        {hasIssues && (
          <div className="rounded-md border border-yellow-500/30 bg-yellow-500/10 p-3">
            <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
              <AlertTriangleIcon className="size-4" />
              <span className="text-xs font-medium">Issues Detected</span>
            </div>
            <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
              {validationErrors.length > 0 && (
                <li>{validationErrors.length} validation error(s)</li>
              )}
              {scheduleConflicts.length > 0 && (
                <li>{scheduleConflicts.length} scheduling conflict(s)</li>
              )}
            </ul>
          </div>
        )}

        <div className="pt-4 border-t space-y-4">
          <div className="grid grid-cols-3 gap-2">
            <Button variant="outline" size="sm" onClick={onReset} className="w-full">
              Reset
            </Button>
            <Button variant="outline" size="sm" onClick={onShuffle} className="w-full">
              Shuffle
            </Button>
            <Button variant="outline" size="sm" onClick={onSeedByRank} className="w-full">
              <ListOrderedIcon className="size-3 mr-1" />
              Seed
            </Button>
          </div>

          <Button variant="outline" size="sm" onClick={onAutoSchedule} className="w-full">
            Auto-Schedule (Start +1h)
          </Button>

          <div className="grid grid-cols-3 gap-2">
            <Button variant="outline" size="sm" onClick={onExport} className="w-full">
              Export
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const input = document.createElement("input")
                input.type = "file"
                input.accept = "application/json"
                input.onchange = (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0]
                  if (!file) return
                  const reader = new FileReader()
                  reader.onload = (e) => {
                    const content = e.target?.result as string
                    onImport(content)
                  }
                  reader.readAsText(file)
                }
                input.click()
              }}
              className="w-full"
            >
              Import
            </Button>
            <Button variant="outline" size="sm" onClick={onDuplicate} className="w-full">
              <CopyIcon className="size-3 mr-1" />
              Copy
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
