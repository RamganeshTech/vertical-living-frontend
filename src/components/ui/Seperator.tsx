import type React from "react"

interface SeparatorProps {
  orientation?: "horizontal" | "vertical"
  className?: string
}

export const Separator: React.FC<SeparatorProps> = ({ orientation = "horizontal", className = "" }) => {
  const baseStyles = "bg-gray-200"
  const orientationStyles = orientation === "horizontal" ? "w-full h-px" : "h-full w-px"

  const computedClassName = `${baseStyles} ${orientationStyles} ${className}`.trim()

  return <div className={computedClassName} />
}
