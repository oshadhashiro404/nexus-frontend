"use client";

import { useState } from "react";
import { useBunker, type PolicyStatus } from "@/context/BunkerContext";

const DOMAINS = ["harvest", "medical", "signal", "nexus"];
const STATUSES: PolicyStatus[] = ["draft", "active", "suspended", "retired"];

const statusStyle: Record<PolicyStatus, string> = {
  active: "bg-emerald-50 text-emerald-700 border-emerald-100",
  draft: "bg-orange-50 text-orange-700 border-orange-100",
  suspended: "bg-red-50 text-red-700 border-red-100",
  retired: "bg-slate-100 text-slate-500 border-slate-200",
};

export default function PoliciesPage() {
  const { policies, addPolicy, updatePolicy, deletePolicy, loading } = useBunker();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    domain: "harvest",
    status: "draft" as PolicyStatus,
    is_general: false,
    is_mandatory: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState<string>("all");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await addPolicy({
      ...formData,
      policy_code: `POL-${Date.now().toString(36).toUpperCase()}`,
      min_clearance: "NONE",
      ...(formData.is_general ? { integration_domain_code: undefined } : { integration_domain_code: formData.domain }),
    });
    setFormData({ name: "", description: "", domain: "harvest", status: "draft", is_general: false, is_mandatory: false });
    setSubmitting(false);
  };

  const toggleStatus = async (p: { id: string; status: PolicyStatus }) => {
    const next: PolicyStatus = p.status === "active" ? "suspended" : "active";
    await updatePolicy(p.id, { status: next });
  };

  const displayed = filter === "all" ? policies : filter === "general" ? policies.filter((p) => p.is_general) : policies.filter((p) => !p.is_general && p.domain === filter);

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <div className="h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Policy Engine</h1>
        <p className="text-xl text-slate-500 font-medium italic">Define and enforce global directives across NexusCore domains.</p>
      </div>

      {/* Draft Form */}
      <section className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
        <h3 className="text-2xl font-bold text-slate-800 mb-8 flex items-center gap-3">
          <span className="h-8 w-1.5 bg-blue-600 rounded-full" />
          Draft New Policy
        </h3>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 px-1">Directive Title</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-lg font-bold text-slate-800 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                placeholder="e.g. Nutrient Rationing Protocol"
              />
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 px-1">Domain</label>
                <select
                  value={formData.domain}
                  disabled={formData.is_general}
                  onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-lg font-bold text-slate-800 focus:bg-white focus:border-blue-500 outline-none cursor-pointer appearance-none disabled:opacity-40"
                >
                  {DOMAINS.map((d) => (
                    <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 px-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as PolicyStatus })}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-lg font-bold text-slate-800 focus:bg-white focus:border-blue-500 outline-none cursor-pointer appearance-none"
                >
                  {STATUSES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 px-1">Full Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-lg font-medium text-slate-600 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all resize-none"
              placeholder="Enter the detailed ruling and legal justification..."
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_general}
                  onChange={(e) => setFormData({ ...formData, is_general: e.target.checked })}
                  className="w-5 h-5 rounded accent-blue-600"
                />
                <span className="text-sm font-black text-slate-500 uppercase tracking-widest">General Policy (all domains)</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_mandatory}
                  onChange={(e) => setFormData({ ...formData, is_mandatory: e.target.checked })}
                  className="w-5 h-5 rounded accent-blue-600"
                />
                <span className="text-sm font-black text-slate-500 uppercase tracking-widest">Mandatory</span>
              </label>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="px-12 py-5 bg-slate-900 hover:bg-blue-600 disabled:opacity-60 text-white font-black rounded-2xl shadow-xl shadow-slate-200 transition-all active:scale-[0.98] uppercase tracking-widest text-sm"
            >
              {submitting ? "Publishing..." : "Publish Directive"}
            </button>
          </div>
        </form>
      </section>

      {/* Filter bar */}
      <div className="flex gap-3 flex-wrap">
        {["all", "general", ...DOMAINS].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all border ${filter === f ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-500 border-slate-200 hover:border-blue-300"}`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Registry Table */}
      <section className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 bg-slate-50/30 flex justify-between items-center">
          <h3 className="text-xl font-bold text-slate-800">Global Enforcement Registry</h3>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{displayed.length} directives</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
                <th className="py-6 px-10">Code</th>
                <th className="py-6 px-6">Directive & Domain</th>
                <th className="py-6 px-6">Description</th>
                <th className="py-6 px-6 text-center">Status</th>
                <th className="py-6 px-10 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {displayed.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-slate-400 font-bold uppercase tracking-widest text-sm italic">No directives found</td>
                </tr>
              ) : (
                displayed.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="py-8 px-10 font-mono text-sm font-black text-slate-300">{p.policy_code}</td>
                    <td className="py-8 px-6">
                      <p className="font-bold text-slate-800 text-lg">{p.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {p.is_general ? (
                          <span className="px-2 py-0.5 bg-slate-50 text-slate-400 rounded text-[9px] font-black uppercase tracking-widest border border-slate-100">General</span>
                        ) : (
                          <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[9px] font-black uppercase tracking-widest border border-blue-100">{p.domain}</span>
                        )}
                        {p.is_mandatory && (
                          <span className="px-2 py-0.5 bg-red-50 text-red-500 rounded text-[9px] font-black uppercase tracking-widest border border-red-100">Mandatory</span>
                        )}
                      </div>
                    </td>
                    <td className="py-8 px-6 max-w-sm">
                      <p className="text-sm font-medium text-slate-500 leading-relaxed truncate group-hover:whitespace-normal transition-all">{p.description ?? "—"}</p>
                    </td>
                    <td className="py-8 px-6 text-center">
                      <button
                        onClick={() => toggleStatus(p)}
                        className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.1em] transition-all border-2 ${statusStyle[p.status]}`}
                      >
                        {p.status}
                      </button>
                    </td>
                    <td className="py-8 px-10 text-right">
                      <button
                        onClick={() => deletePolicy(p.id)}
                        className="p-2 text-slate-300 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
                        title="Purge directive"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
