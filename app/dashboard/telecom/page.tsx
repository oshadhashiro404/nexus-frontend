"use client";

import { useBunker } from "@/context/BunkerContext";
import { policiesForSector } from "@/lib/nexus-api";

export default function TelecomSector() {
  const { policies, loading } = useBunker();
  const telecomPolicies = policiesForSector(policies, "signal");

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <div className="h-10 w-10 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Telecommunications / Signal Hub</h1>
        <p className="text-xl text-slate-500 font-medium italic">Global network stability and bandwidth distribution monitoring.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Network Load</p>
          <p className="text-5xl font-extrabold text-slate-900 tracking-tighter">68%</p>
          <div className="mt-6 flex items-center gap-2 text-emerald-600 font-black text-xs uppercase tracking-widest">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Optimal Performance
          </div>
        </div>
        <div className="bg-cyan-600 p-10 rounded-3xl shadow-xl shadow-cyan-100 text-white">
          <p className="text-xs font-bold text-cyan-200 uppercase tracking-widest mb-4">Satellite Link</p>
          <div className="flex items-center gap-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-cyan-200"><path d="M12 20h.01" /><path d="M2 8.82a15 15 0 0 1 20 0" /><path d="M5 12.859a10 10 0 0 1 14 0" /><path d="M8.5 16.429a5 5 0 0 1 7 0" /></svg>
            <span className="text-2xl font-black italic uppercase tracking-tighter">Relays Active</span>
          </div>
          <p className="mt-6 text-sm font-bold text-cyan-50 leading-relaxed">
            Sub-orbital data relays synchronized with the central governance node.
          </p>
          <div className="mt-4 text-xs font-black text-cyan-200 uppercase tracking-widest">
            {telecomPolicies.length} Signal Directives
          </div>
        </div>
      </div>

      <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <h3 className="text-xl font-bold text-slate-800 tracking-tight">Signal Domain Directives</h3>
          <span className="px-3 py-1 bg-cyan-50 text-cyan-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-cyan-100">Live API Data</span>
        </div>
        <div className="p-8 space-y-6">
          {telecomPolicies.length > 0 ? (
            telecomPolicies.map((p) => (
              <div key={p.id} className="p-8 rounded-2xl border border-slate-100 bg-slate-50/30 group hover:bg-white hover:border-cyan-200 hover:shadow-lg transition-all">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-black text-cyan-600">{p.policy_code}</span>
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
            <p className="text-center py-12 text-slate-400 font-bold uppercase tracking-widest text-sm italic">No specific directives for the Signal / Telecom domain.</p>
          )}
        </div>
      </section>
    </div>
  );
}
