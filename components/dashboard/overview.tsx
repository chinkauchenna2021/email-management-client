"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import {
  Mail,
  Send,
  Globe,
  Eye,
  MousePointer,
  TrendingUp,
  TrendingDown,
  X,
  CheckCircle2,
  Users,
  List,
  Settings,
} from "lucide-react";

// Import our hooks
import {
  useOverviewStats,
  useOverviewPerformance,
  useOverviewDomains,
  useRecentCampaigns,
} from "@/hooks/useOverview";
import {
  ReactElement,
  JSXElementConstructor,
  ReactNode,
  ReactPortal,
  AwaitedReactNode,
  Key,
  useEffect,
  useState,
} from "react";
import { useCampaignStore } from "@/store/campaignStore";

// Import shadcn/ui dialog components
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";

export function Overview() {
  const [showInstructions, setShowInstructions] = useState(false);

  // Fetch data using our hooks
  const { data: stats, isLoading: statsLoading } = useOverviewStats();
  const { data: performanceData, isLoading: performanceLoading } =
    useOverviewPerformance();
  const { data: domains, isLoading: domainsLoading } = useOverviewDomains();
  const { data: recentCampaigns, isLoading: campaignsLoading } =
    useRecentCampaigns();

  const { campaigns } = useCampaignStore();

  // Show instructions modal on first visit
  useEffect(() => {
    const hasSeenInstructions = localStorage.getItem(
      "hasSeenEmailInstructions"
    );
    if (!hasSeenInstructions) {
      setShowInstructions(true);
      localStorage.setItem("hasSeenEmailInstructions", "true");
    }
  }, []);

  console.log(
    recentCampaigns,
    "==== recent campaigns ======",
    campaignsLoading,
    "==== campaignsLoading ======  "
  );

  // Calculate derived values from stats
  const totalCampaigns = stats?.totalCampaigns || 0;
  const totalEmailsSent = stats?.totalSent || 0;
  const avgOpenRate = stats?.openRate || 0;
  const avgClickRate = stats?.clickRate || 0;

  // Updated steps data - merged email list and domain setup
  const steps = [
    {
      step: 1,
      title: "Setup Email & Domain Configuration",
      description:
        "Go to the 'Email & Domain' section to configure your sending infrastructure. Here you can:",
      icon: Settings,
      substeps: [
        {
          icon: Globe,
          text: "Add and verify your sending domains for authentication",
        },
        {
          icon: Users,
          text: "Create and manage your email lists and subscriber segments",
        },
        {
          icon: List,
          text: "Configure SMTP settings or connect email service providers",
        },
      ],
      details:
        "This unified section allows you to manage all your sending infrastructure and audience lists in one place, ensuring proper domain authentication and list organization before launching campaigns.",
    },
    {
      step: 2,
      title: "Create Your Campaign",
      description:
        "Navigate to the Campaigns section to design and set up your email campaign. You'll be able to:",
      icon: Send,
      substeps: [
        {
          icon: Mail,
          text: "Choose your verified domain for sending",
        },
        {
          icon: Users,
          text: "Select from your organized email lists",
        },
        {
          icon: Settings,
          text: "Design your email content and set scheduling",
        },
      ],
      details:
        "With your domains and lists already configured, campaign creation becomes streamlined and efficient.",
    },
    {
      step: 3,
      title: "Launch & Monitor",
      description: "Send your campaign and track its performance in real-time:",
      icon: TrendingUp,
      substeps: [
        {
          icon: Eye,
          text: "Monitor open rates and engagement metrics",
        },
        {
          icon: MousePointer,
          text: "Track click-through rates and conversions",
        },
        {
          icon: Globe,
          text: "Watch domain reputation and deliverability",
        },
      ],
      details:
        "Use the analytics dashboard to optimize future campaigns based on performance data and subscriber engagement.",
    },
  ];

  // Show loading state
  if (
    statsLoading ||
    performanceLoading ||
    domainsLoading ||
    campaignsLoading
  ) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Dashboard Overview
            </h1>
            <p className="text-muted-foreground">
              Monitor your email campaigns and performance
            </p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Link href="/campaign">
              <Send className="w-4 h-4 mr-2" />
              New Campaign
            </Link>
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
                <div
                  key={i}
                  className="flex items-center justify-between p-4 border border-border rounded-lg"
                >
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
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Dashboard Overview
            </h1>
            <p className="text-muted-foreground">
              Monitor your email campaigns and performance
            </p>
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
              <Link href="/campaign">
                <Send className="w-4 h-4 mr-2" />
                New Campaign
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Campaigns
              </CardTitle>
              <Send className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(campaigns || []).length}
              </div>
              <p className="text-xs text-muted-foreground">from last month</p>
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
                  : totalEmailsSent.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Open Rate</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgOpenRate}%</div>
              <p className="text-xs text-muted-foreground">from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Click Rate</CardTitle>
              <MousePointer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgClickRate}%</div>
              <p className="text-xs text-muted-foreground">from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Performance</CardTitle>
              <CardDescription>
                Email metrics over the last 6 months
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={performanceData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                  />
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
              <CardDescription>
                Deliverability status of your domains
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {domains?.map(
                (
                  domain: {
                    domain:
                      | string
                      | number
                      | bigint
                      | boolean
                      | ReactElement<any, string | JSXElementConstructor<any>>
                      | Iterable<ReactNode>
                      | ReactPortal
                      | Promise<AwaitedReactNode>
                      | null
                      | undefined;
                    reputation: number | null | undefined | any;
                  },
                  index: Key | null | undefined | any
                ) => (
                  <div key={index} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Globe className="w-4 h-4 text-green-500" />
                        <span className="text-sm font-medium">
                          {domain.domain}
                        </span>
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
                        {Number(domain?.reputation) > 80
                          ? "Excellent"
                          : Number(domain?.reputation) > 60
                          ? "Good"
                          : "Needs Attention"}
                      </Badge>
                    </div>
                    <Progress
                      value={Number(domain?.reputation)}
                      className="h-2"
                    />
                  </div>
                )
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Instructions Modal */}
      <Dialog open={showInstructions} onOpenChange={setShowInstructions}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Mail className="w-6 h-6 text-primary" />
              Welcome to Email Campaign Manager
            </DialogTitle>
            <DialogDescription className="text-base">
              Follow these steps to set up and launch successful email campaigns
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-8 py-4">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div key={step.step} className="flex gap-4">
                  {/* Step Number */}
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                      {step.step}
                    </div>
                    {index < steps.length - 1 && (
                      <div className="w-0.5 h-full bg-border mt-2"></div>
                    )}
                  </div>

                  {/* Step Content */}
                  <div className="flex-1 pb-8">
                    <div className="flex items-center gap-3 mb-3">
                      <IconComponent className="w-6 h-6 text-primary" />
                      <h3 className="text-xl font-semibold">{step.title}</h3>
                    </div>

                    <p className="text-muted-foreground leading-relaxed mb-4">
                      {step.description}
                    </p>

                    {/* Substeps */}
                    <div className="space-y-3 mb-4">
                      {step.substeps.map((substep, subIndex) => {
                        const SubIconComponent = substep.icon;
                        return (
                          <div
                            key={subIndex}
                            className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg"
                          >
                            <SubIconComponent className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{substep.text}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Additional Details */}
                    <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <p className="text-sm text-blue-800 dark:text-blue-300 leading-relaxed">
                        {step.details}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-muted/50 rounded-lg p-4 mt-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium">Best Practices</p>
                <p className="text-sm text-muted-foreground mt-1">
                  • Always verify your domains before sending campaigns
                  <br />
                  • Segment your email lists for better targeting
                  <br />
                  • Monitor domain reputation regularly
                  <br />• Use custom SMTP for advanced configurations or
                  Resend/Mailtrap for simplicity
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button
              onClick={() => setShowInstructions(false)}
              className="bg-primary hover:bg-primary/90"
            >
              Start Configuring
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
