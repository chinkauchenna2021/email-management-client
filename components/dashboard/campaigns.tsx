// "use client"

// import { useEffect, useState } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Badge } from "@/components/ui/badge"
// import { DataTable } from "@/components/ui/data-table"
// import { EnhancedModal } from "@/components/ui/enhanced-modal"
// import { RichTextEditor } from "@/components/ui/rich-text-editor"
// import { EmailTemplateSelector } from "@/components/ui/email-template-selector"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Progress } from "@/components/ui/progress"
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
// import { Calendar } from "@/components/ui/calendar"
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// import { format } from "date-fns"
// import { useRouter } from 'next/navigation'
// import {
//   Send,
//   Plus,
//   Search,
//   Filter,
//   MoreHorizontal,
//   Eye,
//   Edit,
//   Copy,
//   Trash2,
//   CalendarIcon,
//   Clock,
//   Mail,
//   MousePointer,
//   Pause,
//   Play,
//   Settings,
//   RefreshCw
// } from "lucide-react"
// import { cn } from "@/lib/utils"
// import { useDomainStore } from "@/store/domainStore"
// import { useEmailListStore } from "@/store/emailListStore"
// import { useTemplateStore } from "@/store/templateStore"
// import { useCampaignStore } from "@/store/campaignStore"
// import { useToast } from "@/hooks/use-toast"
// import { ScrollArea } from "../ui/scroll-area"
// // import { ScrollArea } from "@radix-ui/react-scroll-area"

// export function Campaigns() {
//   const { toast } = useToast()
//   const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
//   const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false)
//   const [searchTerm, setSearchTerm] = useState("")
//   const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null)
//   const router = useRouter()
  
//   const [newCampaign, setNewCampaign] = useState({
//     name: "",
//     subject: "",
//     content: "",
//     domainId: "",
//     listId: "",
//     templateId: "",
//     scheduledDate: undefined as Date | undefined,
//   })

//   const {
//     campaigns,
//     currentCampaign,
//     campaignStats,
//     isLoading,
//     error,
//     fetchCampaigns,
//     createCampaign,
//     updateCampaign,
//     deleteCampaign,
//     sendCampaign,
//     getCampaignDetails,
//     getCampaignStats,
//     getOverallCampaignStats,
//     retryFailedEmails,
//     setCurrentCampaign,
//     clearError
//   } = useCampaignStore();

//   const { domains } = useDomainStore();
//   const { emailLists } = useEmailListStore();
//   const { templates } = useTemplateStore();

//   useEffect(() => {
//     fetchCampaigns();
//     getOverallCampaignStats();
//   }, []);

//   // Safe domain access
// const safeDomains = Array.isArray(domains) ? domains : [];

// // Safe email lists access  
// const safeEmailLists = Array.isArray((emailLists as any).emailLists) ? (emailLists as any)?.emailLists : [];

// // Safe templates access
// const safeTemplates = Array.isArray(templates) ? templates : [];

//   useEffect(() => {
//     if (error) {
//       toast({
//         title: "Error",
//         description: error,
//         variant: "destructive",
//       });
//       clearError();
//     }
//   }, [error, toast, clearError]);

// const handleCreateCampaign = async () => {
//   try {
//     const campaignData = {
//       name: newCampaign.name,
//       subject: newCampaign.subject,
//       content: newCampaign.content,
//       domainId: newCampaign.domainId,
//       listId: newCampaign.listId,
//       templateId: newCampaign.templateId || undefined,
//       status: 'DRAFT' as const,
//       scheduledAt: newCampaign.scheduledDate ? newCampaign.scheduledDate.toISOString() : undefined,
//       saveAsDraft: !newCampaign.scheduledDate, // Save as draft if not scheduled
//     };

//     await createCampaign(campaignData);
    
//     setIsCreateDialogOpen(false);
//     setNewCampaign({
//       name: "",
//       subject: "",
//       content: "",
//       domainId: "",
//       listId: "",
//       templateId: "",
//       scheduledDate: undefined,
//     });

