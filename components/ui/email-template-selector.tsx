"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Eye, Copy, Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface EmailTemplate {
  id: string
  name: string
  description: string
  category: string
  content: string
  thumbnail?: string
  isPopular?: boolean
}

const emailTemplates: EmailTemplate[] = [
  {
    id: "welcome-series",
    name: "Welcome Series",
    description: "Perfect for onboarding new subscribers",
    category: "Welcome",
    content: `<h1>Welcome to Our Community!</h1>
<p>We're thrilled to have you join us. Here's what you can expect:</p>
<ul>
<li>Weekly insights and tips</li>
<li>Exclusive offers and discounts</li>
<li>Early access to new features</li>
</ul>
<p>Get started by exploring our <a href="#">resource center</a>.</p>`,
    isPopular: true,
  },
  {
    id: "newsletter",
    name: "Newsletter Template",
    description: "Clean and professional newsletter layout",
    category: "Newsletter",
    content: `<h1>This Week's Highlights</h1>
<h2>Featured Article</h2>
<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
<h2>Quick Updates</h2>
<ul>
<li>Product update: New dashboard features</li>
<li>Community: Join our upcoming webinar</li>
<li>Resources: Check out our latest blog posts</li>
</ul>`,
  },
  {
    id: "promotional",
    name: "Promotional Campaign",
    description: "Eye-catching design for sales and promotions",
    category: "Promotional",
    content: `<h1 style="color: #ef4444;">🔥 Limited Time Offer!</h1>
<p style="font-size: 18px; font-weight: bold;">Save up to 50% on all products</p>
<p>Don't miss out on our biggest sale of the year. Use code <strong>SAVE50</strong> at checkout.</p>
<p style="text-align: center;">
<a href="#" style="background-color: #ef4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Shop Now</a>
</p>`,
    isPopular: true,
  },
  {
    id: "product-launch",
    name: "Product Launch",
    description: "Announce new products with style",
    category: "Announcement",
    content: `<h1>Introducing Our Latest Innovation</h1>
<p>We're excited to announce the launch of our newest product that will revolutionize the way you work.</p>
<h2>Key Features:</h2>
<ul>
<li>Advanced automation capabilities</li>
<li>Seamless integrations</li>
<li>Enhanced security</li>
</ul>
<p><a href="#">Learn more about the features</a> or <a href="#">start your free trial</a> today.</p>`,
  },
  {
    id: "event-invitation",
    name: "Event Invitation",
    description: "Invite subscribers to webinars and events",
    category: "Event",
    content: `<h1>You're Invited!</h1>
<h2>Join us for an exclusive webinar</h2>
<p><strong>Date:</strong> March 25, 2024<br>
<strong>Time:</strong> 2:00 PM EST<br>
<strong>Duration:</strong> 1 hour</p>
<p>Learn about the latest trends and best practices from industry experts.</p>
<p style="text-align: center;">
<a href="#" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Register Now</a>
</p>`,
  },
  {
    id: "feedback-survey",
    name: "Feedback Survey",
    description: "Collect valuable feedback from customers",
    category: "Survey",
    content: `<h1>We Value Your Opinion</h1>
<p>Help us improve by sharing your thoughts and experiences. Your feedback is incredibly valuable to us.</p>
<p>The survey takes just 2 minutes to complete, and as a thank you, you'll receive a 10% discount on your next purchase.</p>
<p style="text-align: center;">
<a href="#" style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Take Survey</a>
</p>`,
  },
]

const categories = ["All", "Welcome", "Newsletter", "Promotional", "Announcement", "Event", "Survey"]

interface EmailTemplateSelectorProps {
  onSelectTemplate: (template: EmailTemplate) => void
  onClose: () => void
}

export function EmailTemplateSelector({ onSelectTemplate, onClose }: EmailTemplateSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")
  const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | null>(null)

  const filteredTemplates = emailTemplates.filter((template) => {
    const matchesCategory = selectedCategory === "All" || template.category === selectedCategory
    const matchesSearch =
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleSelectTemplate = (template: EmailTemplate) => {
    onSelectTemplate(template)
    onClose()
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
      {/* Template List */}
      <div className="lg:col-span-2 space-y-4">
        {/* Search and Categories */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <ScrollArea className="h-[450px]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-4">
            {filteredTemplates.map((template) => (
              <Card
                key={template.id}
                className={cn(
                  "cursor-pointer transition-all hover:shadow-md",
                  previewTemplate?.id === template.id && "ring-2 ring-primary",
                )}
                onClick={() => setPreviewTemplate(template)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <CardTitle className="text-sm">{template.name}</CardTitle>
                        {template.isPopular && (
                          <Badge variant="secondary" className="text-xs">
                            <Star className="w-3 h-3 mr-1" />
                            Popular
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="text-xs">{template.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {template.category}
                    </Badge>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          setPreviewTemplate(template)
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleSelectTemplate(template)
                        }}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Preview Panel */}
      <div className="space-y-4">
        <h3 className="font-semibold">Preview</h3>
        {previewTemplate ? (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm">{previewTemplate.name}</CardTitle>
                  <CardDescription className="text-xs">{previewTemplate.description}</CardDescription>
                </div>
                {previewTemplate.isPopular && (
                  <Badge variant="secondary" className="text-xs">
                    <Star className="w-3 h-3 mr-1" />
                    Popular
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ScrollArea className="h-[300px] border rounded-md p-4">
                <div
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: previewTemplate.content }}
                />
              </ScrollArea>
              <Button onClick={() => handleSelectTemplate(previewTemplate)} className="w-full">
                Use This Template
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="flex items-center justify-center h-[400px] text-muted-foreground">
              Select a template to preview
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
