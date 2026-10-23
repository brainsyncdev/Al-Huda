// Unit tests for translation-edition search (FR-012).
//
// The module fetches Tanzil-format text on demand and caches it in memory.
// Tests stub global fetch and reset the module registry between cases so each
// test starts with an empty cache and a fresh inflight map.

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

function tanzilBody(entries: Array<[number, number, string]>): string {
  return entries.map(([s, a, t]) => `${s}|${a}|${t}`).join("\n");
}

function makeFetchMock(
  responses: Record<
    string,
    { ok: boolean; text?: string; throw?: boolean }
  >
) {
  return vi.fn(async (url: string | URL | Request) => {
    const href = typeof url === "string" ? url : url instanceof URL ? url.href : url.url;
    const id = href.split("/").pop() ?? "";
    const r = responses[id];
    if (!r) return { ok: false, status: 404, text: async () => "" };
    if (r.throw) throw new Error("network failure");
    return {
      ok: r.ok,
      status: r.ok ? 200 : 500,
      text: async () => r.text ?? "",
    };
  });
}

describe("translation-search", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  async function load(responses: Record<string, { ok: boolean; text?: string; throw?: boolean }>) {
    const fetchMock = makeFetchMock(responses);
    vi.stubGlobal("fetch", fetchMock);
    const mod = await import("./translation-search");
    return { mod, fetchMock };
  }

  it("returns null for an edition id not in the catalog", async () => {
    const { mod } = await load({});
    const result = await mod.searchTranslationEdition("does.not.exist", "mercy");
    expect(result).toBeNull();
  });

  it("returns loadError when the upstream fetch is not ok", async () => {
    const { mod } = await load({ "en.pickthall": { ok: false } });
    const result = await mod.searchTranslationEdition("en.pickthall", "mercy");
    expect(result).not.toBeNull();
    expect(result?.loadError).toBe(true);
    expect(result?.hits).toEqual([]);
    expect(result?.totalScanned).toBe(0);
  });

  it("returns loadError when the upstream fetch throws", async () => {
    const { mod } = await load({ "en.pickthall": { ok: true, throw: true } });
    const result = await mod.searchTranslationEdition("en.pickthall", "mercy");
    expect(result?.loadError).toBe(true);
  });

  it("returns empty hits for queries shorter than two characters", async () => {
    const { mod } = await load({
      "en.pickthall": { ok: true, text: "1|1|In the name of mercy" },
    });
    const result = await mod.searchTranslationEdition("en.pickthall", "m");
    expect(result?.hits).toEqual([]);
    expect(result?.loadError).toBe(false);
  });

  it("finds hits and builds snippets for a Latin edition", async () => {
    const body = tanzilBody([
      [1, 1, "In the name of God, the Merciful"],
      [1, 2, "Praise be to God"],
      [2, 255, "God, there is no deity but Him, the Merciful"],
    ]);
    const { mod } = await load({ "en.pickthall": { ok: true, text: body } });
    const result = await mod.searchTranslationEdition("en.pickthall", "Merciful", 10);
    expect(result?.loadError).toBe(false);
    expect(result?.hits).toHaveLength(2);
    expect(result?.hits[0].surah).toBe(1);
    expect(result?.hits[0].ayah).toBe(1);
    expect(result?.hits[0].text).toContain("Merciful");
    expect(result?.hits[0].snippet).not.toBeNull();
    expect(result?.hits[0].snippet?.text.toLowerCase()).toContain("merciful");
    expect(result?.hits[1].surah).toBe(2);
    expect(result?.hits[1].ayah).toBe(255);
  });

  it("respects the limit parameter", async () => {
    const body = tanzilBody([
      [1, 1, "mercy one"],
      [1, 2, "mercy two"],
      [1, 3, "mercy three"],
    ]);
    const { mod } = await load({ "en.pickthall": { ok: true, text: body } });
    const result = await mod.searchTranslationEdition("en.pickthall", "mercy", 2);
    expect(result?.hits).toHaveLength(2);
  });

  it("matches Arabic text with diacritics insensitively and returns verbatim text", async () => {
    // Text with full diacritics; query without. normalizeArabic strips
    // diacritics from both, so the match succeeds. The returned text must be
    // byte-identical to the source (PRD textual-integrity invariant).
    const textWithDiacritics = "\u0628\u0650\u0633\u0652\u0645\u0650 \u0627\u0644\u0644\u0651\u064e\u0647\u0650 \u0627\u0644\u0631\u0651\u064e\u062d\u0652\u0645\u064e\u0646\u0650 \u0627\u0644\u0631\u0651\u064e\u062d\u0650\u064a\u0645\u0650";
    const body = tanzilBody([[1, 1, textWithDiacritics]]);
    const { mod } = await load({ "ar.jalalayn": { ok: true, text: body } });
    // Query "الرحمن" (plain, no diacritics)
    const query = "\u0627\u0644\u0631\u062d\u0645\u0646";
    const result = await mod.searchTranslationEdition("ar.jalalayn", query, 10);
    expect(result?.hits).toHaveLength(1);
    expect(result?.hits[0].text).toBe(textWithDiacritics);
  });

  it("caches the edition across repeated calls (one upstream fetch)", async () => {
    const body = tanzilBody([[1, 1, "mercy"]]);
    const { mod, fetchMock } = await load({
      "en.pickthall": { ok: true, text: body },
    });
    await mod.searchTranslationEdition("en.pickthall", "mercy", 5);
    await mod.searchTranslationEdition("en.pickthall", "mercy", 5);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("deduplicates concurrent loads for the same edition", async () => {
    const body = tanzilBody([[1, 1, "mercy"]]);
    const { mod, fetchMock } = await load({
      "en.pickthall": { ok: true, text: body },
    });
    const [a, b] = await Promise.all([
      mod.searchTranslationEdition("en.pickthall", "mercy", 5),
      mod.searchTranslationEdition("en.pickthall", "mercy", 5),
    ]);
    expect(a?.hits).toHaveLength(b?.hits.length ?? 0);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
