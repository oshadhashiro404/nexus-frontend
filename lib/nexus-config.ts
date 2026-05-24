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
