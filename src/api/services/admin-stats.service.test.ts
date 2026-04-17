import { describe, it, expect, vi, afterEach } from "vitest";
import * as adminStatsService from "@/api/services/admin-stats.service";
import * as httpClient from "@/api/http-client";

describe("admin-stats.service", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("fetchAdminStatsSummary calls GET /admin/stats/summary", async () => {
    const mockPayload = {
      client_count: 3,
      brand_count: 7,
      deposit_count: 12,
      deposit_amount_total: 9999.99,
    };

    const spy = vi.spyOn(httpClient, "adminRequest").mockResolvedValue({
      ok: true,
      status: 200,
      data: { data: mockPayload, message: "OK", status: 200 },
      rawText: JSON.stringify({ data: mockPayload }),
    });

    const result = await adminStatsService.fetchAdminStatsSummary();

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        path: "/admin/stats/summary",
        method: "GET",
      })
    );
    expect(result.ok).toBe(true);
    expect(result.status).toBe(200);
  });

  it("returns ok: false when backend reports error", async () => {
    vi.spyOn(httpClient, "adminRequest").mockResolvedValue({
      ok: false,
      status: 500,
      data: null,
      rawText: "Internal Server Error",
    });

    const result = await adminStatsService.fetchAdminStatsSummary();
    expect(result.ok).toBe(false);
    expect(result.status).toBe(500);
  });
});
