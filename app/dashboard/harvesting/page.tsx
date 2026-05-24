"use client";

import { SectorEmbed } from "@/components/sector-embed";
import { HARVEST_EMBED_URL } from "@/lib/nexus-config";

export default function HarvestingPage() {
  return (
    <SectorEmbed
      title="Harvest — Bunker Agriculture Command"
      src={HARVEST_EMBED_URL}
      iframeTitle="Harvest — Bunker Agriculture Command"
    />
  );
}
