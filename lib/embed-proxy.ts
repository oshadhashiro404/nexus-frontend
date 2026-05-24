import { NextRequest, NextResponse } from "next/server";

const STRIP_HEADERS = new Set([
  "x-frame-options",
  "content-security-policy",
  "content-security-policy-report-only",
  "cross-origin-opener-policy",
  "cross-origin-embedder-policy",
  "cross-origin-resource-policy",
]);

export function getBunkerEmbedOrigin() {
  return (
    process.env.EXTERNAL_SURVIVORS_API_URL?.replace(/\/$/, "") ??
    "http://69.28.90.158:3001"
  );
}

export function getHarvestEmbedOrigin() {
  return (
    process.env.HARVEST_EMBED_PROXY_TARGET?.replace(/\/$/, "") ??
    process.env.HARVEST_EMBED_URL?.replace(/\/$/, "") ??
    "https://harvest-bunker.lovable.app"
  );
}

function copyHeaders(source: Headers) {
  const headers = new Headers();
  source.forEach((value, key) => {
    if (STRIP_HEADERS.has(key.toLowerCase())) return;
    headers.set(key, value);
  });
  return headers;
}

export async function proxyEmbedRequest(
  request: NextRequest,
  origin: string,
  pathSegments: string[],
) {
  const path = pathSegments.join("/");
  const target = `${origin.replace(/\/$/, "")}/${path}${request.nextUrl.search}`;

  const forward = new Headers();
  const accept = request.headers.get("accept");
  if (accept) forward.set("accept", accept);
  const userAgent = request.headers.get("user-agent");
  if (userAgent) forward.set("user-agent", userAgent);

  const upstream = await fetch(target, {
    method: request.method,
    headers: forward,
    redirect: "follow",
    cache: "no-store",
  });

  return new NextResponse(upstream.body, {
    status: upstream.status,
    headers: copyHeaders(upstream.headers),
  });
}
