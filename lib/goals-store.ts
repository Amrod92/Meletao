export type GoalType = "yearly" | "dated";

export type GoalMeasurementType = "numeric" | "checkbox";

export type Goal = {
  id: string;

  title: string;
  description?: string;

  type: GoalType;

  // yearly
  year?: number;

  // dated (or optional for yearly if you want)
  startDate?: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD

  // measurement (optional section)
  measurementEnabled: boolean;
  measurementType: GoalMeasurementType;

  metricName?: string; // e.g. "Sessions", "Pages", "£ saved"
  current?: number; // for numeric
  target?: number; // for numeric (required if measurementEnabled && numeric)

  checklistTotal?: number; // for checkbox
  checklistDone?: number; // for checkbox

  pinned: boolean;

  createdAt: number;
  updatedAt: number;
};

const STORAGE_KEY = "meletao_goals_v1";

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function loadAll(): Goal[] {
  if (typeof window === "undefined") return [];
  const goals = safeParse<Goal[]>(window.localStorage.getItem(STORAGE_KEY), []);
  return goals.sort((a, b) => b.createdAt - a.createdAt);
}

function saveAll(goals: Goal[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
}

export function listGoals(): Goal[] {
  return loadAll();
}

export function getGoal(id: string): Goal | null {
  return loadAll().find((g) => g.id === id) ?? null;
}

export function getPinnedGoal(): Goal | null {
  return loadAll().find((g) => g.pinned) ?? null;
}

export function createGoal(input: {
  title: string;
  description?: string;
  type: GoalType;
  year?: number;
  startDate?: string;
  endDate?: string;

  measurementEnabled?: boolean;
  measurementType?: GoalMeasurementType;

  metricName?: string;
  current?: number;
  target?: number;

  checklistTotal?: number;
  checklistDone?: number;

  pinned?: boolean;
}): Goal {
  const now = Date.now();

  const goal: Goal = {
    id: crypto.randomUUID(),
    title: input.title.trim(),
    description: input.description?.trim() || undefined,
    type: input.type,
    year: input.type === "yearly" ? input.year : undefined,
    startDate: input.startDate,
    endDate: input.endDate,

    measurementEnabled: Boolean(input.measurementEnabled),
    measurementType: input.measurementType ?? "numeric",
    metricName: input.metricName?.trim() || undefined,

    current: input.current ?? 0,
    target: input.target,

    checklistTotal: input.checklistTotal,
    checklistDone: input.checklistDone ?? 0,

    pinned: Boolean(input.pinned),

    createdAt: now,
    updatedAt: now,
  };

  const goals = loadAll();

  // If pinning new goal, unpin all others
  if (goal.pinned) {
    for (const g of goals) g.pinned = false;
  }

  goals.unshift(goal);
  saveAll(goals);
  return goal;
}

export function pinGoal(id: string): Goal | null {
  const goals = loadAll();
  const idx = goals.findIndex((g) => g.id === id);
  if (idx === -1) return null;

  for (const g of goals) g.pinned = false;
  goals[idx].pinned = true;
  goals[idx].updatedAt = Date.now();

  saveAll(goals);
  return goals[idx];
}

export function unpinAllGoals() {
  const goals = loadAll();
  let changed = false;
  for (const g of goals) {
    if (g.pinned) {
      g.pinned = false;
      g.updatedAt = Date.now();
      changed = true;
    }
  }
  if (changed) saveAll(goals);
}

export function updateGoalProgress(
  id: string,
  patch: Partial<
    Pick<Goal, "current" | "target" | "checklistDone" | "checklistTotal">
  >
): Goal | null {
  const goals = loadAll();
  const idx = goals.findIndex((g) => g.id === id);
  if (idx === -1) return null;

  const updated: Goal = {
    ...goals[idx],
    ...patch,
    updatedAt: Date.now(),
  };

  // clamp numeric
  if (updated.measurementEnabled && updated.measurementType === "numeric") {
    const cur = Math.max(0, Number(updated.current ?? 0));
    const tgt = Math.max(0, Number(updated.target ?? 0));
    updated.current = tgt > 0 ? Math.min(cur, tgt) : cur;
    updated.target = tgt;
  }

  // clamp checklist
  if (updated.measurementEnabled && updated.measurementType === "checkbox") {
    const total = Math.max(0, Number(updated.checklistTotal ?? 0));
    const done = Math.max(0, Number(updated.checklistDone ?? 0));
    updated.checklistTotal = total;
    updated.checklistDone = total > 0 ? Math.min(done, total) : done;
  }

  goals[idx] = updated;
  saveAll(goals);
  return updated;
}

export function deleteGoal(id: string) {
  const goals = loadAll().filter((g) => g.id !== id);
  saveAll(goals);
}

export function goalProgressPct(goal: Goal): number {
  if (!goal.measurementEnabled) return 0;

  if (goal.measurementType === "numeric") {
    const cur = Number(goal.current ?? 0);
    const tgt = Number(goal.target ?? 0);
    if (!tgt || tgt <= 0) return 0;
    return Math.max(0, Math.min(100, Math.round((cur / tgt) * 100)));
  }

  const done = Number(goal.checklistDone ?? 0);
  const total = Number(goal.checklistTotal ?? 0);
  if (!total || total <= 0) return 0;
  return Math.max(0, Math.min(100, Math.round((done / total) * 100)));
}
