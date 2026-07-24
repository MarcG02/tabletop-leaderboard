"use client"

import { useState, type ReactNode } from "react"
import { useAuth } from "@/hooks/use-auth"
import { LoginScreen } from "@/components/auth/login-screen"
import { RegisterScreen } from "@/components/auth/register-screen"

export function AuthGuard({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()
  const [mode, setMode] = useState<"login" | "register">("login")

  if (!isAuthenticated) {
    if (mode === "register") {
      return <RegisterScreen onSwitchToLogin={() => setMode("login")} />
    }
    return <LoginScreen onSwitchToRegister={() => setMode("register")} />
  }

  return <>{children}</>
}
