import type { MDXComponents } from "mdx/types";
import type { ComponentProps } from "react";

import defaultMdxComponents from "fumadocs-ui/mdx";
import { CodeBlockTabsList } from "fumadocs-ui/components/codeblock";
import { SquareTerminal } from "lucide-react";
import { SingleEliminationPreview, SingleEliminationSimplePreview } from "@/components/preview/single-elimination-preview";
import { SwissStagePreview } from "@/components/preview/swiss-stage-preview";
import { GroupStagePreview } from "@/components/preview/group-stage-preview";
import {
  MatchCardPreview,
  MatchCardLive,
  MatchCardUpcoming,
  MatchCardScheduled,
  MatchCardTBD,
} from "@/components/preview/match-card-preview";
import {
  DoubleEliminationPreview,
  DoubleEliminationRatio2,
  DoubleEliminationLBStartsEarlier,
  DoubleEliminationSimplePreview,
} from "@/components/preview/double-elimination-preview";

function CustomCodeBlockTabsList({ children, ...props }: ComponentProps<typeof CodeBlockTabsList>) {
  return (
    <CodeBlockTabsList {...props}>
      <SquareTerminal className="size-3.5 self-center" />
      {children}
    </CodeBlockTabsList>
  );
}

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    CodeBlockTabsList: CustomCodeBlockTabsList,
    SingleEliminationPreview,
    SingleEliminationSimplePreview,
    SwissStagePreview,
    GroupStagePreview,
    MatchCardPreview,
    MatchCardLive,
    MatchCardUpcoming,
    MatchCardScheduled,
    MatchCardTBD,
    DoubleEliminationPreview,
    DoubleEliminationRatio2,
    DoubleEliminationLBStartsEarlier,
    DoubleEliminationSimplePreview,
    ...components,
  };
}
