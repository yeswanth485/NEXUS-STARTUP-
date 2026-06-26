'use client'
import { useAuth } from '@/providers/AuthProvider'
import { ReactNode } from 'react'

interface RoleGateProps {
  allowedRoles: ('client' | 'freelancer' | 'startup')[]
  fallback?: ReactNode
  children: ReactNode
}

export function RoleGate({ allowedRoles, fallback = null, children }: RoleGateProps) {
  const { profile, loading } = useAuth()

  if (loading) return null
  if (!profile) return <>{fallback}</>
  if (!allowedRoles.includes(profile.role as any)) return <>{fallback}</>

  return <>{children}</>
}
