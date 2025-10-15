"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {useRouter} from 'next/navigation';
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
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { useDomainStore } from "@/store/domainStore";
import {  toast } from 'react-toastify';

export const smtpProviders = [
  { 
    value: "custom", 
    label: "Custom SMTP", 
    host: "", 
    port: 587,
    description: "Use your own SMTP server configuration"
  },
  { 
    value: "resend", 
    label: "Resend", 
    host: "smtp.resend.com", 
    port: 587,
    description: "Modern email API for developers"
  },
  { 
    value: "mailtrap", 
    label: "Mailtrap", 
    host: "smtp.mailtrap.io", 
    port: 587,
    description: "Email testing and development"
  }
] as const;

// Safe domain access helper functions
const getDomainProperty = (
  domain: any,
  property: string,
  defaultValue: any = ""
) => {
  if (!domain || typeof domain !== "object") return defaultValue;
  return domain[property] ?? defaultValue;
};

const isDomainVerified = (domain: any): boolean => {
  return Boolean(getDomainProperty(domain, "verified", false));
};

const getDomainReputation = (domain: any): number => {
  return Number(getDomainProperty(domain, "reputation", 0));
};

const getSmtpProvider = (domain: any): string => {
  return String(getDomainProperty(domain, "smtpProvider", "Not configured"));
};

const getDailyLimit = (domain: any): number => {
  return Number(getDomainProperty(domain, "dailyLimit", 0));
};

const isWarmupEnabled = (domain: any): boolean => {
  return Boolean(getDomainProperty(domain, "enableDomainWarmup", false));
};

export function Domains() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false);
  const [isAnalyticsDialogOpen, setIsAnalyticsDialogOpen] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<any>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const router = useRouter()
  // Multi-step form state
  const [currentStep, setCurrentStep] = useState(1);
  const [newDomain, setNewDomain] = useState("");
  const [smtpForm, setSmtpForm] = useState({
    provider: "custom",
    host: "",
    port: 587,
    security: "STARTTLS",
    username: "",
    password: "",
    dailyLimit: 1000,
    enableWarmup: true,
  });

  const {
    domains,
    currentDomain,
    isLoading,
    error,
    fetchDomains,
    addDomain,
    updateDomain,
    deleteDomain,
    verifyDomain,
    testSmtpSettings,
    getDomainStats,
    setCurrentDomain,
    clearError,
  } = useDomainStore();

  useEffect(() => {
    fetchDomains();
  }, [fetchDomains]);

  useEffect(() => {
    if (error) {
      toast(error);
      clearError();
    }
  }, [error, toast, clearError]);

  const resetForm = () => {
    setCurrentStep(1);
    setNewDomain("");
    setSmtpForm({
      provider: "custom",
      host: "",
      port: 587,
      security: "STARTTLS",
      username: "",
      password: "",
      dailyLimit: 1000,
      enableWarmup: true,
    });
  };

  // const handleAddDomain = async () => {
  //   try {
  //     if (!newDomain) {
  //       toast({
  //         title: "Error",
  //         description: "Please enter a domain name",
  //         variant: "destructive",
  //       });
  //       return;
  //     }

  //     const smtpSettings = {
  //       provider: smtpForm.provider,
  //       host: smtpForm.host,
  //       port: smtpForm.port,
  //       security: smtpForm.security,
  //       username: smtpForm.username,
  //       password: smtpForm.password,
  //       dailyLimit: smtpForm.dailyLimit,
  //       enableDomainWarmup: smtpForm.enableWarmup,
  //     };

  //     await addDomain(newDomain, smtpSettings);

  //     setIsAddDialogOpen(false);
  //     resetForm();

  //     toast({
  //       title: "Domain Added",
  //       description: `${newDomain} has been added successfully.`,
  //     });
  //     router.push("/")
  //   } catch (error) {
  //     // Error is handled by the useEffect above
  //   }
  // };

const handleAddDomain = async () => {
  try {
    if (!newDomain) {
      toast("Please enter a domain name" );
      return;
    }

    const smtpSettings = {
      provider: smtpForm.provider,
      host: smtpForm.host,
      port: smtpForm.port,
      security: smtpForm.security,
      username: smtpForm.username,
      password: smtpForm.password,
      dailyLimit: smtpForm.dailyLimit,
      enableDomainWarmup: smtpForm.enableWarmup,
    };

    await addDomain(newDomain, smtpSettings);

    // Close dialog and reset form
    setIsAddDialogOpen(false);
    resetForm();

    toast(`${newDomain} has been added successfully.`);
    
    // Refresh the domains list to ensure UI is updated
    await fetchDomains();
    
  } catch (error) {
    // Error is handled by the useEffect above
    console.error('Failed to add domain:', error);
  }
};



