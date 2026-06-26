'use client'
import { createContext, useContext, useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { connectSocket, disconnectSocket, getSocket } from '@/lib/socket'

const SocketCtx = createContext<any>(null)
export const useSocket = () => useContext(SocketCtx)

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((s) => s.token)

  useEffect(() => {
    if (token) connectSocket(token)
    else disconnectSocket()
    return () => { disconnectSocket() }
  }, [token])

  return <SocketCtx.Provider value={{ socket: getSocket() }}>{children}</SocketCtx.Provider>
}
