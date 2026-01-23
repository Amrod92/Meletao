export async function isLoggedIn(): Promise<boolean> {
  return false;
}

export type AuthUser = {
  id: string;
  name?: string | null;
};

export async function getCurrentUser(): Promise<AuthUser | null> {
  return null;
}
