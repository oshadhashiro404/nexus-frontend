"use client";

import { useState } from "react";
import { useBunker } from "@/context/BunkerContext";
import { SectorPage } from "@/components/sector-page";
import { Btn, Panel } from "@/components/terminal-ui";

const FACILITIES = [
  { name: "Ward Alpha", capacity: 84 },
  { name: "Isolation Bay", capacity: 42 },
  { name: "Research Lab", capacity: 67 },
];

export default function MedicalPage() {
  const { healthRecords, quarantineEvents } = useBunker();
  const [emergency, setEmergency] = useState(false);
  const activeQuarantine = quarantineEvents.filter((q) => q.is_active);

  return (
    <SectorPage
      title="Medical Sector"
      subtitle="Facility capacity and health assessments"
      domain="medical"
      stats={[
        { label: "assessments", value: healthRecords.length },
        {
          label: "quarantine",
          value: activeQuarantine.length,
          hint: activeQuarantine.length > 0 ? "alert" : "clear",
        },
      ]}
    >
      <div className="flex justify-end">
        <Btn variant={emergency ? "danger" : "ghost"} onClick={() => setEmergency(!emergency)}>
          {emergency ? "emergency on" : "toggle emergency"}
        </Btn>
      </div>

      <Panel title="facilities">
        <ul className="space-y-2">
          {FACILITIES.map((f) => (
            <li key={f.name} className="border border-[var(--line)] px-2 py-1.5">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[var(--fg)]">{f.name}</span>
                <span className="text-[var(--muted)] tabular-nums">{f.capacity}%</span>
              </div>
              <div className="h-1 bg-[var(--line)]">
                <div className="h-full bg-[var(--fg-dim)]" style={{ width: `${f.capacity}%` }} />
              </div>
            </li>
          ))}
        </ul>
      </Panel>

      {healthRecords.length > 0 && (
        <Panel title="recent assessments">
          <ul className="space-y-1 text-xs">
            {healthRecords.slice(0, 5).map((h) => (
              <li key={h.id} className="text-[var(--muted)]">
                <span className="text-[var(--fg)]">{h.survivor_id.slice(0, 8)}…</span> — {h.condition}
              </li>
            ))}
          </ul>
        </Panel>
      )}
    </SectorPage>
  );
}
