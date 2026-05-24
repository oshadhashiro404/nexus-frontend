/** Hosted NEXUS API (Vercel). Browser never calls this directly — use `/api/*` proxy routes. */
export const HOSTED_API_URL =
  process.env.NEXUS_API_PROXY_TARGET?.replace(/\/$/, "") ??
  "https://nexus-core-ag.vercel.app";

/** Remote bunker / archive app (Protocol UNsCRYPTED). */
export const EXTERNAL_SURVIVORS_API_URL =
  process.env.EXTERNAL_SURVIVORS_API_URL?.replace(/\/$/, "") ??
  "http://69.28.90.158:3001";

/** Full-page embed for dashboard Archive sector. */
export const ARCHIVE_EMBED_URL =
  process.env.ARCHIVE_EMBED_URL?.replace(/\/$/, "") ?? EXTERNAL_SURVIVORS_API_URL;

/** Medical sector embed (API docs). */
export const MEDICAL_EMBED_URL =
  process.env.MEDICAL_EMBED_URL?.replace(/\/$/, "") ??
  `${EXTERNAL_SURVIVORS_API_URL}/api-docs`;

/** Harvest sector embed (HARVEST//21 bunker app). */
export const HARVEST_EMBED_URL =
  process.env.HARVEST_EMBED_URL?.replace(/\/$/, "") ??
  "https://harvest-bunker.lovable.app";

export const SECTOR_EMBED_PATHS = [
  "/dashboard/archive",
  "/dashboard/medical",
  "/dashboard/harvesting",
] as const;

export function isSectorEmbedPath(pathname: string) {
  return (SECTOR_EMBED_PATHS as readonly string[]).includes(pathname);
}
