import type { ReactNode } from "react";

export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="border-b border-[var(--line)] pb-3">
      <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--muted)] mb-1">{">"} sys</p>
      <h1 className="text-sm font-bold uppercase tracking-wider text-[var(--fg)]">{title}</h1>
      {subtitle ? <p className="text-xs text-[var(--muted)] mt-1 font-normal normal-case tracking-normal">{subtitle}</p> : null}
    </header>
  );
}

export function Panel({
  children,
  className = "",
  title,
}: {
  children: ReactNode;
  className?: string;
  title?: string;
}) {
  return (
    <section className={`border border-[var(--line)] bg-[var(--panel)] ${className}`}>
      {title ? (
        <div className="border-b border-[var(--line)] px-3 py-2">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--fg-dim)]">{title}</h2>
        </div>
      ) : null}
      <div className="p-3">{children}</div>
    </section>
  );
}

export function Stat({ label, value, hint }: { label: string; value: ReactNode; hint?: string }) {
  return (
    <div className="border border-[var(--line)] bg-[var(--panel)] p-3">
      <p className="text-[9px] uppercase tracking-[0.2em] text-[var(--muted)] mb-1">{label}</p>
      <p className="text-lg font-bold text-[var(--fg)] tabular-nums leading-none">{value}</p>
      {hint ? <p className="text-[10px] text-[var(--muted)] mt-2 uppercase tracking-wide">{hint}</p> : null}
    </div>
  );
}

export function Label({ htmlFor, children }: { htmlFor?: string; children: ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="block text-[9px] font-bold uppercase tracking-[0.15em] text-[var(--muted)] mb-1">
      {children}
    </label>
  );
}

const fieldClass =
  "w-full border border-[var(--line)] bg-[var(--bg)] px-2 py-1.5 text-xs text-[var(--fg)] placeholder:text-[var(--muted)] focus:border-[var(--fg-dim)] focus:outline-none disabled:opacity-40";

export function FieldInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${fieldClass} ${props.className ?? ""}`} />;
}

export function FieldSelect(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`${fieldClass} cursor-pointer ${props.className ?? ""}`} />;
}

export function FieldTextarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${fieldClass} resize-y min-h-[4rem] ${props.className ?? ""}`} />;
}

export function Btn({
  children,
  variant = "primary",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" | "danger" }) {
  const styles =
    variant === "primary"
      ? "border-[var(--fg-dim)] bg-[var(--fg-dim)]/10 text-[var(--fg)] hover:bg-[var(--fg-dim)]/20"
      : variant === "danger"
        ? "border-[var(--red)]/40 bg-[var(--red)]/10 text-[var(--red)] hover:bg-[var(--red)]/20"
        : "border-[var(--line)] text-[var(--muted)] hover:text-[var(--fg)] hover:border-[var(--fg-dim)]";

  return (
    <button
      type="button"
      {...props}
      className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider border transition-colors disabled:opacity-40 ${styles} ${className}`}
    >
      {children}
    </button>
  );
}

export function Badge({
  children,
  tone = "default",
}: {
  children: ReactNode;
  tone?: "default" | "ok" | "warn" | "err";
}) {
  const tones = {
    default: "border-[var(--line)] text-[var(--muted)]",
    ok: "border-[var(--fg-dim)]/40 text-[var(--fg)]",
    warn: "border-[var(--amber)]/40 text-[var(--amber)]",
    err: "border-[var(--red)]/40 text-[var(--red)]",
  };
  return (
    <span className={`inline-block px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide border ${tones[tone]}`}>
      {children}
    </span>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <p className="text-xs text-[var(--muted)] py-4 text-center">{children}</p>;
}
