"use client";

import { useBunker } from "@/context/BunkerContext";

export function ActionErrorBanner() {
  const { actionError, clearActionError } = useBunker();
  if (!actionError) return null;

  return (
    <div className="rounded-md bg-red-500/10 border border-red-500/30 p-3 flex items-start justify-between gap-3">
      <div>
        <p className="text-xs font-bold text-red-300 uppercase tracking-widest">Operation failed</p>
        <p className="text-xs font-semibold text-red-200 mt-1">{actionError}</p>
      </div>
      <button
        type="button"
        onClick={clearActionError}
        className="text-red-400 hover:text-red-200 font-bold text-lg leading-none"
        aria-label="Dismiss"
      >
        ×
      </button>
    </div>
  );
}
