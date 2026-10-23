// Unit tests for merged tafsir search (FR-035).
//
// searchTafsir runs the same query against both readable tafsir editions and
// merges the hits in mushaf order. The invariants under test: every hit keeps
// the edition it came from, a failing edition does not hide the other one's
// results, and the result list is sorted by surah then ayah.

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

function tanzilBody(entries: Array<[number, number, string]>): string {
  return entries.map(([s, a, t]) => `${s}|${a}|${t}`).join("\n");
}

type MockResponse = { ok: boolean; text?: string; throw?: boolean };

function makeFetchMock(responses: Record<string, MockResponse>) {
  return vi.fn(async (url: string | URL | Request) => {
    const href =
      typeof url === "string" ? url : url instanceof URL ? url.href : url.url;
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

async function load(responses: Record<string, MockResponse>) {
  const fetchMock = makeFetchMock(responses);
  vi.stubGlobal("fetch", fetchMock);
  const mod = await import("./tafsir-search");
  return { mod, fetchMock };
}

describe("tafsir-search", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("merges hits from both editions in mushaf order, labeled by edition", async () => {
    const { mod } = await load({
      "ar.jalalayn": {
        ok: true,
        text: tanzilBody([
          [2, 255, "mercy in jalalayn"],
          [1, 1, "mercy in jalalayn first"],
        ]),
      },
      "ar.muyassar": {
        ok: true,
        text: tanzilBody([[1, 2, "mercy in muyassar"]]),
      },
    });

    const result = await mod.searchTafsir("mercy", 100);

    expect(result.hits).toHaveLength(3);
    expect(result.hits.map((h) => [h.surah, h.ayah])).toEqual([
      [1, 1],
      [1, 2],
      [2, 255],
    ]);
    expect(result.hits[0].editionId).toBe("ar.jalalayn");
    expect(result.hits[0].editionName).toBe("Tafsir al-Jalalayn");
    expect(result.hits[1].editionId).toBe("ar.muyassar");
    expect(result.hits[2].editionId).toBe("ar.jalalayn");
    expect(result.editionsSearched).toHaveLength(2);
    expect(result.editionsSearched.every((e) => !e.loadError)).toBe(true);
  });

  it("keeps the working edition's hits when the other edition fails to load", async () => {
    const { mod } = await load({
      "ar.jalalayn": { ok: false },
      "ar.muyassar": {
        ok: true,
        text: tanzilBody([[3, 7, "mercy survives"]]),
      },
    });

    const result = await mod.searchTafsir("mercy", 100);

    expect(result.hits).toHaveLength(1);
    expect(result.hits[0].editionId).toBe("ar.muyassar");
    expect(result.totalScanned).toBeGreaterThan(0);

    const jalalayn = result.editionsSearched.find((e) => e.id === "ar.jalalayn");
    const muyassar = result.editionsSearched.find((e) => e.id === "ar.muyassar");
    expect(jalalayn?.loadError).toBe(true);
    expect(muyassar?.loadError).toBe(false);
  });

  it("returns no hits but records both failures when both editions fail", async () => {
    const { mod } = await load({
      "ar.jalalayn": { ok: false },
      "ar.muyassar": { ok: true, throw: true },
    });

    const result = await mod.searchTafsir("mercy", 100);

    expect(result.hits).toEqual([]);
    expect(result.totalScanned).toBe(0);
    expect(result.editionsSearched).toHaveLength(2);
    expect(result.editionsSearched.every((e) => e.loadError)).toBe(true);
  });

  it("truncates the merged list to the requested limit", async () => {
    const entries: Array<[number, number, string]> = [];
    for (let a = 1; a <= 5; a++) entries.push([1, a, `mercy ${a}`]);

    const { mod } = await load({
      "ar.jalalayn": { ok: true, text: tanzilBody(entries) },
      "ar.muyassar": { ok: true, text: "" },
    });

    const result = await mod.searchTafsir("mercy", 2);

    expect(result.hits).toHaveLength(2);
    expect(result.hits.map((h) => h.ayah)).toEqual([1, 2]);
  });

  it("exposes exactly the two readable tafsir editions", async () => {
    const { mod } = await load({});
    expect([...mod.TAFSIR_EDITION_IDS]).toEqual(["ar.jalalayn", "ar.muyassar"]);
  });
});