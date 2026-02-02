import { DocsLayout } from "fumadocs-ui/layouts/docs";

import { baseOptions } from "@/lib/layout.shared";
import { source } from "@/lib/source";
import { Footer } from "@/components/footer";

export default function Layout({ children }: LayoutProps<"/docs">) {
  return (
    <DocsLayout tree={source.getPageTree()} {...baseOptions()}>
      <div className="flex flex-col">
        <div className="flex-1 min-h-[calc(100vh-4rem)]">{children}</div>
        <Footer />
      </div>
    </DocsLayout>
  );
}