//     toast({
//       title: newCampaign.scheduledDate ? "Campaign Scheduled" : "Campaign Created",
//       description: newCampaign.scheduledDate 
//         ? `Your campaign has been scheduled for ${format(newCampaign.scheduledDate, "PPP 'at' h:mm a")}`
//         : "Your campaign has been created successfully.",
//     });
//     router.push("/")
//   } catch (error) {
//     // Error is handled by the useEffect above
//   }
// };
// // emailLists
//     console.log(safeEmailLists , emailLists,"===============campaignStats=========",  "================safeEmailLists==============")

//   // Debugging logs to verify campaigns is always an array
//   useEffect(() => {
//   console.log('Campaigns value:', campaigns);
//   console.log('Campaigns type:', typeof campaigns);
//   console.log('Is campaigns array?', Array.isArray(campaigns));
// }, [campaigns]);

//   const handleCampaignAction = async (action: string, campaign: any) => {
//     try {
//       switch (action) {
//         case "view":
//           await getCampaignDetails(campaign.id);
//           await getCampaignStats(campaign.id);
//           setSelectedCampaign(campaign.id);
//           break;
//         case "edit":
//           await getCampaignDetails(campaign.id);
//           setSelectedCampaign(campaign.id);
//           setIsCreateDialogOpen(true);
//           break;
//         case "duplicate":
//           const duplicateData = {
//             name: `${campaign.name} (Copy)`,
//             subject: campaign.subject,
//             content: campaign.content,
//             domainId: campaign.domainId,
//             listId: campaign.listId,
//             templateId: campaign.templateId,
//             status: 'DRAFT' as const,
//           };
//           await createCampaign(duplicateData);
//           toast({
//             title: "Campaign Duplicated",
//             description: `${campaign.name} has been duplicated successfully.`,
//           });
//           break;
//         case "pause":
//           await updateCampaign(campaign.id, { status: 'PAUSED' });
//           toast({
//             title: "Campaign Paused",
//             description: `${campaign.name} has been paused.`,
//           });
//           break;
//         case "resume":
//           await updateCampaign(campaign.id, { status: 'READY' });
//           toast({
//             title: "Campaign Resumed",
//             description: `${campaign.name} has been resumed.`,
//           });
//           break;
//         case "send":
//           await sendCampaign(campaign.id);
//           toast({
//             title: "Campaign Sending",
//             description: `${campaign.name} is now being sent.`,
//           });
//           break;
//         case "delete":
//           await deleteCampaign(campaign.id);
//           console.log("==========DELETE CAMPAIGN======", campaign.id)
//           // toast({
//           //   title: "Campaign Deleted",
//           //   description: `${campaign.name} has been deleted.`,
//           // });
//           // router.push("/")
//           break;
//       }
//     } catch (error) {
//       // Error is handled by the useEffect above
//     }
//   };

//   const handleTemplateSelect = (template: any) => {
//     setNewCampaign({
//       ...newCampaign,
//       content: template.content,
//       name: template.name,
//       subject: `${template.name} - ${new Date().toLocaleDateString()}`,
//       templateId: template.id,
//     });
//     setIsTemplateDialogOpen(false);
//   };

//   const getStatusBadge = (status: string) => {
//     switch (status) {
//       case "SENT":
//         return <Badge className="bg-green-500/10 text-green-500">Sent</Badge>;
//       case "SENDING":
//         return <Badge className="bg-blue-500/10 text-blue-500">Sending</Badge>;
//       case "SCHEDULED":
//         return <Badge className="bg-purple-500/10 text-purple-500">Scheduled</Badge>;
//       case "DRAFT":
//         return <Badge variant="outline">Draft</Badge>;
//       case "PAUSED":
//         return <Badge className="bg-yellow-500/10 text-yellow-500">Paused</Badge>;
//       case "FAILED":
//         return <Badge className="bg-red-500/10 text-red-500">Failed</Badge>;
//       case "READY":
//         return <Badge className="bg-indigo-500/10 text-indigo-500">Ready</Badge>;
//       default:
//         return <Badge variant="secondary">Unknown</Badge>;
//     }
//   };

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case "SENT":
//         return <Send className="w-4 h-4 text-green-500" />;
//       case "SENDING":
//         return <Clock className="w-4 h-4 text-blue-500 animate-spin" />;
//       case "SCHEDULED":
//         return <CalendarIcon className="w-4 h-4 text-purple-500" />;
//       case "DRAFT":
//         return <Edit className="w-4 h-4 text-gray-500" />;
//       case "PAUSED":
//         return <Pause className="w-4 h-4 text-yellow-500" />;
//       case "FAILED":
//         return <Trash2 className="w-4 h-4 text-red-500" />;
//       case "READY":
//         return <Play className="w-4 h-4 text-indigo-500" />;
//       default:
//         return <Mail className="w-4 h-4 text-gray-500" />;
//     }
//   };


