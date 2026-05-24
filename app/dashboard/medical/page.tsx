"use client";

import { SectorEmbed } from "@/components/sector-embed";
import { MEDICAL_EMBED_URL, MEDICAL_OPEN_URL } from "@/lib/nexus-config";

export default function MedicalPage() {
  return (
    <SectorEmbed
      title="Medical — API Docs"
      src={MEDICAL_EMBED_URL}
      openUrl={MEDICAL_OPEN_URL}
      iframeTitle="Medical — API Docs"
    />
  );
}
