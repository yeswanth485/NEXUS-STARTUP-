'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { getSocket } from '@/lib/socket'

export const useChat = (conversationId?: string) => {
  const [messages, setMessages] = useState<any[]>([])
  const [isTyping, setIsTyping] = useState<string[]>([])
  const typingTimeout = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if (!conversationId) return
    const socket = getSocket()
    socket.emit('join_room', { conversationId })

    const onNewMessage = (msg: any) => {
      setMessages((prev) => [...prev, msg])
    }
    const onUserTyping = ({ userId, isTyping: typing }: any) => {
      setIsTyping((prev) => typing ? [...prev.filter(id => id !== userId), userId] : prev.filter(id => id !== userId))
    }

    socket.on('new_message', onNewMessage)
    socket.on('user_typing', onUserTyping)

    return () => {
      socket.off('new_message', onNewMessage)
      socket.off('user_typing', onUserTyping)
      socket.emit('leave_room', { conversationId })
    }
  }, [conversationId])

  const sendMessage = useCallback((content: string) => {
    if (!conversationId) return
    getSocket().emit('send_message', { conversationId, content })
  }, [conversationId])

  const sendTyping = useCallback((isTyping: boolean) => {
    if (!conversationId) return
    getSocket().emit('typing', { conversationId, isTyping })
    if (typingTimeout.current) clearTimeout(typingTimeout.current)
    if (isTyping) typingTimeout.current = setTimeout(() => getSocket().emit('typing', { conversationId, isTyping: false }), 2000)
  }, [conversationId])

  return { messages, setMessages, isTyping, sendMessage, sendTyping }
}
