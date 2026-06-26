import { create } from 'zustand'

interface UIStore {
  authModal: 'signin' | 'signup' | null
  postProjectModal: boolean
  submitProposalModal: { open: boolean; projectId?: string }
  hireModal: { open: boolean; freelancerId?: string }
  activeTab: string
  sidebarOpen: boolean
  setAuthModal: (mode: 'signin' | 'signup' | null) => void
  setPostProjectModal: (open: boolean) => void
  setSubmitProposalModal: (data: { open: boolean; projectId?: string }) => void
  setHireModal: (data: { open: boolean; freelancerId?: string }) => void
  setActiveTab: (tab: string) => void
  toggleSidebar: () => void
}

export const useUIStore = create<UIStore>((set) => ({
  authModal: null,
  postProjectModal: false,
  submitProposalModal: { open: false, projectId: undefined },
  hireModal: { open: false, freelancerId: undefined },
  activeTab: 'overview',
  sidebarOpen: true,
  setAuthModal: (mode) => set({ authModal: mode }),
  setPostProjectModal: (open) => set({ postProjectModal: open }),
  setSubmitProposalModal: (data) => set({ submitProposalModal: data }),
  setHireModal: (data) => set({ hireModal: data }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
}))
