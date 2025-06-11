import type React from "react"

interface AvatarProps {
  className?: string
  children: React.ReactNode
}

export const Avatar: React.FC<AvatarProps> = ({ className = "", children }) => {
  return <div className={`relative inline-block rounded-full overflow-hidden ${className}`}>{children}</div>
}

interface AvatarImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  className?: string
}

export const AvatarImage: React.FC<AvatarImageProps> = ({ className = "", ...props }) => {
  return <img className={`h-full w-full object-cover ${className}`} {...props} />
}

interface AvatarFallbackProps {
  className?: string
  children: React.ReactNode
}

export const AvatarFallback: React.FC<AvatarFallbackProps> = ({ className = "", children }) => {
  return (
    <div className={`flex h-full w-full items-center justify-center bg-blue-100 text-blue-800 ${className}`}>
      {children}
    </div>
  )
}
