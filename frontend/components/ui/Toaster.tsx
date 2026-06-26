'use client'
import { useState, useEffect, createContext, useContext, useCallback } from 'react'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Toast { id: string; type: 'success' | 'error' | 'info' | 'warning'; title: string; message?: string }

const ToastCtx = createContext<any>(null)
export const useToast = () => {
  const ctx = useContext(ToastCtx)
  return ctx || { toast: () => {} }
}

let toastId = 0
export function Toaster({ children }: { children?: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((type: Toast['type'], title: string, message?: string) => {
    const id = String(++toastId)
    setToasts((prev) => [...prev, { id, type, title, message }])
    setTimeout(() => setToasts((prev) => prev.filter(t => t.id !== id)), 4000)
  }, [])

  const removeToast = (id: string) => setToasts((prev) => prev.filter(t => t.id !== id))

  const icons = { success: CheckCircle, error: AlertCircle, info: Info, warning: AlertTriangle }
  const colors = { success: 'border-emerald-500 bg-emerald-500/10', error: 'border-red-500 bg-red-500/10', info: 'border-blue-500 bg-blue-500/10', warning: 'border-amber-500 bg-amber-500/10' }

  return (
    <ToastCtx.Provider value={{ toast: addToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map((toast) => {
            const Icon = icons[toast.type]
            return (
              <motion.div key={toast.id} initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, x: 100 }} className={`flex items-start gap-3 px-4 py-3 rounded-xl border ${colors[toast.type]} backdrop-blur-xl min-w-[300px] max-w-[400px] shadow-lg`}>
                <Icon className="w-5 h-5 mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white">{toast.title}</p>
                  {toast.message && <p className="text-xs text-white/70 mt-0.5">{toast.message}</p>}
                </div>
                <button onClick={() => removeToast(toast.id)} className="shrink-0 text-white/50 hover:text-white"><X className="w-4 h-4" /></button>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </ToastCtx.Provider>
  )
}
