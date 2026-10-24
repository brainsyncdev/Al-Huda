// Unit tests for the global `/` search shortcut's pure helpers.
//
// These are the parts of src/hooks/use-search-shortcut.ts that can be
// tested in the project's existing Node environment (vitest `environment:
// "node"` per vitest.config.ts — jsdom is not installed in this project).
// The hook's `useEffect` wiring is covered by the Sprint 17 browser QA
// session on the live dev server; duplicating that here would require
// jsdom and React Testing Library, neither of which is a project
// dependency.
//
// The invariants pinned here are the guard rules that keep the shortcut
// from hijacking `/` while the user is typing, from firing under modifier
// keys, and from stealing focus from open modals.

import { describe, expect, it } from "vitest";
import {
  findVisibleSearchInput,
  isEditableTarget,
  isModalOpen,
  SEARCH_BOX_ATTR,
} from "./use-search-shortcut";

// jsdom-light stand-in: build an object that satisfies the HTMLElement-shaped
// surface our helpers actually touch (tagName, isContentEditable,
// getAttribute, offsetParent). This keeps the suite hermetic and fast.
function fakeEl(
  overrides: Partial<{
    tagName: string;
    isContentEditable: boolean;
    role: string | null;
    disabled: boolean;
    hidden: boolean;
    offsetParent: object | null;
    dataset: Record<string, string>;
  }>
): HTMLElement {
  const tagName = (overrides.tagName ?? "DIV").toUpperCase();
  const dataset = overrides.dataset ?? {};
  return {
    tagName,
    isContentEditable: overrides.isContentEditable ?? false,
    disabled: overrides.disabled ?? false,
    offsetParent: overrides.hidden ? null : (overrides.offsetParent ?? {}),
    dataset,
    hasAttribute: (name: string) =>
      name === `data-${Object.keys(dataset)[0]}` ||
      (name === "data-search-box" && SEARCH_BOX_ATTR in dataset) ||
      false,
    getAttribute: (name: string) => {
      if (name === "role") return overrides.role ?? null;
      if (name.startsWith("data-")) {
        const key = name.slice(5);
        return key in dataset ? dataset[key] : null;
      }
      return null;
    },
    getBoundingClientRect: () => ({
      width: overrides.hidden ? 0 : 100,
      height: overrides.hidden ? 0 : 30,
      top: 0,
      left: 0,
      right: 100,
      bottom: 30,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    }),
  } as unknown as HTMLElement;
}

describe("isEditableTarget", () => {
  it("returns false for null / non-element targets", () => {
    expect(isEditableTarget(null)).toBe(false);
    expect(isEditableTarget(undefined as unknown as EventTarget)).toBe(false);
    expect(isEditableTarget({} as EventTarget)).toBe(false);
  });

  it("returns true for INPUT, TEXTAREA, and SELECT elements", () => {
    expect(isEditableTarget(fakeEl({ tagName: "INPUT" }))).toBe(true);
    expect(isEditableTarget(fakeEl({ tagName: "TEXTAREA" }))).toBe(true);
    expect(isEditableTarget(fakeEl({ tagName: "SELECT" }))).toBe(true);
  });

  it("returns true for contentEditable elements", () => {
    expect(isEditableTarget(fakeEl({ isContentEditable: true }))).toBe(true);
  });

  it("returns true for combobox, textbox, searchbox, and spinbutton roles", () => {
    for (const role of [
      "combobox",
      "textbox",
      "searchbox",
      "spinbutton",
    ]) {
      expect(isEditableTarget(fakeEl({ role }))).toBe(true);
    }
  });

  it("returns false for plain divs, buttons, and anchors", () => {
    expect(isEditableTarget(fakeEl({ tagName: "DIV" }))).toBe(false);
    expect(isEditableTarget(fakeEl({ tagName: "BUTTON" }))).toBe(false);
    expect(isEditableTarget(fakeEl({ tagName: "A" }))).toBe(false);
    expect(isEditableTarget(fakeEl({ tagName: "SPAN" }))).toBe(false);
  });

  it("does not match roles that are not text-entry surfaces", () => {
    for (const role of ["button", "link", "menu", "listbox", "option"]) {
      expect(isEditableTarget(fakeEl({ role }))).toBe(false);
    }
  });
});

