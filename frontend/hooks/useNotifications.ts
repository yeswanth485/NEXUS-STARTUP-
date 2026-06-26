'use client'
import { useState, useEffect } from 'react'
import { getSocket } from '@/lib/socket'
import api from '@/lib/api'

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get('/notifications')
      setNotifications(data || [])
      setUnreadCount((data || []).filter((n: any) => !n.read).length)
    } catch {}
  }

  useEffect(() => {
    fetchNotifications()
    const socket = getSocket()
    socket.on('notification', () => fetchNotifications())
    return () => { socket.off('notification') }
  }, [])

  const markRead = async (id: string) => {
    await api.patch(`/notifications/${id}/read`)
    fetchNotifications()
  }

  const markAllRead = async () => {
    await api.patch('/notifications/read-all')
    fetchNotifications()
  }

  return { notifications, unreadCount, markRead, markAllRead, fetchNotifications }
}
