"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "nexus-admin") {
      router.push("/dashboard");
    } else {
      setError("AUTHORIZATION DENIED: Invalid Administrative Credential");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-6 font-sans">
      <div className="w-full max-w-xl space-y-10 rounded-[3rem] border border-white bg-white/80 p-16 shadow-2xl shadow-slate-200 backdrop-blur-xl">
        <div className="text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-blue-600 text-white shadow-xl shadow-blue-200 active:scale-95 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </div>
          <h1 className="mt-8 text-5xl font-extrabold tracking-tighter text-slate-900">NexusCore</h1>
          <p className="mt-3 text-lg font-bold text-slate-400 uppercase tracking-widest">
            Governance Terminal Access
          </p>
        </div>

        <form className="mt-12 space-y-8" onSubmit={handleLogin}>
          <div className="space-y-6">
            <div>
              <label htmlFor="admin-id" className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 px-1">
                Administrator ID
              </label>
              <input
                id="admin-id"
                type="text"
                disabled
                value="NEXUS-PRIME-01"
                className="mt-2 block w-full rounded-2xl border border-slate-100 bg-slate-50 px-6 py-4 text-lg font-bold text-slate-400 cursor-not-allowed"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 px-1">
                Security Key
              </label>
              <input
                id="password"
                type="password"
                required
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-2 block w-full rounded-2xl border border-slate-200 bg-white px-6 py-4 text-xl font-bold text-slate-900 shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all placeholder:text-slate-200"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-2xl bg-red-50 p-4 text-center text-sm font-bold text-red-600 border border-red-100 animate-shake">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="flex w-full justify-center rounded-2xl bg-slate-900 px-6 py-5 text-xl font-black text-white shadow-xl shadow-slate-200 hover:bg-blue-600 active:scale-[0.98] transition-all"
          >
            Authenticate Access
          </button>
        </form>

        <div className="mt-12 pt-8 border-t border-slate-100">
          <p className="text-center text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
            Property of Domain 04 Governance
          </p>
        </div>
      </div>
    </div>
  );
}