describe("findVisibleSearchInput", () => {
  // Minimal Document-like stand-in: only querySelectorAll is used.
  function docWith(elements: HTMLElement[]): Document {
    return {
      querySelectorAll: () => elements as unknown as NodeListOf<HTMLElement>,
    } as unknown as Document;
  }

  it("returns null when no [data-search-box] is present", () => {
    expect(findVisibleSearchInput(docWith([]))).toBeNull();
  });

  it("returns the first visible, enabled [data-search-box] input", () => {
    const disabled = fakeEl({
      tagName: "INPUT",
      disabled: true,
      dataset: { "search-box": "" },
    });
    const visible = fakeEl({
      tagName: "INPUT",
      dataset: { "search-box": "" },
    });
    const later = fakeEl({
      tagName: "INPUT",
      dataset: { "search-box": "" },
    });
    expect(findVisibleSearchInput(docWith([disabled, visible, later]))).toBe(
      visible
    );
  });

  it("skips hidden inputs (offsetParent === null) and falls through to the next", () => {
    const hidden = fakeEl({
      tagName: "INPUT",
      hidden: true,
      dataset: { "search-box": "" },
    });
    const shown = fakeEl({
      tagName: "INPUT",
      dataset: { "search-box": "" },
    });
    expect(findVisibleSearchInput(docWith([hidden, shown]))).toBe(shown);
  });

  it("returns null when all candidates are disabled", () => {
    const a = fakeEl({
      tagName: "INPUT",
      disabled: true,
      dataset: { "search-box": "" },
    });
    const b = fakeEl({
      tagName: "INPUT",
      disabled: true,
      dataset: { "search-box": "" },
    });
    expect(findVisibleSearchInput(docWith([a, b]))).toBeNull();
  });

  it("returns null when all candidates are hidden", () => {
    const a = fakeEl({
      tagName: "INPUT",
      hidden: true,
      dataset: { "search-box": "" },
    });
    expect(findVisibleSearchInput(docWith([a]))).toBeNull();
  });
});

describe("isModalOpen", () => {
  function docWithSelector(selector: string, present: boolean): Document {
    return {
      querySelector: (sel: string) =>
        sel === selector && present ? ({} as Element) : null,
    } as unknown as Document;
  }

  it("returns false when no overlay marker is in the DOM", () => {
    expect(
      isModalOpen({ querySelector: () => null } as unknown as Document)
    ).toBe(false);
  });

  it("returns true for each Radix overlay selector", () => {
    const selectors = [
      "[data-radix-dialog-content]",
      "[data-radix-alert-dialog-content]",
      "[data-radix-sheet-content]",
      "[data-radix-popover-content]",
      "[data-radix-dropdown-menu-content]",
    ];
    for (const sel of selectors) {
      expect(
        isModalOpen(docWithSelector(sel, true)),
        `expected true for ${sel}`
      ).toBe(true);
    }
  });

  it("returns true for role=dialog that is NOT aria-hidden", () => {
    expect(
      isModalOpen(
        docWithSelector("[role='dialog']:not([aria-hidden='true'])", true)
      )
    ).toBe(true);
  });

  it("returns false when role=dialog exists but is aria-hidden", () => {
    // The only selector that would match is the role=dialog one, but the
    // aria-hidden variant is excluded by the `:not([aria-hidden='true'])`
    // clause — our stand-in returns null for that selector.
    expect(
      isModalOpen(
        docWithSelector("[role='dialog']:not([aria-hidden='true'])", false)
      )
    ).toBe(false);
  });
});

describe("SEARCH_BOX_ATTR contract", () => {
  it("matches the marker attribute that SearchBox sets on its input", () => {
    // Sprint 17 added data-search-box="" to src/components/search/search-box.tsx.
    // If either side drifts, the global shortcut stops finding the input.
    expect(SEARCH_BOX_ATTR).toBe("data-search-box");
  });
});
