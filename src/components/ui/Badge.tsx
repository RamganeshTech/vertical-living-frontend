import type React from "react"

interface BadgeProps {
  variant?: "default" | "secondary" | "outline"
  className?: string
  children: React.ReactNode
}

export const Badge: React.FC<BadgeProps> = ({ variant = "default", className = "", children }) => {
  const baseStyles = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"

  const variantStyles = {
    default: "bg-blue-100 text-blue-800",
    secondary: "bg-gray-100 text-gray-800",
    outline: "border border-blue-200 text-blue-700",
  }

  const computedClassName = `${baseStyles} ${variantStyles[variant]} ${className}`.trim()

  return <span className={computedClassName}>{children}</span>
}
