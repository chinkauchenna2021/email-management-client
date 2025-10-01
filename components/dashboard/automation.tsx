"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/ui/data-table"
import { EnhancedModal } from "@/components/ui/enhanced-modal"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import {
  Zap,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Copy,
  Trash2,
  Play,
  Pause,
  Clock,
  Mail,
  Users,
  MousePointer,
  Settings,
  Target,
  Timer,
  Activity,
  Workflow,
  GitBranch,
  Send,
  UserPlus,
  ShoppingCart,
  TrendingUp,
  Shuffle,
  RotateCcw,
} from "lucide-react"

interface AutomationWorkflow {
  id: string
  name: string
  description: string
  status: "active" | "paused" | "draft"
  trigger: {
    type: "signup" | "purchase" | "email_open" | "email_click" | "time_based" | "list_join" | "tag_added"
    conditions: any
  }
  steps: WorkflowStep[]
  stats: {
    totalEntered: number
    completed: number
    active: number
    conversionRate: number
  }
  createdAt: string
  lastModified: string
}

interface WorkflowStep {
  id: string
  type: "email" | "delay" | "condition" | "action" | "split_test"
  config: any
  position: { x: number; y: number }
  connections: string[]
}

const automationWorkflows: AutomationWorkflow[] = [
  {
    id: "1",
    name: "Welcome Series",
    description: "5-email onboarding sequence for new subscribers",
    status: "active",
    trigger: {
      type: "signup",
      conditions: { list: "newsletter" },
    },
    steps: [
      {
        id: "step1",
        type: "email",
        config: { template: "welcome-1", delay: 0 },
        position: { x: 100, y: 100 },
        connections: ["step2"],
      },
      {
        id: "step2",
        type: "delay",
        config: { duration: 24, unit: "hours" },
        position: { x: 100, y: 200 },
        connections: ["step3"],
      },
      {
        id: "step3",
        type: "email",
        config: { template: "welcome-2" },
        position: { x: 100, y: 300 },
        connections: [],
      },
    ],
    stats: {
      totalEntered: 1247,
      completed: 892,
      active: 156,
      conversionRate: 71.5,
    },
    createdAt: "2024-01-15",
    lastModified: "2024-03-20",
  },
  {
    id: "2",
    name: "Abandoned Cart Recovery",
    description: "3-email sequence to recover abandoned carts",
    status: "active",
    trigger: {
      type: "purchase",
      conditions: { event: "cart_abandoned", delay: 1 },
    },
    steps: [],
    stats: {
      totalEntered: 456,
      completed: 123,
      active: 45,
      conversionRate: 27.0,
    },
    createdAt: "2024-02-01",
    lastModified: "2024-03-18",
  },
  {
    id: "3",
    name: "Re-engagement Campaign",
    description: "Win back inactive subscribers",
    status: "paused",
    trigger: {
      type: "time_based",
      conditions: { inactivity: 30, unit: "days" },
    },
    steps: [],
    stats: {
      totalEntered: 2341,
      completed: 567,
      active: 0,
      conversionRate: 24.2,
    },
    createdAt: "2024-01-20",
    lastModified: "2024-03-15",
  },
]

const triggerTypes = [
  { value: "signup", label: "User Signup", icon: UserPlus, description: "When someone joins your list" },
  {
    value: "purchase",
    label: "Purchase Event",
    icon: ShoppingCart,
    description: "After a purchase or cart abandonment",
  },
  { value: "email_open", label: "Email Opened", icon: Mail, description: "When someone opens an email" },
  { value: "email_click", label: "Email Clicked", icon: MousePointer, description: "When someone clicks a link" },
  { value: "time_based", label: "Time-Based", icon: Clock, description: "After a specific time period" },
  { value: "list_join", label: "List Join", icon: Users, description: "When added to a specific list" },
  { value: "tag_added", label: "Tag Added", icon: Target, description: "When a tag is applied" },
]

const stepTypes = [
  { value: "email", label: "Send Email", icon: Mail, description: "Send an email to the subscriber" },
  { value: "delay", label: "Wait/Delay", icon: Timer, description: "Wait for a specified time" },
  { value: "condition", label: "Condition", icon: GitBranch, description: "Branch based on conditions" },
  { value: "action", label: "Action", icon: Settings, description: "Perform an action (tag, move list, etc.)" },
  { value: "split_test", label: "A/B Split", icon: Shuffle, description: "Split traffic for testing" },
]

