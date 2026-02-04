import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

import { siteConfig } from "./config";

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: "Bracketcore",
    },
    githubUrl: siteConfig.links.github,
  };
}
