"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
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
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import {
  Globe,
  Plus,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Copy,
  RefreshCw,
  Settings,
  Server,
  Shield,
  Zap,
  TrendingUp,
  Mail,
  Activity,
  TestTube,
  BarChart3,
  Trash2,
  Eye,
  EyeOff,
} from "lucide-react"

const domains = [
  {
    id: "1",
    domain: "company.com",
    verified: true,
    dkimStatus: "verified",
    spfStatus: "verified",
    dmarcStatus: "verified",
    reputation: 95,
    createdAt: "2024-01-15",
    smtpConfig: {
      host: "smtp.company.com",
      port: 587,
      security: "STARTTLS",
      username: "noreply@company.com",
      password: "••••••••",
      provider: "custom",
      dailyLimit: 10000,
      sentToday: 2847,
      warmupStatus: "completed",
      warmupProgress: 100,
    },
    analytics: {
      delivered: 98.5,
      bounced: 1.2,
      complained: 0.3,
      opened: 24.8,
      clicked: 3.2,
    },
  },
  {
    id: "2",
    domain: "marketing.company.com",
    verified: true,
    dkimStatus: "verified",
    spfStatus: "verified",
    dmarcStatus: "pending",
    reputation: 78,
    createdAt: "2024-02-20",
    smtpConfig: {
      host: "smtp.sendgrid.net",
      port: 587,
      security: "STARTTLS",
      username: "apikey",
      password: "••••••••",
      provider: "sendgrid",
      dailyLimit: 50000,
      sentToday: 12450,
      warmupStatus: "active",
      warmupProgress: 75,
    },
    analytics: {
      delivered: 96.8,
      bounced: 2.1,
      complained: 1.1,
      opened: 28.4,
      clicked: 4.7,
    },
  },
  {
    id: "3",
    domain: "promo.company.com",
    verified: false,
    dkimStatus: "pending",
    spfStatus: "failed",
    dmarcStatus: "not_set",
    reputation: 45,
    createdAt: "2024-03-10",
    smtpConfig: {
      host: "",
      port: 587,
      security: "STARTTLS",
      username: "",
      password: "",
      provider: "none",
      dailyLimit: 0,
      sentToday: 0,
      warmupStatus: "not_started",
      warmupProgress: 0,
    },
    analytics: {
      delivered: 0,
      bounced: 0,
      complained: 0,
      opened: 0,
      clicked: 0,
    },
  },
]

const dnsRecords = {
  dkim: "v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC...",
  spf: "v=spf1 include:_spf.emailflow.com ~all",
  dmarc: "v=DMARC1; p=quarantine; rua=mailto:dmarc@company.com",
}

const smtpProviders = [
  { value: "custom", label: "Custom SMTP", host: "", port: 587 },
  { value: "sendgrid", label: "SendGrid", host: "smtp.sendgrid.net", port: 587 },
  { value: "mailgun", label: "Mailgun", host: "smtp.mailgun.org", port: 587 },
  { value: "ses", label: "Amazon SES", host: "email-smtp.us-east-1.amazonaws.com", port: 587 },
  { value: "postmark", label: "Postmark", host: "smtp.postmarkapp.com", port: 587 },
  { value: "sparkpost", label: "SparkPost", host: "smtp.sparkpostmail.com", port: 587 },
]

