import { describe, it, expect, vi, afterEach } from "vitest";
import * as depositsService from "@/api/services/deposits.service";
import * as httpClient from "@/api/http-client";

describe("deposits.service — GET/POST only", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("createDeposit sends POST to /admin/deposits/create with client_id in body", async () => {
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
      expect.objectContaining({
        path: "/admin/deposits/create",
        method: "POST",
      }),
      {
        jsonBody: { client_id: "client-42", amount: 100, currency: "USD" },
      }
    );
  });

  it("listDeposits sends GET to /admin/deposits/list with optional client_id filter", async () => {
    const spy = vi.spyOn(httpClient, "adminRequest").mockResolvedValue({
      ok: true,
      status: 200,
      data: [],
      rawText: "[]",
    });

    await depositsService.listDeposits("client-42");

    const [endpointArg, optsArg] = spy.mock.calls[0] as [
      unknown,
      { searchParams?: URLSearchParams },
    ];
    expect((endpointArg as { path: string }).path).toBe("/admin/deposits/list");
    expect(optsArg.searchParams?.get("client_id")).toBe("client-42");
  });

  it("getDeposit sends GET to /admin/deposits/get/{id}", async () => {
    const spy = vi.spyOn(httpClient, "adminRequest").mockResolvedValue({
      ok: true,
      status: 200,
      data: null,
      rawText: "",
    });

    await depositsService.getDeposit("dep-7");

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        path: "/admin/deposits/get/dep-7",
        method: "GET",
      })
    );
  });

  it("updateDeposit sends POST to /admin/deposits/update with document_id in body", async () => {
    const spy = vi.spyOn(httpClient, "adminRequest").mockResolvedValue({
      ok: true,
      status: 200,
      data: {},
      rawText: "{}",
    });

    await depositsService.updateDeposit("dep-7", { amount: 999, currency: "EUR" });

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        path: "/admin/deposits/update",
        method: "POST",
      }),
      expect.objectContaining({
        jsonBody: { document_id: "dep-7", amount: 999, currency: "EUR" },
      })
    );
  });
});
