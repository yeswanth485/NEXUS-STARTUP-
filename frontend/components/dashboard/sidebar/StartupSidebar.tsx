'use client'
import { useUIStore } from '@/store/uiStore'
import { BarChart3, Building2, Users, Search, Send, Briefcase, DollarSign, MessageCircle, Bell, Settings } from 'lucide-react'

const tabs = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'company', label: 'Company Profile', icon: Building2 },
  { id: 'team', label: 'My Team', icon: Users },
  { id: 'browse', label: 'Browse Projects', icon: Search },
  { id: 'proposals', label: 'My Proposals', icon: Send },
  { id: 'contracts', label: 'Active Contracts', icon: Briefcase },
  { id: 'earnings', label: 'Earnings', icon: DollarSign },
  { id: 'messages', label: 'Messages', icon: MessageCircle },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export function StartupSidebar() {
  const { activeTab, setActiveTab } = useUIStore()
  return (
    <div className="space-y-1">
      {tabs.map(t => (
        <button key={t.id} onClick={() => setActiveTab(t.id)}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
          style={activeTab === t.id ? { background: 'rgba(37,99,235,0.15)', color: 'var(--blue)' } : { color: 'var(--text2)' }}>
          <t.icon className="w-4 h-4" />
          {t.label}
        </button>
      ))}
    </div>
  )
}
