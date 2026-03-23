/** Brand-level desks: organizational units (Dept → Desk by country). Separate from VoIP. */
import type { DepartmentId } from "./voip-desk";
import { isValidISOCountryCode, normalizeCountryInputToISO } from "@/utils/countryCodes";

export interface BrandDesk {
  id: string;
  /** Desk label — also the country/region code (e.g. US, FR). */
  deskName: string;
  /** Kept in sync with desk name for VoIP/RE–CO rules; do not edit separately in UI. */
  countryCode: string;
  /** Departments that use this desk (e.g. RE, CO, IT). Desk can be shared; VoIP is optional per desk. */
  departmentIds: DepartmentId[];
  /** When false, this desk does not need a VoIP number (e.g. IT desk, or third dept sharing desk) */
  needsVoip?: boolean;
}

/** Derive ISO-style country code from desk name (desk name = country). */
export function countryCodeFromDeskName(deskName: string): string {
  const t = deskName.trim();
  if (!t) return "";
  const iso = normalizeCountryInputToISO(t);
  if (iso && isValidISOCountryCode(iso)) return iso;
  const up = t.toUpperCase().replace(/[^A-Z0-9]/g, "");
  return up.slice(0, 3) || up;
}

export function createBrandDesk(overrides?: Partial<BrandDesk>): BrandDesk {
  const base: BrandDesk = {
    id: `brand-desk-${Date.now()}`,
    deskName: "",
    countryCode: "",
    departmentIds: [],
    needsVoip: true,
  };
  const merged = { ...base, ...overrides };
  return {
    ...merged,
    countryCode: countryCodeFromDeskName(merged.deskName),
  };
}

/** CO & RE must share desks. Returns desks that have CO without RE or RE without CO. */
export function getCoReDeskViolations(desks: BrandDesk[]): BrandDesk[] {
  return desks.filter((d) => {
    const hasCo = d.departmentIds.includes("CO");
    const hasRe = d.departmentIds.includes("RE");
    return (hasCo && !hasRe) || (!hasCo && hasRe);
  });
}
