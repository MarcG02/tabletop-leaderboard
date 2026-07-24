const STORAGE_KEY = "tabletop-tally-auth";

export type StoredAuth = {
  token: string;
  player: { id: number; name: string };
};

export function getStoredAuth(): StoredAuth | null {
  try {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function getStoredToken(): string | null {
  return getStoredAuth()?.token ?? null;
}
