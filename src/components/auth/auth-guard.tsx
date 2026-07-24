"use client"

import { type ReactNode } from "react"
import { useAuth } from "@/hooks/use-auth"
import { LoginScreen } from "@/components/auth/login-screen"

export function AuthGuard({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <LoginScreen />
  }

  return <>{children}</>
}
