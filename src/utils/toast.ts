// Simple toast implementation
let toastTimeout: number | null = null

interface ToastOptions {
  title?: string
  description: string
  variant?: "default" | "destructive"
  duration?: number
}

export function toast(options: ToastOptions) {
  const { title, description, variant = "default", duration = 3000 } = options

  // Remove existing toast if present
  const existingToast = document.getElementById("toast-container")
  if (existingToast) {
    document.body.removeChild(existingToast)
    if (toastTimeout) {
      window.clearTimeout(toastTimeout)
    }
  }

  // Create toast container
  const toastContainer = document.createElement("div")
  toastContainer.id = "toast-container"
  toastContainer.className = "fixed bottom-4 right-4 z-50 max-w-xs"

  // Create toast element
  const toastElement = document.createElement("div")
  toastElement.className = `p-4 rounded-lg shadow-lg border ${
    variant === "destructive" ? "bg-red-50 border-red-200" : "bg-white border-blue-100"
  }`

  // Create toast content
  let toastContent = ""
  if (title) {
    toastContent += `<h4 class="${
      variant === "destructive" ? "text-red-800" : "text-blue-800"
    } font-medium">${title}</h4>`
  }
  toastContent += `<p class="${
    variant === "destructive" ? "text-red-600" : "text-gray-600"
  } text-sm">${description}</p>`

  toastElement.innerHTML = toastContent
  toastContainer.appendChild(toastElement)
  document.body.appendChild(toastContainer)

  // Auto-dismiss
  toastTimeout = window.setTimeout(() => {
    if (document.body.contains(toastContainer)) {
      document.body.removeChild(toastContainer)
    }
  }, duration)
}
