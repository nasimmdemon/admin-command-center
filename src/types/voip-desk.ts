/** Departments: QA (all access), CO, RE, IT */
export const DEPARTMENTS = ["QA", "CO", "RE", "IT"] as const;
export type DepartmentId = (typeof DEPARTMENTS)[number];

/** Per-desk VoIP config: phone count + origin→destinations for that desk */
export interface VoipDeskConfig {
  id: string;
  deskName: string;
  departmentId: DepartmentId;
  /** Desk country code (e.g. FR, US) - optional, for display. RE & CO must share same region per brand. */
  countryCode?: string;
  /** Optional link to brand desk (when brand desks exist) */
  brandDeskId?: string;
  /** When false, this desk entry has no VoIP (org-only). Default true. */
  needsVoip?: boolean;
  /** Number of phones for this desk */
  phoneCount: number;
  /** When true: 1 number, all origins → all destinations (QA-style per desk). Prefer brand-level voipQaDefault for QA. */
  allOriginsAllDestinations?: boolean;
  /** Origin → destinations map. When allOriginsAllDestinations, this can be empty. */
  coverageMap: Record<string, string[]>;
}

/** Merge coverage maps from all desks into one (for "Sync from outbound" in Transform step). Skips desks with needsVoip=false. */
export function mergeDeskCoverageMaps(desks: VoipDeskConfig[]): Record<string, string[]> {
  const merged: Record<string, string[]> = {};
  for (const d of desks) {
    if (d.needsVoip === false) continue;
    for (const [origin, dests] of Object.entries(d.coverageMap)) {
      const existing = merged[origin] || [];
      merged[origin] = [...new Set([...existing, ...(dests || [])])];
    }
    if (d.allOriginsAllDestinations) {
      const all = new Set<string>(Object.keys(merged));
      for (const dests of Object.values(merged)) dests.forEach((x) => all.add(x));
      const arr = [...all];
      for (const o of arr) merged[o] = [...new Set([...(merged[o] || []), ...arr])];
    }
  }
  return merged;
}

/** Merge multiple coverage maps into one (union of all origin→destinations) */
export function mergeCoverageMaps(maps: Record<string, string[]>[]): Record<string, string[]> {
  const merged: Record<string, string[]> = {};
  for (const m of maps) {
    for (const [origin, dests] of Object.entries(m)) {
      const existing = merged[origin] || [];
      merged[origin] = [...new Set([...existing, ...(dests || [])])];
    }
  }
  return merged;
}

/** Merge coverage maps from worker configs (when voipMode=worker) */
export function mergeWorkerCoverageMaps(
  configs: Array<{ workerEmail: string; coverageMap: Record<string, string[]> }>
): Record<string, string[]> {
  const merged: Record<string, string[]> = {};
  for (const c of configs) {
    for (const [origin, dests] of Object.entries(c.coverageMap)) {
      const existing = merged[origin] || [];
      merged[origin] = [...new Set([...existing, ...(dests || [])])];
    }
  }
  return merged;
}

/** RE & CO must share same region per brand. Returns desks that violate (RE has X, CO has Y). */
export function getReCoRegionViolations(desks: VoipDeskConfig[]): { reDesk: string; coDesk: string; reCountry: string; coCountry: string }[] {
  const reDesks = desks.filter((d) => d.departmentId === "RE" && d.countryCode);
  const coDesks = desks.filter((d) => d.departmentId === "CO" && d.countryCode);
  const violations: { reDesk: string; coDesk: string; reCountry: string; coCountry: string }[] = [];
  for (const re of reDesks) {
    const reCountry = (re.countryCode ?? "").toUpperCase().trim();
    for (const co of coDesks) {
      const coCountry = (co.countryCode ?? "").toUpperCase().trim();
      if (reCountry && coCountry && reCountry !== coCountry) {
        violations.push({
          reDesk: re.deskName || re.id,
          coDesk: co.deskName || co.id,
          reCountry,
          coCountry,
        });
      }
    }
  }
  return violations;
}

/** Detect if two desks have conflicting origin→destination coverage (overlapping routes) */
export function getVoipDeskConflicts(desks: VoipDeskConfig[]): { deskA: string; deskB: string; origin: string; dest: string }[] {
  const conflicts: { deskA: string; deskB: string; origin: string; dest: string }[] = [];
  for (let i = 0; i < desks.length; i++) {
    for (let j = i + 1; j < desks.length; j++) {
      const a = desks[i];
      const b = desks[j];
      if (a.allOriginsAllDestinations || b.allOriginsAllDestinations) continue;
      for (const [origin, dests] of Object.entries(a.coverageMap)) {
        for (const dest of dests) {
          if ((b.coverageMap[origin] || []).includes(dest)) {
            conflicts.push({ deskA: a.deskName, deskB: b.deskName, origin, dest });
          }
        }
      }
    }
  }
  return conflicts;
}
