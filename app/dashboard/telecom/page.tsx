"use client";

import { SectorPage } from "@/components/sector-page";

export default function TelecomPage() {
  return (
    <SectorPage
      title="Signal Hub"
      subtitle="Network stability and relay status"
      domain="signal"
      stats={[
        { label: "bandwidth", value: "68%", hint: "allocated" },
        { label: "relays", value: "active", hint: "satellite link" },
      ]}
    />
  );
}
