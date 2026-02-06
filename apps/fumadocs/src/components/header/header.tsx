import { Suspense } from "react";
import { GithubIcon, InstagramIcon, MailIcon, MenuIcon, TwitterIcon } from "lucide-react";

import { MainNav } from "./main-nav";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { NavbarSidebarTrigger, SearchToggleLarge } from "../layout/docs";
import { ThemeToggle } from "../layout/theme-toggle";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Suspense fallback={<MainNavSkeleton />}>
          <MainNav />
        </Suspense>
        <div className="ml-auto flex items-center gap-2 md:flex-1 md:justify-end">
          <div className="flex w-full flex-1 md:w-auto md:flex-none">
            <SearchToggleLarge />
          </div>
          <NavbarSidebarTrigger className="md:hidden" />
          <Separator className="!w-0.5 !h-4 ml-2 !self-auto" orientation="vertical" />
          <Button size="sm" variant="ghost" className="hidden sm:block p-2 hover:cursor-pointer">
            <a href="https://github.com/raphaelandrews/bracketcore" target="_blank" rel="noopener">
              <GithubIcon size={16} />
              <span className="sr-only">Github</span>
            </a>
          </Button>
          <Separator className="!w-0.5 !h-4 hidden sm:block !self-auto" orientation="vertical" />
          <Button size="sm" variant="ghost" className="hidden sm:block p-2 hover:cursor-pointer">
            <a href="https://x.com/_andrewssh" target="_blank" rel="noopener">
              <TwitterIcon size={16} />
              <span className="sr-only">Twitter</span>
            </a>
          </Button>
          <Separator className="!w-0.5 !h-4 !self-auto" orientation="vertical" />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

function MainNavSkeleton() {
  return (
    <div className="mr-4 flex">
      <div className="mr-4 flex items-center space-x-2 lg:mr-6">
        <span className="mt-0.5 font-bold">Bracketcore</span>
      </div>
    </div>
  );
}
