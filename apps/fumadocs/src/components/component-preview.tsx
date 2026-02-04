"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";

export function ComponentPreview({
  children,
  code,
  className,
}: {
  children: React.ReactNode;
  code: string;
  className?: string;
}) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  return (
    <div className={cn("group relative my-4 flex flex-col", className)}>
      <div className="relative rounded-t-md">
        <div className="preview not-prose flex min-h-[200px] w-full items-center justify-center bg-card/40 rounded-t-md overflow-x-auto p-6">
          {children}
        </div>
      </div>

      <div className="relative">
        <div
          className={cn(
            "relative overflow-hidden rounded-b-md border-t-0 [&_figure]:my-0 [&_figure]:rounded-none [&_figure]:border-none [&_figure>div]:no-scrollbar [&_pre]:!text-sm/[1.5]",
            !isExpanded && "max-h-32",
          )}
        >
          <DynamicCodeBlock lang="tsx" code={code} codeblock={{ "data-line-numbers": true }} />
        </div>

        {!isExpanded && (
          <div className="absolute inset-x-0 bottom-0 pb-8 flex h-full max-h-32 items-end justify-center rounded-b-md bg-gradient-to-b from-transparent to-card">
            <Button variant="outline" size="sm" onClick={() => setIsExpanded(true)}>
              Expand
              <ChevronDown className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
