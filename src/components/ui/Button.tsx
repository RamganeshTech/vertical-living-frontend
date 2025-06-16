import type React from "react"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost" | "link"
  size?: "sm" | "md" | "lg" | "icon"
  children: React.ReactNode
  isLoading?: boolean
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  children,
  isLoading = true,
  className = "",
  disabled,
  ...props
}) => {
  const baseStyles = "inline-flex cursor-pointer items-center justify-center font-medium transition-colors focus:outline-none"

  const variantStyles = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-sm",
    secondary: "bg-blue-100 hover:bg-blue-200 text-blue-700",
    outline: "border border-blue-200 hover:bg-blue-50 text-blue-600",
    danger: "border border-red-200 hover:bg-red-50 text-red-600",
    ghost: "hover:bg-gray-100 text-gray-700",
    link: "text-blue-600 hover:underline p-0 h-auto",
  }

  const sizeStyles = {
    sm: "text-xs px-2.5 py-1.5 rounded-lg",
    md: "text-sm px-4 py-2 rounded-xl",
    lg: "text-base px-6 py-3 rounded-xl",
    icon: "p-2 rounded-lg",
  }

  const disabledStyles = "opacity-50 cursor-not-allowed"
  const loadingStyles = "opacity-80 cursor-wait"

  const computedClassName = `
    ${baseStyles} 
    ${variantStyles[variant]} 
    ${sizeStyles[size]} 
    ${disabled ? disabledStyles : ""} 
    ${isLoading ? loadingStyles : ""}
    ${className}
  `.trim()

  return (
    <button className={computedClassName} disabled={disabled || isLoading} {...props}>
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {children}
    </button>
  )
}
