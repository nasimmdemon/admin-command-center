/**
 * Client (tenant) API service — GET and POST only.
 * All path strings come from {@link ClientsEndpoints} / {@link getClientByIdEndpoint}.
 */

import { ClientsEndpoints, getClientByIdEndpoint } from "@/api/endpoints_reg";
import { adminRequest } from "@/api/http-client";
import type { AdminApiEnvelope, AdminClient } from "@/api/contract/domain-models";

export async function createClient(
  body: Pick<AdminClient, "name"> & Partial<Omit<AdminClient, "name">>
) {
  return adminRequest<AdminApiEnvelope<AdminClient>>(ClientsEndpoints.create, {
    jsonBody: body,
  });
}

export async function listClients() {
  return adminRequest<AdminApiEnvelope<AdminClient[]>>(ClientsEndpoints.list);
}

export async function getClient(documentId: string) {
  return adminRequest<AdminApiEnvelope<AdminClient>>(
    getClientByIdEndpoint(documentId)
  );
}

/**
 * Updates a client document. `document_id` is sent inside the request body
 * so the backend can use a plain POST without needing PATCH.
 */
export async function updateClient(
  documentId: string,
  fields: Partial<
    Pick<
      AdminClient,
      "name" | "external_id" | "client_code" | "monitor_status" | "paid_label"
    >
  >
) {
  return adminRequest<AdminApiEnvelope<AdminClient>>(ClientsEndpoints.update, {
    jsonBody: { document_id: documentId, ...fields },
  });
}
