import { NavLink, Outlet } from 'react-router'
import Header from '@/components/Header'
import { Toaster } from "@/components/ui/sonner"

// ฟังก์ชันกำหนด class ตามสถานะ active ของ NavLink
const navClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-md px-3 py-1.5 text-sm transition-colors ${
    isActive
      ? 'bg-primary text-primary-foreground'
      : 'text-muted-foreground hover:bg-muted'
  }`

function MainLayout() {
  return (
    <div className="max-w-6xl mx-auto">
      <Header />
      <nav className="flex gap-2 border-b px-6 py-2">
        <NavLink to="/" end className={navClass}>แดชบอร์ด</NavLink>
        <NavLink to="/tasks" className={navClass}>งานทั้งหมด</NavLink>
      </nav>
      <main className="mx-auto max-w-6xl p-6">
        {/* Outlet = ตำแหน่งที่หน้าลูกจะถูก render */}
        <Outlet />
      </main>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
    </div>
  )
}

export default MainLayout