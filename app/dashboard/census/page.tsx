"use client";

import { useState } from "react";
import { useBunker, type Clearance, type SurvivorStatus } from "@/context/BunkerContext";

const CLEARANCE_LEVELS: Clearance[] = ["NONE", "DELTA", "GAMMA", "BETA", "ALPHA", "NEXUS"];
const STATUS_OPTIONS: SurvivorStatus[] = ["active", "quarantined", "deceased", "missing"];

const statusStyle: Record<SurvivorStatus, string> = {
  active: "bg-emerald-50 text-emerald-700 border-emerald-100",
  quarantined: "bg-red-50 text-red-700 border-red-100 animate-pulse",
  deceased: "bg-slate-100 text-slate-500 border-slate-200",
  missing: "bg-orange-50 text-orange-700 border-orange-100",
};

export default function CensusPage() {
  const { survivors, addSurvivor, updateSurvivor, deleteSurvivor, loading } = useBunker();
  const [formData, setFormData] = useState({
    full_name: "",
    duty: "",
    clearance: "DELTA" as Clearance,
    status: "active" as SurvivorStatus,
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await addSurvivor({
      ...formData,
      identity_code: `SUR-${Date.now().toString(36).toUpperCase()}`,
    });
    setFormData({ full_name: "", duty: "", clearance: "DELTA", status: "active" });
    setSubmitting(false);
  };

  const handleCycleStatus = async (id: string, current: SurvivorStatus) => {
    const next: SurvivorStatus = current === "active" ? "quarantined" : "active";
    await updateSurvivor(id, { status: next });
  };

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
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Survivor Census</h1>
        <p className="text-xl text-slate-500 font-medium italic">Population registry and biological status monitoring.</p>
      </div>

      {/* Register Form */}
      <section className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
        <h3 className="text-2xl font-bold text-slate-800 mb-8 flex items-center gap-3">
          <span className="h-8 w-1.5 bg-blue-600 rounded-full" />
          Register New Entry
        </h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 px-1">Survivor Name</label>
            <input
              type="text"
              required
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-lg font-bold text-slate-800 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
              placeholder="Full identity name..."
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 px-1">Assigned Duty</label>
            <input
              type="text"
              value={formData.duty}
              onChange={(e) => setFormData({ ...formData, duty: e.target.value })}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-lg font-bold text-slate-800 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
              placeholder="e.g. Technician"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 px-1">Clearance</label>
            <select
              value={formData.clearance}
              onChange={(e) => setFormData({ ...formData, clearance: e.target.value as Clearance })}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-lg font-bold text-slate-800 focus:bg-white focus:border-blue-500 outline-none cursor-pointer appearance-none"
            >
              {CLEARANCE_LEVELS.map((lvl) => (
                <option key={lvl}>{lvl}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-slate-900 hover:bg-blue-600 disabled:opacity-60 text-white font-black py-4 rounded-2xl shadow-xl shadow-slate-200 transition-all active:scale-[0.98] uppercase tracking-widest text-sm"
            >
              {submitting ? "Processing..." : "Process Registration"}
            </button>
          </div>
        </form>
      </section>

      {/* Registry Table */}
      <section className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 bg-slate-50/30 flex justify-between items-center">
          <h3 className="text-xl font-bold text-slate-800">Survivor Registry</h3>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{survivors.length} entities</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
                <th className="py-6 px-10">ID Code</th>
                <th className="py-6 px-6">Identity</th>
                <th className="py-6 px-6">Duty</th>
                <th className="py-6 px-6">Clearance</th>
                <th className="py-6 px-6 text-center">Status</th>
                <th className="py-6 px-10 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {survivors.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-slate-400 font-bold uppercase tracking-widest text-sm italic">
                    No entities registered
                  </td>
                </tr>
              ) : (
                survivors.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="py-6 px-10 font-mono text-sm font-black text-slate-300">{s.identity_code}</td>
                    <td className="py-6 px-6">
                      <p className="font-bold text-slate-800 text-lg">{s.full_name}</p>
                    </td>
                    <td className="py-6 px-6 font-bold text-slate-500 uppercase text-xs tracking-wider">{s.duty ?? "—"}</td>
                    <td className="py-6 px-6">
                      <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-slate-200">{s.clearance}</span>
                    </td>
                    <td className="py-6 px-6 text-center">
                      <button
                        onClick={() => handleCycleStatus(s.id, s.status)}
                        className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.1em] transition-all border-2 ${statusStyle[s.status]}`}
                      >
                        {s.status}
                      </button>
                    </td>
                    <td className="py-6 px-10 text-right">
                      <button
                        onClick={() => deleteSurvivor(s.id)}
                        className="p-2 text-slate-300 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
                        title="Purge entity"
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
