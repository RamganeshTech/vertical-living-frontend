
import type React from "react"
import { Link } from "react-router-dom"
import { Button } from "../../components/ui/Button"

export interface NotificationCardProps {
  notification: {
    _id: string
    message: string
    type: "info" | "warning" | "assignment"
    isRead: boolean
    navigation?: {
      url: string
      label?: string
    }
    createdAt: string
  }
  // onMarkAsRead: (id: string) => void
  onDelete: (id: string) => void
  frontendUrl: string,
  deleteMutation: any
}

const NotificationCard: React.FC<NotificationCardProps> = ({ deleteMutation, notification, onDelete, frontendUrl }) => {
  const getTypeConfig = (type: string) => {
    switch (type) {
      case "warning":
        return {
          icon: "fa-exclamation-triangle",
          bgColor: "bg-amber-50",
          borderColor: "border-l-amber-400",
          badgeBg: "bg-amber-100",
          badgeText: "text-amber-700",
        }
      case "assignment":
        return {
          icon: "fa-tasks",
          bgColor: "bg-blue-50",
          borderColor: "border-l-blue-400",
          badgeBg: "bg-blue-100",
          badgeText: "text-blue-700",
        }
      case "info":
      default:
        return {
          icon: "fa-info-circle",
          bgColor: "bg-slate-50",
          borderColor: "border-l-slate-400",
          badgeBg: "bg-slate-100",
          badgeText: "text-slate-700",
        }
    }
  }

  // const navigate = useNavigate()
  const config = getTypeConfig(notification.type)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    })
  }

  const getFullUrl = () => {
    if (!notification?.navigation?.url) return null
    const baseUrl = frontendUrl.endsWith("/") ? frontendUrl.slice(0, -1) : frontendUrl
    const path = notification.navigation.url.startsWith("/")
      ? notification.navigation.url
      : `/${notification.navigation.url}`
    return `${baseUrl}${path}`
  }

  const fullUrl = getFullUrl()

  return (
    <Link
      to={fullUrl || ""}
      // target="_blank"
      // rel="noopener noreferrer"
      // className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
      // onClick={() => onMarkAsRead(notification._id)}
      onClick={() => onDelete(notification._id)}
    >

      <div
        className={`${config.bgColor} cursor-pointer border-l-4 ${config.borderColor} rounded-lg p-4 mb-3 transition-all duration-200 hover:shadow-md ${!notification.isRead ? "ring-1 ring-blue-200" : ""
          }`}
      // onClick={(e) => {
      //   e.stopPropagation();
      //   onDelete(notification._id)
      // }}
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 pt-1">
            <i className={`fas ${config.icon} text-lg ${config.badgeText}`}></i>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900 leading-relaxed">{notification.message}</p>
                <p className="text-xs text-slate-500 mt-1">{formatDate(notification.createdAt)}</p>
              </div>

              {/* {!notification.isRead && (
              <span
                className={`${config.badgeBg} ${config.badgeText} text-xs font-semibold px-2 py-1 rounded-full flex-shrink-0`}
              >
                New
              </span>
            )} */}
            </div>

            {fullUrl && (
              <div className="mt-3 flex gap-2">
                <Link
                  to={fullUrl}
                  // target="_blank"
                  // rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
                  // onClick={() => onMarkAsRead(notification._id)}
                  onClick={() => onDelete(notification._id)}
                >
                  {notification.navigation?.label || "View Details"}
                  <i className="fas fa-arrow-right text-xs"></i>
                </Link>
              </div>
            )}
          </div>

          <div className="flex-shrink-0 flex gap-2">
            {/* {!notification.isRead && (
            <button
              onClick={() => onMarkAsRead(notification._id)}
              className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors rounded hover:bg-white"
              title="Mark as read"
            >
              <i className="fas fa-check text-sm"></i>
            </button>
          )} */}
            <Button
              variant="danger"
              isLoading={deleteMutation.isPending && deleteMutation.variables.notificationId === notification._id}
              onClick={(e) => {
                e.preventDefault();     // ✅ stop link navigation
                e.stopPropagation();
                onDelete(notification._id)
              }}
              className="!p-1 px-2  bg-red-600 !text-white hover:bg-red-600 transition-colors rounded"
              title="Delete notification"
              size="sm"
            >
              <i className="fas fa-xmark text-sm"></i>
            </Button>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default NotificationCard
