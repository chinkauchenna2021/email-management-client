"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import { EmailTemplates } from "@/components/dashboard/email-templates"
import { Sidebar } from "@/components/layout/sidebar";
import { Campaign } from "@/services/campaignService";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react";

export default function TemplatesPage() {

      const { token, isAuthenticated, logout } = useAuthStore();
      const [activeSection, setActiveSection] = useState("templates")
      const router = useRouter()
      const [selectedCampaign, setSelectedCampaign] = useState<Campaign | undefined>()
      console.log(token , isAuthenticated)
      useEffect(()=>{
        if(!isAuthenticated){
          router.push('/auth/login')
          return
        }
    
      },[])
  const handleSelectTemplate = (template: any) => {
    console.log("[v0] Template selected:", template)
    // Store template in localStorage or state management
    localStorage.setItem("selectedTemplate", JSON.stringify(template))
    // Navigate to compose page
    router.push("/compose")
  }

  return (
    <div className="min-h-screen bg-background dark">
        <div className="flex h-screen bg-background">
            <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
            <main className="flex-1 overflow-auto">
                <div className="p-6"> <EmailTemplates onSelectTemplate={handleSelectTemplate} /></div>
            </main>
          </div>
    </div>
  )
}
