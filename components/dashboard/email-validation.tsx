"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Shield,
  Download,
  RefreshCw,
  Settings,
  MoreHorizontal,
  Search,
  Play,
  Pause,
  Trash2,
  Eye,
  BarChart3,
  Globe,
  Mail,
  Server,
  TestTube,
} from "lucide-react"

interface ValidationResult {
  email: string
  status: "valid" | "invalid" | "risky" | "pending" | "unknown"
  checks: {
    syntax: boolean
    domain: boolean
    mx: boolean
    smtp: boolean
    disposable: boolean
    role: boolean
    gibberish: boolean
  }
  score: number
  reason?: string
  provider?: string
  suggestions?: string[]
}

const validationJobs = [
  {
    id: "1",
    name: "Newsletter Validation",
    status: "completed",
    totalEmails: 15420,
    processed: 15420,
    valid: 14876,
    invalid: 544,
    risky: 0,
    startedAt: "2024-03-20T10:30:00Z",
    completedAt: "2024-03-20T10:45:00Z",
    settings: {
      syntaxCheck: true,
      domainCheck: true,
      mxCheck: true,
      smtpCheck: true,
      disposableCheck: true,
      roleCheck: true,
      gibberishCheck: true,
      timeout: 30,
    },
  },
  {
    id: "2",
    name: "Product Launch List",
    status: "running",
    totalEmails: 8234,
    processed: 6180,
    valid: 5950,
    invalid: 230,
    risky: 0,
    startedAt: "2024-03-20T14:15:00Z",
    completedAt: null,
    settings: {
      syntaxCheck: true,
      domainCheck: true,
      mxCheck: true,
      smtpCheck: false,
      disposableCheck: true,
      roleCheck: true,
      gibberishCheck: true,
      timeout: 15,
    },
  },
  {
    id: "3",
    name: "VIP Customer Validation",
    status: "paused",
    totalEmails: 1876,
    processed: 450,
    valid: 440,
    invalid: 10,
    risky: 0,
    startedAt: "2024-03-20T09:00:00Z",
    completedAt: null,
    settings: {
      syntaxCheck: true,
      domainCheck: true,
      mxCheck: true,
      smtpCheck: true,
      disposableCheck: true,
      roleCheck: false,
      gibberishCheck: true,
      timeout: 45,
    },
  },
]

const sampleResults: ValidationResult[] = [
  {
    email: "john.doe@gmail.com",
    status: "valid",
    checks: { syntax: true, domain: true, mx: true, smtp: true, disposable: false, role: false, gibberish: false },
    score: 95,
    provider: "Gmail",
  },
  {
    email: "admin@company.com",
    status: "risky",
    checks: { syntax: true, domain: true, mx: true, smtp: true, disposable: false, role: true, gibberish: false },
    score: 65,
    reason: "Role-based email address",
    provider: "Custom",
    suggestions: ["Consider using personal email addresses for better engagement"],
  },
  {
    email: "user@10minutemail.com",
    status: "invalid",
    checks: { syntax: true, domain: true, mx: true, smtp: false, disposable: true, role: false, gibberish: false },
    score: 25,
    reason: "Disposable email provider",
    provider: "10MinuteMail",
  },
  {
    email: "invalid-email@",
    status: "invalid",
    checks: { syntax: false, domain: false, mx: false, smtp: false, disposable: false, role: false, gibberish: false },
    score: 0,
    reason: "Invalid email syntax",
  },
  {
    email: "test@nonexistentdomain12345.com",
    status: "invalid",
    checks: { syntax: true, domain: false, mx: false, smtp: false, disposable: false, role: false, gibberish: false },
    score: 15,
    reason: "Domain does not exist",
    provider: "Unknown",
  },
]