export function Domains() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false)
  const [isAnalyticsDialogOpen, setIsAnalyticsDialogOpen] = useState(false)
  const [selectedDomain, setSelectedDomain] = useState<any>(null)
  const [newDomain, setNewDomain] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isTestingConnection, setIsTestingConnection] = useState(false)

  const [smtpForm, setSmtpForm] = useState({
    provider: "custom",
    host: "",
    port: 587,
    security: "STARTTLS",
    username: "",
    password: "",
    dailyLimit: 1000,
    enableWarmup: true,
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "pending":
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      case "failed":
      case "not_set":
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return <XCircle className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return <Badge className="bg-green-500/10 text-green-500">Verified</Badge>
      case "pending":
        return <Badge className="bg-yellow-500/10 text-yellow-500">Pending</Badge>
      case "failed":
        return <Badge className="bg-red-500/10 text-red-500">Failed</Badge>
      case "not_set":
        return <Badge variant="outline">Not Set</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getWarmupBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500/10 text-green-500">Warmed Up</Badge>
      case "active":
        return <Badge className="bg-blue-500/10 text-blue-500">Warming Up</Badge>
      case "not_started":
        return <Badge variant="outline">Not Started</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const testConnection = async () => {
    setIsTestingConnection(true)
    // Simulate connection test
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsTestingConnection(false)
  }

  const handleProviderChange = (provider: string) => {
    const providerConfig = smtpProviders.find((p) => p.value === provider)
    if (providerConfig) {
      setSmtpForm((prev) => ({
        ...prev,
        provider,
        host: providerConfig.host,
        port: providerConfig.port,
      }))
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">SMTP Domain Management</h1>
          <p className="text-muted-foreground">Configure domains, SMTP servers, and monitor email delivery</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Add Domain
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Domain</DialogTitle>
              <DialogDescription>Enter the domain you want to use for sending emails</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="domain">Domain Name</Label>
                <Input
                  id="domain"
                  placeholder="example.com"
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsAddDialogOpen(false)}>Add Domain</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Globe className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Domains</p>
                <p className="text-2xl font-bold">{domains.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Verified</p>
                <p className="text-2xl font-bold">{domains.filter((d) => d.verified).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Mail className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Emails Today</p>
                <p className="text-2xl font-bold">
                  {domains.reduce((sum, d) => sum + d.smtpConfig.sentToday, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg. Reputation</p>
                <p className="text-2xl font-bold">
                  {Math.round(domains.reduce((sum, d) => sum + d.reputation, 0) / domains.length)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Domains</CardTitle>
          <CardDescription>Manage your email sending domains, SMTP configuration, and delivery metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Domain</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>SMTP Provider</TableHead>
                <TableHead>Daily Usage</TableHead>
                <TableHead>Warmup</TableHead>
                <TableHead>Reputation</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {domains.map((domain) => (
                <TableRow key={domain.id}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Globe className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <span className="font-medium">{domain.domain}</span>
                        <div className="flex items-center space-x-1 mt-1">
                          {getStatusIcon(domain.dkimStatus)}
                          {getStatusIcon(domain.spfStatus)}
                          {getStatusIcon(domain.dmarcStatus)}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {domain.verified ? (
                      <Badge className="bg-green-500/10 text-green-500">Verified</Badge>
                    ) : (
                      <Badge className="bg-yellow-500/10 text-yellow-500">Pending</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Server className="w-4 h-4 text-muted-foreground" />
                      <span className="capitalize">{domain.smtpConfig.provider}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>{domain.smtpConfig.sentToday.toLocaleString()}</span>
                        <span className="text-muted-foreground">/ {domain.smtpConfig.dailyLimit.toLocaleString()}</span>
                      </div>
                      <Progress
                        value={(domain.smtpConfig.sentToday / domain.smtpConfig.dailyLimit) * 100}
                        className="h-1"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {getWarmupBadge(domain.smtpConfig.warmupStatus)}
                      {domain.smtpConfig.warmupStatus === "active" && (
                        <Progress value={domain.smtpConfig.warmupProgress} className="h-1" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <div className="w-12 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            domain.reputation >= 80
                              ? "bg-green-500"
                              : domain.reputation >= 60
                                ? "bg-yellow-500"
                                : "bg-red-500"
                          }`}
                          style={{ width: `${domain.reputation}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{domain.reputation}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedDomain(domain)
                          setIsAnalyticsDialogOpen(true)
                        }}
                      >
                        <BarChart3 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedDomain(domain)
                          setSmtpForm({
                            provider: domain.smtpConfig.provider,
                            host: domain.smtpConfig.host,
                            port: domain.smtpConfig.port,
                            security: domain.smtpConfig.security,
                            username: domain.smtpConfig.username,
                            password: domain.smtpConfig.password,
                            dailyLimit: domain.smtpConfig.dailyLimit,
                            enableWarmup: domain.smtpConfig.warmupStatus !== "not_started",
                          })
                          setIsConfigDialogOpen(true)
                        }}
                      >
                        <Settings className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isConfigDialogOpen} onOpenChange={setIsConfigDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>SMTP Configuration</DialogTitle>
            <DialogDescription>Configure SMTP settings for {selectedDomain?.domain}</DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="smtp" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="smtp">SMTP Settings</TabsTrigger>
              <TabsTrigger value="limits">Limits & Warmup</TabsTrigger>
              <TabsTrigger value="test">Test Connection</TabsTrigger>
            </TabsList>

            <TabsContent value="smtp" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>SMTP Provider</Label>
                  <Select value={smtpForm.provider} onValueChange={handleProviderChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {smtpProviders.map((provider) => (
                        <SelectItem key={provider.value} value={provider.value}>
                          {provider.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>SMTP Host</Label>
                    <Input
                      value={smtpForm.host}
                      onChange={(e) => setSmtpForm((prev) => ({ ...prev, host: e.target.value }))}
                      placeholder="smtp.example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Port</Label>
                    <Input
                      type="number"
                      value={smtpForm.port}
                      onChange={(e) => setSmtpForm((prev) => ({ ...prev, port: Number.parseInt(e.target.value) }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Security</Label>
                  <Select
                    value={smtpForm.security}
                    onValueChange={(value) => setSmtpForm((prev) => ({ ...prev, security: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="STARTTLS">STARTTLS</SelectItem>
                      <SelectItem value="SSL/TLS">SSL/TLS</SelectItem>
                      <SelectItem value="None">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Username</Label>
                  <Input
                    value={smtpForm.username}
                    onChange={(e) => setSmtpForm((prev) => ({ ...prev, username: e.target.value }))}
                    placeholder="username or API key"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Password</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={smtpForm.password}
                      onChange={(e) => setSmtpForm((prev) => ({ ...prev, password: e.target.value }))}
                      placeholder="password or API secret"
                    />
                    <Button type="button" variant="outline" size="sm" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="limits" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Daily Email Limit</Label>
                  <Input
                    type="number"
                    value={smtpForm.dailyLimit}
                    onChange={(e) => setSmtpForm((prev) => ({ ...prev, dailyLimit: Number.parseInt(e.target.value) }))}
                  />
                  <p className="text-sm text-muted-foreground">Maximum number of emails that can be sent per day</p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Domain Warmup</Label>
                    <p className="text-sm text-muted-foreground">
                      Gradually increase sending volume to build reputation
                    </p>
                  </div>
                  <Switch
                    checked={smtpForm.enableWarmup}
                    onCheckedChange={(checked) => setSmtpForm((prev) => ({ ...prev, enableWarmup: checked }))}
                  />
                </div>

                {smtpForm.enableWarmup && (
                  <Alert>
                    <Zap className="h-4 w-4" />
                    <AlertDescription>
                      Domain warmup will start with 50 emails/day and gradually increase over 4-6 weeks to reach your
                      daily limit while monitoring reputation metrics.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </TabsContent>

            <TabsContent value="test" className="space-y-4">
              <div className="space-y-4">
                <Alert>
                  <TestTube className="h-4 w-4" />
                  <AlertDescription>
                    Test your SMTP configuration by sending a test email to verify connectivity and authentication.
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <Label>Test Email Address</Label>
                  <Input placeholder="test@example.com" />
                </div>

                <div className="space-y-2">
                  <Label>Test Message</Label>
                  <Textarea placeholder="This is a test email to verify SMTP configuration..." rows={3} />
                </div>

                <Button onClick={testConnection} disabled={isTestingConnection} className="w-full">
                  {isTestingConnection ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Testing Connection...
                    </>
                  ) : (
                    <>
                      <TestTube className="w-4 h-4 mr-2" />
                      Send Test Email
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsConfigDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsConfigDialogOpen(false)}>Save Configuration</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isAnalyticsDialogOpen} onOpenChange={setIsAnalyticsDialogOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Domain Analytics</DialogTitle>
            <DialogDescription>
              Detailed analytics and performance metrics for {selectedDomain?.domain}
            </DialogDescription>
          </DialogHeader>

          {selectedDomain && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">{selectedDomain.analytics.delivered}%</p>
                      <p className="text-sm text-muted-foreground">Delivered</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-red-600">{selectedDomain.analytics.bounced}%</p>
                      <p className="text-sm text-muted-foreground">Bounced</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-orange-600">{selectedDomain.analytics.complained}%</p>
                      <p className="text-sm text-muted-foreground">Complained</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">{selectedDomain.analytics.opened}%</p>
                      <p className="text-sm text-muted-foreground">Opened</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600">{selectedDomain.analytics.clicked}%</p>
                      <p className="text-sm text-muted-foreground">Clicked</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Activity className="w-5 h-5 text-green-500" />
                        <div>
                          <p className="font-medium">Email Campaign Sent</p>
                          <p className="text-sm text-muted-foreground">2,847 emails delivered successfully</p>
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">2 hours ago</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Shield className="w-5 h-5 text-blue-500" />
                        <div>
                          <p className="font-medium">DMARC Policy Updated</p>
                          <p className="text-sm text-muted-foreground">Policy changed to quarantine</p>
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">1 day ago</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <TrendingUp className="w-5 h-5 text-orange-500" />
                        <div>
                          <p className="font-medium">Reputation Improved</p>
                          <p className="text-sm text-muted-foreground">Domain reputation increased to 95%</p>
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">3 days ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* DNS Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>DNS Configuration</CardTitle>
          <CardDescription>Add these DNS records to verify your domain</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="dkim" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="dkim">DKIM</TabsTrigger>
              <TabsTrigger value="spf">SPF</TabsTrigger>
              <TabsTrigger value="dmarc">DMARC</TabsTrigger>
            </TabsList>

            <TabsContent value="dkim" className="space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Add this DKIM record to your DNS settings to verify domain ownership and improve deliverability.
                </AlertDescription>
              </Alert>
              <div className="space-y-2">
                <Label>Record Type</Label>
                <div className="flex items-center space-x-2">
                  <Input value="TXT" readOnly className="w-20" />
                  <Button variant="outline" size="sm" onClick={() => copyToClipboard("TXT")}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Name</Label>
                <div className="flex items-center space-x-2">
                  <Input value="emailflow._domainkey" readOnly />
                  <Button variant="outline" size="sm" onClick={() => copyToClipboard("emailflow._domainkey")}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Value</Label>
                <div className="flex items-center space-x-2">
                  <Input value={dnsRecords.dkim} readOnly className="font-mono text-xs" />
                  <Button variant="outline" size="sm" onClick={() => copyToClipboard(dnsRecords.dkim)}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="spf" className="space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  SPF records help prevent email spoofing by specifying which servers can send email from your domain.
                </AlertDescription>
              </Alert>
              <div className="space-y-2">
                <Label>Record Type</Label>
                <div className="flex items-center space-x-2">
                  <Input value="TXT" readOnly className="w-20" />
                  <Button variant="outline" size="sm" onClick={() => copyToClipboard("TXT")}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Name</Label>
                <div className="flex items-center space-x-2">
                  <Input value="@" readOnly className="w-20" />
                  <Button variant="outline" size="sm" onClick={() => copyToClipboard("@")}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Value</Label>
                <div className="flex items-center space-x-2">
                  <Input value={dnsRecords.spf} readOnly />
                  <Button variant="outline" size="sm" onClick={() => copyToClipboard(dnsRecords.spf)}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="dmarc" className="space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  DMARC policies help protect your domain from email spoofing and provide reporting on email
                  authentication.
                </AlertDescription>
              </Alert>
              <div className="space-y-2">
                <Label>Record Type</Label>
                <div className="flex items-center space-x-2">
                  <Input value="TXT" readOnly className="w-20" />
                  <Button variant="outline" size="sm" onClick={() => copyToClipboard("TXT")}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Name</Label>
                <div className="flex items-center space-x-2">
                  <Input value="_dmarc" readOnly className="w-32" />
                  <Button variant="outline" size="sm" onClick={() => copyToClipboard("_dmarc")}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Value</Label>
                <div className="flex items-center space-x-2">
                  <Input value={dnsRecords.dmarc} readOnly />
                  <Button variant="outline" size="sm" onClick={() => copyToClipboard(dnsRecords.dmarc)}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
