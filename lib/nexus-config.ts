/** Hosted NEXUS API (Vercel). Browser never calls this directly — use `/api/*` proxy routes. */
export const HOSTED_API_URL =
  process.env.NEXUS_API_PROXY_TARGET?.replace(/\/$/, "") ??
  "https://nexus-core-ag.vercel.app";

const IS_DEV = process.env.NODE_ENV === "development";

const BUNKER_DEFAULT = "http://69.28.90.158:3001";
const HARVEST_DEFAULT = "https://harvest-bunker.lovable.app";

/** Remote bunker / archive app (open-in-tab + dev iframe src). */
export const BUNKER_EXTERNAL_URL =
  process.env.NEXT_PUBLIC_BUNKER_EXTERNAL_URL?.replace(/\/$/, "") ?? BUNKER_DEFAULT;

/** @deprecated use BUNKER_EXTERNAL_URL */
export const EXTERNAL_SURVIVORS_API_URL = BUNKER_EXTERNAL_URL;

export const HARVEST_EXTERNAL_URL =
  process.env.NEXT_PUBLIC_HARVEST_EXTERNAL_URL?.replace(/\/$/, "") ?? HARVEST_DEFAULT;

/**
 * Dev: load embed targets directly (localhost is HTTP, no mixed-content block).
 * Prod: same-origin /embed/* proxy (see lib/embed-proxy.ts).
 */
function embedSrc(devUrl: string, prodProxyPath: string, envOverride?: string) {
  if (IS_DEV) return devUrl;
  const override = envOverride?.replace(/\/$/, "");
  if (override && !override.startsWith("http://")) return override;
  if (override?.startsWith("http://")) return prodProxyPath;
  return prodProxyPath;
}

export const ARCHIVE_EMBED_URL = embedSrc(
  BUNKER_EXTERNAL_URL,
  "/embed/bunker",
  process.env.NEXT_PUBLIC_ARCHIVE_EMBED_URL,
);

export const ARCHIVE_OPEN_URL =
  process.env.NEXT_PUBLIC_ARCHIVE_OPEN_URL?.replace(/\/$/, "") ?? BUNKER_EXTERNAL_URL;

export const MEDICAL_EMBED_URL = embedSrc(
  `${BUNKER_EXTERNAL_URL}/api-docs`,
  "/embed/bunker/api-docs",
  process.env.NEXT_PUBLIC_MEDICAL_EMBED_URL,
);

export const MEDICAL_OPEN_URL =
  process.env.NEXT_PUBLIC_MEDICAL_OPEN_URL?.replace(/\/$/, "") ??
  `${BUNKER_EXTERNAL_URL}/api-docs`;

export const HARVEST_EMBED_URL = embedSrc(
  HARVEST_EXTERNAL_URL,
  "/embed/harvest",
  process.env.NEXT_PUBLIC_HARVEST_EMBED_URL,
);

export const HARVEST_OPEN_URL =
  process.env.NEXT_PUBLIC_HARVEST_OPEN_URL?.replace(/\/$/, "") ?? HARVEST_EXTERNAL_URL;

export const SECTOR_EMBED_PATHS = [
  "/dashboard/archive",
  "/dashboard/medical",
  "/dashboard/harvesting",
] as const;

export function isSectorEmbedPath(pathname: string) {
  return (SECTOR_EMBED_PATHS as readonly string[]).includes(pathname);
}

export function embedHostLabel(src: string, openUrl?: string) {
  const label = openUrl ?? src;
  return label.replace(/^https?:\/\//, "").replace(/^\//, "");
}
