import { Metadata } from "next";

import { siteConfig } from "@/lib/config";
import { BracketBuilder } from "./components/bracket-builder";

export const metadata: Metadata = {
  description: siteConfig.description,
  openGraph: {
    images: [
      {
        url: `/og?title=${encodeURIComponent(
          siteConfig.title,
        )}&description=${encodeURIComponent(siteConfig.description)}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [
      {
        url: `/og?title=${encodeURIComponent(
          siteConfig.title,
        )}&description=${encodeURIComponent(siteConfig.description)}`,
      },
    ],
  },
};

export default function HomePage() {
  return <BracketBuilder />;
}
