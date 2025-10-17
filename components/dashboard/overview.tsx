// "use client"

// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Progress } from "@/components/ui/progress"
// import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts"
// import { Mail, Send, Globe, Eye, MousePointer, TrendingUp, TrendingDown } from "lucide-react"

// // Import our hooks
// import { 
//   useOverviewStats, 
//   useOverviewPerformance, 
//   useOverviewDomains, 
//   useRecentCampaigns 
// } from "@/hooks/useOverview"
// import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, AwaitedReactNode, Key } from "react"
// import { useCampaignStore } from "@/store/campaignStore"

// export function Overview() {
//   // Fetch data using our hooks
//   const { data: stats, isLoading: statsLoading } = useOverviewStats();
//   const { data: performanceData, isLoading: performanceLoading } = useOverviewPerformance();
//   const { data: domains, isLoading: domainsLoading } = useOverviewDomains();
//   const { data: recentCampaigns, isLoading: campaignsLoading } = useRecentCampaigns();

//     const {
//       campaigns
//     } = useCampaignStore();



//   console.log(recentCampaigns, "==== recent campaigns ======" , campaignsLoading , "==== campaignsLoading ======  ")
//   // Calculate derived values from stats
//   const totalCampaigns = stats?.totalCampaigns || 0;
//   const totalEmailsSent = stats?.totalSent || 0;
//   const avgOpenRate = stats?.openRate || 0;
//   const avgClickRate = stats?.clickRate || 0;

//   // Show loading state
//   if (statsLoading || performanceLoading || domainsLoading || campaignsLoading) {
//     return (
//       <div className="space-y-6">
//         {/* Header */}
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-3xl font-bold text-foreground">Dashboard Overview</h1>
//             <p className="text-muted-foreground">Monitor your email campaigns and performance</p>
//           </div>
//           <Button className="bg-primary hover:bg-primary/90">
//             <Send className="w-4 h-4 mr-2" />
//             New Campaign
//           </Button>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           {[...Array(4)].map((_, i) => (
//             <Card key={i}>
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <div className="h-6 bg-muted rounded animate-pulse"></div>
//               </CardHeader>
//               <CardContent>
//                 <div className="h-8 bg-muted rounded animate-pulse"></div>
//                 <div className="mt-2 h-4 bg-muted rounded animate-pulse w-3/4"></div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>

