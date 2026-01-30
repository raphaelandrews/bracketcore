import type { MDXComponents } from "mdx/types";

import defaultMdxComponents from "fumadocs-ui/mdx";
import { SingleEliminationPreview } from "@/components/preview/single-elimination-preview";
import { DoubleEliminationPreview } from "@/components/preview/double-elimination-preview";
import { SwissStagePreview } from "@/components/preview/swiss-stage-preview";
import { GroupStagePreview } from "@/components/preview/group-stage-preview";
import { MatchCardPreview } from "@/components/preview/match-card-preview";

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    SingleEliminationPreview,
    DoubleEliminationPreview,
    SwissStagePreview,
    GroupStagePreview,
    MatchCardPreview,
    ...components,
  };
}
