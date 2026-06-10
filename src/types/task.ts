// ============================================
// ชนิดข้อมูลหลักของระบบ TaskFlow
// ============================================

// Literal Union Type — จำกัดค่าที่เป็นไปได้ ป้องกันพิมพ์ผิด
export type TaskStatus = 'todo' | 'doing' | 'done'
export type TaskPriority = 'low' | 'medium' | 'high'

// interface สำหรับ Object ที่มีโครงสร้างชัดเจน
export interface Task {
  id: string
  title: string
  description?: string        // ? คือ optional ไม่ใส่ก็ได้
  status: TaskStatus
  priority: TaskPriority
  dueDate?: string            // เก็บเป็น ISO string เช่น '2026-06-15'
  createdAt: string
}

// ตัวช่วยแปลงค่า priority เป็นข้อความภาษาไทย
export const priorityLabel: Record<TaskPriority, string> = {
  low: 'ต่ำ',
  medium: 'ปานกลาง',
  high: 'สูง',
}

export const statusLabel: Record<TaskStatus, string> = {
  todo: 'รอดำเนินการ',
  doing: 'กำลังทำ',
  done: 'เสร็จแล้ว',
}