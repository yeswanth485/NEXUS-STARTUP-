'use client'
import { useEffect, useCallback } from 'react'
import { getSocket } from '@/lib/socket'

export const useSocket = (event?: string, handler?: (...args: any[]) => void) => {
  useEffect(() => {
    if (!event || !handler) return
    const socket = getSocket()
    socket.on(event, handler)
    return () => { socket.off(event, handler) }
  }, [event, handler])

  const emit = useCallback((event: string, ...args: any[]) => {
    const socket = getSocket()
    if (socket?.connected) socket.emit(event, ...args)
  }, [])

  return { emit }
}
