"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  Line,
  LineChart,
  Bar,
  BarChart,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { TrendingUp, TrendingDown, Mail, Eye, MousePointer, AlertTriangle, Download, Activity } from "lucide-react"

const performanceData = [
  { month: "Jan", sent: 45000, delivered: 43200, opened: 12960, clicked: 2592, bounced: 1800, unsubscribed: 180 },
  { month: "Feb", sent: 52000, delivered: 50440, opened: 15132, clicked: 3022, bounced: 1560, unsubscribed: 208 },
  { month: "Mar", sent: 48000, delivered: 46560, opened: 13968, clicked: 2794, bounced: 1440, unsubscribed: 192 },
  { month: "Apr", sent: 61000, delivered: 59170, opened: 17751, clicked: 3550, bounced: 1830, unsubscribed: 244 },
  { month: "May", sent: 55000, delivered: 53350, opened: 16005, clicked: 3201, bounced: 1650, unsubscribed: 220 },
  { month: "Jun", sent: 67000, delivered: 65030, opened: 19509, clicked: 3902, bounced: 1970, unsubscribed: 268 },
]

const campaignPerformance = [
  {
    name: "Summer Sale 2024",
    sent: 15420,
    opened: 8234,
    clicked: 1876,
    openRate: 53.4,
    clickRate: 12.2,
    revenue: 45600,
  },
  { name: "Product Launch", sent: 8500, opened: 3400, clicked: 680, openRate: 40.0, clickRate: 8.0, revenue: 28900 },
  { name: "Newsletter #47", sent: 15420, opened: 4626, clicked: 925, openRate: 30.0, clickRate: 6.0, revenue: 12300 },
  { name: "Welcome Series", sent: 2100, opened: 1260, clicked: 315, openRate: 60.0, clickRate: 15.0, revenue: 8700 },
  { name: "Re-engagement", sent: 5432, opened: 1630, clicked: 272, openRate: 30.0, clickRate: 5.0, revenue: 5400 },
]

const deviceData = [
  { name: "Desktop", value: 45, color: "hsl(var(--chart-1))" },
  { name: "Mobile", value: 38, color: "hsl(var(--chart-2))" },
  { name: "Tablet", value: 17, color: "hsl(var(--chart-3))" },
]

const timeData = [
  { hour: "6 AM", opens: 120, clicks: 24 },
  { hour: "8 AM", opens: 340, clicks: 68 },
  { hour: "10 AM", opens: 580, clicks: 116 },
  { hour: "12 PM", opens: 720, clicks: 144 },
  { hour: "2 PM", opens: 650, clicks: 130 },
  { hour: "4 PM", opens: 480, clicks: 96 },
  { hour: "6 PM", opens: 380, clicks: 76 },
  { hour: "8 PM", opens: 290, clicks: 58 },
]

const domainReputation = [
  { domain: "company.com", reputation: 95, emails: 45000, deliverability: 98.2 },
  { domain: "marketing.company.com", reputation: 78, emails: 28000, deliverability: 94.5 },
  { domain: "promo.company.com", reputation: 45, emails: 12000, deliverability: 78.3 },
]

