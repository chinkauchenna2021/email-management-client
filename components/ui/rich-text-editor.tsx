"use client"

import type React from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Link from "@tiptap/extension-link"
import Image from "@tiptap/extension-image"
import TextAlign from "@tiptap/extension-text-align"
import Underline from "@tiptap/extension-underline"
import { Color } from "@tiptap/extension-color"
import { TextStyle } from "@tiptap/extension-text-style"
import Highlight from "@tiptap/extension-highlight"
import Subscript from "@tiptap/extension-subscript"
import Superscript from "@tiptap/extension-superscript"
import {Table} from "@tiptap/extension-table"
import TableRow from "@tiptap/extension-table-row"
import TableHeader from "@tiptap/extension-table-header"
import TableCell from "@tiptap/extension-table-cell"
import FontFamily from "@tiptap/extension-font-family"
import CharacterCount from "@tiptap/extension-character-count"
import TaskList from "@tiptap/extension-task-list"
import TaskItem from "@tiptap/extension-task-item"
import HorizontalRule from "@tiptap/extension-horizontal-rule"
import { Extension } from "@tiptap/core"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Toggle } from "@/components/ui/toggle"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import {
  Bold,
  Italic,
  UnderlineIcon,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  LinkIcon,
  ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Palette,
  Highlighter,
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon,
  Table as TableIcon,
  Minus,
  CheckSquare,
  Type,
  Paintbrush,
  Eraser,
  Eye,
  Save,
  Send,
  Loader2,
  Check,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

// Custom FontSize extension
const FontSize = Extension.create({
  name: 'fontSize',
  addOptions() {
    return {
      types: ['textStyle'],
    }
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: element => element.style.fontSize.replace(/['"]+/g, ''),
            renderHTML: attributes => {
              if (!attributes.fontSize) {
                return {}
              }
              return {
                style: `font-size: ${attributes.fontSize}`,
              }
            },
          },
        },
      },
    ]
  },
  addCommands() {
    return {
      setFontSize: fontSize => ({ chain }) => {
        return chain()
          .setMark('textStyle', { fontSize })
          .run()
      },
      unsetFontSize: () => ({ chain }) => {
        return chain()
          .setMark('textStyle', { fontSize: null })
          .removeEmptyTextStyle()
          .run()
      },
    }
  },
})

interface RichTextEditorProps {
  content?: string
  onChange?: (content: string) => void
  placeholder?: string
  className?: string
  editable?: boolean
  title?: string
  description?: string
  onSave?: (content: string) => Promise<void>
  onSend?: (content: string) => Promise<void>
}

const colors = [
  "#000000", "#374151", "#6B7280", "#9CA3AF", "#D1D5DB", "#F3F4F6",
  "#EF4444", "#F97316", "#F59E0B", "#EAB308", "#84CC16", "#22C55E",
  "#10B981", "#14B8A6", "#06B6D4", "#0EA5E9", "#3B82F6", "#6366F1",
  "#8B5CF6", "#A855F7", "#D946EF", "#EC4899", "#F43F5E", "#FFFFFF"
]

const highlightColors = [
  "#FEF3C7", "#DBEAFE", "#D1FAE5", "#FCE7F3", "#E0E7FF", "#F3E8FF",
  "#FED7D7", "#FDE68A", "#A7F3D0", "#BFDBFE", "#C7D2FE", "#E9D5FF"
]

const fontFamilies = [
  { label: "Default", value: "inherit" },
  { label: "Arial", value: "Arial, sans-serif" },
  { label: "Helvetica", value: "Helvetica, sans-serif" },
  { label: "Times New Roman", value: "Times New Roman, serif" },
  { label: "Courier New", value: "Courier New, monospace" },
  { label: "Georgia", value: "Georgia, serif" },
  { label: "Verdana", value: "Verdana, sans-serif" },
]

const fontSizes = [
  { label: "8px", value: "8px" },
  { label: "10px", value: "10px" },
  { label: "12px", value: "12px" },
  { label: "14px", value: "14px" },
  { label: "16px", value: "16px" },
  { label: "18px", value: "18px" },
  { label: "20px", value: "20px" },
  { label: "24px", value: "24px" },
  { label: "28px", value: "28px" },
  { label: "32px", value: "32px" },
  { label: "36px", value: "36px" },
  { label: "48px", value: "48px" },
]

