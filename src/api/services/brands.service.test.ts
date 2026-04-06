import { describe, it, expect, vi, afterEach } from "vitest";
import * as brandsService from "@/api/services/brands.service";
import * as httpClient from "@/api/http-client";

describe("brands.service (Step 2–3)", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("createBrand sends client_id and name", async () => {
    const spy = vi.spyOn(httpClient, "adminRequest").mockResolvedValue({
      ok: true,
      status: 201,
      data: {},
      rawText: "{}",
    });

    await brandsService.createBrand({
      client_id: "client-1",
      name: "Brand A",
    });

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ path: "/admin/brands", method: "POST" }),
      {
        jsonBody: { client_id: "client-1", name: "Brand A" },
      }
    );
  });

  it("listBrands passes client_id filter when provided", async () => {
    const spy = vi.spyOn(httpClient, "adminRequest").mockResolvedValue({
      ok: true,
      status: 200,
      data: [],
      rawText: "[]",
    });

    await brandsService.listBrands("c-99");

    const [, opts] = spy.mock.calls[0] as [
      unknown,
      { searchParams?: URLSearchParams },
    ];
    expect(opts.searchParams?.get("client_id")).toBe("c-99");
  });
});
