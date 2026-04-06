import { describe, it, expect, vi, afterEach } from "vitest";
import { adminRequest } from "@/api/http-client";
import type { AdminEndpointDef } from "@/api/endpoints_reg";

describe("adminRequest (Step 2)", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("joins base URL, method, and parses JSON body", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: async () => JSON.stringify({ data: { id: 1 }, status: 200 }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const ep: AdminEndpointDef = { path: "/admin/clients", method: "GET" };
    const res = await adminRequest<{ data: { id: number } }>(ep);

    expect(res.ok).toBe(true);
    expect(res.status).toBe(200);
    expect(res.data).toEqual({ data: { id: 1 }, status: 200 });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toContain("/admin/clients");
    expect(init.method).toBe("GET");
  });

  it("appends searchParams and sends jsonBody", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 201,
      text: async () => "{}",
    });
    vi.stubGlobal("fetch", fetchMock);

    const ep: AdminEndpointDef = { path: "/admin/brands", method: "POST" };
    await adminRequest(ep, {
      jsonBody: { client_id: "c1", name: "X" },
      searchParams: new URLSearchParams({ dry_run: "1" }),
    });

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toContain("dry_run=1");
    expect(init.body).toBe(JSON.stringify({ client_id: "c1", name: "X" }));
    const headers = init.headers as Headers;
    expect(headers.get("Content-Type")).toBe("application/json");
  });
});
