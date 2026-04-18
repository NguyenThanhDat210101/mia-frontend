import { reactive, readonly } from 'vue'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface Toast {
  id: number
  message: string
  type: ToastType
}

let toastId = 0

const toasts = reactive<Toast[]>([])

export function useToast() {
  function show(message: string, type: ToastType = 'info') {
    const id = ++toastId
    toasts.push({ id, message, type })
    
    setTimeout(() => {
      const index = toasts.findIndex(t => t.id === id)
      if (index !== -1) {
        toasts.splice(index, 1)
      }
    }, 3000)
  }

  function success(message: string) {
    show(message, 'success')
  }

  function error(message: string) {
    show(message, 'error')
    setTimeout(() => {
      const index = toasts.findIndex(t => t.message === message)
      if (index !== -1) {
        toasts.splice(index, 1)
      }
    }, 4000)
  }

  function warning(message: string) {
    show(message, 'warning')
  }

  function info(message: string) {
    show(message, 'info')
  }

  return {
    toasts: readonly(toasts),
    show,
    success,
    error,
    warning,
    info,
  }
}