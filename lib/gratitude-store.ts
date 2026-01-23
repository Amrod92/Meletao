// lib/gratitude-store.ts

export type GratitudeVisibility = "private" | "public";

export type Sentiment = "positive" | "neutral" | "heavy";

export type GratitudeNote = {
  id: string;
  text: string;
  visibility: GratitudeVisibility;
  sentiment: Sentiment;
  createdAt: number;
  updatedAt: number;
};

const STORAGE_KEY = "meletao_gratitude_notes_v1";

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function loadAll(): GratitudeNote[] {
  if (typeof window === "undefined") return [];
  const notes = safeParse<GratitudeNote[]>(
    window.localStorage.getItem(STORAGE_KEY),
    []
  );
  return notes.sort((a, b) => b.createdAt - a.createdAt);
}

function saveAll(notes: GratitudeNote[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

// Very lightweight heuristic (MVP). Replace with AI later.
function detectSentiment(text: string): Sentiment {
  const t = text.toLowerCase();

  const positive = [
    "grateful",
    "thank",
    "thanks",
    "love",
    "happy",
    "joy",
    "proud",
    "excited",
    "calm",
    "peace",
    "relaxed",
    "blessed",
    "beautiful",
  ];
  const heavy = [
    "sad",
    "anxious",
    "worried",
    "stress",
    "stressed",
    "angry",
    "upset",
    "tired",
    "lonely",
    "hurt",
    "depressed",
    "fear",
  ];

  const posHit = positive.some((w) => t.includes(w));
  const heavyHit = heavy.some((w) => t.includes(w));

  if (posHit && !heavyHit) return "positive";
  if (heavyHit && !posHit) return "heavy";
  return "neutral";
}

export function listGratitudeNotes(): GratitudeNote[] {
  return loadAll();
}

export function getGratitudeNote(id: string): GratitudeNote | null {
  return loadAll().find((n) => n.id === id) ?? null;
}

export function createGratitudeNote(input: {
  text: string;
  visibility: GratitudeVisibility;
}): GratitudeNote {
  const now = Date.now();
  const trimmed = input.text.trim();

  const note: GratitudeNote = {
    id: crypto.randomUUID(),
    text: trimmed,
    visibility: input.visibility,
    sentiment: detectSentiment(trimmed),
    createdAt: now,
    updatedAt: now,
  };

  const notes = loadAll();
  notes.unshift(note);
  saveAll(notes);
  return note;
}

export function deleteGratitudeNote(id: string) {
  const notes = loadAll().filter((n) => n.id !== id);
  saveAll(notes);
}

export function updateGratitudeNoteVisibility(
  id: string,
  visibility: GratitudeVisibility
): GratitudeNote | null {
  const notes = loadAll();
  const idx = notes.findIndex((n) => n.id === id);
  if (idx === -1) return null;

  const updated: GratitudeNote = {
    ...notes[idx],
    visibility,
    updatedAt: Date.now(),
  };

  notes[idx] = updated;
  saveAll(notes);
  return updated;
}
