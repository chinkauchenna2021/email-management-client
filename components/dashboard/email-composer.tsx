"use client"

import type React from "react"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import Link from "@tiptap/extension-link"
import Image from "@tiptap/extension-image"
import TextAlign from "@tiptap/extension-text-align"
import Underline from "@tiptap/extension-underline"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Send,
  Save,
  Eye,
  Code,
  Heading1,
  Heading2,
  Heading3,
  LinkIcon,
  ImageIcon,
  Calendar,
  Clock,
  Users,
  Paperclip,
  Loader2,
  Check,
  ChevronDown,
  Search,
  AlignLeft,
  AlignCenter,
  AlignRight,
  UnderlineIcon,
  Strikethrough,
  X,
} from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { useCampaignStore } from "@/store/campaignStore"
import {  useEmailListStore } from "@/store/emailListStore"
import { useTemplateStore } from "@/store/templateStore"
import { ProtectedRoute } from "../auth/protected-route"

interface Campaign {
  id: string
  name: string
  emailCount: number
  status: "active" | "draft" | "completed"
  createdAt: Date
  description?: string
}

interface EmailComposerProps {
  campaigns?: Campaign[]
  selectedCampaign?: Campaign
  onCampaignSelect?: (campaign: Campaign) => void
  onSave?: (data: EmailData) => Promise<void>
  onSend?: (data: EmailData) => Promise<void>
  onPreview?: (data: EmailData) => void
}

interface EmailData {
  subject: string
  content: string
  htmlContent: string
  campaignId?: string
}

// Mock campaigns data
const mockCampaigns: Campaign[] = [
  {
    id: "1",
    name: "Summer Sale 2024",
    emailCount: 15420,
    status: "active",
    createdAt: new Date("2024-06-01"),
    description: "Promotional campaign for summer products",
  },
  {
    id: "2",
    name: "Newsletter Subscribers",
    emailCount: 8750,
    status: "active",
    createdAt: new Date("2024-05-15"),
    description: "Weekly newsletter recipients",
  },
  {
    id: "3",
    name: "VIP Customers",
    emailCount: 2340,
    status: "active",
    createdAt: new Date("2024-05-20"),
    description: "Premium tier customers",
  },
  {
    id: "4",
    name: "Product Launch Beta",
    emailCount: 1250,
    status: "draft",
    createdAt: new Date("2024-06-10"),
    description: "Beta testers for new product",
  },
  {
    id: "5",
    name: "Holiday Campaign",
    emailCount: 22100,
    status: "completed",
    createdAt: new Date("2024-04-01"),
    description: "Holiday season promotional emails",
  },
]

