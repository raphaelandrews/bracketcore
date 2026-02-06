"use client";
import type * as PageTree from "fumadocs-core/page-tree";
import { type ComponentProps, createContext, type ReactNode, use, useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import { TreeContextProvider, useTreeContext } from "fumadocs-ui/contexts/tree";
import Link from "fumadocs-core/link";
import { useSearchContext } from "fumadocs-ui/contexts/search";
import { usePathname } from "fumadocs-core/framework";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

import { Button, buttonVariants } from "@/components/ui/button";
import { LargeSearchToggle } from "../search-toggle";

interface SidebarContext {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SidebarContext = createContext<SidebarContext | null>(null);

export interface DocsLayoutProps {
  tree: PageTree.Root;
  children: ReactNode;
}

export function DocsLayout({ tree, children }: DocsLayoutProps) {
  return (
    <TreeContextProvider tree={tree}>
      <SidebarProvider>
        <Header />
        <main id="nd-docs-layout" className="flex flex-1 flex-row [--fd-nav-height:56px]">
          <Sidebar />
          {children}
        </main>
        <Footer />
      </SidebarProvider>
    </TreeContextProvider>
  );
}

function SidebarProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <SidebarContext
      value={useMemo(
        () => ({
          open,
          setOpen,
        }),
        [open],
      )}
    >
      {children}
    </SidebarContext>
  );
}

export function SearchToggle(props: ComponentProps<"button">) {
  const { enabled, setOpenSearch } = useSearchContext();
  if (!enabled) return;

  return (
    <Button
      value="default"
      {...props}
      className={cn("text-sm", props.className)}
      onClick={() => setOpenSearch(true)}
    >
      Search
    </Button>
  );
}

export function SearchToggleLarge(props: ComponentProps<"button">) {
  const { enabled, setOpenSearch } = useSearchContext();
  if (!enabled) return;

  return (
    <LargeSearchToggle
      value="default"
      {...props}
      className={cn("text-sm", props.className)}
      onClick={() => setOpenSearch(true)}
    />
  );
}

export function NavbarSidebarTrigger(props: ComponentProps<"button">) {
  const context = use(SidebarContext);

  if (!context) {
    return null;
  }

  const { open, setOpen } = context;

  return (
    <button {...props} className={cn("text-sm", props.className)} onClick={() => setOpen(!open)}>
      Sidebar
    </button>
  );
}

function Sidebar() {
  const { root } = useTreeContext();
  const { open } = use(SidebarContext)!;

  const children = useMemo(() => {
    function renderItems(items: PageTree.Node[]) {
      return items.map((item) => (
        <SidebarItem key={item.$id} item={item}>
          {item.type === "folder" ? renderItems(item.children) : null}
        </SidebarItem>
      ));
    }

    return renderItems(root.children);
  }, [root]);

  return (
    <aside
      className={cn(
        "fixed flex flex-col shrink-0 p-4 top-14 z-20 text-sm overflow-auto md:sticky md:h-[calc(100dvh-56px)] md:w-[300px]",
        "max-md:inset-x-0 max-md:bottom-0 max-md:bg-background",
        !open && "max-md:invisible",
      )}
    >
      <div className="w-full max-w-[200px] mx-auto mt-9">{children}</div>
    </aside>
  );
}

function SidebarItem({ item, children }: { item: PageTree.Node; children: ReactNode }) {
  const pathname = usePathname();

  if (item.type === "page") {
    return (
      <Link href={item.url} className="group flex w-full items-center justify-start">
        <span
          className={cn(
            buttonVariants({
              variant: pathname === item.url ? "secondary" : "ghost",
              size: "xs",
            }),
            "text-[.8rem] h-7.5 ",
            pathname === item.url
              ? "group-hover:bg-secondary/80"
              : "group-hover:bg-muted group-hover:text-foreground dark:group-hover:bg-muted/50",
          )}
        >
          {item.icon}
          {item.name}
        </span>
      </Link>
    );
  }

  if (item.type === "separator") {
    return (
      <p className="font-medium text-xs text-muted-foreground mt-6 mb-2 px-2.5 first:mt-0">
        {item.icon}
        {item.name}
      </p>
    );
  }

  return (
    <div>
      {item.index ? (
        <Link className="group flex w-full items-center justify-start" href={item.index.url}>
          <span
            className={cn(
              buttonVariants({
                variant: pathname === item.index.url ? "secondary" : "ghost",
                size: "xs",
              }),
              "text-[.8rem] h-7.5 ",
              pathname === item.index.url
                ? "group-hover:bg-secondary/80"
                : "group-hover:bg-muted group-hover:text-foreground dark:group-hover:bg-muted/50",
            )}
          >
            {item.index.icon}
            {item.index.name}
          </span>
        </Link>
      ) : (
        <p
          className={cn(
            buttonVariants({ variant: "ghost", size: "xs" }),
            "justify-start w-full text-start text-[.8rem] h-7.5 ",
          )}
        >
          {item.icon}
          {item.name}
        </p>
      )}
      <div className="pl-4 border-l flex flex-col">{children}</div>
    </div>
  );
}
