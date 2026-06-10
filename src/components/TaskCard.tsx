import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Task, TaskPriority } from '@/types/task'
import { priorityLabel, statusLabel } from '@/types/task'

// กำหนดโครงสร้าง Props ด้วย interface
interface TaskCardProps {
  task: Task
  onToggle: (id: string) => void     // ส่งฟังก์ชัน (Callback) ลงมาจากแม่
  onDelete: (id: string) => void
}

// เลือก variant ของ Badge ตามระดับความสำคัญ
const priorityVariant: Record<TaskPriority, 'secondary' | 'default' | 'destructive'> = {
  low: 'secondary',
  medium: 'default',
  high: 'destructive',
}

function TaskCard({ task, onToggle, onDelete }: TaskCardProps) {
  const isDone = task.status === 'done'

  return (
    <Card className={isDone ? 'opacity-60' : ''}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-2">
          {/* Conditional Rendering — ขีดฆ่าเมื่องานเสร็จ */}
          <span className={isDone ? 'line-through' : ''}>{task.title}</span>
          <Badge variant={priorityVariant[task.priority]}>
            {priorityLabel[task.priority]}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* && — แสดงเฉพาะเมื่อมีค่า */}
        {task.description && (
          <p className="text-sm text-muted-foreground">{task.description}</p>
        )}
        <div className="flex items-center justify-between">
          <Badge variant="outline">{statusLabel[task.status]}</Badge>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => onToggle(task.id)}>
              {isDone ? 'ทำใหม่' : 'เสร็จแล้ว'}
            </Button>
            <Button size="sm" variant="destructive" onClick={() => onDelete(task.id)}>
              ลบ
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default TaskCard