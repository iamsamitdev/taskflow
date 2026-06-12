import { Button } from '@/components/ui/button'
import { useTheme } from '@/contexts/ThemeContext'
import Clock from '@/components/Clock'
import { useAuthStore } from '../store/useAuthStore'
import { NavLink, useNavigate } from 'react-router'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Avatar,
  AvatarFallback,
} from '@/components/ui/avatar'
import { LogOut, Settings, UserRound, Moon, Sun } from 'lucide-react'

const navClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
    isActive
      ? 'bg-primary/10 text-primary'
      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
  }`

function Header() {
  const { theme, toggleTheme } = useTheme()
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  // สร้าง initials จากชื่อ เช่น "Somchai Jaidee" → "SJ"
  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <div className="flex items-center gap-6">
          <div>
            <h1 className="text-xl font-bold"> TaskFlow</h1>
          </div>
          {/* Nav links */}
          <nav className="flex items-center gap-1">
            <NavLink to="/" end className={navClass}>แดชบอร์ด</NavLink>
            <NavLink to="/tasks" className={navClass}>งานทั้งหมด</NavLink>
          </nav>
        </div>

      <div className="flex items-center gap-3">
        <Clock />

        {/* Theme toggle */}
        <Button variant="outline" size="icon" onClick={toggleTheme} aria-label="toggle theme">
          {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </Button>

        {/* User menu */}
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-full outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                <Avatar className="h-9 w-9 cursor-pointer">
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuLabel className="flex flex-col gap-0.5">
                <span className="font-semibold">{user.name}</span>
                <span className="text-xs text-muted-foreground font-normal">{user.email}</span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/profile')}>
                <UserRound className="mr-2 h-4 w-4" />
                โปรไฟล์
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                ตั้งค่า
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => { logout(); navigate('/login') }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                ออกจากระบบ
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      </div>
    </header>
  )
}

export default Header