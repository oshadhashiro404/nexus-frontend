"use client";

import { SectorPage } from "@/components/sector-page";

export default function HarvestingPage() {
  return (
    <SectorPage
      title="Harvesting Hub"
      subtitle="Resource extraction and distribution"
      domain="harvest"
      stats={[
        { label: "yield", value: "14.2M", hint: "tons est." },
        { label: "logistics", value: "nominal", hint: "chain ok" },
      ]}
    />
  );
}
