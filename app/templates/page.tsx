"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import { EmailTemplates } from "@/components/dashboard/email-templates"
import { useRouter } from "next/navigation"

export default function TemplatesPage() {
  const router = useRouter()

  const handleSelectTemplate = (template: any) => {
    console.log("[v0] Template selected:", template)
    // Store template in localStorage or state management
    localStorage.setItem("selectedTemplate", JSON.stringify(template))
    // Navigate to compose page
    router.push("/compose")
  }

  return (
    <div className="min-h-screen bg-background dark">
      <EmailTemplates onSelectTemplate={handleSelectTemplate} />
    </div>
  )
}
