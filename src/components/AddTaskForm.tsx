import { useRef } from 'react'
import { useFormStatus } from 'react-dom'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { Task } from '@/types/task'

interface AddTaskFormProps {
  onAdd: (task: Task) => Promise<void>
}

// useFormStatus ต้องอยู่ใน component ลูกของ <form> เท่านั้น
function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'กำลังบันทึก...' : 'เพิ่มงาน'}
    </Button>
  )
}

function AddTaskForm({ onAdd }: AddTaskFormProps) {
  const formRef = useRef<HTMLFormElement>(null)

  // Action — ฟังก์ชันที่รับ FormData ตรงจาก <form action={...}>
  const addTaskAction = async (formData: FormData) => {
    const title = String(formData.get('title') ?? '').trim()
    if (!title) return

    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      status: 'todo',
      priority: 'medium',
      createdAt: new Date().toISOString(),
    }

    await onAdd(newTask)
    formRef.current?.reset()   // ล้างฟอร์มหลังบันทึกสำเร็จ
  }

  return (
    <form ref={formRef} action={addTaskAction} className="flex gap-2">
      <Input name="title" placeholder="พิมพ์ชื่องานใหม่..." autoComplete="off" />
      <SubmitButton />
    </form>
  )
}

export default AddTaskForm