"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, BracketsIcon, TwitterIcon, GithubIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet'
import { SearchToggleLarge } from '@/components/layout/docs'
import { ThemeToggle } from '@/components/layout/theme-toggle'

export function LandingNavbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link href="/" className="flex items-center space-x-2 cursor-pointer">
            <BracketsIcon size={32} />
            <span className="font-bold">
              Bracketcore
            </span>
          </Link>
        </div>

        <div className="hidden xl:flex items-center space-x-2">
          <ThemeToggle />
          <Button variant="ghost" size="icon" className="cursor-pointer" nativeButton={false} render={<a href="https://github.com/raphaelandrews/bracketcore" target="_blank" rel="noopener noreferrer" aria-label="GitHub Repository" />}>
            <GithubIcon className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="cursor-pointer" nativeButton={false} render={<a href="https://x.com/_andrewssh" target="_blank" rel="noopener noreferrer" aria-label="Twitter" />}>
            <TwitterIcon className="h-5 w-5" />
          </Button>
          <SearchToggleLarge />
          <Button className="cursor-pointer" nativeButton={false} render={<Link href="/docs" />}>
            Docs
          </Button>
        </div>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger className="xl:hidden" render={
            <Button variant="ghost" size="icon" className="cursor-pointer">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          } />
          <SheetContent side="right" className="w-full sm:w-[400px] p-0 gap-0 [&>button]:hidden overflow-hidden flex flex-col">
            <div className="flex flex-col h-full">
              <SheetHeader className="space-y-0 p-4 pb-2 border-b">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <BracketsIcon size={16} />
                  </div>
                  <SheetTitle className="text-lg font-semibold">Bracketcore</SheetTitle>
                  <div className="ml-auto flex items-center gap-2">
                    <ThemeToggle />
                    <Button variant="ghost" size="icon" className="cursor-pointer h-8 w-8" nativeButton={false} render={<a href="https://github.com/raphaelandrews/bracketcore" target="_blank" rel="noopener noreferrer" aria-label="GitHub Repository" />}>
                      <GithubIcon className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="cursor-pointer h-8 w-8" nativeButton={false} render={<a href="https://x.com/_andrewssh" target="_blank" rel="noopener noreferrer" aria-label="Twitter" />}>
                      <TwitterIcon className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="cursor-pointer h-8 w-8">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </SheetHeader>

              <div className="border-t p-6 space-y-4">
                <div className="space-y-3">
                  <div className="grid grid-cols-1 gap-3">
                    <Button size="lg" className="cursor-pointer" nativeButton={false} render={<Link href="/docs" />}>
                      Docs
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
