"use client"

import { useEffect, useState } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Overview } from "@/components/dashboard/overview"
import { useAuthStore } from "@/store/authStore"
import { useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/auth/protected-route"

interface Campaign {
  id: string
  name: string
  emailCount: number
  status: "active" | "draft" | "completed"
  createdAt: Date
  description?: string
}

export default function Home() {
    const { token, isAuthenticated, logout } = useAuthStore();
  const [activeSection, setActiveSection] = useState("overview")


  return (
     <ProtectedRoute>

    <div className="flex h-screen bg-background">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <main className="flex-1 overflow-auto">
         <div className="p-6"><Overview /></div>
      </main>
    </div>
     </ProtectedRoute>
  )
}
