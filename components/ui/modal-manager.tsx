"use client"

import * as React from "react"
import { EnhancedModal, ConfirmationModal, ProgressModal } from "./enhanced-modal"

interface ModalState {
  id: string
  type: "default" | "confirmation" | "progress"
  props: any
}

interface ModalContextType {
  openModal: (modal: Omit<ModalState, "id">) => string
  closeModal: (id: string) => void
  closeAllModals: () => void
  updateModal: (id: string, props: Partial<any>) => void
}

const ModalContext = React.createContext<ModalContextType | null>(null)

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [modals, setModals] = React.useState<ModalState[]>([])

  const openModal = React.useCallback((modal: Omit<ModalState, "id">) => {
    const id = Math.random().toString(36).substr(2, 9)
    setModals((prev) => [...prev, { ...modal, id }])
    return id
  }, [])

  const closeModal = React.useCallback((id: string) => {
    setModals((prev) => prev.filter((modal) => modal.id !== id))
  }, [])

  const closeAllModals = React.useCallback(() => {
    setModals([])
  }, [])

  const updateModal = React.useCallback((id: string, props: Partial<any>) => {
    setModals((prev) =>
      prev.map((modal) => (modal.id === id ? { ...modal, props: { ...modal.props, ...props } } : modal)),
    )
  }, [])

  const contextValue = React.useMemo(
    () => ({
      openModal,
      closeModal,
      closeAllModals,
      updateModal,
    }),
    [openModal, closeModal, closeAllModals, updateModal],
  )

  return (
    <ModalContext.Provider value={contextValue}>
      {children}
      {modals.map((modal) => {
        const commonProps = {
          key: modal.id,
          isOpen: true,
          onClose: () => closeModal(modal.id),
          ...modal.props,
        }

        switch (modal.type) {
          case "confirmation":
            return <ConfirmationModal {...commonProps} />
          case "progress":
            return <ProgressModal {...commonProps} />
          default:
            return <EnhancedModal {...commonProps} />
        }
      })}
    </ModalContext.Provider>
  )
}

export function useModal() {
  const context = React.useContext(ModalContext)
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider")
  }
  return context
}

export function useConfirmation() {
  const { openModal } = useModal()

  return React.useCallback(
    (options: {
      title: string
      description?: string
      onConfirm: () => void | Promise<void>
      confirmText?: string
      cancelText?: string
      variant?: "warning" | "error" | "info"
    }) => {
      return new Promise<boolean>((resolve) => {
        openModal({
          type: "confirmation",
          props: {
            ...options,
            onConfirm: async () => {
              try {
                await options.onConfirm()
                resolve(true)
              } catch (error) {
                console.error("Confirmation action failed:", error)
                resolve(false)
              }
            },
            onCancel: () => resolve(false),
          },
        })
      })
    },
    [openModal],
  )
}

export function useProgress() {
  const { openModal, updateModal, closeModal } = useModal()

  return React.useCallback(() => {
    let modalId: string

    return {
      start: (title: string, description?: string) => {
        modalId = openModal({
          type: "progress",
          props: {
            title,
            description,
            progress: 0,
            loadingText: "Starting...",
          },
        })
        return modalId
      },
      update: (progress: number, loadingText?: string) => {
        if (modalId) {
          updateModal(modalId, { progress, loadingText })
        }
      },
      complete: (message?: string) => {
        if (modalId) {
          updateModal(modalId, {
            progress: 100,
            loadingText: message || "Complete!",
          })
          setTimeout(() => closeModal(modalId), 1500)
        }
      },
      error: (message: string) => {
        if (modalId) {
          updateModal(modalId, {
            progress: 0,
            loadingText: message,
            variant: "error",
          })
        }
      },
      close: () => {
        if (modalId) {
          closeModal(modalId)
        }
      },
    }
  }, [openModal, updateModal, closeModal])
}
