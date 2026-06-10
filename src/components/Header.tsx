import { Button } from '@/components/ui/button'
import { useTheme } from '@/contexts/ThemeContext'
import Clock from '@/components/Clock'

function Header() {
  // ไม่มี prop drilling — ดึงจาก Context ตรง ๆ
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="flex items-center justify-between border-b bg-background px-6 py-4">
      <div>
        <h1 className="text-xl font-bold">📋 TaskFlow</h1>
        <p className="text-sm text-muted-foreground">ระบบจัดการงานของทีม</p>
      </div>
      <div className="flex items-center gap-4">
        <Clock />
        <Button variant="outline" size="icon" onClick={toggleTheme}>
          {theme === 'light' ? '🌙' : '☀️'}
        </Button>
      </div>
    </header>
  )
}

export default Header