"use client";

import { SectorEmbed } from "@/components/sector-embed";
import { ARCHIVE_EMBED_URL, ARCHIVE_OPEN_URL } from "@/lib/nexus-config";

export default function ArchivePage() {
  return (
    <SectorEmbed
      title="Protocol UNsCRYPTED"
      src={ARCHIVE_EMBED_URL}
      openUrl={ARCHIVE_OPEN_URL}
      iframeTitle="Protocol UNsCRYPTED — Archive System"
    />
  );
}
