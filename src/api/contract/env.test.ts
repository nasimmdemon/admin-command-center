import { describe, it, expect } from "vitest";
import {
  normalizeAdminApiBaseUrl,
  DEFAULT_ADMIN_API_BASE_URL,
} from "@/api/contract/env";

describe("normalizeAdminApiBaseUrl (Step 0)", () => {
  it("strips trailing slashes", () => {
    expect(normalizeAdminApiBaseUrl("https://api.example.com/v1///")).toBe(
      "https://api.example.com/v1"
    );
  });

  it("uses fallback when raw is empty", () => {
    expect(normalizeAdminApiBaseUrl("")).toBe(DEFAULT_ADMIN_API_BASE_URL);
    expect(normalizeAdminApiBaseUrl(undefined)).toBe(DEFAULT_ADMIN_API_BASE_URL);
    expect(normalizeAdminApiBaseUrl("   ")).toBe(DEFAULT_ADMIN_API_BASE_URL);
  });

  it("respects custom fallback", () => {
    expect(normalizeAdminApiBaseUrl(null, "http://custom")).toBe("http://custom");
  });
});
