// "use client"

// import { useState, useEffect } from "react"
// import { useRouter } from "next/navigation"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { RichTextEditor } from "@/components/ui/rich-text-editor"
// import { EnhancedModal } from "@/components/ui/enhanced-modal"
// import { EmailTemplateSelector } from "@/components/ui/email-template-selector"
// import { Calendar } from "@/components/ui/calendar"
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// import { format } from "date-fns"
// import { cn } from "@/lib/utils"
// import { 
//   Send, 
//   CalendarIcon, 
//   Clock, 
//   ArrowLeft,
//   Settings,
//   Eye
// } from "lucide-react"
// import { useDomainStore } from "@/store/domainStore"
// import { useEmailListStore } from "@/store/emailListStore"
// import { useTemplateStore } from "@/store/templateStore"
// import { useCampaignStore } from "@/store/campaignStore"
// import { useToast } from "@/hooks/use-toast"

// export default function CreateCampaignPage() {
//   const { toast } = useToast()
//   const router = useRouter()
//   const [activeTab, setActiveTab] = useState("details")
//   const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false)
  
//   const [campaignData, setCampaignData] = useState({
//     name: "",
//     subject: "",
//     content: "",
//     domainId: "",
//     listId: "",
//     templateId: "",
//     scheduledDate: undefined as Date | undefined,
//   })

//   const { domains } = useDomainStore()
//   const { emailLists } = useEmailListStore()
//   const { templates } = useTemplateStore()
//   const { createCampaign, isLoading, error, clearError } = useCampaignStore()

//   // Safe data access
//   const safeDomains = Array.isArray(domains) ? domains : []
//   const safeEmailLists = Array.isArray((emailLists as any).emailLists) ? (emailLists as any)?.emailLists : []
//   const safeTemplates = Array.isArray(templates) ? templates : []

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

//   const handleTemplateSelect = (template: any) => {
//     setCampaignData({
//       ...campaignData,
//       content: template.content,
//       name: template.name,
//       subject: `${template.name} - ${new Date().toLocaleDateString()}`,
//       templateId: template.id,
//     })
//     setIsTemplateDialogOpen(false)
//   }

//   const handleCreateCampaign = async () => {
//     try {
//       const campaignPayload = {
//         name: campaignData.name,
//         subject: campaignData.subject,
//         content: campaignData.content,
//         domainId: campaignData.domainId,
//         listId: campaignData.listId,
//         templateId: campaignData.templateId || undefined,
//         status: 'DRAFT' as const,
//         scheduledAt: campaignData.scheduledDate ? campaignData.scheduledDate.toISOString() : undefined,
//         saveAsDraft: !campaignData.scheduledDate,
//       }

//       await createCampaign(campaignPayload)
      
//       toast({
//         title: campaignData.scheduledDate ? "Campaign Scheduled" : "Campaign Created",
//         description: campaignData.scheduledDate 
//           ? `Your campaign has been scheduled for ${format(campaignData.scheduledDate, "PPP 'at' h:mm a")}`
//           : "Your campaign has been created successfully.",
//       })
      
//       router.push("/campaigns")
//     } catch (error) {
//       // Error is handled by the useEffect above
//     }
//   }

//   const isFormValid = 
//     campaignData.name && 
//     campaignData.subject && 
//     campaignData.domainId && 
//     campaignData.listId && 
//     campaignData.content

//   return (
//     <div className="container mx-auto py-6 space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div className="flex items-center space-x-4">
//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={() => router.back()}
//             className="flex items-center space-x-2"
//           >
//             <ArrowLeft className="w-4 h-4" />
//             <span>Back</span>
//           </Button>
//           <div>
//             <h1 className="text-3xl font-bold text-foreground">Create Campaign</h1>
//             <p className="text-muted-foreground">Set up a new email campaign to send to your subscribers</p>
//           </div>
//         </div>
        
//         <Button 
//           onClick={handleCreateCampaign}
//           disabled={isLoading || !isFormValid}
//           className="bg-primary hover:bg-primary/90"
//         >
//           {isLoading ? (
//             <Clock className="w-4 h-4 mr-2 animate-spin" />
//           ) : (
//             <Send className="w-4 h-4 mr-2" />
//           )}
//           {campaignData.scheduledDate ? "Schedule Campaign" : "Create Campaign"}
//         </Button>
//       </div>