export function RichTextEditor({
  content = "",
  onChange,
  placeholder = "Start writing...",
  className,
  editable = true,
  title = "Rich Text Editor",
  description = "Create and format your content",
  onSave,
  onSend,
}: RichTextEditorProps) {
  const [linkUrl, setLinkUrl] = useState("")
  const [linkText, setLinkText] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [imageAlt, setImageAlt] = useState("")
  const [linkDialogOpen, setLinkDialogOpen] = useState(false)
  const [imageDialogOpen, setImageDialogOpen] = useState(false)
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [previewHtml, setPreviewHtml] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const { toast } = useToast()

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline underline-offset-4 cursor-pointer",
        },
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-lg",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Color.configure({
        types: ['textStyle'],
      }),
      TextStyle,
      Highlight.configure({
        multicolor: true,
      }),
      FontSize,
      FontFamily.configure({
        types: ['textStyle'],
      }),
      Subscript,
      Superscript,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      CharacterCount,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      HorizontalRule,
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML())
      
      // Auto-save functionality
      const timeoutId = setTimeout(() => {
        handleAutoSave()
      }, 2000)

      return () => clearTimeout(timeoutId)
    },
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-sm sm:prose-base max-w-none focus:outline-none min-h-[300px] p-6",
          "prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground",
          "prose-code:text-foreground prose-blockquote:text-foreground prose-li:text-foreground",
          "[&_table]:border-collapse [&_table]:table-auto [&_table]:w-full",
          "[&_td]:border [&_td]:border-border [&_td]:p-2 [&_td]:min-w-[100px]",
          "[&_th]:border [&_th]:border-border [&_th]:p-2 [&_th]:font-bold [&_th]:bg-muted",
          className,
        ),
      },
    },
  })

  if (!editor) {
    return null
  }

  const handleAutoSave = async () => {
    if (!editor || (!editor.getText().trim())) return

    try {
      await onSave?.(editor.getHTML())
      setLastSaved(new Date())
    } catch (error) {
      console.error("Auto-save failed:", error)
    }
  }

  const handleSave = async () => {
    if (!editor) return

    setIsSaving(true)
    try {
      await onSave?.(editor.getHTML())
      setLastSaved(new Date())
      toast({
        title: "Content saved",
        description: "Your content has been saved successfully.",
      })
    } catch (error) {
      toast({
        title: "Save failed",
        description: "There was an error saving your content. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleSend = async () => {
    if (!editor) return

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
      await onSend?.(editor.getHTML())
      toast({
        title: "Content sent!",
        description: "Your content has been sent successfully.",
      })
    } catch (error) {
      toast({
        title: "Send failed",
        description: "There was an error sending your content. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSending(false)
    }
  }

  const handlePreview = () => {
    if (!editor) return
    setPreviewHtml(editor.getHTML())
    setIsPreviewMode(true)
  }

  const addLink = () => {
    if (!editor) return

    if (linkUrl && linkText) {
      editor.chain().focus().insertContent(`<a href="${linkUrl}">${linkText}</a>`).run()
      setLinkUrl("")
      setLinkText("")
      setLinkDialogOpen(false)
      toast({
        title: "Link inserted",
        description: "Link has been added to your content.",
      })
    }
  }

  const addImage = () => {
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
        description: "Image has been added to your content.",
      })
    }
  }

  const addTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
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

  const ToolbarToggle = ({
    onPressedChange,
    pressed = false,
    disabled = false,
    children,
    title,
  }: {
    onPressedChange: () => void
    pressed?: boolean
    disabled?: boolean
    children: React.ReactNode
    title: string
  }) => (
    <Toggle
      pressed={pressed}
      onPressedChange={onPressedChange}
      disabled={disabled}
      title={title}
      className="h-8 w-8 p-0"
    >
      {children}
    </Toggle>
  )

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleSave}
              disabled={isSaving}
              className="gap-2 bg-transparent hover:bg-accent"
            >
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {isSaving ? "Saving..." : "Save"}
            </Button>

            <Button variant="outline" onClick={handlePreview} className="gap-2 bg-transparent hover:bg-accent">
              <Eye className="h-4 w-4" />
              Preview
            </Button>

            {onSend && (
              <Button
                onClick={handleSend}
                disabled={isSending}
                className="gap-2 bg-primary hover:bg-primary/90 text-white"
              >
                {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {isSending ? "Sending..." : "Send"}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <ScrollArea className="w-full whitespace-nowrap min-h-[50px]  border-b border-border bg-secondary/50">
        <Card className="m-4 p-3 bg-card border-border">
          <div className="flex items-center gap-1 flex-wrap">
            {/* Text Formatting */}
            <div className="flex items-center gap-1">
              <ToolbarToggle
                onPressedChange={() => editor.chain().focus().toggleBold().run()}
                pressed={editor.isActive("bold")}
                title="Bold (Ctrl+B)"
              >
                <Bold className="h-4 w-4" />
              </ToolbarToggle>
              <ToolbarToggle
                onPressedChange={() => editor.chain().focus().toggleItalic().run()}
                pressed={editor.isActive("italic")}
                title="Italic (Ctrl+I)"
              >
                <Italic className="h-4 w-4" />
              </ToolbarToggle>
              <ToolbarToggle
                onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
                pressed={editor.isActive("underline")}
                title="Underline (Ctrl+U)"
              >
                <UnderlineIcon className="h-4 w-4" />
              </ToolbarToggle>
              <ToolbarToggle
                onPressedChange={() => editor.chain().focus().toggleStrike().run()}
                pressed={editor.isActive("strike")}
                title="Strikethrough"
              >
                <Strikethrough className="h-4 w-4" />
              </ToolbarToggle>
              <ToolbarToggle
                onPressedChange={() => editor.chain().focus().toggleCode().run()}
                pressed={editor.isActive("code")}
                title="Code"
              >
                <Code className="h-4 w-4" />
              </ToolbarToggle>
            </div>

            <Separator orientation="vertical" className="h-6 bg-border mx-1" />

            {/* Headings */}
            <div className="flex items-center gap-1">
              <ToolbarToggle
                onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                pressed={editor.isActive("heading", { level: 1 })}
                title="Heading 1"
              >
                <Heading1 className="h-4 w-4" />
              </ToolbarToggle>
              <ToolbarToggle
                onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                pressed={editor.isActive("heading", { level: 2 })}
                title="Heading 2"
              >
                <Heading2 className="h-4 w-4" />
              </ToolbarToggle>
              <ToolbarToggle
                onPressedChange={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                pressed={editor.isActive("heading", { level: 3 })}
                title="Heading 3"
              >
                <Heading3 className="h-4 w-4" />
              </ToolbarToggle>
            </div>

            <Separator orientation="vertical" className="h-6 bg-border mx-1" />

            {/* Font Family and Size */}
            <div className="flex items-center gap-1">
              <Select
                value={editor.getAttributes('textStyle').fontFamily || 'inherit'}
                onValueChange={(value) => {
                  if (value === 'inherit') {
                    editor.chain().focus().unsetFontFamily().run()
                  } else {
                    editor.chain().focus().setFontFamily(value).run()
                  }
                }}
              >
                <SelectTrigger className="w-24 h-8 text-xs">
                  <SelectValue placeholder="Font" />
                </SelectTrigger>
                <SelectContent>
                  {fontFamilies.map((font) => (
                    <SelectItem key={font.value} value={font.value} className="text-xs">
                      <span style={{ fontFamily: font.value }}>{font.label}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={editor.getAttributes('textStyle').fontSize || '16px'}
                onValueChange={(value) => {
                  editor.chain().focus().setFontSize(value).run()
                }}
              >
                <SelectTrigger className="w-16 h-8 text-xs">
                  <SelectValue placeholder="Size" />
                </SelectTrigger>
                <SelectContent>
                  {fontSizes.map((size) => (
                    <SelectItem key={size.value} value={size.value} className="text-xs">
                      {size.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Separator orientation="vertical" className="h-6 bg-border mx-1" />

            {/* Text Color and Highlight */}
            <div className="flex items-center gap-1">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Text Color">
                    <Type className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64">
                  <div className="space-y-3">
                    <div className="text-sm font-medium">Text Color</div>
                    <div className="grid grid-cols-6 gap-2">
                      {colors.map((color) => (
                        <button
                          key={color}
                          className="w-8 h-8 rounded border border-border hover:scale-110 transition-transform"
                          style={{ backgroundColor: color }}
                          onClick={() => editor.chain().focus().setColor(color).run()}
                          title={color}
                        />
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => editor.chain().focus().unsetColor().run()}
                    >
                      <Eraser className="h-4 w-4 mr-2" />
                      Remove Color
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Highlight">
                    <Highlighter className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64">
                  <div className="space-y-3">
                    <div className="text-sm font-medium">Highlight Color</div>
                    <div className="grid grid-cols-6 gap-2">
                      {highlightColors.map((color) => (
                        <button
                          key={color}
                          className="w-8 h-8 rounded border border-border hover:scale-110 transition-transform"
                          style={{ backgroundColor: color }}
                          onClick={() => editor.chain().focus().toggleHighlight({ color }).run()}
                          title={color}
                        />
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => editor.chain().focus().unsetHighlight().run()}
                    >
                      <Eraser className="h-4 w-4 mr-2" />
                      Remove Highlight
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <Separator orientation="vertical" className="h-6 bg-border mx-1" />

            {/* Alignment */}
            <div className="flex items-center gap-1">
              <ToolbarToggle
                onPressedChange={() => editor.chain().focus().setTextAlign("left").run()}
                pressed={editor.isActive({ textAlign: "left" })}
                title="Align Left"
              >
                <AlignLeft className="h-4 w-4" />
              </ToolbarToggle>
              <ToolbarToggle
                onPressedChange={() => editor.chain().focus().setTextAlign("center").run()}
                pressed={editor.isActive({ textAlign: "center" })}
                title="Align Center"
              >
                <AlignCenter className="h-4 w-4" />
              </ToolbarToggle>
              <ToolbarToggle
                onPressedChange={() => editor.chain().focus().setTextAlign("right").run()}
                pressed={editor.isActive({ textAlign: "right" })}
                title="Align Right"
              >
                <AlignRight className="h-4 w-4" />
              </ToolbarToggle>
              <ToolbarToggle
                onPressedChange={() => editor.chain().focus().setTextAlign("justify").run()}
                pressed={editor.isActive({ textAlign: "justify" })}
                title="Justify"
              >
                <AlignJustify className="h-4 w-4" />
              </ToolbarToggle>
            </div>

            <Separator orientation="vertical" className="h-6 bg-border mx-1" />

            {/* Lists */}
            <div className="flex items-center gap-1">
              <ToolbarToggle
                onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
                pressed={editor.isActive("bulletList")}
                title="Bullet List"
              >
                <List className="h-4 w-4" />
              </ToolbarToggle>
              <ToolbarToggle
                onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
                pressed={editor.isActive("orderedList")}
                title="Numbered List"
              >
                <ListOrdered className="h-4 w-4" />
              </ToolbarToggle>
              <ToolbarToggle
                onPressedChange={() => editor.chain().focus().toggleTaskList().run()}
                pressed={editor.isActive("taskList")}
                title="Task List"
              >
                <CheckSquare className="h-4 w-4" />
              </ToolbarToggle>
              <ToolbarToggle
                onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
                pressed={editor.isActive("blockquote")}
                title="Quote"
              >
                <Quote className="h-4 w-4" />
              </ToolbarToggle>
            </div>

            <Separator orientation="vertical" className="h-6 bg-border mx-1" />

            {/* Insert Elements */}
            <div className="flex items-center gap-1">
              <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Add Link">
                    <LinkIcon className="h-4 w-4" />
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
                        onKeyDown={(e) => e.key === 'Enter' && addLink()}
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setLinkDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={addLink} disabled={!linkUrl || !linkText}>
                        Insert Link
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Add Image">
                    <ImageIcon className="h-4 w-4" />
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
                        onKeyDown={(e) => e.key === 'Enter' && addImage()}
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
                      <Button onClick={addImage} disabled={!imageUrl}>
                        Insert Image
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <ToolbarButton onClick={addTable} title="Insert Table">
                <TableIcon className="h-4 w-4" />
              </ToolbarButton>

              <ToolbarButton
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
                title="Horizontal Rule"
              >
                <Minus className="h-4 w-4" />
              </ToolbarButton>

              <ToolbarToggle
                onPressedChange={() => editor.chain().focus().toggleSubscript().run()}
                pressed={editor.isActive("subscript")}
                title="Subscript"
              >
                <SubscriptIcon className="h-4 w-4" />
              </ToolbarToggle>

              <ToolbarToggle
                onPressedChange={() => editor.chain().focus().toggleSuperscript().run()}
                pressed={editor.isActive("superscript")}
                title="Superscript"
              >
                <SuperscriptIcon className="h-4 w-4" />
              </ToolbarToggle>
            </div>

            <Separator orientation="vertical" className="h-6 bg-border mx-1" />

            {/* Undo/Redo */}
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
          </div>
        </Card>
      </ScrollArea>

      {/* Editor Content */}
      <div className="flex-1 p-4 overflow-auto">
        <Card className="min-h-[500px] bg-card border-border overflow-hidden">
          <EditorContent
            editor={editor}
            className="prose prose-sm max-w-none [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[300px] [&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_.ProseMirror_p.is-editor-empty:first-child::before]:float-left [&_.ProseMirror_p.is-editor-empty:first-child::before]:text-muted-foreground [&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none [&_.ProseMirror_p.is-editor-empty:first-child::before]:h-0"
          />
        </Card>
      </div>

      {/* Footer */}
      <div className="border-t border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span>Auto-save enabled</span>
            </div>
            {lastSaved && (
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Last saved {lastSaved.toLocaleTimeString()}</span>
              </div>
            )}
            <div>
              {editor.storage.characterCount?.characters() || 0} characters • {" "}
              {editor.storage.characterCount?.words() || 0} words
            </div>
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
                "Save Draft"
              )}
            </Button>
            {onSend && (
              <Button
                onClick={handleSend}
                disabled={isSending}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                {isSending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Sending...
                  </>
                ) : (
                  "Send"
                )}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Preview Dialog */}
      <Dialog open={isPreviewMode} onOpenChange={setIsPreviewMode}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Content Preview
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="border rounded-lg p-6 bg-background">
              <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: previewHtml }} />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}