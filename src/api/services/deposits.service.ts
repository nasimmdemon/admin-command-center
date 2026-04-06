/**
 * Step 2 — Deposit API wrappers. Each deposit has `client_id`; Client document has no deposit_ids.
 */

import {
  DepositsEndpoints,
  depositByIdEndpoint,
} from "@/api/endpoints_reg";
import { adminRequest } from "@/api/http-client";
import type { AdminApiEnvelope, AdminDeposit } from "@/api/contract/domain-models";

export async function createDeposit(
  body: Pick<AdminDeposit, "client_id"> &
    Partial<Omit<AdminDeposit, "client_id">>
) {
  return adminRequest<AdminApiEnvelope<AdminDeposit>>(DepositsEndpoints.create, {
    jsonBody: body,
  });
}

export async function listDeposits(clientId?: string) {
  const search = clientId
    ? new URLSearchParams({ client_id: clientId })
    : undefined;
  return adminRequest<AdminApiEnvelope<AdminDeposit[]>>(DepositsEndpoints.list, {
    searchParams: search,
  });
}

export async function getDeposit(depositId: string) {
  return adminRequest<AdminApiEnvelope<AdminDeposit>>(
    depositByIdEndpoint(depositId, "GET")
  );
}

export async function updateDeposit(
  depositId: string,
  body: Partial<Omit<AdminDeposit, "_id" | "client_id">>
) {
  return adminRequest<AdminApiEnvelope<AdminDeposit>>(
    depositByIdEndpoint(depositId, "PATCH"),
    { jsonBody: body }
  );
}

export async function deleteDeposit(depositId: string) {
  return adminRequest<AdminApiEnvelope<unknown>>(
    depositByIdEndpoint(depositId, "DELETE")
  );
}
