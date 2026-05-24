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
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#070b11] p-4">
      <div className="w-full max-w-lg space-y-6 rounded-lg border border-slate-800 bg-[#0d1420] p-8">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 active:scale-95 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </div>
          <h1 className="mt-5 text-3xl font-bold tracking-wide text-emerald-100">NexusCore</h1>
          <p className="mt-2 text-sm font-bold text-slate-500 uppercase tracking-[0.2em]">
            Governance Terminal Access
          </p>
        </div>

        <form className="mt-4 space-y-5" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <label htmlFor="admin-id" className="block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-2 px-1">
                Administrator ID
              </label>
              <input
                id="admin-id"
                type="text"
                disabled
                value="NEXUS-PRIME-01"
                className="mt-1 block w-full rounded-md border border-slate-800 bg-[#111b2a] px-4 py-3 text-sm font-semibold text-slate-500 cursor-not-allowed"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-2 px-1">
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
                className="mt-1 block w-full rounded-md border border-slate-700 bg-[#070b11] px-4 py-3 text-base font-semibold text-emerald-100 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all placeholder:text-slate-600"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-500/10 p-3 text-center text-xs font-bold text-red-300 border border-red-500/30 animate-shake">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="flex w-full justify-center rounded-md bg-emerald-500/15 border border-emerald-500/30 px-4 py-3 text-sm font-bold text-emerald-300 hover:bg-emerald-500/20 active:scale-[0.98] transition-all uppercase tracking-wider"
          >
            Authenticate Access
          </button>
        </form>

        <div className="mt-4 pt-4 border-t border-slate-800">
          <p className="text-center text-[10px] font-bold text-slate-600 uppercase tracking-[0.25em]">
            Property of Domain 04 Governance
          </p>
        </div>
      </div>
    </div>
  );
}
