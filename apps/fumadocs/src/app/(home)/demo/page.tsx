import { SingleEliminationDemo } from "./single-elimination-demo";

export default function DemoPage() {
  return (
    <div className="flex flex-col gap-10 p-6 md:p-10 min-h-screen">
      <div>
        <h1 className="text-2xl font-bold mb-1">Single Elimination Bracket</h1>
        <p className="text-muted-foreground text-sm">
          TI 2025 Playoffs — 8 teams, BO3 quarterfinals through BO5 grand
          final.
        </p>
      </div>

      <SingleEliminationDemo />
    </div>
  );
}
