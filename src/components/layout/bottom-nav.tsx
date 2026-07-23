"use client"

import { Trophy, History, Users, Gamepad2, Plus } from "lucide-react"
import { usePathname } from "next/navigation"

interface BottomNavProps {
  onAction: () => void
}

const navItems = [
  { label: "Leaderboard", icon: Trophy, href: "/" },
  { label: "Matches", icon: History, href: "/matches" },
  { label: "Players", icon: Users, href: "/players" },
  { label: "Games", icon: Gamepad2, href: "/games" },
]

export function BottomNav({ onAction }: BottomNavProps) {
  const pathname = usePathname()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background h-16 flex items-center justify-around z-40 border-t safe-bottom">
      {navItems.slice(0, 2).map((item) => (
        <a
          key={item.label}
          href={item.href}
          className={`flex flex-col items-center gap-0.5 cursor-pointer ${
            pathname === item.href
              ? "text-primary font-bold"
              : "text-muted-foreground"
          }`}
        >
          <item.icon className="size-5" />
          <span className="text-[10px] leading-none font-medium">{item.label}</span>
        </a>
      ))}

      {/* FAB */}
      <div className="relative -top-6">
        <button
          onClick={onAction}
          className="size-14 md:size-12 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center border-4 md:border-3 border-background active:scale-95 transition-transform"
          aria-label="Add player"
        >
          <Plus className="size-6" />
        </button>
      </div>

      {navItems.slice(2).map((item) => (
        <a
          key={item.label}
          href={item.href}
          className={`flex flex-col items-center gap-0.5 cursor-pointer ${
            pathname === item.href
              ? "text-primary font-bold"
              : "text-muted-foreground"
          }`}
        >
          <item.icon className="size-5" />
          <span className="text-[10px] leading-none font-medium">{item.label}</span>
        </a>
      ))}
    </nav>
  )
}
