"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BunkerProvider } from "@/context/BunkerContext";
import { HOSTED_API_URL } from "@/lib/nexus-config";

const navigation = [
  { name: "Overview", href: "/dashboard" },
  { name: "Census", href: "/dashboard/census" },
  { name: "Policies", href: "/dashboard/policies" },
  { name: "Clearance", href: "/dashboard/authorization" },
];

const sectorHubs = [
  { name: "Harvest", href: "/dashboard/harvesting" },
  { name: "Pulse", href: "/dashboard/pulse" },
  { name: "Signal", href: "/dashboard/telecom" },
  { name: "Archive", href: "/dashboard/archive" },
  { name: "Medical", href: "/dashboard/medical" },
];

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = pathname === href;
  return (
    <Link
      href={href}
      className={`block px-2 py-1.5 text-xs border-l-2 transition-colors ${
        active
          ? "border-[var(--fg)] text-[var(--fg)] bg-[var(--fg)]/5"
          : "border-transparent text-[var(--muted)] hover:text-[var(--fg-dim)] hover:border-[var(--line)]"
      }`}
    >
      {active ? "> " : "  "}
      {label}
    </Link>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const pageTitle =
    [...navigation, ...sectorHubs].find((n) => n.href === pathname)?.name ?? "Console";

  return (
    <BunkerProvider>
      <div className="flex h-screen bg-black overflow-hidden">
        <aside className="w-52 shrink-0 border-r border-[var(--line)] bg-[var(--panel)] flex flex-col">
          <div className="px-3 py-3 border-b border-[var(--line)]">
            <Link href="/dashboard" className="text-xs font-bold uppercase tracking-wider text-[var(--fg)]">
              NexusCore_
            </Link>
            <p className="text-[9px] text-[var(--muted)] mt-0.5 uppercase tracking-[0.2em]">gov terminal</p>
          </div>

          <nav className="flex-1 overflow-y-auto py-2">
            <p className="px-2 py-1 text-[9px] uppercase tracking-[0.2em] text-[var(--muted)]">core</p>
            {navigation.map((item) => (
              <NavLink key={item.href} href={item.href} label={item.name} />
            ))}
            <p className="px-2 py-1 mt-3 text-[9px] uppercase tracking-[0.2em] text-[var(--muted)]">sectors</p>
            {sectorHubs.map((item) => (
              <NavLink key={item.href} href={item.href} label={item.name} />
            ))}
          </nav>

          <div className="p-2 border-t border-[var(--line)]">
            <div className="flex items-center justify-between gap-2 px-2 py-1.5 border border-[var(--line)]">
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-[var(--fg-dim)] truncate">NEXUS-PRIME</p>
                <p className="text-[9px] text-[var(--muted)] uppercase">overlord</p>
              </div>
              <Link href="/login" className="text-[10px] text-[var(--muted)] hover:text-[var(--red)]" title="Logout">
                [x]
              </Link>
            </div>
          </div>
        </aside>

        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-9 shrink-0 border-b border-[var(--line)] bg-[var(--panel)] flex items-center justify-between px-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--fg)]">{pageTitle}</span>
              <span className="text-[9px] text-[var(--fg-dim)] border border-[var(--fg-dim)]/30 px-1">live</span>
            </div>
            <div className="flex items-center gap-3 text-[9px] text-[var(--muted)] uppercase tracking-wide">
              <span className="hidden md:inline truncate max-w-[140px]">
                {HOSTED_API_URL.replace("https://", "")}
              </span>
              <span className="text-[var(--fg-dim)] tabular-nums">
                {new Date().toLocaleDateString("en-GB").split("/").join(".")}
              </span>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-3 bg-black">
            <div className="max-w-5xl mx-auto space-y-3">{children}</div>
          </main>
        </div>
      </div>
    </BunkerProvider>
  );
}