// In the Domains component, after handleAddDomain call
if (isLoading) {
  return (
    <div className="flex items-center justify-center p-8">
      <RefreshCw className="w-6 h-6 animate-spin mr-2" />
      Adding domain...
    </div>
  );
}


  const handleUpdateDomain = async () => {
    try {
      if (!selectedDomain) return;

      const updates = {
        smtpProvider: smtpForm.provider,
        smtpHost: smtpForm.host,
        smtpPort: smtpForm.port,
        smtpSecurity: smtpForm.security,
        smtpUsername: smtpForm.username,
        smtpPassword: smtpForm.password,
        dailyLimit: smtpForm.dailyLimit,
        enableDomainWarmup: smtpForm.enableWarmup,
      };

      await updateDomain(selectedDomain.id, updates);

      setIsConfigDialogOpen(false);

      toast.success( `${selectedDomain.domain} has been updated successfully.`);
    } catch (error) {
      // Error is handled by the useEffect above
    }
  };

const handleDeleteDomain = async (domain: any) => {
  try {
    // Show confirmation dialog
    if (!confirm(`Are you sure you want to delete the domain "${domain.domain}"? This action cannot be undone.`)) {
      return;
    }

    await deleteDomain(domain.id);
    
    // The store update should automatically remove it from the UI
    // But let's also explicitly refresh to ensure consistency
    await fetchDomains();

    toast(`${domain.domain} has been deleted successfully.`);
  } catch (error) {
    // Error is handled by the useEffect above
    console.error('Failed to delete domain:', error);
  }
};