//   console.log(campaigns , "=========campaigns========")

//   const calculateOpenRate = (opened: number, delivered: number) => {
//     return delivered > 0 ? ((opened / delivered) * 100).toFixed(1) : "0.0";
//   };

//   const calculateClickRate = (clicked: number, delivered: number) => {
//     return delivered > 0 ? ((clicked / delivered) * 100).toFixed(1) : "0.0";
//   };

// const getDomainName = (domainId: string) => {
//   const domain = safeDomains.find(d => d.id === domainId);
//   return domain ? domain.domain : domainId;
// };

// const getListName = (listId: string) => {
//   const list = safeEmailLists.find((l:any) => l.id === listId);
//   return list ? list.name : listId;
// };

// const filteredCampaigns = (() => {
//   // Multiple safety checks
//   // if (!(campaigns as any).campaigns) return [];
//   // if (!Array.isArray((campaigns as any).campaigns)) {
//   //   console.error('campaigns is not an array:', (campaigns as any).campaigns);
//   //   return [];
//   // }
  
//   return campaigns.filter((campaign:any) => {
//       console.log(campaign, "==========================new campaigns ==========")
//     // Check if campaign exists and has required properties
//     if (!campaign) return false;
    
//     const name = campaign.name || '';
//     const subject = campaign.subject || '';
    
//     return (
//       name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       subject.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//   });
// })();

//   const campaignColumns = [
//     {
//       accessorKey: "name",
//       header: "Campaign",
//       cell: ({ row }: any) => {
//         const campaign = row.original;
//         return (
//           <div className="space-y-1">
//             <div className="flex items-center space-x-2">
//               {getStatusIcon(campaign.status)}
//               <span className="font-medium">{campaign.name}</span>
//             </div>
//             <p className="text-sm text-muted-foreground truncate max-w-xs">{campaign.subject}</p>
//             <div className="flex items-center space-x-2 text-xs text-muted-foreground">
//               <span>{getDomainName(campaign.domainId)}</span>
//               <span>•</span>
//               <span>{getListName(campaign.listId)}</span>
//             </div>
//           </div>
//         );
//       },
//     },
//     {
//       accessorKey: "status",
//       header: "Status",
//       cell: ({ row }: any) => {
//         const campaign = row.original;
//         return (
//           <div className="space-y-1">
//             {getStatusBadge(campaign.status)}
//           </div>
//         );
//       },
//     },
//     {
//       accessorKey: "createdAt",
//       header: "Created",
//       cell: ({ row }: any) => {
//         const campaign = row.original;
//         return (
//           <div className="text-sm text-muted-foreground">
//             {new Date(campaign.createdAt).toLocaleDateString()}
//           </div>
//         );
//       },
//     },
//     {
//       id: "actions",
//       header: "Actions",
//       cell: ({ row }: any) => {
//         const campaign = row.original;
//         return (
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               {/* <Button variant="ghost" size="sm"> */}
//                 <MoreHorizontal className="w-4 h-4" />
//               {/* </Button> */}
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end">
//               <DropdownMenuItem onClick={() => handleCampaignAction("view", campaign)}>
//                 <Eye className="w-4 h-4 mr-2" />
//                 View Details
//               </DropdownMenuItem>
//               <DropdownMenuItem onClick={() => handleCampaignAction("edit", campaign)}>
//                 <Edit className="w-4 h-4 mr-2" />
//                 Edit Campaign
//               </DropdownMenuItem>
//               <DropdownMenuItem onClick={() => handleCampaignAction("duplicate", campaign)}>
//                 <Copy className="w-4 h-4 mr-2" />
//                 Duplicate
//               </DropdownMenuItem>
//               {campaign.status === "SENDING" && (
//                 <DropdownMenuItem onClick={() => handleCampaignAction("pause", campaign)}>
//                   <Pause className="w-4 h-4 mr-2" />
//                   Pause
//                 </DropdownMenuItem>
//               )}
//               {(campaign.status === "PAUSED" || campaign.status === "DRAFT" || campaign.status === "READY") && (
//                 <DropdownMenuItem onClick={() => handleCampaignAction("send", campaign)}>
//                   <Send className="w-4 h-4 mr-2" />
//                   Send Now
//                 </DropdownMenuItem>
//               )}
//               <DropdownMenuItem className="text-red-600" onClick={() => handleCampaignAction("delete", campaign)}>
//                 <Trash2 className="w-4 h-4 mr-2" />
//                 Delete
//                 {/* deleteCampaign */}
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         );
//       },
//     },
//   ];


