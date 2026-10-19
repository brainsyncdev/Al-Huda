import { defineConfig } from "vitest/config";

// Node environment only: these suites exercise pure data/logic modules
// (fs-backed Quran loader, Juz mapping, reference parsing, search).
//
// Tests import describe/it/expect EXPLICITLY from "vitest" rather than
// relying on injected globals, so tsconfig.json needs no `types` entry and
// `tsc --noEmit` continues to resolve them from the installed package.
//
// No path alias is configured: every test uses relative imports, so module
// resolution matches the app's own graph and `@/` misresolution is impossible.
export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