export default function Automation() {
  const { toast } = useToast()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isBuilderOpen, setIsBuilderOpen] = useState(false)
  const [selectedWorkflow, setSelectedWorkflow] = useState<AutomationWorkflow | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const [newWorkflow, setNewWorkflow] = useState({
    name: "",
    description: "",
    triggerType: "",
    triggerConditions: {},
    steps: [] as WorkflowStep[],
  })

  const workflowColumns = [
    {
      accessorKey: "name",
      header: "Workflow",
      cell: ({ row }: any) => {
        const workflow = row.original
        return (
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Workflow className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{workflow.name}</span>
            </div>
            <p className="text-sm text-muted-foreground">{workflow.description}</p>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <span>{getTriggerLabel(workflow.trigger.type)}</span>
              <span>•</span>
              <span>{workflow.steps.length} steps</span>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: any) => {
        const workflow = row.original
        return getStatusBadge(workflow.status)
      },
    },
    {
      accessorKey: "stats",
      header: "Performance",
      cell: ({ row }: any) => {
        const workflow = row.original
        return (
          <div className="space-y-1">
            <div className="flex items-center space-x-4 text-sm">
              <div>
                <span className="font-medium">{workflow.stats.totalEntered}</span>
                <span className="text-muted-foreground ml-1">entered</span>
              </div>
              <div>
                <span className="font-medium">{workflow.stats.active}</span>
                <span className="text-muted-foreground ml-1">active</span>
              </div>
            </div>
            <div className="text-sm">
              <span className="font-medium text-green-600">{workflow.stats.conversionRate}%</span>
              <span className="text-muted-foreground ml-1">completion rate</span>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "lastModified",
      header: "Last Modified",
      cell: ({ row }: any) => {
        const workflow = row.original
        return (
          <div className="text-sm text-muted-foreground">{new Date(workflow.lastModified).toLocaleDateString()}</div>
        )
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: any) => {
        const workflow = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleWorkflowAction("view", workflow)}>
                <Eye className="w-4 h-4 mr-2" />
                View Analytics
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleWorkflowAction("edit", workflow)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Workflow
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleWorkflowAction("duplicate", workflow)}>
                <Copy className="w-4 h-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              {workflow.status === "active" && (
                <DropdownMenuItem onClick={() => handleWorkflowAction("pause", workflow)}>
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </DropdownMenuItem>
              )}
              {workflow.status === "paused" && (
                <DropdownMenuItem onClick={() => handleWorkflowAction("activate", workflow)}>
                  <Play className="w-4 h-4 mr-2" />
                  Activate
                </DropdownMenuItem>
              )}
              <DropdownMenuItem className="text-red-600" onClick={() => handleWorkflowAction("delete", workflow)}>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const handleWorkflowAction = async (action: string, workflow: AutomationWorkflow) => {
    setIsLoading(true)
    console.log(`[v0] Workflow action: ${action}`, workflow)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    switch (action) {
      case "view":
        setSelectedWorkflow(workflow)
        break
      case "edit":
        setSelectedWorkflow(workflow)
        setIsBuilderOpen(true)
        break
      case "duplicate":
        toast({
          title: "Workflow Duplicated",
          description: `${workflow.name} has been duplicated successfully.`,
        })
        break
      case "pause":
        toast({
          title: "Workflow Paused",
          description: `${workflow.name} has been paused.`,
        })
        break
      case "activate":
        toast({
          title: "Workflow Activated",
          description: `${workflow.name} is now active.`,
        })
        break
      case "delete":
        toast({
          title: "Workflow Deleted",
          description: `${workflow.name} has been deleted.`,
        })
        break
    }

    setIsLoading(false)
  }

  const handleCreateWorkflow = async () => {
    setIsLoading(true)
    console.log("[v0] Creating workflow:", newWorkflow)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsCreateDialogOpen(false)
    setNewWorkflow({
      name: "",
      description: "",
      triggerType: "",
      triggerConditions: {},
      steps: [],
    })

    toast({
      title: "Workflow Created",
      description: "Your automation workflow has been created successfully.",
    })

    setIsLoading(false)
  }

  const getTriggerLabel = (type: string) => {
    const trigger = triggerTypes.find((t) => t.value === type)
    return trigger ? trigger.label : type
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500/10 text-green-500">Active</Badge>
      case "paused":
        return <Badge className="bg-yellow-500/10 text-yellow-500">Paused</Badge>
      case "draft":
        return <Badge variant="outline">Draft</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const filteredWorkflows = automationWorkflows.filter(
    (workflow) =>
      workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workflow.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="h-6 w-6" />
          <div>
            <h1 className="text-3xl font-bold">Automation</h1>
            <p className="text-muted-foreground">Create automated email workflows and sequences</p>
          </div>
        </div>

        {/* Create Workflow Modal */}
        <EnhancedModal
          isOpen={isCreateDialogOpen}
          onClose={() => setIsCreateDialogOpen(false)}
          title="Create Automation Workflow"
          description="Set up an automated email sequence based on triggers and conditions"
          size="lg"
          isLoading={isLoading}
          loadingText="Creating workflow..."
        >
          <Tabs defaultValue="trigger" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="trigger">Trigger</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="steps">Steps</TabsTrigger>
            </TabsList>

            <TabsContent value="trigger" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Choose a Trigger</Label>
                  <p className="text-sm text-muted-foreground">Select what will start this automation</p>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {triggerTypes.map((trigger) => {
                    const Icon = trigger.icon
                    return (
                      <Card
                        key={trigger.value}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          newWorkflow.triggerType === trigger.value ? "ring-2 ring-primary" : ""
                        }`}
                        onClick={() => setNewWorkflow({ ...newWorkflow, triggerType: trigger.value })}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <Icon className="h-5 w-5 text-primary" />
                            <div>
                              <h4 className="font-medium">{trigger.label}</h4>
                              <p className="text-sm text-muted-foreground">{trigger.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="details" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="workflowName">Workflow Name</Label>
                  <Input
                    id="workflowName"
                    placeholder="Welcome Series"
                    value={newWorkflow.name}
                    onChange={(e) => setNewWorkflow({ ...newWorkflow, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="workflowDescription">Description</Label>
                  <Textarea
                    id="workflowDescription"
                    placeholder="5-email onboarding sequence for new subscribers"
                    value={newWorkflow.description}
                    onChange={(e) => setNewWorkflow({ ...newWorkflow, description: e.target.value })}
                    rows={3}
                  />
                </div>

                {newWorkflow.triggerType && (
                  <div className="space-y-2">
                    <Label>Trigger Conditions</Label>
                    <Card>
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          {newWorkflow.triggerType === "signup" && (
                            <div className="space-y-2">
                              <Label>Email List</Label>
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select list" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="newsletter">Newsletter Subscribers</SelectItem>
                                  <SelectItem value="product">Product Updates</SelectItem>
                                  <SelectItem value="vip">VIP Customers</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          )}

                          {newWorkflow.triggerType === "time_based" && (
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>After</Label>
                                <Input type="number" placeholder="30" />
                              </div>
                              <div className="space-y-2">
                                <Label>Time Unit</Label>
                                <Select>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select unit" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="minutes">Minutes</SelectItem>
                                    <SelectItem value="hours">Hours</SelectItem>
                                    <SelectItem value="days">Days</SelectItem>
                                    <SelectItem value="weeks">Weeks</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="steps" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Workflow Steps</Label>
                  <p className="text-sm text-muted-foreground">Add steps to your automation workflow</p>
                </div>

                <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
                  <Workflow className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium mb-2">Visual Workflow Builder</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    After creating the workflow, you'll be able to add and configure steps using our visual builder.
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {stepTypes.map((step) => {
                      const Icon = step.icon
                      return (
                        <Badge key={step.value} variant="outline" className="flex items-center gap-1">
                          <Icon className="h-3 w-3" />
                          {step.label}
                        </Badge>
                      )
                    })}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end space-x-2 mt-6">
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateWorkflow}
              disabled={isLoading || !newWorkflow.name || !newWorkflow.triggerType}
            >
              Create Workflow
            </Button>
          </div>
        </EnhancedModal>

        {/* Workflow Builder Modal */}
        <EnhancedModal
          isOpen={isBuilderOpen}
          onClose={() => setIsBuilderOpen(false)}
          title={selectedWorkflow ? `Edit: ${selectedWorkflow.name}` : "Workflow Builder"}
          description="Design your automation workflow with our visual builder"
          size="full"
        >
          <div className="h-[600px] border rounded-lg bg-muted/20 flex items-center justify-center">
            <div className="text-center space-y-4">
              <Workflow className="h-16 w-16 text-muted-foreground mx-auto" />
              <div>
                <h3 className="text-lg font-medium">Visual Workflow Builder</h3>
                <p className="text-muted-foreground">
                  Drag and drop interface for creating complex automation workflows
                </p>
              </div>
              <div className="flex justify-center space-x-2">
                <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Step
                </Button>
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Configure
                </Button>
              </div>
            </div>
          </div>
        </EnhancedModal>

        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Workflow
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Workflows</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+2</span> this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">People in Workflows</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3,247</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+15%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emails Sent</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28.4K</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+22%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Completion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68.2%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+3.1%</span> from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Start Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Start Templates</CardTitle>
          <CardDescription>Get started quickly with pre-built automation workflows</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="cursor-pointer hover:shadow-md transition-all">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <UserPlus className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <h4 className="font-medium">Welcome Series</h4>
                    <p className="text-sm text-muted-foreground">5-email onboarding</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Most popular</span>
                  <Button size="sm" variant="outline">
                    Use Template
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-all">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-orange-500/10 rounded-lg">
                    <ShoppingCart className="h-5 w-5 text-orange-500" />
                  </div>
                  <div>
                    <h4 className="font-medium">Cart Recovery</h4>
                    <p className="text-sm text-muted-foreground">3-email sequence</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">High converting</span>
                  <Button size="sm" variant="outline">
                    Use Template
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-all">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <RotateCcw className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <h4 className="font-medium">Re-engagement</h4>
                    <p className="text-sm text-muted-foreground">Win back inactive users</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Proven results</span>
                  <Button size="sm" variant="outline">
                    Use Template
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search workflows..."
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

      {/* Workflows Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Workflows</CardTitle>
          <CardDescription>Manage your automation workflows and track their performance</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={workflowColumns}
            data={filteredWorkflows}
            searchPlaceholder="Search workflows..."
            onRowAction={handleWorkflowAction}
          />
        </CardContent>
      </Card>
    </div>
  )
}
