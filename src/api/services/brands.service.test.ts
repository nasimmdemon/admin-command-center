import { describe, it, expect, vi, afterEach } from "vitest";
import * as brandsService from "@/api/services/brands.service";
import * as httpClient from "@/api/http-client";

describe("brands.service — GET/POST only", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("createBrand sends POST to /admin/brands/create with client_id and name", async () => {
    const spy = vi.spyOn(httpClient, "adminRequest").mockResolvedValue({
      ok: true,
      status: 201,
      data: {},
      rawText: "{}",
    });

    await brandsService.createBrand({ client_id: "client-1", name: "Brand A" });

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ path: "/admin/brands/create", method: "POST" }),
      { jsonBody: { client_id: "client-1", name: "Brand A" } }
    );
  });

  it("listBrands sends GET to /admin/brands/list with optional client_id filter", async () => {
    const spy = vi.spyOn(httpClient, "adminRequest").mockResolvedValue({
      ok: true,
      status: 200,
      data: [],
      rawText: "[]",
    });

    await brandsService.listBrands("c-99");

    const [endpointArg, optsArg] = spy.mock.calls[0] as [
      unknown,
      { searchParams?: URLSearchParams },
    ];
    expect((endpointArg as { path: string }).path).toBe("/admin/brands/list");
    expect(optsArg.searchParams?.get("client_id")).toBe("c-99");
  });

  it("getBrand sends GET to /admin/brands/get/{id}", async () => {
    const spy = vi.spyOn(httpClient, "adminRequest").mockResolvedValue({
      ok: true,
      status: 200,
      data: null,
      rawText: "",
    });

    await brandsService.getBrand("brand-42");

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        path: "/admin/brands/get/brand-42",
        method: "GET",
      })
    );
  });

  it("updateBrand sends POST to /admin/brands/update with document_id in body", async () => {
    const spy = vi.spyOn(httpClient, "adminRequest").mockResolvedValue({
      ok: true,
      status: 200,
      data: {},
      rawText: "{}",
    });

    await brandsService.updateBrand("brand-42", { name: "Updated Brand" });

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ path: "/admin/brands/update", method: "POST" }),
      expect.objectContaining({
        jsonBody: { document_id: "brand-42", name: "Updated Brand" },
      })
    );
  });
});
