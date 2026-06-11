import { useState, useMemo, useCallback } from 'react'
import TaskList from '@/components/TaskList'
import { Input } from '@/components/ui/input'
// import { Button } from '@/components/ui/button'
import type { Task } from '@/types/task'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import type { TaskStatus } from '@/types/task'
import StatCard from '../components/StatCard'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useOptimistic } from 'react'
import AddTaskForm from '@/components/AddTaskForm'


// ข้อมูลตั้งต้นสำหรับทดสอบ
const initialTasks: Task[] = [
  {
    id: '1',
    title: 'ออกแบบหน้า Dashboard',
    description: 'ทำ wireframe และเลือกชุดสี',
    status: 'doing',
    priority: 'high',
    dueDate: '2026-06-15',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'เขียนเอกสาร API',
    status: 'todo',
    priority: 'medium',
    createdAt: new Date().toISOString(),
  },
]

function TasksPage() {
  
  // State หลักของแอป — อยู่ที่ Component บนสุด
  // const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [tasks, setTasks] = useLocalStorage<Task[]>('taskflow:tasks', initialTasks)
  // const [newTitle, setNewTitle] = useState('')

  // กำหนด type ให้ event ของ input
  // const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   setNewTitle(e.target.value)
  // }

  // เพิ่ม state สำหรับกรอง ค้นหา และเรียงลำดับ
  const [filter, setFilter] = useState<TaskStatus | 'all'>('all')
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<'createdAt' | 'priority'>('createdAt')

  // const addTask = () => {
  //   if (!newTitle.trim()) return

  //   const newTask: Task = {
  //     id: crypto.randomUUID(),
  //     title: newTitle.trim(),
  //     status: 'todo',
  //     priority: 'medium',
  //     createdAt: new Date().toISOString(),
  //   }

  //   // ✅ Immutable update — สร้าง array ใหม่ ห้าม push ใส่ของเดิม
  //   setTasks((prev) => [newTask, ...prev])
  //   setNewTitle('')
  //   inputRef.current?.focus()
  // }

  // ถ้าไม่ใช้ useCallback ฟังก์ชันจะถูกสร้างใหม่ทุก render
  // ทำให้ React.memo ที่ครอบ TaskCard ไม่มีผล (วันที่ 5 จะวัดผลจริง)
  const toggleTask = useCallback((id: string) => {
    // ✅ map สร้าง array ใหม่ + spread สร้าง object ใหม่
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? { ...task, status: task.status === 'done' ? 'todo' : 'done' }
          : task
      )
    )
  }, [])

  const deleteTask = useCallback((id: string) => {
    // ✅ filter สร้าง array ใหม่ที่ไม่มีตัวที่ถูกลบ
    setTasks((prev) => prev.filter((task) => task.id !== id))
  }, [])

   // ลำดับความสำคัญสำหรับใช้เรียง
  // const priorityOrder = { high: 0, medium: 1, low: 2 }

  // ประมวลผลข้อมูลก่อนแสดง: กรอง → ค้นหา → เรียง
  // const visibleTasks = tasks
  //   .filter((task) => filter === 'all' || task.status === filter)
  //   .filter((task) => task.title.toLowerCase().includes(search.toLowerCase()))
  //   .toSorted((a, b) =>
  //     sortBy === 'priority'
  //       ? priorityOrder[a.priority] - priorityOrder[b.priority]
  //       : b.createdAt.localeCompare(a.createdAt)
  // )

  // const inputRef = useRef<HTMLInputElement>(null)

  // ถ้าไม่ใช้ useMemo การคำนวณนี้จะรันใหม่ทุก re-render
  // แม้ tasks ไม่เปลี่ยน (เช่น พิมพ์ในช่อง search)
  const stats = useMemo(() => {
    console.log('🔄 คำนวณสถิติใหม่')   // เปิด console ดูว่ารันเมื่อไร
    return {
      total: tasks.length,
      doing: tasks.filter((t) => t.status === 'doing').length,
      done: tasks.filter((t) => t.status === 'done').length,
      overdue: tasks.filter(
        (t) => t.dueDate && t.status !== 'done' && new Date(t.dueDate) < new Date()
      ).length,
    }
  }, [tasks])
  
  // จำลองความหน่วงของเซิร์ฟเวอร์ (วันที่ 5 จะเป็น API จริง)
  const fakeApiDelay = () => new Promise((resolve) => setTimeout(resolve, 1200))

  // optimisticTasks = tasks จริง + รายการที่ "มองโลกในแง่ดี" ว่าจะสำเร็จ
  const [optimisticTasks, addOptimisticTask] = useOptimistic(
    tasks,
    (current, newTask: Task) => [newTask, ...current]
  )

  const handleAdd = async (newTask: Task) => {
    addOptimisticTask(newTask)        // 1) ขึ้นจอทันที (โปร่งแสงได้ถ้าอยากแยกให้เห็น)
    await fakeApiDelay()              // 2) รอ "เซิร์ฟเวอร์" ตอบ
    setTasks((prev) => [newTask, ...prev])   // 3) บันทึกจริง
}

  return (
    <>
      <main className="mx-auto max-w-6xl space-y-6 p-6">

        <div className="grid grid-cols-3 gap-4">
          <StatCard label="งานทั้งหมด">{stats.total}</StatCard>
          <StatCard label="กำลังทำ">{stats.doing}</StatCard>
          <StatCard label="เสร็จแล้ว">
            <span className="text-green-600">
              {stats.done}
            </span>
          </StatCard>
        </div>

        {/*  React 19 Action */}
        <AddTaskForm onAdd={handleAdd} />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Tabs กรองตามสถานะ */}
          <Tabs value={filter} onValueChange={(v) => setFilter(v as TaskStatus | 'all')}>
            <TabsList>
              <TabsTrigger value="all">ทั้งหมด</TabsTrigger>
              <TabsTrigger value="todo">รอดำเนินการ</TabsTrigger>
              <TabsTrigger value="doing">กำลังทำ</TabsTrigger>
              <TabsTrigger value="done">เสร็จแล้ว</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex gap-2">
            {/* ช่องค้นหา */}
            <Input
              placeholder="ค้นหางาน..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-44"
            />
            {/* Select เรียงลำดับ */}
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">ล่าสุดก่อน</SelectItem>
                <SelectItem value="priority">ความสำคัญ</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TaskList tasks={optimisticTasks} onToggle={toggleTask} onDelete={deleteTask} />
      </main>
    </>
  )
}

export default TasksPage
