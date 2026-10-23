"use client";

// Semantic search runtime (FR-014).
//
// Loads the precomputed float16 embedding index and the same MiniLM model the
// generator used, embeds the user's query in the browser, and returns the top
// ayat ranked by cosine similarity. Nothing about the query leaves the device.
//
// The model is loaded from a CDN (jsdelivr) on first use and cached by the
// browser. The embedding index is fetched once from /embeddings/quran-minilm.bin
// (~4.8 MB) and held in memory.
//
// This module is imported lazily by the search page — the lexical search path
// does not pay the model-load cost.

import { useEffect, useState } from "react";

/** One search hit: reference + cosine similarity score. */
export interface SemanticHit {
  surah: number;
  ayah: number;
  score: number;
}

/** Index metadata loaded from /embeddings/quran-minilm.json. */
interface IndexMeta {
  model: string;
  dim: number;
  count: number;
  dtype: string;
  normalize: boolean;
  sha256: string;
  verses: [number, number][];
}

const INDEX_URL = "/embeddings/quran-minilm.json";
const BIN_URL = "/embeddings/quran-minilm.bin";
const MODEL_ID = "Xenova/all-MiniLM-L6-v2";
const CDN_TRANSFORMERS_URL =
  "https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2";

/** Shared state across all callers (one index per tab). */
let metaPromise: Promise<IndexMeta> | null = null;
let vectorsPromise: Promise<Float32Array> | null = null;
let pipelinePromise: Promise<any> | null = null;

/** float16 (Uint16Array) -> float32, standard IEEE 754 half decode. */
function decodeFloat16(src: Uint16Array): Float32Array {
  const out = new Float32Array(src.length);
  for (let i = 0; i < src.length; i++) {
    const half = src[i];
    const sign = (half >>> 15) & 1;
    let exp = (half >>> 10) & 0x1f;
    let mant = half & 0x3ff;
    let val: number;
    if (exp === 0) {
      val = mant === 0 ? 0 : Math.pow(2, -14) * (mant / 1024);
    } else if (exp === 0x1f) {
      val = mant === 0 ? Infinity : NaN;
    } else {
      val = Math.pow(2, exp - 15) * (1 + mant / 1024);
    }
    out[i] = sign ? -val : val;
  }
  return out;
}

function loadMeta(): Promise<IndexMeta> {
  if (!metaPromise) {
    metaPromise = fetch(INDEX_URL)
      .then((r) => {
        if (!r.ok) throw new Error(`index metadata HTTP ${r.status}`);
        return r.json() as Promise<IndexMeta>;
      })
      .then((m) => {
        if (!m || m.dtype !== "float16" || !Array.isArray(m.verses)) {
          throw new Error("unexpected index shape");
        }
        return m;
      });
  }
  return metaPromise;
}

function loadVectors(): Promise<Float32Array> {
  if (!vectorsPromise) {
    vectorsPromise = Promise.all([loadMeta(), fetch(BIN_URL)])
      .then(([m, r]) => {
        if (!r.ok) throw new Error(`embedding bin HTTP ${r.status}`);
        return r.arrayBuffer().then((buf) => {
          const expected = m.count * m.dim * 2; // float16 = 2 bytes
          if (buf.byteLength !== expected) {
            throw new Error(
              `embedding size mismatch: expected ${expected} bytes, got ${buf.byteLength}`
            );
          }
          return decodeFloat16(new Uint16Array(buf));
        });
      });
  }
  return vectorsPromise;
}

/**
 * Load the MiniLM pipeline from a CDN. Transformers.js is not a dependency of
 * the Next app — it is loaded as an ES module from jsdelivr at runtime, so the
 * build stays lean and the model downloads only when semantic search is used.
 */
function loadPipeline(): Promise<any> {
  if (!pipelinePromise) {
    pipelinePromise = (async () => {
      // A non-literal specifier keeps TypeScript from trying to resolve the
      // remote URL as a local module. webpackIgnore keeps webpack from
      // attempting to bundle it either.
      const cdnUrl = CDN_TRANSFORMERS_URL;
      const mod = (await import(/* webpackIgnore: true */ cdnUrl)) as {
        pipeline: (task: string, model: string, opts?: unknown) => Promise<any>;
        env: Record<string, unknown>;
      };
      mod.env.allowRemoteModels = true;
      mod.env.useBrowserCache = true;
      return mod.pipeline("feature-extraction", MODEL_ID, { quantized: true });
    })();
  }
  return pipelinePromise;
}

/** Cosine similarity between two unit-normalised vectors = dot product. */
function cosineSimilarity(a: Float32Array, b: Float32Array, dim: number): number {
  let dot = 0;
  for (let i = 0; i < dim; i++) dot += a[i] * b[i];
  return dot;
}

/**
 * Run semantic search. Returns the top `limit` ayat by cosine similarity to
 * the query. Throws if the index or model cannot be loaded — the caller
 * should fall back to lexical search in that case.
 */
export async function semanticSearch(
  query: string,
  limit = 20
): Promise<SemanticHit[]> {
  const [meta, vectors, extractor] = await Promise.all([
    loadMeta(),
    loadVectors(),
    loadPipeline(),
  ]);

  const output = await extractor(query, { pooling: "mean", normalize: true });
  const qVec: Float32Array = output.data;
  if (qVec.length !== meta.dim) {
    throw new Error(`query dim ${qVec.length} != index dim ${meta.dim}`);
  }

  const scored: SemanticHit[] = [];
  for (let i = 0; i < meta.count; i++) {
    const offset = i * meta.dim;
    const row = vectors.subarray(offset, offset + meta.dim);
    const score = cosineSimilarity(qVec, row, meta.dim);
    const [surah, ayah] = meta.verses[i];
    scored.push({ surah, ayah, score });
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit);
}

/** Whether the semantic index has been loaded (or is loading). */
export function isSemanticReady(): boolean {
  return Boolean(vectorsPromise);
}

/**
 * Preload the index in the background. Call from the search page mount so the
 * binary is warm by the time the user types a query.
 */
export function preloadSemanticIndex(): void {
  loadVectors().catch(() => {
    // swallow — the search page will report the failure
  });
}

/**
 * React hook: returns the semantic search status and a search function.
 * `status` is "idle" | "loading" | "ready" | "error".
 */
export function useSemanticSearch() {
  const [status, setStatus] = useState<
    "idle" | "loading" | "ready" | "error"
  >("idle");

  useEffect(() => {
    let active = true;
    setStatus("loading");
    loadVectors()
      .then(() => {
        if (active) setStatus("ready");
      })
      .catch(() => {
        if (active) setStatus("error");
      });
    return () => {
      active = false;
    };
  }, []);

  return {
    status,
    search: semanticSearch,
  };
}
