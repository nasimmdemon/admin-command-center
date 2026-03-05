/** Brand-level desks: organizational units (Dept → Desk by country). Separate from VoIP. */
import type { DepartmentId } from "./voip-desk";

export interface BrandDesk {
  id: string;
  deskName: string;
  /** Country/region code (e.g. US, UK, FR) */
  countryCode: string;
  /** Departments that use this desk (e.g. RE, CO, IT). Desk can be shared; VoIP is optional per desk. */
  departmentIds: DepartmentId[];
  /** When false, this desk does not need a VoIP number (e.g. IT desk, or third dept sharing desk) */
  needsVoip?: boolean;
}

export function createBrandDesk(overrides?: Partial<BrandDesk>): BrandDesk {
  return {
    id: `brand-desk-${Date.now()}`,
    deskName: "",
    countryCode: "",
    departmentIds: [],
    needsVoip: true,
    ...overrides,
  };
}
