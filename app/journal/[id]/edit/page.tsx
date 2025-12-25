"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getEntry, updateEntry, type JournalEntry } from "@/lib/journal-store";
import { JournalEditor } from "@/components/journal/journal-editor";

export default function JournalEditPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const backHref = useMemo(() => `/journal/${id}`, [id]);

  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const found = getEntry(id);
    setEntry(found);
    setLoaded(true);

    // If entry doesn't exist, redirect after load
    if (!found) {
      router.push(backHref);
    }
  }, [id, backHref, router]);

  // Avoid redirecting on first render before we’ve loaded
  if (!loaded) return null;

  // If not found, effect will redirect
  if (!entry) return null;

  return (
    <JournalEditor
      backHref={backHref}
      headerTitle="Edit entry"
      entryId={id}
      initialTitle={entry.title ?? ""}
      initialContent={entry.content ?? ""}
      initialMood={entry.mood ?? null}
      onSave={async ({ title, content, mood }) => {
        updateEntry(id, { title, content, mood });
      }}
      onSaved={() => {
        router.push(backHref);
      }}
    />
  );
}
