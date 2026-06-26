'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { DollarSign, Briefcase, Send, Star, TrendingUp, Users, FileText, CheckCircle } from 'lucide-react'
import { useAuth } from '@/providers/AuthProvider'
import { MetricCard } from '../MetricCard'
import { EarningsChart } from '../EarningsChart'
import { ActivityFeed } from '../ActivityFeed'
import api from '@/lib/api'

export function OverviewTab() {
  const { profile } = useAuth()
  const role = profile?.role || 'freelancer'
  const [activities, setActivities] = useState<any[]>([])
  const [stats, setStats] = useState<any>({})

  useEffect(() => {
    api.get('/notifications').then(({ data }) => setActivities(data || [])).catch(() => {})
  }, [])

  const clientMetrics = [
    { label: 'Total Spent', value: '$24,500', icon: DollarSign, color: '#10B981' },
    { label: 'Active Projects', value: '3', icon: Briefcase, color: '#2563EB' },
    { label: 'Pending Proposals', value: '12', icon: FileText, color: '#F59E0B' },
    { label: 'Avg Rating Given', value: 4.8, icon: Star, color: '#8B5CF6' },
    { label: 'Response Rate', value: 95, icon: TrendingUp, color: '#06B6D4' },
  ]

  const freelancerMetrics = [
    { label: 'Total Earnings', value: '$48,200', icon: DollarSign, color: '#10B981' },
    { label: 'Active Contracts', value: '4', icon: Briefcase, color: '#2563EB' },
    { label: 'Proposals Sent', value: '18', icon: Send, color: '#F59E0B' },
    { label: 'Avg Rating', value: 4.9, icon: Star, color: '#8B5CF6' },
    { label: 'Job Success', value: 100, icon: CheckCircle, color: '#06B6D4' },
  ]

  const startupMetrics = [
    { label: 'Total Revenue', value: '$96,500', icon: DollarSign, color: '#10B981' },
    { label: 'Active Clients', value: '6', icon: Users, color: '#2563EB' },
    { label: 'Proposals Sent', value: '24', icon: Send, color: '#F59E0B' },
    { label: 'Avg Rating', value: 4.7, icon: Star, color: '#8B5CF6' },
    { label: 'Team Utilization', value: 88, icon: TrendingUp, color: '#06B6D4' },
  ]

  const metrics = role === 'client' ? clientMetrics : role === 'startup' ? startupMetrics : freelancerMetrics

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Good morning, {profile?.full_name?.split(' ')[0] || 'there'}</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text2)' }}>Here is your overview for today.</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {metrics.map((m, i) => <MetricCard key={m.label} {...m} />)}
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <EarningsChart />
        <ActivityFeed activities={activities} />
      </div>
    </div>
  )
}
