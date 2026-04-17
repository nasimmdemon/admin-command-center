import { describe, it, expect, vi, afterEach } from "vitest";
import * as clientsService from "@/api/services/clients.service";
import * as httpClient from "@/api/http-client";

describe("clients.service — GET/POST only", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("createClient sends POST to /admin/clients/create", async () => {
    const spy = vi.spyOn(httpClient, "adminRequest").mockResolvedValue({
      ok: true,
      status: 201,
      data: {},
      rawText: "{}",
    });

    await clientsService.createClient({ name: "Acme" });

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ path: "/admin/clients/create", method: "POST" }),
      expect.objectContaining({ jsonBody: { name: "Acme" } })
    );
  });

  it("listClients sends GET to /admin/clients/list", async () => {
    const spy = vi.spyOn(httpClient, "adminRequest").mockResolvedValue({
      ok: true,
      status: 200,
      data: [],
      rawText: "[]",
    });

    await clientsService.listClients();

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ path: "/admin/clients/list", method: "GET" })
    );
  });

  it("getClient sends GET to /admin/clients/get/{id} with encoding", async () => {
    const spy = vi.spyOn(httpClient, "adminRequest").mockResolvedValue({
      ok: true,
      status: 200,
      data: null,
      rawText: "",
    });

    await clientsService.getClient("id/with/slash");

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        path: "/admin/clients/get/id%2Fwith%2Fslash",
        method: "GET",
      })
    );
  });

  it("updateClient sends POST to /admin/clients/update with document_id in body", async () => {
    const spy = vi.spyOn(httpClient, "adminRequest").mockResolvedValue({
      ok: true,
      status: 200,
      data: {},
      rawText: "{}",
    });

    await clientsService.updateClient("client-1", { name: "New Name" });

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ path: "/admin/clients/update", method: "POST" }),
      expect.objectContaining({
        jsonBody: { document_id: "client-1", name: "New Name" },
      })
    );
  });
});
