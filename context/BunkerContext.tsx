"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  normalizePolicy,
  nexusFetch,
  type NexusPolicy,
} from "@/lib/nexus-api";

if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_NEXUS_API_URL) {
  console.error(
    "[NEXUS] Remove NEXT_PUBLIC_NEXUS_API_URL from .env — it causes CORS. Use /api proxy only.",
  );
}

export type Clearance = "NONE" | "DELTA" | "GAMMA" | "BETA" | "ALPHA" | "NEXUS";
export type SurvivorStatus = "active" | "quarantined" | "deceased" | "missing";
export type PolicyStatus = "draft" | "active" | "suspended" | "retired";

export type Policy = NexusPolicy & { status: PolicyStatus; min_clearance: Clearance };

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
  policies: Policy[];
  survivors: Survivor[];
  healthRecords: HealthRecord[];
  quarantineEvents: QuarantineEvent[];
  dbConnected: boolean;
  connectionError: string | null;
  loading: boolean;
  actionError: string | null;
  clearActionError: () => void;
  refreshData: () => void;
  addSurvivor: (data: Partial<Survivor>) => Promise<boolean>;
  updateSurvivor: (id: string, data: Partial<Survivor>) => Promise<boolean>;
  deleteSurvivor: (id: string) => Promise<boolean>;
  addPolicy: (body: Record<string, unknown>) => Promise<boolean>;
  updatePolicy: (id: string, data: Record<string, unknown>) => Promise<boolean>;
  deletePolicy: (id: string) => Promise<boolean>;
}

const BunkerContext = createContext<BunkerContextType | undefined>(undefined);

function formatApiError(error: string, details?: unknown) {
  if (!details) return error;
  const detailStr = typeof details === "string" ? details : JSON.stringify(details);
  return `${error}: ${detailStr}`;
}

export function BunkerProvider({ children }: { children: React.ReactNode }) {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [survivors, setSurvivors] = useState<Survivor[]>([]);
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([]);
  const [quarantineEvents, setQuarantineEvents] = useState<QuarantineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [dbConnected, setDbConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const clearActionError = useCallback(() => setActionError(null), []);

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

      const rawPolicies = (pJson?.data?.items ?? []) as Policy[];
      setPolicies(rawPolicies.map((p) => normalizePolicy(p) as Policy));
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

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addSurvivor = async (data: Partial<Survivor>) => {
    setActionError(null);
    const result = await nexusFetch<Survivor>("/api/admin/survivors", {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (!result.ok) {
      setActionError(formatApiError(result.error, result.details));
      return false;
    }
    setSurvivors((prev) => [result.data, ...prev]);
    return true;
  };

  const updateSurvivor = async (id: string, data: Partial<Survivor>) => {
    setActionError(null);
    const result = await nexusFetch<Survivor>(`/api/admin/survivors/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    if (!result.ok) {
      setActionError(formatApiError(result.error, result.details));
      return false;
    }
    setSurvivors((prev) => prev.map((s) => (s.id === id ? result.data : s)));
    return true;
  };

  const deleteSurvivor = async (id: string) => {
    setActionError(null);
    const result = await nexusFetch<{ id: string }>(`/api/admin/survivors/${id}`, {
      method: "DELETE",
    });
    if (!result.ok) {
      setActionError(formatApiError(result.error, result.details));
      return false;
    }
    setSurvivors((prev) => prev.filter((s) => s.id !== id));
    return true;
  };

  const addPolicy = async (body: Record<string, unknown>) => {
    setActionError(null);
    const result = await nexusFetch<Policy>("/api/admin/policies", {
      method: "POST",
      body: JSON.stringify(body),
    });
    if (!result.ok) {
      setActionError(formatApiError(result.error, result.details));
      return false;
    }
    setPolicies((prev) => [normalizePolicy(result.data) as Policy, ...prev]);
    return true;
  };

  const updatePolicy = async (id: string, data: Record<string, unknown>) => {
    setActionError(null);
    const result = await nexusFetch<Policy>(`/api/admin/policies/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    if (!result.ok) {
      setActionError(formatApiError(result.error, result.details));
      return false;
    }
    setPolicies((prev) =>
      prev.map((p) => (p.id === id ? (normalizePolicy(result.data) as Policy) : p)),
    );
    return true;
  };

  const deletePolicy = async (id: string) => {
    setActionError(null);
    const result = await nexusFetch<{ id: string }>(`/api/admin/policies/${id}`, {
      method: "DELETE",
    });
    if (!result.ok) {
      setActionError(formatApiError(result.error, result.details));
      return false;
    }
    setPolicies((prev) => prev.filter((p) => p.id !== id));
    return true;
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
        actionError,
        clearActionError,
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
