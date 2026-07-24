"use client";

import { useState } from "react";
import { Search, Bell, Settings, Menu, Sun, Moon, LogOut } from "lucide-react";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/components/ui/sidebar";
import { useTheme } from "@/hooks/use-theme";
import { useAuth } from "@/hooks/use-auth";

const TITLE_MAP: Record<string, string> = {
  "/": "Leaderboard",
  "/matches": "Matches History",
  "/players": "Players",
  "/games": "Games",
};

export function TopAppBar() {
  const [showSettings, setShowSettings] = useState(false);
  const { toggleSidebar } = useSidebar();
  const { theme, setTheme } = useTheme();
  const { logout } = useAuth();
  const pathname = usePathname();
  const title = TITLE_MAP[pathname] ?? "Tabletop Tally";

  return (
    <header className="flex justify-between items-center px-4 md:px-6 h-16 md:h-20 w-full bg-background sticky top-0 z-30 border-b safe-top">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="md:hidden text-primary cursor-pointer"
          aria-label="Toggle menu"
        >
          <Menu className="size-7" />
        </button>
        <h2 className="text-xl md:text-2xl font-bold tracking-tighter text-primary">
          {title}
        </h2>
      </div>

      <div className="flex items-center gap-6">
        {/* Search */}
        <div className="hidden md:flex items-center bg-muted/50 px-4 py-2 rounded-full border w-48 md:w-80 shadow-sm focus-within:ring-2 focus-within:ring-primary transition-all">
          <Search className="size-4 text-muted-foreground mr-2" />
          <input
            className="bg-transparent border-none focus:ring-0 text-sm w-full outline-none"
            placeholder="Search matches..."
            type="text"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 text-muted-foreground">
          <button
            className="hover:opacity-80 transition-opacity cursor-pointer touch-target"
            aria-label="Notifications"
          >
            <Bell className="size-5" />
          </button>
          <div className="relative flex items-center gap-4">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="hover:opacity-80 transition-opacity cursor-pointer touch-target"
              aria-label="Settings"
            >
              <Settings className="size-5" />
            </button>
            {showSettings && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowSettings(false)}
                />
                <div className="absolute right-0 top-full mt-2 z-20 bg-card border rounded-xl shadow-xl py-1 min-w-[180px] animate-in fade-in zoom-in-95 origin-top-right">
                  <button
                    onClick={() => {
                      setTheme("light");
                      setShowSettings(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted rounded-lg transition-colors cursor-pointer ${
                      theme === "light"
                        ? "font-semibold text-primary bg-primary/5"
                        : ""
                    }`}
                  >
                    <Sun className="size-4" />
                    Light mode
                  </button>
                  <button
                    onClick={() => {
                      setTheme("dark");
                      setShowSettings(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted rounded-lg transition-colors cursor-pointer ${
                      theme === "dark"
                        ? "font-semibold text-primary bg-primary/5"
                        : ""
                    }`}
                  >
                    <Moon className="size-4" />
                    Dark mode
                  </button>
                  <div className="h-px bg-border mx-3 my-1" />
                  <button
                    onClick={() => {
                      logout();
                      setShowSettings(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-colors cursor-pointer"
                  >
                    <LogOut className="size-4" />
                    Sign out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
