"use client"

import { useState } from "react"
import { LoginForm } from "@/components/auth/login-form"
import { Sidebar } from "@/components/layout/sidebar"
import { Overview } from "@/components/dashboard/overview"
import { Domains } from "@/components/dashboard/domains"
import { EmailLists } from "@/components/dashboard/email-lists"
import { Campaigns } from "@/components/dashboard/campaigns"
import { Analytics } from "@/components/dashboard/analytics"
import Settings from "@/components/dashboard/settings"
import Automation from "@/components/dashboard/automation"
import { EmailComposer } from "@/components/dashboard/email-composer"
import TemplatesPage from "./templates/page"
import DashboardPage from "./overview/page"
import DomainPage from "./domain/page"
import EmailListPage from "./email-list/page"
import CampaignPage from "./campaign/page"
import AnalyticsPage from "./analytics/page"
import AutomationPage from "./automation/page"
import SettingsPage from "./settings/page"

interface Campaign {
  id: string
  name: string
  emailCount: number
  status: "active" | "draft" | "completed"
  createdAt: Date
  description?: string
}

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(true)
  const [activeSection, setActiveSection] = useState("overview")

  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | undefined>()

  const handleCampaignSelect = (campaign: Campaign) => {
    setSelectedCampaign(campaign)
    console.log("Campaign selected:", campaign)
  }

  const handleSave = async (data: any) => {
    console.log("[v0] Saving email:", data)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    // Implement your save logic here
  }

  const handleSend = async (data: any) => {
    console.log("[v0] Sending email:", data)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    // Implement your send logic here
  }

  const handlePreview = (data: any) => {
    console.log("[v0] Previewing email:", data)
    // Implement your preview logic here
  }

  const handleLogin = (email: string, password: string) => {
    // In a real app, you would validate credentials here
    setIsAuthenticated(true)
  }

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return <DashboardPage />
      case "domains":
        return <DomainPage />
      case "email-composer":
        return (
           <div className="min-h-screen bg-background dark">
             <EmailComposer
              // selectedCampaign={selectedCampaign}
              // onCampaignSelect={handleCampaignSelect}
              // onSave={handleSave}
              // onSend={handleSend}
              // onPreview={handlePreview}
            />
          </div>
        );
      case "lists":
        return <EmailListPage />
      case "campaigns":
        return <CampaignPage />
      case "analytics":
        return <AnalyticsPage />
      case "templates":
        return <TemplatesPage />
      case "automation":
        return <AutomationPage />
      case "settings":
        return <SettingsPage />
      default:
        return <DashboardPage />
    }
  }

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <main className="flex-1 overflow-auto">
        <div className="p-6">{renderContent()}</div>
      </main>
    </div>
  )
}
