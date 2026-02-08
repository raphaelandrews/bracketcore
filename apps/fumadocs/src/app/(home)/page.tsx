import { Metadata } from "next";

import { siteConfig } from "@/lib/config";
import { LandingPageContent } from "./landing-page-content";

export const metadata: Metadata = {
  description: siteConfig.description,
};

export default function LandingPage() {
  return <LandingPageContent />;
}
