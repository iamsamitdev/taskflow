import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import type { Task, TaskPriority } from '@/types/task'
import { priorityLabel, statusLabel } from '@/types/task'
import { Link } from 'react-router'
import { useAuthStore } from '@/store/useAuthStore'
import { memo } from 'react'

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

  const user = useAuthStore((state) => state.user)
  const canDelete =
    user?.role === 'admin' || (task as Task & { ownerId?: string }).ownerId === user?.id

  return (
    <Card className={isDone ? 'opacity-60' : ''}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-2">
          {/* Conditional Rendering — ขีดฆ่าเมื่องานเสร็จ */}
          <Link to={`/tasks/${task.id}`} className={`hover:text-primary hover:underline ${isDone ? 'line-through' : ''}`}>
            {task.title}
          </Link>
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
            {canDelete && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size="sm" variant="destructive">ลบ</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>ยืนยันการลบงาน</AlertDialogTitle>
                    <AlertDialogDescription>
                      ต้องการลบ &quot;{task.title}&quot; ใช่หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                    <AlertDialogAction onClick={() => onDelete(task.id)}>
                      ลบ
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default memo(TaskCard)