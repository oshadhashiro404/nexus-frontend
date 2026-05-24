/** Remote registry at EXTERNAL_SURVIVORS_API_URL (e.g. http://69.28.90.158:3001/api/survivors) */

export type ExternalSurvivorSkill = {
  id: string;
  name: string;
  category: string;
  survivorId: string;
};

export type ExternalSurvivor = {
  id: string;
  name: string;
  age: number;
  sector: string;
  registeredAt: string;
  skills: ExternalSurvivorSkill[];
};

type RawSkill = {
  id?: string;
  name?: string;
  category?: string;
  survivorId?: string;
};

type RawSurvivor = {
  id?: string;
  name?: string;
  age?: number;
  sector?: string;
  registeredAt?: string;
  skills?: RawSkill[];
};

export function parseExternalSurvivors(payload: unknown): ExternalSurvivor[] {
  if (!Array.isArray(payload)) return [];

  return payload
    .filter((row): row is RawSurvivor => row !== null && typeof row === "object")
    .map((row) => ({
      id: String(row.id ?? ""),
      name: String(row.name ?? "Unknown"),
      age: typeof row.age === "number" ? row.age : 0,
      sector: String(row.sector ?? "—"),
      registeredAt: String(row.registeredAt ?? ""),
      skills: Array.isArray(row.skills)
        ? row.skills.map((s) => ({
            id: String(s.id ?? ""),
            name: String(s.name ?? ""),
            category: String(s.category ?? ""),
            survivorId: String(s.survivorId ?? row.id ?? ""),
          }))
        : [],
    }))
    .filter((s) => s.id.length > 0);
}

/** Map remote rows into BunkerContext survivor shape for shared dashboard use */
export function externalToSurvivor(row: ExternalSurvivor) {
  return {
    id: row.id,
    identity_code: row.id.slice(0, 10).toUpperCase(),
    full_name: row.name,
    duty: row.sector,
    clearance: "DELTA" as const,
    status: "active" as const,
    assigned_zone_id: null,
    registered_at: row.registeredAt,
    updated_at: row.registeredAt,
    age: row.age,
    sector: row.sector,
    skills: row.skills,
  };
}
