

import React from "react"

import type { ReactNode } from "react"
import { useState, useRef, useEffect } from "react"

interface SelectProps {
  value?: string
  onValueChange?: (value: string) => void
  children: ReactNode
}

export const Select: React.FC<SelectProps> = ({ value, onValueChange, children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedValue, setSelectedValue] = useState(value || "")
  const selectRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleValueChange = (newValue: string) => {
    setSelectedValue(newValue)
    onValueChange?.(newValue)
    setIsOpen(false)
  }

  return (
    <div ref={selectRef} className="relative">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          if (child.type === SelectTrigger) {
            return React.cloneElement(child as React.ReactElement<any>, {
              isOpen,
              onClick: () => setIsOpen(!isOpen),
              selectedValue,
            })
          }
          if (child.type === SelectContent) {
            return React.cloneElement(child as React.ReactElement<any>, {
              isOpen,
              onValueChange: handleValueChange,
            })
          }
        }
        return child
      })}
    </div>
  )
}

interface SelectTriggerProps {
  className?: string
  children: ReactNode
  isOpen?: boolean
  onClick?: () => void
  selectedValue?: string
}

export const SelectTrigger: React.FC<SelectTriggerProps> = ({ className = "", children, isOpen = false, onClick }) => {
  return (
    <button
      type="button"
      className={`w-full px-3 py-2 border border-blue-200 rounded-xl bg-white text-left flex items-center justify-between focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 ${className}`}
      onClick={onClick}
    >
      {children}
      <svg
        className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  )
}

interface SelectValueProps {
  placeholder?: string
  selectedValue?: string
  className?: string
}

export const SelectValue: React.FC<SelectValueProps> = ({ placeholder = "Select...", selectedValue , className = "text-gray-900"}) => {
  return <span className={`${className}`}>{selectedValue || placeholder}</span>
}

interface SelectContentProps {
  className?: string
  children: ReactNode
  isOpen?: boolean
  onValueChange?: (value: string) => void
}

export const SelectContent: React.FC<SelectContentProps> = ({
  className = "",
  children,
  isOpen = false,
  onValueChange,
}) => {
  if (!isOpen) return null

  return (
    <div
      className={`absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 py-1 ${className}`}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === SelectItem) {
          return React.cloneElement(child as React.ReactElement<any>, {
            onSelect: onValueChange,
          })
        }
        return child
      })}
    </div>
  )
}

interface SelectItemProps {
  value: string
  children: ReactNode
  className?: string,
  onSelect?: (value: string) => void
}

export const SelectItem: React.FC<SelectItemProps> = ({ value, children, className= "text-gray-700 hover:bg-blue-50 hover:text-blue-700", onSelect }) => {
  return (
    <button
      type="button"
      className={`w-full cursor-pointer text-left px-3 py-2 text-sm ${className} `}
      onClick={() => onSelect?.(value)}
    >
      {children}
    </button>
  )
}
