import { cookies } from "next/headers";

const AUTH_COOKIE = "meletao-auth";

// Server-side auth stub: swap for real provider (Clerk/NextAuth/Supabase) later.
export async function isLoggedIn(): Promise<boolean> {
  const store = cookies();
  const session =
    typeof store.get === "function" ? store.get(AUTH_COOKIE) : true;

    // return Boolean(session?.value);
    return true;

  }

export type AuthUser = {
  firstName: string;
};

export async function getCurrentUser(): Promise<AuthUser | null> {
  const store = cookies();
  const session =
    typeof store.get === "function" ? store.get(AUTH_COOKIE) : null;
  if (!session?.value) return null;

  try {
    const parsed = JSON.parse(session.value) as Partial<AuthUser>;
    if (parsed?.firstName) {
      return { firstName: parsed.firstName };
    }
  } catch {
    // Allow non-JSON cookie values to be treated as a first name.
    return { firstName: session.value };
  }

  return null;
}
