import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthStore {
  user: any | null
  profile: any | null
  token: string | null
  setAuth: (user: any, profile: any, token: string) => void
  setProfile: (profile: any) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null, profile: null, token: null,
      setAuth: (user, profile, token) => set({ user, profile, token }),
      setProfile: (profile) => set({ profile }),
      clearAuth: () => set({ user: null, profile: null, token: null })
    }),
    { name: 'nexus-auth' }
  )
)
