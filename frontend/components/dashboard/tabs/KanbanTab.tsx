'use client'
import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Plus, X, GripVertical, Trash2 } from 'lucide-react'
import { useAuth } from '@/providers/AuthProvider'
import { useToast } from '@/components/ui/Toaster'
import api from '@/lib/api'

const columns = ['backlog', 'in_progress', 'review', 'completed']
const columnLabels: Record<string, string> = { backlog: 'Backlog', in_progress: 'In Progress', review: 'Review', completed: 'Completed' }
const columnColors: Record<string, string> = { backlog: '#6B7280', in_progress: '#F59E0B', review: '#8B5CF6', completed: '#10B981' }

export function KanbanTab() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [addingTo, setAddingTo] = useState<string | null>(null)
  const [newTask, setNewTask] = useState('')
  const [dragTask, setDragTask] = useState<string | null>(null)

  const fetchTasks = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/contracts')
      setTasks(data?.flatMap((c: any) => c.kanban_tasks || []) || [])
    } catch {} finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchTasks() }, [fetchTasks])

  const addTask = async (column: string) => {
    if (!newTask.trim()) return
    try {
      const { data } = await api.post('/kanban', { title: newTask.trim(), column_name: column })
      setTasks(prev => [...prev, data])
      setNewTask('')
      setAddingTo(null)
      toast('success', 'Task added!')
    } catch (err: any) { toast('error', 'Failed to add task') }
  }

  const moveTask = async (taskId: string, toColumn: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, column_name: toColumn } : t))
    try { await api.patch(`/kanban/${taskId}`, { column_name: toColumn }) }
    catch { fetchTasks() }
  }

  const deleteTask = async (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId))
    try { await api.delete(`/kanban/${taskId}`) }
    catch { fetchTasks() }
  }

  const dropTask = (col: string) => {
    if (dragTask && dragTask !== col) moveTask(tasks.find(t => t.column_name === dragTask)?.id!, col)
    setDragTask(null)
  }

  const columnTasks = (col: string) => tasks.filter(t => t.column_name === col)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Kanban Board</h2>
          <p className="text-sm mt-1" style={{ color: 'var(--text2)' }}>{tasks.length} total tasks</p>
        </div>
      </div>
      {loading && tasks.length === 0 ? (
        <div className="grid grid-cols-4 gap-4">
          {columns.map(col => (
            <div key={col} className="p-4 rounded-2xl border animate-pulse" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="h-5 w-24 rounded bg-white/10 mb-4" />
              {[1,2].map(i => <div key={i} className="h-16 rounded-xl bg-white/5 mb-2" />)}
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {columns.map((col) => (
            <div key={col} className="p-4 rounded-2xl border" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
              onDragOver={e => e.preventDefault()} onDrop={() => dropTask(col)}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ background: columnColors[col] }} />
                  <h3 className="text-sm font-semibold text-white">{columnLabels[col]}</h3>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: `${columnColors[col]}20`, color: columnColors[col] }}>
                  {columnTasks(col).length}
                </span>
              </div>
              <div className="space-y-2 min-h-[120px]">
                {columnTasks(col).map((task) => (
                  <motion.div key={task.id} layout initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                    draggable onDragStart={() => setDragTask(task.column_name)}
                    className="group p-3 rounded-xl border cursor-grab active:cursor-grabbing relative"
                    style={{ background: 'var(--bg3)', borderColor: 'var(--border)' }}>
                    <div className="flex items-start gap-2">
                      <GripVertical className="w-3 h-3 mt-0.5 shrink-0 opacity-30 group-hover:opacity-60" style={{ color: 'var(--text3)' }} />
                      <p className="text-sm font-medium text-white flex-1">{task.title}</p>
                      <button onClick={() => deleteTask(task.id)}
                        className="shrink-0 p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-red-500/10 transition-all">
                        <Trash2 className="w-3 h-3" style={{ color: 'var(--text3)' }} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
              {addingTo === col ? (
                <div className="mt-3 space-y-2">
                  <input value={newTask} onChange={e => setNewTask(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addTask(col)}
                    placeholder="Task title..." autoFocus
                    className="w-full px-3 py-2 rounded-lg text-xs text-white outline-none"
                    style={{ background: 'var(--bg2)', border: '1px solid var(--border)' }} />
                  <div className="flex gap-2">
                    <button onClick={() => addTask(col)} className="px-3 py-1.5 rounded-lg text-xs font-medium text-white" style={{ background: 'var(--blue)' }}>Add</button>
                    <button onClick={() => { setAddingTo(null); setNewTask('') }} className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ color: 'var(--text2)' }}>Cancel</button>
                  </div>
                </div>
              ) : (
                <button onClick={() => setAddingTo(col)} className="flex items-center gap-1 w-full mt-3 py-2 rounded-lg text-xs font-medium transition-all hover:bg-white/5" style={{ color: 'var(--text3)' }}>
                  <Plus className="w-3 h-3" /> Add Task
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
