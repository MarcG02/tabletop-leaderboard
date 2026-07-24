"use client";

import {
  createContext,
  useContext,
  useCallback,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { loginApi, registerApi } from "@/lib/api";
import { getErrorMessage } from "@/lib/api-error";
import type { StoredAuth } from "@/lib/auth-store";

const STORAGE_KEY = "tabletop-tally-auth";

type User = {
  id: number;
  name: string;
};

type AuthContextValue = {
  user: User | null;
  isAuthenticated: boolean;
  login: (
    username: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  register: (
    username: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

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

function parseStoredAuth(raw: string | null): StoredAuth | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (parsed?.token && parsed?.player?.id && parsed?.player?.name) {
      return parsed as StoredAuth;
    }
  } catch {
    // Corrupt data — ignore
  }
  return null;
}

// ── Helpers ────────────────────────────────────────────────

function persistAuth(auth: StoredAuth): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
  // Notify same-tab subscription
  window.dispatchEvent(new StorageEvent("storage", { key: STORAGE_KEY }));
}

function clearAuth(): void {
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new StorageEvent("storage", { key: STORAGE_KEY }));
}

// ── Provider ───────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const auth = parseStoredAuth(raw);

  const user: User | null = auth ? { id: auth.player.id, name: auth.player.name } : null;
  const isAuthenticated = auth !== null;

  const login = useCallback(
    async (
      username: string,
      password: string,
    ): Promise<{ success: boolean; error?: string }> => {
      if (!username.trim() || !password.trim()) {
        return { success: false, error: "Both fields are required." };
      }

      try {
        const result = await loginApi({
          name: username.trim(),
          password,
        });

        persistAuth({
          token: result.token,
          player: { id: result.player.id, name: result.player.name },
        });

        return { success: true };
      } catch (err) {
        return { success: false, error: getErrorMessage(err, "Invalid username or password.") };
      }
    },
    [],
  );

  const register = useCallback(
    async (
      username: string,
      password: string,
    ): Promise<{ success: boolean; error?: string }> => {
      if (!username.trim() || !password.trim()) {
        return { success: false, error: "Both fields are required." };
      }

      try {
        const result = await registerApi({
          name: username.trim(),
          password,
        });

        persistAuth({
          token: result.token,
          player: { id: result.player.id, name: result.player.name },
        });

        return { success: true };
      } catch (err) {
        return { success: false, error: getErrorMessage(err, "Registration failed.") };
      }
    },
    [],
  );

  const logout = useCallback(() => {
    clearAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
