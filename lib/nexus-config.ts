/** Hosted NEXUS API (Vercel). Browser never calls this directly — use `/api/*` proxy routes. */
export const HOSTED_API_URL =
  process.env.NEXUS_API_PROXY_TARGET?.replace(/\/$/, "") ??
  "https://nexus-core-ag.vercel.app";
