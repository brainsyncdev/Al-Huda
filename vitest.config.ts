import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Node environment only: these suites exercise pure data/logic modules
// (fs-backed Quran loader, Juz mapping, reference parsing, search).
//
// Tests import describe/it/expect EXPLICITLY from "vitest" rather than
// relying on injected globals, so tsconfig.json needs no `types` entry and
// `tsc --noEmit` continues to resolve them from the installed package.
//
// The `@/` alias mirrors tsconfig.json's `paths` entry. Tests may keep using
// relative imports; the alias exists because app modules under test (such as
// the knowledge graph) import through `@/` themselves, and vitest has to
// resolve those same specifiers.
export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