//  if (isLoading) {
//     return (
//       <div className="flex items-center justify-center p-8">
//         <RefreshCw className="w-6 h-6 animate-spin mr-2" />
//         Loading campaigns lists...
//       </div>
//     );
//   }






//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold text-foreground">Email Campaigns</h1>
//           <p className="text-muted-foreground">Create, manage, and track your email campaigns</p>
//         </div>

//         {/* Template Selector Modal */}
//         <EnhancedModal
//           isOpen={isTemplateDialogOpen}
//           onClose={() => setIsTemplateDialogOpen(false)}
//           title="Choose Email Template"
//           description="Select a template to get started quickly"
//           size="full"
//         >
//           <EmailTemplateSelector
//             onSelectTemplate={handleTemplateSelect}
//             onClose={() => setIsTemplateDialogOpen(false)}
//           />
//         </EnhancedModal>

//         {/* Create Campaign Modal */}
//         <EnhancedModal
//           isOpen={isCreateDialogOpen}
//           onClose={() => setIsCreateDialogOpen(false)}
//           title={selectedCampaign ? "Edit Campaign" : "Create New Campaign"}
//           description={selectedCampaign ? "Update your campaign details" : "Set up a new email campaign to send to your subscribers"}
//           size="full"
//           isLoading={isLoading}
//           loadingText={selectedCampaign ? "Updating campaign..." : "Creating campaign..."}
//           scrollable={true}
//         >
//           <div className="flex flex-col h-full">
//             <Tabs defaultValue="details" className="flex-1 flex flex-col">
//               <TabsList className="grid w-full grid-cols-3">
//                 <TabsTrigger value="details">Details</TabsTrigger>
//                 <TabsTrigger value="content">Content</TabsTrigger>
//                 <TabsTrigger value="schedule">Schedule</TabsTrigger>
//               </TabsList>

//               {/* Scrollable content area */}
//               <div className="flex-1 overflow-y-auto mt-4 pr-2">
//                 <TabsContent value="details" className="space-y-4 m-0">
//                   <div className="grid grid-cols-2 gap-4">
//                     <div className="space-y-2">
//                       <Label htmlFor="campaignName">Campaign Name</Label>
//                       <Input
//                         id="campaignName"
//                         placeholder="Summer Sale 2024"
//                         value={newCampaign.name}
//                         onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
//                       />
//                     </div>
//                     <div className="space-y-2">
//                       <Label htmlFor="domain">Sending Domain</Label>
//                       <Select
//                         value={newCampaign.domainId}
//                         onValueChange={(value) => setNewCampaign({ ...newCampaign, domainId: value })}
//                       >
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select domain" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           {safeDomains.map((domain) => (
//                             <SelectItem key={domain.id} value={domain.id}>
//                               {domain.domain}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                     </div>
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="emailList">Email List</Label>
//                     <Select
//                       value={newCampaign.listId}
//                       onValueChange={(value) => setNewCampaign({ ...newCampaign, listId: value })}
//                     >
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select email list" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {safeEmailLists.map((list:any) => (
//                           <SelectItem key={list.id} value={list.id}>
//                             {list.name} ({list.validEmails|| 0} subscribers)
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="subject">Subject Line</Label>
//                     <Input
//                       id="subject"
//                       placeholder="🌞 Summer Sale: Up to 50% Off Everything!"
//                       value={newCampaign.subject}
//                       onChange={(e) => setNewCampaign({ ...newCampaign, subject: e.target.value })}
//                     />
//                   </div>
//                 </TabsContent>

