"use client";

import { useBunker } from "@/context/BunkerContext";
import { ActionErrorBanner } from "@/components/ActionErrorBanner";
import { Badge, Empty, PageHeader, Panel } from "@/components/terminal-ui";

function formatDate(iso: string) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("en-GB");
  } catch {
    return iso;
  }
}

export default function CensusPage() {
  const { survivors, loading, survivorsSource, refreshData, connectionError } = useBunker();

  if (loading) {
    return <p className="text-xs text-[var(--muted)] py-8 text-center">loading registry...</p>;
  }

  return (
    <div className="space-y-3">
      <ActionErrorBanner />
      <PageHeader
        title="Survivor Census"
        subtitle={
          survivorsSource === "external"
            ? "Remote registry · 69.28.90.158:3001"
            : "Nexus governance database"
        }
      />

      {connectionError && (
        <div className="border border-[var(--red)]/40 bg-[var(--red)]/10 px-2 py-1.5 text-[11px] text-[var(--red)]">
          {connectionError}
        </div>
      )}

      <div className="flex items-center justify-between text-[10px] text-[var(--muted)] uppercase tracking-wide">
        <span>source: {survivorsSource}</span>
        <button
          type="button"
          onClick={() => refreshData()}
          className="text-[var(--fg-dim)] hover:text-[var(--fg)]"
        >
          [refresh]
        </button>
      </div>

      <Panel title={`registry (${survivors.length})`}>
        <div className="overflow-x-auto -mx-3 -mb-3">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-[9px] uppercase tracking-wider text-[var(--muted)] border-b border-[var(--line)]">
                <th className="py-2 px-3">id</th>
                <th className="py-2 px-2">name</th>
                <th className="py-2 px-2">age</th>
                <th className="py-2 px-2">sector</th>
                <th className="py-2 px-2 hidden lg:table-cell">skills</th>
                <th className="py-2 px-3 text-right">registered</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line)]">
              {survivors.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <Empty>no entities in registry</Empty>
                  </td>
                </tr>
              ) : (
                survivors.map((s) => (
                  <tr key={s.id} className="hover:bg-[var(--fg)]/5 align-top">
                    <td className="py-2 px-3 font-mono text-[10px] text-[var(--muted)] max-w-[100px] truncate" title={s.id}>
                      {s.id.slice(0, 10)}…
                    </td>
                    <td className="py-2 px-2 font-bold text-[var(--fg)]">{s.full_name}</td>
                    <td className="py-2 px-2 tabular-nums text-[var(--muted)]">{s.age ?? "—"}</td>
                    <td className="py-2 px-2">
                      <Badge tone="ok">{s.sector ?? s.duty ?? "—"}</Badge>
                    </td>
                    <td className="py-2 px-2 hidden lg:table-cell">
                      {s.skills && s.skills.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {s.skills.map((skill) => (
                            <span
                              key={skill.id}
                              className="text-[9px] text-[var(--muted)] border border-[var(--line)] px-1"
                              title={skill.category}
                            >
                              {skill.name}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-[var(--muted)]">—</span>
                      )}
                    </td>
                    <td className="py-2 px-3 text-right text-[10px] text-[var(--muted)] tabular-nums">
                      {formatDate(s.registered_at)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
