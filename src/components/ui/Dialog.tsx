"use client"

import type React from "react"
import { useEffect, useRef } from "react"

interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}

export const Dialog: React.FC<DialogProps> = ({ open, onOpenChange, children }) => {
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onOpenChange(false)
      }
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(e.target as Node)) {
        onOpenChange(false)
      }
    }

    if (open) {
      document.addEventListener("keydown", handleEscape)
      document.addEventListener("mousedown", handleClickOutside)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.removeEventListener("mousedown", handleClickOutside)
      document.body.style.overflow = "unset"
    }
  }, [open, onOpenChange])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Dialog Content */}
      <div ref={dialogRef} className="relative z-50 w-full max-w-lg mx-4">
        {children}
      </div>
    </div>
  )
}

interface DialogContentProps {
  className?: string
  children: React.ReactNode
}

export const DialogContent: React.FC<DialogContentProps> = ({ className = "", children }) => {
  return (
    <div className={`bg-white rounded-2xl shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto ${className}`}>
      {children}
    </div>
  )
}

interface DialogHeaderProps {
  className?: string
  children: React.ReactNode
}

export const DialogHeader: React.FC<DialogHeaderProps> = ({ className = "", children }) => {
  return <div className={`p-6 pb-4 ${className}`}>{children}</div>
}

interface DialogTitleProps {
  className?: string
  children: React.ReactNode
}

export const DialogTitle: React.FC<DialogTitleProps> = ({ className = "", children }) => {
  return <h2 className={`text-xl font-semibold text-gray-900 ${className}`}>{children}</h2>
}

interface DialogDescriptionProps {
  className?: string
  children: React.ReactNode
}

export const DialogDescription: React.FC<DialogDescriptionProps> = ({ className = "", children }) => {
  return <p className={`text-sm text-gray-600 mt-2 ${className}`}>{children}</p>
}

interface DialogFooterProps {
  className?: string
  children: React.ReactNode
}

export const DialogFooter: React.FC<DialogFooterProps> = ({ className = "", children }) => {
  return <div className={`p-6 pt-4 flex justify-end space-x-2 ${className}`}>{children}</div>
}