//                 <TabsContent value="content" className="space-y-4 m-0 pb-24  h-screen">
//                   <div className="space-y-2">
//                     <div className="flex items-center justify-between">
//                       <Label htmlFor="content">Email Content</Label>
//                       <div className="flex items-center space-x-2">
//                         <Button variant="outline" size="sm" onClick={() => setIsTemplateDialogOpen(true)}>
//                           <Settings className="w-4 h-4 mr-2" />
//                           Use Template
//                         </Button>
//                         <Button variant="outline" size="sm">
//                           <Eye className="w-4 h-4 mr-2" />
//                           Preview
//                         </Button>
//                       </div>
//                     </div>
//                     <RichTextEditor
//                       content={newCampaign.content}
//                       onChange={(content) => setNewCampaign({ ...newCampaign, content })}
//                       placeholder="Write your email content here... Use the toolbar above to format your text, add links, images, and more."
//                       className="min-h-[100px]"
//                     />
//                   </div>
//                 </TabsContent>

//                 <TabsContent value="schedule" className="space-y-4 m-0">
//                   <div className="space-y-4">
//                     <div className="flex items-center space-x-4">
//                       <Button 
//                         variant="outline" 
//                         className="flex-1 bg-transparent"
//                         onClick={() => {
//                           setNewCampaign({ ...newCampaign, scheduledDate: undefined });
//                           handleCreateCampaign();
//                         }}
//                       >
//                         <Send className="w-4 h-4 mr-2" />
//                         Send Now
//                       </Button>
//                       <Button variant="outline" className="flex-1 bg-transparent">
//                         <CalendarIcon className="w-4 h-4 mr-2" />
//                         Schedule Later
//                       </Button>
//                     </div>
//                     <div className="space-y-2">
//                       <Label>Schedule Date & Time</Label>
//                       <Popover>
//                         <PopoverTrigger asChild>
//                           <Button
//                             variant="outline"
//                             className={cn(
//                               "w-full justify-start text-left font-normal",
//                               !newCampaign.scheduledDate && "text-muted-foreground",
//                             )}
//                           >
//                             <CalendarIcon className="mr-2 h-4 w-4" />
//                             {newCampaign.scheduledDate ? format(newCampaign.scheduledDate, "PPP") : "Pick a date"}
//                           </Button>
//                         </PopoverTrigger>
//                         <PopoverContent className="w-auto p-0">
//                           <Calendar
//                             mode="single"
//                             selected={newCampaign.scheduledDate}
//                             onSelect={(date) => setNewCampaign({ ...newCampaign, scheduledDate: date })}
//                             initialFocus
//                           />
//                         </PopoverContent>
//                       </Popover>
//                     </div>
//                   </div>
//                 </TabsContent>
//               </div>
//             </Tabs>

//             {/* Fixed footer */}
//             <div className="flex justify-end space-x-2 mt-6 pt-4 border-t">
//               <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
//                 {selectedCampaign ? "Cancel" : "Save Draft"}
//               </Button>
//               <Button onClick={handleCreateCampaign} disabled={isLoading || !newCampaign.name || !newCampaign.subject || !newCampaign.domainId || !newCampaign.listId}>
//                 {selectedCampaign ? "Update Campaign" : "Create Campaign"}
//               </Button>
//             </div>
//           </div>
//         </EnhancedModal>

//         <Button className="bg-primary hover:bg-primary/90" onClick={() => setIsCreateDialogOpen(true)}>
//           <Plus className="w-4 h-4 mr-2" />
//           Create Campaign
//         </Button>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
//             <Send className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{(campaigns || []).length}</div>
//             <p className="text-xs text-muted-foreground">
//               <span className="text-green-500">+12</span> this month
//             </p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Emails Sent</CardTitle>
//             <Mail className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">
//               {(campaignStats as any)?.totalEmailsSent ? (campaignStats as any)?.totalEmailsSent?.toLocaleString() : "0"}
//             </div>
//             <p className="text-xs text-muted-foreground">
//               <span className="text-green-500">+8%</span> from last month
//             </p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Avg Open Rate</CardTitle>
//             <Eye className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">
//               {campaignStats?.openRate ? `${campaignStats.openRate.toFixed(1)}%` : "0%"}
//             </div>
//             <p className="text-xs text-muted-foreground">
//               <span className="text-green-500">+2.1%</span> industry avg
//             </p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Avg Click Rate</CardTitle>
//             <MousePointer className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">
//               {campaignStats?.clickRate ? `${campaignStats.clickRate.toFixed(1)}%` : "0%"}
//             </div>
//             <p className="text-xs text-muted-foreground">
//               <span className="text-red-500">-0.3%</span> from last month
//             </p>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Search and Filters */}
//       <div className="flex items-center space-x-4">
//         <div className="relative flex-1 max-w-sm">
//           <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//           <Input
//             placeholder="Search campaigns..."
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

