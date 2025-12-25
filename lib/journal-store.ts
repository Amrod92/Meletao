export type Mood = "Calm" | "Anxious" | "Grateful" | "Heavy";

export type JournalEntry = {
  id: string;
  title?: string;
  content: string;
  mood?: Mood | null;
  createdAt: number;
  updatedAt: number;
};

const STORAGE_KEY = "meletao_journal_entries_v1";

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function loadAll(): JournalEntry[] {
  if (typeof window === "undefined") return [];
  const entries = safeParse<JournalEntry[]>(
    window.localStorage.getItem(STORAGE_KEY),
    []
  );
  // newest first
  return entries.sort((a, b) => b.createdAt - a.createdAt);
}

function saveAll(entries: JournalEntry[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function listEntries(): JournalEntry[] {
  return loadAll();
}

export function getEntry(id: string): JournalEntry | null {
  return loadAll().find((e) => e.id === id) ?? null;
}

export function createEntry(input: {
  title?: string;
  content: string;
  mood?: Mood | null;
}): JournalEntry {
  const now = Date.now();
  const entry: JournalEntry = {
    id: crypto.randomUUID(),
    title: input.title?.trim() ? input.title.trim() : undefined,
    content: input.content,
    mood: input.mood ?? null,
    createdAt: now,
    updatedAt: now,
  };

  const entries = loadAll();
  entries.unshift(entry);
  saveAll(entries);
  return entry;
}

export function updateEntry(
  id: string,
  patch: Partial<Pick<JournalEntry, "title" | "content" | "mood">>
): JournalEntry | null {
  const entries = loadAll();
  const idx = entries.findIndex((e) => e.id === id);
  if (idx === -1) return null;

  const updated: JournalEntry = {
    ...entries[idx],
    ...patch,
    title:
      typeof patch.title === "string"
        ? patch.title.trim() || undefined
        : entries[idx].title,
    updatedAt: Date.now(),
  };

  entries[idx] = updated;
  saveAll(entries);
  return updated;
}

export function deleteEntry(id: string) {
  const entries = loadAll().filter((e) => e.id !== id);
  saveAll(entries);
}
