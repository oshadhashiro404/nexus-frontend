"use client";

import { embedHostLabel } from "@/lib/nexus-config";

type SectorEmbedProps = {
  title: string;
  src: string;
  iframeTitle: string;
  /** Direct URL for “open tab” (defaults to src when absolute). */
  openUrl?: string;
};

export function SectorEmbed({ title, src, iframeTitle, openUrl }: SectorEmbedProps) {
  const tabUrl = openUrl ?? src;
  const host = embedHostLabel(src, openUrl);

  return (
    <div className="flex flex-col flex-1 min-h-0 w-full h-full">
      <div className="shrink-0 flex items-center justify-between border-b border-[var(--line)] bg-[var(--panel)] px-3 py-1.5">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--fg)]">{title}</p>
          <p className="text-[9px] text-[var(--muted)] truncate">embedded · {host}</p>
        </div>
        <a
          href={tabUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 text-[9px] uppercase tracking-wide text-[var(--fg-dim)] hover:text-[var(--fg)] border border-[var(--line)] px-2 py-1"
        >
          open tab ↗
        </a>
      </div>

      <iframe
        title={iframeTitle}
        src={src}
        className="flex-1 w-full min-h-0 h-full border-0 bg-black"
        allow="fullscreen"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
