"use client"

import type { Team } from "@bracketcore/registry"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { UsersIcon, PlusIcon, XIcon, TrophyIcon, SwordsIcon, TargetIcon } from "lucide-react"
import { cn } from "@/lib/cn"
import type { TeamStats } from "./bracket-editor-types"
import { isByeTeam } from "./bracket-editor-types"

interface TeamsEditorProps {
  teams: Team[]
  onTeamNameChange: (teamId: string, name: string) => void
  onAddTeam: () => void
  onRemoveTeam: (teamId: string) => void
  teamStats: TeamStats[]
  showStats?: boolean
}

export function TeamsEditor({
  teams,
  onTeamNameChange,
  onAddTeam,
  onRemoveTeam,
  teamStats,
  showStats = false,
}: TeamsEditorProps) {
  // Sort teams by seed (or falling back to original index order if seeds are missing)
  const sortedTeams = [...teams].sort((a, b) => {
    if (isByeTeam(a) && !isByeTeam(b)) return 1
    if (!isByeTeam(a) && isByeTeam(b)) return -1
    return (a.seed || 0) - (b.seed || 0)
  })

  const realTeams = teams.filter((t) => !isByeTeam(t))
  const byeCount = teams.length - realTeams.length

  function getStats(teamId: string): TeamStats | undefined {
    return teamStats.find((s) => s.teamId === teamId)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center size-6 rounded-md bg-primary/10 text-primary">
            <UsersIcon className="size-3.5" />
          </div>
          <h3 className="text-sm font-medium">Teams</h3>
          <span className="text-xs text-muted-foreground">
            ({realTeams.length} teams{byeCount > 0 && `, ${byeCount} BYE${byeCount > 1 ? "s" : ""}`})
          </span>
        </div>
        <Button variant="outline" size="sm" onClick={onAddTeam} className="h-7">
          <PlusIcon className="size-3 mr-1" />
          Add Team
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {sortedTeams.map((team) => {
          const isBye = isByeTeam(team)
          const stats = !isBye ? getStats(team.id) : undefined
          const seedLabel = team.seed ? team.seed : "?"

          return (
            <div
              key={team.id}
              className={cn(
                "relative group",
                isBye && "opacity-50"
              )}
            >
              <div className="absolute left-2.5 top-1/2 -translate-y-1/2 flex items-center justify-center size-4 rounded-full bg-muted text-[10px] font-medium text-muted-foreground">
                {isBye ? "—" : seedLabel}
              </div>
              {isBye ? (
                <div className="h-8 pl-8 pr-3 flex items-center rounded-md border border-dashed bg-muted/30 text-sm text-muted-foreground">
                  BYE
                </div>
              ) : (
                <>
                  <Input
                    type="text"
                    value={team.name}
                    onChange={(e) => onTeamNameChange(team.id, e.target.value)}
                    className="h-8 pl-8 pr-8 text-sm"
                    aria-label={`Team ${seedLabel} name`}
                  />
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    className="absolute right-1 top-1/2 -translate-y-1/2 size-6 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                    onClick={() => onRemoveTeam(team.id)}
                    title="Remove team"
                  >
                    <XIcon className="size-3" />
                  </Button>
                </>
              )}

              {/* Mini stats display */}
              {showStats && stats && (
                <div className="mt-1 flex items-center gap-3 text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <SwordsIcon className="size-2.5" />
                    {stats.matchesWon}W-{stats.matchesLost}L
                  </span>
                  <span className="flex items-center gap-1">
                    <TargetIcon className="size-2.5" />
                    {stats.mapsWon}-{stats.mapsLost}
                  </span>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Stats Table (optional detailed view) */}
      {showStats && teamStats.length > 0 && (
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center gap-2 mb-3">
            <TrophyIcon className="size-4 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">Standings</span>
          </div>
          <div className="text-xs">
            <div className="grid grid-cols-5 gap-2 pb-2 border-b text-muted-foreground font-medium">
              <div className="col-span-2">Team</div>
              <div className="text-center">W-L</div>
              <div className="text-center">Maps</div>
              <div className="text-center">Diff</div>
            </div>
            {teamStats.map((stat, i) => (
              <div
                key={stat.teamId}
                className={cn(
                  "grid grid-cols-5 gap-2 py-1.5",
                  i < teamStats.length - 1 && "border-b border-dashed"
                )}
              >
                <div className="col-span-2 truncate font-medium">
                  <span className="text-muted-foreground mr-1">{i + 1}.</span>
                  {stat.teamName}
                </div>
                <div className="text-center tabular-nums">
                  {stat.matchesWon}-{stat.matchesLost}
                </div>
                <div className="text-center tabular-nums">
                  {stat.mapsWon}-{stat.mapsLost}
                </div>
                <div
                  className={cn(
                    "text-center tabular-nums",
                    stat.mapsWon - stat.mapsLost > 0 && "text-green-600 dark:text-green-400",
                    stat.mapsWon - stat.mapsLost < 0 && "text-red-600 dark:text-red-400"
                  )}
                >
                  {stat.mapsWon - stat.mapsLost > 0 && "+"}
                  {stat.mapsWon - stat.mapsLost}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
