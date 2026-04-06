/**
 * Public exports for admin backend integration (Steps 0–2).
 * Tests live next to modules as `*.test.ts`.
 */

export * from "@/api/contract/domain-models";
export * from "@/api/contract/env";
export * from "@/api/endpoints_reg";
export * from "@/api/http-client";
export * as clientsService from "@/api/services/clients.service";
export * as brandsService from "@/api/services/brands.service";
export * as depositsService from "@/api/services/deposits.service";
export * as adminStatsService from "@/api/services/admin-stats.service";
export { loadMonitorSnapshot } from "@/api/load-monitor-snapshot";
export { mapBrandDoc, mapClientDoc } from "@/api/map-admin-to-monitor";
export {
  submitBrandWizardToServer,
  type SubmitWizardInput,
  type SubmitWizardResult,
} from "@/api/submit-brand-wizard";
