"use client";

import { useBunker } from "@/context/BunkerContext";

export default function HarvestingSector() {
  const { policies, loading } = useBunker();
  const harvestPolicies = policies.filter(
    (p) => !p.is_general && p.domain?.toLowerCase() === "harvest"
  );

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <div className="h-10 w-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Harvesting Hub</h1>
        <p className="text-xl text-slate-500 font-medium italic">Resource extraction monitoring and nutrient distribution logistics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Total Yield Index</p>
          <p className="text-5xl font-extrabold text-slate-900 tracking-tighter">
            14.2M <span className="text-xl font-bold text-slate-300">Tons</span>
          </p>
          <div className="mt-6 flex items-center gap-2 text-emerald-600 font-black text-xs uppercase tracking-widest">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            +5.4% Optimization
          </div>
        </div>
        <div className="bg-amber-600 p-10 rounded-3xl shadow-xl shadow-amber-100 text-white">
          <p className="text-xs font-bold text-amber-200 uppercase tracking-widest mb-4">Logistics Link</p>
          <div className="flex items-center gap-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-amber-200"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" /><path d="M2 21c0-3 1.85-5.36 5.08-6C10.5 14.28 12 13.5 14 11c1 2 1.63 4.1 1 8-.63 3.9-3 6-3 6" /></svg>
            <span className="text-2xl font-black italic uppercase tracking-tighter">Chain Nominal</span>
          </div>
          <p className="mt-6 text-sm font-bold text-amber-50 leading-relaxed">
            Global supply chain synchronized with census consumption metrics.
          </p>
          <div className="mt-4 text-xs font-black text-amber-200 uppercase tracking-widest">
            {harvestPolicies.length} Active Directives
          </div>
        </div>
      </div>

      <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <h3 className="text-xl font-bold text-slate-800 tracking-tight">Harvest Domain Directives</h3>
          <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-amber-100">Live API Data</span>
        </div>
        <div className="p-8 space-y-6">
          {harvestPolicies.length > 0 ? (
            harvestPolicies.map((p) => (
              <div key={p.id} className="p-8 rounded-2xl border border-slate-100 bg-slate-50/30 group hover:bg-white hover:border-amber-200 hover:shadow-lg transition-all">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-black text-amber-600">{p.policy_code}</span>
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
            <p className="text-center py-12 text-slate-400 font-bold uppercase tracking-widest text-sm italic">No specific directives for the Harvest domain.</p>
          )}
        </div>
      </section>
    </div>
  );
}
