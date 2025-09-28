"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts"
import { Mail, Send, Globe, Eye, MousePointer } from "lucide-react"

const campaignData = [
  { name: "Jan", sent: 4000, opened: 2400, clicked: 800 },
  { name: "Feb", sent: 3000, opened: 1398, clicked: 600 },
  { name: "Mar", sent: 2000, opened: 1800, clicked: 700 },
  { name: "Apr", sent: 2780, opened: 1908, clicked: 850 },
  { name: "May", sent: 1890, opened: 1200, clicked: 400 },
  { name: "Jun", sent: 2390, opened: 1600, clicked: 650 },
]

const recentCampaigns = [
  { name: "Summer Sale 2024", status: "sent", sent: 15420, opened: 8234, clicked: 1876, date: "2 hours ago" },
  { name: "Product Launch", status: "sending", sent: 8500, opened: 0, clicked: 0, date: "In progress" },
  { name: "Newsletter #47", status: "scheduled", sent: 0, opened: 0, clicked: 0, date: "Tomorrow 9:00 AM" },
  { name: "Welcome Series", status: "draft", sent: 0, opened: 0, clicked: 0, date: "Draft" },
]

export function Overview() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard Overview</h1>
          <p className="text-muted-foreground">Monitor your email campaigns and performance</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Send className="w-4 h-4 mr-2" />
          New Campaign
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">247</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+12%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emails Sent</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.2M</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+8%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Rate</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24.5%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+2.1%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Click Rate</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.8%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-500">-0.3%</span> from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Campaign Performance</CardTitle>
            <CardDescription>Email metrics over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={campaignData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="sent"
                  stackId="1"
                  stroke="hsl(var(--chart-1))"
                  fill="hsl(var(--chart-1))"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="opened"
                  stackId="2"
                  stroke="hsl(var(--chart-2))"
                  fill="hsl(var(--chart-2))"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="clicked"
                  stackId="3"
                  stroke="hsl(var(--chart-3))"
                  fill="hsl(var(--chart-3))"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Domain Health</CardTitle>
            <CardDescription>Deliverability status of your domains</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium">company.com</span>
                </div>
                <Badge variant="secondary" className="bg-green-500/10 text-green-500">
                  Excellent
                </Badge>
              </div>
              <Progress value={95} className="h-2" />

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium">marketing.company.com</span>
                </div>
                <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-500">
                  Good
                </Badge>
              </div>
              <Progress value={78} className="h-2" />

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-red-500" />
                  <span className="text-sm font-medium">promo.company.com</span>
                </div>
                <Badge variant="secondary" className="bg-red-500/10 text-red-500">
                  Needs Attention
                </Badge>
              </div>
              <Progress value={45} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Campaigns */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Campaigns</CardTitle>
          <CardDescription>Latest email campaigns and their performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentCampaigns.map((campaign, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">{campaign.name}</h4>
                    <p className="text-sm text-muted-foreground">{campaign.date}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <p className="text-sm font-medium">{campaign.sent.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Sent</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium">{campaign.opened.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Opened</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium">{campaign.clicked.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Clicked</p>
                  </div>
                  <Badge
                    variant={
                      campaign.status === "sent"
                        ? "default"
                        : campaign.status === "sending"
                          ? "secondary"
                          : campaign.status === "scheduled"
                            ? "outline"
                            : "secondary"
                    }
                  >
                    {campaign.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
