"use client";

import { ARCHIVE_EMBED_URL } from "@/lib/nexus-config";

export default function ArchivePage() {
  return (
    <div className="flex flex-col flex-1 min-h-0 w-full">
      <div className="shrink-0 flex items-center justify-between border-b border-[var(--line)] bg-[var(--panel)] px-3 py-1.5">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--fg)]">
            Protocol UNsCRYPTED
          </p>
          <p className="text-[9px] text-[var(--muted)] truncate">
            embedded · {ARCHIVE_EMBED_URL.replace(/^https?:\/\//, "")}
          </p>
        </div>
        <a
          href={ARCHIVE_EMBED_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 text-[9px] uppercase tracking-wide text-[var(--fg-dim)] hover:text-[var(--fg)] border border-[var(--line)] px-2 py-1"
        >
          open tab ↗
        </a>
      </div>

      <iframe
        title="Protocol UNsCRYPTED — Archive System"
        src={ARCHIVE_EMBED_URL}
        className="flex-1 w-full min-h-0 border-0 bg-black"
        allow="fullscreen"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
