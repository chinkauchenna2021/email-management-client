"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/ui/data-table"
import { EnhancedModal } from "@/components/ui/enhanced-modal"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import { EmailTemplateSelector } from "@/components/ui/email-template-selector"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import {
  Send,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Copy,
  Trash2,
  CalendarIcon,
  Clock,
  Mail,
  MousePointer,
  Pause,
  Play,
  Settings,
} from "lucide-react"
import { cn } from "@/lib/utils"

const campaigns = [
  {
    id: "1",
    name: "Summer Sale 2024",
    subject: "🌞 Summer Sale: Up to 50% Off Everything!",
    status: "sent",
    domain: "company.com",
    list: "Newsletter Subscribers",
    totalRecipients: 15420,
    sent: 15420,
    delivered: 14876,
    opened: 8234,
    clicked: 1876,
    bounced: 544,
    unsubscribed: 23,
    scheduledAt: null,
    sentAt: "2024-03-20T10:00:00Z",
    createdAt: "2024-03-19T15:30:00Z",
  },
  {
    id: "2",
    name: "Product Launch Announcement",
    subject: "Introducing Our Revolutionary New Product",
    status: "sending",
    domain: "marketing.company.com",
    list: "Product Launch List",
    totalRecipients: 8500,
    sent: 6800,
    delivered: 6650,
    opened: 0,
    clicked: 0,
    bounced: 150,
    unsubscribed: 0,
    scheduledAt: null,
    sentAt: "2024-03-21T09:00:00Z",
    createdAt: "2024-03-20T14:20:00Z",
  },
  {
    id: "3",
    name: "Weekly Newsletter #47",
    subject: "This Week's Top Stories and Updates",
    status: "scheduled",
    domain: "company.com",
    list: "Newsletter Subscribers",
    totalRecipients: 15420,
    sent: 0,
    delivered: 0,
    opened: 0,
    clicked: 0,
    bounced: 0,
    unsubscribed: 0,
    scheduledAt: "2024-03-22T09:00:00Z",
    sentAt: null,
    createdAt: "2024-03-21T11:15:00Z",
  },
  {
    id: "4",
    name: "Welcome Series - Part 1",
    subject: "Welcome to EmailFlow! Let's get started",
    status: "draft",
    domain: "company.com",
    list: "New Subscribers",
    totalRecipients: 0,
    sent: 0,
    delivered: 0,
    opened: 0,
    clicked: 0,
    bounced: 0,
    unsubscribed: 0,
    scheduledAt: null,
    sentAt: null,
    createdAt: "2024-03-21T16:45:00Z",
  },
]

