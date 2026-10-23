import { describe, it, expect } from "vitest";
import {
  getComprehensionNote,
  hasComprehensionNote,
  COMPREHENSION_NOTES,
} from "./notes";

describe("comprehension notes", () => {
  it("has at least one note", () => {
    expect(COMPREHENSION_NOTES.length).toBeGreaterThan(0);
  });

  it("retrieves a note by reference", () => {
    const note = getComprehensionNote(1, 1);
    expect(note).not.toBeNull();
    expect(note?.ref.surah).toBe(1);
    expect(note?.ref.ayah).toBe(1);
    expect(note?.context).toBeDefined();
    expect(note?.provenance).toBeDefined();
  });

  it("returns null for ayat without notes", () => {
    const note = getComprehensionNote(999, 999);
    expect(note).toBeNull();
  });

  it("hasComprehensionNote returns true for ayat with notes", () => {
    expect(hasComprehensionNote(1, 1)).toBe(true);
    expect(hasComprehensionNote(2, 255)).toBe(true);
  });

  it("hasComprehensionNote returns false for ayat without notes", () => {
    expect(hasComprehensionNote(999, 999)).toBe(false);
  });

  it("all notes have provenance metadata", () => {
    for (const note of COMPREHENSION_NOTES) {
      expect(note.provenance.method).toBeDefined();
      expect(note.provenance.curator).toBeDefined();
      expect(note.provenance.reviewedAt).toBeDefined();
      expect(note.provenance.status).toBeDefined();
    }
  });

  it("all notes have non-empty context", () => {
    for (const note of COMPREHENSION_NOTES) {
      expect(note.context.length).toBeGreaterThan(0);
    }
  });
});
