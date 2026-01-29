import type { GroupStageBracket, Match, Group } from "../types";
import { MatchCard } from "./match-card";
import { cn } from "../lib/cn";

export interface GroupStageProps {
  bracket: GroupStageBracket;
  className?: string;
  onMatchClick?: (match: Match) => void;
}

function GroupTable({ group }: { group: Group }) {
  return (
    <div className="rounded border border-border bg-card">
      <h3 className="text-sm font-medium px-3 py-2 border-b border-border">
        {group.name}
      </h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-muted-foreground">
            <th className="text-left py-2 px-3 font-medium">#</th>
            <th className="text-left py-2 px-3 font-medium">Team</th>
            <th className="text-center py-2 px-3 font-medium">W</th>
            <th className="text-center py-2 px-3 font-medium">D</th>
            <th className="text-center py-2 px-3 font-medium">L</th>
            <th className="text-center py-2 px-3 font-medium">+/-</th>
            <th className="text-center py-2 px-3 font-medium">Pts</th>
          </tr>
        </thead>
        <tbody>
          {group.standings.map((s, i) => (
            <tr
              key={s.team.id}
              className="border-b border-border last:border-0"
            >
              <td className="py-2 px-3 text-muted-foreground">{i + 1}</td>
              <td className="py-2 px-3 flex items-center gap-2">
                {s.team.logo && (
                  <img
                    src={s.team.logo}
                    alt={s.team.name}
                    className="h-4 w-4 object-contain"
                  />
                )}
                {s.team.name}
              </td>
              <td className="py-2 px-3 text-center tabular-nums">{s.wins}</td>
              <td className="py-2 px-3 text-center tabular-nums">{s.draws}</td>
              <td className="py-2 px-3 text-center tabular-nums">
                {s.losses}
              </td>
              <td className="py-2 px-3 text-center tabular-nums">
                {s.differential > 0 ? `+${s.differential}` : s.differential}
              </td>
              <td className="py-2 px-3 text-center tabular-nums font-medium">
                {s.points}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function GroupMatches({
  group,
  onMatchClick,
}: {
  group: Group;
  onMatchClick?: (match: Match) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <h4 className="text-sm font-medium text-muted-foreground">
        {group.name} — Matches
      </h4>
      <div className="flex flex-wrap gap-4">
        {group.matches.map((match) => (
          <MatchCard key={match.id} match={match} onMatchClick={onMatchClick} />
        ))}
      </div>
    </div>
  );
}

export function GroupStage({
  bracket,
  className,
  onMatchClick,
}: GroupStageProps) {
  return (
    <div className={cn("flex flex-col gap-8 p-4", className)}>
      {/* Standings tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {bracket.groups.map((group) => (
          <GroupTable key={group.name} group={group} />
        ))}
      </div>

      {/* Match cards per group */}
      <div className="flex flex-col gap-6">
        {bracket.groups.map((group) => (
          <GroupMatches
            key={group.name}
            group={group}
            onMatchClick={onMatchClick}
          />
        ))}
      </div>
    </div>
  );
}
