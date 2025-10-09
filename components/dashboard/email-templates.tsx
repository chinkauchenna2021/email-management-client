// "use client"

// import { useEffect, useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Card } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Badge } from "@/components/ui/badge"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { Separator } from "@/components/ui/separator"
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import {
//   Search,
//   Filter,
//   Mail,
//   ShoppingCart,
//   Megaphone,
//   Calendar,
//   Gift,
//   Users,
//   Star,
//   Eye,
//   Copy,
//   Check,
//   X,
// } from "lucide-react"
// import { cn } from "@/lib/utils"
// import { useToast } from "@/hooks/use-toast"
// import { useTemplateStore } from "@/store/templateStore"

// interface EmailTemplate {
//   id: string
//   name: string
//   description: string
//   category: string
//   thumbnail: string
//   htmlContent: string
//   subject: string
//   tags: string[]
//   usageCount: number
//   rating: number
// }

// interface EmailTemplatesProps {
//   onSelectTemplate?: (template: EmailTemplate) => void
// }

// const categories = [
//   { id: "all", name: "All Templates", icon: Mail, count: 24 },
//   { id: "promotional", name: "Promotional", icon: Megaphone, count: 8 },
//   { id: "newsletter", name: "Newsletter", icon: Mail, count: 6 },
//   { id: "transactional", name: "Transactional", icon: ShoppingCart, count: 5 },
//   { id: "event", name: "Event", icon: Calendar, count: 3 },
//   { id: "seasonal", name: "Seasonal", icon: Gift, count: 2 },
// ]


// const mockTemplates: EmailTemplate[] = [
//   {
//     id: "1",
//     name: "Summer Sale Blast",
//     description: "Eye-catching promotional template for seasonal sales with bold CTAs",
//     category: "promotional",
//     thumbnail: "/summer-sale-email-template.jpg",
//     htmlContent: "<h1>Summer Sale!</h1><p>Get 50% off on all items</p>",
//     subject: "🌞 Summer Sale - 50% Off Everything!",
//     tags: ["sale", "promotional", "seasonal"],
//     usageCount: 1240,
//     rating: 4.8,
//   },
//   {
//     id: "2",
//     name: "Weekly Newsletter",
//     description: "Clean and professional newsletter layout with content sections",
//     category: "newsletter",
//     thumbnail: "/newsletter-email-template.png",
//     htmlContent: "<h1>This Week's Updates</h1><p>Latest news and updates</p>",
//     subject: "Your Weekly Update - What's New This Week",
//     tags: ["newsletter", "updates", "content"],
//     usageCount: 2150,
//     rating: 4.9,
//   },
//   {
//     id: "3",
//     name: "Order Confirmation",
//     description: "Professional transactional email for order confirmations",
//     category: "transactional",
//     thumbnail: "/order-confirmation-email.png",
//     htmlContent: "<h1>Order Confirmed</h1><p>Thank you for your purchase</p>",
//     subject: "Order Confirmation #{{order_number}}",
//     tags: ["transactional", "ecommerce", "confirmation"],
//     usageCount: 3420,
//     rating: 5.0,
//   },
//   {
//     id: "4",
//     name: "Product Launch",
//     description: "Exciting announcement template for new product launches",
//     category: "promotional",
//     thumbnail: "/product-launch-email.jpg",
//     htmlContent: "<h1>Introducing Our Latest Product</h1><p>Be the first to try it</p>",
//     subject: "🚀 Introducing {{product_name}} - Available Now!",
//     tags: ["launch", "product", "announcement"],
//     usageCount: 890,
//     rating: 4.7,
//   },
//   {
//     id: "5",
//     name: "Event Invitation",
//     description: "Elegant invitation template for webinars and events",
//     category: "event",
//     thumbnail: "/event-invitation-email.png",
//     htmlContent: "<h1>You're Invited!</h1><p>Join us for an exclusive event</p>",
//     subject: "You're Invited: {{event_name}} on {{date}}",
//     tags: ["event", "invitation", "webinar"],
//     usageCount: 670,
//     rating: 4.6,
//   },
//   {
//     id: "6",
//     name: "Welcome Series",
//     description: "Warm welcome email for new subscribers with onboarding steps",
//     category: "transactional",
//     thumbnail: "/welcome-email-template.png",
//     htmlContent: "<h1>Welcome Aboard!</h1><p>We're excited to have you</p>",
//     subject: "Welcome to {{company_name}} - Let's Get Started!",
//     tags: ["welcome", "onboarding", "new user"],
//     usageCount: 2890,
//     rating: 4.9,
//   },
//   {
//     id: "7",
//     name: "Cart Abandonment",
//     description: "Persuasive reminder for customers who left items in cart",
//     category: "transactional",
//     thumbnail: "/cart-abandonment-email.jpg",
//     htmlContent: "<h1>You Left Something Behind</h1><p>Complete your purchase</p>",
//     subject: "Don't Forget! Your Cart is Waiting",
//     tags: ["ecommerce", "cart", "reminder"],
//     usageCount: 1560,
//     rating: 4.5,
//   },
//   {
//     id: "8",
//     name: "Holiday Greetings",
//     description: "Festive template for holiday season greetings and offers",
//     category: "seasonal",
//     thumbnail: "/holiday-email-template.png",
//     htmlContent: "<h1>Happy Holidays!</h1><p>Season's greetings from our team</p>",
//     subject: "🎄 Happy Holidays from {{company_name}}",
//     tags: ["holiday", "seasonal", "greetings"],
//     usageCount: 1120,
//     rating: 4.8,
//   },
// ]

// export function EmailTemplates({ onSelectTemplate }: EmailTemplatesProps) {
//   const [selectedCategory, setSelectedCategory] = useState("all")
//   const [searchQuery, setSearchQuery] = useState("")
//   const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | null>(null)
//   const [copiedId, setCopiedId] = useState<string | null>(null)
//   const { toast } = useToast()



//  const {
//     templates,
//     currentTemplate,
//     categories:category,
//     isLoading,
//     error,
//     fetchTemplates,
//     createTemplate,
//     updateTemplate,
//     deleteTemplate,
//     getTemplate,
//     getTemplateCategories,
//     useTemplate,
//     setCurrentTemplate,
//     clearError
//   } = useTemplateStore();

//   useEffect(() => {
//     fetchTemplates();
//     getTemplateCategories();
//   }, []);

//   const handleCreateTemplate = async (templateData: any) => {
//     try {
//       await createTemplate(templateData);
//       // Show success message
//     } catch (error) {
//       // Show error message
//     }
//   };







//   const filteredTemplates = mockTemplates.filter((template) => {
//     const matchesCategory = selectedCategory === "all" || template.category === selectedCategory
//     const matchesSearch =
//       searchQuery === "" ||
//       template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       template.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
//     return matchesCategory && matchesSearch
//   })

//   const handleSelectTemplate = (template: EmailTemplate) => {
//     onSelectTemplate?.(template)
//     toast({
//       title: "Template selected",
//       description: `"${template.name}" has been loaded into the editor.`,
//     })
//   }

//   const handleCopyTemplate = (template: EmailTemplate) => {
//     navigator.clipboard.writeText(template.htmlContent)
//     setCopiedId(template.id)
//     setTimeout(() => setCopiedId(null), 2000)
//     toast({
//       title: "Template copied",
//       description: "HTML content copied to clipboard.",
//     })
//   }

//   const handlePreview = (template: EmailTemplate) => {
//     setPreviewTemplate(template)
//   }

//   return (

//     <div className="h-full flex flex-col bg-background">
//       {/* Header */}
//       <div className="border-b border-border p-6">
//         <div className="flex items-center justify-between mb-4">
//           <div>
//             <h1 className="text-2xl font-semibold text-foreground">Email Templates</h1>
//             <p className="text-sm text-muted-foreground mt-1">
//               Choose from {mockTemplates.length} professionally designed templates
//             </p>
//           </div>
//         </div>

//         {/* Search Bar */}
//         <div className="relative">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//           <Input
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             placeholder="Search templates by name, description, or tags..."
//             className="pl-10 h-12 bg-input border-border focus:border-primary"
//           />
//         </div>
//       </div>

//       <div className="flex-1 flex overflow-hidden">
//         {/* Sidebar - Categories */}
//         <div className="w-64 border-r border-border p-4">
//           <div className="flex items-center gap-2 mb-4">
//             <Filter className="h-4 w-4 text-muted-foreground" />
//             <span className="text-sm font-medium text-foreground">Categories</span>
//           </div>
//           <ScrollArea className="h-[calc(100vh-200px)]">
//             <div className="space-y-1">
//               {categories.map((category) => {
//                 const Icon = category.icon
//                 const isActive = selectedCategory === category.id
//                 return (
//                   <Button
//                     key={category.id}
//                     variant="ghost"
//                     onClick={() => setSelectedCategory(category.id)}
//                     className={cn(
//                       "w-full justify-start gap-3 h-10 transition-colors",
//                       isActive
//                         ? "bg-primary text-primary-foreground hover:bg-primary/90"
//                         : "hover:bg-accent text-foreground",
//                     )}
//                   >
//                     <Icon className="h-4 w-4" />
//                     <span className="flex-1 text-left">{category.name}</span>
//                     <Badge
//                       variant="secondary"
//                       className={cn("text-xs", isActive && "bg-primary-foreground/20 text-primary-foreground")}
//                     >
//                       {category.count}
//                     </Badge>
//                   </Button>
//                 )
//               })}
//             </div>
//           </ScrollArea>
//         </div>

//         {/* Main Content - Templates Grid */}
//         <div className="flex-1 overflow-auto">
//           <ScrollArea className="h-full">
//             <div className="p-6">
//               {/* Results Header */}
//               <div className="flex items-center justify-between mb-6">
//                 <div className="text-sm text-muted-foreground">
//                   Showing {filteredTemplates.length} template{filteredTemplates.length !== 1 ? "s" : ""}
//                   {searchQuery && ` for "${searchQuery}"`}
//                 </div>
//               </div>

//               {/* Templates Grid */}
//               {filteredTemplates.length === 0 ? (
//                 <div className="flex flex-col items-center justify-center h-96 text-center">
//                   <Mail className="h-16 w-16 text-muted-foreground mb-4" />
//                   <h3 className="text-lg font-medium text-foreground mb-2">No templates found</h3>
//                   <p className="text-sm text-muted-foreground max-w-md">
//                     Try adjusting your search or filter criteria to find what you're looking for.
//                   </p>
//                 </div>
//               ) : (
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                   {filteredTemplates.map((template) => (
//                     <Card
//                       key={template.id}
//                       className="group overflow-hidden border-border hover:border-primary transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
//                     >
//                       {/* Thumbnail */}
//                       <div className="relative aspect-video overflow-hidden bg-muted">
//                         <img
//                           src={template.thumbnail || "/placeholder.svg"}
//                           alt={template.name}
//                           className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
//                         />
//                         <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

//                         {/* Overlay Actions */}
//                         <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                           <Button
//                             size="sm"
//                             onClick={() => handlePreview(template)}
//                             className="bg-background/90 hover:bg-background text-foreground gap-2"
//                           >
//                             <Eye className="h-4 w-4" />
//                             Preview
//                           </Button>
//                           <Button
//                             size="sm"
//                             onClick={() => handleSelectTemplate(template)}
//                             className="bg-primary hover:bg-primary/90 text-white gap-2"
//                           >
//                             <Check className="h-4 w-4" />
//                             Use Template
//                           </Button>
//                         </div>

//                         {/* Rating Badge */}
//                         <div className="absolute top-3 right-3">
//                           <Badge className="bg-background/90 text-foreground gap-1">
//                             <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
//                             {template.rating}
//                           </Badge>
//                         </div>
//                       </div>

//                       {/* Content */}
//                       <div className="p-4 space-y-3">
//                         <div>
//                           <h3 className="font-semibold text-foreground mb-1 line-clamp-1">{template.name}</h3>
//                           <p className="text-sm text-muted-foreground line-clamp-2">{template.description}</p>
//                         </div>

//                         {/* Tags */}
//                         <div className="flex flex-wrap gap-1">
//                           {template.tags.slice(0, 3).map((tag) => (
//                             <Badge key={tag} variant="secondary" className="text-xs">
//                               {tag}
//                             </Badge>
//                           ))}
//                         </div>

//                         <Separator className="bg-border" />

//                         {/* Footer */}
//                         <div className="flex items-center justify-between">
//                           <div className="flex items-center gap-1 text-xs text-muted-foreground">
//                             <Users className="h-3 w-3" />
//                             <span>{template.usageCount.toLocaleString()} uses</span>
//                           </div>
//                           <Button
//                             variant="ghost"
//                             size="sm"
//                             onClick={() => handleCopyTemplate(template)}
//                             className="h-7 gap-1 text-xs"
//                           >
//                             {copiedId === template.id ? (
//                               <>
//                                 <Check className="h-3 w-3 text-green-500" />
//                                 Copied
//                               </>
//                             ) : (
//                               <>
//                                 <Copy className="h-3 w-3" />
//                                 Copy HTML
//                               </>
//                             )}
//                           </Button>
//                         </div>
//                       </div>
//                     </Card>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </ScrollArea>
//         </div>
//       </div>

//       {/* Preview Dialog */}
//       <Dialog open={!!previewTemplate} onOpenChange={() => setPreviewTemplate(null)}>
//         <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
//           <DialogHeader>
//             <div className="flex items-center justify-between">
//               <div>
//                 <DialogTitle className="flex items-center gap-2">
//                   <Eye className="h-5 w-5" />
//                   {previewTemplate?.name}
//                 </DialogTitle>
//                 <p className="text-sm text-muted-foreground mt-1">{previewTemplate?.description}</p>
//               </div>
//               <Button variant="ghost" size="sm" onClick={() => setPreviewTemplate(null)}>
//                 <X className="h-4 w-4" />
//               </Button>
//             </div>
//           </DialogHeader>

//           <div className="flex-1 overflow-auto">
//             {previewTemplate && (
//               <div className="space-y-4">
//                 {/* Subject Preview */}
//                 <Card className="p-4 bg-muted border-border">
//                   <div className="text-xs text-muted-foreground mb-2">Subject Line:</div>
//                   <div className="font-medium text-foreground">{previewTemplate.subject}</div>
//                 </Card>

//                 {/* Template Preview */}
//                 <Card className="p-6 bg-background border-border">
//                   <div
//                     className="prose prose-invert max-w-none"
//                     dangerouslySetInnerHTML={{ __html: previewTemplate.htmlContent }}
//                   />
//                 </Card>

//                 {/* Template Info */}
//                 <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
//                   <div className="flex items-center gap-4 text-sm">
//                     <div className="flex items-center gap-1">
//                       <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
//                       <span className="font-medium">{previewTemplate.rating}</span>
//                     </div>
//                     <Separator orientation="vertical" className="h-4" />
//                     <div className="flex items-center gap-1 text-muted-foreground">
//                       <Users className="h-4 w-4" />
//                       <span>{previewTemplate.usageCount.toLocaleString()} uses</span>
//                     </div>
//                     <Separator orientation="vertical" className="h-4" />
//                     <div className="flex gap-1">
//                       {previewTemplate.tags.map((tag) => (
//                         <Badge key={tag} variant="secondary" className="text-xs">
//                           {tag}
//                         </Badge>
//                       ))}
//                     </div>
//                   </div>
//                   <div className="flex gap-2">
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() => previewTemplate && handleCopyTemplate(previewTemplate)}
//                       className="gap-2"
//                     >
//                       <Copy className="h-4 w-4" />
//                       Copy HTML
//                     </Button>
//                     <Button
//                       size="sm"
//                       onClick={() => {
//                         if (previewTemplate) {
//                           handleSelectTemplate(previewTemplate)
//                           setPreviewTemplate(null)
//                         }
//                       }}
//                       className="bg-primary hover:bg-primary/90 text-white gap-2"
//                     >
//                       <Check className="h-4 w-4" />
//                       Use This Template
//                     </Button>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </DialogContent>
//       </Dialog>
//     </div>
//   )
// }









// components/email-templates.tsx
"use client"

import { AwaitedReactNode, JSXElementConstructor, Key, ReactElement, ReactNode, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Search,
  Filter,
  Mail,
  ShoppingCart,
  Megaphone,
  Calendar,
  Gift,
  Users,
  Star,
  Eye,
  Copy,
  Check,
  X,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { useTemplateStore } from "@/store/templateStore"

interface EmailTemplate {
  id?: string
  name: string
  description: string
  category: string
  thumbnail?: string
  htmlContent: string
  subject: string
  tags: string[]
  usageCount: number
  rating: number
  createdAt?: string
  updatedAt?: string
}

interface EmailTemplatesProps {
  onSelectTemplate?: (template: EmailTemplate) => void
}

const defaultCategories = [
  { id: "all", name: "All Templates", icon: Mail },
  { id: "promotional", name: "Promotional", icon: Megaphone },
  { id: "newsletter", name: "Newsletter", icon: Mail },
  { id: "transactional", name: "Transactional", icon: ShoppingCart },
  { id: "event", name: "Event", icon: Calendar },
  { id: "seasonal", name: "Seasonal", icon: Gift },
]

const templateSections = [
  "Header",
  "Hero",
  "Content",
  "Features",
  "Testimonials",
  "Footer",
  "Call-to-Action"
]

const templateGroups = [
  "Basic",
  "Professional",
  "Marketing",
  "E-commerce",
  "Newsletter",
  "Transactional"
]

export function EmailTemplates({ onSelectTemplate }: EmailTemplatesProps) {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null)
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    description: "",
    category: "promotional",
    subject: "",
    htmlContent: "",
    tags: [] as string[],
  })
  const { toast } = useToast()

  const {
    templates,
    categories,
    isLoading,
    error,
    fetchTemplates,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    getTemplateCategories,
    setCurrentTemplate,
    clearError,
  } = useTemplateStore()

  useEffect(() => {
    fetchTemplates()
    getTemplateCategories()
  }, [fetchTemplates, getTemplateCategories])

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

  const handleCreateTemplate = async () => {
    try {
      await createTemplate(newTemplate as any)
      setCreateDialogOpen(false)
      setNewTemplate({
        name: "",
        description: "",
        category: "promotional",
        subject: "",
        htmlContent: "",
        tags: [],
      })
      toast({
        title: "Template created",
        description: "Your new template has been created successfully.",
      })
    } catch (error) {
      // Error handled by store
    }
  }

  const handleDeleteTemplate = async (templateId: string) => {
    try {
      await deleteTemplate(templateId)
      setDeleteDialogOpen(false)
      setTemplateToDelete(null)
      toast({
        title: "Template deleted",
        description: "The template has been deleted successfully.",
      })
    } catch (error) {
      // Error handled by store
    }
  }

  console.log(templates as any , '==============TEMPLATE===============')

  const filteredTemplates = (templates as any)?.templates.filter((template: EmailTemplate) => {
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory
    const matchesSearch =
      searchQuery === "" ||
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const handleSelectTemplate = (template: EmailTemplate) => {
    onSelectTemplate?.(template)
    setCurrentTemplate(template as any)
    toast({
      title: "Template selected",
      description: `"${template.name}" has been loaded into the editor.`,
    })
  }

  const handleCopyTemplate = (template: EmailTemplate) => {
    navigator.clipboard.writeText(template.htmlContent)
    setCopiedId(String(template.id))
    setTimeout(() => setCopiedId(null), 2000)
    toast({
      title: "Template copied",
      description: "HTML content copied to clipboard.",
    })
  }

  const handlePreview = (template: EmailTemplate) => {
    setPreviewTemplate(template)
  }

  const getCategoryCount = (categoryId: string) => {
    if (categoryId === "all") return templates.length
    return (templates as any).templates.filter((template: any) => template.category === categoryId).length
  }

  const getCategoryIcon = (categoryId: string) => {
    const category = defaultCategories.find(cat => cat.id === categoryId)
    return category?.icon || Mail
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border p-4 lg:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div className="flex-1">
            <h1 className="text-2xl font-semibold text-foreground">Email Templates</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Choose from {templates.length} professionally designed templates
            </p>
          </div>
          <Button
            onClick={() => setCreateDialogOpen(true)}
            className="sm:w-auto w-full gap-2"
          >
            <Plus className="h-4 w-4" />
            New Template
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates by name, description, or tags..."
            className="pl-10 h-12 bg-background border-border focus:border-primary"
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Sidebar - Categories */}
        <div className="lg:w-64 border-b lg:border-b-0 lg:border-r border-border p-4">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Categories</span>
          </div>
          <ScrollArea className="h-auto lg:h-[calc(100vh-200px)]">
            <div className="space-y-1">
              {defaultCategories.map((category) => {
                const Icon = category.icon
                const isActive = selectedCategory === category.id
                const count = getCategoryCount(category.id)
                
                return (
                  <Button
                    key={category.id}
                    variant="ghost"
                    onClick={() => setSelectedCategory(category.id)}
                    className={cn(
                      "w-full justify-start gap-3 h-10 transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "hover:bg-accent text-foreground",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="flex-1 text-left text-sm">{category.name}</span>
                    <Badge
                      variant="secondary"
                      className={cn("text-xs", isActive && "bg-primary-foreground/20 text-primary-foreground")}
                    >
                      {count}
                    </Badge>
                  </Button>
                )
              })}
            </div>
          </ScrollArea>
        </div>

        {/* Main Content - Templates Grid */}
        <div className="flex-1 overflow-auto">
          <ScrollArea className="h-full">
            <div className="p-4 lg:p-6">
              {/* Results Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="text-sm text-muted-foreground">
                  Showing {filteredTemplates.length} template{filteredTemplates.length !== 1 ? "s" : ""}
                  {searchQuery && ` for "${searchQuery}"`}
                </div>
              </div>

              {/* Loading State */}
              {isLoading && (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              )}

              {/* Templates Grid */}
              {!isLoading && filteredTemplates.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-96 text-center p-8">
                  <Mail className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    {templates.length === 0 ? "No templates created yet" : "No templates found"}
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-md mb-4">
                    {templates.length === 0 
                      ? "Get started by creating your first email template."
                      : "Try adjusting your search or filter criteria to find what you're looking for."}
                  </p>
                  {templates.length === 0 && (
                    <Button onClick={() => setCreateDialogOpen(true)} className="gap-2">
                      <Plus className="h-4 w-4" />
                      Create Your First Template
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
                  {filteredTemplates.map((template:any) => {
                    const CategoryIcon = getCategoryIcon(String(template.category))
                    return (
                      <Card
                        key={template.id}
                        className="group overflow-hidden border-border hover:border-primary transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
                      >
                        {/* Thumbnail */}
                        <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-primary/10 to-muted">
                          <div className="w-full h-full flex items-center justify-center">
                            <CategoryIcon className="h-12 w-12 text-primary/50" />
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                          {/* Overlay Actions */}
                          <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <Button
                              size="sm"
                              onClick={() => handlePreview(template as any)}
                              className="bg-background/90 hover:bg-background text-foreground gap-2"
                            >
                              <Eye className="h-4 w-4" />
                              Preview
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleSelectTemplate(template as any)}
                              className="bg-primary hover:bg-primary/90 text-white gap-2"
                            >
                              <Check className="h-4 w-4" />
                              Use Template
                            </Button>
                          </div>

                          {/* Rating Badge */}
                          <div className="absolute top-3 right-3">
                            <Badge className="bg-background/90 text-foreground gap-1">
                              <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                              {template.rating || "New"}
                            </Badge>
                          </div>

                          {/* Dropdown Menu */}
                          <div className="absolute top-3 left-3">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 bg-background/90">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="start">
                                <DropdownMenuItem onClick={() => handlePreview(template as any)}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Preview
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleCopyTemplate(template as any)}>
                                  <Copy className="h-4 w-4 mr-2" />
                                  Copy HTML
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleSelectTemplate(template as any)}>
                                  <Check className="h-4 w-4 mr-2" />
                                  Use Template
                                </DropdownMenuItem>
                                <Separator />
                                <DropdownMenuItem 
                                  onClick={() => {
                                    setTemplateToDelete(template.id)
                                    setDeleteDialogOpen(true)
                                  }}
                                  className="text-destructive"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>

                        {/* Content */}
                        <CardContent className="p-4 space-y-3">
                          <div>
                            <CardTitle className="text-base mb-1 line-clamp-1">{template.name}</CardTitle>
                            <CardDescription className="line-clamp-2">{template.description}</CardDescription>
                          </div>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-1">
                            {template.tags.slice(0, 3).map((tag: boolean | Key | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<AwaitedReactNode> | null | undefined) => (
                              <Badge key={Math.random()} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {template.tags.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{template.tags.length - 3}
                              </Badge>
                            )}
                          </div>

                          <Separator className="bg-border" />

                          {/* Footer */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Users className="h-3 w-3" />
                              <span>{template.usageCount?.toLocaleString() || 0} uses</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCopyTemplate(template as any)}
                              className="h-7 gap-1 text-xs"
                            >
                              {copiedId === template.id ? (
                                <>
                                  <Check className="h-3 w-3 text-green-500" />
                                  Copied
                                </>
                              ) : (
                                <>
                                  <Copy className="h-3 w-3" />
                                  Copy HTML
                                </>
                              )}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Create Template Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Create New Template</DialogTitle>
            <DialogDescription>
              Create a new email template with custom content and design.
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Template Name</Label>
                  <Input
                    id="name"
                    value={newTemplate.name}
                    onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                    placeholder="Enter template name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={newTemplate.category}
                    onValueChange={(value) => setNewTemplate({ ...newTemplate, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {defaultCategories.filter(cat => cat.id !== 'all').map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newTemplate.description}
                  onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                  placeholder="Describe your template"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Email Subject</Label>
                <Input
                  id="subject"
                  value={newTemplate.subject}
                  onChange={(e) => setNewTemplate({ ...newTemplate, subject: e.target.value })}
                  placeholder="Enter email subject line"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="htmlContent">HTML Content</Label>
                <Textarea
                  id="htmlContent"
                  value={newTemplate.htmlContent}
                  onChange={(e) => setNewTemplate({ ...newTemplate, htmlContent: e.target.value })}
                  placeholder="Enter your HTML content here"
                  rows={6}
                  className="font-mono text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2">
                  {["newsletter", "promo", "welcome", "transactional", "event"].map((tag) => (
                    <Badge
                      key={tag}
                      variant={newTemplate.tags.includes(tag) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => {
                        const updatedTags = newTemplate.tags.includes(tag)
                          ? newTemplate.tags.filter(t => t !== tag)
                          : [...newTemplate.tags, tag]
                        setNewTemplate({ ...newTemplate, tags: updatedTags })
                      }}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>

          <DialogFooter className="flex gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateTemplate} disabled={!newTemplate.name || !newTemplate.htmlContent}>
              Create Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Template</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this template? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => templateToDelete && handleDeleteTemplate(templateToDelete)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={!!previewTemplate} onOpenChange={() => setPreviewTemplate(null)}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  {previewTemplate?.name}
                </DialogTitle>
                <DialogDescription className="mt-1">{previewTemplate?.description}</DialogDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setPreviewTemplate(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <ScrollArea className="flex-1">
            <div className="space-y-4 p-1">
              {/* Subject Preview */}
              <Card className="p-4 bg-muted border-border">
                <div className="text-xs text-muted-foreground mb-2">Subject Line:</div>
                <div className="font-medium text-foreground">{previewTemplate?.subject}</div>
              </Card>

              {/* Template Preview */}
              <Card className="p-6 bg-background border-border">
                <div className="prose prose-invert max-w-none">
                  {previewTemplate ? (
                    <div dangerouslySetInnerHTML={{ __html: previewTemplate.htmlContent }} />
                  ) : (
                    <div className="text-muted-foreground">No content available</div>
                  )}
                </div>
              </Card>

              {/* Template Info */}
              {previewTemplate && (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-muted rounded-lg gap-4">
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                      <span className="font-medium">{previewTemplate.rating || "New"}</span>
                    </div>
                    <Separator orientation="vertical" className="h-4" />
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{previewTemplate.usageCount?.toLocaleString() || 0} uses</span>
                    </div>
                    <Separator orientation="vertical" className="h-4" />
                    <div className="flex gap-1 flex-wrap">
                      {previewTemplate.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => previewTemplate && handleCopyTemplate(previewTemplate)}
                      className="gap-2"
                    >
                      <Copy className="h-4 w-4" />
                      Copy HTML
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        if (previewTemplate) {
                          handleSelectTemplate(previewTemplate)
                          setPreviewTemplate(null)
                        }
                      }}
                      className="bg-primary hover:bg-primary/90 text-white gap-2"
                    >
                      <Check className="h-4 w-4" />
                      Use This Template
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  )
}