"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts"
import { Mail, Send, Globe, Eye, MousePointer, TrendingUp, TrendingDown } from "lucide-react"

// Import our hooks
import { 
  useOverviewStats, 
  useOverviewPerformance, 
  useOverviewDomains, 
  useRecentCampaigns 
} from "@/hooks/useOverview"
import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, AwaitedReactNode, Key } from "react"

export function Overview() {
  // Fetch data using our hooks
  const { data: stats, isLoading: statsLoading } = useOverviewStats();
  const { data: performanceData, isLoading: performanceLoading } = useOverviewPerformance();
  const { data: domains, isLoading: domainsLoading } = useOverviewDomains();
  const { data: recentCampaigns, isLoading: campaignsLoading } = useRecentCampaigns();



  console.log(recentCampaigns, "==== recent campaigns ======" , campaignsLoading , "==== campaignsLoading ======  ")
  // Calculate derived values from stats
  const totalCampaigns = stats?.totalCampaigns || 0;
  const totalEmailsSent = stats?.totalSent || 0;
  const avgOpenRate = stats?.openRate || 0;
  const avgClickRate = stats?.clickRate || 0;

  // Show loading state
  if (statsLoading || performanceLoading || domainsLoading || campaignsLoading) {
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
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-6 bg-muted rounded animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded animate-pulse"></div>
                <div className="mt-2 h-4 bg-muted rounded animate-pulse w-3/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="h-6 bg-muted rounded animate-pulse w-1/3"></div>
              <div className="h-4 bg-muted rounded animate-pulse w-1/2 mt-2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted rounded animate-pulse"></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="h-6 bg-muted rounded animate-pulse w-1/3"></div>
              <div className="h-4 bg-muted rounded animate-pulse w-1/2 mt-2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted rounded animate-pulse"></div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Campaigns */}
        <Card>
          <CardHeader>
            <div className="h-6 bg-muted rounded animate-pulse w-1/3"></div>
            <div className="h-4 bg-muted rounded animate-pulse w-1/2 mt-2"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-muted rounded-lg animate-pulse"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded animate-pulse w-32"></div>
                      <div className="h-3 bg-muted rounded animate-pulse w-24"></div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <div className="h-4 bg-muted rounded animate-pulse w-16"></div>
                      <div className="h-3 bg-muted rounded animate-pulse w-8 mt-1"></div>
                    </div>
                    <div className="text-center">
                      <div className="h-4 bg-muted rounded animate-pulse w-16"></div>
                      <div className="h-3 bg-muted rounded animate-pulse w-8 mt-1"></div>
                    </div>
                    <div className="text-center">
                      <div className="h-4 bg-muted rounded animate-pulse w-16"></div>
                      <div className="h-3 bg-muted rounded animate-pulse w-8 mt-1"></div>
                    </div>
                    <div className="h-6 bg-muted rounded animate-pulse w-16"></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

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
            <div className="text-2xl font-bold">{totalCampaigns}</div>
            <p className="text-xs text-muted-foreground">
              {/* <span className="text-green-500">+12%</span> */}
               from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emails Sent</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalEmailsSent >= 1000000 
                ? `${(totalEmailsSent / 1000000).toFixed(1)}M` 
                : totalEmailsSent.toLocaleString()
              }
            </div>
            <p className="text-xs text-muted-foreground">
              {/* <span className="text-green-500">+8%</span>  */}
              from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Rate</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgOpenRate}%</div>
            <p className="text-xs text-muted-foreground">
              {/* <span className="text-green-500">+2.1%</span>  */}
              from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Click Rate</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgClickRate}%</div>
            <p className="text-xs text-muted-foreground">
              {/* <span className="text-red-500">-0.3%</span>  */}
              from last month
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
              <AreaChart data={performanceData}>
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
            {domains?.map((domain: { domain: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined ; reputation: number | null | undefined | any}, index: Key | null | undefined | any) => (
              <div key={index} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium">{domain.domain}</span>
                  </div>
                  <Badge 
                    variant="secondary" 
                    className={
                      Number(domain?.reputation) > 80 
                        ? "bg-green-500/10 text-green-500" 
                        : Number(domain?.reputation) > 60 
                          ? "bg-yellow-500/10 text-yellow-500" 
                          : "bg-red-500/10 text-red-500"
                    }
                  >
                    {Number(domain?.reputation) > 80 ? "Excellent" : Number(domain?.reputation) > 60 ? "Good" : "Needs Attention"}
                  </Badge>
                </div>
                <Progress value={Number(domain?.reputation)} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Campaigns */}
      {/* <Card>
        <CardHeader>
          <CardTitle>Recent Campaigns</CardTitle>
          <CardDescription>Latest email campaigns and their performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {(recentCampaigns !== undefined  ||  recentCampaigns !== null) && recentCampaigns.map((campaign: { name: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; date: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; sent: { toLocaleString: () => string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined }; opened: { toLocaleString: () => string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined }; clicked: { toLocaleString: () => string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined }; status: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<AwaitedReactNode> | null | undefined }, index: Key | null | undefined) => (
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
            )) }
          </div>
        </CardContent>
      </Card> */}
    </div>
  )
}