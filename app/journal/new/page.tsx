// app/journal/new/page.tsx
"use client";

import { useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createEntry, type Mood } from "@/lib/journal-store";
import { JournalEditor } from "@/components/journal/journal-editor";

export default function JournalNewPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const promptFromUrl = searchParams.get("prompt");

  const promptText = useMemo(() => {
    if (!promptFromUrl) return null;
    if (promptFromUrl === "avoidance")
      return "What are you avoiding today — and what would happen if you didn’t?";
    return null;
  }, [promptFromUrl]);

  return (
    <JournalEditor
      backHref="/today"
      headerTitle="New entry"
      promptText={promptText}
      onSave={async ({ title, content, mood }) => {
        const created = createEntry({
          title,
          content,
          mood: (mood ?? null) as Mood | null,
        });
        router.push(`/journal/${created.id}`);
      }}
    />
  );
}
