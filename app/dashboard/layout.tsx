"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BunkerProvider } from "@/context/BunkerContext";
import { HOSTED_API_URL } from "@/lib/nexus-config";

const navigation = [
  {
    name: "Command Overview", href: "/dashboard",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" /></svg>,
  },
  {
    name: "Survivor Census", href: "/dashboard/census",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  },
  {
    name: "Policy Engine", href: "/dashboard/policies",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><line x1="10" y1="9" x2="8" y2="9" /></svg>,
  },
  {
    name: "Clearance Matrix", href: "/dashboard/authorization",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  },
];

const sectorHubs = [
  {
    name: "Harvesting", href: "/dashboard/harvesting", color: "text-amber-600",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" /><path d="M2 21c0-3 1.85-5.36 5.08-6C10.5 14.28 12 13.5 14 11c1 2 1.63 4.1 1 8-.63 3.9-3 6-3 6" /></svg>,
  },
  {
    name: "Pulse (Medical)", href: "/dashboard/pulse", color: "text-blue-600",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
  },
  {
    name: "Telecom / Signal", href: "/dashboard/telecom", color: "text-cyan-600",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h.01" /><path d="M2 8.82a15 15 0 0 1 20 0" /><path d="M5 12.859a10 10 0 0 1 14 0" /><path d="M8.5 16.429a5 5 0 0 1 7 0" /></svg>,
  },
  {
    name: "Archive", href: "/dashboard/archive", color: "text-indigo-600",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2"/><path d="M21 14v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2"/><rect width="20" height="8" x="2" y="8" rx="2"/><path d="M6 12h.01"/><path d="M10 12h.01"/></svg>,
  },
  {
    name: "Medical Sector", href: "/dashboard/medical", color: "text-rose-600",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>,
  },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <BunkerProvider>
      <div className="flex h-screen bg-[#070b11] overflow-hidden text-emerald-100">
        {/* Sidebar */}
        <aside className="w-72 bg-[#0d1420] border-r border-slate-200 flex flex-col">
          <div className="p-5">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-md bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
              </div>
              <span className="font-bold text-lg tracking-wide text-emerald-100">NexusCore</span>
            </Link>
          </div>

          <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-5">
            <div>
              <h3 className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Core Governance</h3>
              <ul className="space-y-1">
                {navigation.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-semibold transition-all ${pathname === item.href ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30" : "text-slate-400 hover:bg-slate-900 hover:text-slate-100 border border-transparent"}`}
                    >
                      <span className={pathname === item.href ? "text-emerald-300" : "text-slate-500"}>{item.icon}</span>
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Sector Hubs</h3>
              <ul className="space-y-1">
                {sectorHubs.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2 rounded-md text-xs font-semibold transition-all ${pathname === item.href ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30" : "text-slate-400 hover:bg-slate-900 hover:text-slate-100 border border-transparent"}`}
                    >
                      <span className={pathname === item.href ? item.color : "text-slate-600"}>{item.icon}</span>
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          <div className="p-4 mt-auto">
            <div className="p-3 bg-[#111b2a] border border-slate-100 rounded-md flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-emerald-500/15 text-emerald-300 flex items-center justify-center font-bold text-[10px]">NP</div>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold text-slate-200 truncate">Nexus Prime</p>
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider truncate">Overlord</p>
                </div>
              </div>
              <Link href="/login" className="text-slate-500 hover:text-red-400 transition-colors p-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
              </Link>
            </div>
          </div>
        </aside>

        {/* Main area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <header className="h-14 bg-[#0d1420] border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
            <div className="flex items-center gap-4">
              <h2 className="text-sm font-bold text-slate-200 tracking-wide uppercase">
                {[...navigation, ...sectorHubs].find((n) => n.href === pathname)?.name ?? "Governance Console"}
              </h2>
              <div className="flex items-center gap-2 bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20 ml-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[9px] font-bold text-emerald-300 uppercase tracking-widest">Live</span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              <span className="hidden lg:inline">API: {HOSTED_API_URL.replace("https://", "")}</span>
              <span>Bunker ID: DOMAIN-04</span>
              <span className="font-mono text-slate-300 text-xs border-l border-slate-200 pl-3">
                {new Date().toLocaleDateString("en-GB").split("/").join(".")}
              </span>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-6 bg-[#070b11]">
            <div className="max-w-6xl mx-auto space-y-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </BunkerProvider>
  );
}