export function EmailValidation() {
  const [isValidationDialogOpen, setIsValidationDialogOpen] = useState(false)
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false)
  const [selectedJob, setSelectedJob] = useState<any>(null)
  const [bulkEmails, setBulkEmails] = useState("")
  const [singleEmail, setSingleEmail] = useState("")
  const [validationName, setValidationName] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [isValidating, setIsValidating] = useState(false)
  const [validationProgress, setValidationProgress] = useState(0)

  const [validationSettings, setValidationSettings] = useState({
    syntaxCheck: true,
    domainCheck: true,
    mxCheck: true,
    smtpCheck: true,
    disposableCheck: true,
    roleCheck: true,
    gibberishCheck: true,
    timeout: 30,
    concurrent: 10,
    retries: 2,
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "valid":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "invalid":
        return <XCircle className="w-4 h-4 text-red-500" />
      case "risky":
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      case "pending":
        return <Clock className="w-4 h-4 text-blue-500" />
      case "running":
        return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />
      case "paused":
        return <Pause className="w-4 h-4 text-orange-500" />
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      default:
        return <XCircle className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "valid":
        return <Badge className="bg-green-500/10 text-green-500">Valid</Badge>
      case "invalid":
        return <Badge className="bg-red-500/10 text-red-500">Invalid</Badge>
      case "risky":
        return <Badge className="bg-yellow-500/10 text-yellow-500">Risky</Badge>
      case "pending":
        return <Badge className="bg-blue-500/10 text-blue-500">Pending</Badge>
      case "running":
        return <Badge className="bg-blue-500/10 text-blue-500">Running</Badge>
      case "paused":
        return <Badge className="bg-orange-500/10 text-orange-500">Paused</Badge>
      case "completed":
        return <Badge className="bg-green-500/10 text-green-500">Completed</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const validateSingleEmail = async () => {
    setIsValidating(true)
    setValidationProgress(0)

    // Simulate validation steps
    const steps = ["Syntax Check", "Domain Check", "MX Record Check", "SMTP Check", "Provider Analysis"]
    for (let i = 0; i < steps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 500))
      setValidationProgress(((i + 1) / steps.length) * 100)
    }

    setIsValidating(false)
  }

  const startBulkValidation = async () => {
    setIsValidating(true)
    setValidationProgress(0)

    // Simulate bulk validation
    const interval = setInterval(() => {
      setValidationProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsValidating(false)
          setIsValidationDialogOpen(false)
          setBulkEmails("")
          setValidationName("")
          return 100
        }
        return prev + 2
      })
    }, 100)
  }

  const filteredJobs = validationJobs.filter((job) => {
    const matchesSearch = job.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || job.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const filteredResults = sampleResults.filter((result) => {
    const matchesSearch = result.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || result.status === filterStatus
    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Email Validation</h1>
          <p className="text-muted-foreground">Advanced multi-layer email validation and verification</p>
        </div>
        <div className="flex items-center space-x-2">
          <Dialog open={isSettingsDialogOpen} onOpenChange={setIsSettingsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>Validation Settings</DialogTitle>
                <DialogDescription>Configure validation rules and performance settings</DialogDescription>
              </DialogHeader>
              <Tabs defaultValue="checks" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="checks">Validation Checks</TabsTrigger>
                  <TabsTrigger value="performance">Performance</TabsTrigger>
                </TabsList>

                <TabsContent value="checks" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Syntax Check</Label>
                        <p className="text-sm text-muted-foreground">Validate email format</p>
                      </div>
                      <Switch
                        checked={validationSettings.syntaxCheck}
                        onCheckedChange={(checked) =>
                          setValidationSettings((prev) => ({ ...prev, syntaxCheck: checked }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Domain Check</Label>
                        <p className="text-sm text-muted-foreground">Verify domain exists</p>
                      </div>
                      <Switch
                        checked={validationSettings.domainCheck}
                        onCheckedChange={(checked) =>
                          setValidationSettings((prev) => ({ ...prev, domainCheck: checked }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>MX Record Check</Label>
                        <p className="text-sm text-muted-foreground">Check mail server records</p>
                      </div>
                      <Switch
                        checked={validationSettings.mxCheck}
                        onCheckedChange={(checked) => setValidationSettings((prev) => ({ ...prev, mxCheck: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>SMTP Check</Label>
                        <p className="text-sm text-muted-foreground">Verify mailbox exists</p>
                      </div>
                      <Switch
                        checked={validationSettings.smtpCheck}
                        onCheckedChange={(checked) =>
                          setValidationSettings((prev) => ({ ...prev, smtpCheck: checked }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Disposable Check</Label>
                        <p className="text-sm text-muted-foreground">Detect temporary emails</p>
                      </div>
                      <Switch
                        checked={validationSettings.disposableCheck}
                        onCheckedChange={(checked) =>
                          setValidationSettings((prev) => ({ ...prev, disposableCheck: checked }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Role Check</Label>
                        <p className="text-sm text-muted-foreground">Identify role-based emails</p>
                      </div>
                      <Switch
                        checked={validationSettings.roleCheck}
                        onCheckedChange={(checked) =>
                          setValidationSettings((prev) => ({ ...prev, roleCheck: checked }))
                        }
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="performance" className="space-y-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Timeout (seconds)</Label>
                      <Input
                        type="number"
                        value={validationSettings.timeout}
                        onChange={(e) =>
                          setValidationSettings((prev) => ({ ...prev, timeout: Number.parseInt(e.target.value) }))
                        }
                        min="5"
                        max="120"
                      />
                      <p className="text-sm text-muted-foreground">Maximum time to wait for each validation check</p>
                    </div>
                    <div className="space-y-2">
                      <Label>Concurrent Validations</Label>
                      <Input
                        type="number"
                        value={validationSettings.concurrent}
                        onChange={(e) =>
                          setValidationSettings((prev) => ({ ...prev, concurrent: Number.parseInt(e.target.value) }))
                        }
                        min="1"
                        max="50"
                      />
                      <p className="text-sm text-muted-foreground">Number of emails to validate simultaneously</p>
                    </div>
                    <div className="space-y-2">
                      <Label>Retry Attempts</Label>
                      <Input
                        type="number"
                        value={validationSettings.retries}
                        onChange={(e) =>
                          setValidationSettings((prev) => ({ ...prev, retries: Number.parseInt(e.target.value) }))
                        }
                        min="0"
                        max="5"
                      />
                      <p className="text-sm text-muted-foreground">Number of retry attempts for failed validations</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setIsSettingsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsSettingsDialogOpen(false)}>Save Settings</Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isValidationDialogOpen} onOpenChange={setIsValidationDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <TestTube className="w-4 h-4 mr-2" />
                Start Validation
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>Email Validation</DialogTitle>
                <DialogDescription>Validate single emails or bulk lists with advanced verification</DialogDescription>
              </DialogHeader>
              <Tabs defaultValue="single" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="single">Single Email</TabsTrigger>
                  <TabsTrigger value="bulk">Bulk Validation</TabsTrigger>
                </TabsList>

                <TabsContent value="single" className="space-y-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Email Address</Label>
                      <Input
                        placeholder="user@example.com"
                        value={singleEmail}
                        onChange={(e) => setSingleEmail(e.target.value)}
                      />
                    </div>

                    {isValidating && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Validating email...</span>
                          <span>{Math.round(validationProgress)}%</span>
                        </div>
                        <Progress value={validationProgress} className="h-2" />
                      </div>
                    )}

                    <Button
                      onClick={validateSingleEmail}
                      disabled={isValidating || !singleEmail.trim()}
                      className="w-full"
                    >
                      {isValidating ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Validating...
                        </>
                      ) : (
                        <>
                          <TestTube className="w-4 h-4 mr-2" />
                          Validate Email
                        </>
                      )}
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="bulk" className="space-y-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Validation Name</Label>
                      <Input
                        placeholder="Newsletter Validation"
                        value={validationName}
                        onChange={(e) => setValidationName(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Email Addresses</Label>
                      <Textarea
                        placeholder="user1@example.com&#10;user2@company.com&#10;user3@domain.co"
                        value={bulkEmails}
                        onChange={(e) => setBulkEmails(e.target.value)}
                        rows={8}
                      />
                      <p className="text-xs text-muted-foreground">
                        {bulkEmails.split("\n").filter((email) => email.trim()).length} emails detected
                      </p>
                    </div>

                    {isValidating && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Processing emails...</span>
                          <span>{Math.round(validationProgress)}%</span>
                        </div>
                        <Progress value={validationProgress} className="h-2" />
                      </div>
                    )}

                    <Button
                      onClick={startBulkValidation}
                      disabled={isValidating || !bulkEmails.trim() || !validationName.trim()}
                      className="w-full"
                    >
                      {isValidating ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Start Validation
                        </>
                      )}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TestTube className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Validations</p>
                <p className="text-2xl font-bold">{validationJobs.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Valid Emails</p>
                <p className="text-2xl font-bold">
                  {validationJobs.reduce((sum, job) => sum + job.valid, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <XCircle className="w-5 h-5 text-red-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Invalid Emails</p>
                <p className="text-2xl font-bold">
                  {validationJobs.reduce((sum, job) => sum + job.invalid, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Accuracy Rate</p>
                <p className="text-2xl font-bold">
                  {Math.round(
                    (validationJobs.reduce((sum, job) => sum + job.valid, 0) /
                      validationJobs.reduce((sum, job) => sum + job.totalEmails, 0)) *
                      100,
                  )}
                  %
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Validation Jobs */}
      <Card>
        <CardHeader>
          <CardTitle>Validation Jobs</CardTitle>
          <CardDescription>Track and manage your email validation processes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search validations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="running">Running</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Valid</TableHead>
                  <TableHead>Invalid</TableHead>
                  <TableHead>Started</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredJobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell className="font-medium">{job.name}</TableCell>
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
                        <Progress value={(job.processed / job.totalEmails) * 100} className="h-1" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-green-600 font-medium">{job.valid.toLocaleString()}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-red-600 font-medium">{job.invalid.toLocaleString()}</span>
                    </TableCell>
                    <TableCell>{new Date(job.startedAt).toLocaleDateString()}</TableCell>
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
                            View Results
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="w-4 h-4 mr-2" />
                            Export
                          </DropdownMenuItem>
                          {job.status === "running" && (
                            <DropdownMenuItem>
                              <Pause className="w-4 h-4 mr-2" />
                              Pause
                            </DropdownMenuItem>
                          )}
                          {job.status === "paused" && (
                            <DropdownMenuItem>
                              <Play className="w-4 h-4 mr-2" />
                              Resume
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
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

      {/* Validation Results */}
      {selectedJob && (
        <Card>
          <CardHeader>
            <CardTitle>Validation Results - {selectedJob.name}</CardTitle>
            <CardDescription>Detailed results for individual email addresses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search emails..." className="pl-10 w-80" />
                </div>
                <div className="flex items-center space-x-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="valid">Valid</SelectItem>
                      <SelectItem value="invalid">Invalid</SelectItem>
                      <SelectItem value="risky">Risky</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email Address</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Checks</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredResults.map((result, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{result.email}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(result.status)}
                          {getStatusBadge(result.status)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className="w-12 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full ${
                                result.score >= 80
                                  ? "bg-green-500"
                                  : result.score >= 60
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                              }`}
                              style={{ width: `${result.score}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{result.score}</span>
                        </div>
                      </TableCell>
                      <TableCell>{result.provider || "Unknown"}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          {result.checks.syntax && <CheckCircle className="w-3 h-3 text-green-500" />}
                          {result.checks.domain && <Globe className="w-3 h-3 text-blue-500" />}
                          {result.checks.mx && <Server className="w-3 h-3 text-purple-500" />}
                          {result.checks.smtp && <Mail className="w-3 h-3 text-orange-500" />}
                          {result.checks.disposable && <Shield className="w-3 h-3 text-red-500" />}
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
                            <DropdownMenuItem>
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <RefreshCw className="w-4 h-4 mr-2" />
                              Re-validate
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Remove
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
      )}

      {/* Validation Tips */}
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <strong>Pro Tip:</strong> Enable SMTP checking for the most accurate results, but note it may take longer. Use
          role-based email detection to identify generic addresses like admin@, support@, or info@.
        </AlertDescription>
      </Alert>
    </div>
  )
}
