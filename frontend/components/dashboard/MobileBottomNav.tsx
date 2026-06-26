'use client'
import { useUIStore } from '@/store/uiStore'
import { useAuth } from '@/providers/AuthProvider'
import { useNotifications } from '@/hooks/useNotifications'
import { BarChart3, Briefcase, FileText, User, Search, Send, MessageCircle, Bell, Building2, Users } from 'lucide-react'

const clientTabs = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'projects', label: 'Projects', icon: Briefcase },
  { id: 'proposals', label: 'Proposals', icon: FileText },
  { id: 'messages', label: 'Messages', icon: MessageCircle },
  { id: 'notifications', label: 'Alerts', icon: Bell },
]

const freelancerTabs = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'browse', label: 'Browse', icon: Search },
  { id: 'proposals', label: 'Proposals', icon: Send },
  { id: 'messages', label: 'Messages', icon: MessageCircle },
]

const startupTabs = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'company', label: 'Company', icon: Building2 },
  { id: 'team', label: 'Team', icon: Users },
  { id: 'browse', label: 'Browse', icon: Search },
  { id: 'messages', label: 'Messages', icon: MessageCircle },
]

const tabMap: Record<string, typeof freelancerTabs> = {
  client: clientTabs,
  freelancer: freelancerTabs,
  startup: startupTabs,
}

export function MobileBottomNav() {
  const { profile } = useAuth()
  const { activeTab, setActiveTab } = useUIStore()
  const { unreadCount } = useNotifications()
  const role = profile?.role || 'freelancer'
  const tabs = tabMap[role] || freelancerTabs

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden border-t" style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
      <div className="flex items-center justify-around h-16 px-2">
        {tabs.map(t => {
          const Icon = t.icon
          const isActive = activeTab === t.id
          const showBadge = t.id === 'notifications' && unreadCount > 0

          return (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className="flex flex-col items-center justify-center gap-0.5 min-w-0 px-3 py-1.5 rounded-xl transition-all relative"
              style={isActive ? { color: 'var(--blue)' } : { color: 'var(--text3)' }}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium truncate max-w-full">{t.label}</span>
              {showBadge && (
                <span className="absolute top-0.5 right-2 w-2 h-2 rounded-full bg-red-500" />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
