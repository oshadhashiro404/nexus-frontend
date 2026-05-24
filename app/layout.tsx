import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";

const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NexusCore | Governance Terminal",
  description: "Administrative terminal for NexusCore.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistMono.variable} h-full`}>
      <body className="terminal-ui min-h-full bg-black text-[var(--fg)] antialiased">{children}</body>
    </html>
  );
}
