import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'

interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'member'
}

interface AuthState {
  user: User | null
  token: string | null
  // computed-style helper
  isAuthenticated: () => boolean
  // actions
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        token: null,

        isAuthenticated: () => get().token !== null,

        login: async (email, _password) => {
          // 🔧 Mock API — วันที่ 5 จะแทนด้วย axios เรียก /auth/login จริง
          await new Promise((resolve) => setTimeout(resolve, 800))
          set({
            user: { id: 'u1', name: 'สมชาย ใจดี', email, role: 'member' },
            token: 'mock-jwt-token',
          })
        },

        logout: () => set({ user: null, token: null }),
      }),
      { name: 'taskflow:auth' }   // persist ลง localStorage อัตโนมัติ
    )
  )
)