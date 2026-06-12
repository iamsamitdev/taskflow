import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { router } from '@/app/router'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import ErrorBoundary from '@/components/ErrorBoundary'

// ตั้งค่า React Query Client — เรียก API ซ้ำก็ต่อเมื่อข้อมูลเก่าหมดอายุ (stale) แล้วเท่านั้น โดยกำหนดให้ข้อมูล "สด" นาน 1 นาที เพื่อประหยัดการเรียก API และเพิ่มประสิทธิภาพการทำงานของแอป
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,   // ข้อมูล "สด" 1 นาที — ไม่ refetch ซ้ำโดยไม่จำเป็น
      retry: 1,
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <RouterProvider router={router} />
          <ReactQueryDevtools initialIsOpen={false} />
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>
)