//       {/* Template Selector Modal */}
//       <EnhancedModal
//         isOpen={isTemplateDialogOpen}
//         onClose={() => setIsTemplateDialogOpen(false)}
//         title="Choose Email Template"
//         description="Select a template to get started quickly"
//         size="full"
//       >
//         <EmailTemplateSelector
//           onSelectTemplate={handleTemplateSelect}
//           onClose={() => setIsTemplateDialogOpen(false)}
//         />
//       </EnhancedModal>

//       {/* Main Content */}
//       <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//         {/* Progress Steps */}
//         <Card className="lg:col-span-1">
//           <CardHeader>
//             <CardTitle className="text-lg">Setup Steps</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               <div className={cn(
//                 "p-3 rounded-lg border-2 transition-colors",
//                 activeTab === "details" 
//                   ? "border-primary bg-primary/5" 
//                   : "border-muted"
//               )}>
//                 <div className="flex items-center space-x-3">
//                   <div className={cn(
//                     "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
//                     activeTab === "details" 
//                       ? "bg-primary text-primary-foreground" 
//                       : "bg-muted text-muted-foreground"
//                   )}>
//                     1
//                   </div>
//                   <div>
//                     <h3 className="font-medium">Campaign Details</h3>
//                     <p className="text-sm text-muted-foreground">Name, domain, and list</p>
//                   </div>
//                 </div>
//               </div>

//               <div className={cn(
//                 "p-3 rounded-lg border-2 transition-colors",
//                 activeTab === "content" 
//                   ? "border-primary bg-primary/5" 
//                   : "border-muted"
//               )}>
//                 <div className="flex items-center space-x-3">
//                   <div className={cn(
//                     "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
//                     activeTab === "content" 
//                       ? "bg-primary text-primary-foreground" 
//                       : "bg-muted text-muted-foreground"
//                   )}>
//                     2
//                   </div>
//                   <div>
//                     <h3 className="font-medium">Email Content</h3>
//                     <p className="text-sm text-muted-foreground">Write your email</p>
//                   </div>
//                 </div>
//               </div>

//               <div className={cn(
//                 "p-3 rounded-lg border-2 transition-colors",
//                 activeTab === "schedule" 
//                   ? "border-primary bg-primary/5" 
//                   : "border-muted"
//               )}>
//                 <div className="flex items-center space-x-3">
//                   <div className={cn(
//                     "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
//                     activeTab === "schedule" 
//                       ? "bg-primary text-primary-foreground" 
//                       : "bg-muted text-muted-foreground"
//                   )}>
//                     3
//                   </div>
//                   <div>
//                     <h3 className="font-medium">Schedule</h3>
//                     <p className="text-sm text-muted-foreground">Send now or later</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Form Content */}
//         <Card className="lg:col-span-3">
//           <CardHeader>
//             <CardTitle>
//               {activeTab === "details" && "Campaign Details"}
//               {activeTab === "content" && "Email Content"}
//               {activeTab === "schedule" && "Schedule Campaign"}
//             </CardTitle>
//             <CardDescription>
//               {activeTab === "details" && "Set up the basic information for your campaign"}
//               {activeTab === "content" && "Create engaging content for your subscribers"}
//               {activeTab === "schedule" && "Choose when to send your campaign"}
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
//               <TabsList className="grid w-full grid-cols-3">
//                 <TabsTrigger value="details">Details</TabsTrigger>
//                 <TabsTrigger value="content">Content</TabsTrigger>
//                 <TabsTrigger value="schedule">Schedule</TabsTrigger>
//               </TabsList>

//               {/* Details Tab */}
//               <TabsContent value="details" className="space-y-6">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div className="space-y-3">
//                     <Label htmlFor="campaignName">Campaign Name *</Label>
//                     <Input
//                       id="campaignName"
//                       placeholder="Summer Sale 2024"
//                       value={campaignData.name}
//                       onChange={(e) => setCampaignData({ ...campaignData, name: e.target.value })}
//                     />
//                   </div>
                  
