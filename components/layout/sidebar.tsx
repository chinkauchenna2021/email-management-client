"use client"

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

interface SidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
}

const navigation = [
  { name: "Overview", href: "overview", icon: Home },
  { name: "Domains", href: "domains", icon: Globe },
  { name: "Email Lists", href: "lists", icon: Users },
  { name: "Campaigns", href: "campaigns", icon: Send },
  { name: "Analytics", href: "analytics", icon: BarChart3 },
  { name: "Templates", href: "templates", icon: Database },
  {name:" Email Composer", href: "email-composer", icon: Mail},
  { name: "Automation", href: "automation", icon: Zap },
  { name: "Settings", href: "settings", icon: Settings },
]

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-sidebar border-r border-sidebar-border transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
              <Mail className="w-4 h-4 text-sidebar-primary-foreground" />
            </div>
            <span className="font-semibold text-sidebar-foreground">EmailFlow</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = activeSection === item.href

            return (
              <Button
                key={item.name}
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent",
                  collapsed ? "px-2" : "px-3",
                  isActive && "bg-sidebar-accent text-sidebar-accent-foreground",
                )}
                onClick={() => onSectionChange(item.href)}
              >
                <Icon className={cn("w-4 h-4", collapsed ? "" : "mr-3")} />
                {!collapsed && <span>{item.name}</span>}
              </Button>
            )
          })}
        </nav>
      </ScrollArea>

      {/* User Profile */}
      {!collapsed && (
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-sidebar-primary rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-sidebar-primary-foreground">JD</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">John Doe</p>
              <p className="text-xs text-sidebar-foreground/60 truncate">john@example.com</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
