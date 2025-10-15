"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {  toast } from 'react-toastify';
import {
  User,
  Palette,
  Mail,
  Bell,
  Key,
  Shield,
  Database,
  Webhook,
  Download,
  Trash2,
  Eye,
  EyeOff,
  Copy,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  SettingsIcon,
} from "lucide-react"
import { useSettingsStore } from "@/store/settingsStore"

interface UserProfile {
  name: string
  email: string
  company: string
  timezone: string
  language: string
}

interface NotificationSettings {
  emailNotifications: boolean
  campaignAlerts: boolean
  systemAlerts: boolean
  performanceReports: boolean
  securityAlerts: boolean
  weeklyDigest: boolean
}

interface EmailSettings {
  defaultFromName: string
  defaultReplyTo: string
  bounceHandling: string
  unsubscribeFooter: string
  trackingPixels: boolean
  linkTracking: boolean
  openTracking: boolean
}

interface APIKey {
  id: string
  name: string
  key: string
  permissions: string[]
  lastUsed: string
  created: string
}

export default function Settings() {
  // const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("account")
  const [showApiKey, setShowApiKey] = useState<string | null>(null)
  const [isGeneratingKey, setIsGeneratingKey] = useState(false)






    const {
    userSettings,
    appSettings,
    isLoading,
    error,
    fetchUserSettings,
    fetchAppSettings,
    updateUserSettings,
    clearError
  } = useSettingsStore();

  useEffect(() => {
    fetchUserSettings();
    fetchAppSettings();
  }, []);

  const handleUpdateSettings = async (settings: any) => {
    try {
      await updateUserSettings(settings);
      // Show success message
    } catch (error) {
      // Show error message
    }
  };


  // State for different settings sections
  const [profile, setProfile] = useState<UserProfile>({
    name: "John Doe",
    email: "john@example.com",
    company: "Acme Corp",
    timezone: "UTC-8",
    language: "en",
  })

  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    campaignAlerts: true,
    systemAlerts: true,
    performanceReports: false,
    securityAlerts: true,
    weeklyDigest: true,
  })

  const [emailSettings, setEmailSettings] = useState<EmailSettings>({
    defaultFromName: "John Doe",
    defaultReplyTo: "john@example.com",
    bounceHandling: "automatic",
    unsubscribeFooter: "If you no longer wish to receive these emails, you can unsubscribe here.",
    trackingPixels: true,
    linkTracking: true,
    openTracking: true,
  })

  const [apiKeys, setApiKeys] = useState<APIKey[]>([
    {
      id: "1",
      name: "Production API",
      key: "sk_live_1234567890abcdef",
      permissions: ["read", "write", "delete"],
      lastUsed: "2024-01-15",
      created: "2024-01-01",
    },
    {
      id: "2",
      name: "Development API",
      key: "sk_test_abcdef1234567890",
      permissions: ["read", "write"],
      lastUsed: "2024-01-14",
      created: "2024-01-10",
    },
  ])

  const [theme, setTheme] = useState("dark")
  const [uiDensity, setUiDensity] = useState("comfortable")

  const handleSaveProfile = () => {
    toast("Your profile settings have been saved successfully.")
  }

  const handleSaveNotifications = () => {
    toast("Your notification preferences have been saved.")
  }

  const handleSaveEmailSettings = () => {
    toast("Your email configuration has been saved.")
  }

  const handleGenerateApiKey = async () => {
    setIsGeneratingKey(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newKey: APIKey = {
      id: Date.now().toString(),
      name: "New API Key",
      key: `sk_live_${Math.random().toString(36).substring(2, 15)}`,
      permissions: ["read"],
      lastUsed: "Never",
      created: new Date().toISOString().split("T")[0],
    }

    setApiKeys([...apiKeys, newKey])
    setIsGeneratingKey(false)

    toast("Your new API key has been created successfully.")
  }

  const handleDeleteApiKey = (keyId: string) => {
    setApiKeys(apiKeys.filter((key) => key.id !== keyId))
    toast("The API key has been permanently deleted.")
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast("The API key has been copied to your clipboard.")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <SettingsIcon className="h-6 w-6" />
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="account" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Account
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="api" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            API & Keys
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>

        {/* Account Settings */}
        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your account details and personal information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={profile.company}
                    onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={profile.timezone}
                    onValueChange={(value) => setProfile({ ...profile, timezone: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC-8">Pacific Time (UTC-8)</SelectItem>
                      <SelectItem value="UTC-5">Eastern Time (UTC-5)</SelectItem>
                      <SelectItem value="UTC+0">UTC</SelectItem>
                      <SelectItem value="UTC+1">Central European Time (UTC+1)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select value={profile.language} onValueChange={(value) => setProfile({ ...profile, language: value })}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleSaveProfile}>Save Changes</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Password & Security</CardTitle>
              <CardDescription>Manage your password and security settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline">Change Password</Button>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Theme</CardTitle>
              <CardDescription>Customize the appearance of your dashboard.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Color Theme</Label>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>UI Density</Label>
                <Select value={uiDensity} onValueChange={setUiDensity}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="compact">Compact</SelectItem>
                    <SelectItem value="comfortable">Comfortable</SelectItem>
                    <SelectItem value="spacious">Spacious</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button>Apply Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Settings */}
        <TabsContent value="email" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Default Email Settings</CardTitle>
              <CardDescription>Configure default settings for your email campaigns.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fromName">Default From Name</Label>
                  <Input
                    id="fromName"
                    value={emailSettings.defaultFromName}
                    onChange={(e) => setEmailSettings({ ...emailSettings, defaultFromName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="replyTo">Default Reply-To</Label>
                  <Input
                    id="replyTo"
                    type="email"
                    value={emailSettings.defaultReplyTo}
                    onChange={(e) => setEmailSettings({ ...emailSettings, defaultReplyTo: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bounceHandling">Bounce Handling</Label>
                <Select
                  value={emailSettings.bounceHandling}
                  onValueChange={(value) => setEmailSettings({ ...emailSettings, bounceHandling: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="automatic">Automatic</SelectItem>
                    <SelectItem value="manual">Manual Review</SelectItem>
                    <SelectItem value="ignore">Ignore</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="unsubscribeFooter">Unsubscribe Footer</Label>
                <Textarea
                  id="unsubscribeFooter"
                  value={emailSettings.unsubscribeFooter}
                  onChange={(e) => setEmailSettings({ ...emailSettings, unsubscribeFooter: e.target.value })}
                  rows={3}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Tracking Settings</h4>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Open Tracking</Label>
                    <p className="text-sm text-muted-foreground">Track when recipients open your emails</p>
                  </div>
                  <Switch
                    checked={emailSettings.openTracking}
                    onCheckedChange={(checked) => setEmailSettings({ ...emailSettings, openTracking: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Link Tracking</Label>
                    <p className="text-sm text-muted-foreground">Track clicks on links in your emails</p>
                  </div>
                  <Switch
                    checked={emailSettings.linkTracking}
                    onCheckedChange={(checked) => setEmailSettings({ ...emailSettings, linkTracking: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Tracking Pixels</Label>
                    <p className="text-sm text-muted-foreground">Include tracking pixels for detailed analytics</p>
                  </div>
                  <Switch
                    checked={emailSettings.trackingPixels}
                    onCheckedChange={(checked) => setEmailSettings({ ...emailSettings, trackingPixels: checked })}
                  />
                </div>
              </div>

              <Button onClick={handleSaveEmailSettings}>Save Email Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose what notifications you want to receive.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                </div>
                <Switch
                  checked={notifications.emailNotifications}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, emailNotifications: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Campaign Alerts</Label>
                  <p className="text-sm text-muted-foreground">Get notified about campaign status changes</p>
                </div>
                <Switch
                  checked={notifications.campaignAlerts}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, campaignAlerts: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>System Alerts</Label>
                  <p className="text-sm text-muted-foreground">Important system notifications and updates</p>
                </div>
                <Switch
                  checked={notifications.systemAlerts}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, systemAlerts: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Performance Reports</Label>
                  <p className="text-sm text-muted-foreground">Weekly performance and analytics reports</p>
                </div>
                <Switch
                  checked={notifications.performanceReports}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, performanceReports: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Security Alerts</Label>
                  <p className="text-sm text-muted-foreground">Security-related notifications and warnings</p>
                </div>
                <Switch
                  checked={notifications.securityAlerts}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, securityAlerts: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Weekly Digest</Label>
                  <p className="text-sm text-muted-foreground">Summary of your account activity</p>
                </div>
                <Switch
                  checked={notifications.weeklyDigest}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, weeklyDigest: checked })}
                />
              </div>

              <Button onClick={handleSaveNotifications}>Save Notification Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API & Keys */}
        <TabsContent value="api" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>Manage your API keys for integrating with external services.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">Your API Keys</h4>
                  <p className="text-sm text-muted-foreground">Use these keys to authenticate API requests</p>
                </div>
                <Button onClick={handleGenerateApiKey} disabled={isGeneratingKey}>
                  {isGeneratingKey ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Key className="h-4 w-4 mr-2" />
                      Generate New Key
                    </>
                  )}
                </Button>
              </div>

              <div className="space-y-3">
                {apiKeys.map((apiKey) => (
                  <div key={apiKey.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h5 className="font-medium">{apiKey.name}</h5>
                          <div className="flex gap-1">
                            {apiKey.permissions.map((permission) => (
                              <Badge key={permission} variant="secondary" className="text-xs">
                                {permission}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Created: {apiKey.created}</span>
                          <span>Last used: {apiKey.lastUsed}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <code className="bg-muted px-2 py-1 rounded text-sm">
                            {showApiKey === apiKey.id ? apiKey.key : `${apiKey.key.substring(0, 12)}...`}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowApiKey(showApiKey === apiKey.id ? null : apiKey.id)}
                          >
                            {showApiKey === apiKey.id ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => copyToClipboard(apiKey.key)}>
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Delete API Key</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to delete this API key? This action cannot be undone.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button variant="outline">Cancel</Button>
                            <Button variant="destructive" onClick={() => handleDeleteApiKey(apiKey.id)}>
                              Delete Key
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Webhooks</CardTitle>
              <CardDescription>Configure webhooks to receive real-time notifications about events.</CardDescription>
            </CardHeader>
            <CardContent>
              <Alert>
                <Webhook className="h-4 w-4" />
                <AlertDescription>
                  Webhook configuration is coming soon. You'll be able to set up endpoints to receive notifications
                  about campaign events, bounces, and more.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Overview</CardTitle>
              <CardDescription>Monitor your account security and access logs.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <h4 className="font-medium">Account Security</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">Your account is secure</p>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    <h4 className="font-medium">2FA Status</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">Two-factor authentication disabled</p>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2">Recent Activity</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span>Login from Chrome on Windows</span>
                    <span className="text-muted-foreground">2 hours ago</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span>API key generated</span>
                    <span className="text-muted-foreground">1 day ago</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span>Password changed</span>
                    <span className="text-muted-foreground">3 days ago</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-medium">Data & Privacy</h4>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export Data
                  </Button>
                  <Button variant="outline" size="sm">
                    <Database className="h-4 w-4 mr-2" />
                    Data Retention
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