export function Analytics() {
  const [timeRange, setTimeRange] = useState("6months")
  const [selectedMetric, setSelectedMetric] = useState("all")

  const totalSent = performanceData.reduce((sum, month) => sum + month.sent, 0)
  const totalDelivered = performanceData.reduce((sum, month) => sum + month.delivered, 0)
  const totalOpened = performanceData.reduce((sum, month) => sum + month.opened, 0)
  const totalClicked = performanceData.reduce((sum, month) => sum + month.clicked, 0)
  const totalBounced = performanceData.reduce((sum, month) => sum + month.bounced, 0)
  const totalUnsubscribed = performanceData.reduce((sum, month) => sum + month.unsubscribed, 0)

  const avgOpenRate = ((totalOpened / totalDelivered) * 100).toFixed(1)
  const avgClickRate = ((totalClicked / totalDelivered) * 100).toFixed(1)
  const avgBounceRate = ((totalBounced / totalSent) * 100).toFixed(1)
  const avgUnsubscribeRate = ((totalUnsubscribed / totalDelivered) * 100).toFixed(1)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Comprehensive insights into your email campaign performance</p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="3months">Last 3 months</SelectItem>
              <SelectItem value="6months">Last 6 months</SelectItem>
              <SelectItem value="1year">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sent</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSent.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
              <span className="text-green-500">+12.5%</span>
              <span className="ml-1">vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Open Rate</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgOpenRate}%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
              <span className="text-green-500">+2.1%</span>
              <span className="ml-1">vs industry avg</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Click Rate</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgClickRate}%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingDown className="w-3 h-3 mr-1 text-red-500" />
              <span className="text-red-500">-0.3%</span>
              <span className="ml-1">vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgBounceRate}%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingDown className="w-3 h-3 mr-1 text-green-500" />
              <span className="text-green-500">-0.8%</span>
              <span className="ml-1">vs last period</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Email Performance Trends</CardTitle>
            <CardDescription>Track your email metrics over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
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
                  dataKey="delivered"
                  stackId="2"
                  stroke="hsl(var(--chart-2))"
                  fill="hsl(var(--chart-2))"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="opened"
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
            <CardTitle>Device Breakdown</CardTitle>
            <CardDescription>Email opens by device type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={deviceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {deviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center space-x-6 mt-4">
              {deviceData.map((device, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: device.color }} />
                  <span className="text-sm text-muted-foreground">
                    {device.name} ({device.value}%)
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics Tabs */}
      <Tabs defaultValue="campaigns" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="campaigns">Campaign Performance</TabsTrigger>
          <TabsTrigger value="timing">Optimal Timing</TabsTrigger>
          <TabsTrigger value="domains">Domain Health</TabsTrigger>
          <TabsTrigger value="engagement">Engagement Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Campaigns</CardTitle>
              <CardDescription>Compare performance across your recent campaigns</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campaign Name</TableHead>
                    <TableHead>Recipients</TableHead>
                    <TableHead>Open Rate</TableHead>
                    <TableHead>Click Rate</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Performance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaignPerformance.map((campaign, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{campaign.name}</TableCell>
                      <TableCell>{campaign.sent.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span>{campaign.openRate}%</span>
                          <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-chart-1"
                              style={{ width: `${Math.min(campaign.openRate, 100)}%` }}
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span>{campaign.clickRate}%</span>
                          <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-chart-2"
                              style={{ width: `${Math.min(campaign.clickRate * 5, 100)}%` }}
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>${campaign.revenue.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            campaign.openRate > 40 ? "default" : campaign.openRate > 25 ? "secondary" : "outline"
                          }
                          className={
                            campaign.openRate > 40
                              ? "bg-green-500/10 text-green-500"
                              : campaign.openRate > 25
                                ? "bg-yellow-500/10 text-yellow-500"
                                : "bg-red-500/10 text-red-500"
                          }
                        >
                          {campaign.openRate > 40 ? "Excellent" : campaign.openRate > 25 ? "Good" : "Needs Work"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Optimal Send Times</CardTitle>
              <CardDescription>When your audience is most engaged</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={timeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="opens" fill="hsl(var(--chart-1))" name="Opens" />
                  <Bar dataKey="clicks" fill="hsl(var(--chart-2))" name="Clicks" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="domains" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Domain Reputation & Deliverability</CardTitle>
              <CardDescription>Monitor your sending domain health</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {domainReputation.map((domain, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Activity className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{domain.domain}</h4>
                        <p className="text-sm text-muted-foreground">{domain.emails.toLocaleString()} emails sent</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <p className="text-sm font-medium">{domain.reputation}</p>
                        <p className="text-xs text-muted-foreground">Reputation</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium">{domain.deliverability}%</p>
                        <p className="text-xs text-muted-foreground">Deliverability</p>
                      </div>
                      <Badge
                        variant={domain.reputation > 80 ? "default" : domain.reputation > 60 ? "secondary" : "outline"}
                        className={
                          domain.reputation > 80
                            ? "bg-green-500/10 text-green-500"
                            : domain.reputation > 60
                              ? "bg-yellow-500/10 text-yellow-500"
                              : "bg-red-500/10 text-red-500"
                        }
                      >
                        {domain.reputation > 80 ? "Excellent" : domain.reputation > 60 ? "Good" : "Poor"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Engagement Trends</CardTitle>
              <CardDescription>Track how engagement changes over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Line type="monotone" dataKey="opened" stroke="hsl(var(--chart-1))" strokeWidth={2} name="Opens" />
                  <Line type="monotone" dataKey="clicked" stroke="hsl(var(--chart-2))" strokeWidth={2} name="Clicks" />
                  <Line
                    type="monotone"
                    dataKey="unsubscribed"
                    stroke="hsl(var(--chart-5))"
                    strokeWidth={2}
                    name="Unsubscribes"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
