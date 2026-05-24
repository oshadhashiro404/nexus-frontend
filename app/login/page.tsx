"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Btn, FieldInput, Label, Panel } from "@/components/terminal-ui";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "nexus-admin") {
      router.push("/dashboard");
    } else {
      setError("AUTHORIZATION DENIED: invalid credential");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4">
      <div className="w-full max-w-sm">
        <p className="text-[10px] text-[var(--muted)] uppercase tracking-[0.25em] mb-2">nexus-core v1</p>
        <Panel title="authenticate">
          <div className="mb-4">
            <p className="text-xs font-bold text-[var(--fg)]">NexusCore_</p>
            <p className="text-[10px] text-[var(--muted)] mt-0.5">governance terminal access</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-3">
            <div>
              <Label htmlFor="admin-id">administrator id</Label>
              <FieldInput id="admin-id" type="text" disabled value="NEXUS-PRIME-01" />
            </div>
            <div>
              <Label htmlFor="password">security key</Label>
              <FieldInput
                id="password"
                type="password"
                required
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
              />
            </div>

            {error ? (
              <div className="border border-[var(--red)]/40 bg-[var(--red)]/10 px-2 py-1.5 text-[10px] text-[var(--red)] animate-shake">
                {error}
              </div>
            ) : null}

            <Btn type="submit" className="w-full">
              authenticate
            </Btn>
          </form>

          <p className="mt-4 pt-3 border-t border-[var(--line)] text-[9px] text-[var(--muted)] uppercase tracking-[0.2em] text-center">
            domain-04 governance
          </p>
        </Panel>
      </div>
    </div>
  );
}
