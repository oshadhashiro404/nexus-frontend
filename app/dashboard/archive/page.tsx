"use client";

import { SectorPage } from "@/components/sector-page";
import { Panel } from "@/components/terminal-ui";

const REQUESTS = [
  { asset: "Neural Archive Tier-3", clearance: "ALPHA" },
  { asset: "Pre-Collapse Engineering", clearance: "BETA" },
];

export default function ArchivePage() {
  return (
    <SectorPage
      title="Archive Hub"
      subtitle="Knowledge preservation and access control"
      domain="nexus"
      stats={[
        { label: "integrity", value: "98.4%", hint: "storage" },
        { label: "unlock", value: "12.4%", hint: "tier access" },
        { label: "mode", value: "cold", hint: "storage status" },
      ]}
    >
      <Panel title="access requests">
        <ul className="space-y-1">
          {REQUESTS.map((req) => (
            <li
              key={req.asset}
              className="flex items-center justify-between border border-[var(--line)] px-2 py-1 text-xs"
            >
              <span className="text-[var(--fg)]">{req.asset}</span>
              <span className="text-[10px] text-[var(--muted)] uppercase">clr {req.clearance}</span>
            </li>
          ))}
        </ul>
      </Panel>
    </SectorPage>
  );
}
