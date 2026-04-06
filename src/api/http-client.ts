/**
 * Step 2 — Resolve {@link AdminEndpointDef} + optional query/body against {@link getAdminApiBaseUrl}.
 */

import { getAdminApiBaseUrl } from "@/api/contract/env";
import type { AdminEndpointDef } from "@/api/endpoints_reg";

export type AdminRequestInit = Omit<RequestInit, "method" | "body"> & {
  /** Serialized as JSON; sets Content-Type when present */
  jsonBody?: unknown;
};

export type AdminHttpResult<T> = {
  ok: boolean;
  status: number;
  data: T | null;
  rawText: string;
};

function buildUrl(path: string, searchParams?: URLSearchParams): string {
  const base = getAdminApiBaseUrl();
  const q = searchParams?.toString();
  return q ? `${base}${path}?${q}` : `${base}${path}`;
}

/**
 * Performs one HTTP call. Does not throw on 4xx/5xx — inspect `ok` and `status`.
 */
export async function adminRequest<T = unknown>(
  endpoint: AdminEndpointDef,
  options?: AdminRequestInit & { searchParams?: URLSearchParams }
): Promise<AdminHttpResult<T>> {
  const { jsonBody, searchParams, headers: hdrs, ...rest } = options ?? {};
  const url = buildUrl(endpoint.path, searchParams);

  const headers = new Headers(hdrs);
  let body: BodyInit | undefined;
  if (jsonBody !== undefined) {
    headers.set("Content-Type", "application/json");
    body = JSON.stringify(jsonBody);
  }

  const res = await fetch(url, {
    ...rest,
    method: endpoint.method,
    headers,
    body,
  });

  const rawText = await res.text();
  let data: T | null = null;
  if (rawText) {
    try {
      data = JSON.parse(rawText) as T;
    } catch {
      data = null;
    }
  }

  return {
    ok: res.ok,
    status: res.status,
    data,
    rawText,
  };
}
