import { Metadata } from "next";
import Link from "next/link";

import { PageActions, PageHeader, PageHeaderDescription, PageHeaderHeading } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/config";

const title = "Build tournaments with ease"
const description = siteConfig.description

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    images: [
      {
        url: `/og?title=${encodeURIComponent(
          title
        )}&description=${encodeURIComponent(description)}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [
      {
        url: `/og?title=${encodeURIComponent(
          title
        )}&description=${encodeURIComponent(description)}`,
      },
    ],
  },
}

import { MatchCardExample } from "@/app/(home)/components/match-card-example";

export default function HomePage() {
  return (
    <div className="flex flex-1 flex-col">
      <PageHeader>
        <PageHeaderHeading className="max-w-4xl">{title}</PageHeaderHeading>
        <PageHeaderDescription>{description}</PageHeaderDescription>
        <PageActions>
          <Button nativeButton={false} render={<Link href="/docs">Get Started</Link>} size="sm" className="h-[31px] rounded-lg" />
        </PageActions>
      </PageHeader>
      <div className="container-wrapper section-soft flex-1 pb-6">
        <div className="container overflow-hidden">
          <section className="theme-container hidden md:block">
            <MatchCardExample />
          </section>
        </div>
      </div>
    </div>
  );
}
