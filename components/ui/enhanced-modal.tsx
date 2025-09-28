"use client"

import * as React from "react"
import { X, Loader2, AlertCircle, CheckCircle, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"

interface EnhancedModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string
  children: React.ReactNode
  size?: "sm" | "md" | "lg" | "xl" | "full"
  isLoading?: boolean
  loadingText?: string
  showCloseButton?: boolean
  className?: string
  variant?: "default" | "success" | "warning" | "error" | "info"
  progress?: number
  showProgress?: boolean
  preventClose?: boolean
  onConfirm?: () => void
  onCancel?: () => void
  confirmText?: string
  cancelText?: string
  showActions?: boolean
  maxHeight?: string
  scrollable?: boolean
  animation?: "fade" | "slide-up" | "slide-down" | "zoom" | "none"
}

const sizeClasses = {
  sm: "sm:max-w-sm",
  md: "sm:max-w-md",
  lg: "sm:max-w-lg",
  xl: "sm:max-w-xl",
  full: "sm:max-w-4xl",
}

const variantIcons = {
  default: null,
  success: CheckCircle,
  warning: AlertCircle,
  error: AlertCircle,
  info: Info,
}

const variantColors = {
  default: "",
  success: "text-green-500",
  warning: "text-yellow-500",
  error: "text-red-500",
  info: "text-blue-500",
}

const animationClasses = {
  fade: "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
  "slide-up":
    "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom-48 data-[state=open]:slide-in-from-bottom-48",
  "slide-down":
    "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-top-48 data-[state=open]:slide-in-from-top-48",
  zoom: "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
  none: "",
}

export function EnhancedModal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = "md",
  isLoading = false,
  loadingText = "Loading...",
  showCloseButton = true,
  className,
  variant = "default",
  progress,
  showProgress = false,
  preventClose = false,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
  showActions = false,
  maxHeight = "80vh",
  scrollable = true,
  animation = "zoom",
}: EnhancedModalProps) {
  const Icon = variantIcons[variant]
  const contentRef = React.useRef<HTMLDivElement>(null)

  const handleClose = React.useCallback(() => {
    if (preventClose || isLoading) return
    onClose()
  }, [preventClose, isLoading, onClose])

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !preventClose && !isLoading) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown)
      return () => document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen, preventClose, isLoading, onClose])

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        className={cn(
          sizeClasses[size], 
          animationClasses[animation], 
          "flex flex-col p-0 overflow-hidden ",
          className
        )}
        style={{ maxHeight }}
        showCloseButton={false}
      >
        {/* <ScrollArea> */}
        {isLoading && (
          <div className="absolute inset-0 bg-background/95 backdrop-blur-sm z-50 flex flex-col items-center justify-center rounded-lg">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <div className="absolute inset-0 h-8 w-8 rounded-full border-2 border-primary/20 animate-pulse" />
              </div>
              <div className="text-center space-y-2">
                <p className="text-sm font-medium text-foreground">{loadingText}</p>
                {showProgress && typeof progress === "number" && (
                  <div className="w-48 space-y-1">
                    <Progress value={progress} className="h-2" />
                    <p className="text-xs text-muted-foreground">{Math.round(progress)}% complete</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex-shrink-0 p-6 pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3 flex-1">
              {Icon && (
                <div className={cn("mt-0.5", variantColors[variant])}>
                  <Icon className="h-5 w-5" />
                </div>
              )}
              <div className="space-y-1 flex-1">
                <DialogTitle className="text-left">{title}</DialogTitle>
                {description && <DialogDescription className="text-left">{description}</DialogDescription>}
              </div>
            </div>
            {showCloseButton && !preventClose && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                disabled={isLoading}
                className="h-8 w-8 p-0 hover:bg-muted/50 transition-colors"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            )}
          </div>
        </div>

        {/* Content area with ScrollArea */}
        <div 
          ref={contentRef}
          className={cn(
            "flex-1 overflow-hidden",
            scrollable ? "min-h-0" : ""
          )}
        >
          {scrollable ? (
            <ScrollArea className="h-full w-full">
              <div className="px-6 pb-6">
                {children}
              </div>
            </ScrollArea>
          ) : (
            <div className="px-6 pb-6">
              {children}
            </div>
          )}
        </div>

        {/* Actions */}
        {showActions && (onConfirm || onCancel) && (
          <div className="flex-shrink-0 p-6 pt-4 border-t">
            <div className="flex items-center justify-end space-x-2">
              {onCancel && (
                <Button
                  variant="outline"
                  onClick={() => {
                    onCancel()
                    if (!preventClose) onClose()
                  }}
                  disabled={isLoading}
                >
                  {cancelText}
                </Button>
              )}
              {onConfirm && (
                <Button
                  onClick={onConfirm}
                  disabled={isLoading}
                  className={cn(
                    variant === "error" && "bg-red-600 hover:bg-red-700",
                    variant === "success" && "bg-green-600 hover:bg-green-700",
                    variant === "warning" && "bg-yellow-600 hover:bg-yellow-700",
                  )}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    confirmText
                  )}
                </Button>
              )}
            </div>
          </div>
        )}
        {/* </ScrollArea> */}
      </DialogContent>
    </Dialog>
  )
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "warning",
  isLoading = false,
}: {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description?: string
  confirmText?: string
  cancelText?: string
  variant?: "warning" | "error" | "info"
  isLoading?: boolean
}) {
  return (
    <EnhancedModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description={description}
      variant={variant}
      showActions
      onConfirm={onConfirm}
      onCancel={onClose}
      confirmText={confirmText}
      cancelText={cancelText}
      isLoading={isLoading}
      preventClose={isLoading}
      size="sm"
      scrollable={false}
    >
      <div className="py-2">
        <p className="text-sm text-muted-foreground">This action cannot be undone. Please confirm to proceed.</p>
      </div>
    </EnhancedModal>
  )
}

export function ProgressModal({
  isOpen,
  onClose,
  title,
  description,
  progress,
  loadingText,
}: {
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string
  progress: number
  loadingText?: string
}) {
  return (
    <EnhancedModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description={description}
      isLoading={true}
      loadingText={loadingText}
      showProgress
      progress={progress}
      preventClose={progress < 100}
      showCloseButton={progress >= 100}
      size="sm"
      scrollable={true}
    >
      <div />
    </EnhancedModal>
  )
}