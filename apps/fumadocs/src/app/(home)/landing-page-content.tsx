"use client";

import { HeroSection } from "./components/hero-section";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

export function LandingPageContent() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">
        <HeroSection />
      </main>

      <Footer />
    </div>
  );
}