//         {/* Charts */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           <Card>
//             <CardHeader>
//               <div className="h-6 bg-muted rounded animate-pulse w-1/3"></div>
//               <div className="h-4 bg-muted rounded animate-pulse w-1/2 mt-2"></div>
//             </CardHeader>
//             <CardContent>
//               <div className="h-64 bg-muted rounded animate-pulse"></div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader>
//               <div className="h-6 bg-muted rounded animate-pulse w-1/3"></div>
//               <div className="h-4 bg-muted rounded animate-pulse w-1/2 mt-2"></div>
//             </CardHeader>
//             <CardContent>
//               <div className="h-64 bg-muted rounded animate-pulse"></div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Recent Campaigns */}
//         <Card>
//           <CardHeader>
//             <div className="h-6 bg-muted rounded animate-pulse w-1/3"></div>
//             <div className="h-4 bg-muted rounded animate-pulse w-1/2 mt-2"></div>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               {[...Array(4)].map((_, i) => (
//                 <div key={i} className="flex items-center justify-between p-4 border border-border rounded-lg">
//                   <div className="flex items-center space-x-4">
//                     <div className="w-10 h-10 bg-muted rounded-lg animate-pulse"></div>
//                     <div className="space-y-2">
//                       <div className="h-4 bg-muted rounded animate-pulse w-32"></div>
//                       <div className="h-3 bg-muted rounded animate-pulse w-24"></div>
//                     </div>
//                   </div>
//                   <div className="flex items-center space-x-6">
//                     <div className="text-center">
//                       <div className="h-4 bg-muted rounded animate-pulse w-16"></div>
//                       <div className="h-3 bg-muted rounded animate-pulse w-8 mt-1"></div>
//                     </div>
//                     <div className="text-center">
//                       <div className="h-4 bg-muted rounded animate-pulse w-16"></div>
//                       <div className="h-3 bg-muted rounded animate-pulse w-8 mt-1"></div>
//                     </div>
//                     <div className="text-center">
//                       <div className="h-4 bg-muted rounded animate-pulse w-16"></div>
//                       <div className="h-3 bg-muted rounded animate-pulse w-8 mt-1"></div>
//                     </div>
//                     <div className="h-6 bg-muted rounded animate-pulse w-16"></div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold text-foreground">Dashboard Overview</h1>
//           <p className="text-muted-foreground">Monitor your email campaigns and performance</p>
//         </div>
//         <Button className="bg-primary hover:bg-primary/90">
//           <Send className="w-4 h-4 mr-2" />
//           New Campaign
//         </Button>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
//             <Send className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{(campaigns || []).length}</div>
//             <p className="text-xs text-muted-foreground">
//               {/* <span className="text-green-500">+12%</span> */}
//                from last month
//             </p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Emails Sent</CardTitle>
//             <Mail className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">
//               {totalEmailsSent >= 1000000 
//                 ? `${(totalEmailsSent / 1000000).toFixed(1)}M` 
//                 : totalEmailsSent.toLocaleString()
//               }
//             </div>
//             <p className="text-xs text-muted-foreground">
//               {/* <span className="text-green-500">+8%</span>  */}
//               from last month
//             </p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Open Rate</CardTitle>
//             <Eye className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{avgOpenRate}%</div>
//             <p className="text-xs text-muted-foreground">
//               {/* <span className="text-green-500">+2.1%</span>  */}
//               from last month
//             </p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Click Rate</CardTitle>
//             <MousePointer className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{avgClickRate}%</div>
//             <p className="text-xs text-muted-foreground">
//               {/* <span className="text-red-500">-0.3%</span>  */}
//               from last month
//             </p>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Charts */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <Card>
//           <CardHeader>
//             <CardTitle>Campaign Performance</CardTitle>
//             <CardDescription>Email metrics over the last 6 months</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <ResponsiveContainer width="100%" height={300}>
//               <AreaChart data={performanceData}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
//                 <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
//                 <YAxis stroke="hsl(var(--muted-foreground))" />
//                 <Tooltip
//                   contentStyle={{
//                     backgroundColor: "hsl(var(--card))",
//                     border: "1px solid hsl(var(--border))",
//                     borderRadius: "8px",
//                   }}
//                 />
//                 <Area
//                   type="monotone"
//                   dataKey="sent"
//                   stackId="1"
//                   stroke="hsl(var(--chart-1))"
//                   fill="hsl(var(--chart-1))"
//                   fillOpacity={0.6}
//                 />
//                 <Area
//                   type="monotone"
//                   dataKey="opened"
//                   stackId="2"
//                   stroke="hsl(var(--chart-2))"
//                   fill="hsl(var(--chart-2))"
//                   fillOpacity={0.6}
//                 />
//                 <Area
//                   type="monotone"
//                   dataKey="clicked"
//                   stackId="3"
//                   stroke="hsl(var(--chart-3))"
//                   fill="hsl(var(--chart-3))"
//                   fillOpacity={0.6}
//                 />
//               </AreaChart>
//             </ResponsiveContainer>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>Domain Health</CardTitle>
//             <CardDescription>Deliverability status of your domains</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             {domains?.map((domain: { domain: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined ; reputation: number | null | undefined | any}, index: Key | null | undefined | any) => (
//               <div key={index} className="space-y-3">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center space-x-2">
//                     <Globe className="w-4 h-4 text-green-500" />
//                     <span className="text-sm font-medium">{domain.domain}</span>
//                   </div>
//                   <Badge 
//                     variant="secondary" 
//                     className={
//                       Number(domain?.reputation) > 80 
//                         ? "bg-green-500/10 text-green-500" 
//                         : Number(domain?.reputation) > 60 
//                           ? "bg-yellow-500/10 text-yellow-500" 
//                           : "bg-red-500/10 text-red-500"
//                     }
//                   >
//                     {Number(domain?.reputation) > 80 ? "Excellent" : Number(domain?.reputation) > 60 ? "Good" : "Needs Attention"}
//                   </Badge>
//                 </div>
//                 <Progress value={Number(domain?.reputation)} className="h-2" />
//               </div>
//             ))}
//           </CardContent>
//         </Card>
//       </div>

//       {/* Recent Campaigns */}
//       {/* <Card>
//         <CardHeader>
//           <CardTitle>Recent Campaigns</CardTitle>
//           <CardDescription>Latest email campaigns and their performance</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-4">
//             {(recentCampaigns !== undefined  ||  recentCampaigns !== null) && recentCampaigns.map((campaign: { name: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; date: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; sent: { toLocaleString: () => string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined }; opened: { toLocaleString: () => string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined }; clicked: { toLocaleString: () => string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined }; status: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<AwaitedReactNode> | null | undefined }, index: Key | null | undefined) => (
//               <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
//                 <div className="flex items-center space-x-4">
//                   <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
//                     <Mail className="w-5 h-5 text-primary" />
//                   </div>
//                   <div>
//                     <h4 className="font-medium">{campaign.name}</h4>
//                     <p className="text-sm text-muted-foreground">{campaign.date}</p>
//                   </div>
//                 </div>
//                 <div className="flex items-center space-x-6">
//                   <div className="text-center">
//                     <p className="text-sm font-medium">{campaign.sent.toLocaleString()}</p>
//                     <p className="text-xs text-muted-foreground">Sent</p>
//                   </div>
//                   <div className="text-center">
//                     <p className="text-sm font-medium">{campaign.opened.toLocaleString()}</p>
//                     <p className="text-xs text-muted-foreground">Opened</p>
//                   </div>
//                   <div className="text-center">
//                     <p className="text-sm font-medium">{campaign.clicked.toLocaleString()}</p>
//                     <p className="text-xs text-muted-foreground">Clicked</p>
//                   </div>
//                   <Badge
//                     variant={
//                       campaign.status === "sent"
//                         ? "default"
//                         : campaign.status === "sending"
//                           ? "secondary"
//                           : campaign.status === "scheduled"
//                             ? "outline"
//                             : "secondary"
//                     }
//                   >
//                     {campaign.status}
//                   </Badge>
//                 </div>
//               </div>
//             )) }
//           </div>
//         </CardContent>
//       </Card> */}
//     </div>
//   )
// }








