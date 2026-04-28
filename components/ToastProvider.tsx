'use client'

import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react'
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react'

type ToastType = 'success' | 'error' | 'info'
type Toast = { id: number; type: ToastType; title: string; message?: string }

type ToastContextValue = {
  toast: (input: Omit<Toast, 'id'> & { duration?: number }) => void
  success: (title: string, message?: string) => void
  error: (title: string, message?: string) => void
  info: (title: string, message?: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const styles: Record<ToastType, { box: string; icon: ReactNode }> = {
  success: {
    box: 'border-green-500/30 bg-green-500/10 text-green-100',
    icon: <CheckCircle className="h-5 w-5 text-green-400" />,
  },
  error: {
    box: 'border-red-500/30 bg-red-500/10 text-red-100',
    icon: <AlertCircle className="h-5 w-5 text-red-400" />,
  },
  info: {
    box: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-100',
    icon: <Info className="h-5 w-5 text-cyan-400" />,
  },
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const remove = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const toast = useCallback(({ duration = 4500, ...input }: Omit<Toast, 'id'> & { duration?: number }) => {
    const id = Date.now() + Math.random()
    setToasts(prev => [...prev.slice(-3), { ...input, id }])
    window.setTimeout(() => remove(id), duration)
  }, [remove])

  const value = useMemo<ToastContextValue>(() => ({
    toast,
    success: (title, message) => toast({ type: 'success', title, message }),
    error: (title, message) => toast({ type: 'error', title, message }),
    info: (title, message) => toast({ type: 'info', title, message }),
  }), [toast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-24 z-[70] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3 sm:right-6">
        {toasts.map(item => (
          <div
            key={item.id}
            className={`rounded-lg border p-4 shadow-2xl shadow-black/30 backdrop-blur transition-all ${styles[item.type].box}`}
            role="status"
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 shrink-0">{styles[item.type].icon}</div>
              <div className="min-w-0 flex-1">
                <div className="font-orbitron text-sm font-semibold text-white">{item.title}</div>
                {item.message && <div className="mt-1 text-sm text-slate-200/90">{item.message}</div>}
              </div>
              <button
                type="button"
                onClick={() => remove(item.id)}
                className="shrink-0 rounded p-1 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Dismiss notification"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used inside ToastProvider')
  return context
}
