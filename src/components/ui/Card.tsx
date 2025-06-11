import type React from "react"

interface CardProps {
  className?: string
  children: React.ReactNode
}

export const Card: React.FC<CardProps> = ({ className = "", children }) => {
  return <div className={`bg-white/70 backdrop-blur-sm border-0 rounded-2xl shadow-lg ${className}`}>{children}</div>
}

export const CardHeader: React.FC<CardProps> = ({ className = "", children }) => {
  return <div className={`p-6 pb-3 ${className}`}>{children}</div>
}

export const CardContent: React.FC<CardProps> = ({ className = "", children }) => {
  return <div className={`p-6 pt-3 ${className}`}>{children}</div>
}

export const CardTitle: React.FC<CardProps> = ({ className = "", children }) => {
  return <h3 className={`text-xl font-semibold text-blue-900 ${className}`}>{children}</h3>
}

export const CardDescription: React.FC<CardProps> = ({ className = "", children }) => {
  return <p className={`text-sm text-gray-500 ${className}`}>{children}</p>
}
