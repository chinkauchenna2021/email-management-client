"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { EnhancedModal } from "@/components/ui/enhanced-modal"
import { useModal, useProgress } from "@/components/ui/modal-manager"
import {
  Activity,
  TrendingUp,
  TrendingDown,
  Mail,
  Send,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Eye,
  Download,
  RefreshCw,
  MoreHorizontal,
  Search,
  Play,
  Pause,
  Stamp as Stop,
  BarChart3,
  Upload,
  FileText,
  Zap,
  Target,
  Shield,
} from "lucide-react"

interface EmailJob {
  id: string
  name: string
  type: "campaign" | "validation" | "import" | "export"
  status: "pending" | "running" | "paused" | "completed" | "failed" | "cancelled"
  progress: number
  totalEmails: number
  processed: number
  successful: number
  failed: number
  bounced: number
  opened: number
  clicked: number
  unsubscribed: number
  startedAt: string
  completedAt?: string
  estimatedCompletion?: string
  throughput: number
  errorRate: number
  settings: any
}

interface EmailMetrics {
  totalSent: number
  delivered: number
  bounced: number
  opened: number
  clicked: number
  unsubscribed: number
  complained: number
  deliveryRate: number
  openRate: number
  clickRate: number
  bounceRate: number
  unsubscribeRate: number
  complaintRate: number
}

const mockJobs: EmailJob[] = [
  {
    id: "1",
    name: "Newsletter Campaign #47",
    type: "campaign",
    status: "running",
    progress: 65,
    totalEmails: 15420,
    processed: 10023,
    successful: 9876,
    failed: 147,
    bounced: 234,
    opened: 4567,
    clicked: 1234,
    unsubscribed: 23,
    startedAt: "2024-03-20T10:30:00Z",
    estimatedCompletion: "2024-03-20T11:45:00Z",
    throughput: 125,
    errorRate: 1.5,
    settings: { throttle: 100, retries: 3 },
  },
  {
    id: "2",
    name: "Product Launch Validation",
    type: "validation",
    status: "completed",
    progress: 100,
    totalEmails: 8234,
    processed: 8234,
    successful: 8100,
    failed: 134,
    bounced: 0,
    opened: 0,
    clicked: 0,
    unsubscribed: 0,
    startedAt: "2024-03-20T09:15:00Z",
    completedAt: "2024-03-20T09:45:00Z",
    throughput: 275,
    errorRate: 1.6,
    settings: { timeout: 30, concurrent: 10 },
  },
  {
    id: "3",
    name: "Customer List Import",
    type: "import",
    status: "paused",
    progress: 45,
    totalEmails: 25000,
    processed: 11250,
    successful: 10980,
    failed: 270,
    bounced: 0,
    opened: 0,
    clicked: 0,
    unsubscribed: 0,
    startedAt: "2024-03-20T08:00:00Z",
    throughput: 200,
    errorRate: 2.4,
    settings: { batchSize: 500, validateOnImport: true },
  },
]

const mockMetrics: EmailMetrics = {
  totalSent: 125430,
  delivered: 119876,
  bounced: 5554,
  opened: 48765,
  clicked: 12543,
  unsubscribed: 876,
  complained: 234,
  deliveryRate: 95.6,
  openRate: 40.7,
  clickRate: 10.5,
  bounceRate: 4.4,
  unsubscribeRate: 0.7,
  complaintRate: 0.2,
}

