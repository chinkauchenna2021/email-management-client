"use client";

import {
  useState,
  useEffect,
  useRef,
  Key,
  ReactNode,
  ReactPortal,
  AwaitedReactNode,
  ReactElement,
  JSXElementConstructor,
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
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import {useRouter} from "next/navigation";
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
} from "lucide-react";
import { EmailList, useEmailListStore } from "@/store/emailListStore";
import {  toast } from 'react-toastify';
import { useEmailValidation } from "@/hooks/useEmailValidation";
import { ValidationStats } from "../email-validation/ValidationStats";
import { EmailValidationItem } from "../email-validation/EmailValidationItem";

export function EmailLists() {
  // Combined dialog state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // 1 for create list, 2 for upload emails
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
  const router = useRouter()

  const {
    emailLists,
    currentList,
    emails,
    isLoading,
    error,
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
    clearError,
  } = useEmailListStore();


// Inside your EmailLists component, add the validation hook
const {
  results: validationResults,
  loading: validationLoading,
  validateEmail,
  validateBatch,
  clearValidation
} = useEmailValidation();




const handleEmailInput = async (value: string) => {
  setBulkEmails(value);

  // Extract emails from text
  const emails = value
    .split(/[,\s\n]+/)
    .filter((email) => email.trim() !== '');

  // Clear validation for removed emails
  Object.keys(validationResults).forEach(email => {
    if (!emails.includes(email)) {
      clearValidation(email);
    }
  });

  // Validate new emails
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

// Enhanced validation display component
// const EnhancedValidationDisplay = () => {
//   const emails = bulkEmails
//     .split(/[,\s\n]+/)
//     .filter((email) => email.trim() !== '');

//   if (emails.length === 0) {
//     return null;
//   }

//   const validCount = emails.filter(email => 
//     validationResults[email]?.isValid
//   ).length;
  
//   const invalidCount = emails.filter(email => 
//     validationResults[email] && !validationResults[email]?.isValid
//   ).length;
  
//   const pendingCount = emails.filter(email => 
//     validationLoading.has(email) || !validationResults[email]
//   ).length;

//   const [viewMode, setViewMode] = useState<'all' | 'valid' | 'invalid'>('all');
//   const [searchTerm, setSearchTerm] = useState('');

//   // Filter emails based on view mode and search
//   const filteredEmails = emails.filter(email => {
//     const matchesSearch = email.toLowerCase().includes(searchTerm.toLowerCase());
//     const result = validationResults[email];
    
//     if (!matchesSearch) return false;
    
//     switch (viewMode) {
//       case 'valid':
//         return result?.isValid;
//       case 'invalid':
//         return result && !result?.isValid;
//       default:
//         return true;
//     }
//   });

//   return (
//     <div className="space-y-4">
//       {/* Header with Stats and Controls */}
//       <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
//         <div className="flex items-center justify-between mb-4">
//           <div>
//             <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
//               <CheckCircle className="w-5 h-5 text-green-600" />
//               Email Validation Results
//             </h3>
//             <p className="text-sm text-gray-600 mt-1">
//               {emails.length} email{emails.length !== 1 ? 's' : ''} processed
//             </p>
//           </div>
          
//           {/* View Mode Toggle */}
//           <div className="flex items-center gap-2 bg-white rounded-lg p-1 border">
//             <Button
//               variant={viewMode === 'all' ? 'default' : 'ghost'}
//               size="sm"
//               onClick={() => setViewMode('all')}
//               className={`text-xs ${viewMode === 'all' ? 'shadow-sm' : ''}`}
//             >
//               All ({emails.length})
//             </Button>
//             <Button
//               variant={viewMode === 'valid' ? 'default' : 'ghost'}
//               size="sm"
//               onClick={() => setViewMode('valid')}
//               className={`text-xs ${viewMode === 'valid' ? 'bg-green-50 text-green-700 border-green-200' : ''}`}
//             >
//               Valid ({validCount})
//             </Button>
//             <Button
//               variant={viewMode === 'invalid' ? 'default' : 'ghost'}
//               size="sm"
//               onClick={() => setViewMode('invalid')}
//               className={`text-xs ${viewMode === 'invalid' ? 'bg-red-50 text-red-700 border-red-200' : ''}`}
//             >
//               Invalid ({invalidCount})
//             </Button>
//           </div>
//         </div>

//         {/* Progress Bar */}
//         <div className="space-y-2">
//           <div className="flex justify-between text-xs text-gray-600">
//             <span>Validation Progress</span>
//             <span>{emails.length - pendingCount}/{emails.length}</span>
//           </div>
//           <div className="w-full bg-gray-200 rounded-full h-2">
//             <div 
//               className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
//               style={{ 
//                 width: `${((emails.length - pendingCount) / emails.length) * 100}%` 
//               }}
//             />
//           </div>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-3 gap-3 mt-4">
//           <div className={`text-center p-3 rounded-lg border transition-all ${
//             pendingCount > 0 ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50 border-gray-200'
//           }`}>
//             <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
//             <div className="text-xs text-yellow-700">Pending</div>
//           </div>
//           <div className="text-center p-3 rounded-lg bg-green-50 border border-green-200">
//             <div className="text-2xl font-bold text-green-600">{validCount}</div>
//             <div className="text-xs text-green-700">Valid</div>
//           </div>
//           <div className="text-center p-3 rounded-lg bg-red-50 border border-red-200">
//             <div className="text-2xl font-bold text-red-600">{invalidCount}</div>
//             <div className="text-xs text-red-700">Invalid</div>
//           </div>
//         </div>
//       </div>

//       {/* Search and Filter Bar */}
//       <div className="flex items-center gap-3">
//         <div className="flex-1 relative">
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//           <Input
//             placeholder="Search emails..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="pl-9 pr-4"
//           />
//         </div>
//         <div className="text-sm text-gray-500">
//           {filteredEmails.length} of {emails.length} shown
//         </div>
//       </div>

//       {/* Email List */}
//       <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
//         <div className="max-h-80 overflow-y-auto">
//           {filteredEmails.length === 0 ? (
//             <div className="text-center py-12 text-gray-500">
//               <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
//               <p className="font-medium">No emails found</p>
//               <p className="text-sm mt-1">
//                 {searchTerm ? 'Try adjusting your search or filter' : 'All emails are filtered out'}
//               </p>
//             </div>
//           ) : (
//             <div className="divide-y divide-gray-100">
//               {filteredEmails.map((email, index) => (
//                 <EmailValidationItem
//                   key={`${email}-${index}`}
//                   email={email}
//                   result={validationResults[email]}
//                   isLoading={validationLoading.has(email)}
//                   onRemove={(emailToRemove) => {
//                     const newEmails = emails.filter(e => e !== emailToRemove);
//                     setBulkEmails(newEmails.join('\n'));
//                     clearValidation(emailToRemove);
//                   }}
//                 />
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Quick Actions Footer */}
//       <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200">
//         <div className="flex items-center gap-2 text-sm text-gray-700">
//           {pendingCount > 0 ? (
//             <>
//               <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
//               <span>Validating {pendingCount} email{pendingCount !== 1 ? 's' : ''}...</span>
//             </>
//           ) : (
//             <>
//               <CheckCircle className="w-4 h-4 text-green-600" />
//               <span>All emails validated successfully</span>
//             </>
//           )}
//         </div>
        
//         <div className="flex items-center gap-2">
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => validateBatch(emails)}
//             disabled={pendingCount === 0}
//             className="gap-2"
//           >
//             <RefreshCw className="w-4 h-4" />
//             Re-validate All
//           </Button>
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => {
//               setBulkEmails('');
//               clearValidation();
//             }}
//             className="gap-2 text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
//           >
//             <Trash2 className="w-4 h-4" />
//             Clear All
//           </Button>
          
//           {validCount > 0 && (
//             <Button
//               size="sm"
//               onClick={() => {
//                 // Export valid emails functionality
//                 const validEmails = emails.filter(email => 
//                   validationResults[email]?.isValid
//                 );
//                 // Implement export logic here
//                 console.log('Exporting valid emails:', validEmails);
//               }}
//               className="gap-2 bg-green-600 hover:bg-green-700"
//             >
//               <Download className="w-4 h-4" />
//               Export Valid ({validCount})
//             </Button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };









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
      <div className=" from-blue-50 to-indigo-50 rounded-xl p-4  border mr-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 text-white">
              <CheckCircle className="w-5 h-5 " />
              Email Validation Results
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              {emails.length} email{emails.length !== 1 ? 's' : ''} processed
            </p>
          </div>
          
          {/* View Mode Toggle */}
          <div className="flex items-center gap-2  p-1 border">
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
          <div className="flex justify-between text-xs text-slate-400">
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
      <div className="flex items-center gap-3 pr-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search emails..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4"
          />
        </div>
        <div className="text-sm text-gray-500">
          {filteredEmails.length} of {emails.length} shown
        </div>
      </div>

      {/* Email List */}
      <div className=" overflow-hidden pr-4">
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
            <div className="divide-y divide-gray-100 ">
              {filteredEmails.map((email, index) => (
                <EmailValidationItem
                  key={`${email}-${index}`}
                  email={email}
                  result={validationResults[email]}
                  isLoading={validationLoading.has(email)}
                  onRemove={(emailToRemove:any) => {
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
      <div className="flex items-center justify-between p-4  rounded-xl border mr-1">
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
        
        <div className="flex items-center gap-2">
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
          
          {/* {validCount > 0 && (
            <Button
              size="sm"
              onClick={() => {
                // Export valid emails functionality
                const validEmails = emails.filter(email => 
                  validationResults[email]?.isValid
                );
                // Implement export logic here
                console.log('Exporting valid emails:', validEmails);
              }}
              className="gap-2 bg-green-600 hover:bg-green-700"
            >
              <Download className="w-4 h-4" />
              Export Valid ({validCount})
            </Button>
          )} */}
        </div>
      </div>
    </div>
  );
};












  useEffect(() => {
    fetchEmailLists();
    console.log(emailLists, emails , "=============emailLists================")
  }, []);


  useEffect(() => {
    if (error) {
      toast(error.toString());
      clearError();
    }
  }, [error, toast, clearError]);

  // Email validation function
  // const validateEmail = (
  //   email: string
  // ): { status: "valid" | "invalid"; error?: string } => {
  //   if (!email.trim()) {
  //     return { status: "invalid", error: "Email is required" };
  //   }

  //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   if (!emailRegex.test(email)) {
  //     return { status: "invalid", error: "Invalid email format" };
  //   }

  //   return { status: "valid" };
  // };

  // Handle email input with real-time validation
  // const handleEmailInput = (value: string) => {
  //   setBulkEmails(value);

  //   // Extract the current line being typed
  //   const lines = value.split("\n");
  //   const currentLine = lines[lines.length - 1];
  //   setCurrentEmail(currentLine);

  //   // Validate all emails
  //   const emails = value
  //     .split(/[,\s\n]+/)
  //     .filter((email) => email.trim() !== "");
  //   const results = emails.map((email) => {
  //     const validation = validateEmail(email.trim()) as any;
  //     return {
  //       email: email.trim(),
  //       status: validation.status,
  //       error: validation.error,
  //     };
  //   });

  //   setEmailValidationResults(results);
  // };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      processFile(selectedFile);
    }
  };

  // Process uploaded file
  const processFile = (selectedFile: File) => {
    setIsProcessingFile(true);
    setFileProcessingProgress(0);

    const reader = new FileReader();

    reader.onload = (e) => {
      const content = e.target?.result as string;
      // Extract emails from file content (handle both CSV and plain text)
      let emails: string[] = [];

      if (selectedFile.name.endsWith(".csv")) {
        // Simple CSV parsing - assuming emails are in the first column
        const lines = content.split("\n");
        emails = lines
          .slice(1) // Skip header row
          .map((line) => line.split(",")[0].trim()) // Get first column
          .filter((email) => email !== "");
      } else {
        // Plain text file - one email per line
        emails = content
          .split(/[,\s\n]+/)
          .filter((email) => email.trim() !== "");
      }

      setFileEmails(emails);

      // Validate emails with progress simulation
      const totalEmails = emails.length;
      let processed = 0;

      const validationInterval = setInterval(() => {
        if (processed >= totalEmails) {
          clearInterval(validationInterval);
          setIsProcessingFile(false);
          return;
        }

        // Process in batches for better performance
        const batchSize = Math.min(100, totalEmails - processed);
        const batch = emails.slice(processed, processed + batchSize);

        const batchResults = batch.map((email) => {
          const validation = validateEmail(email.trim()) as any;
          return {
            email: email.trim(),
            status: validation.status,
            error: validation.error,
          };
        });

        setFileValidationResults((prev) => [...prev, ...batchResults]);
        processed += batchSize;
        setFileProcessingProgress(Math.round((processed / totalEmails) * 100));
      }, 50);
    };

    reader.readAsText(selectedFile);
  };

  // Handle combined submission (create list and upload emails)
  // const handleCombinedSubmit = async () => {
  //   if (currentStep === 1) {
  //     // Validate list name and description
  //     if (!newListName.trim()) {
  //       toast({
  //         title: "Name required",
  //         description: "Please enter a name for the email list.",
  //         variant: "destructive",
  //       });
  //       return;
  //     }
  //     // Move to next step
  //     setCurrentStep(2);
  //   } else {
  //     // Handle email upload and validation
  //     setIsValidating(true);
  //     setValidationProgress(0);

  //     try {
  //       // Determine which emails to upload (from textarea or file)
  //       const emailsToUpload =
  //         fileEmails.length > 0
  //           ? fileEmails.filter(
  //               (email) =>
  //                 fileValidationResults.find((r) => r.email === email)
  //                   ?.status === "valid"
  //             )
  //           : emailValidationResults
  //               .filter((r) => r.status === "valid")
  //               .map((r) => r.email);

  //       if (emailsToUpload.length === 0) {
  //         toast({
  //           title: "No valid emails",
  //           description: "Please add at least one valid email address.",
  //           variant: "destructive",
  //         });
  //         setIsValidating(false);
  //         return;
  //       }

  //       // Simulate validation progress
  //       const interval = setInterval(() => {
  //         setValidationProgress((prev) => {
  //           if (prev >= 100) {
  //             clearInterval(interval);
  //             setIsValidating(false);

  //             // First create the email list
  //             createEmailList(newListName, newListDescription, emailsToUpload)
  //               .then((newList) => {
  //                 console.log("List created successfully:", newList);
  //                 setIsModalOpen(false);
  //                 resetModalState();
  //                 toast({
  //                   title: "List created",
  //                   description: `Your email list has been created with ${emailsToUpload.length} emails.`,
  //                 });
  //               })
  //               .catch((error) => {
  //                 // Error is handled by the useEffect above
  //               });
  //             return 100;
  //           }
  //           return prev + 10;
  //         });
  //       }, 200);
  //       await fetchEmailLists(); // Add this line
  //       router.push("/")
  //     } catch (error: any) {
  //       toast({
  //         title: "Creation Failed",
  //         description: error.message || "Failed to create email list",
  //         variant: "destructive",
  //       });
  //       setIsValidating(false);
  //     }
  //   }
  // };

const handleCombinedSubmit = async () => {
  if (currentStep === 1) {
    // Validate list name and description
    if (!newListName.trim()) {
      toast("Please enter a name for the email list.");
      return;
    }
    // Move to next step
    setCurrentStep(2);
  } else {
    // Handle email upload and validation
    setIsValidating(true);
    setValidationProgress(0);

    try {
      // Determine which emails to upload (from textarea or file)
      const emailsToUpload =
        fileEmails.length > 0
          ? fileEmails.filter(
              (email) =>
                fileValidationResults.find((r) => r.email === email)
                  ?.status === "valid"
            )
          : emailValidationResults
              .filter((r) => r.status === "valid")
              .map((r) => r.email);

      if (emailsToUpload.length === 0) {
        toast("Please add at least one valid email address.");
        setIsValidating(false);
        return;
      }

      // Simulate validation progress
      const interval = setInterval(() => {
        setValidationProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsValidating(false);

            // Create the email list
            createEmailList(newListName, newListDescription, emailsToUpload)
              .then((newList) => {
                console.log("List created successfully:", newList);
                setIsModalOpen(false);
                resetModalState();
                
                // Force refresh the email lists
                fetchEmailLists().then(() => {
                  toast(`Your email list has been created with ${emailsToUpload.length} emails.`);
                });
              })
              .catch((error) => {
                toast( error.message || "Failed to create email list");
              });
            return 100;
          }
          return prev + 10;
        });
      }, 200);
      
    } catch (error: any) {
      toast( error.message || "Failed to create email list");
      setIsValidating(false);
    }
  }
};

  // Reset modal state
  const resetModalState = () => {
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

  // Handle going back to the previous step
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Handle closing the dialog and resetting state
  const handleModalClose = (open: boolean) => {
    if (!open) {
      resetModalState();
    }
    setIsModalOpen(open);
  };

  // Trigger file input click
  const handleChooseFileClick = () => {
    fileInputRef.current?.click();
  };

  // Handle delete email list

// In your EmailLists component - enhance the handlers

// Handle delete with confirmation
const handleDeleteEmailList = async (listId: string) => {
  // Find the list name for the confirmation message
  const listToDelete = emailLists.find(list => list.id === listId);
  
  if (!confirm(`Are you sure you want to delete the email list "${listToDelete?.name}"? This action cannot be undone.`)) {
    return;
  }

  try {
    await deleteEmailList(listId);
    
    // The store update should automatically remove it from the UI
    // But let's also explicitly refresh to ensure consistency
    await fetchEmailLists();

    toast("The email list has been deleted successfully.");
  } catch (error: any) {
    toast(error.message || "Failed to delete email list");
  }
};
// Enhanced view handler
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

// Enhanced edit handler
const handleEditEmailList = async (list: EmailList) => {
  setEditingList(list);
  setEditListName(list.name);
  setEditListDescription(list.description || "");
  setIsEditModalOpen(true);
};



  // const handleDeleteEmailList = async (listId: string) => {
  //   try {
  //     await deleteEmailList(listId);
  //     await fetchEmailLists();
  //     toast({
  //       title: "List deleted",
  //       description: "The email list has been deleted successfully.",
  //     });
  //     router.push("/")
  //   } catch (error) {
  //     // Error is handled by the useEffect above
  //   }
  // };

  // // Handle view email list details
  // const handleViewEmailList = async (listId: string) => {
  //   try {
  //     await getEmailListWithStats(listId);
  //     await getEmailsInList(listId);
  //     setSelectedList(listId);
  //     setIsViewModalOpen(true);
  //   } catch (error) {
  //     // Error is handled by the useEffect above
  //   }
  // };

  // // Handle edit email list
  // const handleEditEmailList = async (list: EmailList) => {
  //   setEditingList(list);
  //   setEditListName(list.name);
  //   setEditListDescription(list.description || "");
  //   setIsEditModalOpen(true);
  // };

  // Handle update email list
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

  // Handle export email list
  const handleExportEmailList = async (list: EmailList) => {
    try {
      // Get the full list with emails
      await getEmailsInList(list.id);
      
      // Create CSV content
      const headers = "Email Address,Status,Added Date\n";
      const csvContent = emails
        .map((email:any) => 
          `"${email.address}",${email.valid ? "Valid" : "Invalid"},"${new Date(email.createdAt).toLocaleDateString()}"`
        )
        .join("\n");
      
      const fullCsv = headers + csvContent;
      
      // Create and download file
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

  // Handle copy emails to clipboard
  const handleCopyEmails = async (list: EmailList) => {
    try {
      await getEmailsInList(list.id);
      const emailList = emails.map((email:any) => email.address).join("\n");
      await navigator.clipboard.writeText(emailList);
      
      toast(`Copied ${emails.length} emails to clipboard.`);
    } catch (error) {
      toast( "Failed to copy emails to clipboard.");
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

  const filteredLists = ((emailLists as any)?.emailLists || []).filter(
    (list: EmailList) =>
      String(list?.name).toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(list?.description).toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter emails for the view modal
  const filteredEmails = emails.filter((email:any) =>
    email.address.toLowerCase().includes(emailSearchTerm.toLowerCase())
  );

  // Focus textarea when dialog opens to step 2
  useEffect(() => {
    if (isModalOpen && currentStep === 2 && textareaRef.current) {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
  }, [isModalOpen, currentStep]);

  if (isLoading && !emailLists) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="w-6 h-6 animate-spin mr-2" />
        Loading email lists...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Email Lists</h1>
          <p className="text-muted-foreground">
            Manage your email subscriber lists and segments
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {/* Combined Create and Upload Dialog */}
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-primary hover:bg-primary/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create List
          </Button>

          <Dialog open={isModalOpen} onOpenChange={handleModalClose}>
            <DialogContent className="sm:max-w-lg">
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
                <div className=" overflow-hidden px-auto pr-2">
                <div className="max-h-100 overflow-y-auto ">
                <div className="space-y-4">
                  <Tabs defaultValue="paste" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="paste">Paste Emails</TabsTrigger>
                      <TabsTrigger value="upload">Upload File</TabsTrigger>
                    </TabsList>

                    {/* <TabsContent value="paste" className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="emails">Email Addresses</Label>
                        <Textarea
                          ref={textareaRef}
                          id="emails"
                          placeholder="john@example.com&#10;jane@company.com&#10;user@domain.co"
                          value={bulkEmails}
                          onChange={(e) => handleEmailInput(e.target.value)}
                          rows={8}
                          className="resize-none"
                        />
                        <div className="flex justify-between items-center">
                          <p className="text-xs text-muted-foreground">
                            {emailValidationResults.length} emails detected
                          </p>
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <CheckCircle className="w-3 h-3 text-green-500" />
                              <span className="text-xs text-green-500">
                                {
                                  emailValidationResults.filter(
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
                                  emailValidationResults.filter(
                                    (e) => e.status === "invalid"
                                  ).length
                                }{" "}
                                invalid
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {emailValidationResults.length > 0 && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">
                              Validation Results
                            </span>
                            <Badge variant="outline" className="text-xs">
                              Real-time
                            </Badge>
                          </div>
                          <ScrollArea className="h-40 w-full rounded-md border">
                            <div className="p-2 space-y-1">
                              {emailValidationResults.map((emailObj, index) => (
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

                     {currentEmail && (
                        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium">
                              Current email:
                            </span>
                            <span className="text-sm">{currentEmail}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            {validateEmail(currentEmail).status === "valid" ? (
                              <>
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span className="text-sm text-green-500">
                                  Valid
                                </span>
                              </>
                            ) : (
                              <>
                                <XCircle className="w-4 h-4 text-red-500" />
                                <span className="text-sm text-red-500">
                                  Invalid
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      )} 
                      <EnhancedValidationDisplay/>

                    </TabsContent> */}
                      <TabsContent value="paste" className="space-y-6">
                        <div className="space-y-4">
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

                          {/* Enhanced Validation Display */}
                          <EnhancedValidationDisplay />
                        </div>
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
                              Drag and drop your CSV file here, or click to
                              browse
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

                      {/* File processing progress */}
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

                      {/* File validation results */}
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
                </div>
                </div>
              )}

              <div className="flex justify-between">
                {currentStep === 1 ? (
                  <Button
                    variant="outline"
                    onClick={() => setIsModalOpen(false)}
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
                    isLoading
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
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search lists..."
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

      {/* Lists Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLists.map(
          (list: EmailList) => (
            <Card key={list.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-primary" />
                    <CardTitle className="text-lg">{list.name}</CardTitle>
                  </div>


                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    {/* <Button variant="ghost" className="h-8 w-8 p-0"> */}
                      <MoreHorizontal className="h-4 w-4" />
                    {/* </Button> */}
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
          )
        )}
      </div>

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
            <div className="flex items-center justify-between mb-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search emails..."
                  value={emailSearchTerm}
                  onChange={(e) => setEmailSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => currentList && handleExportEmailList(currentList)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => currentList && handleCopyEmails(currentList)}
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
                  {filteredEmails.map((email:any) => (
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
                        {/* <Button variant="ghost" className="h-8 w-8 p-0"> */}
                          <MoreHorizontal className="h-4 w-4" />
                        {/* </Button> */}
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
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Showing {filteredEmails.length} of {emails.length} emails</span>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    <span>
                      {emails.filter((e:any) => e.valid).length} valid
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <XCircle className="w-3 h-3 text-red-500" />
                    <span>
                      {emails.filter((e:any) => !e.valid).length} invalid
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
  );
}