// Unit tests for the build-time NEXT_PUBLIC_SITE_URL validator.
//
// These tests exercise a pure function — no process.env mutation, no
// filesystem access, no network. They cover the six failure modes the
// build gate must catch plus the acceptance path, and they pin the
// stability contract for the machine-readable `code` field.

import { describe, expect, it } from "vitest";
import { validateProductionSiteUrl } from "./validate-site-url";

describe("validateProductionSiteUrl", () => {
  describe("accepts valid production origins", () => {
    it("accepts a standard https origin", () => {
      const r = validateProductionSiteUrl("https://al-huda.app");
      expect(r.ok).toBe(true);
      expect(r.code).toBeNull();
    });

    it("accepts an https origin with subdomain", () => {
      const r = validateProductionSiteUrl("https://quran.example.com");
      expect(r.ok).toBe(true);
    });

    it("accepts an https origin with explicit port 443", () => {
      const r = validateProductionSiteUrl("https://al-huda.app:443");
      expect(r.ok).toBe(true);
    });

    it("accepts an https origin with a non-dev custom port", () => {
      const r = validateProductionSiteUrl("https://al-huda.app:8443");
      expect(r.ok).toBe(true);
    });
  });

  describe("rejects a missing value", () => {
    it("reports missing when undefined", () => {
      const r = validateProductionSiteUrl(undefined);
      expect(r.ok).toBe(false);
      expect(r.code).toBe("missing");
    });
  });

  describe("rejects empty values", () => {
    it("reports empty for empty string", () => {
      const r = validateProductionSiteUrl("");
      expect(r.ok).toBe(false);
      expect(r.code).toBe("empty");
    });

    it("reports empty for whitespace-only string", () => {
      const r = validateProductionSiteUrl("   ");
      expect(r.ok).toBe(false);
      expect(r.code).toBe("empty");
    });
  });

  describe("rejects malformed URLs", () => {
    it("reports parse-error for garbage input", () => {
      const r = validateProductionSiteUrl("not a url at all");
      expect(r.ok).toBe(false);
      expect(r.code).toBe("parse-error");
    });

    it("reports parse-error for bare hostname", () => {
      const r = validateProductionSiteUrl("al-huda.app");
      expect(r.ok).toBe(false);
      expect(r.code).toBe("parse-error");
    });
  });

  describe("rejects non-origin URLs", () => {
    it("reports not-absolute for URL with path", () => {
      const r = validateProductionSiteUrl("https://al-huda.app/quran");
      expect(r.ok).toBe(false);
      expect(r.code).toBe("not-absolute");
    });

    it("reports not-absolute for URL with query string", () => {
      const r = validateProductionSiteUrl("https://al-huda.app?v=1");
      expect(r.ok).toBe(false);
      expect(r.code).toBe("not-absolute");
    });

    it("reports not-absolute for URL with fragment", () => {
      const r = validateProductionSiteUrl("https://al-huda.app#home");
      expect(r.ok).toBe(false);
      expect(r.code).toBe("not-absolute");
    });
  });

  describe("rejects non-https schemes", () => {
    it("reports bad-scheme for http", () => {
      const r = validateProductionSiteUrl("http://al-huda.app");
      expect(r.ok).toBe(false);
      expect(r.code).toBe("bad-scheme");
    });

    it("reports bad-scheme for ftp", () => {
      const r = validateProductionSiteUrl("ftp://al-huda.app");
      expect(r.ok).toBe(false);
      expect(r.code).toBe("bad-scheme");
    });
  });

  describe("rejects localhost origins", () => {
    it("rejects localhost", () => {
      const r = validateProductionSiteUrl("https://localhost");
      expect(r.ok).toBe(false);
      expect(r.code).toBe("localhost");
    });

    it("rejects localhost with port", () => {
      const r = validateProductionSiteUrl("https://localhost:8443");
      expect(r.ok).toBe(false);
      expect(r.code).toBe("localhost");
    });

    it("rejects 127.0.0.1", () => {
      const r = validateProductionSiteUrl("https://127.0.0.1");
      expect(r.ok).toBe(false);
      expect(r.code).toBe("localhost");
    });

    it("rejects subdomain of .localhost", () => {
      const r = validateProductionSiteUrl("https://app.localhost");
      expect(r.ok).toBe(false);
      expect(r.code).toBe("localhost");
    });
  });

  describe("rejects development ports", () => {
    it("rejects port 3000", () => {
      const r = validateProductionSiteUrl("https://al-huda.app:3000");
      expect(r.ok).toBe(false);
      expect(r.code).toBe("default-dev-port");
    });

    it("rejects port 3001", () => {
      const r = validateProductionSiteUrl("https://al-huda.app:3001");
      expect(r.ok).toBe(false);
      expect(r.code).toBe("default-dev-port");
    });

    it("rejects port 3002", () => {
      const r = validateProductionSiteUrl("https://al-huda.app:3002");
      expect(r.ok).toBe(false);
      expect(r.code).toBe("default-dev-port");
    });
  });

  describe("message field is always populated", () => {
    const cases: Array<[string, string | undefined]> = [
      ["valid", "https://al-huda.app"],
      ["missing", undefined],
      ["empty", ""],
      ["parse-error", "garbage"],
      ["not-absolute", "https://al-huda.app/path"],
      ["bad-scheme", "http://al-huda.app"],
      ["localhost", "https://localhost"],
      ["dev-port", "https://al-huda.app:3000"],
    ];
    it.each(cases)("message present for %s", (_label, value) => {
      const r = validateProductionSiteUrl(value);
      expect(r.message.length).toBeGreaterThan(10);
    });
  });
});
