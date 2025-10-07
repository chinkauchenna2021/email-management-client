"use client"

import { useState, useEffect, useRef, AwaitedReactNode, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
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
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
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
} from "lucide-react"
import { EmailList, useEmailListStore } from '@/store/emailListStore'
import { useToast } from "@/hooks/use-toast"
// import {  Dropdown,  DropdownTrigger,  DropdownMenu as dropdown,  DropdownSection,  DropdownItem} from "@heroui/react";

export function EmailLists() {
  const { toast } = useToast()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [selectedList, setSelectedList] = useState<string | null>(null)
  const [newListName, setNewListName] = useState("")
  const [newListDescription, setNewListDescription] = useState("")
  const [bulkEmails, setBulkEmails] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [validationProgress, setValidationProgress] = useState(0)
  const [isValidating, setIsValidating] = useState(false)
  const [emailValidationResults, setEmailValidationResults] = useState<{email: string, status: 'valid' | 'invalid' | 'pending', error?: string}[]>([])
  const [currentEmail, setCurrentEmail] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  
  // File upload states
  const [file, setFile] = useState<File | null>(null)
  const [fileEmails, setFileEmails] = useState<string[]>([])
  const [fileValidationResults, setFileValidationResults] = useState<{email: string, status: 'valid' | 'invalid' | 'pending', error?: string}[]>([])
  const [isProcessingFile, setIsProcessingFile] = useState(false)
  const [fileProcessingProgress, setFileProcessingProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

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
    clearError
  } = useEmailListStore()

  useEffect(() => {
    fetchEmailLists()
  }, [])

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      })
      clearError()
    }
  }, [error, toast, clearError])

  // Email validation function
  const validateEmail = (email: string): {status: 'valid' | 'invalid', error?: string} => {
    if (!email.trim()) {
      return { status: 'invalid', error: 'Email is required' }
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return { status: 'invalid', error: 'Invalid email format' }
    }
    
    return { status: 'valid' }
  }

  // Handle email input with real-time validation
  const handleEmailInput = (value: string) => {
    setBulkEmails(value)
    
    // Extract the current line being typed
    const lines = value.split('\n')
    const currentLine = lines[lines.length - 1]
    setCurrentEmail(currentLine)
    
    // Validate all emails
    const emails = value.split(/[,\s\n]+/).filter(email => email.trim() !== '')
    const results = emails.map(email => {
      const validation = validateEmail(email.trim())
      return {
        email: email.trim(),
        status: validation.status,
        error: validation.error
      }
    })
    
    setEmailValidationResults(results)
  }

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)
      processFile(selectedFile)
    }
  }

  // Process uploaded file
  const processFile = (selectedFile: File) => {
    setIsProcessingFile(true)
    setFileProcessingProgress(0)
    
    const reader = new FileReader()
    
    reader.onload = (e) => {
      const content = e.target?.result as string
      // Extract emails from file content (handle both CSV and plain text)
      let emails: string[] = []
      
      if (selectedFile.name.endsWith('.csv')) {
        // Simple CSV parsing - assuming emails are in the first column
        const lines = content.split('\n')
        emails = lines
          .slice(1) // Skip header row
          .map(line => line.split(',')[0].trim()) // Get first column
          .filter(email => email !== '')
      } else {
        // Plain text file - one email per line
        emails = content.split(/[,\s\n]+/).filter(email => email.trim() !== '')
      }
      
      setFileEmails(emails)
      
      // Validate emails with progress simulation
      const totalEmails = emails.length
      let processed = 0
      
      const validationInterval = setInterval(() => {
        if (processed >= totalEmails) {
          clearInterval(validationInterval)
          setIsProcessingFile(false)
          return
        }
        
        // Process in batches for better performance
        const batchSize = Math.min(100, totalEmails - processed)
        const batch = emails.slice(processed, processed + batchSize)
        
        const batchResults = batch.map(email => {
          const validation = validateEmail(email.trim())
          return {
            email: email.trim(),
            status: validation.status,
            error: validation.error
          }
        })
        
        setFileValidationResults(prev => [...prev, ...batchResults])
        processed += batchSize
        setFileProcessingProgress(Math.round((processed / totalEmails) * 100))
      }, 50)
    }
    
    reader.readAsText(selectedFile)
  }

  // Handle bulk upload with validation
  const handleBulkUpload = async () => {
    setIsValidating(true)
    setValidationProgress(0)

    try {
      // Determine which emails to upload (from textarea or file)
      const emailsToUpload = fileEmails.length > 0 
        ? fileEmails.filter(email => fileValidationResults.find(r => r.email === email)?.status === 'valid')
        : emailValidationResults.filter(r => r.status === 'valid').map(r => r.email)
      
      if (emailsToUpload.length === 0) {
        toast({
          title: "No valid emails",
          description: "Please add at least one valid email address.",
          variant: "destructive",
        })
        setIsValidating(false)
        return
      }
      
      // Simulate validation progress
      const interval = setInterval(() => {
        setValidationProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            setIsValidating(false)
            setIsUploadDialogOpen(false)
            setBulkEmails("")
            setEmailValidationResults([])
            setCurrentEmail("")
            setFile(null)
            setFileEmails([])
            setFileValidationResults([])
            
            toast({
              title: "Emails uploaded",
              description: `${emailsToUpload.length} emails have been added to the list.`,
            })
            return 100
          }
          return prev + 10
        })
      }, 200)
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error uploading the emails. Please try again.",
        variant: "destructive",
      })
      setIsValidating(false)
    }
  }

  // Trigger file input click
  const handleChooseFileClick = () => {
    fileInputRef.current?.click()
  }

  // Handle create email list
  const handleCreateEmailList = async () => {
    if (!newListName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter a name for the email list.",
        variant: "destructive",
      })
      return
    }

    try {
      await createEmailList(newListName, newListDescription)
      
      setIsCreateDialogOpen(false)
      setNewListName("")
      setNewListDescription("")
      
      toast({
        title: "List created",
        description: "Your email list has been created successfully.",
      })
    } catch (error) {
      // Error is handled by the useEffect above
    }
  }

  // Handle delete email list
  const handleDeleteEmailList = async (listId: string) => {
    try {
      await deleteEmailList(listId)
      
      toast({
        title: "List deleted",
        description: "The email list has been deleted successfully.",
      })
    } catch (error) {
      // Error is handled by the useEffect above
    }
  }

  // Handle view email list details
  const handleViewEmailList = async (listId: string) => {
    try {
      await getEmailListWithStats(listId)
      await getEmailsInList(listId)
      setSelectedList(listId)
    } catch (error) {
      // Error is handled by the useEffect above
    }
  }

  const getStatusBadge = (status?: string) => {
    // Since the store doesn't have a status field, we'll use a default
    return <Badge className="bg-green-500/10 text-green-500">Active</Badge>
  }

  const getEmailStatusIcon = (valid: boolean) => {
    return valid 
      ? <CheckCircle className="w-4 h-4 text-green-500" />
      : <XCircle className="w-4 h-4 text-red-500" />
  }




