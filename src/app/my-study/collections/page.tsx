"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, FolderHeart, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useLibrary } from "@/lib/library/context";

export default function MyStudyCollectionsPage() {
  const { collections, collectionAyat, createCollection, deleteCollection, hydrated } =
    useLibrary();
  const [newName, setNewName] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = newName.trim();
    if (!trimmed) return;
    createCollection(trimmed);
    setNewName("");
    toast.success("Collection created");
  }

  function handleDelete(id: string) {
    deleteCollection(id);
    setConfirmDelete(null);
    toast.success("Collection deleted");
  }

  function countFor(id: string) {
    return collectionAyat.filter((ca) => ca.collectionId === id).length;
  }

  return (
    <div className="space-y-6 pb-8">
      <header className="space-y-3">
        <Link
          href="/my-study"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-primary underline underline-offset-2 hover:decoration-gold"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
          Back to My Study
        </Link>
        <div className="space-y-1">
          <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Collections
          </h1>
          <p className="max-w-prose text-sm text-muted-foreground">
            Organize saved ayat into personal collections. Collections are
            private and stored only on this device.
          </p>
        </div>
      </header>

      {/* Create form */}
      <form
        onSubmit={handleCreate}
        className="flex flex-wrap items-center gap-2 rounded-2xl border border-border/80 bg-card p-4"
      >
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New collection name…"
          maxLength={80}
          className="min-w-0 flex-1 rounded-full border border-border/80 bg-background px-4 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
        <button
          type="submit"
          disabled={!newName.trim()}
          className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          <Plus className="h-4 w-4" aria-hidden />
          Create
        </button>
      </form>

      {!hydrated && (
        <div className="rounded-2xl border border-border/80 bg-card p-6 text-sm text-muted-foreground">
          Loading collections…
        </div>
      )}

      {hydrated && collections.length === 0 && (
        <div className="rounded-2xl border border-border/80 bg-card p-8 text-center">
          <FolderHeart className="mx-auto h-6 w-6 text-muted-foreground" aria-hidden />
          <p className="mt-2 text-sm text-muted-foreground">
            No collections yet. Create one above, then add ayat to it from the
            Quran reader.
          </p>
        </div>
      )}

      {hydrated && collections.length > 0 && (
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {collections.map((col) => (
            <li key={col.id}>
              <article className="flex h-full flex-col rounded-2xl border border-border/80 bg-card p-5">
                <div className="flex items-start justify-between gap-2">
                  <Link
                    href={`/my-study/collections/${encodeURIComponent(col.id)}`}
                    className="font-display text-lg font-semibold tracking-tight hover:text-primary"
                  >
                    {col.name}
                  </Link>
                  {confirmDelete === col.id ? (
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleDelete(col.id)}
                        className="rounded-full bg-destructive px-3 py-1 text-xs font-semibold text-destructive-foreground"
                      >
                        Confirm
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDelete(null)}
                        className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(col.id)}
                      className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                      aria-label={`Delete collection ${col.name}`}
                    >
                      <Trash2 className="h-4 w-4" aria-hidden />
                    </button>
                  )}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {countFor(col.id)} ayat · Created{" "}
                  {new Date(col.createdAt).toLocaleDateString()}
                </p>
                <div className="mt-auto pt-3">
                  <Link
                    href={`/my-study/collections/${encodeURIComponent(col.id)}`}
                    className="inline-flex rounded-full bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground"
                  >
                    Open collection
                  </Link>
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
