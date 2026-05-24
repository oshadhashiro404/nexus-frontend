"use client";

import type { ReactNode } from "react";
import { useBunker } from "@/context/BunkerContext";
import { policiesForSector, type IntegrationDomainCode } from "@/lib/nexus-api";
import { Badge, Empty, PageHeader, Panel, Stat } from "@/components/terminal-ui";

type SectorPageProps = {
  title: string;
  subtitle: string;
  domain: IntegrationDomainCode;
  stats: { label: string; value: ReactNode; hint?: string }[];
  aside?: ReactNode;
  children?: ReactNode;
};

export function SectorPage({ title, subtitle, domain, stats, aside, children }: SectorPageProps) {
  const { policies, loading } = useBunker();
  const sectorPolicies = policiesForSector(policies, domain);

  if (loading) {
    return <p className="text-xs text-[var(--muted)] py-8 text-center">loading...</p>;
  }

  return (
    <div className="space-y-3">
      <PageHeader title={title} subtitle={subtitle} />

      <div className={`grid gap-2 ${aside ? "grid-cols-1 lg:grid-cols-3" : "grid-cols-2 md:grid-cols-3"}`}>
        {stats.map((s) => (
          <Stat key={s.label} label={s.label} value={s.value} hint={s.hint} />
        ))}
        {aside}
      </div>

      {children}

      <Panel title={`directives (${sectorPolicies.length})`}>
        {sectorPolicies.length === 0 ? (
          <Empty>no directives for this sector</Empty>
        ) : (
          <ul className="space-y-2">
            {sectorPolicies.map((p) => (
              <li
                key={p.id}
                className="border border-[var(--line)] px-2 py-1.5 flex items-start justify-between gap-2"
              >
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[var(--fg)]">{p.name}</p>
                  <p className="text-[10px] text-[var(--muted)] font-mono mt-0.5">{p.policy_code}</p>
                </div>
                <Badge tone={p.status === "active" ? "ok" : p.status === "draft" ? "warn" : "default"}>
                  {p.status}
                </Badge>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}
