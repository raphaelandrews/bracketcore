import { Metadata } from "next";
import Link from "next/link";
import { FileTextIcon, GithubIcon, TwitterIcon } from "lucide-react";
import { SingleEliminationExample } from "@/app/(home)/components/single-elimination-example";
import { DoubleEliminationExample } from "@/app/(home)/components/double-elimination-example";
import { SwissStageExample } from "@/app/(home)/components/swiss-stage-example";
import { GroupStageExample } from "@/app/(home)/components/group-stage-example";

import { Button } from "@/components/ui/button";
import { MatchCardExample } from "./components/match-card-example";
import { MatchCardMinimalExample } from "./components/match-card-minimal-example";

const title = "BracketCore"
const description = "Components for tournaments"

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
    <div className="flex flex-col justify-center items-center w-full min-h-dvh overflow-y-auto md:overflow-hidden">
      <div className="flex flex-col justify-center items-center gap-2">
        <h1 className="text-2xl font-bold text-center">{title}</h1>
        <p className="text-center text-balance text-muted-foreground">{description}</p>

        <div className="flex gap-2 mt-4">
          <Button nativeButton={false} variant="default" size="sm" render={
            <Link href="/docs" className="flex items-center gap-2">
              Docs
              <FileTextIcon data-icon="inline-end" />
            </Link>
          } />

          <Button nativeButton={false} variant="outline" size="sm" render={
            <Link href="https://github.com/raphaelandrews/bracketcore" target="_blank" className="flex items-center gap-2">
              Github
              <GithubIcon data-icon="inline-end" />
            </Link>
          } />

          <Button nativeButton={false} variant="outline" size="sm" render={
            <Link href="https://x.com/_andrewssh" target="_blank" className="flex items-center gap-2">
              Twitter
              <TwitterIcon data-icon="inline-end" />
            </Link>
          } />
        </div>

        <Link href="/docs" className="mt-6">
          <div className="flex flex-col gap-2 justify-center items-center rounded-lg bg-card/40 border">
            <DoubleEliminationExample />
          </div>
        </Link>
      </div>
    </div>
  );
}
