import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

type Theme = 'light' | 'dark'

// กำหนดโครงสร้างของค่าที่ Context จะส่งให้
interface ThemeContextValue {
  theme: Theme
  toggleTheme: () => void
}

// ค่าเริ่มต้นเป็น null แล้วเช็คใน hook เพื่อบังคับให้ใช้ภายใต้ Provider เท่านั้น
const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem('taskflow:theme') as Theme) ?? 'light'
  )

  useEffect(() => {
    // เพิ่ม/ลบ class 'dark' ที่ <html> ตามมาตรฐาน shadcn + Tailwind
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('taskflow:theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

// Custom Hook ห่อ useContext — เรียกใช้ง่ายและ type ปลอดภัย
export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme ต้องใช้ภายใต้ <ThemeProvider> เท่านั้น')
  return ctx
}