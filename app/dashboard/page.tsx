"use client";

import { useBunker } from "@/context/BunkerContext";
import { policiesForSector } from "@/lib/nexus-api";
import { PageHeader, Panel, Stat } from "@/components/terminal-ui";

export default function DashboardOverview() {
  const { policies, survivors, dbConnected, connectionError, loading } = useBunker();

  if (loading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <p className="text-xs text-[var(--muted)] animate-pulse">{"// linking governance api..."}</p>
      </div>
    );
  }

  const activeCount = policies.filter((p) => p.status === "active").length;
  const enforcementRate = policies.length > 0 ? (activeCount / policies.length) * 100 : 100;

  const domainKeys = ["harvest", "medical", "signal", "nexus", "general"] as const;
  const domainLabels: Record<string, string> = {
    harvest: "harvest",
    medical: "pulse",
    signal: "signal",
    nexus: "nexus",
    general: "gen",
  };

  return (
    <div className="space-y-3">
      <PageHeader
        title="Command Overview"
        subtitle="Administrative command & control — protocol nexus-01"
      />

      {!dbConnected && (
        <div className="border border-[var(--red)]/40 bg-[var(--red)]/10 px-2 py-1.5 text-[11px] text-[var(--red)]">
          master database offline — {connectionError ?? "handshake failed"}
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        <Stat label="api" value={dbConnected ? "linked" : "error"} hint={dbConnected ? "connected" : "severed"} />
        <Stat label="enforcement" value={`${Math.round(enforcementRate)}%`} hint={`${activeCount} active`} />
        <Stat label="census" value={survivors.length} hint="entities" />
        <Stat label="auth" value="active" hint="nexus gate" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
        <Panel title="alerts" className="lg:col-span-1">
          <div className="space-y-2">
            {!dbConnected ? (
              <div className="border border-[var(--amber)]/30 px-2 py-1.5">
                <p className="text-xs text-[var(--amber)] font-bold">core database disconnected</p>
                <p className="text-[10px] text-[var(--muted)] mt-1">{connectionError}</p>
              </div>
            ) : (
              <div className="border border-[var(--fg-dim)]/30 px-2 py-1.5">
                <p className="text-xs text-[var(--fg)]">sync active</p>
                <p className="text-[10px] text-[var(--muted)] mt-1">
                  {policies.length} directives · {survivors.length} entities
                </p>
              </div>
            )}
            {policiesForSector(policies, "medical").some((p) => p.status === "draft") && (
              <div className="border border-[var(--amber)]/30 px-2 py-1.5">
                <p className="text-xs text-[var(--amber)]">pulse sync warning</p>
                <p className="text-[10px] text-[var(--muted)] mt-1">medical directives under review</p>
              </div>
            )}
          </div>
        </Panel>

        <Panel title="sector integrity" className="lg:col-span-2">
          <div className="h-36 flex items-end justify-between gap-2 px-1">
            {domainKeys.map((domain) => {
              const domainPolicies =
                domain === "general"
                  ? policies.filter((p) => p.is_general)
                  : policiesForSector(policies, domain);
              const domainActive = domainPolicies.filter((p) => p.status === "active").length;
              const efficiency =
                domainPolicies.length > 0 ? (domainActive / domainPolicies.length) * 100 : 100;

              return (
                <div key={domain} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
                  <div
                    className={`w-full transition-all ${
                      efficiency === 100
                        ? "bg-[var(--fg-dim)]"
                        : efficiency > 50
                          ? "bg-[var(--line)] group-hover:bg-[var(--cyan)]"
                          : "bg-[var(--amber)]/60"
                    }`}
                    style={{ height: `${Math.max(efficiency, 4)}%` }}
                    title={`${Math.round(efficiency)}%`}
                  />
                  <span className="text-[9px] text-[var(--muted)] uppercase">{domainLabels[domain]}</span>
                </div>
              );
            })}
          </div>
          <p className="text-[9px] text-[var(--muted)] mt-3 border-t border-[var(--line)] pt-2 uppercase tracking-wide">
            source: nexus governance api
          </p>
        </Panel>
      </div>
    </div>
  );
}