export function EmailMonitoring() {
  const [jobs, setJobs] = useState<EmailJob[]>(mockJobs)
  const [selectedJob, setSelectedJob] = useState<EmailJob | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterType, setFilterType] = useState("all")
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [importSettings, setImportSettings] = useState({
    validateEmails: true,
    skipDuplicates: true,
    batchSize: 1000,
    throttleRate: 100,
  })

  const { openModal } = useModal()
  const createProgress = useProgress()

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "running":
        return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "failed":
        return <XCircle className="w-4 h-4 text-red-500" />
      case "paused":
        return <Pause className="w-4 h-4 text-orange-500" />
      case "pending":
        return <Clock className="w-4 h-4 text-gray-500" />
      case "cancelled":
        return <Stop className="w-4 h-4 text-gray-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "running":
        return <Badge className="bg-blue-500/10 text-blue-500">Running</Badge>
      case "completed":
        return <Badge className="bg-green-500/10 text-green-500">Completed</Badge>
      case "failed":
        return <Badge className="bg-red-500/10 text-red-500">Failed</Badge>
      case "paused":
        return <Badge className="bg-orange-500/10 text-orange-500">Paused</Badge>
      case "pending":
        return <Badge className="bg-gray-500/10 text-gray-500">Pending</Badge>
      case "cancelled":
        return <Badge variant="outline">Cancelled</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "campaign":
        return <Send className="w-4 h-4 text-purple-500" />
      case "validation":
        return <Shield className="w-4 h-4 text-blue-500" />
      case "import":
        return <Upload className="w-4 h-4 text-green-500" />
      case "export":
        return <Download className="w-4 h-4 text-orange-500" />
      default:
        return <Mail className="w-4 h-4 text-gray-500" />
    }
  }

  const handleCsvImport = async () => {
    if (!csvFile) return

    const progress = createProgress()
    const progressId = progress.start("Importing CSV File", "Preparing import...")

    try {
      // Simulate CSV processing
      progress.update(10, "Reading CSV file...")
      await new Promise((resolve) => setTimeout(resolve, 1000))

      progress.update(30, "Validating email addresses...")
      await new Promise((resolve) => setTimeout(resolve, 2000))

      progress.update(60, "Processing duplicates...")
      await new Promise((resolve) => setTimeout(resolve, 1500))

      progress.update(85, "Saving to database...")
      await new Promise((resolve) => setTimeout(resolve, 1000))

      progress.complete("Import completed successfully!")

      // Add new import job
      const newJob: EmailJob = {
        id: Date.now().toString(),
        name: `CSV Import - ${csvFile.name}`,
        type: "import",
        status: "completed",
        progress: 100,
        totalEmails: Math.floor(Math.random() * 10000) + 1000,
        processed: Math.floor(Math.random() * 10000) + 1000,
        successful: Math.floor(Math.random() * 9500) + 500,
        failed: Math.floor(Math.random() * 500),
        bounced: 0,
        opened: 0,
        clicked: 0,
        unsubscribed: 0,
        startedAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        throughput: 150,
        errorRate: 2.1,
        settings: importSettings,
      }

      setJobs((prev) => [newJob, ...prev])
      setIsImportModalOpen(false)
      setCsvFile(null)
    } catch (error) {
      progress.error("Import failed. Please try again.")
    }
  }

  const handleJobAction = (jobId: string, action: string) => {
    setJobs((prev) =>
      prev.map((job) => {
        if (job.id === jobId) {
          switch (action) {
            case "pause":
              return { ...job, status: "paused" as const }
            case "resume":
              return { ...job, status: "running" as const }
            case "cancel":
              return { ...job, status: "cancelled" as const }
            default:
              return job
          }
        }
        return job
      }),
    )
  }

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || job.status === filterStatus
    const matchesType = filterType === "all" || job.type === filterType
    return matchesSearch && matchesStatus && matchesType
  })

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setJobs((prev) =>
        prev.map((job) => {
          if (job.status === "running" && job.progress < 100) {
            const newProgress = Math.min(job.progress + Math.random() * 5, 100)
            const newProcessed = Math.floor((newProgress / 100) * job.totalEmails)
            return {
              ...job,
              progress: newProgress,
              processed: newProcessed,
              successful: Math.floor(newProcessed * 0.95),
              failed: Math.floor(newProcessed * 0.05),
              status: newProgress >= 100 ? ("completed" as const) : job.status,
              completedAt: newProgress >= 100 ? new Date().toISOString() : job.completedAt,
            }
          }
          return job
        }),
      )
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Email Monitoring</h1>
          <p className="text-muted-foreground">Real-time tracking and analytics for all email operations</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => setIsImportModalOpen(true)}>
            <Upload className="w-4 h-4 mr-2" />
            Import CSV
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Delivery Rate</p>
                <p className="text-2xl font-bold text-green-600">{mockMetrics.deliveryRate}%</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                  <span className="text-xs text-green-500">+2.3% from last week</span>
                </div>
              </div>
              <Target className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Open Rate</p>
                <p className="text-2xl font-bold text-blue-600">{mockMetrics.openRate}%</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 text-blue-500 mr-1" />
                  <span className="text-xs text-blue-500">+1.8% from last week</span>
                </div>
              </div>
              <Eye className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Click Rate</p>
                <p className="text-2xl font-bold text-purple-600">{mockMetrics.clickRate}%</p>
                <div className="flex items-center mt-1">
                  <TrendingDown className="w-3 h-3 text-red-500 mr-1" />
                  <span className="text-xs text-red-500">-0.5% from last week</span>
                </div>
              </div>
              <Zap className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Bounce Rate</p>
                <p className="text-2xl font-bold text-orange-600">{mockMetrics.bounceRate}%</p>
                <div className="flex items-center mt-1">
                  <TrendingDown className="w-3 h-3 text-green-500 mr-1" />
                  <span className="text-xs text-green-500">-0.8% from last week</span>
                </div>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Jobs */}
      <Card>
        <CardHeader>
          <CardTitle>Active Email Jobs</CardTitle>
          <CardDescription>Monitor real-time progress of email campaigns, validations, and imports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search jobs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="running">Running</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="campaign">Campaign</SelectItem>
                  <SelectItem value="validation">Validation</SelectItem>
                  <SelectItem value="import">Import</SelectItem>
                  <SelectItem value="export">Export</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Throughput</TableHead>
                  <TableHead>Error Rate</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredJobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell className="font-medium">{job.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getTypeIcon(job.type)}
                        <span className="capitalize">{job.type}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(job.status)}
                        {getStatusBadge(job.status)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span>{job.processed.toLocaleString()}</span>
                          <span className="text-muted-foreground">/ {job.totalEmails.toLocaleString()}</span>
                        </div>
                        <Progress value={job.progress} className="h-2" />
                        <div className="text-xs text-muted-foreground">{Math.round(job.progress)}% complete</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">{job.throughput}/min</div>
                        {job.estimatedCompletion && job.status === "running" && (
                          <div className="text-muted-foreground text-xs">
                            ETA: {new Date(job.estimatedCompletion).toLocaleTimeString()}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            job.errorRate < 2 ? "bg-green-500" : job.errorRate < 5 ? "bg-yellow-500" : "bg-red-500"
                          }`}
                        />
                        <span className="text-sm">{job.errorRate}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setSelectedJob(job)}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          {job.status === "running" && (
                            <DropdownMenuItem onClick={() => handleJobAction(job.id, "pause")}>
                              <Pause className="w-4 h-4 mr-2" />
                              Pause
                            </DropdownMenuItem>
                          )}
                          {job.status === "paused" && (
                            <DropdownMenuItem onClick={() => handleJobAction(job.id, "resume")}>
                              <Play className="w-4 h-4 mr-2" />
                              Resume
                            </DropdownMenuItem>
                          )}
                          {(job.status === "running" || job.status === "paused") && (
                            <DropdownMenuItem onClick={() => handleJobAction(job.id, "cancel")}>
                              <Stop className="w-4 h-4 mr-2" />
                              Cancel
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem>
                            <Download className="w-4 h-4 mr-2" />
                            Export Results
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Job Details Modal */}
      {selectedJob && (
        <EnhancedModal
          isOpen={!!selectedJob}
          onClose={() => setSelectedJob(null)}
          title={`Job Details - ${selectedJob.name}`}
          size="xl"
          scrollable
        >
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="metrics">Metrics</TabsTrigger>
              <TabsTrigger value="logs">Logs</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Status</span>
                        {getStatusBadge(selectedJob.status)}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Progress</span>
                        <span className="font-medium">{Math.round(selectedJob.progress)}%</span>
                      </div>
                      <Progress value={selectedJob.progress} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Throughput</span>
                        <span className="font-medium">{selectedJob.throughput}/min</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Error Rate</span>
                        <span className="font-medium">{selectedJob.errorRate}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Started</span>
                        <span className="font-medium">{new Date(selectedJob.startedAt).toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{selectedJob.processed.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Processed</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{selectedJob.successful.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Successful</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-red-600">{selectedJob.failed.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Failed</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-orange-600">{selectedJob.bounced.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Bounced</div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="metrics" className="space-y-4">
              <div className="text-center py-8">
                <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Detailed metrics and analytics coming soon</p>
              </div>
            </TabsContent>

            <TabsContent value="logs" className="space-y-4">
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Real-time logs and debugging information coming soon</p>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <div className="space-y-4">
                <h4 className="font-medium">Job Configuration</h4>
                <div className="bg-muted/50 rounded-lg p-4">
                  <pre className="text-sm">{JSON.stringify(selectedJob.settings, null, 2)}</pre>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </EnhancedModal>
      )}

      {/* CSV Import Modal */}
      <EnhancedModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        title="Import CSV File"
        description="Upload and configure CSV import settings"
        size="lg"
      >
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>CSV File</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                {csvFile ? (
                  <div className="space-y-2">
                    <FileText className="w-8 h-8 text-green-500 mx-auto" />
                    <p className="text-sm font-medium">{csvFile.name}</p>
                    <p className="text-xs text-muted-foreground">{(csvFile.size / 1024).toFixed(1)} KB</p>
                    <Button variant="outline" size="sm" onClick={() => setCsvFile(null)}>
                      Remove File
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="w-8 h-8 text-muted-foreground mx-auto" />
                    <p className="text-sm text-muted-foreground">
                      Drag and drop your CSV file here, or click to browse
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const input = document.createElement("input")
                        input.type = "file"
                        input.accept = ".csv"
                        input.onchange = (e) => {
                          const file = (e.target as HTMLInputElement).files?.[0]
                          if (file) setCsvFile(file)
                        }
                        input.click()
                      }}
                    >
                      Choose File
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Batch Size</Label>
                <Input
                  type="number"
                  value={importSettings.batchSize}
                  onChange={(e) =>
                    setImportSettings((prev) => ({ ...prev, batchSize: Number.parseInt(e.target.value) }))
                  }
                  min="100"
                  max="5000"
                />
              </div>
              <div className="space-y-2">
                <Label>Throttle Rate (per minute)</Label>
                <Input
                  type="number"
                  value={importSettings.throttleRate}
                  onChange={(e) =>
                    setImportSettings((prev) => ({ ...prev, throttleRate: Number.parseInt(e.target.value) }))
                  }
                  min="10"
                  max="1000"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Validate Emails</Label>
                  <p className="text-sm text-muted-foreground">Run validation checks during import</p>
                </div>
                <input
                  type="checkbox"
                  checked={importSettings.validateEmails}
                  onChange={(e) => setImportSettings((prev) => ({ ...prev, validateEmails: e.target.checked }))}
                  className="rounded"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Skip Duplicates</Label>
                  <p className="text-sm text-muted-foreground">Automatically skip duplicate email addresses</p>
                </div>
                <input
                  type="checkbox"
                  checked={importSettings.skipDuplicates}
                  onChange={(e) => setImportSettings((prev) => ({ ...prev, skipDuplicates: e.target.checked }))}
                  className="rounded"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsImportModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCsvImport} disabled={!csvFile}>
              Start Import
            </Button>
          </div>
        </div>
      </EnhancedModal>

      {/* Real-time Status Alert */}
      <Alert>
        <Activity className="h-4 w-4" />
        <AlertDescription>
          Real-time monitoring is active. Job statuses and metrics update automatically every 2 seconds.
        </AlertDescription>
      </Alert>
    </div>
  )
}
