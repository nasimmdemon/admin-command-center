/**
 * Brand API service — GET and POST only.
 * All path strings come from {@link BrandsEndpoints} / {@link getBrandByIdEndpoint}.
 */

import { BrandsEndpoints, getBrandByIdEndpoint } from "@/api/endpoints_reg";
import { adminRequest } from "@/api/http-client";
import type { AdminApiEnvelope, AdminBrand } from "@/api/contract/domain-models";

export async function createBrand(
  body: Pick<AdminBrand, "client_id" | "name"> &
    Partial<Omit<AdminBrand, "client_id" | "name">>
) {
  return adminRequest<AdminApiEnvelope<AdminBrand>>(BrandsEndpoints.create, {
    jsonBody: body,
  });
}

export async function listBrands(clientId?: string) {
  const search = clientId
    ? new URLSearchParams({ client_id: clientId })
    : undefined;
  return adminRequest<AdminApiEnvelope<AdminBrand[]>>(BrandsEndpoints.list, {
    searchParams: search,
  });
}

export async function getBrand(documentId: string) {
  return adminRequest<AdminApiEnvelope<AdminBrand>>(
    getBrandByIdEndpoint(documentId)
  );
}

/**
 * Updates a brand document. `document_id` is sent inside the request body
 * so the backend can use a plain POST without needing PATCH.
 */
export async function updateBrand(
  documentId: string,
  fields: Partial<Omit<AdminBrand, "_id" | "client_id">>
) {
  return adminRequest<AdminApiEnvelope<AdminBrand>>(BrandsEndpoints.update, {
    jsonBody: { document_id: documentId, ...fields },
  });
}
