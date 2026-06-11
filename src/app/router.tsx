import { createBrowserRouter } from 'react-router'
import MainLayout from '@/app/MainLayout'
import { lazy, Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import TasksPage from '@/pages/TasksPage'
import TaskDetailPage from '@/pages/TaskDetailPage'
import NotFoundPage from '@/pages/NotFoundPage'
import LoginPage from '@/pages/LoginPage'
import RegisterPage from '@/pages/RegisterPage'
import ProtectedRoute from './ProtectedRoute'
// import RegisterPage from '@/pages/RegisterPage'
// import ProtectedRoute from '@/app/ProtectedRoute'

const DashboardPage = lazy(() => import('@/pages/DashboardPage'))

const PageLoader = () => (
    <div className="space-y-4">
    <Skeleton className="h-8 w-1/3" />
    <Skeleton className="h-40 w-full" />
  </div>
)

export const router = createBrowserRouter([
  {
    // Layout Route — ทุก children จะถูกครอบด้วย MainLayout
    element: <MainLayout />,
    children: [
      // Protected routes
      {
        element: <ProtectedRoute />, // ตรวจสอบการล็อกอินก่อนเข้าถึงหน้าเหล่านี้
        children: [
          { 
              index: true, 
              element: (
                  <Suspense fallback={<PageLoader />}>
                      <DashboardPage />
                  </Suspense>
              ),
          },
          { 
            path: 'tasks', 
            element: <TasksPage /> 
          },
          {
            path: 'tasks/:id',
            element: <TaskDetailPage />
          }
        ]
      }
    ]
  },
  {
    path: 'login',
    element: <LoginPage />
  },
  {
    path: 'register',
    element: <RegisterPage />
  },
  {
    path: '*',
    element: <NotFoundPage />
  }
])