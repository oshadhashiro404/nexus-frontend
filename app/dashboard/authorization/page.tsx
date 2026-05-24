"use client";

import { useState } from "react";
import { useBunker } from "@/context/BunkerContext";
import { Badge, PageHeader, Panel, Stat } from "@/components/terminal-ui";

const INITIAL_ADMINS = [
  { id: "ADM-001", name: "Nexus Prime", role: "Supreme Admin", level: 10, access: "Full System" },
  { id: "ADM-014", name: "Sector Lead Echo", role: "Census Lead", level: 7, access: "Cns-Domain" },
];

export default function AuthorizationPage() {
  const { survivors, loading } = useBunker();
  const [admins] = useState(INITIAL_ADMINS);
  const [toggles, setToggles] = useState({
    "Multi-Factor Neural Auth": true,
    "Biometric Scanning": true,
    "AI Behavioral Analysis": false,
  });

  const quarantinedCount = survivors.filter((s) => s.status === "quarantined").length;
  const activeCount = survivors.filter((s) => s.status === "active").length;
  const integrity = survivors.length > 0 ? Math.round((activeCount / survivors.length) * 100) : 100;

  if (loading) {
    return <p className="text-xs text-[var(--muted)] py-8 text-center">loading...</p>;
  }

  return (
    <div className="space-y-3">
      <PageHeader title="Clearance Matrix" subtitle="Administrative hierarchies and access keys" />

      {quarantinedCount > 0 && (
        <div className="border border-[var(--red)]/40 bg-[var(--red)]/10 px-2 py-1.5 text-[11px] text-[var(--red)]">
          {quarantinedCount} entit{quarantinedCount > 1 ? "ies" : "y"} quarantined — clearance restricted
        </div>
      )}

      <div className="grid grid-cols-3 gap-2">
        <Stat label="integrity" value={`${integrity}%`} />
        <Stat label="active" value={activeCount} />
        <Stat label="quarantine" value={quarantinedCount} />
      </div>

      <Panel title="active hierarchy">
        <div className="overflow-x-auto -mx-3 -mb-3">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-[9px] uppercase text-[var(--muted)] border-b border-[var(--line)]">
                <th className="py-2 px-3 text-left">id</th>
                <th className="py-2 px-2 text-left">identity</th>
                <th className="py-2 px-2 text-center">lvl</th>
                <th className="py-2 px-3 text-right">scope</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line)]">
              {admins.map((a) => (
                <tr key={a.id} className="hover:bg-[var(--fg)]/5">
                  <td className="py-2 px-3 font-mono text-[10px] text-[var(--muted)]">{a.id}</td>
                  <td className="py-2 px-2">
                    <p className="font-bold text-[var(--fg)]">{a.name}</p>
                    <p className="text-[10px] text-[var(--muted)] uppercase">{a.role}</p>
                  </td>
                  <td className="py-2 px-2 text-center font-mono text-[var(--cyan)]">LVL {a.level}</td>
                  <td className="py-2 px-3 text-right">
                    <Badge>{a.access}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <Panel title="protocol toggles">
          <div className="space-y-2">
            {(Object.entries(toggles) as [string, boolean][]).map(([label, active]) => (
              <div
                key={label}
                className="flex items-center justify-between border border-[var(--line)] px-2 py-1.5"
              >
                <span className="text-xs text-[var(--fg)]">{label}</span>
                <button
                  type="button"
                  onClick={() =>
                    setToggles((prev) => ({
                      ...prev,
                      [label]: !prev[label as keyof typeof toggles],
                    }))
                  }
                  className={`text-[9px] uppercase px-1.5 py-0.5 border ${
                    active
                      ? "border-[var(--fg-dim)] text-[var(--fg)]"
                      : "border-[var(--line)] text-[var(--muted)]"
                  }`}
                >
                  {active ? "on" : "off"}
                </button>
              </div>
            ))}
          </div>
        </Panel>
        <Panel title="firewall">
          <p className="text-lg font-bold text-[var(--fg)] tabular-nums">{integrity}%</p>
          <p className="text-[10px] text-[var(--muted)] mt-2 uppercase">
            {activeCount} active · {quarantinedCount} quarantined
          </p>
          <p className="text-[10px] text-[var(--fg-dim)] mt-3">global firewall active</p>
        </Panel>
      </div>
    </div>
  );
}
