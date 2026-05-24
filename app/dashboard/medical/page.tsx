"use client";

import { useState } from "react";
import { useBunker } from "@/context/BunkerContext";

const FACILITIES = [
  { name: "Central Med-Hub", capacity: 92, resources: "High" },
  { name: "Zone 3 Clinic", capacity: 45, resources: "Nominal" },
];

export default function MedicalSector() {
  const { healthRecords, quarantineEvents, survivors, loading } = useBunker();
  const [emergency, setEmergency] = useState(false);
  const [facilities, setFacilities] = useState(FACILITIES);

  const updateFacility = (name: string, resources: string) =>
    setFacilities((prev) => prev.map((f) => f.name === name ? { ...f, resources } : f));

  const activeQuarantine = quarantineEvents.filter((q) => q.is_active);

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <div className="h-10 w-10 border-4 border-rose-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900">Medical Sector</h1>
          <p className="text-xl text-slate-500 mt-2 font-medium">Global health monitoring and facility management.</p>
        </div>
        <button
          onClick={() => setEmergency(!emergency)}
          className={`px-10 py-5 rounded-2xl text-xl font-black transition-all shadow-xl active:scale-95 ${emergency ? "bg-red-600 text-white shadow-red-200 animate-pulse" : "bg-white text-red-600 border-4 border-red-600 shadow-slate-100"}`}
        >
          {emergency ? "EMERGENCY PROTOCOL ACTIVE" : "INITIATE EMERGENCY OVERRIDE"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="p-10 rounded-3xl border border-slate-200 bg-white shadow-xl">
          <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Health Records</p>
          <p className="text-6xl font-black text-slate-900 mt-4 tracking-tighter">{healthRecords.length}</p>
          <div className="mt-6 flex items-center gap-2 text-green-600 font-black italic">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="18 15 12 9 6 15"/></svg>
            TRACKED
          </div>
        </div>

        <div className="p-10 rounded-3xl border border-slate-200 bg-white shadow-xl">
          <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Active Quarantines</p>
          <p className={`text-6xl font-black mt-4 tracking-tighter ${activeQuarantine.length > 0 ? "text-red-600" : "text-emerald-600"}`}>
            {activeQuarantine.length}
          </p>
          <div className={`mt-6 flex items-center gap-2 font-black italic ${activeQuarantine.length > 0 ? "text-red-600" : "text-emerald-600"}`}>
            <span className={`h-3 w-3 rounded-full ${activeQuarantine.length > 0 ? "bg-red-500 animate-pulse" : "bg-emerald-500"}`} />
            {activeQuarantine.length > 0 ? "ISOLATIONS ACTIVE" : "ALL CLEAR"}
          </div>
        </div>

        <div className="md:col-span-1 p-10 rounded-3xl border border-slate-200 bg-white shadow-xl">
          <h3 className="text-2xl font-black text-slate-900 mb-8 tracking-tight underline decoration-blue-500 decoration-4 underline-offset-8">
            Facility Resource Allocation
          </h3>
          <div className="space-y-6">
            {facilities.map((f) => (
              <div key={f.name} className="flex flex-col gap-4 p-6 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-xl font-black text-slate-900">{f.name}</span>
                <div className="flex items-center gap-8">
                  <div className="text-right flex-1">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Resource Load</p>
                    <select
                      value={f.resources}
                      onChange={(e) => updateFacility(f.name, e.target.value)}
                      className="bg-transparent text-lg font-black text-blue-600 outline-none cursor-pointer"
                    >
                      <option>Critical</option>
                      <option>High</option>
                      <option>Nominal</option>
                      <option>Low</option>
                    </select>
                  </div>
                  <div className="h-10 w-px bg-slate-200" />
                  <div className="text-right">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Occupancy</p>
                    <p className="text-lg font-black text-slate-900">{f.capacity}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent health records */}
      {healthRecords.length > 0 && (
        <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-100">
            <h3 className="text-xl font-bold text-slate-800">Recent Health Assessments</h3>
          </div>
          <div className="p-8 space-y-4">
            {healthRecords.slice(0, 10).map((h) => {
              const survivor = survivors.find((s) => s.id === h.survivor_id);
              return (
                <div key={h.id} className="p-6 rounded-2xl border border-slate-100 bg-slate-50/30 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-800">{survivor?.full_name ?? h.survivor_id}</p>
                    <p className="text-sm font-bold text-slate-500 mt-1">{h.condition}</p>
                    {h.notes && <p className="text-xs text-slate-400 mt-1">{h.notes}</p>}
                  </div>
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{new Date(h.assessed_at).toLocaleDateString()}</span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <div className="p-10 rounded-3xl border border-slate-200 bg-white shadow-xl">
        <h3 className="text-2xl font-black text-slate-900 mb-8">Medical Research Initiatives</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 rounded-2xl border-4 border-dashed border-slate-100 flex flex-col items-center justify-center text-center group hover:border-blue-200 transition-colors cursor-pointer">
            <div className="h-16 w-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 5v14M5 12h14"/></svg>
            </div>
            <p className="text-xl font-black text-slate-900">Propose New Research Grant</p>
            <p className="text-sm font-bold text-slate-400 mt-2 uppercase tracking-widest">ALPHA Clearance Required</p>
          </div>
          <div className="p-8 rounded-2xl bg-blue-600 shadow-lg shadow-blue-100 text-white">
            <h4 className="text-xl font-black mb-4">Neural Regeneration V2</h4>
            <div className="space-y-4">
              <div className="h-3 w-full bg-blue-400 rounded-full overflow-hidden">
                <div className="h-full bg-white" style={{ width: "84%" }} />
              </div>
              <div className="flex justify-between text-sm font-black uppercase tracking-widest">
                <span>Phase: Human Trials</span>
                <span>84% Progress</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
