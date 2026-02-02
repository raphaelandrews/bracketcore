import { Metadata } from "next";
import Link from "next/link";

import { siteConfig } from "@/lib/config";
import { Button } from "@/components/ui/button";

import { SingleEliminationExample } from "@/app/(home)/components/single-elimination-example";
import { DoubleEliminationExample } from "@/app/(home)/components/double-elimination-example";
import { SwissStageExample } from "@/app/(home)/components/swiss-stage-example";
import { GroupStageExample } from "@/app/(home)/components/group-stage-example";
import { MatchCardExample } from "@/app/(home)/components/match-card-example";
import { FileTextIcon } from "lucide-react";

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

export default function HomePage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="w-full h-px dotted-border-x" />

      <div className="container relative p-4 dotted-border-y">
        <h1 className="text-2xl font-bold text-center mt-2">{title}</h1>
        <p className="text-center text-balance mt-2 text-muted-foreground">{description}</p>
      </div>
      <div className="w-full h-px dotted-border-x" />

      <div className="container relative p-4 dotted-border-y flex justify-center">
        <Button nativeButton={false} render={<Link href="/docs">Get Started</Link>} size="sm" className="h-[31px] rounded-lg" />
      </div>

      <div className="w-full h-px dotted-border-x" />

      <div className="container relative p-4 dotted-border-y flex justify-between items-center">
        <h2 className="text-lg font-semibold leading-tight">Match Card</h2>
        <Button nativeButton={false} variant="outline" size="sm" render={
          <Link href="/docs/match-card" className="flex items-center gap-2">
            Docs
            <FileTextIcon data-icon="inline-end" />
          </Link>
        } />
      </div>
      <div className="w-full h-px dotted-border-x" />
      <div className="container relative p-4 dotted-border-y">
        <MatchCardExample />
      </div>
      <div className="w-full h-px dotted-border-x" />

      <div className="container relative p-4 dotted-border-y flex justify-between items-center">
        <h2 className="text-lg font-semibold leading-tight">Single Elimination</h2>
        <Button nativeButton={false} variant="outline" size="sm" render={
          <Link href="/docs/single-elimination" className="flex items-center gap-2">
            Docs
            <FileTextIcon data-icon="inline-end" />
          </Link>
        } />
      </div>
      <div className="w-full h-px dotted-border-x" />
      <div className="container relative p-4 dotted-border-y">
        <SingleEliminationExample />
      </div>
      <div className="w-full h-px dotted-border-x" />

      <div className="container relative p-4 dotted-border-y flex justify-between items-center">
        <h2 className="text-lg font-semibold leading-tight">Double Elimination</h2>
        <Button nativeButton={false} variant="outline" size="sm" render={
          <Link href="/docs/double-elimination" className="flex items-center gap-2">
            Docs
            <FileTextIcon data-icon="inline-end" />
          </Link>
        } />
      </div>
      <div className="w-full h-px dotted-border-x" />
      <div className="container relative p-4 dotted-border-y">
        <DoubleEliminationExample />
      </div>
      <div className="w-full h-px dotted-border-x" />

      <div className="container relative p-4 dotted-border-y flex justify-between items-center">
        <h2 className="text-lg font-semibold leading-tight">Swiss Stage</h2>
        <Button nativeButton={false} variant="outline" size="sm" render={
          <Link href="/docs/swiss-stage" className="flex items-center gap-2">
            Docs
            <FileTextIcon data-icon="inline-end" />
          </Link>
        } />
      </div>
      <div className="w-full h-px dotted-border-x" />
      <div className="container relative p-4 dotted-border-y">
        <SwissStageExample />
      </div>
      <div className="w-full h-px dotted-border-x" />

      <div className="container relative p-4 dotted-border-y flex justify-between items-center">
        <h2 className="text-lg font-semibold leading-tight">Group Stage</h2>
        <Button nativeButton={false} variant="outline" size="sm" render={
          <Link href="/docs/group-stage" className="flex items-center gap-2">
            Docs
            <FileTextIcon data-icon="inline-end" />
          </Link>
        } />
      </div>
      <div className="w-full h-px dotted-border-x" />
      <div className="container relative p-4 dotted-border-y">
        <GroupStageExample />
      </div>
      <div className="w-full h-px dotted-border-x" />
    </div>
  );
}
