'use client'
import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { DollarSign, Briefcase, Send, Star, TrendingUp, Users, FileText, CheckCircle, Clock } from 'lucide-react'
import { useAuth } from '@/providers/AuthProvider'
import { MetricCard } from '../MetricCard'
import { EarningsChart } from '../EarningsChart'
import { ActivityFeed } from '../ActivityFeed'
import api from '@/lib/api'

export function OverviewTab() {
  const { profile } = useAuth()
  const role = profile?.role || 'freelancer'
  const [activities, setActivities] = useState<any[]>([])
  const [stats, setStats] = useState<any>({ loading: true, projects: 0, proposals: 0, contracts: 0, earnings: 0, rating: 0, success: 0 })

  const fetchStats = useCallback(async () => {
    setStats((prev: any) => ({ ...prev, loading: true }))
    try {
      const [projectsRes, proposalsRes, contractsRes, notifsRes] = await Promise.allSettled([
        api.get('/projects/mine/list'),
        api.get('/proposals/mine'),
        api.get('/contracts'),
        api.get('/notifications'),
      ])

      const projects = projectsRes.status === 'fulfilled' ? (projectsRes.value.data || []) : []
      const proposals = proposalsRes.status === 'fulfilled' ? (proposalsRes.value.data || []) : []
      const contracts = contractsRes.status === 'fulfilled' ? (contractsRes.value.data || []) : []

      if (notifsRes.status === 'fulfilled') setActivities(notifsRes.value.data || [])

      setStats({
        loading: false,
        projects: projects.length,
        proposals: proposals.length,
        contracts: contracts.length,
        earnings: contracts.reduce((sum: number, c: any) => sum + (c.paid_amount || 0), 0),
        rating: profile?.rating || 0,
        success: profile?.job_success_rate || 100,
        activeProjects: projects.filter((p: any) => p.status === 'open' || p.status === 'in_progress').length,
        activeContracts: contracts.filter((c: any) => c.status === 'active').length,
      })
    } catch { setStats((prev: any) => ({ ...prev, loading: false })) }
  }, [profile])

  useEffect(() => { fetchStats() }, [fetchStats])

  const clientMetrics = [
    { label: 'Total Spent', value: `$${stats.earnings?.toLocaleString() || '0'}`, icon: DollarSign, color: '#10B981' },
    { label: 'Active Projects', value: String(stats.activeProjects || 0), icon: Briefcase, color: '#2563EB' },
    { label: 'Proposals Received', value: String(stats.proposals || 0), icon: FileText, color: '#F59E0B' },
    { label: 'Active Contracts', value: String(stats.activeContracts || 0), icon: CheckCircle, color: '#8B5CF6' },
    { label: 'Avg Rating Given', value: stats.rating || 'N/A', icon: Star, color: '#06B6D4' },
  ]

  const freelancerMetrics = [
    { label: 'Total Earnings', value: `$${stats.earnings?.toLocaleString() || '0'}`, icon: DollarSign, color: '#10B981' },
    { label: 'Active Contracts', value: String(stats.activeContracts || 0), icon: Briefcase, color: '#2563EB' },
    { label: 'Proposals Sent', value: String(stats.proposals || 0), icon: Send, color: '#F59E0B' },
    { label: 'Avg Rating', value: stats.rating || 'N/A', icon: Star, color: '#8B5CF6' },
    { label: 'Job Success', value: `${stats.success}%`, icon: CheckCircle, color: '#06B6D4' },
  ]

  const startupMetrics = [
    { label: 'Total Revenue', value: `$${stats.earnings?.toLocaleString() || '0'}`, icon: DollarSign, color: '#10B981' },
    { label: 'Active Clients', value: String(stats.activeContracts || 0), icon: Users, color: '#2563EB' },
    { label: 'Proposals Sent', value: String(stats.proposals || 0), icon: Send, color: '#F59E0B' },
    { label: 'Avg Rating', value: stats.rating || 'N/A', icon: Star, color: '#8B5CF6' },
    { label: 'Active Projects', value: String(stats.activeProjects || 0), icon: TrendingUp, color: '#06B6D4' },
  ]

  const metrics = role === 'client' ? clientMetrics : role === 'startup' ? startupMetrics : freelancerMetrics

  const getGreeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 18) return 'Good afternoon'
    return 'Good evening'
  }

  if (stats.loading) {
    return (
      <div className="space-y-6">
        <div><div className="h-8 w-64 rounded-lg bg-white/10 animate-pulse" /><div className="h-4 w-48 rounded bg-white/5 mt-2 animate-pulse" /></div>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">{[1,2,3,4,5].map(i => <div key={i} className="h-24 rounded-2xl bg-white/5 animate-pulse" style={{ background: 'var(--card)' }} />)}</div>
        <div className="grid lg:grid-cols-2 gap-6">{['h-64','h-48'].map((h, i) => <div key={i} className={`${h} rounded-2xl bg-white/5 animate-pulse`} style={{ background: 'var(--card)' }} />)}</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">{getGreeting()}, {profile?.full_name?.split(' ')[0] || 'there'}</h1>
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
