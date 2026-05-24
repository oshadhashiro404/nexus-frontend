"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

// Always same-origin — browser calls `/api/*`, forwarded server-side (no CORS).
if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_NEXUS_API_URL) {
  console.error(
    "[NEXUS] Remove NEXT_PUBLIC_NEXUS_API_URL from .env — it causes CORS. Use /api proxy only.",
  );
}

function apiPath(path: string) {
  const p = path.startsWith("/") ? path : `/${path}`;
  if (p.startsWith("http://") || p.startsWith("https://")) {
    throw new Error("API calls must use /api/... paths, not full URLs");
  }
  return p;
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type Clearance = "NONE" | "DELTA" | "GAMMA" | "BETA" | "ALPHA" | "NEXUS";
export type SurvivorStatus = "active" | "quarantined" | "deceased" | "missing";
export type PolicyStatus = "draft" | "active" | "suspended" | "retired";

export interface Survivor {
  id: string;
  identity_code: string;
  full_name: string;
  duty: string | null;
  clearance: Clearance;
  status: SurvivorStatus;
  assigned_zone_id: string | null;
  registered_at: string;
  updated_at: string;
}

export interface Policy {
  id: string;
  policy_code: string;
  name: string;
  description: string | null;
  domain: string;
  integration_domain_id: string | null;
  is_general: boolean;
  is_mandatory: boolean;
  status: PolicyStatus;
  min_clearance: Clearance;
  enacted_at: string | null;
  retired_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface HealthRecord {
  id: string;
  survivor_id: string;
  condition: string;
  assessed_by: string | null;
  notes: string | null;
  pulse_signal_id: string | null;
  assessed_at: string;
}

export interface QuarantineEvent {
  id: string;
  survivor_id: string;
  zone_id: string | null;
  reason: string;
  is_active: boolean;
  quarantine_start: string;
  quarantine_end: string | null;
}

interface BunkerContextType {
  // data
  policies: Policy[];
  survivors: Survivor[];
  healthRecords: HealthRecord[];
  quarantineEvents: QuarantineEvent[];
  // status
  dbConnected: boolean;
  connectionError: string | null;
  loading: boolean;
  // actions
  refreshData: () => void;
  addSurvivor: (data: Partial<Survivor>) => Promise<void>;
  updateSurvivor: (id: string, data: Partial<Survivor>) => Promise<void>;
  deleteSurvivor: (id: string) => Promise<void>;
  addPolicy: (data: Partial<Policy>) => Promise<void>;
  updatePolicy: (id: string, data: Partial<Policy>) => Promise<void>;
  deletePolicy: (id: string) => Promise<void>;
}

const BunkerContext = createContext<BunkerContextType | undefined>(undefined);

async function apiFetch(path: string, init?: RequestInit) {
  const res = await fetch(apiPath(path), {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  return res.json();
}

export function BunkerProvider({ children }: { children: React.ReactNode }) {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [survivors, setSurvivors] = useState<Survivor[]>([]);
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([]);
  const [quarantineEvents, setQuarantineEvents] = useState<QuarantineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [dbConnected, setDbConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setConnectionError(null);

      const [pRes, sRes] = await Promise.all([
        fetch("/api/admin/policies?limit=200"),
        fetch("/api/admin/survivors?limit=200"),
      ]);

      if (!pRes.ok || !sRes.ok) {
        throw new Error(`API failure — Policies:${pRes.status} Survivors:${sRes.status}`);
      }

      const [pJson, sJson] = await Promise.all([pRes.json(), sRes.json()]);

      const [hRes, qRes] = await Promise.allSettled([
        fetch("/api/admin/health-records?limit=200"),
        fetch("/api/admin/quarantine-events?limit=200"),
      ]);

      setPolicies(pJson?.data?.items ?? []);
      setSurvivors(sJson?.data?.items ?? []);

      if (hRes.status === "fulfilled" && hRes.value.ok) {
        const hJson = await hRes.value.json();
        setHealthRecords(hJson?.data?.items ?? []);
      }
      if (qRes.status === "fulfilled" && qRes.value.ok) {
        const qJson = await qRes.value.json();
        setQuarantineEvents(qJson?.data?.items ?? []);
      }

      setDbConnected(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setConnectionError(msg);
      setDbConnected(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const addSurvivor = async (data: Partial<Survivor>) => {
    const json = await apiFetch("/api/admin/survivors", {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (json?.ok) setSurvivors((prev) => [json.data, ...prev]);
  };

  const updateSurvivor = async (id: string, data: Partial<Survivor>) => {
    const json = await apiFetch(`/api/admin/survivors/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    if (json?.ok)
      setSurvivors((prev) => prev.map((s) => (s.id === id ? json.data : s)));
  };

  const deleteSurvivor = async (id: string) => {
    const json = await apiFetch(`/api/admin/survivors/${id}`, { method: "DELETE" });
    if (json?.ok) setSurvivors((prev) => prev.filter((s) => s.id !== id));
  };

  const addPolicy = async (data: Partial<Policy>) => {
    const json = await apiFetch("/api/admin/policies", {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (json?.ok) setPolicies((prev) => [json.data, ...prev]);
  };

  const updatePolicy = async (id: string, data: Partial<Policy>) => {
    const json = await apiFetch(`/api/admin/policies/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    if (json?.ok)
      setPolicies((prev) => prev.map((p) => (p.id === id ? json.data : p)));
  };

  const deletePolicy = async (id: string) => {
    const json = await apiFetch(`/api/admin/policies/${id}`, { method: "DELETE" });
    if (json?.ok) setPolicies((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <BunkerContext.Provider
      value={{
        policies,
        survivors,
        healthRecords,
        quarantineEvents,
        dbConnected,
        connectionError,
        loading,
        refreshData: fetchData,
        addSurvivor,
        updateSurvivor,
        deleteSurvivor,
        addPolicy,
        updatePolicy,
        deletePolicy,
      }}
    >
      {children}
    </BunkerContext.Provider>
  );
}

export function useBunker() {
  const ctx = useContext(BunkerContext);
  if (!ctx) throw new Error("useBunker must be used inside BunkerProvider");
  return ctx;
}
