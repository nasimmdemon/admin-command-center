import { describe, it, expect } from "vitest";
import {
  AdminStatsEndpoints,
  BrandsEndpoints,
  ClientsEndpoints,
  DepositsEndpoints,
  getBrandByIdPath,
  getClientByIdPath,
  getDepositByIdPath,
  brandByIdEndpoint,
  clientByIdEndpoint,
  depositByIdEndpoint,
} from "@/api/endpoints_reg";

describe("endpoints_reg (Step 1)", () => {
  it("defines stats summary route", () => {
    expect(AdminStatsEndpoints.summary).toEqual({
      path: "/admin/stats/summary",
      method: "GET",
    });
  });

  it("defines static client routes", () => {
    expect(ClientsEndpoints.create).toEqual({
      path: "/admin/clients",
      method: "POST",
    });
    expect(ClientsEndpoints.list).toEqual({
      path: "/admin/clients",
      method: "GET",
    });
  });

  it("encodes dynamic client id paths", () => {
    expect(getClientByIdPath("abc/def")).toBe("/admin/clients/abc%2Fdef");
    expect(clientByIdEndpoint("x", "GET")).toEqual({
      path: "/admin/clients/x",
      method: "GET",
    });
  });

  it("defines brand and deposit static routes", () => {
    expect(BrandsEndpoints.create.method).toBe("POST");
    expect(BrandsEndpoints.list.path).toBe("/admin/brands");
    expect(DepositsEndpoints.list.method).toBe("GET");
  });

  it("builds brand and deposit by-id paths", () => {
    expect(getBrandByIdPath("b1")).toBe("/admin/brands/b1");
    expect(brandByIdEndpoint("b1", "DELETE").method).toBe("DELETE");
    expect(getDepositByIdPath("d9")).toBe("/admin/deposits/d9");
    expect(depositByIdEndpoint("d9", "PATCH").path).toBe("/admin/deposits/d9");
  });
});
