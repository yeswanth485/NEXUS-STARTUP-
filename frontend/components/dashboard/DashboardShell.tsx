'use client'
import { motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { ClientSidebar } from './sidebar/ClientSidebar'
import { FreelancerSidebar } from './sidebar/FreelancerSidebar'
import { StartupSidebar } from './sidebar/StartupSidebar'
import { MobileBottomNav } from './MobileBottomNav'
import { useAuth } from '@/providers/AuthProvider'
import { useUIStore } from '@/store/uiStore'
import { useNotifications } from '@/hooks/useNotifications'
import { OverviewTab } from './tabs/OverviewTab'
import { MyProfileTab } from './tabs/MyProfileTab'
import { CompanyProfileTab } from './tabs/CompanyProfileTab'
import { TeamTab } from './tabs/TeamTab'
import { ProjectsTab } from './tabs/ProjectsTab'
import { BrowseJobsTab } from './tabs/BrowseJobsTab'
import { ProposalsTab } from './tabs/ProposalsTab'
import { ContractsTab } from './tabs/ContractsTab'
import { KanbanTab } from './tabs/KanbanTab'
import { EarningsTab } from './tabs/EarningsTab'
import { MessagesTab } from './tabs/MessagesTab'
import { NotificationsTab } from './tabs/NotificationsTab'
import { SettingsTab } from './tabs/SettingsTab'
import { CalendarTab } from './tabs/CalendarTab'

const sidebars: Record<string, any> = {
  client: ClientSidebar,
  freelancer: FreelancerSidebar,
  startup: StartupSidebar,
}

export function DashboardShell() {
  const { profile } = useAuth()
  const { activeTab, sidebarOpen, toggleSidebar } = useUIStore()
  const { unreadCount } = useNotifications()
  const role = profile?.role || 'freelancer'
  const Sidebar = sidebars[role] || FreelancerSidebar

  const tabs: Record<string, any> = {
    overview: OverviewTab,
    profile: MyProfileTab,
    company: CompanyProfileTab,
    team: TeamTab,
    projects: ProjectsTab,
    browse: BrowseJobsTab,
    proposals: ProposalsTab,
    contracts: ContractsTab,
    kanban: KanbanTab,
    earnings: EarningsTab,
    messages: MessagesTab,
    notifications: NotificationsTab,
    settings: SettingsTab,
    calendar: CalendarTab,
  }
  const ActiveTab = tabs[activeTab] || OverviewTab

  return (
    <div className="min-h-screen flex pb-16 lg:pb-0" style={{ background: 'var(--bg)' }}>
      <aside className={`fixed lg:sticky top-16 lg:top-16 z-40 h-[calc(100vh-64px)] transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-0 lg:w-16'} overflow-hidden hidden lg:block`}
        style={{ background: 'var(--bg2)', borderRight: '1px solid var(--border)' }}>
        <div className="p-4 w-64">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--text3)' }}>
              {sidebarOpen ? (role === 'client' ? 'Client' : role === 'startup' ? 'Startup' : 'Freelancer') : ''}
            </h2>
            <button onClick={toggleSidebar} className="p-1.5 rounded-lg hover:bg-white/5">
              {sidebarOpen ? <X className="w-4 h-4" style={{ color: 'var(--text3)' }} /> : <Menu className="w-4 h-4" style={{ color: 'var(--text3)' }} />}
            </button>
          </div>
          <Sidebar />
        </div>
      </aside>
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
          <ActiveTab />
        </motion.div>
      </main>
      <MobileBottomNav />
    </div>
  )
}
