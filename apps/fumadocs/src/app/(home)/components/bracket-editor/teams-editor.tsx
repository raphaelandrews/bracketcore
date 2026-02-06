"use client"

import type { Team } from "@bracketcore/registry"
import { Input } from "@/components/ui/input"
import { UsersIcon } from "lucide-react"

interface TeamsEditorProps {
  teams: Team[]
  onTeamNameChange: (index: number, name: string) => void
}

export function TeamsEditor({ teams, onTeamNameChange }: TeamsEditorProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center size-6 rounded-md bg-primary/10 text-primary">
          <UsersIcon className="size-3.5" />
        </div>
        <h3 className="text-sm font-medium">Teams</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {teams.map((team, i) => (
          <div key={team.id} className="relative">
            <div className="absolute left-2.5 top-1/2 -translate-y-1/2 flex items-center justify-center size-4 rounded-full bg-muted text-[10px] font-medium text-muted-foreground">
              {i + 1}
            </div>
            <Input
              type="text"
              value={team.name}
              onChange={(e) => onTeamNameChange(i, e.target.value)}
              className="h-8 pl-8 text-sm"
              aria-label={`Team ${i + 1} name`}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
