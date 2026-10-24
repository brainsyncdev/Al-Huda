"use client";

import { useCallback, useEffect, useRef } from "react";

/**
 * Returns true when the given event target is something the user is actively
 * typing into. The global `/` shortcut must not fire while the user is
 * composing text in any of these contexts.
 */
export function isEditableTarget(target: EventTarget | null): boolean {
  if (!target) return false;
  // Duck-type check rather than `instanceof HTMLElement` so the helper is
  // testable in Node (jsdom is not installed in this project) and still
  // works correctly in the browser.
  const el = target as {
    tagName?: string;
    isContentEditable?: boolean;
    getAttribute?: (name: string) => string | null;
  };
  if (typeof el.tagName !== "string") return false;
  const tag = el.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  if (el.isContentEditable) return true;
  const role = typeof el.getAttribute === "function" ? el.getAttribute("role") : null;
  if (
    role === "combobox" ||
    role === "textbox" ||
    role === "searchbox" ||
    role === "spinbutton"
  ) {
    return true;
  }
  return false;
}

/**
 * Finds the first enabled, visible element marked with `data-search-box` in
 * the given root. Returns null when no such element exists or all candidates
 * are disabled/hidden.
 */
export function findVisibleSearchInput(
  root: Document | Element = document
): HTMLInputElement | null {
  const candidates = root.querySelectorAll<HTMLInputElement>(
    "[data-search-box]"
  );
  for (const el of candidates) {
    if (el.disabled) continue;
    // offsetParent is null for hidden elements (except for position:fixed,
    // which the search input never uses). A null offsetParent reliably
    // means the element is not visible to the user.
    if (el.offsetParent === null) continue;
    return el;
  }
  return null;
}

/**
 * Returns true when any Radix overlay or dialog-like element is currently
 * open. The shortcut must not steal focus from an active modal.
 */
export function isModalOpen(root: Document = document): boolean {
  const selectors = [
    "[data-radix-dialog-content]",
    "[data-radix-alert-dialog-content]",
    "[data-radix-sheet-content]",
    "[data-radix-popover-content]",
    "[data-radix-dropdown-menu-content]",
    "[role='dialog']:not([aria-hidden='true'])",
  ];
  for (const sel of selectors) {
    if (root.querySelector(sel)) return true;
  }
  return false;
}

export interface UseSearchShortcutOptions {
  /** Callback invoked when no search input is available to focus. */
  navigate: (url: string) => void;
  /** URL to navigate to when no search input is on the page. Default "/search". */
  searchUrl?: string;
}

/** Marker attribute added by SearchBox so the global shortcut can find it. */
export const SEARCH_BOX_ATTR = "data-search-box";

/**
 * Installs a single global `keydown` listener that focuses the search input
 * on a bare `/` press. When no search input is on the page, the caller's
 * `navigate` callback runs (typically Next.js `router.push`).
 *
 * Guard rules, in evaluation order:
 *   1. Key is exactly `/` with no Meta / Ctrl / Alt modifier.
 *   2. Event target is not an editable element.
 *   3. No Radix overlay or dialog-like element is currently open.
 *
 * `preventDefault()` is called before focus/navigation so a literal `/` is
 * never inserted into the focused field.
 */
export function useSearchShortcut({
  navigate,
  searchUrl = "/search",
}: UseSearchShortcutOptions): void {
  // Keep a stable reference to the latest callback so the listener does not
  // need to be reinstalled whenever the caller's closure identity changes.
  const navRef = useRef(navigate);
  const urlRef = useRef(searchUrl);
  useEffect(() => {
    navRef.current = navigate;
    urlRef.current = searchUrl;
  }, [navigate, searchUrl]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key !== "/") return;
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    if (event.defaultPrevented) return;
    if (isEditableTarget(event.target)) return;
    if (isModalOpen(document)) return;

    event.preventDefault();

    const input = findVisibleSearchInput(document);
    if (input) {
      input.focus();
      // Select any existing text so a user who already had a query in the
      // box can start fresh immediately, matching browser-omnibox behavior.
      if (typeof input.select === "function") {
        try {
          input.select();
        } catch {
          // Some input types don't support select(); focusing is enough.
        }
      }
      return;
    }

    navRef.current(urlRef.current);
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
}
