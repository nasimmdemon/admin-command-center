import { describe, it, expect, vi, afterEach } from "vitest";
import * as clientsService from "@/api/services/clients.service";
import * as httpClient from "@/api/http-client";

describe("clients.service (Step 2–3)", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("createClient forwards JSON to POST /admin/clients", async () => {
    const spy = vi.spyOn(httpClient, "adminRequest").mockResolvedValue({
      ok: true,
      status: 201,
      data: {},
      rawText: "{}",
    });

    await clientsService.createClient({ name: "Acme" });

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ path: "/admin/clients", method: "POST" }),
      expect.objectContaining({ jsonBody: { name: "Acme" } })
    );
  });

  it("getClient uses GET with encoded id path", async () => {
    const spy = vi.spyOn(httpClient, "adminRequest").mockResolvedValue({
      ok: true,
      status: 200,
      data: null,
      rawText: "",
    });

    await clientsService.getClient("id/with/slash");

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        path: "/admin/clients/id%2Fwith%2Fslash",
        method: "GET",
      })
    );
  });
});
