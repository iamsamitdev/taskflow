import { useTaskStats } from '@/features/tasks/queries'
import { useTasks } from '@/features/tasks/queries'
import { useAuthStore } from '@/store/useAuthStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Progress } from '@/components/ui/progress'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts'
import { CheckCheck, Clock, Loader, AlertTriangle, ListTodo } from 'lucide-react'
import { Link } from 'react-router'
import type { TaskStatus, TaskPriority } from '@/types/task'
import { statusLabel, priorityLabel } from '@/types/task'

const chartConfig = {
  todo:    { label: 'รอดำเนินการ', color: 'hsl(217 91% 60%)' },
  doing:   { label: 'กำลังทำ',     color: 'hsl(43 96% 56%)' },
  done:    { label: 'เสร็จแล้ว',   color: 'hsl(142 71% 45%)' },
  overdue: { label: 'เลยกำหนด',   color: 'hsl(0 84% 60%)' },
}

const statusProgress: Record<TaskStatus, number> = {
  TODO: 0,
  DOING: 50,
  DONE: 100,
}

const statusColor: Record<TaskStatus, string> = {
  TODO:  'bg-blue-500',
  DOING: 'bg-yellow-500',
  DONE:  'bg-green-500',
}

const priorityVariant: Record<TaskPriority, 'secondary' | 'default' | 'destructive'> = {
  LOW: 'secondary',
  MEDIUM: 'default',
  HIGH: 'destructive',
}

function DashboardPage() {
  const user = useAuthStore((s) => s.user)
  const { data: stats, isPending, isError } = useTaskStats()
  const { data: recentData } = useTasks({ page: 1, status: 'all', search: '' })

  const pieData = stats
    ? [
        { name: 'todo',  value: stats.todo,  label: 'รอดำเนินการ' },
        { name: 'doing', value: stats.doing, label: 'กำลังทำ' },
        { name: 'done',  value: stats.done,  label: 'เสร็จแล้ว' },
      ].filter((d) => d.value > 0)
    : []

  const barData = stats
    ? [
        { status: 'รอดำเนินการ', count: stats.todo,    fill: chartConfig.todo.color },
        { status: 'กำลังทำ',     count: stats.doing,   fill: chartConfig.doing.color },
        { status: 'เสร็จแล้ว',   count: stats.done,    fill: chartConfig.done.color },
        { status: 'เลยกำหนด',   count: stats.overdue, fill: chartConfig.overdue.color },
      ]
    : []

  const statCards = stats
    ? [
        { label: 'งานทั้งหมด',    value: stats.total,   icon: <ListTodo className="h-5 w-5" />,        color: 'text-primary' },
        { label: 'รอดำเนินการ', value: stats.todo,    icon: <Clock className="h-5 w-5" />,           color: 'text-blue-500' },
        { label: 'กำลังทำ',      value: stats.doing,   icon: <Loader className="h-5 w-5 animate-spin" />, color: 'text-yellow-500' },
        { label: 'เสร็จแล้ว',    value: stats.done,    icon: <CheckCheck className="h-5 w-5" />,     color: 'text-green-500' },
        { label: 'เลยกำหนด',    value: stats.overdue, icon: <AlertTriangle className="h-5 w-5" />,  color: 'text-red-500' },
      ]
    : []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-sm text-muted-foreground">ยินดีต้อนรับกลับมา</p>
        <h1 className="text-2xl font-bold">สวัสดี, {user?.name ?? 'คุณ'} 👋</h1>
      </div>

      {/* Stat Cards */}
      {isPending && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      )}
      {isError && (
        <p className="text-destructive text-sm">โหลดข้อมูลไม่สำเร็จ — ตรวจสอบว่า API Server ทำงานอยู่</p>
      )}
      {stats && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {statCards.map((s) => (
            <Card key={s.label}>
              <CardContent className="pt-5 pb-4 flex flex-col gap-2">
                <div className={`${s.color}`}>{s.icon}</div>
                <p className="text-3xl font-extrabold">{s.value}</p>
                <p className="text-xs text-muted-foreground font-medium">{s.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Charts */}
      {stats && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

          {/* Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">สรุปงานตามสถานะ</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-56 w-full">
                <BarChart data={barData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="status" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {barData.map((entry) => (
                      <Cell key={entry.status} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">สัดส่วนสถานะงาน</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              {pieData.length === 0 ? (
                <p className="text-sm text-muted-foreground py-10">ยังไม่มีข้อมูลงาน</p>
              ) : (
                <>
                  <ChartContainer config={chartConfig} className="h-52 w-full">
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="label"
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={85}
                        paddingAngle={3}
                      >
                        {pieData.map((entry) => (
                          <Cell
                            key={entry.name}
                            fill={chartConfig[entry.name as keyof typeof chartConfig].color}
                          />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent nameKey="label" />} />
                    </PieChart>
                  </ChartContainer>
                  {/* Legend */}
                  <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5">
                    {pieData.map((entry) => (
                      <div key={entry.name} className="flex items-center gap-1.5 text-xs">
                        <span
                          className="inline-block h-2.5 w-2.5 rounded-full"
                          style={{ background: chartConfig[entry.name as keyof typeof chartConfig].color }}
                        />
                        {entry.label}
                        <span className="text-muted-foreground">({entry.value})</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

        </div>
      )}

      {/* Recent Tasks */}
      {recentData && recentData.items.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base">งานล่าสุด</CardTitle>
            <Link to="/tasks" className="text-xs text-primary hover:underline">
              ดูทั้งหมด →
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Overall completion bar */}
            {stats && stats.total > 0 && (
              <div className="mb-5 space-y-1.5">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>ความคืบหน้าโดยรวม</span>
                  <span>{Math.round((stats.done / stats.total) * 100)}%</span>
                </div>
                <Progress value={(stats.done / stats.total) * 100} className="h-2" />
              </div>
            )}

            {recentData.items.slice(0, 10).map((task) => (
              <div key={task.id} className="space-y-1.5">
                <div className="flex items-center justify-between gap-3">
                  <Link
                    to={`/tasks/${task.id}`}
                    className="flex-1 truncate text-sm font-medium hover:text-primary hover:underline"
                  >
                    {task.title}
                  </Link>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <Badge variant={priorityVariant[task.priority]} className="text-xs px-1.5 py-0">
                      {priorityLabel[task.priority]}
                    </Badge>
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium text-white ${statusColor[task.status]}`}>
                      {statusLabel[task.status]}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={statusProgress[task.status]} className="h-1.5 flex-1" />
                  <span className="w-8 text-right text-xs text-muted-foreground">
                    {statusProgress[task.status]}%
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default DashboardPage
