"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSearchShortcut } from "@/hooks/use-search-shortcut";

/**
 * Renderless client component that installs the global `/` search shortcut.
 * Mount it once in the root layout so the shortcut is available on every
 * page for the lifetime of the session. The component renders nothing —
 * its only purpose is to own the hook's lifecycle.
 */
export function GlobalSearchShortcut(): null {
  const router = useRouter();
  // Wrap router.push so the hook receives a stable (url: string) => void
  // signature. The useCallback keeps the identity stable across renders,
  // which prevents the hook from reinstalling its window listener.
  const navigate = useCallback(
    (url: string) => {
      router.push(url);
    },
    [router]
  );
  useSearchShortcut({ navigate, searchUrl: "/search" });
  return null;
}
