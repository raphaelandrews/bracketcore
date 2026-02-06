"use client"

import Link from 'next/link'
import { GithubIcon, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DotPattern } from '@/components/dot-pattern'
import {
  useBracketEditor,
  BracketCanvas,
  ControlPanel,
} from "./bracket-editor"

export function HeroSection() {
  const {
    teams,
    bracket,
    bestOf,
    setBestOf,
    connectorStyle,
    setConnectorStyle,
    selectedMatch,
    isPanelExpanded,
    togglePanel,
    handleTeamNameChange,
    handleMatchClick,
    handleMatchUpdate,
    handleReset,
    handleShuffle,
    handleAutoSchedule,
    handleImport,
    handleExport,
  } = useBracketEditor()

  return (
    <section id="hero" className="relative overflow-hidden bg-gradient-to-b from-background to-background/80 pt-16 sm:pt-20 pb-16">
      <div className="absolute inset-0">
        <DotPattern className="opacity-100" size="md" fadeStyle="ellipse" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            Build Better
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {" "}Tournament Brackets{" "}
            </span>
            with Bracketcore
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            A comprehensive collection of tournament bracket components, built with shadcn/ui. Open source, accessible, and ready to drop into your next project.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" className="text-base cursor-pointer" nativeButton={false} render={<Link href="/docs" />}>
              <FileText size={16} />
              Read the Docs
            </Button>
            <Button variant="outline" size="lg" className="text-base cursor-pointer" nativeButton={false} render={<a href="https://github.com/raphaelandrews/bracketcore" target="_blank" rel="noopener noreferrer" />}>
              <GithubIcon size={16} />
              Star on GitHub
            </Button>
          </div>
        </div>

        <div className="mx-auto mt-20 max-w-6xl">
          <div className="relative group">
            <div className="absolute top-2 lg:-top-8 left-1/2 transform -translate-x-1/2 w-[90%] mx-auto h-24 lg:h-80 bg-primary/50 rounded-full blur-3xl"></div>

            <div className="relative overflow-hidden rounded-xl border bg-background shadow-2xl">
              {/* Window Controls */}
              <div className="flex items-center gap-2 px-4 py-3 border-b bg-muted/30">
                <div className="flex gap-1.5">
                  <div className="size-3 rounded-full bg-red-500/20 border border-red-500/50" />
                  <div className="size-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                  <div className="size-3 rounded-full bg-green-500/20 border border-green-500/50" />
                </div>
                <div className="flex-1 text-center text-xs font-medium text-muted-foreground/50">
                  bracketcore-editor.tsx
                </div>
                <div className="w-10" /> {/* Spacer for centering */}
              </div>

              <BracketCanvas
                bracket={bracket}
                connectorStyle={connectorStyle}
                onMatchClick={handleMatchClick}
              />

              <ControlPanel
                teams={teams}
                onTeamNameChange={handleTeamNameChange}
                connectorStyle={connectorStyle}
                onConnectorStyleChange={setConnectorStyle}
                bestOf={bestOf}
                onBestOfChange={setBestOf}
                selectedMatch={selectedMatch}
                onMatchUpdate={handleMatchUpdate}
                onReset={handleReset}
                onShuffle={handleShuffle}
                onAutoSchedule={handleAutoSchedule}
                onImport={handleImport}
                onExport={handleExport}
                isExpanded={isPanelExpanded}
                onToggle={togglePanel}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
