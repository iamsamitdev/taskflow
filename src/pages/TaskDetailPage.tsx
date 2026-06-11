import { useParams, useNavigate } from 'react-router'
import { Button } from '@/components/ui/button'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import type { Task } from '@/types/task'

function TaskDetailPage() {
  // ดึงค่า :id จาก URL เช่น /tasks/abc123 → id = 'abc123'
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [tasks] = useLocalStorage<Task[]>('taskflow:tasks', [])

  const task = tasks.find((t) => t.id === id)

  if (!task) {
    return (
      <div className="space-y-4 text-center">
        <p>ไม่พบงานที่ต้องการ 😢</p>
        <Button onClick={() => navigate('/tasks')}>กลับหน้ารายการ</Button>
      </div>
    )
  }

  return (
    <article className="space-y-3">
      <h2 className="text-2xl font-bold">{task.title}</h2>
      {task.description && <p>{task.description}</p>}
      <p className="text-sm text-muted-foreground">
        สร้างเมื่อ: {new Date(task.createdAt).toLocaleDateString('th-TH')}
      </p>
      <Button variant="outline" onClick={() => navigate(-1)}>← ย้อนกลับ</Button>
    </article>
  )
}

export default TaskDetailPage