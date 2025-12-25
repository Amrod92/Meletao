// lib/gratitude-store.ts
export type GratitudeVisibility = "private" | "public";

export type GratitudeEntry = {
  id: string;
  text: string;
  visibility: GratitudeVisibility; // keep for future; default private
  createdAt: number; // timestamp
};

const STORAGE_KEY = "meletao_gratitude_entries_v1";

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function loadAll(): GratitudeEntry[] {
  if (typeof window === "undefined") return [];
  const entries = safeParse<GratitudeEntry[]>(
    window.localStorage.getItem(STORAGE_KEY),
    []
  );
  return entries.sort((a, b) => b.createdAt - a.createdAt);
}

function saveAll(entries: GratitudeEntry[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function listGratitude(): GratitudeEntry[] {
  return loadAll();
}

export function createGratitude(input: {
  text: string;
  visibility?: GratitudeVisibility;
}): GratitudeEntry {
  const entry: GratitudeEntry = {
    id: crypto.randomUUID(),
    text: input.text.trim(),
    visibility: input.visibility ?? "private",
    createdAt: Date.now(),
  };
  const entries = loadAll();
  entries.unshift(entry);
  saveAll(entries);
  return entry;
}

function startOfTodayMs() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export function countGratitudeToday(): number {
  const start = startOfTodayMs();
  return loadAll().filter((e) => e.createdAt >= start).length;
}

export function hasGratitudeToday(): boolean {
  return countGratitudeToday() > 0;
}
