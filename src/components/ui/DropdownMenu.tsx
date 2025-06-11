"use client"

import React from "react"

import type { ReactNode } from "react"
import { useState, useRef, useEffect } from "react"

interface DropdownMenuProps {
  children: ReactNode
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          if (child.type === DropdownMenuTrigger) {
            return React.cloneElement(child as React.ReactElement<any>, {
              onClick: () => setIsOpen(!isOpen),
            })
          }
          if (child.type === DropdownMenuContent) {
            return React.cloneElement(child as React.ReactElement<any>, {
              isOpen,
              onClose: () => setIsOpen(false),
            })
          }
        }
        return child
      })}
    </div>
  )
}

interface DropdownMenuTriggerProps {
  asChild?: boolean
  children: ReactNode
  onClick?: () => void
}

export const DropdownMenuTrigger: React.FC<DropdownMenuTriggerProps> = ({ asChild = false, children, onClick }) => {
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
    //   onClick: (e: React.MouseEvent) => {
    //     e.stopPropagation()
    //     onClick?.()
    //     if (children.props.onClick) {
    //       children.props.onClick(e)
    //     }
    //   },
onClick: (e: React.MouseEvent) => {
  e.stopPropagation();
  onClick?.();

  if (React.isValidElement(children)) {
    const childOnClick = (children.props as any)?.onClick;
    if (typeof childOnClick === "function") {
      childOnClick(e);
    }
  }
}


    })
  }

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        onClick?.()
      }}
      className="inline-flex items-center justify-center"
    >
      {children}
    </button>
  )
}

interface DropdownMenuContentProps {
  align?: "start" | "end"
  className?: string
  children: ReactNode
  isOpen?: boolean
  onClose?: () => void
}

export const DropdownMenuContent: React.FC<DropdownMenuContentProps> = ({
  align = "start",
  className = "",
  children,
  isOpen = false,
  onClose,
}) => {
  if (!isOpen) return null

  const alignmentClass = align === "end" ? "right-0" : "left-0"

  return (
    <div
      className={`absolute ${alignmentClass} mt-2 w-48 rounded-xl bg-white shadow-lg border border-gray-200 py-1 z-50 ${className}`}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === DropdownMenuItem) {
          return React.cloneElement(child as React.ReactElement<any>, {
            onClose,
          })
        }
        return child
      })}
    </div>
  )
}

interface DropdownMenuItemProps {
  className?: string
  children: ReactNode
  onClick?: () => void
  onClose?: () => void
}

export const DropdownMenuItem: React.FC<DropdownMenuItemProps> = ({ className = "", children, onClick, onClose }) => {
  const handleClick = () => {
    onClick?.()
    onClose?.()
  }

  return (
    <button
      type="button"
      className={`w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center ${className}`}
      onClick={handleClick}
    >
      {children}
    </button>
  )
}