// In your components
useEffect(() => {
  let isMounted = true;
  
  const loadData = async () => {
    if (isMounted) {
      await fetchDomains(); // or fetchEmailLists()
    }
  };
  
  loadData();
  
  return () => {
    isMounted = false;
  };
}, [fetchDomains]);

  const handleVerifyDomain = async (domain: any) => {
    try {
      await verifyDomain(domain.id);

      toast.success(`Verification for ${domain.domain} has been initiated.`,
      );
    } catch (error) {
      // Error is handled by the useEffect above
    }
  };

  const handleTestConnection = async () => {
    if (!selectedDomain) return;

    setIsTestingConnection(true);
    try {
      await testSmtpSettings(selectedDomain.id);

      toast("SMTP connection test completed successfully.");
    } catch (error) {
      // Error is handled by the useEffect above
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleViewAnalytics = async (domain: any) => {
    try {
      setSelectedDomain(domain);
      await getDomainStats(domain.id);
      setIsAnalyticsDialogOpen(true);
    } catch (error) {
      // Error is handled by the useEffect above
    }
  };

  const handleConfigureDomain = (domain: any) => {
    setSelectedDomain(domain);
    setSmtpForm({
      provider: getDomainProperty(domain, "smtpProvider", "custom"),
      host: getDomainProperty(domain, "smtpHost", ""),
      port: Number(getDomainProperty(domain, "smtpPort", 587)),
      security: getDomainProperty(domain, "smtpSecurity", "STARTTLS"),
      username: getDomainProperty(domain, "smtpUsername", ""),
      password: getDomainProperty(domain, "smtpPassword", ""),
      dailyLimit: Number(getDomainProperty(domain, "dailyLimit", 1000)),
      enableWarmup: Boolean(
        getDomainProperty(domain, "enableDomainWarmup", false)
      ),
    });
    setIsConfigDialogOpen(true);
  };

  const getStatusIcon = (domain: any) => {
    const verified = isDomainVerified(domain);
    return verified ? (
      <CheckCircle className="w-4 h-4 text-green-500" />
    ) : (
      <XCircle className="w-4 h-4 text-red-500" />
    );
  };

  const getStatusBadge = (domain: any) => {
    const verified = isDomainVerified(domain);
    return verified ? (
      <Badge className="bg-green-500/10 text-green-500">Verified</Badge>
    ) : (
      <Badge className="bg-yellow-500/10 text-yellow-500">Pending</Badge>
    );
  };

  const getWarmupBadge = (domain: any) => {
    const warmupEnabled = isWarmupEnabled(domain);
    return warmupEnabled ? (
      <Badge className="bg-blue-500/10 text-blue-500">Enabled</Badge>
    ) : (
      <Badge variant="outline">Disabled</Badge>
    );
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast("DNS record has been copied to your clipboard.",
    );
  };

  const handleProviderChange = (provider: string) => {
    const providerConfig = smtpProviders.find((p) => p.value === provider);
    if (providerConfig) {
      setSmtpForm((prev) => ({
        ...prev,
        provider,
        host: providerConfig.host,
        port: providerConfig.port,
      }));
    }
  };

  // Step navigation handlers
  const handleNextStep = () => {
    if (currentStep === 1 && !newDomain) {
      toast("Please enter a domain name");
      return;
    }
    setCurrentStep(currentStep + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  // Safe domain array handling
  const domainsArray = Array.isArray(domains) ? domains : [];
  const totalDomains = domainsArray.length;
  const verifiedDomains = domainsArray.filter((d) =>
    isDomainVerified(d)
  ).length;
  const totalEmailsToday = domainsArray.reduce(
    (sum, d) => sum + getDailyLimit(d),
    0
  );
  const avgReputation =
    domainsArray.length > 0
      ? Math.round(
          domainsArray.reduce((sum, d) => sum + getDomainReputation(d), 0) /
            domainsArray.length
        )
      : 0;

  if (isLoading && domainsArray.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="w-6 h-6 animate-spin mr-2" />
        Loading domains...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            SMTP Domain Management
          </h1>
          <p className="text-muted-foreground">
            Configure domains, SMTP servers, and monitor email delivery
          </p>
        </div>
        <Dialog
          open={isAddDialogOpen}
          onOpenChange={(open) => {
            setIsAddDialogOpen(open);
            if (!open) {
              resetForm();
            }
          }}
        >
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Add Domain
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl  max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {currentStep === 1
                  ? "Add New Domain"
                  : "Configure SMTP Settings"}
              </DialogTitle>
              <DialogDescription>
                {currentStep === 1
                  ? "Enter the domain you want to use for sending emails"
                  : "Configure SMTP settings for your domain"}
              </DialogDescription>
            </DialogHeader>

            {/* Step Indicator */}
            <div className="flex items-center justify-center mb-6">
              <div className="flex items-center">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    currentStep >= 1
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  1
                </div>
                <div
                  className={`w-16 h-1 mx-2 ${
                    currentStep >= 2 ? "bg-primary" : "bg-muted"
                  }`}
                ></div>
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    currentStep >= 2
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  2
                </div>
              </div>
            </div>

            {/* Step 1: Domain Name */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="domain">Domain Name</Label>
                    <Input
                      id="domain"
                      placeholder="example.com"
                      value={newDomain}
                      onChange={(e) => setNewDomain(e.target.value)}
                      className="text-lg"
                    />
                    <p className="text-sm text-muted-foreground">
                      Enter the domain you want to use for sending emails. This
                      will be used as your sending domain.
                    </p>
                  </div>

                  <Alert>
                    <Globe className="h-4 w-4" />
                    <AlertDescription>
                      Make sure you own this domain and have access to its DNS
                      settings for verification.
                    </AlertDescription>
                  </Alert>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleNextStep} disabled={!newDomain}>
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: SMTP Configuration */}
            {currentStep === 2 && (
              <div className="space-y-6  ">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>SMTP Provider</Label>
                    <Select
                      value={smtpForm.provider}
                      onValueChange={handleProviderChange}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {smtpProviders.map((provider) => (
                          <SelectItem
                            key={provider.value}
                            value={provider.value}
                          >
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
                        onChange={(e) =>
                          setSmtpForm((prev) => ({
                            ...prev,
                            host: e.target.value,
                          }))
                        }
                        placeholder="smtp.example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Port</Label>
                      <Input
                        type="number"
                        value={smtpForm.port}
                        onChange={(e) =>
                          setSmtpForm((prev) => ({
                            ...prev,
                            port: Number.parseInt(e.target.value) || 587,
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Security</Label>
                    <Select
                      value={smtpForm.security}
                      onValueChange={(value) =>
                        setSmtpForm((prev) => ({ ...prev, security: value }))
                      }
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
                      onChange={(e) =>
                        setSmtpForm((prev) => ({
                          ...prev,
                          username: e.target.value,
                        }))
                      }
                      placeholder="username or API key"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Password</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={smtpForm.password}
                        onChange={(e) =>
                          setSmtpForm((prev) => ({
                            ...prev,
                            password: e.target.value,
                          }))
                        }
                        placeholder="password or API secret"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Daily Email Limit</Label>
                    <Input
                      type="number"
                      value={smtpForm.dailyLimit}
                      onChange={(e) =>
                        setSmtpForm((prev) => ({
                          ...prev,
                          dailyLimit: Number.parseInt(e.target.value) || 1000,
                        }))
                      }
                    />
                    <p className="text-sm text-muted-foreground">
                      Maximum number of emails that can be sent per day
                    </p>
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
                      onCheckedChange={(checked) =>
                        setSmtpForm((prev) => ({
                          ...prev,
                          enableWarmup: checked,
                        }))
                      }
                    />
                  </div>

                  {smtpForm.enableWarmup && (
                    <Alert>
                      <Zap className="h-4 w-4" />
                      <AlertDescription>
                        Domain warmup will start with 50 emails/day and
                        gradually increase over 4-6 weeks to reach your daily
                        limit while monitoring reputation metrics.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={handlePrevStep}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button onClick={handleAddDomain} disabled={isLoading}>
                    Create Domain
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Globe className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Domains
                </p>
                <p className="text-2xl font-bold">{totalDomains}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Verified
                </p>
                <p className="text-2xl font-bold">{verifiedDomains}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Mail className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Emails Today
                </p>
                <p className="text-2xl font-bold">
                  {totalEmailsToday.toLocaleString()}
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
                <p className="text-sm font-medium text-muted-foreground">
                  Avg. Reputation
                </p>
                <p className="text-2xl font-bold">{avgReputation}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Domains Table */}
      <Card>
        <CardHeader>
          <CardTitle>Your Domains</CardTitle>
          <CardDescription>
            Manage your email sending domains, SMTP configuration, and delivery
            metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          {domainsArray.length === 0 ? (
            <div className="text-center py-8">
              <Globe className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">
                No domains configured
              </h3>
              <p className="text-muted-foreground mb-4">
                Get started by adding your first domain
              </p>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Domain
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Domain</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>SMTP Provider</TableHead>
                  <TableHead>Daily Limit</TableHead>
                  <TableHead>Warmup</TableHead>
                  <TableHead>Reputation</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {domainsArray.map((domain) => (
                  <TableRow key={getDomainProperty(domain, "id", "unknown")}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Globe className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <span className="font-medium">
                            {getDomainProperty(
                              domain,
                              "domain",
                              "Unknown Domain"
                            )}
                          </span>
                          <div className="flex items-center space-x-1 mt-1">
                            {getStatusIcon(domain)}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(domain)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Server className="w-4 h-4 text-muted-foreground" />
                        <span className="capitalize">
                          {getSmtpProvider(domain)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">
                          <span className="font-medium">
                            {getDailyLimit(domain).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getWarmupBadge(domain)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className="w-12 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              getDomainReputation(domain) >= 80
                                ? "bg-green-500"
                                : getDomainReputation(domain) >= 60
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            }`}
                            style={{
                              width: `${Math.min(
                                getDomainReputation(domain),
                                100
                              )}%`,
                            }}
                          />
                        </div>
                        <span className="text-sm font-medium">
                          {getDomainReputation(domain)}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewAnalytics(domain)}
                        >
                          <BarChart3 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleConfigureDomain(domain)}
                        >
                          <Settings className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleVerifyDomain(domain)}
                          disabled={isDomainVerified(domain)}
                        >
                          <RefreshCw className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-600"
                          onClick={() => handleDeleteDomain(domain)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Settings Dialog for Existing Domains (unchanged) */}
      <Dialog open={isConfigDialogOpen} onOpenChange={setIsConfigDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>SMTP Configuration</DialogTitle>
            <DialogDescription>
              Configure SMTP settings for {selectedDomain?.domain}
            </DialogDescription>
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
                  <Select
                    value={smtpForm.provider}
                    onValueChange={handleProviderChange}
                  >
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
                      onChange={(e) =>
                        setSmtpForm((prev) => ({
                          ...prev,
                          host: e.target.value,
                        }))
                      }
                      placeholder="smtp.example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Port</Label>
                    <Input
                      type="number"
                      value={smtpForm.port}
                      onChange={(e) =>
                        setSmtpForm((prev) => ({
                          ...prev,
                          port: Number.parseInt(e.target.value),
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Security</Label>
                  <Select
                    value={smtpForm.security}
                    onValueChange={(value) =>
                      setSmtpForm((prev) => ({ ...prev, security: value }))
                    }
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
                    onChange={(e) =>
                      setSmtpForm((prev) => ({
                        ...prev,
                        username: e.target.value,
                      }))
                    }
                    placeholder="username or API key"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Password</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={smtpForm.password}
                      onChange={(e) =>
                        setSmtpForm((prev) => ({
                          ...prev,
                          password: e.target.value,
                        }))
                      }
                      placeholder="password or API secret"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
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
                    onChange={(e) =>
                      setSmtpForm((prev) => ({
                        ...prev,
                        dailyLimit: Number.parseInt(e.target.value),
                      }))
                    }
                  />
                  <p className="text-sm text-muted-foreground">
                    Maximum number of emails that can be sent per day
                  </p>
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
                    onCheckedChange={(checked) =>
                      setSmtpForm((prev) => ({
                        ...prev,
                        enableWarmup: checked,
                      }))
                    }
                  />
                </div>

                {smtpForm.enableWarmup && (
                  <Alert>
                    <Zap className="h-4 w-4" />
                    <AlertDescription>
                      Domain warmup will start with 50 emails/day and gradually
                      increase over 4-6 weeks to reach your daily limit while
                      monitoring reputation metrics.
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
                    Test your SMTP configuration by sending a test email to
                    verify connectivity and authentication.
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <Label>Test Email Address</Label>
                  <Input placeholder="test@example.com" />
                </div>

                <div className="space-y-2">
                  <Label>Test Message</Label>
                  <Textarea
                    placeholder="This is a test email to verify SMTP configuration..."
                    rows={3}
                  />
                </div>

                <Button
                  onClick={handleTestConnection}
                  disabled={isTestingConnection || isLoading}
                  className="w-full"
                >
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
            <Button
              variant="outline"
              onClick={() => setIsConfigDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateDomain} disabled={isLoading}>
              Save Configuration
            </Button>
          </div>
        </DialogContent>
      </Dialog>













      {/* Rest of your dialogs remain the same */}
      <Dialog open={isConfigDialogOpen} onOpenChange={setIsConfigDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>SMTP Configuration</DialogTitle>
            <DialogDescription>
              Configure SMTP settings for {selectedDomain?.domain}
            </DialogDescription>
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
                  <Select
                    value={smtpForm.provider}
                    onValueChange={handleProviderChange}
                  >
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
                      onChange={(e) =>
                        setSmtpForm((prev) => ({
                          ...prev,
                          host: e.target.value,
                        }))
                      }
                      placeholder="smtp.example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Port</Label>
                    <Input
                      type="number"
                      value={smtpForm.port}
                      onChange={(e) =>
                        setSmtpForm((prev) => ({
                          ...prev,
                          port: Number.parseInt(e.target.value),
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Security</Label>
                  <Select
                    value={smtpForm.security}
                    onValueChange={(value) =>
                      setSmtpForm((prev) => ({ ...prev, security: value }))
                    }
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
                    onChange={(e) =>
                      setSmtpForm((prev) => ({
                        ...prev,
                        username: e.target.value,
                      }))
                    }
                    placeholder="username or API key"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Password</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={smtpForm.password}
                      onChange={(e) =>
                        setSmtpForm((prev) => ({
                          ...prev,
                          password: e.target.value,
                        }))
                      }
                      placeholder="password or API secret"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
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
                    onChange={(e) =>
                      setSmtpForm((prev) => ({
                        ...prev,
                        dailyLimit: Number.parseInt(e.target.value),
                      }))
                    }
                  />
                  <p className="text-sm text-muted-foreground">
                    Maximum number of emails that can be sent per day
                  </p>
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
                    onCheckedChange={(checked) =>
                      setSmtpForm((prev) => ({
                        ...prev,
                        enableWarmup: checked,
                      }))
                    }
                  />
                </div>

                {smtpForm.enableWarmup && (
                  <Alert>
                    <Zap className="h-4 w-4" />
                    <AlertDescription>
                      Domain warmup will start with 50 emails/day and gradually
                      increase over 4-6 weeks to reach your daily limit while
                      monitoring reputation metrics.
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
                    Test your SMTP configuration by sending a test email to
                    verify connectivity and authentication.
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <Label>Test Email Address</Label>
                  <Input placeholder="test@example.com" />
                </div>

                <div className="space-y-2">
                  <Label>Test Message</Label>
                  <Textarea
                    placeholder="This is a test email to verify SMTP configuration..."
                    rows={3}
                  />
                </div>

                <Button
                  onClick={handleTestConnection}
                  disabled={isTestingConnection || isLoading}
                  className="w-full"
                >
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
            <Button
              variant="outline"
              onClick={() => setIsConfigDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateDomain} disabled={isLoading}>
              Save Configuration
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Analytics Dialog and DNS Configuration sections remain the same */}

      <Dialog
        open={isAnalyticsDialogOpen}
        onOpenChange={setIsAnalyticsDialogOpen}
      >
        <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Domain Analytics</DialogTitle>
            <DialogDescription>
              Detailed analytics and performance metrics for{" "}
              {selectedDomain?.domain}
            </DialogDescription>
          </DialogHeader>

          {selectedDomain && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">98.5%</p>
                      <p className="text-sm text-muted-foreground">Delivered</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-red-600">1.2%</p>
                      <p className="text-sm text-muted-foreground">Bounced</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-orange-600">0.3%</p>
                      <p className="text-sm text-muted-foreground">
                        Complained
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">24.8%</p>
                      <p className="text-sm text-muted-foreground">Opened</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600">3.2%</p>
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
                          <p className="text-sm text-muted-foreground">
                            2,847 emails delivered successfully
                          </p>
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        2 hours ago
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Shield className="w-5 h-5 text-blue-500" />
                        <div>
                          <p className="font-medium">DMARC Policy Updated</p>
                          <p className="text-sm text-muted-foreground">
                            Policy changed to quarantine
                          </p>
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        1 day ago
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <TrendingUp className="w-5 h-5 text-orange-500" />
                        <div>
                          <p className="font-medium">Reputation Improved</p>
                          <p className="text-sm text-muted-foreground">
                            Domain reputation increased to 95%
                          </p>
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        3 days ago
                      </span>
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
          <CardDescription>
            Add these DNS records to verify your domain
          </CardDescription>
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
                  Add this DKIM record to your DNS settings to verify domain
                  ownership and improve deliverability.
                </AlertDescription>
              </Alert>
              <div className="space-y-2">
                <Label>Record Type</Label>
                <div className="flex items-center space-x-2">
                  <Input value="TXT" readOnly className="w-20" />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard("TXT")}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Name</Label>
                <div className="flex items-center space-x-2">
                  <Input value="emailflow._domainkey" readOnly />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard("emailflow._domainkey")}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Value</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    value="v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC..."
                    readOnly
                    className="font-mono text-xs"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      copyToClipboard(
                        "v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC..."
                      )
                    }
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="spf" className="space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  SPF records help prevent email spoofing by specifying which
                  servers can send email from your domain.
                </AlertDescription>
              </Alert>
              <div className="space-y-2">
                <Label>Record Type</Label>
                <div className="flex items-center space-x-2">
                  <Input value="TXT" readOnly className="w-20" />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard("TXT")}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Name</Label>
                <div className="flex items-center space-x-2">
                  <Input value="@" readOnly className="w-20" />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard("@")}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Value</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    value="v=spf1 include:_spf.emailflow.com ~all"
                    readOnly
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      copyToClipboard("v=spf1 include:_spf.emailflow.com ~all")
                    }
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="dmarc" className="space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  DMARC policies help protect your domain from email spoofing
                  and provide reporting on email authentication.
                </AlertDescription>
              </Alert>
              <div className="space-y-2">
                <Label>Record Type</Label>
                <div className="flex items-center space-x-2">
                  <Input value="TXT" readOnly className="w-20" />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard("TXT")}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Name</Label>
                <div className="flex items-center space-x-2">
                  <Input value="_dmarc" readOnly className="w-32" />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard("_dmarc")}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Value</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    value="v=DMARC1; p=quarantine; rua=mailto:dmarc@company.com"
                    readOnly
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      copyToClipboard(
                        "v=DMARC1; p=quarantine; rua=mailto:dmarc@company.com"
                      )
                    }
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
