"use client";

import { useState } from "react";
import { useBunker } from "@/context/BunkerContext";

const INITIAL_REQUESTS = [
  { id: "REQ-901", requester: "ARCHIVE-CORE", asset: "Pre-Collapse Medical Records", clearance: "BETA", status: "Pending" },
  { id: "REQ-902", requester: "ARCHIVE-RESEARCH", asset: "Global Satellite Maps", clearance: "ALPHA", status: "Pending" },
];

export default function ArchiveHub() {
  const { policies, loading } = useBunker();
  const archivePolicies = policies.filter(
    (p) => !p.is_general && (p.domain?.toLowerCase() === "nexus" || p.domain?.toLowerCase() === "archive")
  );
  const [requests, setRequests] = useState(INITIAL_REQUESTS);

  const approve = (id: string) =>
    setRequests((prev) => prev.map((r) => r.id === id ? { ...r, status: "Approved" } : r));

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <div className="h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Archive & Education Hub</h1>
        <p className="text-xl text-slate-500 font-medium italic">Consolidated knowledge preservation and survivor propagation center.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Literacy Index</p>
          <p className="text-5xl font-extrabold text-slate-900 tracking-tighter">98.4%</p>
          <div className="mt-6 flex items-center gap-2 text-emerald-600 font-black text-xs uppercase tracking-widest">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Bunker-Wide
          </div>
        </div>
        <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Decryption Load</p>
          <p className="text-5xl font-extrabold text-blue-600 tracking-tighter">12.4%</p>
          <div className="mt-6 flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-widest">
            <span className="h-2 w-2 rounded-full bg-blue-500" />
            Processing...
          </div>
        </div>
        <div className="bg-slate-900 p-10 rounded-3xl shadow-xl text-white">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Storage Status</p>
          <div className="flex items-center gap-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-blue-400"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            <span className="text-2xl font-black italic uppercase tracking-tighter">Cold Storage</span>
          </div>
          <p className="mt-6 text-sm font-bold text-slate-400 leading-relaxed">NEXUS authorization required to unlock higher-tier knowledge segments.</p>
        </div>
      </div>

      <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <h3 className="text-xl font-bold text-slate-800 tracking-tight">NEXUS Core Directives</h3>
          <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-blue-100">Governance API</span>
        </div>
        <div className="p-8 space-y-6">
          {archivePolicies.length > 0 ? (
            archivePolicies.map((p) => (
              <div key={p.id} className="p-8 rounded-2xl border border-slate-100 bg-slate-50/30 group hover:bg-white hover:border-blue-200 transition-all">
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
            <p className="text-center py-12 text-slate-400 font-bold uppercase tracking-widest text-sm italic">No directives found in knowledge archives.</p>
          )}
        </div>
      </section>

      <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-xl font-bold text-slate-800">Knowledge Access Requests</h3>
        </div>
        <div className="p-8 space-y-6">
          {requests.map((req) => (
            <div key={req.id} className="p-8 rounded-3xl border border-slate-100 bg-slate-50/30 flex flex-col md:flex-row md:items-center justify-between gap-8 hover:bg-white transition-all group">
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <span className="font-mono text-sm font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">{req.id}</span>
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{req.requester}</span>
                </div>
                <h4 className="text-2xl font-black text-slate-800 tracking-tight group-hover:text-blue-700 transition-colors">{req.asset}</h4>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Required Clearance: <span className="text-slate-900">{req.clearance}</span></p>
              </div>
              <div className="flex items-center gap-4">
                {req.status === "Approved" ? (
                  <span className="px-8 py-4 bg-emerald-50 text-emerald-700 font-black uppercase text-sm rounded-2xl border border-emerald-100">Approved</span>
                ) : (
                  <button
                    onClick={() => approve(req.id)}
                    className="px-8 py-4 bg-slate-900 text-white font-black uppercase text-sm rounded-2xl hover:bg-blue-600 transition-all shadow-lg active:scale-95"
                  >
                    Verify & Approve
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
