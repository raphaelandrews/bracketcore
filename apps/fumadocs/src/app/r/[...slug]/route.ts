import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

export async function GET(request: Request, { params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const filename = slug.join("/");

  if (!filename.endsWith(".json")) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const registryPath = path.join(
      process.cwd(),
      "..",
      "..",
      "packages",
      "registry",
      "public",
      "r",
      filename,
    );

    const content = await fs.readFile(registryPath, "utf-8");
    return new NextResponse(content, {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
