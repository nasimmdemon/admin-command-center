/**
 * Step 2 — Client (tenant) API wrappers. Backend routes must match {@link ClientsEndpoints}.
 */

import {
  ClientsEndpoints,
  clientByIdEndpoint,
} from "@/api/endpoints_reg";
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

export async function getClient(clientId: string) {
  return adminRequest<AdminApiEnvelope<AdminClient>>(
    clientByIdEndpoint(clientId, "GET")
  );
}

export async function updateClient(
  clientId: string,
  body: Partial<
    Pick<
      AdminClient,
      "name" | "external_id" | "client_code" | "monitor_status" | "paid_label"
    >
  >
) {
  return adminRequest<AdminApiEnvelope<AdminClient>>(
    clientByIdEndpoint(clientId, "PATCH"),
    { jsonBody: body }
  );
}

export async function deleteClient(clientId: string) {
  return adminRequest<AdminApiEnvelope<unknown>>(
    clientByIdEndpoint(clientId, "DELETE")
  );
}
