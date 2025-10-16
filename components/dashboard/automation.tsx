"use client"

import { useEffect, useState } from "react"
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
  Calendar,
  CheckCircle2,
  XCircle,
} from "lucide-react"
import { useAutomationStore } from "@/store/automationStore"

interface AutomationWorkflow {
  id: string
  name: string
  description?: string
  trigger: string
  conditions: any
  actions: any[]
  isActive: boolean
  createdAt: string
  updatedAt: string
  stats?: {
    totalExecutions: number
    successRate: number
    emailsSent: number
  }
}

interface WorkflowStep {
  id: string
  type: "email" | "delay" | "condition" | "action" | "split_test"
  config: any
  position: { x: number; y: number }
  connections: string[]
}

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

const emailLists = [
  { value: "newsletter", label: "Newsletter Subscribers" },
  { value: "product", label: "Product Updates" },
  { value: "vip", label: "VIP Customers" },
  { value: "leads", label: "Lead Magnet Subscribers" },
]

const timeUnits = [
  { value: "minutes", label: "Minutes" },
  { value: "hours", label: "Hours" },
  { value: "days", label: "Days" },
  { value: "weeks", label: "Weeks" },
]

export default function Automation() {
  const { toast } = useToast()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isBuilderOpen, setIsBuilderOpen] = useState(false)
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTrigger, setSelectedTrigger] = useState<any>(null)

  const [newWorkflow, setNewWorkflow] = useState({
    name: "",
    description: "",
    triggerType: "",
    triggerConditions: {
      listId: "",
      timeValue: 1,
      timeUnit: "days",
      tag: "",
    },
    actions: [] as any[],
  })

  const {
    automations,
    currentAutomation,
    executions,
    isLoading,
    error,
    fetchAutomations,
    createAutomation,
    updateAutomation,
    deleteAutomation,
    getAutomation,
    toggleAutomation,
    scheduleAutomation,
    setCurrentAutomation,
    clearError
  } = useAutomationStore();

  useEffect(() => {
    fetchAutomations();
  }, [fetchAutomations]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
      clearError();
    }
  }, [error, toast, clearError]);

  const handleCreateWorkflow = async () => {
    try {
      const automationData = {
        name: newWorkflow.name,
        description: newWorkflow.description,
        trigger: newWorkflow.triggerType,
        conditions: newWorkflow.triggerConditions,
        actions: newWorkflow.actions,
        isActive: false,
      };

      await createAutomation(automationData);
      
      setIsCreateDialogOpen(false);
      setNewWorkflow({
        name: "",
        description: "",
        triggerType: "",
        triggerConditions: {
          listId: "",
          timeValue: 1,
          timeUnit: "days",
          tag: "",
        },
        actions: [],
      });

      toast({
        title: "Workflow Created",
        description: "Your automation workflow has been created successfully.",
      });
    } catch (error) {
      // Error is handled by the useEffect above
    }
  };

  const handleWorkflowAction = async (action: string, workflow: AutomationWorkflow) => {
    try {
      switch (action) {
        case "view":
          await getAutomation(workflow.id);
          setIsAnalyticsOpen(true);
          break;
        case "edit":
          await getAutomation(workflow.id);
          setIsBuilderOpen(true);
          break;
        case "duplicate":
          const duplicateData = {
            name: `${workflow.name} (Copy)`,
            description: workflow.description,
            trigger: workflow.trigger,
            conditions: workflow.conditions,
            actions: workflow.actions,
            isActive: false,
          };
          await createAutomation(duplicateData);
          toast({
            title: "Workflow Duplicated",
            description: `${workflow.name} has been duplicated successfully.`,
          });
          break;
        case "toggle":
          await toggleAutomation(workflow.id);
          toast({
            title: workflow.isActive ? "Workflow Paused" : "Workflow Activated",
            description: `${workflow.name} has been ${workflow.isActive ? 'paused' : 'activated'}.`,
          });
          break;
        case "delete":
          if (confirm(`Are you sure you want to delete "${workflow.name}"? This action cannot be undone.`)) {
            await deleteAutomation(workflow.id);
            toast({
              title: "Workflow Deleted",
              description: `${workflow.name} has been deleted.`,
            });
          }
          break;
      }
    } catch (error) {
      // Error is handled by the useEffect above
    }
  };

  const handleTriggerSelect = (triggerValue: string) => {
    setNewWorkflow({ ...newWorkflow, triggerType: triggerValue });
    setSelectedTrigger(triggerTypes.find(t => t.value === triggerValue));
  };

  const getTriggerLabel = (type: string) => {
    const trigger = triggerTypes.find((t) => t.value === type)
    return trigger ? trigger.label : type
  }

  const getStatusBadge = (isActive: boolean) => {
    return isActive 
      ? <Badge className="bg-green-500/10 text-green-500 border-green-200">Active</Badge>
      : <Badge variant="outline" className="text-muted-foreground">Paused</Badge>
  }

  const getExecutionStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <Badge className="bg-green-500/10 text-green-500 border-green-200">Completed</Badge>
      case 'RUNNING':
        return <Badge className="bg-blue-500/10 text-blue-500 border-blue-200">Running</Badge>
      case 'PENDING':
        return <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-200">Pending</Badge>
      case 'FAILED':
        return <Badge className="bg-red-500/10 text-red-500 border-red-200">Failed</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }
  console.log(automations , "==============automations==========")
  const filteredWorkflows = (automations as any)?.automations?.filter?.(
    (workflow:any) =>
      workflow?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (workflow?.description && workflow.description.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || []


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
              <span className="font-medium">{workflow?.name || 'Unnamed Workflow'}</span>
            </div>
            {workflow?.description && (
              <p className="text-sm text-muted-foreground">{workflow.description}</p>
            )}
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <span>{getTriggerLabel(workflow?.trigger)}</span>
              <span>•</span>
              <span>{(workflow?.actions?.length || 0)} steps</span>
              <span>•</span>
              <span>Created {workflow?.createdAt ? new Date(workflow.createdAt).toLocaleDateString() : 'Unknown date'}</span>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }: any) => {
        const workflow = row.original
        return getStatusBadge(workflow.isActive)
      },
    },
    {
      accessorKey: "stats",
      header: "Performance",
      cell: ({ row }: any) => {
        const workflow = row.original
        const stats = workflow.stats || { totalExecutions: 0, successRate: 0, emailsSent: 0 }
        
        return (
          <div className="space-y-1 text-sm">
            <div className="flex items-center space-x-2">
              <span className="text-muted-foreground">Success:</span>
              <span className="font-medium">{stats?.successRate}%</span>
            </div>
            <div className="text-xs text-muted-foreground">
              {stats?.emailsSent?.toLocaleString()} emails sent
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "updatedAt",
      header: "Last Modified",
      cell: ({ row }: any) => {
        const workflow = row.original
        return (
          <div className="space-y-1">
            <div className="text-sm font-medium">
              {new Date(workflow.updatedAt).toLocaleDateString()}
            </div>
            <div className="text-xs text-muted-foreground">
              {new Date(workflow.updatedAt).toLocaleTimeString()}
            </div>
          </div>
        )
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: any) => {
        const workflow = row.original
        return (
          <div className="flex items-center space-x-2">
            <Button
              variant={workflow.isActive ? "outline" : "default"}
              size="sm"
              onClick={() => handleWorkflowAction("toggle", workflow)}
              disabled={isLoading}
            >
              {workflow.isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
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
                <DropdownMenuItem 
                  className="text-red-600" 
                  onClick={() => handleWorkflowAction("delete", workflow)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    },
  ]

  const executionColumns = [
    {
      accessorKey: "id",
      header: "Execution ID",
      cell: ({ row }: any) => {
        const execution = row.original
        return (
          <code className="text-xs bg-muted px-2 py-1 rounded">
            {execution.id.slice(0, 8)}...
          </code>
        )
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: any) => {
        const execution = row.original
        return getExecutionStatusBadge(execution.status)
      },
    },
    {
      accessorKey: "startedAt",
      header: "Started",
      cell: ({ row }: any) => {
        const execution = row.original
        return execution.startedAt 
          ? new Date(execution.startedAt).toLocaleString()
          : "N/A"
      },
    },
    {
      accessorKey: "completedAt",
      header: "Completed",
      cell: ({ row }: any) => {
        const execution = row.original
        return execution.completedAt 
          ? new Date(execution.completedAt).toLocaleString()
          : "N/A"
      },
    },
  ]

  // Calculate real stats from executions
  const calculateStats = (workflow: AutomationWorkflow) => {
    const workflowExecutions = executions?.filter(exec => exec.automationId === workflow.id)
    const totalExecutions = workflowExecutions.length
    const completedExecutions = workflowExecutions?.filter(exec => exec.status === 'COMPLETED').length
    const successRate = totalExecutions > 0 ? Math.round((completedExecutions / totalExecutions) * 100) : 0
    const emailsSent = workflowExecutions?.reduce((total, exec) => total + (exec.result?.emailsSent || 0), 0)

    return { totalExecutions, successRate, emailsSent }
  }

  const totalStats = {
    activeWorkflows: (automations as any)?.automations?.filter?.((a: { isActive: any }) => a?.isActive)?.length || 0,
    totalWorkflows: automations?.length || 0,
    totalEmailsSent: (automations as any)?.automations?.reduce?.((total:any, workflow:any) => total + (workflow?.stats?.emailsSent || 0), 0) || 0,
    avgSuccessRate: (automations as any)?.automations?.length > 0 
      ? Math.round((automations as any)?.automations?.reduce?.((total:any, workflow:any) => total + (workflow?.stats?.successRate || 0), 0) / (automations as any)?.automations?.length)
      : 0,
  }

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

        <Button onClick={() => setIsCreateDialogOpen(true)} disabled={isLoading}>
          <Plus className="w-4 h-4 mr-2" />
          Create Workflow
        </Button>
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
        scrollable={true}
      >
        <Tabs defaultValue="trigger" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="trigger">Trigger</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="review">Review</TabsTrigger>
          </TabsList>

          <TabsContent value="trigger" className="space-y-4">
            <div className="space-y-4 max-h-[600px] ">
              <div className="space-y-2">
                <Label>Choose a Trigger</Label>
                <p className="text-sm text-muted-foreground">Select what will start this automation</p>
              </div>

              <div className="grid grid-cols-1 gap-3 max-h-[200px] overflow-y-auto pr-2 ">
          {triggerTypes.map((trigger) => {
            const Icon = trigger.icon
            return (
              <Card
                key={trigger.value}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  newWorkflow.triggerType === trigger.value ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => handleTriggerSelect(trigger.value)}
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
                        {(newWorkflow.triggerType === "signup" || newWorkflow.triggerType === "list_join") && (
                          <div className="space-y-2">
                            <Label>Email List</Label>
                            <Select
                              value={newWorkflow.triggerConditions.listId}
                              onValueChange={(value) => setNewWorkflow({
                                ...newWorkflow,
                                triggerConditions: { ...newWorkflow.triggerConditions, listId: value }
                              })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select list" />
                              </SelectTrigger>
                              <SelectContent>
                                {emailLists.map(list => (
                                  <SelectItem key={list.value} value={list.value}>
                                    {list.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}

                        {newWorkflow.triggerType === "time_based" && (
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>After</Label>
                              <Input 
                                type="number" 
                                placeholder="30" 
                                value={newWorkflow.triggerConditions.timeValue}
                                onChange={(e) => setNewWorkflow({
                                  ...newWorkflow,
                                  triggerConditions: { 
                                    ...newWorkflow.triggerConditions, 
                                    timeValue: parseInt(e.target.value) || 1 
                                  }
                                })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Time Unit</Label>
                              <Select
                                value={newWorkflow.triggerConditions.timeUnit}
                                onValueChange={(value) => setNewWorkflow({
                                  ...newWorkflow,
                                  triggerConditions: { ...newWorkflow.triggerConditions, timeUnit: value }
                                })}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select unit" />
                                </SelectTrigger>
                                <SelectContent>
                                  {timeUnits.map(unit => (
                                    <SelectItem key={unit.value} value={unit.value}>
                                      {unit.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        )}

                        {newWorkflow.triggerType === "tag_added" && (
                          <div className="space-y-2">
                            <Label>Tag Name</Label>
                            <Input
                              placeholder="vip-customer"
                              value={newWorkflow.triggerConditions.tag}
                              onChange={(e) => setNewWorkflow({
                                ...newWorkflow,
                                triggerConditions: { ...newWorkflow.triggerConditions, tag: e.target.value }
                              })}
                            />
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="review" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Workflow Summary</Label>
                <p className="text-sm text-muted-foreground">Review your workflow configuration before creating</p>
              </div>

              <Card>
                <CardContent className="p-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Name</Label>
                      <p className="text-sm">{newWorkflow.name || "Not set"}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Trigger</Label>
                      <p className="text-sm">{selectedTrigger?.label || "Not selected"}</p>
                    </div>
                    <div className="col-span-2">
                      <Label className="text-sm font-medium">Description</Label>
                      <p className="text-sm">{newWorkflow.description || "No description"}</p>
                    </div>
                  </div>

                  {newWorkflow.triggerType && (
                    <div className="border-t pt-4">
                      <Label className="text-sm font-medium">Trigger Conditions</Label>
                      <div className="mt-2 text-sm text-muted-foreground">
                        {newWorkflow.triggerType === "time_based" && (
                          <p>Wait {newWorkflow.triggerConditions.timeValue} {newWorkflow.triggerConditions.timeUnit} after trigger</p>
                        )}
                        {newWorkflow.triggerType === "signup" && newWorkflow.triggerConditions.listId && (
                          <p>When user joins {emailLists.find(l => l.value === newWorkflow.triggerConditions.listId)?.label}</p>
                        )}
                        {newWorkflow.triggerType === "tag_added" && newWorkflow.triggerConditions.tag && (
                          <p>When tag "{newWorkflow.triggerConditions.tag}" is added</p>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
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

      {/* Analytics Modal */}
      <EnhancedModal
        isOpen={isAnalyticsOpen}
        onClose={() => setIsAnalyticsOpen(false)}
        title={currentAutomation ? `${currentAutomation.name} Analytics` : "Workflow Analytics"}
        description="Detailed performance metrics and execution history"
        size="lg"
      >
        {currentAutomation && (
          <div className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Status</p>
                      <p className="text-2xl font-bold mt-1">
                        {getStatusBadge(currentAutomation.isActive)}
                      </p>
                    </div>
                    <Activity className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                      <p className="text-2xl font-bold mt-1">
                        {calculateStats(currentAutomation).successRate}%
                      </p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Emails Sent</p>
                      <p className="text-2xl font-bold mt-1">
                        {calculateStats(currentAutomation).emailsSent.toLocaleString()}
                      </p>
                    </div>
                    <Send className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Runs</p>
                      <p className="text-2xl font-bold mt-1">
                        {calculateStats(currentAutomation).totalExecutions}
                      </p>
                    </div>
                    <Play className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Execution History */}
            <Card>
              <CardHeader>
                <CardTitle>Execution History</CardTitle>
                <CardDescription>Recent runs of this automation workflow</CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={executionColumns}
                  data={executions?.filter(exec => exec.automationId === currentAutomation.id)}
                  // emptyMessage="No executions found for this workflow"
                />
              </CardContent>
            </Card>
          </div>
        )}
      </EnhancedModal>

      {/* Workflow Builder Modal */}
      <EnhancedModal
        isOpen={isBuilderOpen}
        onClose={() => setIsBuilderOpen(false)}
        title={currentAutomation ? `Edit: ${currentAutomation.name}` : "Workflow Builder"}
        description="Design your automation workflow with our visual builder"
        size="full"
      >
        <div className="h-[600px] border rounded-lg bg-muted/20 relative">
          {currentAutomation ? (
            <div className="p-6 h-full">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-semibold">{currentAutomation.name}</h3>
                  <p className="text-muted-foreground">{currentAutomation.description}</p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={() => setIsBuilderOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={async () => {
                    try {
                      await updateAutomation(currentAutomation.id, currentAutomation);
                      setIsBuilderOpen(false);
                      toast({
                        title: "Workflow Updated",
                        description: "Your automation workflow has been updated successfully.",
                      });
                    } catch (error) {
                      // Error handled by store
                    }
                  }}>
                    Save Changes
                  </Button>
                </div>
              </div>
              
              {/* Visual Builder Content */}
              <div className="border rounded-lg bg-background p-6 h-[calc(100%-80px)]">
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
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center space-y-4">
                <Workflow className="h-16 w-16 text-muted-foreground mx-auto" />
                <div>
                  <h3 className="text-lg font-medium">No Workflow Selected</h3>
                  <p className="text-muted-foreground">
                    Please select a workflow to edit
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </EnhancedModal>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Workflows</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStats.activeWorkflows}</div>
            <p className="text-xs text-muted-foreground">
              {totalStats.activeWorkflows > 0 ? "Running smoothly" : "No active workflows"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Workflows</CardTitle>
            <Workflow className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStats.totalWorkflows}</div>
            <p className="text-xs text-muted-foreground">
              {totalStats.totalWorkflows > 0 ? `${Math.round((totalStats.activeWorkflows / totalStats.totalWorkflows) * 100)}% active` : "Create your first workflow"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emails Sent</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStats.totalEmailsSent.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Across all workflows
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStats.avgSuccessRate}%</div>
            <p className="text-xs text-muted-foreground">
              Overall performance
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
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
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
        <div className="text-sm text-muted-foreground">
          {filteredWorkflows.length} of {automations.length} workflows
        </div>
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
            data={filteredWorkflows.map((workflow: AutomationWorkflow) => ({
              ...workflow,
              stats: calculateStats(workflow)
            }))}
            searchPlaceholder="Search workflows..."
            // emptyMessage="No workflows found. Create your first automation workflow to get started."
            // isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  )
}