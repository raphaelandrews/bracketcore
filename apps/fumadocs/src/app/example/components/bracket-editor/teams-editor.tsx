"use client"

import type { Team } from "@bracketcore/registry"
import { Input } from "@/components/ui/input"

interface TeamsEditorProps {
  teams: Team[]
  onTeamNameChange: (index: number, name: string) => void
}

export function TeamsEditor({ teams, onTeamNameChange }: TeamsEditorProps) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-muted-foreground">Teams</p>
      <div className="grid grid-cols-2 gap-2">
        {teams.map((team, i) => (
          <div key={team.id} className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground shrink-0">
              {i + 1}.
            </span>
            <Input
              type="text"
              value={team.name}
              onChange={(e) => onTeamNameChange(i, e.target.value)}
              className="h-7 text-xs"
              aria-label={`Team ${i + 1} name`}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
