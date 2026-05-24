"use client";

import { useBunker } from "@/context/BunkerContext";
import { policiesForSector } from "@/lib/nexus-api";

export default function PulseFeed() {
  const { policies, healthRecords, quarantineEvents, survivors, loading } = useBunker();

  const pulsePolicies = policiesForSector(policies, "medical");

  const activeQuarantine = quarantineEvents.filter((q) => q.is_active);

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
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Pulse Healthcare</h1>
        <p className="text-xl text-slate-500 font-medium italic">Live telemetry and biological threat monitoring.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Health Records</p>
          <p className="text-5xl font-extrabold text-slate-900 tracking-tighter">{healthRecords.length}</p>
          <div className="mt-6 flex items-center gap-2 text-emerald-600 font-black text-xs uppercase tracking-widest">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Tracked Assessments
          </div>
        </div>
        <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Active Quarantines</p>
          <p className={`text-5xl font-extrabold tracking-tighter ${activeQuarantine.length > 0 ? "text-red-600" : "text-blue-600"}`}>
            {activeQuarantine.length > 0 ? activeQuarantine.length : "ZERO"}
          </p>
          <div className={`mt-6 flex items-center gap-2 font-black text-xs uppercase tracking-widest ${activeQuarantine.length > 0 ? "text-red-600" : "text-blue-600"}`}>
            <span className={`h-2 w-2 rounded-full ${activeQuarantine.length > 0 ? "bg-red-500 animate-pulse" : "bg-blue-500"}`} />
            {activeQuarantine.length > 0 ? "Isolation Active" : "All Clear"}
          </div>
        </div>
        <div className="bg-blue-600 p-10 rounded-3xl shadow-xl shadow-blue-100 text-white">
          <p className="text-xs font-bold text-blue-200 uppercase tracking-widest mb-4">Pulse Link</p>
          <div className="flex items-center gap-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-blue-200"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
            <span className="text-2xl font-black italic uppercase tracking-tighter">Connected</span>
          </div>
          <p className="mt-6 text-sm font-bold text-blue-100 leading-relaxed">
            Medical routing synchronized with {survivors.filter((s) => s.status === "active").length} active entities.
          </p>
        </div>
      </div>

      {/* Active Quarantine Events */}
      {activeQuarantine.length > 0 && (
        <section className="bg-red-50 rounded-3xl border-2 border-red-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-red-100 flex justify-between items-center">
            <h3 className="text-xl font-bold text-red-800 tracking-tight flex items-center gap-3">
              <span className="h-3 w-3 rounded-full bg-red-500 animate-pulse" />
              Active Quarantine Lockdowns
            </h3>
          </div>
          <div className="p-8 space-y-4">
            {activeQuarantine.map((q) => {
              const survivor = survivors.find((s) => s.id === q.survivor_id);
              return (
                <div key={q.id} className="p-6 rounded-2xl bg-white border border-red-100 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-800">{survivor?.full_name ?? q.survivor_id}</p>
                    <p className="text-sm font-bold text-red-600 mt-1">{q.reason}</p>
                  </div>
                  <span className="text-xs font-black text-red-600 uppercase tracking-widest px-3 py-1 bg-red-50 rounded-lg border border-red-100">Isolated</span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Domain Policies */}
      <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <h3 className="text-xl font-bold text-slate-800 tracking-tight">Medical Domain Directives</h3>
          <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-blue-100">Live API Data</span>
        </div>
        <div className="p-8 space-y-6">
          {pulsePolicies.length > 0 ? (
            pulsePolicies.map((p) => (
              <div key={p.id} className="p-8 rounded-2xl border border-slate-100 bg-slate-50/30 group hover:bg-white hover:border-blue-200 hover:shadow-lg transition-all">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-black text-blue-600">{p.policy_code}</span>
                      <h4 className="text-2xl font-black text-slate-800 tracking-tight">{p.name}</h4>
                    </div>
                    <p className="text-slate-500 font-medium leading-relaxed max-w-2xl">{p.description}</p>
                  </div>
                  <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${p.status === "active" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-orange-50 text-orange-600 border border-orange-100"}`}>
                    {p.status}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center py-12 text-slate-400 font-bold uppercase tracking-widest text-sm italic">No specific directives for the Medical / Pulse domain.</p>
          )}
        </div>
      </section>
    </div>
  );
}