//  console.log("================EmailList :", emailLists.emailLists as any , emails , "Email");
    const filteredLists = ((emailLists as any)?.emailLists).filter(
      (list: EmailList) =>
        (String(list?.name).toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(list?.description).toLowerCase().includes(searchTerm.toLowerCase()))
    );

  // Focus textarea when dialog opens
  useEffect(() => {
    if (isUploadDialogOpen && textareaRef.current) {
      setTimeout(() => {
        textareaRef.current?.focus()
      }, 100)
    }
  }, [isUploadDialogOpen])





    if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="w-6 h-6 animate-spin mr-2" />
        Loading emailList...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Email Lists</h1>
          <p className="text-muted-foreground">Manage your email subscriber lists and segments</p>
        </div>
        <div className="flex items-center space-x-2">
          <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Upload className="w-4 h-4 mr-2" />
                Upload List
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Upload Email List</DialogTitle>
                <DialogDescription>
                  Upload emails in bulk. Paste one email per line or upload a CSV file.
                </DialogDescription>
              </DialogHeader>
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
                              {emailValidationResults.filter(e => e.status === 'valid').length} valid
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <XCircle className="w-3 h-3 text-red-500" />
                            <span className="text-xs text-red-500">
                              {emailValidationResults.filter(e => e.status === 'invalid').length} invalid
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Real-time validation results */}
                    {emailValidationResults.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Validation Results</span>
                          <Badge variant="outline" className="text-xs">
                            Real-time
                          </Badge>
                        </div>
                        <ScrollArea className="h-40 w-full rounded-md border">
                          <div className="p-2 space-y-1">
                            {emailValidationResults.map((emailObj, index) => (
                              <div key={index} className="flex items-center justify-between text-sm p-1 rounded hover:bg-muted/50">
                                <span className="truncate max-w-[70%]">{emailObj.email}</span>
                                <div className="flex items-center space-x-2">
                                  {emailObj.status === 'valid' ? (
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

                    {/* Current email validation */}
                    {currentEmail && (
                      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium">Current email:</span>
                          <span className="text-sm">{currentEmail}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {validateEmail(currentEmail).status === 'valid' ? (
                            <>
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span className="text-sm text-green-500">Valid</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4 text-red-500" />
                              <span className="text-sm text-red-500">Invalid</span>
                            </>
                          )}
                        </div>
                      </div>
                    )}
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
                          <Button variant="outline" size="sm" onClick={handleChooseFileClick}>
                            Choose Different File
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground mb-2">
                            Drag and drop your CSV file here, or click to browse
                          </p>
                          <Button variant="outline" size="sm" onClick={handleChooseFileClick}>
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
                        <Progress value={fileProcessingProgress} className="h-2" />
                      </div>
                    )}

                    {/* File validation results */}
                    {fileValidationResults.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">File Validation Results</span>
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <CheckCircle className="w-3 h-3 text-green-500" />
                              <span className="text-xs text-green-500">
                                {fileValidationResults.filter(e => e.status === 'valid').length} valid
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <XCircle className="w-3 h-3 text-red-500" />
                              <span className="text-xs text-red-500">
                                {fileValidationResults.filter(e => e.status === 'invalid').length} invalid
                              </span>
                            </div>
                          </div>
                        </div>
                        <ScrollArea className="h-40 w-full rounded-md border">
                          <div className="p-2 space-y-1">
                            {fileValidationResults.map((emailObj, index) => (
                              <div key={index} className="flex items-center justify-between text-sm p-1 rounded hover:bg-muted/50">
                                <span className="truncate max-w-[70%]">{emailObj.email}</span>
                                <div className="flex items-center space-x-2">
                                  {emailObj.status === 'valid' ? (
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

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleBulkUpload} 
                    disabled={isValidating || (emailValidationResults.length === 0 && fileValidationResults.length === 0)}
                  >
                    {isValidating ? "Validating..." : "Upload & Validate"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Create List
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Email List</DialogTitle>
                <DialogDescription>Create a new email list to organize your subscribers</DialogDescription>
              </DialogHeader>
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
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateEmailList} disabled={isLoading || !newListName.trim()}>
                    {isLoading ? "Creating..." : "Create List"}
                  </Button>
                </div>
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
        {filteredLists.map((list: { id: Key | null | undefined; name: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; description: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; totalEmails: number; validEmails: number; invalidEmails: { toLocaleString: () => string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined }; updatedAt: string | number | Date }) => (
          <Card key={list.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-primary" />
                  <CardTitle className="text-lg">{list.name}</CardTitle>
                </div>


                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    {/* <Button  onClick={()=>alert("clicked")}  variant="ghost" size="sm" className="h-8 w-8 p-0"> */}
                      <MoreHorizontal className="w-4 h-4" />
                    {/* </Button> */}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="z-50">
                    <DropdownMenuItem onClick={() => handleViewEmailList(list.id as string)}>
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => console.log('Edit List clicked')}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit List
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => console.log('Export clicked')}>
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-red-600" 
                      onClick={() => handleDeleteEmailList(list.id as string)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <CardDescription className="text-sm">{list.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                {getStatusBadge()}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Total Emails</span>
                  <span className="font-medium">{list?.totalEmails?.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Valid</span>
                  <span className="font-medium text-green-500">{list?.validEmails?.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Invalid</span>
                  <span className="font-medium text-red-500">{list?.invalidEmails?.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Validity Rate</span>
                  <span className="font-medium">{((list.validEmails / list.totalEmails) * 100).toFixed(1)}%</span>
                </div>
                <Progress value={(list.validEmails / list.totalEmails) * 100} className="h-2" />
              </div>

              <div className="text-xs text-muted-foreground">
                Updated {new Date(list.updatedAt).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Email Details Table */}
      {selectedList && currentList && (
        <Card>
          <CardHeader>
            <CardTitle>Email Details - {currentList.name}</CardTitle>
            <CardDescription>Individual email addresses and their validation status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search emails..." className="pl-10 w-80" />
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
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
                    <TableHead>Added Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {emails.map((email) => (
                    <TableRow key={email.id}>
                      <TableCell className="font-medium">{email.address}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getEmailStatusIcon(email.valid)}
                          <Badge
                            variant={email.valid ? "default" : "destructive"}
                            className={
                              email.valid ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                            }
                          >
                            {email.valid ? "Valid" : "Invalid"}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>{new Date(email.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            {/* <Button variant="ghost" size="sm" className="h-8 w-8 p-0"> */}
                              <MoreHorizontal className="w-4 h-4" />
                            {/* </Button> */}
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="z-100">
                            <DropdownMenuItem onClick={() => console.log('Edit clicked')}>
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => console.log('Re-validate clicked')}>
                              Re-validate
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-600" 
                              onClick={() => console.log('Remove clicked')}
                            >
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

      {/* Validation Alert */}
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Email validation helps improve deliverability. Invalid emails are automatically excluded from campaigns.
        </AlertDescription>
      </Alert>
    </div>
  )
}





// "use client"

// import type React from "react"

// import { useState, useEffect, useRef } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Badge } from "@/components/ui/badge"
// import { Textarea } from "@/components/ui/textarea"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Progress } from "@/components/ui/progress"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import {
//   Users,
//   Plus,
//   Upload,
//   Download,
//   CheckCircle,
//   XCircle,
//   AlertTriangle,
//   MoreHorizontal,
//   Search,
//   Filter,
//   Trash2,
//   Edit,
//   Eye,
//   FileText,
//   ArrowRight,
//   ArrowLeft,
//   Check,
// } from "lucide-react"
// import { useEmailListStore } from "@/store/emailListStore"
// import { useToast } from "@/hooks/use-toast"

// export function EmailLists() {
//   const { toast } = useToast()

//   const [isMultiStepDialogOpen, setIsMultiStepDialogOpen] = useState(false)
//   const [currentStep, setCurrentStep] = useState(1)
//   const totalSteps = 3

//   const [selectedList, setSelectedList] = useState<string | null>(null)
//   const [newListName, setNewListName] = useState("")
//   const [newListDescription, setNewListDescription] = useState("")
//   const [bulkEmails, setBulkEmails] = useState("")
//   const [searchTerm, setSearchTerm] = useState("")
//   const [validationProgress, setValidationProgress] = useState(0)
//   const [isValidating, setIsValidating] = useState(false)
//   const [emailValidationResults, setEmailValidationResults] = useState<
//     { email: string; status: "valid" | "invalid" | "pending"; error?: string }[]
//   >([])
//   const [currentEmail, setCurrentEmail] = useState("")
//   const textareaRef = useRef<HTMLTextAreaElement>(null)

//   // File upload states
//   const [file, setFile] = useState<File | null>(null)
//   const [fileEmails, setFileEmails] = useState<string[]>([])
//   const [fileValidationResults, setFileValidationResults] = useState<
//     { email: string; status: "valid" | "invalid" | "pending"; error?: string }[]
//   >([])
//   const [isProcessingFile, setIsProcessingFile] = useState(false)
//   const [fileProcessingProgress, setFileProcessingProgress] = useState(0)
//   const fileInputRef = useRef<HTMLInputElement>(null)

//   const {
//     emailLists,
//     currentList,
//     emails,
//     isLoading,
//     error,
//     fetchEmailLists,
//     createEmailList,
//     updateEmailList,
//     deleteEmailList,
//     getEmailListWithStats,
//     addEmailsToList,
//     getEmailsInList,
//     setCurrentList,
//     clearError,
//   } = useEmailListStore()

//   useEffect(() => {
//     fetchEmailLists()
//   }, [fetchEmailLists])

//   useEffect(() => {
//     if (error) {
//       toast({
//         title: "Error",
//         description: error,
//         variant: "destructive",
//       })
//       clearError()
//     }
//   }, [error, toast, clearError])

//   // Email validation function
//   const validateEmail = (email: string): { status: "valid" | "invalid"; error?: string } => {
//     if (!email.trim()) {
//       return { status: "invalid", error: "Email is required" }
//     }

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
//     if (!emailRegex.test(email)) {
//       return { status: "invalid", error: "Invalid email format" }
//     }

//     return { status: "valid" }
//   }

//   // Handle email input with real-time validation
//   const handleEmailInput = (value: string) => {
//     setBulkEmails(value)

//     // Extract the current line being typed
//     const lines = value.split("\n")
//     const currentLine = lines[lines.length - 1]
//     setCurrentEmail(currentLine)

//     // Validate all emails
//     const emails = value.split(/[,\s\n]+/).filter((email) => email.trim() !== "")
//     const results = emails.map((email) => {
//       const validation = validateEmail(email.trim())
//       return {
//         email: email.trim(),
//         status: validation.status,
//         error: validation.error,
//       }
//     })

//     setEmailValidationResults(results)
//   }

//   // Handle file selection
//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files.length > 0) {
//       const selectedFile = e.target.files[0]
//       setFile(selectedFile)
//       processFile(selectedFile)
//     }
//   }

//   // Process uploaded file
//   const processFile = (selectedFile: File) => {
//     setIsProcessingFile(true)
//     setFileProcessingProgress(0)

//     const reader = new FileReader()

//     reader.onload = (e) => {
//       const content = e.target?.result as string
//       let emails: string[] = []

//       if (selectedFile.name.endsWith(".csv")) {
//         const lines = content.split("\n")
//         emails = lines
//           .slice(1)
//           .map((line) => line.split(",")[0].trim())
//           .filter((email) => email !== "")
//       } else {
//         emails = content.split(/[,\s\n]+/).filter((email) => email.trim() !== "")
//       }

//       setFileEmails(emails)

//       const totalEmails = emails.length
//       let processed = 0

//       const validationInterval = setInterval(() => {
//         if (processed >= totalEmails) {
//           clearInterval(validationInterval)
//           setIsProcessingFile(false)
//           return
//         }

//         const batchSize = Math.min(100, totalEmails - processed)
//         const batch = emails.slice(processed, processed + batchSize)

//         const batchResults = batch.map((email) => {
//           const validation = validateEmail(email.trim())
//           return {
//             email: email.trim(),
//             status: validation.status,
//             error: validation.error,
//           }
//         })

//         setFileValidationResults((prev) => [...prev, ...batchResults])
//         processed += batchSize
//         setFileProcessingProgress(Math.round((processed / totalEmails) * 100))
//       }, 50)
//     }

//     reader.readAsText(selectedFile)
//   }

//   // Trigger file input click
//   const handleChooseFileClick = () => {
//     fileInputRef.current?.click()
//   }

//   const handleNextStep = () => {
//     if (currentStep === 1) {
//       // Validate step 1
//       if (!newListName.trim()) {
//         toast({
//           title: "Name required",
//           description: "Please enter a name for the email list.",
//           variant: "destructive",
//         })
//         return
//       }
//     }

//     if (currentStep === 2) {
//       // Validate step 2
//       const validEmails =
//         fileEmails.length > 0
//           ? fileValidationResults.filter((r) => r.status === "valid")
//           : emailValidationResults.filter((r) => r.status === "valid")

//       if (validEmails.length === 0) {
//         toast({
//           title: "No valid emails",
//           description: "Please add at least one valid email address.",
//           variant: "destructive",
//         })
//         return
//       }
//     }

//     setCurrentStep((prev) => Math.min(prev + 1, totalSteps))
//   }

//   const handlePreviousStep = () => {
//     setCurrentStep((prev) => Math.max(prev - 1, 1))
//   }

//   const handleSubmitEmailList = async () => {
//     setIsValidating(true)
//     setValidationProgress(0)

//     try {
//       // Create the email list
//       const newList = await createEmailList(newListName, newListDescription)

//       // Get valid emails
//       const validEmails =
//         fileEmails.length > 0
//           ? fileEmails.filter((email) => fileValidationResults.find((r) => r.email === email)?.status === "valid")
//           : emailValidationResults.filter((r) => r.status === "valid").map((r) => r.email)

//       // Simulate progress
//       const interval = setInterval(() => {
//         setValidationProgress((prev) => {
//           if (prev >= 90) {
//             clearInterval(interval)
//             return 90
//           }
//           return prev + 10
//         })
//       }, 200)

//       // Add emails to the list
//       await addEmailsToList(newList.id, validEmails)

//       clearInterval(interval)
//       setValidationProgress(100)

//       // Reset form
//       setTimeout(() => {
//         setIsValidating(false)
//         setIsMultiStepDialogOpen(false)
//         resetForm()

//         toast({
//           title: "Success!",
//           description: `Email list "${newListName}" created with ${validEmails.length} emails.`,
//         })
//       }, 500)
//     } catch (error) {
//       setIsValidating(false)
//       toast({
//         title: "Failed to create list",
//         description: "There was an error creating the email list. Please try again.",
//         variant: "destructive",
//       })
//     }
//   }

//   const resetForm = () => {
//     setCurrentStep(1)
//     setNewListName("")
//     setNewListDescription("")
//     setBulkEmails("")
//     setEmailValidationResults([])
//     setCurrentEmail("")
//     setFile(null)
//     setFileEmails([])
//     setFileValidationResults([])
//     setValidationProgress(0)
//   }

//   const handleDeleteEmailList = async (listId: string) => {
//     try {
//       await deleteEmailList(listId)

//       toast({
//         title: "List deleted",
//         description: "The email list has been deleted successfully.",
//       })
//     } catch (error) {
//       // Error is handled by the useEffect above
//     }
//   }

//   const handleViewEmailList = async (listId: string) => {
//     try {
//       await getEmailListWithStats(listId)
//       await getEmailsInList(listId)
//       setSelectedList(listId)
//     } catch (error) {
//       // Error is handled by the useEffect above
//     }
//   }

//   const getStatusBadge = (status?: string) => {
//     return <Badge className="bg-green-500/10 text-green-500">Active</Badge>
//   }

//   const getEmailStatusIcon = (valid: boolean) => {
//     return valid ? <CheckCircle className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-red-500" />
//   }

//   const filteredLists = emailLists.filter(
//     (list) =>
//       String(list?.name).toLowerCase().includes(searchTerm.toLowerCase()) ||
//       String(list?.description).toLowerCase().includes(searchTerm.toLowerCase()),
//   )

//   // Focus textarea when step 2 is active
//   useEffect(() => {
//     if (currentStep === 2 && textareaRef.current) {
//       setTimeout(() => {
//         textareaRef.current?.focus()
//       }, 100)
//     }
//   }, [currentStep])

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold text-foreground">Email Lists</h1>
//           <p className="text-muted-foreground">Manage your email subscriber lists and segments</p>
//         </div>
//         <div className="flex items-center space-x-2">
//           <Dialog
//             open={isMultiStepDialogOpen}
//             onOpenChange={(open) => {
//               setIsMultiStepDialogOpen(open)
//               if (!open) resetForm()
//             }}
//           >
//             <DialogTrigger asChild>
//               <Button className="bg-primary hover:bg-primary/90">
//                 <Plus className="w-4 h-4 mr-2" />
//                 Create List
//               </Button>
//             </DialogTrigger>
//             <DialogContent className="sm:max-w-2xl">
//               <DialogHeader>
//                 <DialogTitle>Create New Email List</DialogTitle>
//                 <DialogDescription>Follow the steps to create and populate your email list</DialogDescription>
//               </DialogHeader>

//               {/* Step Indicator */}
//               <div className="flex items-center justify-between mb-6">
//                 {[1, 2, 3].map((step) => (
//                   <div key={step} className="flex items-center flex-1">
//                     <div className="flex flex-col items-center flex-1">
//                       <div
//                         className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
//                           step < currentStep
//                             ? "bg-primary border-primary text-primary-foreground"
//                             : step === currentStep
//                               ? "border-primary text-primary"
//                               : "border-muted text-muted-foreground"
//                         }`}
//                       >
//                         {step < currentStep ? <Check className="w-5 h-5" /> : step}
//                       </div>
//                       <span className="text-xs mt-2 font-medium">
//                         {step === 1 ? "Details" : step === 2 ? "Add Emails" : "Review"}
//                       </span>
//                     </div>
//                     {step < 3 && (
//                       <div className={`h-0.5 flex-1 mx-2 ${step < currentStep ? "bg-primary" : "bg-muted"}`} />
//                     )}
//                   </div>
//                 ))}
//               </div>

//               {/* Step Content */}
//               <div className="min-h-[400px]">
//                 {/* Step 1: List Details */}
//                 {currentStep === 1 && (
//                   <div className="space-y-4 animate-in fade-in duration-300">
//                     <div className="space-y-2">
//                       <Label htmlFor="listName">List Name *</Label>
//                       <Input
//                         id="listName"
//                         placeholder="Newsletter Subscribers"
//                         value={newListName}
//                         onChange={(e) => setNewListName(e.target.value)}
//                         autoFocus
//                       />
//                       <p className="text-xs text-muted-foreground">Choose a descriptive name for your email list</p>
//                     </div>
//                     <div className="space-y-2">
//                       <Label htmlFor="listDescription">Description</Label>
//                       <Textarea
//                         id="listDescription"
//                         placeholder="Describe the purpose of this email list..."
//                         value={newListDescription}
//                         onChange={(e) => setNewListDescription(e.target.value)}
//                         rows={4}
//                       />
//                       <p className="text-xs text-muted-foreground">
//                         Optional: Add details about who should be on this list
//                       </p>
//                     </div>
//                   </div>
//                 )}

//                 {/* Step 2: Add Emails */}
//                 {currentStep === 2 && (
//                   <div className="space-y-4 animate-in fade-in duration-300">
//                     <Tabs defaultValue="paste" className="w-full">
//                       <TabsList className="grid w-full grid-cols-2">
//                         <TabsTrigger value="paste">Paste Emails</TabsTrigger>
//                         <TabsTrigger value="upload">Upload File</TabsTrigger>
//                       </TabsList>

//                       <TabsContent value="paste" className="space-y-4">
//                         <div className="space-y-2">
//                           <Label htmlFor="emails">Email Addresses</Label>
//                           <Textarea
//                             ref={textareaRef}
//                             id="emails"
//                             placeholder="john@example.com&#10;jane@company.com&#10;user@domain.co"
//                             value={bulkEmails}
//                             onChange={(e) => handleEmailInput(e.target.value)}
//                             rows={8}
//                             className="resize-none font-mono text-sm"
//                           />
//                           <div className="flex justify-between items-center">
//                             <p className="text-xs text-muted-foreground">
//                               {emailValidationResults.length} emails detected
//                             </p>
//                             <div className="flex items-center space-x-4">
//                               <div className="flex items-center space-x-1">
//                                 <CheckCircle className="w-3 h-3 text-green-500" />
//                                 <span className="text-xs text-green-500">
//                                   {emailValidationResults.filter((e) => e.status === "valid").length} valid
//                                 </span>
//                               </div>
//                               <div className="flex items-center space-x-1">
//                                 <XCircle className="w-3 h-3 text-red-500" />
//                                 <span className="text-xs text-red-500">
//                                   {emailValidationResults.filter((e) => e.status === "invalid").length} invalid
//                                 </span>
//                               </div>
//                             </div>
//                           </div>
//                         </div>

//                         {emailValidationResults.length > 0 && (
//                           <div className="space-y-2">
//                             <div className="flex items-center justify-between">
//                               <span className="text-sm font-medium">Validation Results</span>
//                               <Badge variant="outline" className="text-xs">
//                                 Real-time
//                               </Badge>
//                             </div>
//                             <ScrollArea className="h-40 w-full rounded-md border">
//                               <div className="p-2 space-y-1">
//                                 {emailValidationResults.map((emailObj, index) => (
//                                   <div
//                                     key={index}
//                                     className="flex items-center justify-between text-sm p-1 rounded hover:bg-muted/50"
//                                   >
//                                     <span className="truncate max-w-[70%]">{emailObj.email}</span>
//                                     <div className="flex items-center space-x-2">
//                                       {emailObj.status === "valid" ? (
//                                         <CheckCircle className="w-4 h-4 text-green-500" />
//                                       ) : (
//                                         <XCircle className="w-4 h-4 text-red-500" />
//                                       )}
//                                     </div>
//                                   </div>
//                                 ))}
//                               </div>
//                             </ScrollArea>
//                           </div>
//                         )}
//                       </TabsContent>

//                       <TabsContent value="upload" className="space-y-4">
//                         <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
//                           <input
//                             type="file"
//                             ref={fileInputRef}
//                             onChange={handleFileChange}
//                             className="hidden"
//                             accept=".csv,.txt"
//                           />
//                           {file ? (
//                             <div className="space-y-4">
//                               <FileText className="w-12 h-12 text-primary mx-auto" />
//                               <div>
//                                 <p className="font-medium">{file.name}</p>
//                                 <p className="text-sm text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
//                               </div>
//                               <Button variant="outline" size="sm" onClick={handleChooseFileClick}>
//                                 Choose Different File
//                               </Button>
//                             </div>
//                           ) : (
//                             <div className="space-y-4">
//                               <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
//                               <p className="text-sm text-muted-foreground mb-2">
//                                 Drag and drop your CSV file here, or click to browse
//                               </p>
//                               <Button variant="outline" size="sm" onClick={handleChooseFileClick}>
//                                 Choose File
//                               </Button>
//                             </div>
//                           )}
//                         </div>

//                         {isProcessingFile && (
//                           <div className="space-y-2">
//                             <div className="flex items-center justify-between text-sm">
//                               <span>Processing file...</span>
//                               <span>{fileProcessingProgress}%</span>
//                             </div>
//                             <Progress value={fileProcessingProgress} className="h-2" />
//                           </div>
//                         )}

//                         {fileValidationResults.length > 0 && (
//                           <div className="space-y-2">
//                             <div className="flex items-center justify-between">
//                               <span className="text-sm font-medium">File Validation Results</span>
//                               <div className="flex items-center space-x-4">
//                                 <div className="flex items-center space-x-1">
//                                   <CheckCircle className="w-3 h-3 text-green-500" />
//                                   <span className="text-xs text-green-500">
//                                     {fileValidationResults.filter((e) => e.status === "valid").length} valid
//                                   </span>
//                                 </div>
//                                 <div className="flex items-center space-x-1">
//                                   <XCircle className="w-3 h-3 text-red-500" />
//                                   <span className="text-xs text-red-500">
//                                     {fileValidationResults.filter((e) => e.status === "invalid").length} invalid
//                                   </span>
//                                 </div>
//                               </div>
//                             </div>
//                             <ScrollArea className="h-40 w-full rounded-md border">
//                               <div className="p-2 space-y-1">
//                                 {fileValidationResults.map((emailObj, index) => (
//                                   <div
//                                     key={index}
//                                     className="flex items-center justify-between text-sm p-1 rounded hover:bg-muted/50"
//                                   >
//                                     <span className="truncate max-w-[70%]">{emailObj.email}</span>
//                                     <div className="flex items-center space-x-2">
//                                       {emailObj.status === "valid" ? (
//                                         <CheckCircle className="w-4 h-4 text-green-500" />
//                                       ) : (
//                                         <XCircle className="w-4 h-4 text-red-500" />
//                                       )}
//                                     </div>
//                                   </div>
//                                 ))}
//                               </div>
//                             </ScrollArea>
//                           </div>
//                         )}
//                       </TabsContent>
//                     </Tabs>
//                   </div>
//                 )}

//                 {/* Step 3: Review & Submit */}
//                 {currentStep === 3 && (
//                   <div className="space-y-6 animate-in fade-in duration-300">
//                     <div className="rounded-lg border p-4 space-y-4">
//                       <h3 className="font-semibold text-lg">Review Your Email List</h3>

//                       <div className="space-y-3">
//                         <div className="flex items-start justify-between">
//                           <div className="space-y-1">
//                             <p className="text-sm font-medium text-muted-foreground">List Name</p>
//                             <p className="text-base font-semibold">{newListName}</p>
//                           </div>
//                           <Button variant="ghost" size="sm" onClick={() => setCurrentStep(1)}>
//                             <Edit className="w-4 h-4" />
//                           </Button>
//                         </div>

//                         {newListDescription && (
//                           <div>
//                             <p className="text-sm font-medium text-muted-foreground">Description</p>
//                             <p className="text-sm">{newListDescription}</p>
//                           </div>
//                         )}

//                         <div className="pt-4 border-t">
//                           <div className="flex items-center justify-between mb-2">
//                             <p className="text-sm font-medium text-muted-foreground">Email Summary</p>
//                             <Button variant="ghost" size="sm" onClick={() => setCurrentStep(2)}>
//                               <Edit className="w-4 h-4" />
//                             </Button>
//                           </div>

//                           <div className="grid grid-cols-3 gap-4">
//                             <div className="text-center p-3 rounded-lg bg-muted/50">
//                               <p className="text-2xl font-bold">
//                                 {fileEmails.length > 0 ? fileEmails.length : emailValidationResults.length}
//                               </p>
//                               <p className="text-xs text-muted-foreground">Total</p>
//                             </div>
//                             <div className="text-center p-3 rounded-lg bg-green-500/10">
//                               <p className="text-2xl font-bold text-green-500">
//                                 {fileEmails.length > 0
//                                   ? fileValidationResults.filter((e) => e.status === "valid").length
//                                   : emailValidationResults.filter((e) => e.status === "valid").length}
//                               </p>
//                               <p className="text-xs text-muted-foreground">Valid</p>
//                             </div>
//                             <div className="text-center p-3 rounded-lg bg-red-500/10">
//                               <p className="text-2xl font-bold text-red-500">
//                                 {fileEmails.length > 0
//                                   ? fileValidationResults.filter((e) => e.status === "invalid").length
//                                   : emailValidationResults.filter((e) => e.status === "invalid").length}
//                               </p>
//                               <p className="text-xs text-muted-foreground">Invalid</p>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     {isValidating && (
//                       <div className="space-y-2">
//                         <div className="flex items-center justify-between text-sm">
//                           <span>Creating email list...</span>
//                           <span>{validationProgress}%</span>
//                         </div>
//                         <Progress value={validationProgress} className="h-2" />
//                       </div>
//                     )}

//                     <Alert>
//                       <CheckCircle className="h-4 w-4" />
//                       <AlertDescription>
//                         Only valid emails will be added to your list. Invalid emails will be excluded automatically.
//                       </AlertDescription>
//                     </Alert>
//                   </div>
//                 )}
//               </div>

//               {/* Navigation Buttons */}
//               <div className="flex justify-between pt-4 border-t">
//                 <Button variant="outline" onClick={handlePreviousStep} disabled={currentStep === 1 || isValidating}>
//                   <ArrowLeft className="w-4 h-4 mr-2" />
//                   Back
//                 </Button>

//                 {currentStep < totalSteps ? (
//                   <Button onClick={handleNextStep}>
//                     Next
//                     <ArrowRight className="w-4 h-4 ml-2" />
//                   </Button>
//                 ) : (
//                   <Button onClick={handleSubmitEmailList} disabled={isValidating}>
//                     {isValidating ? "Creating..." : "Create List"}
//                   </Button>
//                 )}
//               </div>
//             </DialogContent>
//           </Dialog>
//         </div>
//       </div>

//       {/* Search and Filters */}
//       <div className="flex items-center space-x-4">
//         <div className="relative flex-1 max-w-sm">
//           <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//           <Input
//             placeholder="Search lists..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="pl-10"
//           />
//         </div>
//         <Button variant="outline" size="sm">
//           <Filter className="w-4 h-4 mr-2" />
//           Filter
//         </Button>
//       </div>

//       {/* Lists Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {filteredLists.map((list) => (
//           <Card key={list.id} className="hover:shadow-md transition-shadow">
//             <CardHeader className="pb-3">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center space-x-2">
//                   <Users className="w-5 h-5 text-primary" />
//                   <CardTitle className="text-lg">{list.name}</CardTitle>
//                 </div>
//                 <DropdownMenu>
//                   <DropdownMenuTrigger asChild>
//                     <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
//                       <MoreHorizontal className="w-4 h-4" />
//                     </Button>
//                   </DropdownMenuTrigger>
//                   <DropdownMenuContent align="end" className="z-50">
//                     <DropdownMenuItem onClick={() => handleViewEmailList(list.id)}>
//                       <Eye className="w-4 h-4 mr-2" />
//                       View Details
//                     </DropdownMenuItem>
//                     <DropdownMenuItem onClick={() => console.log("[v0] Edit List clicked")}>
//                       <Edit className="w-4 h-4 mr-2" />
//                       Edit List
//                     </DropdownMenuItem>
//                     <DropdownMenuItem onClick={() => console.log("[v0] Export clicked")}>
//                       <Download className="w-4 h-4 mr-2" />
//                       Export
//                     </DropdownMenuItem>
//                     <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteEmailList(list.id)}>
//                       <Trash2 className="w-4 h-4 mr-2" />
//                       Delete
//                     </DropdownMenuItem>
//                   </DropdownMenuContent>
//                 </DropdownMenu>
//               </div>
//               <CardDescription className="text-sm">{list.description}</CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="flex items-center justify-between">
//                 <span className="text-sm text-muted-foreground">Status</span>
//                 {getStatusBadge()}
//               </div>

//               <div className="space-y-2">
//                 <div className="flex items-center justify-between text-sm">
//                   <span className="text-muted-foreground">Total Emails</span>
//                   <span className="font-medium">{list.totalEmails.toLocaleString()}</span>
//                 </div>
//                 <div className="flex items-center justify-between text-sm">
//                   <span className="text-muted-foreground">Valid</span>
//                   <span className="font-medium text-green-500">{list.validEmails.toLocaleString()}</span>
//                 </div>
//                 <div className="flex items-center justify-between text-sm">
//                   <span className="text-muted-foreground">Invalid</span>
//                   <span className="font-medium text-red-500">{list.invalidEmails.toLocaleString()}</span>
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <div className="flex items-center justify-between text-xs">
//                   <span className="text-muted-foreground">Validity Rate</span>
//                   <span className="font-medium">{((list.validEmails / list.totalEmails) * 100).toFixed(1)}%</span>
//                 </div>
//                 <Progress value={(list.validEmails / list.totalEmails) * 100} className="h-2" />
//               </div>

//               <div className="text-xs text-muted-foreground">
//                 Updated {new Date(list.updatedAt).toLocaleDateString()}
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       {/* Email Details Table */}
//       {selectedList && currentList && (
//         <Card>
//           <CardHeader>
//             <CardTitle>Email Details - {currentList.name}</CardTitle>
//             <CardDescription>Individual email addresses and their validation status</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               <div className="flex items-center justify-between">
//                 <div className="relative">
//                   <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                   <Input placeholder="Search emails..." className="pl-10 w-80" />
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <Button variant="outline" size="sm">
//                     <Filter className="w-4 h-4 mr-2" />
//                     Filter
//                   </Button>
//                   <Button variant="outline" size="sm">
//                     <Download className="w-4 h-4 mr-2" />
//                     Export
//                   </Button>
//                 </div>
//               </div>

//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Email Address</TableHead>
//                     <TableHead>Status</TableHead>
//                     <TableHead>Added Date</TableHead>
//                     <TableHead>Actions</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {emails.map((email) => (
//                     <TableRow key={email.id}>
//                       <TableCell className="font-medium">{email.address}</TableCell>
//                       <TableCell>
//                         <div className="flex items-center space-x-2">
//                           {getEmailStatusIcon(email.valid)}
//                           <Badge
//                             variant={email.valid ? "default" : "destructive"}
//                             className={email.valid ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}
//                           >
//                             {email.valid ? "Valid" : "Invalid"}
//                           </Badge>
//                         </div>
//                       </TableCell>
//                       <TableCell>{new Date(email.createdAt).toLocaleDateString()}</TableCell>
//                       <TableCell>
//                         <DropdownMenu>
//                           <DropdownMenuTrigger asChild>
//                             <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
//                               <MoreHorizontal className="w-4 h-4" />
//                             </Button>
//                           </DropdownMenuTrigger>
//                           <DropdownMenuContent align="end" className="z-50">
//                             <DropdownMenuItem onClick={() => console.log("[v0] Edit clicked")}>Edit</DropdownMenuItem>
//                             <DropdownMenuItem onClick={() => console.log("[v0] Re-validate clicked")}>
//                               Re-validate
//                             </DropdownMenuItem>
//                             <DropdownMenuItem
//                               className="text-red-600"
//                               onClick={() => console.log("[v0] Remove clicked")}
//                             >
//                               Remove
//                             </DropdownMenuItem>
//                           </DropdownMenuContent>
//                         </DropdownMenu>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </div>
//           </CardContent>
//         </Card>
//       )}

//       {/* Validation Alert */}
//       <Alert>
//         <AlertTriangle className="h-4 w-4" />
//         <AlertDescription>
//           Email validation helps improve deliverability. Invalid emails are automatically excluded from campaigns.
//         </AlertDescription>
//       </Alert>
//     </div>
//   )
// }
