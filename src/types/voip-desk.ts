/** Departments: QA (all access), CO, RE, IT */
export const DEPARTMENTS = ["QA", "CO", "RE", "IT"] as const;
export type DepartmentId = (typeof DEPARTMENTS)[number];

/** Per-desk VoIP config: phone count + origin→destinations for that desk */
export interface VoipDeskConfig {
  id: string;
  deskName: string;
  departmentId: DepartmentId;
  /** Desk country code (e.g. FR, US) - optional, for display */
  countryCode?: string;
  /** Number of phones for this desk */
  phoneCount: number;
  /** When true: 1 number, all origins → all destinations (QA default) */
  allOriginsAllDestinations?: boolean;
  /** Origin → destinations map. When allOriginsAllDestinations, this can be empty. */
  coverageMap: Record<string, string[]>;
}

/** Merge coverage maps from all desks into one (for "Sync from outbound" in Transform step) */
export function mergeDeskCoverageMaps(desks: VoipDeskConfig[]): Record<string, string[]> {
  const merged: Record<string, string[]> = {};
  for (const d of desks) {
    for (const [origin, dests] of Object.entries(d.coverageMap)) {
      const existing = merged[origin] || [];
      merged[origin] = [...new Set([...existing, ...(dests || [])])];
    }
  }
  return merged;
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
