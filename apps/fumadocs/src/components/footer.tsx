import { siteConfig } from "@/lib/config";

export function Footer() {
  return (
    <footer className="py-6 md:px-8 md:py-0">
      <div className="container-wrapper px-4 xl:px-6">
        <div className="flex h-14 lg:h-24 items-center justify-between">
          <div className="text-muted-foreground w-full px-1 text-center text-xs leading-loose sm:text-sm">
            Built by{" "}
            <a
              href={siteConfig.links.twitter}
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4 text-[#8aadf4] hover:text-[#eed49f] transition"
            >
              Andrews
            </a>{" "}
            . The source code is available on{" "}
            <a
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              GitHub
            </a>
            .
          </div>
        </div>
      </div>
    </footer>
  );
}