//                   <div className="space-y-3">
//                     <Label htmlFor="domain">Sending Domain *</Label>
//                     <Select
//                       value={campaignData.domainId}
//                       onValueChange={(value) => setCampaignData({ ...campaignData, domainId: value })}
//                     >
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select domain" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {safeDomains.map((domain) => (
//                           <SelectItem key={domain.id} value={domain.id}>
//                             {domain.domain}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>
//                 </div>

//                 <div className="space-y-3">
//                   <Label htmlFor="emailList">Email List *</Label>
//                   <Select
//                     value={campaignData.listId}
//                     onValueChange={(value) => setCampaignData({ ...campaignData, listId: value })}
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select email list" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {safeEmailLists.map((list: any) => (
//                         <SelectItem key={list.id} value={list.id}>
//                           {list.name} ({list.validEmails || 0} subscribers)
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div className="space-y-3">
//                   <Label htmlFor="subject">Subject Line *</Label>
//                   <Input
//                     id="subject"
//                     placeholder="🌞 Summer Sale: Up to 50% Off Everything!"
//                     value={campaignData.subject}
//                     onChange={(e) => setCampaignData({ ...campaignData, subject: e.target.value })}
//                   />
//                 </div>

//                 <div className="flex justify-end">
//                   <Button onClick={() => setActiveTab("content")}>
//                     Continue to Content
//                   </Button>
//                 </div>
//               </TabsContent>

//               {/* Content Tab */}
//               <TabsContent value="content" className="space-y-6">
//                 <div className="space-y-4">
//                   <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//                     <Label htmlFor="content">Email Content *</Label>
//                     <div className="flex items-center space-x-2">
//                       <Button 
//                         variant="outline" 
//                         size="sm" 
//                         onClick={() => setIsTemplateDialogOpen(true)}
//                       >
//                         <Settings className="w-4 h-4 mr-2" />
//                         Use Template
//                       </Button>
//                       <Button variant="outline" size="sm">
//                         <Eye className="w-4 h-4 mr-2" />
//                         Preview
//                       </Button>
//                     </div>
//                   </div>
                  
//                   <RichTextEditor
//                     content={campaignData.content}
//                     onChange={(content) => setCampaignData({ ...campaignData, content })}
//                     placeholder="Write your email content here... Use the toolbar above to format your text, add links, images, and more."
//                     className="min-h-[400px]"
//                   />
//                 </div>

//                 <div className="flex justify-between">
//                   <Button variant="outline" onClick={() => setActiveTab("details")}>
//                     Back to Details
//                   </Button>
//                   <Button onClick={() => setActiveTab("schedule")}>
//                     Continue to Schedule
//                   </Button>
//                 </div>
//               </TabsContent>

//               {/* Schedule Tab */}
//               <TabsContent value="schedule" className="space-y-6">
//                 <div className="space-y-6">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <Button 
//                       variant={!campaignData.scheduledDate ? "default" : "outline"}
//                       className="h-auto py-4 flex flex-col items-center space-y-2 bg-transparent"
//                       onClick={() => setCampaignData({ ...campaignData, scheduledDate: undefined })}
//                     >
//                       <Send className="w-6 h-6" />
//                       <span>Send Immediately</span>
//                       <span className="text-sm text-muted-foreground">Create as draft</span>
//                     </Button>
                    
//                     <Button 
//                       variant={campaignData.scheduledDate ? "default" : "outline"}
//                       className="h-auto py-4 flex flex-col items-center space-y-2 bg-transparent"
//                     >
//                       <CalendarIcon className="w-6 h-6" />
//                       <span>Schedule for Later</span>
//                       <span className="text-sm text-muted-foreground">Choose date & time</span>
//                     </Button>
//                   </div>

//                   {campaignData.scheduledDate && (
//                     <div className="space-y-3">
//                       <Label>Schedule Date & Time</Label>
//                       <Popover>
//                         <PopoverTrigger asChild>
//                           <Button
//                             variant="outline"
//                             className={cn(
//                               "w-full justify-start text-left font-normal",
//                               !campaignData.scheduledDate && "text-muted-foreground",
//                             )}
//                           >
//                             <CalendarIcon className="mr-2 h-4 w-4" />
//                             {campaignData.scheduledDate ? format(campaignData.scheduledDate, "PPP 'at' h:mm a") : "Pick a date and time"}
//                           </Button>
//                         </PopoverTrigger>
//                         <PopoverContent className="w-auto p-0">
//                           <Calendar
//                             mode="single"
//                             selected={campaignData.scheduledDate}
//                             onSelect={(date) => setCampaignData({ ...campaignData, scheduledDate: date })}
//                             initialFocus
//                           />
//                         </PopoverContent>
//                       </Popover>
//                     </div>
//                   )}
//                 </div>

