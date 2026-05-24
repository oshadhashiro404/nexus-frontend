import { NextRequest } from "next/server";
import { getBunkerEmbedOrigin, proxyEmbedRequest } from "@/lib/embed-proxy";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ path?: string[] }> };

async function handle(request: NextRequest, context: RouteContext) {
  const { path = [] } = await context.params;
  return proxyEmbedRequest(request, getBunkerEmbedOrigin(), path);
}

export const GET = handle;
export const HEAD = handle;
