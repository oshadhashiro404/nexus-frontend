"use client";

import { useState } from "react";
import { useBunker, type PolicyStatus } from "@/context/BunkerContext";
import { ActionErrorBanner } from "@/components/ActionErrorBanner";
import {
  Btn,
  Badge,
  Empty,
  FieldInput,
  FieldSelect,
  FieldTextarea,
  Label,
  PageHeader,
  Panel,
} from "@/components/terminal-ui";
import {
  buildPolicyCreateBody,
  getPolicySectorCode,
  type IntegrationDomainCode,
  type PolicyCategory,
} from "@/lib/nexus-api";

const INTEGRATION_DOMAINS: IntegrationDomainCode[] = ["harvest", "medical", "signal", "nexus"];
const CATEGORIES: PolicyCategory[] = [
  "WORKFORCE",
  "HEALTH",
  "ACCESS",
  "QUARANTINE",
  "SECURITY",
  "RESOURCE",
];
const STATUSES: PolicyStatus[] = ["draft", "active", "suspended", "retired"];

const statusTone: Record<PolicyStatus, "default" | "ok" | "warn" | "err"> = {
  active: "ok",
  draft: "warn",
  suspended: "err",
  retired: "default",
};

export default function PoliciesPage() {
  const { policies, addPolicy, updatePolicy, deletePolicy, loading, clearActionError } =
    useBunker();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    integration_domain: "harvest" as IntegrationDomainCode,
    category: "RESOURCE" as PolicyCategory,
    status: "draft" as PolicyStatus,
    is_general: false,
    is_mandatory: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState<string>("all");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearActionError();
    setSubmitting(true);
    const body = buildPolicyCreateBody({
      name: formData.name,
      description: formData.description || undefined,
      policy_code: `POL-${Date.now().toString(36).toUpperCase()}`,
      integration_domain: formData.integration_domain,
      category: formData.category,
      is_general: formData.is_general,
      is_mandatory: formData.is_mandatory,
      status: formData.status,
    });
    const ok = await addPolicy(body);
    if (ok) {
      setFormData({
        name: "",
        description: "",
        integration_domain: "harvest",
        category: "RESOURCE",
        status: "draft",
        is_general: false,
        is_mandatory: false,
      });
    }
    setSubmitting(false);
  };

  const toggleStatus = async (p: { id: string; status: PolicyStatus }) => {
    clearActionError();
    const next: PolicyStatus = p.status === "active" ? "suspended" : "active";
    await updatePolicy(p.id, { status: next });
  };

  const displayed =
    filter === "all"
      ? policies
      : filter === "general"
        ? policies.filter((p) => p.is_general)
        : policies.filter((p) => getPolicySectorCode(p) === filter);

  if (loading) {
    return <p className="text-xs text-[var(--muted)] py-8 text-center">loading...</p>;
  }

  return (
    <div className="space-y-3">
      <ActionErrorBanner />
      <PageHeader title="Policy Engine" subtitle="Directives across integration domains" />

      <Panel title="new directive">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label>title</Label>
              <FieldInput
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="nutrient rationing protocol"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>sector</Label>
                <FieldSelect
                  value={formData.integration_domain}
                  disabled={formData.is_general}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      integration_domain: e.target.value as IntegrationDomainCode,
                    })
                  }
                >
                  {INTEGRATION_DOMAINS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </FieldSelect>
              </div>
              <div>
                <Label>status</Label>
                <FieldSelect
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value as PolicyStatus })
                  }
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </FieldSelect>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label>category</Label>
              <FieldSelect
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value as PolicyCategory })
                }
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </FieldSelect>
            </div>
            <div>
              <Label>description</Label>
              <FieldTextarea
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="ruling text..."
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex gap-4 text-[10px] text-[var(--muted)]">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_general}
                  onChange={(e) => setFormData({ ...formData, is_general: e.target.checked })}
                  className="accent-[var(--fg-dim)]"
                />
                general
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_mandatory}
                  onChange={(e) => setFormData({ ...formData, is_mandatory: e.target.checked })}
                  className="accent-[var(--fg-dim)]"
                />
                mandatory
              </label>
            </div>
            <Btn type="submit" disabled={submitting}>
              {submitting ? "..." : "publish"}
            </Btn>
          </div>
        </form>
      </Panel>

      <div className="flex gap-1 flex-wrap">
        {["all", "general", ...INTEGRATION_DOMAINS].map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`px-2 py-0.5 text-[9px] uppercase border ${
              filter === f
                ? "border-[var(--fg)] text-[var(--fg)] bg-[var(--fg)]/10"
                : "border-[var(--line)] text-[var(--muted)] hover:text-[var(--fg-dim)]"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <Panel title={`registry (${displayed.length})`}>
        <div className="overflow-x-auto -mx-3 -mb-3">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-[9px] uppercase tracking-wider text-[var(--muted)] border-b border-[var(--line)]">
                <th className="py-2 px-3">code</th>
                <th className="py-2 px-2">directive</th>
                <th className="py-2 px-2 hidden md:table-cell">desc</th>
                <th className="py-2 px-2 text-center">status</th>
                <th className="py-2 px-3 text-right">act</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line)]">
              {displayed.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <Empty>no directives</Empty>
                  </td>
                </tr>
              ) : (
                displayed.map((p) => (
                  <tr key={p.id} className="hover:bg-[var(--fg)]/5">
                    <td className="py-2 px-3 font-mono text-[10px] text-[var(--muted)]">
                      {p.policy_code}
                    </td>
                    <td className="py-2 px-2">
                      <p className="text-[var(--fg)] font-bold">{p.name}</p>
                      <div className="flex gap-1 mt-1 flex-wrap">
                        {p.is_general ? (
                          <Badge>general</Badge>
                        ) : (
                          <Badge tone="ok">{getPolicySectorCode(p) ?? "—"}</Badge>
                        )}
                        <Badge>{p.domain}</Badge>
                        {p.is_mandatory && <Badge tone="err">req</Badge>}
                      </div>
                    </td>
                    <td className="py-2 px-2 hidden md:table-cell text-[var(--muted)] max-w-[200px] truncate">
                      {p.description ?? "—"}
                    </td>
                    <td className="py-2 px-2 text-center">
                      <button type="button" onClick={() => toggleStatus(p)}>
                        <Badge tone={statusTone[p.status]}>{p.status}</Badge>
                      </button>
                    </td>
                    <td className="py-2 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => deletePolicy(p.id)}
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
