// ============================================
// ชนิดข้อมูลหลักของระบบ TaskFlow
// ============================================

// Literal Union Type — จำกัดค่าที่เป็นไปได้ ป้องกันพิมพ์ผิด
export type TaskStatus = 'TODO' | 'DOING' | 'DONE'
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH'

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
  LOW: 'ต่ำ',
  MEDIUM: 'ปานกลาง',
  HIGH: 'สูง',
}

export const statusLabel: Record<TaskStatus, string> = {
  TODO: 'รอดำเนินการ',
  DOING: 'กำลังทำ',
  DONE: 'เสร็จแล้ว',
}