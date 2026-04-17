/**
 * Deposit API service — GET and POST only.
 * All path strings come from {@link DepositsEndpoints} / {@link getDepositByIdEndpoint}.
 */

import { DepositsEndpoints, getDepositByIdEndpoint } from "@/api/endpoints_reg";
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

export async function getDeposit(documentId: string) {
  return adminRequest<AdminApiEnvelope<AdminDeposit>>(
    getDepositByIdEndpoint(documentId)
  );
}

/**
 * Updates a deposit document. `document_id` is sent inside the request body
 * so the backend can use a plain POST without needing PATCH.
 */
export async function updateDeposit(
  documentId: string,
  fields: Partial<Omit<AdminDeposit, "_id" | "client_id">>
) {
  return adminRequest<AdminApiEnvelope<AdminDeposit>>(DepositsEndpoints.update, {
    jsonBody: { document_id: documentId, ...fields },
  });
}
