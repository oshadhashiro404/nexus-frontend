import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Run from `frontend/` so cwd is this app — avoids picking up parent `middleware.ts`
  turbopack: {
    root: process.cwd(),
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
        ],
      },
    ];
  },
};

export default nextConfig;
