import { describe, it, expect } from "vitest";
import {
  AdminStatsEndpoints,
  BrandsEndpoints,
  ClientsEndpoints,
  DepositsEndpoints,
  getBrandByIdEndpoint,
  getClientByIdEndpoint,
  getDepositByIdEndpoint,
} from "@/api/endpoints_reg";

describe("endpoints_reg — GET/POST only", () => {
  // ── Stats ──────────────────────────────────────────────────────────────────

  it("stats summary is a GET", () => {
    expect(AdminStatsEndpoints.summary).toEqual({
      path: "/admin/stats/summary",
      method: "GET",
    });
  });

  // ── Clients ────────────────────────────────────────────────────────────────

  it("clients create is POST /admin/clients/create", () => {
    expect(ClientsEndpoints.create).toEqual({
      path: "/admin/clients/create",
      method: "POST",
    });
  });

  it("clients list is GET /admin/clients/list", () => {
    expect(ClientsEndpoints.list).toEqual({
      path: "/admin/clients/list",
      method: "GET",
    });
  });

  it("clients update is POST /admin/clients/update", () => {
    expect(ClientsEndpoints.update).toEqual({
      path: "/admin/clients/update",
      method: "POST",
    });
  });

  it("getClientByIdEndpoint encodes special chars", () => {
    expect(getClientByIdEndpoint("id/slash")).toEqual({
      path: "/admin/clients/get/id%2Fslash",
      method: "GET",
    });
  });

  // ── Brands ─────────────────────────────────────────────────────────────────

  it("brands create is POST /admin/brands/create", () => {
    expect(BrandsEndpoints.create).toEqual({
      path: "/admin/brands/create",
      method: "POST",
    });
  });

  it("brands list is GET /admin/brands/list", () => {
    expect(BrandsEndpoints.list).toEqual({
      path: "/admin/brands/list",
      method: "GET",
    });
  });

  it("brands update is POST /admin/brands/update", () => {
    expect(BrandsEndpoints.update).toEqual({
      path: "/admin/brands/update",
      method: "POST",
    });
  });

  it("getBrandByIdEndpoint builds correct path", () => {
    expect(getBrandByIdEndpoint("b1")).toEqual({
      path: "/admin/brands/get/b1",
      method: "GET",
    });
  });

  // ── Deposits ───────────────────────────────────────────────────────────────

  it("deposits create is POST /admin/deposits/create", () => {
    expect(DepositsEndpoints.create).toEqual({
      path: "/admin/deposits/create",
      method: "POST",
    });
  });

  it("deposits list is GET /admin/deposits/list", () => {
    expect(DepositsEndpoints.list).toEqual({
      path: "/admin/deposits/list",
      method: "GET",
    });
  });

  it("deposits update is POST /admin/deposits/update", () => {
    expect(DepositsEndpoints.update).toEqual({
      path: "/admin/deposits/update",
      method: "POST",
    });
  });

  it("getDepositByIdEndpoint builds correct path", () => {
    expect(getDepositByIdEndpoint("d9")).toEqual({
      path: "/admin/deposits/get/d9",
      method: "GET",
    });
  });
});
