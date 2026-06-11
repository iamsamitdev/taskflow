import { Link } from 'react-router'
import { Button } from '@/components/ui/button'

function NotFoundPage() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center text-center px-4">
      <p className="text-8xl font-extrabold text-primary">404</p>
      <h1 className="mt-4 text-3xl font-bold">ไม่พบหน้านี้</h1>
      <p className="mt-2 text-muted-foreground">
        หน้าที่คุณกำลังมองหาอาจถูกลบ เปลี่ยนชื่อ หรือไม่มีอยู่จริง
      </p>
      <Button asChild className="mt-8">
        <Link to="/">กลับหน้าหลัก</Link>
      </Button>
    </div>
  )
}

export default NotFoundPage
