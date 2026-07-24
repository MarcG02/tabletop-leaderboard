"use client";

import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { getStoredAuth } from "@/lib/auth-store";

const CHECK_INTERVAL = 30_000; // 30s

/**
 * Monitors auth session health:
 * - Checks localStorage periodically for missing auth data
 * - Re-checks when the tab becomes visible (covers dev-tools deletion, browser cleanup)
 * - Calls logout() if auth disappears without going through the normal flow
 */
export function SessionMonitor() {
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) return;

    function check() {
      if (!getStoredAuth()) {
        logout();
      }
    }

    // Periodic check
    const interval = setInterval(check, CHECK_INTERVAL);

    // Check when tab becomes visible (user returns after clearing storage)
    const onVisibility = () => {
      if (document.visibilityState === "visible") check();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [isAuthenticated, logout]);

  return null; // invisible — pure logic
}