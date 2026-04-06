/**
 * Step 2 — Brand API wrappers. Every brand carries `client_id` (FK to client doc).
 */

import {
  BrandsEndpoints,
  brandByIdEndpoint,
} from "@/api/endpoints_reg";
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

export async function getBrand(brandId: string) {
  return adminRequest<AdminApiEnvelope<AdminBrand>>(
    brandByIdEndpoint(brandId, "GET")
  );
}

export async function updateBrand(
  brandId: string,
  body: Partial<Omit<AdminBrand, "_id">>
) {
  return adminRequest<AdminApiEnvelope<AdminBrand>>(
    brandByIdEndpoint(brandId, "PATCH"),
    { jsonBody: body }
  );
}

export async function deleteBrand(brandId: string) {
  return adminRequest<AdminApiEnvelope<unknown>>(
    brandByIdEndpoint(brandId, "DELETE")
  );
}
