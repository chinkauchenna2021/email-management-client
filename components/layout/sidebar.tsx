'use client'
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Mail,
  Globe,
  Users,
  Send,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Home,
  Database,
  Zap,
} from "lucide-react"
import Link from "next/link"

const NAV_ITEMS = [
  { name: "Overview", href: "/overview", icon: Home },
  { name: "Domains", href: "/domain", icon: Globe },
  { name: "Email Lists", href: "/email-list", icon: Users },
  { name: "Campaigns", href: "/campaign", icon: Send },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Templates", href: "/templates", icon: Database },
  { name: "Email Composer", href: "/email-composer", icon: Mail },
  { name: "Automation", href: "/automation", icon: Zap },
  { name: "Settings", href: "/settings", icon: Settings },
] as const

interface SidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
}

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const width = isCollapsed ? "w-16" : "w-64"

  return (
    <div className={cn("flex flex-col h-full bg-sidebar border-r transition-all duration-300", width)}>
      
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
              <Mail className="w-4 h-4 text-sidebar-primary-foreground" />
            </div>
            <span className="font-semibold text-sidebar-foreground">EmailFlow</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const isActive = activeSection === item.href

            return (
              <Link  href={item.href}>
              <Button
                key={item.name}
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent",
                  isCollapsed ? "px-2" : "px-3",
                  isActive && "bg-sidebar-accent text-sidebar-accent-foreground"
                )}
                // onClick={() => onSectionChange(item.href)}
              >
                <Icon className={cn("w-4 h-4", !isCollapsed && "mr-3")} />
                {!isCollapsed && item.name}
              </Button>
              </Link>
            )
          })}
        </nav>
      </ScrollArea>

      {/* User Profile */}
      {!isCollapsed && <UserProfile />}
    </div>
  )
}

function UserProfile() {
  return (
    <div className="p-4 border-t border-sidebar-border">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-sidebar-primary rounded-full flex items-center justify-center">
          <span className="text-xs font-medium text-sidebar-primary-foreground">JD</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-sidebar-foreground truncate">John Doe</p>
          <p className="text-xs text-sidebar-foreground/60 truncate">john@example.com</p>
        </div>
      </div>
    </div>
  )
}