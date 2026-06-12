import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'
import { api } from '@/lib/api'

interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'member'
}

interface LoginResponse {
  user: User
  token: string
}

interface AuthState {
  user: User | null
  token: string | null
  // computed-style helper
  isAuthenticated: () => boolean
  // actions
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        token: null,

        isAuthenticated: () => get().token !== null,

        login: async (email, password) => {
          const { data } = await api.post<LoginResponse>('/auth/login', { email, password })
          set({ user: data.user, token: data.token })
        },

        register: async (name: string, email: string, password: string) => {
          const { data } = await api.post<LoginResponse>('/auth/register', { name, email, password })
          set({ user: data.user, token: data.token })
        },

        logout: () => set({ user: null, token: null }),
      }),
      { name: 'taskflow:auth' }   // persist ลง localStorage อัตโนมัติ
    )
  )
)