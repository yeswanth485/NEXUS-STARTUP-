'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'

const columns = ['backlog', 'in_progress', 'review', 'completed']

export function KanbanTab() {
  const [tasks] = useState<any[]>([])

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">Kanban Board</h2>
      <div className="grid grid-cols-4 gap-4">
        {columns.map((col) => (
          <div key={col} className="p-4 rounded-2xl border" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold capitalize text-white">{col.replace('_', ' ')}</h3>
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--bg3)', color: 'var(--text3)' }}>{tasks.filter(t => t.column_name === col).length}</span>
            </div>
            <div className="space-y-2 min-h-[200px]">
              {tasks.filter(t => t.column_name === col).map((task) => (
                <motion.div key={task.id} layout className="p-3 rounded-xl border" style={{ background: 'var(--bg3)', borderColor: 'var(--border)' }}>
                  <p className="text-sm font-medium text-white">{task.title}</p>
                </motion.div>
              ))}
            </div>
            <button className="flex items-center gap-1 w-full mt-3 py-2 rounded-lg text-xs font-medium transition-all hover:bg-white/5" style={{ color: 'var(--text3)' }}>
              <Plus className="w-3 h-3" /> Add Task
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
