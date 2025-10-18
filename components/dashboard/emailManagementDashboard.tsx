"use client";

import {
  useState,
  useEffect,
  useRef,
  Key,
  ReactNode,
} from "react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Users,
  Plus,
  Upload,
  Download,
  CheckCircle,
  XCircle,
  AlertTriangle,
  MoreHorizontal,
  Search,
  Filter,
  Trash2,
  Edit,
  Eye,
  FileText,
  RefreshCw,
  Copy,
  Globe,
  Settings,
  Server,
  Shield,
  Zap,
  TrendingUp,
  Mail,
  Activity,
  TestTube,
  BarChart3,
  EyeOff,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { EmailList, useEmailListStore } from "@/store/emailListStore";
import { useDomainStore } from "@/store/domainStore";
import { toast } from 'react-toastify';
import { useEmailValidation } from "@/hooks/useEmailValidation";
import { ValidationStats } from "../email-validation/ValidationStats";
import { EmailValidationItem } from "../email-validation/EmailValidationItem";

// SMTP Providers configuration
const smtpProviders = [
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

// Domain helper functions
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

function EmailManagementDashboard() {
  const router = useRouter();
  
  // Active tab state
  const [activeTab, setActiveTab] = useState<"email-lists" | "domains">("email-lists");

  // Email Lists States
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedList, setSelectedList] = useState<string | null>(null);
  const [newListName, setNewListName] = useState("");
  const [newListDescription, setNewListDescription] = useState("");
  const [bulkEmails, setBulkEmails] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [validationProgress, setValidationProgress] = useState(0);
  const [isValidating, setIsValidating] = useState(false);
  const [emailValidationResults, setEmailValidationResults] = useState<
    { email: string; status: "valid" | "invalid" | "pending"; error?: string }[]
  >([]);
  const [currentEmail, setCurrentEmail] = useState("");
  const [emailSearchTerm, setEmailSearchTerm] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // File upload states
  const [file, setFile] = useState<File | null>(null);
  const [fileEmails, setFileEmails] = useState<string[]>([]);
  const [fileValidationResults, setFileValidationResults] = useState<
    { email: string; status: "valid" | "invalid" | "pending"; error?: string }[]
  >([]);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [fileProcessingProgress, setFileProcessingProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Edit states
  const [editingList, setEditingList] = useState<EmailList | null>(null);
  const [editListName, setEditListName] = useState("");
  const [editListDescription, setEditListDescription] = useState("");

  // Domains States
  const [isAddDomainDialogOpen, setIsAddDomainDialogOpen] = useState(false);
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false);
  const [isAnalyticsDialogOpen, setIsAnalyticsDialogOpen] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<any>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [domainCurrentStep, setDomainCurrentStep] = useState(1);
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
    fromEmail: "",
  });

  // Stores
  const {
    emailLists,
    currentList,
    emails,
    isLoading: emailLoading,
    error: emailError,
    fetchEmailLists,
    createEmailList,
    updateEmailList,
    deleteEmailList,
    getEmailListWithStats,
    getAllEmailListsWithStats,
    addEmailsToList,
    getEmailsInList,
    validateEmailBatch,
    setCurrentList,
    clearError: clearEmailError,
  } = useEmailListStore();

  const {
    domains,
    currentDomain,
    isLoading: domainLoading,
    error: domainError,
    fetchDomains,
    addDomain,
    updateDomain,
    deleteDomain,
    verifyDomain,
    testSmtpSettings,
    getDomainStats,
    setCurrentDomain,
    clearError: clearDomainError,
  } = useDomainStore();

  // Email Validation Hook
  const {
    results: validationResults,
    loading: validationLoading,
    validateEmail,
    validateBatch,
    clearValidation
  } = useEmailValidation();

  // Effects for data loading
  useEffect(() => {
    let isMounted = true;
    
    const loadData = async () => {
      if (isMounted) {
        try {
          await fetchEmailLists();
          await fetchDomains();
        } catch (error) {
          console.error('Failed to fetch data:', error);
        }
      }
    };
    
    loadData();
    
    return () => {
      isMounted = false;
    };
  }, [fetchEmailLists, fetchDomains]);

  // Error handling effects
  useEffect(() => {
    if (emailError) {
      toast(emailError.toString());
      clearEmailError();
    }
  }, [emailError, clearEmailError]);

  useEffect(() => {
    if (domainError) {
      toast(domainError);
      clearDomainError();
    }
  }, [domainError, clearDomainError]);

  // Enhanced Validation Display Component
  const EnhancedValidationDisplay = () => {
    const emails = bulkEmails
      .split(/[,\s\n]+/)
      .filter((email) => email.trim() !== '');

    if (emails.length === 0) {
      return null;
    }

    const validCount = emails.filter(email => 
      validationResults[email]?.isValid
    ).length;
    
    const invalidCount = emails.filter(email => 
      validationResults[email] && !validationResults[email]?.isValid
    ).length;
    
    const pendingCount = emails.filter(email => 
      validationLoading.has(email) || !validationResults[email]
    ).length;

    const [viewMode, setViewMode] = useState<'all' | 'valid' | 'invalid'>('all');
    const [searchTerm, setSearchTerm] = useState('');

    // Filter emails based on view mode and search
    const filteredEmails = emails.filter(email => {
      const matchesSearch = email.toLowerCase().includes(searchTerm.toLowerCase());
      const result = validationResults[email];
      
      if (!matchesSearch) return false;
      
      switch (viewMode) {
        case 'valid':
          return result?.isValid;
        case 'invalid':
          return result && !result?.isValid;
        default:
          return true;
      }
    });

    return (
      <div className="space-y-4">
        {/* Header with Stats and Controls */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4 gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Email Validation Results
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {emails.length} email{emails.length !== 1 ? 's' : ''} processed
              </p>
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 bg-white rounded-lg p-1 border">
              <Button
                variant={viewMode === 'all' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('all')}
                className={`text-xs ${viewMode === 'all' ? 'shadow-sm' : ''}`}
              >
                All ({emails.length})
              </Button>
              <Button
                variant={viewMode === 'valid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('valid')}
                className={`text-xs ${viewMode === 'valid' ? 'bg-green-50 text-green-700 border-green-200' : ''}`}
              >
                Valid ({validCount})
              </Button>
              <Button
                variant={viewMode === 'invalid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('invalid')}
                className={`text-xs ${viewMode === 'invalid' ? 'bg-red-50 text-red-700 border-red-200' : ''}`}
              >
                Invalid ({invalidCount})
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-600">
              <span>Validation Progress</span>
              <span>{emails.length - pendingCount}/{emails.length}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ 
                  width: `${((emails.length - pendingCount) / emails.length) * 100}%` 
                }}
              />
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className={`text-center p-3 rounded-lg border transition-all ${
              pendingCount > 0 ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
              <div className="text-xs text-yellow-700">Pending</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-green-50 border border-green-200">
              <div className="text-2xl font-bold text-green-600">{validCount}</div>
              <div className="text-xs text-green-700">Valid</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-red-50 border border-red-200">
              <div className="text-2xl font-bold text-red-600">{invalidCount}</div>
              <div className="text-xs text-red-700">Invalid</div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex-1 relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search emails..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 w-full"
            />
          </div>
          <div className="text-sm text-gray-500 whitespace-nowrap">
            {filteredEmails.length} of {emails.length} shown
          </div>
        </div>

        {/* Email List */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="max-h-80 overflow-y-auto">
            {filteredEmails.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="font-medium">No emails found</p>
                <p className="text-sm mt-1">
                  {searchTerm ? 'Try adjusting your search or filter' : 'All emails are filtered out'}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredEmails.map((email, index) => (
                  <EmailValidationItem
                    key={`${email}-${index}`}
                    email={email}
                    result={validationResults[email]}
                    isLoading={validationLoading.has(email)}
                    onRemove={(emailToRemove: any) => {
                      const newEmails = emails.filter(e => e !== emailToRemove);
                      setBulkEmails(newEmails.join('\n'));
                      clearValidation(emailToRemove);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200 gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            {pendingCount > 0 ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
                <span>Validating {pendingCount} email{pendingCount !== 1 ? 's' : ''}...</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>All emails validated successfully</span>
              </>
            )}
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => validateBatch(emails)}
              disabled={pendingCount === 0}
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Re-validate All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setBulkEmails('');
                clearValidation();
              }}
              className="gap-2 text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </Button>
          </div>
        </div>
      </div>
    );
  };

  // Email List Functions
  const handleEmailInput = async (value: string) => {
    setBulkEmails(value);

    const emails = value
      .split(/[,\s\n]+/)
      .filter((email) => email.trim() !== '');

    Object.keys(validationResults).forEach(email => {
      if (!emails.includes(email)) {
        clearValidation(email);
      }
    });

    const newEmails = emails.filter(email => 
      !validationResults[email] && !validationLoading.has(email)
    );

    if (newEmails.length > 0) {
      if (newEmails.length === 1) {
        validateEmail(newEmails[0]);
      } else {
        validateBatch(newEmails);
      }
    }
  };

  const basicEmailValidation = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  };

  const getValidEmails = () => {
    if (fileEmails.length > 0 && file) {
      return fileValidationResults
        .filter((r) => r.status === "valid")
        .map((r) => r.email);
    } else {
      const emailsFromTextarea = bulkEmails
        .split(/[,\s\n]+/)
        .filter((email) => email.trim() !== '');
      
      return emailsFromTextarea.filter(email => {
        const validationResult = validationResults[email];
        if (validationResult) {
          return validationResult.isValid;
        }
        return basicEmailValidation(email);
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      processFile(selectedFile);
    }
  };

  const processFile = async (selectedFile: File) => {
    setIsProcessingFile(true);
    setFileProcessingProgress(0);

    const reader = new FileReader();

    reader.onload = async (e) => {
      const content = e.target?.result as string;
      let emails: string[] = [];

      if (selectedFile.name.endsWith(".csv")) {
        const lines = content.split("\n");
        emails = lines
          .slice(1)
          .map((line) => line.split(",")[0]?.trim())
          .filter((email) => email && email !== "");
      } else {
        emails = content
          .split(/[,\s\n]+/)
          .filter((email) => email.trim() !== "");
      }

      setFileEmails(emails);

      if (emails.length > 0) {
        await validateBatch(emails);
      }

      setIsProcessingFile(false);
      setFileProcessingProgress(100);
    };

    reader.readAsText(selectedFile);
  };

  const handleCombinedSubmit = async () => {
    if (currentStep === 1) {
      if (!newListName.trim()) {
        toast("Please enter a name for the email list.");
        return;
      }
      setCurrentStep(2);
    } else {
      setIsValidating(true);
      setValidationProgress(0);

      try {
        let emailsToUpload: string[] = [];
        
        if (fileEmails.length > 0 && file) {
          emailsToUpload = fileValidationResults
            .filter((r) => r.status === "valid")
            .map((r) => r.email);
        } else {
          const emailsFromTextarea = bulkEmails
            .split(/[,\s\n]+/)
            .filter((email) => email.trim() !== '');
          
          emailsToUpload = emailsFromTextarea.filter(email => 
            validationResults[email]?.isValid
          );
          
          if (emailsToUpload.length === 0) {
            emailsToUpload = emailsFromTextarea.filter(email => 
              basicEmailValidation(email)
            );
          }
        }

        if (emailsToUpload.length === 0) {
          toast("Please add at least one valid email address.");
          setIsValidating(false);
          return;
        }

        await createEmailList(newListName, newListDescription, emailsToUpload);
        
        setIsEmailModalOpen(false);
        resetEmailModalState();
        await fetchEmailLists();
        
        toast(`Your email list has been created with ${emailsToUpload.length} emails.`);
        
      } catch (error: any) {
        toast(error.message || "Failed to create email list");
      } finally {
        setIsValidating(false);
        setValidationProgress(0);
      }
    }
  };

  const resetEmailModalState = () => {
    setCurrentStep(1);
    setNewListName("");
    setNewListDescription("");
    setBulkEmails("");
    setEmailValidationResults([]);
    setCurrentEmail("");
    setFile(null);
    setFileEmails([]);
    setFileValidationResults([]);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleEmailModalClose = (open: boolean) => {
    if (!open) {
      resetEmailModalState();
    }
    setIsEmailModalOpen(open);
  };

  const handleChooseFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleDeleteEmailList = async (listId: string) => {
    const listToDelete = (emailLists as any)?.emailLists?.find((list: any) => list.id === listId);
    
    if (!confirm(`Are you sure you want to delete the email list "${listToDelete?.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteEmailList(listId);
      await fetchEmailLists();
      toast("The email list has been deleted successfully.");
    } catch (error: any) {
      toast(error.message || "Failed to delete email list");
    }
  };

  const handleViewEmailList = async (listId: string) => {
    try {
      await getEmailListWithStats(listId);
      await getEmailsInList(listId);
      setSelectedList(listId);
      setIsViewModalOpen(true);
    } catch (error: any) {
      toast(error.message || "Please try again");
    }
  };

  const handleEditEmailList = async (list: EmailList) => {
    setEditingList(list);
    setEditListName(list.name);
    setEditListDescription(list.description || "");
    setIsEditModalOpen(true);
  };

  const handleUpdateEmailList = async () => {
    if (!editingList || !editListName.trim()) {
      toast("Please enter a name for the email list.");
      return;
    }

    try {
      await updateEmailList(editingList.id, {
        name: editListName,
        description: editListDescription,
      });
      await fetchEmailLists();
      setIsEditModalOpen(false);
      setEditingList(null);
      toast("The email list has been updated successfully.");
    } catch (error) {
      // Error is handled by the useEffect above
    }
  };

  const handleExportEmailList = async (list: EmailList) => {
    try {
      await getEmailsInList(list.id);
      
      const headers = "Email Address,Status,Added Date\n";
      const csvContent = emails
        .map((email: any) => 
          `"${email.address}",${email.valid ? "Valid" : "Invalid"},"${new Date(email.createdAt).toLocaleDateString()}"`
        )
        .join("\n");
      
      const fullCsv = headers + csvContent;
      
      const blob = new Blob([fullCsv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${list.name.replace(/\s+/g, "_")}_emails.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast(`Exported ${emails.length} emails to CSV.`);
    } catch (error) {
      toast("Failed to export email list.");
    }
  };

  const handleCopyEmails = async (list: EmailList) => {
    try {
      await getEmailsInList(list.id);
      const emailList = emails.map((email: any) => email.address).join("\n");
      await navigator.clipboard.writeText(emailList);
      
      toast(`Copied ${emails.length} emails to clipboard.`);
    } catch (error) {
      toast("Failed to copy emails to clipboard.");
    }
  };

  const getStatusBadge = (status?: string) => {
    return <Badge className="bg-green-500/10 text-green-500">Active</Badge>;
  };

  const getEmailStatusIcon = (valid: boolean) => {
    return valid ? (
      <CheckCircle className="w-4 h-4 text-green-500" />
    ) : (
      <XCircle className="w-4 h-4 text-red-500" />
    );
  };

  const filteredLists = (emailLists || []).filter((list: EmailList) =>
    String(list?.name).toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(list?.description || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredEmails = emails.filter((email: any) =>
    email.address.toLowerCase().includes(emailSearchTerm.toLowerCase())
  );

  // Domain Functions
  const resetDomainForm = () => {
    setDomainCurrentStep(1);
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
      fromEmail: "",
    });
  };

  const handleAddDomain = async () => {
    try {
      if (!newDomain) {
        toast("Please enter a domain name");
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
      setIsAddDomainDialogOpen(false);
      resetDomainForm();
      toast(`${newDomain} has been added successfully.`);
      await fetchDomains();
      
    } catch (error) {
      console.error('Failed to add domain:', error);
    }
  };

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
      toast(`${selectedDomain.domain} has been updated successfully.`);
    } catch (error) {
      // Error is handled by the useEffect above
    }
  };

  const handleDeleteDomain = async (domain: any) => {
    if (!confirm(`Are you sure you want to delete the domain "${domain.domain}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteDomain(domain.id);
      await fetchDomains();
      toast(`${domain.domain} has been deleted successfully.`);
    } catch (error) {
      console.error('Failed to delete domain:', error);
    }
  };

  const handleVerifyDomain = async (domain: any) => {
    try {
      await verifyDomain(domain.id);
      toast(`Verification for ${domain.domain} has been initiated.`);
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
      enableWarmup: Boolean(getDomainProperty(domain, "enableDomainWarmup", false)),
      fromEmail: getDomainProperty(domain, "fromEmail", ""),
    });
    setIsConfigDialogOpen(true);
  };

  const handleProviderChange = (provider: string) => {
    const providerConfig = smtpProviders.find((p) => p.value === provider);
    if (providerConfig) {
      const defaultFromEmail = provider === 'custom' 
        ? `noreply@${newDomain || (selectedDomain?.domain || '')}`
        : smtpForm.fromEmail;
      
      setSmtpForm((prev) => ({
        ...prev,
        provider,
        host: providerConfig.host,
        port: providerConfig.port,
        fromEmail: defaultFromEmail,
      }));
    }
  };

  const handleDomainNextStep = () => {
    if (domainCurrentStep === 1 && !newDomain) {
      toast("Please enter a domain name");
      return;
    }
    setDomainCurrentStep(domainCurrentStep + 1);
  };

  const handleDomainPrevStep = () => {
    setDomainCurrentStep(domainCurrentStep - 1);
  };

  const getStatusIcon = (domain: any) => {
    const verified = isDomainVerified(domain);
    return verified ? (
      <CheckCircle className="w-4 h-4 text-green-500" />
    ) : (
      <XCircle className="w-4 h-4 text-red-500" />
    );
  };

  const getStatusBadgeDomain = (domain: any) => {
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
    toast("DNS record has been copied to your clipboard.");
  };

  // Domain statistics
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

  // Focus effect for textarea
  useEffect(() => {
    if (isEmailModalOpen && currentStep === 2 && textareaRef.current) {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
  }, [isEmailModalOpen, currentStep]);

  const isLoading = emailLoading || domainLoading;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Email Management</h1>
          <p className="text-muted-foreground">
            Manage your email lists and sending domains in one place
          </p>
        </div>
        
        {/* Tab Navigation */}
        <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)} className="w-full lg:w-auto">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="email-lists" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Email Lists
            </TabsTrigger>
            <TabsTrigger value="domains" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Domains
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Email Lists Content */}
      {activeTab === "email-lists" && (
        <div className="space-y-6">
          {/* Header Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex-1 w-full">
              <div className="relative max-w-sm">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search lists..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button
                onClick={() => setIsEmailModalOpen(true)}
                className="bg-primary hover:bg-primary/90 flex-1 sm:flex-none"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create List
              </Button>
            </div>
          </div>

          {/* Email Lists Grid */}
          {isLoading && !emailLists ? (
            <div className="flex items-center justify-center p-8">
              <RefreshCw className="w-6 h-6 animate-spin mr-2" />
              Loading email lists...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLists.map((list: EmailList) => (
                <Card key={list.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Users className="w-5 h-5 text-primary" />
                        <CardTitle className="text-lg">{list.name}</CardTitle>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="z-50">
                          <DropdownMenuItem onClick={() => handleViewEmailList(list.id)}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditEmailList(list)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit List
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleExportEmailList(list)}>
                            <Download className="w-4 h-4 mr-2" />
                            Export
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleCopyEmails(list)}>
                            <Copy className="w-4 h-4 mr-2" />
                            Copy Emails
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDeleteEmailList(list.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <CardDescription className="text-sm">
                      {list.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Status</span>
                      {getStatusBadge()}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Total Emails</span>
                        <span className="font-medium">
                          {list?.emailCount?.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Valid</span>
                        <span className="font-medium text-green-500">
                          {list?.stats?.validEmails?.toLocaleString() || 0}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Invalid</span>
                        <span className="font-medium text-red-500">
                          {list?.stats?.invalidEmails?.toLocaleString() || 0}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Validity Rate</span>
                        <span className="font-medium">
                          {list.stats?.validityRate?.toFixed(1) || 0}%
                        </span>
                      </div>
                      <Progress
                        value={(Number(list?.stats?.validEmails) / Number(list?.emailCount)) * 100 || 0}
                        className="h-2"
                      />
                    </div>

                    <div className="text-xs text-muted-foreground">
                      Updated {new Date(list.updatedAt).toLocaleDateString()}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Create Email List Dialog */}
          <Dialog open={isEmailModalOpen} onOpenChange={handleEmailModalClose}>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
              <DialogHeader>
                <DialogTitle>
                  {currentStep === 1
                    ? "Create New Email List"
                    : "Upload Email List"}
                </DialogTitle>
                <DialogDescription>
                  {currentStep === 1
                    ? "Create a new email list to organize your subscribers"
                    : "Upload emails in bulk. Paste one email per line or upload a CSV file."}
                </DialogDescription>
              </DialogHeader>

              <div className="flex-1 overflow-y-auto pr-2">
                {currentStep === 1 ? (
                  // Step 1: Create List
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="listName">List Name</Label>
                      <Input
                        id="listName"
                        placeholder="Newsletter Subscribers"
                        value={newListName}
                        onChange={(e) => setNewListName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="listDescription">Description</Label>
                      <Textarea
                        id="listDescription"
                        placeholder="Describe the purpose of this email list"
                        value={newListDescription}
                        onChange={(e) => setNewListDescription(e.target.value)}
                        rows={3}
                      />
                    </div>
                  </div>
                ) : (
                  // Step 2: Upload Emails
                  <div className="space-y-4">
                    <Tabs defaultValue="paste" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="paste">Paste Emails</TabsTrigger>
                        <TabsTrigger value="upload">Upload File</TabsTrigger>
                      </TabsList>

                      <TabsContent value="paste" className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="emails">Email Addresses</Label>
                          <Textarea
                            ref={textareaRef}
                            id="emails"
                            placeholder="john@example.com&#10;jane@company.com&#10;user@domain.co"
                            value={bulkEmails}
                            onChange={(e) => handleEmailInput(e.target.value)}
                            rows={6}
                            className="resize-none font-mono text-sm"
                          />
                          <p className="text-xs text-muted-foreground">
                            Enter one email per line. Validation happens automatically as you type.
                          </p>
                        </div>
                        <EnhancedValidationDisplay />
                      </TabsContent>

                      <TabsContent value="upload" className="space-y-4">
                        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                            accept=".csv,.txt"
                          />
                          {file ? (
                            <div className="space-y-4">
                              <FileText className="w-12 h-12 text-primary mx-auto" />
                              <div>
                                <p className="font-medium">{file.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {(file.size / 1024).toFixed(2)} KB
                                </p>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={handleChooseFileClick}
                              >
                                Choose Different File
                              </Button>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                              <p className="text-sm text-muted-foreground mb-2">
                                Drag and drop your CSV file here, or click to browse
                              </p>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={handleChooseFileClick}
                              >
                                Choose File
                              </Button>
                            </div>
                          )}
                        </div>

                        {isProcessingFile && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span>Processing file...</span>
                              <span>{fileProcessingProgress}%</span>
                            </div>
                            <Progress
                              value={fileProcessingProgress}
                              className="h-2"
                            />
                          </div>
                        )}

                        {fileValidationResults.length > 0 && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">
                                File Validation Results
                              </span>
                              <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-1">
                                  <CheckCircle className="w-3 h-3 text-green-500" />
                                  <span className="text-xs text-green-500">
                                    {
                                      fileValidationResults.filter(
                                        (e) => e.status === "valid"
                                      ).length
                                    }{" "}
                                    valid
                                  </span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <XCircle className="w-3 h-3 text-red-500" />
                                  <span className="text-xs text-red-500">
                                    {
                                      fileValidationResults.filter(
                                        (e) => e.status === "invalid"
                                      ).length
                                    }{" "}
                                    invalid
                                  </span>
                                </div>
                              </div>
                            </div>
                            <ScrollArea className="h-40 w-full rounded-md border">
                              <div className="p-2 space-y-1">
                                {fileValidationResults.map((emailObj, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center justify-between text-sm p-1 rounded hover:bg-muted/50"
                                  >
                                    <span className="truncate max-w-[70%]">
                                      {emailObj.email}
                                    </span>
                                    <div className="flex items-center space-x-2">
                                      {emailObj.status === "valid" ? (
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                      ) : (
                                        <XCircle className="w-4 h-4 text-red-500" />
                                      )}
                                      {emailObj.error && (
                                        <span className="text-xs text-red-500 truncate max-w-[120px]">
                                          {emailObj.error}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </ScrollArea>
                          </div>
                        )}
                      </TabsContent>
                    </Tabs>

                    {isValidating && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Validating emails...</span>
                          <span>{validationProgress}%</span>
                        </div>
                        <Progress value={validationProgress} className="h-2" />
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex justify-between pt-4 border-t">
                {currentStep === 1 ? (
                  <Button
                    variant="outline"
                    onClick={() => setIsEmailModalOpen(false)}
                  >
                    Cancel
                  </Button>
                ) : (
                  <Button variant="outline" onClick={handleBack}>
                    Back
                  </Button>
                )}

                <Button
                  onClick={handleCombinedSubmit}
                  disabled={
                    isValidating ||
                    (currentStep === 1 && !newListName.trim()) ||
                    emailLoading
                  }
                >
                  {currentStep === 1
                    ? "Next"
                    : isValidating
                    ? "Validating..."
                    : "Create List & Upload Emails"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Edit List Dialog */}
          <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Edit Email List</DialogTitle>
                <DialogDescription>
                  Update the details of your email list.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="editListName">List Name</Label>
                  <Input
                    id="editListName"
                    placeholder="Newsletter Subscribers"
                    value={editListName}
                    onChange={(e) => setEditListName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editListDescription">Description</Label>
                  <Textarea
                    id="editListDescription"
                    placeholder="Describe the purpose of this email list"
                    value={editListDescription}
                    onChange={(e) => setEditListDescription(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleUpdateEmailList}>
                  Update List
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* View List Details Dialog */}
          <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
            <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
              <DialogHeader>
                <DialogTitle>Email Details - {currentList?.name}</DialogTitle>
                <DialogDescription>
                  Individual email addresses and their validation status
                </DialogDescription>
              </DialogHeader>
              <div className="flex-1 overflow-hidden flex flex-col">
                <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-4">
                  <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search emails..."
                      value={emailSearchTerm}
                      onChange={(e) => setEmailSearchTerm(e.target.value)}
                      className="pl-10 w-full"
                    />
                  </div>
                  <div className="flex items-center space-x-2 w-full sm:w-auto">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => currentList && handleExportEmailList(currentList)}
                      className="flex-1 sm:flex-none"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => currentList && handleCopyEmails(currentList)}
                      className="flex-1 sm:flex-none"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy All
                    </Button>
                  </div>
                </div>

                <ScrollArea className="flex-1">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Email Address</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Added Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredEmails.map((email: any) => (
                        <TableRow key={email.id}>
                          <TableCell className="font-medium">
                            {email.address}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              {getEmailStatusIcon(email.valid)}
                              <Badge
                                variant={email.valid ? "default" : "destructive"}
                                className={
                                  email.valid
                                    ? "bg-green-500/10 text-green-500"
                                    : "bg-red-500/10 text-red-500"
                                }
                              >
                                {email.valid ? "Valid" : "Invalid"}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            {new Date(email.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(email.address)}>
                                  <Copy className="w-4 h-4 mr-2" />
                                  Copy Email
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => console.log("Remove email", email.id)}
                                >
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
                </ScrollArea>

                <div className="pt-4 border-t">
                  <div className="flex flex-col sm:flex-row items-center justify-between text-sm text-muted-foreground gap-2">
                    <span>Showing {filteredEmails.length} of {emails.length} emails</span>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        <span>
                          {emails.filter((e: any) => e.valid).length} valid
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <XCircle className="w-3 h-3 text-red-500" />
                        <span>
                          {emails.filter((e: any) => !e.valid).length} invalid
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Validation Alert */}
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Email validation helps improve deliverability. Invalid emails are
              automatically excluded from campaigns.
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Domains Content */}
      {activeTab === "domains" && (
        <div className="space-y-6">
          {/* Header Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-foreground">
                SMTP Domain Management
              </h2>
              <p className="text-muted-foreground">
                Configure domains, SMTP servers, and monitor email delivery
              </p>
            </div>
            <Dialog
              open={isAddDomainDialogOpen}
              onOpenChange={(open) => {
                setIsAddDomainDialogOpen(open);
                if (!open) {
                  resetDomainForm();
                }
              }}
            >
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90 w-full sm:w-auto">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Domain
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {domainCurrentStep === 1
                      ? "Add New Domain"
                      : "Configure SMTP Settings"}
                  </DialogTitle>
                  <DialogDescription>
                    {domainCurrentStep === 1
                      ? "Enter the domain you want to use for sending emails"
                      : "Configure SMTP settings for your domain"}
                  </DialogDescription>
                </DialogHeader>

                {/* Step Indicator */}
                <div className="flex items-center justify-center mb-6">
                  <div className="flex items-center">
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full ${
                        domainCurrentStep >= 1
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      1
                    </div>
                    <div
                      className={`w-16 h-1 mx-2 ${
                        domainCurrentStep >= 2 ? "bg-primary" : "bg-muted"
                      }`}
                    ></div>
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full ${
                        domainCurrentStep >= 2
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      2
                    </div>
                  </div>
                </div>

                {/* Step 1: Domain Name */}
                {domainCurrentStep === 1 && (
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
                      <Button onClick={handleDomainNextStep} disabled={!newDomain}>
                        Next
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 2: SMTP Configuration */}
                {domainCurrentStep === 2 && (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="fromEmail" className="flex items-center">
                          From Email Address <span className="text-red-500 ml-1">*</span>
                        </Label>
                        <Input
                          id="fromEmail"
                          type="email"
                          placeholder={`noreply@${newDomain}`}
                          value={smtpForm.fromEmail}
                          onChange={(e) =>
                            setSmtpForm((prev) => ({
                              ...prev,
                              fromEmail: e.target.value,
                            }))
                          }
                        />
                        <p className="text-sm text-muted-foreground">
                          This email will appear as the sender for all campaigns using this domain.
                          {smtpForm.provider === 'custom' && ' Must be a valid email address from this domain.'}
                        </p>
                      </div>

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

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                    <div className="flex flex-col sm:flex-row justify-between gap-2">
                      <Button variant="outline" onClick={handleDomainPrevStep} className="order-2 sm:order-1">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                      </Button>
                      <Button onClick={handleAddDomain} disabled={domainLoading} className="order-1 sm:order-2">
                        {domainLoading ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          'Create Domain'
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                  <Button onClick={() => setIsAddDomainDialogOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Domain
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Domain</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="hidden lg:table-cell">SMTP Provider</TableHead>
                        <TableHead className="hidden md:table-cell">Daily Limit</TableHead>
                        <TableHead className="hidden sm:table-cell">Warmup</TableHead>
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
                          <TableCell>{getStatusBadgeDomain(domain)}</TableCell>
                          <TableCell className="hidden lg:table-cell">
                            <div className="flex items-center space-x-2">
                              <Server className="w-4 h-4 text-muted-foreground" />
                              <span className="capitalize">
                                {getSmtpProvider(domain)}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="space-y-1">
                              <div className="text-sm">
                                <span className="font-medium">
                                  {getDailyLimit(domain).toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">{getWarmupBadge(domain)}</TableCell>
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
                </div>
              )}
            </CardContent>
          </Card>

          {/* Domain Configuration Dialog */}
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
                      <Label htmlFor="fromEmail" className="flex items-center">
                        From Email Address <span className="text-red-500 ml-1">*</span>
                      </Label>
                      <Input
                        id="fromEmail"
                        type="email"
                        placeholder={`noreply@${selectedDomain?.domain}`}
                        value={smtpForm.fromEmail}
                        onChange={(e) =>
                          setSmtpForm((prev) => ({
                            ...prev,
                            fromEmail: e.target.value,
                          }))
                        }
                      />
                      <p className="text-sm text-muted-foreground">
                        This email will appear as the sender for all campaigns using this domain.
                        {smtpForm.provider === 'custom' && ' Must be a valid email address from this domain.'}
                      </p>
                    </div>

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

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      disabled={isTestingConnection || domainLoading}
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

              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setIsConfigDialogOpen(false)}
                  className="order-2 sm:order-1"
                >
                  Cancel
                </Button>
                <Button onClick={handleUpdateDomain} disabled={domainLoading} className="order-1 sm:order-2">
                  Save Configuration
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Analytics Dialog */}
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
      )}
    </div>
  );
}

export default EmailManagementDashboard