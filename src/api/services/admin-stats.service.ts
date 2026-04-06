import { adminRequest } from "@/api/http-client";
import { AdminStatsEndpoints } from "@/api/endpoints_reg";
import type { AdminApiEnvelope } from "@/api/contract/domain-models";

export type AdminStatsPayload = {
  client_count: number;
  brand_count: number;
  deposit_count: number;
  deposit_amount_total: number;
};

export async function fetchAdminStatsSummary() {
  return adminRequest<AdminApiEnvelope<AdminStatsPayload>>(
    AdminStatsEndpoints.summary
  );
}
