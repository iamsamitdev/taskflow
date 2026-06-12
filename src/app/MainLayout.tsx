import { Outlet } from 'react-router'
import Header from '@/components/Header'
import { Toaster } from "@/components/ui/sonner"

function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="mx-auto w-full max-w-6xl p-6">
        <Outlet />
      </main>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
    </div>
  )
}

export default MainLayout