import { NextResponse } from "next/server";
import { getBunkerEmbedOrigin } from "@/lib/embed-proxy";
import { parseExternalSurvivors } from "@/lib/external-survivors";

export const runtime = "nodejs";

export async function GET() {
  const url = `${getBunkerEmbedOrigin()}/api/survivors`;

  try {
    const res = await fetch(url, {
      headers: { accept: "application/json" },
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        {
          ok: false,
          error: "Failed to fetch external survivors",
          details: `${res.status} ${res.statusText}`,
        },
        { status: 502 },
      );
    }

    const raw = await res.json();
    const items = parseExternalSurvivors(raw);

    return NextResponse.json({
      ok: true,
      data: { items, source: url },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { ok: false, error: "External survivors unreachable", details: message },
      { status: 502 },
    );
  }
}