//                 <div className="flex justify-between">
//                   <Button variant="outline" onClick={() => setActiveTab("content")}>
//                     Back to Content
//                   </Button>
//                   <Button 
//                     onClick={handleCreateCampaign}
//                     disabled={isLoading || !isFormValid}
//                     className="bg-primary hover:bg-primary/90"
//                   >
//                     {isLoading ? (
//                       <Clock className="w-4 h-4 mr-2 animate-spin" />
//                     ) : (
//                       <Send className="w-4 h-4 mr-2" />
//                     )}
//                     {campaignData.scheduledDate ? "Schedule Campaign" : "Create Campaign"}
//                   </Button>
//                 </div>
//               </TabsContent>
//             </Tabs>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }




"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { 
  Send, 
  CalendarIcon, 
  Clock, 
  ArrowLeft,
} from "lucide-react"
import { useDomainStore } from "@/store/domainStore"
import { useEmailListStore } from "@/store/emailListStore"
import { useCampaignStore } from "@/store/campaignStore"
import { useToast } from "@/hooks/use-toast"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function SimpleCreateCampaignPage() {
  const { toast } = useToast()
  const router = useRouter()
  
  const [campaignData, setCampaignData] = useState({
    subject: "",
    content: "",
    domainId: "",
    listId: "",
    fromName: "", // Add fromName field
    scheduledDate: undefined as Date | undefined,
  })

  const { domains } = useDomainStore()
  const { emailLists } = useEmailListStore()
  const { createCampaign, isLoading, error, clearError } = useCampaignStore()

  // Safe data access
  const safeDomains = Array.isArray(domains) ? domains : []
  const safeEmailLists = Array.isArray(emailLists) ? emailLists : []

  // Get selected domain to show email format hint
  const selectedDomain = safeDomains.find(domain => domain.id === campaignData.domainId)

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

  const handleCreateCampaign = async () => {
    try {
      const campaignPayload = {
        subject: campaignData.subject,
        content: campaignData.content || '<p>Your email content here</p>',
        domainId: campaignData.domainId,
        listId: campaignData.listId,
        fromName: campaignData.fromName, // Include fromName
        scheduledAt: campaignData.scheduledDate ? campaignData.scheduledDate.toISOString() : undefined,
        saveAsDraft: !campaignData.scheduledDate,
      }

      await createCampaign(campaignPayload as any)
      
      toast({
        title: campaignData.scheduledDate ? "Campaign Scheduled" : "Campaign Created",
        description: campaignData.scheduledDate 
          ? `Your campaign has been scheduled for ${format(campaignData.scheduledDate, "PPP 'at' h:mm a")}`
          : "Your campaign has been created successfully.",
      })
      
      router.push("/campaign")
    } catch (error) {
      // Error is handled by the useEffect above
    }
  }

  const isFormValid = 
    campaignData.subject && 
    campaignData.domainId && 
    campaignData.listId &&
    campaignData.fromName // Make fromName required

  return (
    <ProtectedRoute>
      <div className="container mx-auto py-6 space-y-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Create Email Campaign</h1>
              <p className="text-muted-foreground">Quickly set up and send your email campaign</p>
            </div>
          </div>
          
          <Button 
            onClick={handleCreateCampaign}
            disabled={isLoading || !isFormValid}
            className="bg-primary hover:bg-primary/90"
          >
            {isLoading ? (
              <Clock className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Send className="w-4 h-4 mr-2" />
            )}
            {campaignData.scheduledDate ? "Schedule" : "Create Campaign"}
          </Button>
        </div>

        {/* Main Form */}
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Details</CardTitle>
              <CardDescription>Fill in the essential information to create your campaign</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Required Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="subject" className="flex items-center">
                    Email Subject <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input
                    id="subject"
                    placeholder="Enter your email subject line..."
                    value={campaignData.subject}
                    onChange={(e) => setCampaignData({ ...campaignData, subject: e.target.value })}
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="domain" className="flex items-center">
                    Sending Domain <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Select
                    value={campaignData.domainId}
                    onValueChange={(value) => setCampaignData({ ...campaignData, domainId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose domain" />
                    </SelectTrigger>
                    <SelectContent>
                      {safeDomains.map((domain:any) => (
                        <SelectItem key={domain.id} value={domain.id}>
                          {domain.domain} {domain.fromEmail && `(${domain.fromEmail})`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="emailList" className="flex items-center">
                    Recipient List <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Select
                    value={campaignData.listId}
                    onValueChange={(value) => setCampaignData({ ...campaignData, listId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select who will receive this email" />
                    </SelectTrigger>
                    <SelectContent>
                      {safeEmailLists.map((list: any) => (
                        <SelectItem key={list.id} value={list.id}>
                          {list.name} ({list.validEmails || 0} subscribers)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* From Name Field */}
                <div className="space-y-3">
                  <Label htmlFor="fromName" className="flex items-center">
                    From Name <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input
                    id="fromName"
                    placeholder="Your Company Name"
                    value={campaignData.fromName}
                    onChange={(e) => setCampaignData({ ...campaignData, fromName: e.target.value })}
                    className="w-full"
                  />
                  {selectedDomain && (
                    <p className="text-xs text-muted-foreground">
                      Emails will appear as: "{campaignData.fromName || 'Your Name'}" from {(selectedDomain as any).fromEmail || `noreply@${selectedDomain.domain}`}
                    </p>
                  )}
                </div>
              </div>

              {/* Email Content */}
              <div className="space-y-3">
                <Label htmlFor="content">Email Content</Label>
                <RichTextEditor
                  content={campaignData.content}
                  onChange={(content) => setCampaignData({ ...campaignData, content })}
                  placeholder="Write your email content here... You can leave this empty and add content later."
                  className="min-h-[300px]"
                />
              </div>

              {/* Schedule Option - Keep your existing schedule section */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">Delivery Schedule</Label>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Send Immediately Option */}
                  <div
                    className={cn(
                      "relative rounded-xl border-2 p-4 cursor-pointer transition-all duration-200 hover:shadow-md",
                      !campaignData.scheduledDate
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border bg-card hover:border-primary/30"
                    )}
                    onClick={() => setCampaignData({ ...campaignData, scheduledDate: undefined })}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={cn(
                        "flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 transition-all",
                        !campaignData.scheduledDate
                          ? "border-primary bg-primary"
                          : "border-muted-foreground/30"
                      )}>
                        {!campaignData.scheduledDate && (
                          <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <Send className={cn(
                            "w-4 h-4 flex-shrink-0",
                            !campaignData.scheduledDate ? "text-primary" : "text-muted-foreground"
                          )} />
                          <span className={cn(
                            "font-semibold text-sm",
                            !campaignData.scheduledDate ? "text-primary" : "text-foreground"
                          )}>
                            Send Immediately
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          Create as draft and send right away. Perfect for urgent communications.
                        </p>
                      </div>
                    </div>
                    
                    {!campaignData.scheduledDate && (
                      <div className="absolute -top-1 -right-1">
                        <div className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full font-medium">
                          Selected
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Schedule for Later Option */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <div
                        className={cn(
                          "relative rounded-xl border-2 p-4 cursor-pointer transition-all duration-200 hover:shadow-md",
                          campaignData.scheduledDate
                            ? "border-primary bg-primary/5 shadow-sm"
                            : "border-border bg-card hover:border-primary/30"
                        )}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={cn(
                            "flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 transition-all",
                            campaignData.scheduledDate
                              ? "border-primary bg-primary"
                              : "border-muted-foreground/30"
                          )}>
                            {campaignData.scheduledDate && (
                              <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <CalendarIcon className={cn(
                                "w-4 h-4 flex-shrink-0",
                                campaignData.scheduledDate ? "text-primary" : "text-muted-foreground"
                              )} />
                              <span className={cn(
                                "font-semibold text-sm",
                                campaignData.scheduledDate ? "text-primary" : "text-foreground"
                              )}>
                                Schedule for Later
                              </span>
                            </div>
                            
                            {campaignData.scheduledDate ? (
                              <div className="space-y-1">
                                <p className="text-xs font-medium text-primary">
                                  {format(campaignData.scheduledDate, "EEEE, MMMM d, yyyy")}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  at {format(campaignData.scheduledDate, "h:mm a")}
                                </p>
                              </div>
                            ) : (
                              <p className="text-xs text-muted-foreground leading-relaxed">
                                Choose specific date and time for delivery
                              </p>
                            )}
                          </div>
                        </div>
                        
                        {campaignData.scheduledDate && (
                          <div className="absolute -top-1 -right-1">
                            <div className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full font-medium">
                              Selected
                            </div>
                          </div>
                        )}
                      </div>
                    </PopoverTrigger>
                    
                    <PopoverContent className="w-auto p-0 shadow-xl border-0 rounded-xl overflow-hidden" align="start">
                      <div className="bg-card">
                        <Calendar
                          mode="single"
                          selected={campaignData.scheduledDate}
                          onSelect={(date) => {
                            if (date) {
                              const defaultDate = new Date(date);
                              if (!campaignData.scheduledDate) {
                                defaultDate.setHours(9, 0, 0, 0);
                              } else {
                                defaultDate.setHours(
                                  campaignData.scheduledDate.getHours(),
                                  campaignData.scheduledDate.getMinutes(),
                                  0,
                                  0
                                );
                              }
                              setCampaignData({ ...campaignData, scheduledDate: defaultDate });
                            }
                          }}
                          initialFocus
                          className="rounded-lg"
                        />
                        
                        <div className="p-4 border-t bg-muted/20">
                          <div className="space-y-3">
                            <Label htmlFor="time-picker" className="text-sm font-medium">
                              Select Time
                            </Label>
                            <div className="flex items-center space-x-3">
                              <Input
                                id="time-picker"
                                type="time"
                                value={campaignData.scheduledDate ? format(campaignData.scheduledDate, "HH:mm") : "09:00"}
                                onChange={(e) => {
                                  if (campaignData.scheduledDate && e.target.value) {
                                    const [hours, minutes] = e.target.value.split(':');
                                    const newDate = new Date(campaignData.scheduledDate);
                                    newDate.setHours(parseInt(hours), parseInt(minutes));
                                    setCampaignData({ ...campaignData, scheduledDate: newDate });
                                  } else if (!campaignData.scheduledDate) {
                                    const today = new Date();
                                    const [hours, minutes] = e.target.value.split(':');
                                    today.setHours(parseInt(hours), parseInt(minutes));
                                    setCampaignData({ ...campaignData, scheduledDate: today });
                                  }
                                }}
                                className="flex-1"
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const now = new Date();
                                  const minutes = Math.ceil(now.getMinutes() / 15) * 15;
                                  now.setMinutes(minutes);
                                  if (minutes === 60) {
                                    now.setHours(now.getHours() + 1);
                                    now.setMinutes(0);
                                  }
                                  setCampaignData({ ...campaignData, scheduledDate: now });
                                }}
                              >
                                Now
                              </Button>
                            </div>
                            
                            {campaignData.scheduledDate && (
                              <div className="pt-2 border-t">
                                <p className="text-xs text-muted-foreground">
                                  Scheduled for{" "}
                                  <span className="font-medium text-foreground">
                                    {format(campaignData.scheduledDate, "MMM d, yyyy 'at' h:mm a")}
                                  </span>
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex justify-between pt-4 border-t">
                <Button 
                  variant="outline" 
                  onClick={() => router.push("/campaigns")}
                >
                  Cancel
                </Button>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setCampaignData({
                        subject: "",
                        content: "",
                        domainId: "",
                        listId: "",
                        fromName: "",
                        scheduledDate: undefined,
                      })
                    }}
                  >
                    Clear
                  </Button>
                  
                  <Button 
                    onClick={handleCreateCampaign}
                    disabled={isLoading || !isFormValid}
                    className="bg-primary hover:bg-primary/90"
                  >
                    {isLoading ? (
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4 mr-2" />
                    )}
                    {campaignData.scheduledDate ? "Schedule Campaign" : "Create Campaign"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}