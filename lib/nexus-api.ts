export type PolicyCategory =
  | "WORKFORCE"
  | "HEALTH"
  | "ACCESS"
  | "QUARANTINE"
  | "SECURITY"
  | "RESOURCE";

export type IntegrationDomainCode = "medical" | "harvest" | "signal" | "nexus";

/** Default functional category per integration domain (API `domain` column). */
export const INTEGRATION_TO_CATEGORY: Record<IntegrationDomainCode, PolicyCategory> = {
  harvest: "RESOURCE",
  medical: "HEALTH",
  signal: "SECURITY",
  nexus: "ACCESS",
};

export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; details?: unknown };

export async function nexusFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<ApiResult<T>> {
  const url = path.startsWith("/") ? path : `/${path}`;
  try {
    const res = await fetch(url, {
      ...init,
      headers: { "Content-Type": "application/json", ...init?.headers },
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok || json?.ok === false) {
      const detail =
        typeof json?.details === "string"
          ? json.details
          : json?.details
            ? JSON.stringify(json.details)
            : undefined;
      return {
        ok: false,
        error: json?.error ?? `Request failed (${res.status})`,
        details: detail,
      };
    }
    return { ok: true, data: json.data as T };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Network error",
    };
  }
}

export type NexusPolicy = {
  id: string;
  policy_code: string;
  name: string;
  description: string | null;
  domain: string;
  sector_code?: string | null;
  integration_domain_id: string | null;
  integration_domains?: { id: string; code: string; name: string } | null;
  is_general: boolean;
  is_mandatory: boolean;
  status: string;
  min_clearance: string;
  enacted_at: string | null;
  retired_at: string | null;
  created_at: string;
  updated_at: string;
};

/** Sector hub code for filtering (medical, harvest, signal, nexus, or general). */
export function getPolicySectorCode(policy: NexusPolicy): string | null {
  if (policy.is_general) return "general";
  if (policy.sector_code) return policy.sector_code;
  return null;
}

export function normalizePolicy(raw: NexusPolicy): NexusPolicy {
  const sector =
    raw.integration_domains?.code ??
    raw.sector_code ??
    null;
  return { ...raw, sector_code: sector };
}

export function policiesForSector(policies: NexusPolicy[], sector: string): NexusPolicy[] {
  const code = sector.toLowerCase();
  return policies.filter((p) => {
    if (code === "general") return p.is_general;
    const sectorCode = getPolicySectorCode(p);
    return !p.is_general && sectorCode === code;
  });
}

export function buildPolicyCreateBody(input: {
  name: string;
  description?: string;
  policy_code: string;
  integration_domain: IntegrationDomainCode;
  category?: PolicyCategory;
  is_general: boolean;
  is_mandatory: boolean;
  status: string;
  min_clearance?: string;
}) {
  if (input.is_general) {
    return {
      policy_code: input.policy_code,
      name: input.name,
      description: input.description,
      domain: input.category ?? "SECURITY",
      is_general: true,
      is_mandatory: input.is_mandatory,
      status: input.status,
      min_clearance: input.min_clearance ?? "NONE",
    };
  }
  return {
    policy_code: input.policy_code,
    name: input.name,
    description: input.description,
    domain: input.category ?? INTEGRATION_TO_CATEGORY[input.integration_domain],
    integration_domain_code: input.integration_domain,
    is_general: false,
    is_mandatory: input.is_mandatory,
    status: input.status,
    min_clearance: input.min_clearance ?? "NONE",
  };
}
