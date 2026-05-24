"use client";

import { useBunker } from "@/context/BunkerContext";

export function ActionErrorBanner() {
  const { actionError, clearActionError } = useBunker();
  if (!actionError) return null;

  return (
    <div className="border border-[var(--red)]/40 bg-[var(--red)]/10 px-2 py-1.5 flex items-start justify-between gap-2">
      <div>
        <p className="text-[9px] font-bold text-[var(--red)] uppercase tracking-wider">err</p>
        <p className="text-[11px] text-[var(--red)] mt-0.5">{actionError}</p>
      </div>
      <button
        type="button"
        onClick={clearActionError}
        className="text-[var(--red)] hover:text-[var(--fg)] text-xs leading-none"
        aria-label="Dismiss"
      >
        [x]
      </button>
    </div>
  );
}
