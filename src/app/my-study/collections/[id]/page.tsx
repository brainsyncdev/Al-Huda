"use client";

import { use, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Clock, Hash, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useLibrary } from "@/lib/library/context";
import { cn } from "@/lib/utils";

interface Props {
  params: Promise<{ id: string }>;
}

type SortMode = "added" | "quran";

export default function CollectionDetailPage({ params }: Props) {
  const { id: rawId } = use(params);
  const collectionId = decodeURIComponent(rawId);
  const { collections, getCollectionAyat, removeFromCollection, renameCollection, hydrated } =
    useLibrary();
  const [sort, setSort] = useState<SortMode>("added");
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState("");

  const collection = collections.find((c) => c.id === collectionId);
  const ayat = getCollectionAyat(collectionId);

  const sorted = useMemo(() => {
    const list = [...ayat];
    if (sort === "added") {
      list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    } else {
      list.sort((a, b) => a.surah - b.surah || a.ayah - b.ayah);
    }
    return list;
  }, [ayat, sort]);

  function handleRemove(surah: number, ayah: number) {
    removeFromCollection(collectionId, surah, ayah);
    toast.success("Removed from collection");
  }

  function handleRename(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = newName.trim();
    if (!trimmed) return;
    renameCollection(collectionId, trimmed);
    setEditing(false);
    setNewName("");
    toast.success("Collection renamed");
  }

  if (!hydrated) {
    return (
      <div className="rounded-2xl border border-border/80 bg-card p-6 text-sm text-muted-foreground">
        Loading collection…
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="space-y-4">
        <Link
          href="/my-study/collections"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-primary underline underline-offset-2"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
          Back to Collections
        </Link>
        <div className="rounded-2xl border border-border/80 bg-card p-8 text-center">
          <p className="text-sm text-muted-foreground">
            This collection no longer exists.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      <header className="space-y-3">
        <Link
          href="/my-study/collections"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-primary underline underline-offset-2 hover:decoration-gold"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
          Back to Collections
        </Link>
        <div className="space-y-1">
          {editing ? (
            <form onSubmit={handleRename} className="flex items-center gap-2">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder={collection.name}
                maxLength={80}
                className="flex-1 rounded-full border border-border/80 bg-background px-4 py-2 text-lg font-semibold focus:border-primary focus:outline-none"
                autoFocus
              />
              <button
                type="submit"
                className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditing(false);
                  setNewName("");
                }}
                className="rounded-full bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground"
              >
                Cancel
              </button>
            </form>
          ) : (
            <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              {collection.name}
            </h1>
          )}
          <p className="text-sm text-muted-foreground">
            {ayat.length} ayat · Created {new Date(collection.createdAt).toLocaleDateString()}
            {!editing && (
              <button
                type="button"
                onClick={() => {
                  setEditing(true);
                  setNewName(collection.name);
                }}
                className="ml-3 text-xs font-medium text-primary underline underline-offset-2"
              >
                Rename
              </button>
            )}
          </p>
        </div>
      </header>

      {ayat.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setSort("added")}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors",
              sort === "added"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-accent"
            )}
          >
            <Clock className="h-3.5 w-3.5" aria-hidden />
            Date added
          </button>
          <button
            type="button"
            onClick={() => setSort("quran")}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors",
              sort === "quran"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-accent"
            )}
          >
            <Hash className="h-3.5 w-3.5" aria-hidden />
            Quran order
          </button>
        </div>
      )}

      {ayat.length === 0 ? (
        <div className="rounded-2xl border border-border/80 bg-card p-8 text-center">
          <p className="text-sm text-muted-foreground">
            This collection is empty. Open any ayah and add it to this collection.
          </p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {sorted.map((ca) => (
            <li key={ca.id}>
              <article className="rounded-2xl border border-border/80 bg-card p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Link
                      href={`/ayah/${ca.surah}/${ca.ayah}`}
                      className="text-sm font-semibold underline underline-offset-2 hover:decoration-gold"
                    >
                      Surah {ca.surah}:{ca.ayah}
                    </Link>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Added {new Date(ca.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemove(ca.surah, ca.ayah)}
                    className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                    aria-label={`Remove ${ca.surah}:${ca.ayah} from collection`}
                  >
                    <Trash2 className="h-4 w-4" aria-hidden />
                  </button>
                </div>
                <div className="mt-3">
                  <Link
                    href={`/ayah/${ca.surah}/${ca.ayah}`}
                    className="rounded-full bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground"
                  >
                    Open ayah
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
