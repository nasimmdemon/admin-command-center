import { describe, it, expect, vi, afterEach } from "vitest";
import * as depositsService from "@/api/services/deposits.service";
import * as httpClient from "@/api/http-client";

describe("deposits.service (Step 2–3)", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("createDeposit requires client_id on body (FK, not reverse ids on client)", async () => {
    const spy = vi.spyOn(httpClient, "adminRequest").mockResolvedValue({
      ok: true,
      status: 201,
      data: {},
      rawText: "{}",
    });

    await depositsService.createDeposit({
      client_id: "client-42",
      amount: 100,
      currency: "USD",
    });

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ path: "/admin/deposits", method: "POST" }),
      {
        jsonBody: {
          client_id: "client-42",
          amount: 100,
          currency: "USD",
        },
      }
    );
  });

  it("listDeposits filters by client_id query param", async () => {
    const spy = vi.spyOn(httpClient, "adminRequest").mockResolvedValue({
      ok: true,
      status: 200,
      data: [],
      rawText: "[]",
    });

    await depositsService.listDeposits("client-42");

    const [, opts] = spy.mock.calls[0] as [
      unknown,
      { searchParams?: URLSearchParams },
    ];
    expect(opts.searchParams?.get("client_id")).toBe("client-42");
  });
});
