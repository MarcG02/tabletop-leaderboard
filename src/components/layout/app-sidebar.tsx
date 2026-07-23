"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  Trophy,
  History,
  Users,
  Gamepad2,
  UserPlus,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

const navItems = [
  { label: "Leaderboard", icon: Trophy, href: "/" },
  { label: "Matches", icon: History, href: "/matches" },
  { label: "Players", icon: Users, href: "/players" },
  { label: "Games", icon: Gamepad2, href: "/games" },
]

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <Sidebar variant="sidebar" collapsible="offcanvas">
      {/* Logo Section */}
      <SidebarHeader className="px-6 py-8 flex flex-col items-center gap-2">
        <Image
          alt="Tabletop Tally Logo"
          className="size-16 md:size-20 mb-2"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDVQVZBRTMG-pK4ZhigWofKetZasShsv-XJxbxs84zmYcVukdBcFmVwmXIhpxOCuyod6kmttcb3NuIlVYtuuPiBBj8dZtH108cyf2w80DBpAtAnLhfRRQ8RT9F-mfSmQmI53rRsKC0oGRk2xTAn4wolcISBZFVCGEoYDbLT2uIOa9Qb2I4OCJ9kWyJMs0dDVQ_8BoFAP3oeopO6fr6SEmkUj8kbgthhOdWCuBCkp0kw7trp3rGOc8fH"
          width={80}
          height={80}
          loading="eager"
        />
        <div className="text-center">
          <h1 className="text-xl font-bold text-foreground">
            Tabletop Tally
          </h1>
          <p className="text-xs font-medium text-muted-foreground">
            Winner&apos;s Circle
          </p>
        </div>
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    tooltip={item.label}
                    render={<Link href={item.href} />}
                  >
                    <item.icon className="size-5" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* CTA Button */}
      <SidebarFooter className="px-4 pb-6">
        <button
          onClick={() => router.push("/matches?logMatch=true")}
          className="w-full bg-primary text-primary-foreground py-3 md:py-4 rounded-xl font-medium flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-md cursor-pointer"
        >
          <UserPlus className="size-5" />
          Log Match
        </button>
      </SidebarFooter>
    </Sidebar>
  )
}
