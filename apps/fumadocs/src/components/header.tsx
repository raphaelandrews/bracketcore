"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, BracketsIcon, TwitterIcon, GithubIcon, NetworkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { SearchToggleLarge } from "@/components/layout/docs";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link href="/" className="flex items-center space-x-2 cursor-pointer">
            <NetworkIcon size={24} className="rotate-90" />
            <span className="font-bold">Bracketcore</span>
          </Link>
        </div>

        <div className="hidden xl:flex items-center space-x-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="cursor-pointer"
            nativeButton={false}
            render={
              <a
                href="https://github.com/raphaelandrews/bracketcore"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Repository"
              />
            }
          >
            <GithubIcon className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="cursor-pointer"
            nativeButton={false}
            render={
              <a
                href="https://x.com/_andrewssh"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
              />
            }
          >
            <TwitterIcon className="h-5 w-5" />
          </Button>
          <SearchToggleLarge />
          <Button className="cursor-pointer" nativeButton={false} render={<Link href="/docs" />}>
            Docs
          </Button>
        </div>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger
            className="xl:hidden"
            render={
              <Button variant="ghost" size="icon" className="cursor-pointer">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            }
          />
          <SheetContent
            side="right"
            className="w-full sm:w-[400px] p-0 gap-0 [&>button]:hidden overflow-hidden flex flex-col"
          >
            <div className="flex flex-col h-full bg-background">
              <SheetHeader className="p-4 border-b flex flex-row items-center justify-between space-y-0">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-primary/10 rounded-lg">
                    <NetworkIcon size={18} className="rotate-90" />
                  </div>
                  <SheetTitle className="text-base font-bold">Bracketcore</SheetTitle>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8 rounded-full"
                >
                  <X className="h-4 w-4" />
                </Button>
              </SheetHeader>

              <div className="flex-1 overflow-y-auto py-6 px-4">
                <div className="flex flex-col gap-2">
                  <Button
                    size="lg"
                    className="w-full justify-start text-base"
                    nativeButton={false}
                    render={<Link href="/docs" />}
                  >
                    Docs
                  </Button>
                  <Button
                    variant="ghost"
                    size="lg"
                    className="w-full justify-start text-base"
                    nativeButton={false}
                    render={
                      <a
                        href="https://github.com/raphaelandrews/bracketcore"
                        target="_blank"
                        rel="noopener noreferrer"
                      />
                    }
                  >
                    GitHub
                  </Button>
                </div>
              </div>

              <div className="p-4 border-t bg-muted/30">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-9 w-9 rounded-full"
                      nativeButton={false}
                      render={
                        <a
                          href="https://github.com/raphaelandrews/bracketcore"
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="GitHub"
                        />
                      }
                    >
                      <GithubIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-9 w-9 rounded-full"
                      nativeButton={false}
                      render={
                        <a
                          href="https://x.com/_andrewssh"
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Twitter"
                        />
                      }
                    >
                      <TwitterIcon className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-muted-foreground mr-2">Theme</span>
                    <ThemeToggle />
                  </div>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
