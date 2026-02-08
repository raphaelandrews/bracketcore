import { Metadata } from "next";
import { Geist } from "next/font/google";
import { RootProvider } from "fumadocs-ui/provider/next";

import "./global.css";
import { siteConfig } from "@/lib/config";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "react",
    "tournament",
    "bracket",
    "components",
    "shadcn",
    "ui",
    "single-elimination",
    "double-elimination",
    "swiss",
    "group-stage",
  ],
  authors: [
    {
      name: "Raphael Andrews",
      url: "https://andrews.sh/",
    },
  ],
  creator: "Raphael Andrews",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    creator: "@_andrewssh",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: `${siteConfig.url}/site.webmanifest`,
};

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={geist.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
