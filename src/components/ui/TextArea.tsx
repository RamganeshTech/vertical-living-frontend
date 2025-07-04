import type React from "react"

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string
}

export const Textarea: React.FC<TextareaProps> = ({ className = "", error, ...props }) => {
  const baseStyles = "w-full px-3 py-2 border rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none"
  const errorStyles = error
    ? "border-red-300 focus:border-red-500 focus:ring focus:ring-red-200"
    : "border-blue-200 focus:border-blue-500 focus:ring focus:ring-blue-200"

  const computedClassName = `${baseStyles} ${errorStyles} ${className}`.trim()

  return (
    <div className="w-full">
      <textarea className={computedClassName} {...props} />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  )
}
