import { HomeLayout } from "fumadocs-ui/layouts/home";

import { baseOptions } from "@/lib/layout.shared";
import { HomeFooter } from "@/components/footer";

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <HomeLayout {...baseOptions()}>
      {children}
      <HomeFooter />
    </HomeLayout>
  );
}
