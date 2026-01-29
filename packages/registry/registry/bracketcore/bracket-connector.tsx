import { cn } from "@/bracketcore/cn";

export interface BracketConnectorProps {
  sourceCount: number;
  targetCount: number;
  matchHeight?: number;
  matchGap?: number;
  className?: string;
}

export function BracketConnector({
  sourceCount,
  targetCount,
  matchHeight = 72,
  matchGap = 24,
  className,
}: BracketConnectorProps) {
  const sourceSlot = matchHeight + matchGap;
  const targetSlot =
    targetCount > 0
      ? (sourceCount * sourceSlot) / targetCount
      : sourceSlot;

  const width = 32;
  const totalHeight = sourceCount * sourceSlot;
  const halfMatch = matchHeight / 2;
  const midX = width / 2;

  const paths: string[] = [];

  for (let t = 0; t < targetCount; t++) {
    const topSourceIdx = t * 2;
    const botSourceIdx = t * 2 + 1;

    if (botSourceIdx >= sourceCount) break;

    const topY = topSourceIdx * sourceSlot + halfMatch;
    const botY = botSourceIdx * sourceSlot + halfMatch;
    const targetY = t * targetSlot + targetSlot / 2;

    paths.push(`M 0 ${topY} H ${midX}`);
    paths.push(`M 0 ${botY} H ${midX}`);
    paths.push(`M ${midX} ${topY} V ${botY}`);
    paths.push(`M ${midX} ${targetY} H ${width}`);
  }

  return (
    <svg
      width={width}
      height={totalHeight}
      className={cn("shrink-0", className)}
      aria-hidden
    >
      <path
        d={paths.join(" ")}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className="text-border"
      />
    </svg>
  );
}
