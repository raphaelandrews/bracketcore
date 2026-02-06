"use client"

import { Button } from "@/components/ui/button"

interface SettingsPanelProps {
  connectorStyle: "default" | "simple"
  onConnectorStyleChange: (style: "default" | "simple") => void
  bestOf: number
  onBestOfChange: (bestOf: number) => void
}

export function SettingsPanel({
  connectorStyle,
  onConnectorStyleChange,
  bestOf,
  onBestOfChange,
}: SettingsPanelProps) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-muted-foreground">Settings</p>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Connector</span>
          <div className="flex gap-1">
            <Button
              size="xs"
              variant={connectorStyle === "default" ? "default" : "outline"}
              onClick={() => onConnectorStyleChange("default")}
            >
              Curved
            </Button>
            <Button
              size="xs"
              variant={connectorStyle === "simple" ? "default" : "outline"}
              onClick={() => onConnectorStyleChange("simple")}
            >
              Straight
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Best of</span>
          <div className="flex gap-1">
            {[1, 3, 5, 7].map((num) => (
              <Button
                key={num}
                size="xs"
                variant={bestOf === num ? "default" : "outline"}
                onClick={() => onBestOfChange(num)}
              >
                {num}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
