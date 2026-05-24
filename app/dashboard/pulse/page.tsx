"use client";

import { useBunker } from "@/context/BunkerContext";
import { SectorPage } from "@/components/sector-page";
import { Panel } from "@/components/terminal-ui";

export default function PulseFeed() {
  const { healthRecords, quarantineEvents, survivors } = useBunker();
  const activeQuarantine = quarantineEvents.filter((q) => q.is_active);

  return (
    <SectorPage
      title="Pulse Healthcare"
      subtitle="Medical telemetry and quarantine monitoring"
      domain="medical"
      stats={[
        { label: "records", value: healthRecords.length, hint: "assessments" },
        {
          label: "quarantine",
          value: activeQuarantine.length || "0",
          hint: activeQuarantine.length > 0 ? "isolation active" : "all clear",
        },
        { label: "link", value: "ok", hint: "pulse connected" },
      ]}
    >
      {activeQuarantine.length > 0 && (
        <Panel title="active quarantine">
          <ul className="space-y-1">
            {activeQuarantine.map((q) => {
              const survivor = survivors.find((s) => s.id === q.survivor_id);
              return (
                <li key={q.id} className="border border-[var(--red)]/30 px-2 py-1 text-xs">
                  <span className="text-[var(--fg)]">{survivor?.full_name ?? q.survivor_id}</span>
                  <span className="text-[var(--muted)] ml-2">— {q.reason}</span>
                </li>
              );
            })}
          </ul>
        </Panel>
      )}
    </SectorPage>
  );
}
