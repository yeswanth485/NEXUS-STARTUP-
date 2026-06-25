'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { fetchAPI, cn, getInitials, formatDate } from '@/lib/utils';
import { connectSocket, getSocket } from '@/lib/socket';
import { Send, MessageCircle, ChevronLeft, User, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface Conversation {
  id: string;
  participant_ids: string[];
  last_message: string;
  last_message_at: string;
  unread_counts: Record<string, number>;
  other_user: { id: string; full_name: string; avatar_url: string; title: string; role: string };
  project_id?: string;
}

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  attachment_url: string;
  attachment_name: string;
  created_at: string;
}

function ChatContent() {
  const { user, profile } = useAuth();
  const searchParams = useSearchParams();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConv, setActiveConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;
    loadConversations();
    const socket = connectSocket(user.id);

    socket.on('message:new', (msg: Message) => {
      if (msg.conversation_id === activeConv?.id) {
        setMessages(prev => [...prev, msg]);
        scrollToBottom();
      }
      loadConversations();
    });

    return () => { socket.off('message:new'); };
  }, [user]);

  useEffect(() => {
    const userId = searchParams.get('user');
    if (userId && user) {
      startConversation(userId);
    }
  }, [searchParams, user]);

  useEffect(() => {
    if (activeConv) {
      getSocket().emit('conversation:join', activeConv.id);
      markAsRead(activeConv.id);
      loadMessages(activeConv.id);
      return () => {
        getSocket().emit('conversation:leave', activeConv.id);
      };
    }
  }, [activeConv?.id]);

  useEffect(() => { scrollToBottom(); }, [messages]);

  const scrollToBottom = () => {
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const loadConversations = async () => {
    try {
      const data = await fetchAPI('/api/messages/conversations');
      setConversations(data);
    } catch { /* ignore */ }
    setLoading(false);
  };

  const loadMessages = async (convId: string) => {
    try {
      const data = await fetchAPI(`/api/messages/conversations/${convId}`);
      setMessages(data.messages || []);
    } catch { setMessages([]); }
  };

  const markAsRead = async (convId: string) => {
    try { await fetchAPI(`/api/messages/conversations/${convId}/read`, { method: 'POST' }); } catch { /* ignore */ }
  };

  const startConversation = async (userId: string) => {
    try {
      const data = await fetchAPI('/api/messages/conversations', {
        method: 'POST',
        body: JSON.stringify({ participant_id: userId })
      });
      setActiveConv(data);
      setSidebarOpen(false);
      loadConversations();
    } catch { /* ignore */ }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !activeConv || !user) return;
    const content = newMessage.trim();
    setNewMessage('');

    getSocket().emit('message:send', {
      conversation_id: activeConv.id,
      sender_id: user.id,
      content,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50">
        <div className="text-center">
          <MessageCircle className="w-16 h-16 text-surface-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-surface-700 mb-2">Sign in to chat</h2>
          <Link href="/login" className="btn-primary">Sign In</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] bg-surface-50 flex">
      <div className={cn('w-full md:w-80 lg:w-96 border-r border-surface-200 bg-white flex-shrink-0', !sidebarOpen && 'hidden md:flex md:flex-col')}>
        <div className="p-4 border-b border-surface-200">
          <h2 className="font-semibold text-surface-900 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-nexus-600" /> Messages
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 animate-pulse">
                  <div className="w-10 h-10 rounded-full bg-surface-200" />
                  <div className="flex-1"><div className="h-4 bg-surface-200 rounded w-3/4 mb-1" /><div className="h-3 bg-surface-200 rounded w-1/2" /></div>
                </div>
              ))}
            </div>
          ) : conversations.length === 0 ? (
            <div className="p-8 text-center text-surface-400 text-sm">
              <MessageCircle className="w-10 h-10 mx-auto mb-2 opacity-50" />
              No conversations yet
            </div>
          ) : (
            conversations.map(conv => (
              <button
                key={conv.id}
                onClick={() => { setActiveConv(conv); setSidebarOpen(false); markAsRead(conv.id); }}
                className={cn('w-full p-4 flex items-start gap-3 text-left hover:bg-surface-50 transition-all border-b border-surface-100', activeConv?.id === conv.id && 'bg-nexus-50')}
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-nexus-400 to-purple-500 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                  {getInitials(conv.other_user?.full_name || 'U')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-surface-900 truncate">{conv.other_user?.full_name || 'Unknown'}</p>
                    <span className="text-[11px] text-surface-400">{conv.last_message_at ? formatDate(conv.last_message_at) : ''}</span>
                  </div>
                  <p className="text-xs text-surface-500 truncate mt-0.5">{conv.last_message || 'No messages yet'}</p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      <div className={cn('flex-1 flex flex-col', !sidebarOpen ? 'flex' : 'hidden md:flex')}>
        {activeConv ? (
          <>
            <div className="p-4 border-b border-surface-200 bg-white flex items-center gap-3">
              <button onClick={() => setSidebarOpen(true)} className="md:hidden p-1.5 rounded-lg hover:bg-surface-100">
                <ChevronLeft className="w-5 h-5 text-surface-500" />
              </button>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-nexus-400 to-purple-500 flex items-center justify-center text-white text-sm font-semibold">
                {getInitials(activeConv.other_user?.full_name || 'U')}
              </div>
              <div>
                <p className="text-sm font-semibold text-surface-900">{activeConv.other_user?.full_name || 'Unknown'}</p>
                <p className="text-xs text-surface-400 capitalize">{activeConv.other_user?.role || ''}</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map(msg => (
                <div key={msg.id} className={cn('flex', msg.sender_id === user.id ? 'justify-end' : 'justify-start')}>
                  <div className={cn('max-w-[75%] px-4 py-2.5 rounded-2xl', msg.sender_id === user.id ? 'bg-nexus-600 text-white rounded-br-md' : 'bg-white border border-surface-200 text-surface-900 rounded-bl-md')}>
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                    <p className={cn('text-[10px] mt-1', msg.sender_id === user.id ? 'text-nexus-200' : 'text-surface-400')}>
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-surface-200 bg-white">
              <div className="flex items-end gap-2">
                <textarea
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message..."
                  rows={1}
                  className="flex-1 input-field resize-none py-3 px-4"
                />
                <button onClick={sendMessage} disabled={!newMessage.trim()} className="btn-primary px-4 py-3">
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-surface-400">
            <div className="text-center">
              <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg">Select a conversation</p>
              <p className="text-sm">or start a new one from a profile</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-surface-400">Loading...</div>}>
      <ChatContent />
    </Suspense>
  );
}
