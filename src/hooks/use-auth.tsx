"use client";

import {
  createContext,
  useContext,
  useCallback,
  useSyncExternalStore,
  type ReactNode,
} from "react";

const STORAGE_KEY = "tabletop-tally-auth";

type User = {
  username: string;
};

type AuthContextValue = {
  user: User | null;
  isAuthenticated: boolean;
  login: (
    username: string,
    password: string,
  ) => { success: boolean; error?: string };
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const VALID_USERNAME = process.env.NEXT_PUBLIC_VALID_USERNAME || "";
const VALID_PASSWORD = process.env.NEXT_PUBLIC_VALID_PASSWORD || "";

// ── External store (localStorage) ──────────────────────────

function getSnapshot(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function getServerSnapshot(): string | null {
  return null; // always null during SSR
}

function subscribe(callback: () => void): () => void {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function parseUser(raw: string | null): User | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (parsed?.username) return { username: parsed.username };
  } catch {
    // Corrupt data — ignore
  }
  return null;
}

// ── Provider ───────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const user = parseUser(raw);
  const isAuthenticated = user !== null;

  const login = useCallback(
    (
      username: string,
      password: string,
    ): { success: boolean; error?: string } => {
      if (!username.trim() || !password.trim()) {
        return { success: false, error: "Both fields are required." };
      }

      if (username.trim() !== VALID_USERNAME || password !== VALID_PASSWORD) {
        return { success: false, error: "Invalid username or password." };
      }

      const u: User = { username: username.trim() };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(u));

      // Notify the same-tab subscription
      window.dispatchEvent(new StorageEvent("storage", { key: STORAGE_KEY }));

      return { success: true };
    },
    [],
  );

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);

    window.dispatchEvent(new StorageEvent("storage", { key: STORAGE_KEY }));
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
