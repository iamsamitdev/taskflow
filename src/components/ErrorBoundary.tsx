import { Component, type ReactNode } from 'react'
import { Button } from '@/components/ui/button'

interface Props { children?: ReactNode }
interface State { hasError: boolean }

// Error Boundary ยังต้องเป็น Class Component (กรณีเดียวที่ใช้ Class ในคอร์สนี้)
class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    // hasError = true  → เกิด error ใน children (class wrapper mode)
    // ไม่มี children    → ถูกใช้เป็น errorElement ของ React Router โดยตรง
    if (this.state.hasError || !this.props.children) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4">
          <p className="text-lg">เกิดข้อผิดพลาดบางอย่าง 😵</p>
          <Button onClick={() => window.location.reload()}>โหลดหน้าใหม่</Button>
        </div>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary