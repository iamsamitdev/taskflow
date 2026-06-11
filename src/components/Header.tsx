import { Button } from '@/components/ui/button'
import { useTheme } from '@/contexts/ThemeContext'
import Clock from '@/components/Clock'
import useStore from "../store/counterStore"
import { useAuthStore } from '../store/useAuthStore'
import { useNavigate } from 'react-router'

function Header() {
  // ไม่มี prop drilling — ดึงจาก Context ตรง ๆ
  const { theme, toggleTheme } = useTheme()
  const { count } = useStore() as { count: number }
  
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  return (
    <header className="flex items-center justify-between border-b bg-background px-6 py-4">
      <div>
        <h1 className="text-xl font-bold">📋 TaskFlow ({count})</h1>
        <p className="text-sm text-muted-foreground">ระบบจัดการงานของทีม</p>
      </div>
      <div className="flex items-center gap-4">
        <Clock />
        <Button variant="outline" size="icon" onClick={toggleTheme}>
          {theme === 'light' ? '🌙' : '☀️'}
        </Button>
        {user ? (
          <div className="flex items-center gap-2">
            <span className="text-sm">สวัสดี, {user.name}</span>
            <Button variant="ghost" size="sm" onClick={() => { logout(); navigate('/login') }}>
              ออกจากระบบ
            </Button>
          </div>
        ) : null}
      </div>
    </header>
  )
}

export default Header