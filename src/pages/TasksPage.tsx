import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'   // pnpm dlx shadcn@latest add skeleton
import TaskList from '@/components/TaskList'
import { useTasks, useUpdateTask, useDeleteTask } from '@/features/tasks/queries'

function TasksPage() {
  const [page, setPage] = useState(1)
  const { data, isPending, isError, isFetching } = useTasks(page)
  const updateMutation = useUpdateTask()
  const deleteMutation = useDeleteTask()

  // Loading State ครั้งแรก — ใช้ Skeleton ของ shadcn
  if (isPending) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-40 rounded-xl" />
        ))}
      </div>
    )
  }

  if (isError) {
    return <p className="text-center text-destructive">โหลดข้อมูลไม่สำเร็จ 😢</p>
  }

  return (
    <div className="space-y-6">
      <TaskList
        tasks={data.items}
        onToggle={(id) => {
          const task = data.items.find((t) => t.id === id)
          if (task) {
            updateMutation.mutate({
              id,
              status: task.status === 'done' ? 'todo' : 'done',
            })
          }
        }}
        onDelete={(id) => deleteMutation.mutate(id)}
      />

      {/* Pagination */}
      <div className="flex items-center justify-center gap-3">
        <Button
          variant="outline"
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
        >
          ← ก่อนหน้า
        </Button>
        <span className="text-sm text-muted-foreground">
          หน้า {data.page} / {data.totalPages} {isFetching && '⏳'}
        </span>
        <Button
          variant="outline"
          disabled={page >= data.totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          ถัดไป →
        </Button>
      </div>
    </div>
  )
}

export default TasksPage