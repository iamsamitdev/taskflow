import { useState, useEffect } from 'react'

// Generic Hook — ใช้กับข้อมูล type อะไรก็ได้
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const saved = localStorage.getItem(key)
      return saved ? (JSON.parse(saved) as T) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  // คืนค่าเป็น tuple เหมือน useState — ใช้แทนกันได้ทันที
  return [value, setValue] as const
}