export function Campaigns() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false) // Added loading state
  const [newCampaign, setNewCampaign] = useState({
    name: "",
    subject: "",
    content: "",
    domain: "",
    list: "",
    scheduledDate: undefined as Date | undefined,
  })

  const campaignColumns = [
    {
      accessorKey: "name",
      header: "Campaign",
      cell: ({ row }: any) => {
        const campaign = row.original
        return (
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              {getStatusIcon(campaign.status)}
              <span className="font-medium">{campaign.name}</span>
            </div>
            <p className="text-sm text-muted-foreground truncate max-w-xs">{campaign.subject}</p>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <span>{campaign.domain}</span>
              <span>•</span>
              <span>{campaign.list}</span>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: any) => {
        const campaign = row.original
        return (
          <div className="space-y-1">
            {getStatusBadge(campaign.status)}
            {campaign.status === "sending" && (
              <Progress value={(campaign.sent / campaign.totalRecipients) * 100} className="h-1 w-16" />
            )}
          </div>
        )
      },
    },
    {
      accessorKey: "totalRecipients",
      header: "Recipients",
      cell: ({ row }: any) => {
        const campaign = row.original
        return (
          <div className="text-sm">
            <div className="font-medium">{campaign.totalRecipients.toLocaleString()}</div>
            {campaign.sent > 0 && <div className="text-muted-foreground">{campaign.sent.toLocaleString()} sent</div>}
          </div>
        )
      },
    },
    {
      accessorKey: "delivered",
      header: "Delivered",
      cell: ({ row }: any) => {
        const campaign = row.original
        return (
          <div className="text-sm">
            <div className="font-medium">{campaign.delivered.toLocaleString()}</div>
            {campaign.bounced > 0 && <div className="text-red-500">{campaign.bounced} bounced</div>}
          </div>
        )
      },
    },
    {
      accessorKey: "opened",
      header: "Open Rate",
      cell: ({ row }: any) => {
        const campaign = row.original
        return (
          <div className="text-sm">
            <div className="font-medium">{calculateOpenRate(campaign.opened, campaign.delivered)}%</div>
            <div className="text-muted-foreground">{campaign.opened.toLocaleString()} opens</div>
          </div>
        )
      },
    },
    {
      accessorKey: "clicked",
      header: "Click Rate",
      cell: ({ row }: any) => {
        const campaign = row.original
        return (
          <div className="text-sm">
            <div className="font-medium">{calculateClickRate(campaign.clicked, campaign.delivered)}%</div>
            <div className="text-muted-foreground">{campaign.clicked.toLocaleString()} clicks</div>
          </div>
        )
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: any) => {
        const campaign = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleCampaignAction("view", campaign)}>
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleCampaignAction("edit", campaign)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Campaign
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleCampaignAction("duplicate", campaign)}>
                <Copy className="w-4 h-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              {campaign.status === "sending" && (
                <DropdownMenuItem onClick={() => handleCampaignAction("pause", campaign)}>
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </DropdownMenuItem>
              )}
              {campaign.status === "paused" && (
                <DropdownMenuItem onClick={() => handleCampaignAction("resume", campaign)}>
                  <Play className="w-4 h-4 mr-2" />
                  Resume
                </DropdownMenuItem>
              )}
              <DropdownMenuItem className="text-red-600" onClick={() => handleCampaignAction("delete", campaign)}>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const handleCampaignAction = async (action: string, campaign: any) => {
    setIsLoading(true)
    console.log(`[v0] Campaign action: ${action}`, campaign)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    switch (action) {
      case "view":
        setSelectedCampaign(campaign.id)
        break
      case "edit":
        // Open edit modal
        break
      case "duplicate":
        // Duplicate campaign logic
        break
      case "pause":
      case "resume":
      case "delete":
        // Handle respective actions
        break
    }

    setIsLoading(false)
  }

  const handleCreateCampaign = async () => {
    setIsLoading(true)
    console.log("[v0] Creating campaign:", newCampaign)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsCreateDialogOpen(false)
    setNewCampaign({
      name: "",
      subject: "",
      content: "",
      domain: "",
      list: "",
      scheduledDate: undefined,
    })
    setIsLoading(false)
  }

  const handleTemplateSelect = (template: any) => {
    setNewCampaign({
      ...newCampaign,
      content: template.content,
      name: template.name,
      subject: `${template.name} - ${new Date().toLocaleDateString()}`,
    })
    setIsTemplateDialogOpen(false)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "sent":
        return <Badge className="bg-green-500/10 text-green-500">Sent</Badge>
      case "sending":
        return <Badge className="bg-blue-500/10 text-blue-500">Sending</Badge>
      case "scheduled":
        return <Badge className="bg-purple-500/10 text-purple-500">Scheduled</Badge>
      case "draft":
        return <Badge variant="outline">Draft</Badge>
      case "paused":
        return <Badge className="bg-yellow-500/10 text-yellow-500">Paused</Badge>
      case "failed":
        return <Badge className="bg-red-500/10 text-red-500">Failed</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "sent":
        return <Send className="w-4 h-4 text-green-500" />
      case "sending":
        return <Clock className="w-4 h-4 text-blue-500 animate-spin" />
      case "scheduled":
        return <CalendarIcon className="w-4 h-4 text-purple-500" />
      case "draft":
        return <Edit className="w-4 h-4 text-gray-500" />
      case "paused":
        return <Pause className="w-4 h-4 text-yellow-500" />
      case "failed":
        return <Trash2 className="w-4 h-4 text-red-500" />
      default:
        return <Mail className="w-4 h-4 text-gray-500" />
    }
  }

  const calculateOpenRate = (opened: number, delivered: number) => {
    return delivered > 0 ? ((opened / delivered) * 100).toFixed(1) : "0.0"
  }

  const calculateClickRate = (clicked: number, delivered: number) => {
    return delivered > 0 ? ((clicked / delivered) * 100).toFixed(1) : "0.0"
  }

  const filteredCampaigns = campaigns.filter(
    (campaign) =>
      campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.subject.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Email Campaigns</h1>
          <p className="text-muted-foreground">Create, manage, and track your email campaigns</p>
        </div>

        {/* Template Selector Modal */}
        <EnhancedModal
          isOpen={isTemplateDialogOpen}
          onClose={() => setIsTemplateDialogOpen(false)}
          title="Choose Email Template"
          description="Select a template to get started quickly"
          size="full"
        >
          <EmailTemplateSelector
            onSelectTemplate={handleTemplateSelect}
            onClose={() => setIsTemplateDialogOpen(false)}
          />
        </EnhancedModal>

        {/* Create Campaign Modal */}
        <EnhancedModal
          isOpen={isCreateDialogOpen}
          onClose={() => setIsCreateDialogOpen(false)}
          title="Create New Campaign"
          description="Set up a new email campaign to send to your subscribers"
          size="full"
          isLoading={isLoading}
          loadingText="Creating campaign..."
          scrollable={true}
        >
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="campaignName">Campaign Name</Label>
                  <Input
                    id="campaignName"
                    placeholder="Summer Sale 2024"
                    value={newCampaign.name}
                    onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="domain">Sending Domain</Label>
                  <Select
                    value={newCampaign.domain}
                    onValueChange={(value) => setNewCampaign({ ...newCampaign, domain: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select domain" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="company.com">company.com</SelectItem>
                      <SelectItem value="marketing.company.com">marketing.company.com</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="emailList">Email List</Label>
                <Select
                  value={newCampaign.list}
                  onValueChange={(value) => setNewCampaign({ ...newCampaign, list: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select email list" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newsletter">Newsletter Subscribers (15,420)</SelectItem>
                    <SelectItem value="product-launch">Product Launch List (8,234)</SelectItem>
                    <SelectItem value="vip">VIP Customers (1,876)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject Line</Label>
                <Input
                  id="subject"
                  placeholder="🌞 Summer Sale: Up to 50% Off Everything!"
                  value={newCampaign.subject}
                  onChange={(e) => setNewCampaign({ ...newCampaign, subject: e.target.value })}
                />
              </div>
            </TabsContent>

            <TabsContent value="content" className="space-y-4">
              <div className="space-y-2 ">
                <div className="flex items-center justify-between">
                  <Label htmlFor="content">Email Content</Label>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={() => setIsTemplateDialogOpen(true)}>
                      <Settings className="w-4 h-4 mr-2" />
                      Use Template
                    </Button>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                  </div>
                </div>
                <RichTextEditor
                  content={newCampaign.content}
                  onChange={(content) => setNewCampaign({ ...newCampaign, content })}
                  placeholder="Write your email content here... Use the toolbar above to format your text, add links, images, and more."
                  className="min-h-[300px]"
                />
              </div>
            </TabsContent>

            <TabsContent value="schedule" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Button variant="outline" className="flex-1 bg-transparent">
                    <Send className="w-4 h-4 mr-2" />
                    Send Now
                  </Button>
                  <Button variant="outline" className="flex-1 bg-transparent">
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    Schedule Later
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label>Schedule Date & Time</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !newCampaign.scheduledDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newCampaign.scheduledDate ? format(newCampaign.scheduledDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={newCampaign.scheduledDate}
                        onSelect={(date) => setNewCampaign({ ...newCampaign, scheduledDate: date })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end space-x-2 mt-6">
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Save Draft
            </Button>
            <Button onClick={handleCreateCampaign} disabled={isLoading}>
              Create Campaign
            </Button>
          </div>
        </EnhancedModal>

        <Button className="bg-primary hover:bg-primary/90" onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Campaign
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
              <span className="text-green-500">+12</span> this month
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
            <CardTitle className="text-sm font-medium">Avg Open Rate</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24.5%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+2.1%</span> industry avg
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Click Rate</CardTitle>
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

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search campaigns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Campaigns</CardTitle>
          <CardDescription>Manage and track all your email campaigns</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={campaignColumns}
            data={campaigns}
            searchPlaceholder="Search campaigns..."
            onRowAction={handleCampaignAction}
          />
        </CardContent>
      </Card>
    </div>
  )
}
