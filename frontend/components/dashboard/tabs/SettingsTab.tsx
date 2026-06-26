'use client'
import { useState, useEffect } from 'react'
import { Save } from 'lucide-react'
import { useToast } from '@/components/ui/Toaster'
import api from '@/lib/api'

export function SettingsTab() {
  const { toast } = useToast()
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState<any>({
    email_new_message: true, email_new_proposal: true, email_payment: true, email_marketing: false,
    push_new_message: true, push_proposals: true,
    show_earnings: false, show_online_status: true, profile_visible: true,
    theme: 'dark',
  })

  useEffect(() => {
    api.get('/settings').then(({ data }) => setSettings(data || {})).catch(() => {})
  }, [])

  const save = async () => {
    setSaving(true)
    try {
      await api.patch('/settings', settings)
      toast('success', 'Settings saved!')
    } catch { toast('error', 'Failed to save') }
    setSaving(false)
  }

  const Toggle = ({ label, key }: { label: string; key: string }) => (
    <label className="flex items-center justify-between py-3">
      <span className="text-sm" style={{ color: 'var(--text2)' }}>{label}</span>
      <button onClick={() => setSettings((prev: any) => ({ ...prev, [key]: !prev[key] }))}
        className="w-11 h-6 rounded-full transition-all relative"
        style={{ background: settings[key] ? 'var(--blue)' : 'var(--bg4)' }}>
        <div className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all" style={{ left: settings[key] ? 'calc(100% - 20px)' : '4px' }} />
      </button>
    </label>
  )

  return (
    <div className="max-w-2xl space-y-8">
      <h2 className="text-xl font-bold text-white">Settings</h2>

      <div className="p-6 rounded-2xl border" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
        <h3 className="text-sm font-semibold text-white mb-4">Notification Settings</h3>
        <div className="space-y-1 divide-y" style={{ borderColor: 'var(--border)' }}>
          <div className="pb-2"><p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text3)' }}>Email Notifications</p></div>
          <Toggle label="New messages" key="email_new_message" />
          <Toggle label="New proposals" key="email_new_proposal" />
          <Toggle label="Payment updates" key="email_payment" />
          <Toggle label="Marketing" key="email_marketing" />
          <div className="pt-4 pb-2"><p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text3)' }}>Push Notifications</p></div>
          <Toggle label="New messages" key="push_new_message" />
          <Toggle label="Proposals" key="push_proposals" />
        </div>
      </div>

      <div className="p-6 rounded-2xl border" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
        <h3 className="text-sm font-semibold text-white mb-4">Privacy Settings</h3>
        <div className="space-y-1">
          <Toggle label="Show earnings publicly" key="show_earnings" />
          <Toggle label="Show online status" key="show_online_status" />
          <Toggle label="Profile visible in search" key="profile_visible" />
        </div>
      </div>

      <button onClick={save} disabled={saving} className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50" style={{ background: 'var(--blue)' }}>
        <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Settings'}
      </button>
    </div>
  )
}