export function EmailComposer({
  campaigns = mockCampaigns,
  selectedCampaign,
  onCampaignSelect,
  onSave,
  onSend,
  onPreview,
}: EmailComposerProps) {
  const [subject, setSubject] = useState("")
  const [currentCampaign, setCurrentCampaign] = useState<Campaign | undefined>(selectedCampaign)
  const [campaignSelectorOpen, setCampaignSelectorOpen] = useState(false)
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [previewHtml, setPreviewHtml] = useState("")
  const [linkDialogOpen, setLinkDialogOpen] = useState(false)
  const [linkUrl, setLinkUrl] = useState("")
  const [linkText, setLinkText] = useState("")
  const [imageDialogOpen, setImageDialogOpen] = useState(false)
  const [imageUrl, setImageUrl] = useState("")
  const [imageAlt, setImageAlt] = useState("")
  const { toast } = useToast()



  const { createCampaign } = useCampaignStore();
  const { emailLists } = useEmailListStore();
  const { templates } = useTemplateStore();

  const handleSendCampaign = async (campaignData: any) => {
    try {
      await createCampaign(campaignData);
      // Show success message
    } catch (error) {
      // Show error message
    }
  };






  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Start writing your email content here...",
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline cursor-pointer",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-lg",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Underline,
    ],
    content: "",
    editorProps: {
      attributes: {
        class: "prose prose-invert max-w-none min-h-[400px] p-6 focus:outline-none text-foreground",
      },
    },
    onUpdate: ({ editor }) => {
      const timeoutId = setTimeout(() => {
        handleAutoSave()
      }, 2000)

      return () => clearTimeout(timeoutId)
    },
  })

  useState(() => {
    const savedTemplate = localStorage.getItem("selectedTemplate")
    if (savedTemplate) {
      try {
        const template = JSON.parse(savedTemplate)
        setSubject(template.subject)
        if (editor) {
          editor.commands.setContent(template.htmlContent)
        }
        localStorage.removeItem("selectedTemplate")
        toast({
          title: "Template loaded",
          description: `"${template.name}" has been loaded into the editor.`,
        })
      } catch (error) {
        console.error("Failed to load template:", error)
      }
    }
  })

  const handleCampaignSelect = (campaign: Campaign) => {
    setCurrentCampaign(campaign)
    onCampaignSelect?.(campaign)
    setCampaignSelectorOpen(false)
    toast({
      title: "Campaign selected",
      description: `Selected "${campaign.name}" with ${campaign.emailCount.toLocaleString()} recipients.`,
    })
  }

  const handleAutoSave = async () => {
    if (!editor || (!subject.trim() && !editor.getText().trim())) return

    try {
      const data: EmailData = {
        subject,
        content: editor.getText(),
        htmlContent: editor.getHTML(),
        campaignId: currentCampaign?.id,
      }

      await onSave?.(data)
      setLastSaved(new Date())
    } catch (error) {
      console.error("Auto-save failed:", error)
    }
  }

  const handleSave = async () => {
    if (!editor) return

    setIsSaving(true)
    try {
      const data: EmailData = {
        subject,
        content: editor.getText(),
        htmlContent: editor.getHTML(),
        campaignId: currentCampaign?.id,
      }

      await onSave?.(data)
      setLastSaved(new Date())
      toast({
        title: "Draft saved",
        description: "Your email has been saved successfully.",
      })
    } catch (error) {
      toast({
        title: "Save failed",
        description: "There was an error saving your email. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleSend = async () => {
    if (!editor) return

    if (!currentCampaign) {
      toast({
        title: "Campaign required",
        description: "Please select a campaign before sending.",
        variant: "destructive",
      })
      return
    }

    if (!subject.trim()) {
      toast({
        title: "Subject required",
        description: "Please add a subject line before sending.",
        variant: "destructive",
      })
      return
    }

    if (!editor.getText().trim()) {
      toast({
        title: "Content required",
        description: "Please add some content before sending.",
        variant: "destructive",
      })
      return
    }

    setIsSending(true)
    try {
      const data: EmailData = {
        subject,
        content: editor.getText(),
        htmlContent: editor.getHTML(),
        campaignId: currentCampaign.id,
      }

      await onSend?.(data)
      toast({
        title: "Campaign sent!",
        description: `Your email has been sent to ${currentCampaign.emailCount.toLocaleString()} recipients.`,
      })
    } catch (error) {
      toast({
        title: "Send failed",
        description: "There was an error sending your email. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSending(false)
    }
  }

  const handlePreview = () => {
    if (!editor) return

    const data: EmailData = {
      subject,
      content: editor.getText(),
      htmlContent: editor.getHTML(),
      campaignId: currentCampaign?.id,
    }

    setPreviewHtml(data.htmlContent)
    setIsPreviewMode(true)
    onPreview?.(data)
  }

  const handleInsertLink = () => {
    if (!editor) return

    if (linkUrl && linkText) {
      editor.chain().focus().insertContent(`<a href="${linkUrl}">${linkText}</a>`).run()
      setLinkUrl("")
      setLinkText("")
      setLinkDialogOpen(false)
      toast({
        title: "Link inserted",
        description: "Link has been added to your email.",
      })
    }
  }

  const handleInsertImage = () => {
    if (!editor) return

    if (imageUrl) {
      editor
        .chain()
        .focus()
        .setImage({ src: imageUrl, alt: imageAlt || "Image" })
        .run()
      setImageUrl("")
      setImageAlt("")
      setImageDialogOpen(false)
      toast({
        title: "Image inserted",
        description: "Image has been added to your email.",
      })
    }
  }

  const ToolbarButton = ({
    onClick,
    isActive = false,
    disabled = false,
    children,
    title,
    loading = false,
    variant = "ghost",
  }: {
    onClick: () => void
    isActive?: boolean
    disabled?: boolean
    children: React.ReactNode
    title: string
    loading?: boolean
    variant?: "ghost" | "outline"
  }) => (
    <Button
      variant={variant}
      size="sm"
      onClick={onClick}
      disabled={disabled || loading}
      title={title}
      className={cn(
        "h-8 w-8 p-0 hover:bg-accent transition-colors",
        isActive && "bg-accent text-accent-foreground",
        disabled && "opacity-50 cursor-not-allowed",
      )}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : children}
    </Button>
  )

  if (!editor) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading editor...</p>
        </div>
      </div>
    )
  }

  return (
    <ProtectedRoute>
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Compose Email</h1>
            <p className="text-sm text-muted-foreground mt-1">Create and send your email campaign</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleSave}
              disabled={isSaving}
              className="gap-2 bg-transparent hover:bg-accent"
            >
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {isSaving ? "Saving..." : "Save Draft"}
            </Button>

            <Button variant="outline" onClick={handlePreview} className="gap-2 bg-transparent hover:bg-accent">
              <Eye className="h-4 w-4" />
              Preview
            </Button>

            <Button
              onClick={handleSend}
              disabled={isSending || !currentCampaign}
              className="gap-2 bg-primary hover:bg-primary/90 text-white"
            >
              {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              {isSending ? "Sending..." : "Send Campaign"}
            </Button>
          </div>
        </div>

        {/* Campaign Info */}
        {currentCampaign && (
          <Card className="p-4 bg-card border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium text-card-foreground">{currentCampaign.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {currentCampaign.emailCount.toLocaleString()} recipients • Created{" "}
                    {currentCampaign.createdAt.toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={currentCampaign.status === "active" ? "default" : "secondary"} className="gap-1">
                  <Clock className="h-3 w-3" />
                  {currentCampaign.status === "active" ? "Ready to send" : currentCampaign.status}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentCampaign(undefined)}
                  className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Email Form */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="space-y-2">
            <Label htmlFor="campaign" className="text-sm font-medium text-foreground">
              Select contacts for the campaign
            </Label>
            <Popover open={campaignSelectorOpen} onOpenChange={setCampaignSelectorOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={campaignSelectorOpen}
                  className="w-full justify-between h-12 bg-input border-border hover:bg-accent"
                >
                  {currentCampaign ? (
                    <div className="flex items-center gap-3">
                      <Users className="h-4 w-4 text-primary" />
                      <div className="text-left">
                        <div className="font-medium">{currentCampaign.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {currentCampaign.emailCount.toLocaleString()} recipients
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Search className="h-4 w-4" />
                      <span>Search and select a campaign...</span>
                    </div>
                  )}
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search campaigns..." className="h-9" />
                  <CommandEmpty>No campaigns found.</CommandEmpty>
                  <CommandList>
                    <ScrollArea className="h-[300px]">
                      <CommandGroup>
                        {campaigns.map((campaign) => (
                          <CommandItem
                            key={campaign.id}
                            value={campaign.name}
                            onSelect={() => handleCampaignSelect(campaign)}
                            className="flex items-center gap-3 p-3 cursor-pointer"
                          >
                            <Users className="h-4 w-4 text-primary" />
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="font-medium">{campaign.name}</span>
                                <Badge
                                  variant={
                                    campaign.status === "active"
                                      ? "default"
                                      : campaign.status === "draft"
                                        ? "secondary"
                                        : "outline"
                                  }
                                  className="text-xs"
                                >
                                  {campaign.status}
                                </Badge>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {campaign.emailCount.toLocaleString()} recipients
                              </div>
                              {campaign.description && (
                                <div className="text-xs text-muted-foreground mt-1">{campaign.description}</div>
                              )}
                            </div>
                            <Check
                              className={cn(
                                "ml-auto h-4 w-4",
                                currentCampaign?.id === campaign.id ? "opacity-100" : "opacity-0",
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </ScrollArea>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Subject Line */}
          <div className="space-y-2">
            <Label htmlFor="subject" className="text-sm font-medium text-foreground">
              Subject Line
            </Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter your email subject..."
              className="text-base bg-input border-border focus:border-primary focus:ring-primary transition-colors"
            />
          </div>

          <Separator className="bg-border" />

          <Card className="p-3 bg-card border-border">
            <div className="flex items-center gap-1 flex-wrap">
              {/* Text Formatting */}
              <div className="flex items-center gap-1">
                <ToolbarButton
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  isActive={editor.isActive("bold")}
                  title="Bold (Ctrl+B)"
                >
                  <Bold className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  isActive={editor.isActive("italic")}
                  title="Italic (Ctrl+I)"
                >
                  <Italic className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                  onClick={() => editor.chain().focus().toggleUnderline().run()}
                  isActive={editor.isActive("underline")}
                  title="Underline (Ctrl+U)"
                >
                  <UnderlineIcon className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                  onClick={() => editor.chain().focus().toggleStrike().run()}
                  isActive={editor.isActive("strike")}
                  title="Strikethrough"
                >
                  <Strikethrough className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                  onClick={() => editor.chain().focus().toggleCode().run()}
                  isActive={editor.isActive("code")}
                  title="Code"
                >
                  <Code className="h-4 w-4" />
                </ToolbarButton>
              </div>

              <Separator orientation="vertical" className="h-6 bg-border mx-1" />

              {/* Headings */}
              <div className="flex items-center gap-1">
                <ToolbarButton
                  onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                  isActive={editor.isActive("heading", { level: 1 })}
                  title="Heading 1"
                >
                  <Heading1 className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                  onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                  isActive={editor.isActive("heading", { level: 2 })}
                  title="Heading 2"
                >
                  <Heading2 className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                  onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                  isActive={editor.isActive("heading", { level: 3 })}
                  title="Heading 3"
                >
                  <Heading3 className="h-4 w-4" />
                </ToolbarButton>
              </div>

              <Separator orientation="vertical" className="h-6 bg-border mx-1" />

              <div className="flex items-center gap-1">
                <ToolbarButton
                  onClick={() => editor.chain().focus().setTextAlign("left").run()}
                  isActive={editor.isActive({ textAlign: "left" })}
                  title="Align Left"
                >
                  <AlignLeft className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                  onClick={() => editor.chain().focus().setTextAlign("center").run()}
                  isActive={editor.isActive({ textAlign: "center" })}
                  title="Align Center"
                >
                  <AlignCenter className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                  onClick={() => editor.chain().focus().setTextAlign("right").run()}
                  isActive={editor.isActive({ textAlign: "right" })}
                  title="Align Right"
                >
                  <AlignRight className="h-4 w-4" />
                </ToolbarButton>
              </div>

              <Separator orientation="vertical" className="h-6 bg-border mx-1" />

              {/* Lists */}
              <div className="flex items-center gap-1">
                <ToolbarButton
                  onClick={() => editor.chain().focus().toggleBulletList().run()}
                  isActive={editor.isActive("bulletList")}
                  title="Bullet List"
                >
                  <List className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                  onClick={() => editor.chain().focus().toggleOrderedList().run()}
                  isActive={editor.isActive("orderedList")}
                  title="Numbered List"
                >
                  <ListOrdered className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                  onClick={() => editor.chain().focus().toggleBlockquote().run()}
                  isActive={editor.isActive("blockquote")}
                  title="Quote"
                >
                  <Quote className="h-4 w-4" />
                </ToolbarButton>
              </div>

              <Separator orientation="vertical" className="h-6 bg-border mx-1" />

              {/* Actions */}
              <div className="flex items-center gap-1">
                <ToolbarButton
                  onClick={() => editor.chain().focus().undo().run()}
                  disabled={!editor.can().undo()}
                  title="Undo (Ctrl+Z)"
                >
                  <Undo className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                  onClick={() => editor.chain().focus().redo().run()}
                  disabled={!editor.can().redo()}
                  title="Redo (Ctrl+Y)"
                >
                  <Redo className="h-4 w-4" />
                </ToolbarButton>
              </div>

              <div className="ml-auto flex items-center gap-1">
                <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-2 text-muted-foreground hover:text-foreground hover:bg-accent"
                    >
                      <LinkIcon className="h-4 w-4" />
                      Link
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Insert Link</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="link-text">Link Text</Label>
                        <Input
                          id="link-text"
                          value={linkText}
                          onChange={(e) => setLinkText(e.target.value)}
                          placeholder="Enter link text..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="link-url">URL</Label>
                        <Input
                          id="link-url"
                          value={linkUrl}
                          onChange={(e) => setLinkUrl(e.target.value)}
                          placeholder="https://example.com"
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setLinkDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleInsertLink} disabled={!linkUrl || !linkText}>
                          Insert Link
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-2 text-muted-foreground hover:text-foreground hover:bg-accent"
                    >
                      <ImageIcon className="h-4 w-4" />
                      Image
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Insert Image</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="image-url">Image URL</Label>
                        <Input
                          id="image-url"
                          value={imageUrl}
                          onChange={(e) => setImageUrl(e.target.value)}
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="image-alt">Alt Text (Optional)</Label>
                        <Input
                          id="image-alt"
                          value={imageAlt}
                          onChange={(e) => setImageAlt(e.target.value)}
                          placeholder="Describe the image..."
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setImageDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleInsertImage} disabled={!imageUrl}>
                          Insert Image
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 text-muted-foreground hover:text-foreground hover:bg-accent"
                  onClick={() => {
                    toast({
                      title: "File upload",
                      description: "File upload functionality coming soon!",
                    })
                  }}
                >
                  <Paperclip className="h-4 w-4" />
                  Attach
                </Button>
              </div>
            </div>
          </Card>

          {/* Editor */}
          <Card className="min-h-[500px] bg-card border-border overflow-hidden">
            <EditorContent editor={editor} className="h-full" />
          </Card>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Auto-save enabled</span>
              </div>
              {lastSaved && (
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Last saved {lastSaved.toLocaleTimeString()}</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={handleSave}
                disabled={isSaving}
                className="hover:bg-accent bg-transparent"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  "Save as Draft"
                )}
              </Button>
              <Button
                onClick={handleSend}
                disabled={isSending || !currentCampaign}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                {isSending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Sending...
                  </>
                ) : (
                  `Send to ${currentCampaign?.emailCount.toLocaleString() || "0"} Recipients`
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isPreviewMode} onOpenChange={setIsPreviewMode}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Email Preview
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground mb-2">Subject:</div>
              <div className="font-medium">{subject || "No subject"}</div>
            </div>
            <div className="border rounded-lg p-6 bg-background">
              <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: previewHtml }} />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
    </ProtectedRoute>
  )
}
