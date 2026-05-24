"use client";

import { useState } from "react";
import { useBunker, type Clearance, type SurvivorStatus } from "@/context/BunkerContext";
import { ActionErrorBanner } from "@/components/ActionErrorBanner";
import {
  Badge,
  Btn,
  Empty,
  FieldInput,
  FieldSelect,
  Label,
  PageHeader,
  Panel,
} from "@/components/terminal-ui";

const CLEARANCE_LEVELS: Clearance[] = ["NONE", "DELTA", "GAMMA", "BETA", "ALPHA", "NEXUS"];
const STATUS_OPTIONS: SurvivorStatus[] = ["active", "quarantined", "deceased", "missing"];

const statusTone: Record<SurvivorStatus, "default" | "ok" | "warn" | "err"> = {
  active: "ok",
  quarantined: "err",
  deceased: "default",
  missing: "warn",
};

export default function CensusPage() {
  const { survivors, addSurvivor, updateSurvivor, deleteSurvivor, loading, clearActionError } =
    useBunker();
  const [formData, setFormData] = useState({
    full_name: "",
    duty: "",
    clearance: "DELTA" as Clearance,
    status: "active" as SurvivorStatus,
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearActionError();
    setSubmitting(true);
    const ok = await addSurvivor({
      ...formData,
      identity_code: `SUR-${Date.now().toString(36).toUpperCase()}`,
    });
    if (ok) {
      setFormData({ full_name: "", duty: "", clearance: "DELTA", status: "active" });
    }
    setSubmitting(false);
  };

  const handleCycleStatus = async (id: string, current: SurvivorStatus) => {
    const next: SurvivorStatus = current === "active" ? "quarantined" : "active";
    await updateSurvivor(id, { status: next });
  };

  if (loading) {
    return <p className="text-xs text-[var(--muted)] py-8 text-center">loading...</p>;
  }

  return (
    <div className="space-y-3">
      <ActionErrorBanner />
      <PageHeader title="Survivor Census" subtitle="Population registry" />

      <Panel title="register">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-2 items-end">
          <div>
            <Label>name</Label>
            <FieldInput
              required
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              placeholder="full name"
            />
          </div>
          <div>
            <Label>duty</Label>
            <FieldInput
              value={formData.duty}
              onChange={(e) => setFormData({ ...formData, duty: e.target.value })}
              placeholder="technician"
            />
          </div>
          <div>
            <Label>clearance</Label>
            <FieldSelect
              value={formData.clearance}
              onChange={(e) => setFormData({ ...formData, clearance: e.target.value as Clearance })}
            >
              {CLEARANCE_LEVELS.map((lvl) => (
                <option key={lvl}>{lvl}</option>
              ))}
            </FieldSelect>
          </div>
          <Btn type="submit" disabled={submitting} className="w-full">
            {submitting ? "..." : "register"}
          </Btn>
        </form>
      </Panel>

      <Panel title={`registry (${survivors.length})`}>
        <div className="overflow-x-auto -mx-3 -mb-3">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-[9px] uppercase tracking-wider text-[var(--muted)] border-b border-[var(--line)]">
                <th className="py-2 px-3">id</th>
                <th className="py-2 px-2">identity</th>
                <th className="py-2 px-2">duty</th>
                <th className="py-2 px-2">clr</th>
                <th className="py-2 px-2 text-center">status</th>
                <th className="py-2 px-3 text-right">act</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line)]">
              {survivors.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <Empty>no entities</Empty>
                  </td>
                </tr>
              ) : (
                survivors.map((s) => (
                  <tr key={s.id} className="hover:bg-[var(--fg)]/5">
                    <td className="py-2 px-3 font-mono text-[10px] text-[var(--muted)]">
                      {s.identity_code}
                    </td>
                    <td className="py-2 px-2 font-bold text-[var(--fg)]">{s.full_name}</td>
                    <td className="py-2 px-2 text-[var(--muted)] uppercase text-[10px]">
                      {s.duty ?? "—"}
                    </td>
                    <td className="py-2 px-2">
                      <Badge>{s.clearance}</Badge>
                    </td>
                    <td className="py-2 px-2 text-center">
                      <button type="button" onClick={() => handleCycleStatus(s.id, s.status)}>
                        <Badge tone={statusTone[s.status]}>{s.status}</Badge>
                      </button>
                    </td>
                    <td className="py-2 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => deleteSurvivor(s.id)}
                        className="text-[10px] text-[var(--muted)] hover:text-[var(--red)]"
                      >
                        del
                      </button>
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