"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts"
import { Mail, Send, Globe, Eye, MousePointer, TrendingUp, TrendingDown, X, CheckCircle2 } from "lucide-react"

// Import our hooks
import { 
  useOverviewStats, 
  useOverviewPerformance, 
  useOverviewDomains, 
  useRecentCampaigns 
} from "@/hooks/useOverview"
import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, AwaitedReactNode, Key, useEffect, useState } from "react"
import { useCampaignStore } from "@/store/campaignStore"

// Import shadcn/ui dialog components
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export function Overview() {
  const [showInstructions, setShowInstructions] = useState(false);
  
  // Fetch data using our hooks
  const { data: stats, isLoading: statsLoading } = useOverviewStats();
  const { data: performanceData, isLoading: performanceLoading } = useOverviewPerformance();
  const { data: domains, isLoading: domainsLoading } = useOverviewDomains();
  const { data: recentCampaigns, isLoading: campaignsLoading } = useRecentCampaigns();

  const { campaigns } = useCampaignStore();

  // Show instructions modal on first visit
  useEffect(() => {
    const hasSeenInstructions = localStorage.getItem('hasSeenEmailInstructions');
    if (!hasSeenInstructions) {
      setShowInstructions(true);
      localStorage.setItem('hasSeenEmailInstructions', 'true');
    }
  }, []);

  console.log(recentCampaigns, "==== recent campaigns ======" , campaignsLoading , "==== campaignsLoading ======  ")
  
  // Calculate derived values from stats
  const totalCampaigns = stats?.totalCampaigns || 0;
  const totalEmailsSent = stats?.totalSent || 0;
  const avgOpenRate = stats?.openRate || 0;
  const avgClickRate = stats?.clickRate || 0;

  // Steps data
  const steps = [
    {
      step: 1,
      title: "Create a Domain",
      description: "Set up a domain for sending your emails. If using custom SMTP provider, fill all details including host, SMTP URL, username and password. For Resend and Mailtrap, these details are not necessary.",
      icon: Globe
    },
    {
      step: 2,
      title: "Create Email List",
      description: "Build your email list in the Email List section. This is where you add all the email addresses you want to send your campaigns to.",
      icon: Mail
    },
    {
      step: 3,
      title: "Launch Campaign",
      description: "Go to Campaigns, create a new campaign, select your domain and email list, then send your email. That's all!",
      icon: Send
    }
  ];

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
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard Overview</h1>
            <p className="text-muted-foreground">Monitor your email campaigns and performance</p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowInstructions(true)}
              className="text-sm"
            >
              Show Instructions
            </Button>
            <Button className="bg-primary hover:bg-primary/90">
              <Send className="w-4 h-4 mr-2" />
              New Campaign
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
              <Send className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{(campaigns || []).length}</div>
              <p className="text-xs text-muted-foreground">
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
      </div>

      {/* Instructions Modal */}
      <Dialog open={showInstructions} onOpenChange={setShowInstructions}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Mail className="w-6 h-6 text-primary" />
              Welcome to Email Campaign Manager
            </DialogTitle>
            <DialogDescription className="text-base">
              Follow these simple steps to start sending effective email campaigns
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div key={step.step} className="flex gap-4">
                  {/* Step Number */}
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                      {step.step}
                    </div>
                    {index < steps.length - 1 && (
                      <div className="w-0.5 h-full bg-border mt-2"></div>
                    )}
                  </div>

                  {/* Step Content */}
                  <div className="flex-1 pb-6">
                    <div className="flex items-center gap-3 mb-2">
                      <IconComponent className="w-5 h-5 text-primary" />
                      <h3 className="text-lg font-semibold">{step.title}</h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-muted/50 rounded-lg p-4 mt-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium">Pro Tip</p>
                <p className="text-sm text-muted-foreground mt-1">
                  For custom SMTP providers, you'll need to fill all authentication details. 
                  For Resend and Mailtrap, the setup is automatic and requires minimal configuration.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button 
              onClick={() => setShowInstructions(false)}
              className="bg-primary hover:bg-primary/90"
            >
              Get Started
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}