// <Card>
//   <CardHeader>
//     <CardTitle>All Campaigns</CardTitle>
//     <CardDescription>Manage and track all your email campaigns</CardDescription>
//   </CardHeader>
//   <CardContent>
//     {isLoading ? (
//       <div className="flex justify-center items-center py-8">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
//       </div>
//     ) : (
//       <DataTable
//         columns={campaignColumns}
//         data={filteredCampaigns}
//         searchPlaceholder="Search campaigns..."
//         onRowAction={handleCampaignAction}
//       />
//     )}
//   </CardContent>
// </Card>
//     </div>
//   )
// }












"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/ui/data-table"
import { useRouter } from 'next/navigation'
import {
  Send,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Copy,
  Trash2,
  Mail,
  MousePointer,
  Pause,
  Play,
  RefreshCw
} from "lucide-react"
import { useDomainStore } from "@/store/domainStore"
import { useEmailListStore } from "@/store/emailListStore"
import { useCampaignStore } from "@/store/campaignStore"
import { useToast } from "@/hooks/use-toast"
import {  toast } from 'react-toastify';


export function Campaigns() {
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()
  
  const {
    campaigns,
    campaignStats,
    isLoading,
    error,
    fetchCampaigns,
    updateCampaign,
    deleteCampaign,
    sendCampaign,
    getCampaignDetails,
    getCampaignStats,
    getOverallCampaignStats,
    clearError
  } = useCampaignStore();

  const { domains } = useDomainStore();
  const { emailLists } = useEmailListStore();

  useEffect(() => {
    fetchCampaigns();
    getOverallCampaignStats();
  }, []);

  // Safe domain access
  const safeDomains = Array.isArray(domains) ? domains : [];

  // Safe email lists access  
  const safeEmailLists = Array.isArray((emailLists as any).emailLists) ? (emailLists as any)?.emailLists : [];

  useEffect(() => {
    if (error) {
      toast.error(
        error.toString()
      );
      clearError();
    }
  }, [error, toast, clearError]);

  const handleCreateCampaign = () => {
    router.push("/campaign/create");
  };

  const handleCampaignAction = async (action: string, campaign: any) => {
    try {
      switch (action) {
        case "view":
          await getCampaignDetails(campaign.id);
          await getCampaignStats(campaign.id);
          break;
        case "edit":
          router.push(`/campaigns/edit/${campaign.id}`);
          break;
        case "duplicate":
          const duplicateData = {
            name: `${campaign.name} (Copy)`,
            subject: campaign.subject,
            content: campaign.content,
            domainId: campaign.domainId,
            listId: campaign.listId,
            templateId: campaign.templateId,
            status: 'DRAFT' as const,
          };
          await useCampaignStore.getState().createCampaign(duplicateData);
          toast(`${campaign.name} has been duplicated successfully.`);
          break;
        case "pause":
          await updateCampaign(campaign.id, { status: 'PAUSED' });
          toast(`${campaign.name} has been paused.`);
          break;
        case "resume":
          await updateCampaign(campaign.id, { status: 'READY' });
          toast(`${campaign.name} has been resumed.`);
          break;
        case "send":
          await sendCampaign(campaign.id);
          toast(`${campaign.name} is now being sent.`);
          break;
        case "delete":
          await deleteCampaign(campaign.id);
          break;
      }
    } catch (error) {
      // Error is handled by the useEffect above
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "SENT":
        return <Badge className="bg-green-500/10 text-green-500">Sent</Badge>;
      case "SENDING":
        return <Badge className="bg-blue-500/10 text-blue-500">Sending</Badge>;
      case "SCHEDULED":
        return <Badge className="bg-purple-500/10 text-purple-500">Scheduled</Badge>;
      case "DRAFT":
        return <Badge variant="outline">Draft</Badge>;
      case "PAUSED":
        return <Badge className="bg-yellow-500/10 text-yellow-500">Paused</Badge>;
      case "FAILED":
        return <Badge className="bg-red-500/10 text-red-500">Failed</Badge>;
      case "READY":
        return <Badge className="bg-indigo-500/10 text-indigo-500">Ready</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "SENT":
        return <Send className="w-4 h-4 text-green-500" />;
      case "SENDING":
        return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />;
      case "SCHEDULED":
        return <Mail className="w-4 h-4 text-purple-500" />;
      case "DRAFT":
        return <Edit className="w-4 h-4 text-gray-500" />;
      case "PAUSED":
        return <Pause className="w-4 h-4 text-yellow-500" />;
      case "FAILED":
        return <Trash2 className="w-4 h-4 text-red-500" />;
      case "READY":
        return <Play className="w-4 h-4 text-indigo-500" />;
      default:
        return <Mail className="w-4 h-4 text-gray-500" />;
    }
  };

  const getDomainName = (domainId: string) => {
    const domain = safeDomains.find(d => d.id === domainId);
    return domain ? domain.domain : domainId;
  };

  const getListName = (listId: string) => {
    const list = safeEmailLists.find((l:any) => l.id === listId);
    return list ? list.name : listId;
  };

  const filteredCampaigns = campaigns?.filter((campaign:any) => {
    if (!campaign) return false;
    
    const name = campaign.name || '';
    const subject = campaign.subject || '';
    
    return (
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const campaignColumns = [
    {
      accessorKey: "name",
      header: "Campaign",
      cell: ({ row }: any) => {
        const campaign = row.original;
        return (
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              {getStatusIcon(campaign.status)}
              <span className="font-medium">{campaign.name}</span>
            </div>
            <p className="text-sm text-muted-foreground truncate max-w-xs">{campaign.subject}</p>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <span>{getDomainName(campaign.domainId)}</span>
              <span>•</span>
              <span>{getListName(campaign.listId)}</span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: any) => {
        const campaign = row.original;
        return (
          <div className="space-y-1">
            {getStatusBadge(campaign.status)}
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }: any) => {
        const campaign = row.original;
        return (
          <div className="text-sm text-muted-foreground">
            {new Date(campaign.createdAt).toLocaleDateString()}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: any) => {
        const campaign = row.original;
        return (
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCampaignAction("view", campaign)}
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCampaignAction("edit", campaign)}
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCampaignAction("send", campaign)}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="w-6 h-6 animate-spin mr-2" />
        Loading campaigns...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Email Campaigns</h1>
          <p className="text-muted-foreground">Manage and track your email campaigns</p>
        </div>

        <Button 
          className="bg-primary hover:bg-primary/90 w-full sm:w-auto"
          onClick={handleCreateCampaign}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Campaign
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(campaigns || []).length}</div>
            <p className="text-xs text-muted-foreground">
              All campaigns
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emails Sent</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(campaignStats as any)?.totalEmailsSent ? (campaignStats as any)?.totalEmailsSent?.toLocaleString() : "0"}
            </div>
            <p className="text-xs text-muted-foreground">
              Total emails sent
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Open Rate</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {campaignStats?.openRate ? `${campaignStats.openRate.toFixed(1)}%` : "0%"}
            </div>
            <p className="text-xs text-muted-foreground">
              Average open rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Click Rate</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {campaignStats?.clickRate ? `${campaignStats.clickRate.toFixed(1)}%` : "0%"}
            </div>
            <p className="text-xs text-muted-foreground">
              Average click rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search campaigns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full"
          />
        </div>
        <Button variant="outline" size="sm" className="w-full sm:w-auto">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Campaigns</CardTitle>
          <CardDescription>Manage and track all your email campaigns</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <RefreshCw className="w-6 h-6 animate-spin mr-2" />
              Loading campaigns...
            </div>
          ) : (
            <DataTable
              columns={campaignColumns}
              data={filteredCampaigns}
              searchPlaceholder="Search campaigns..."
              onRowAction={handleCampaignAction}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}