import useStore from "../store/counterStore"

function DashboardPage() {

  const { count, inc } = useStore() as { count: number; inc: () => void }

  return (
    <div>
      <h1 className="text-3xl font-bold">สวัสดี, ยินดีต้อนรับสู่แดชบอร์ด! 👋</h1>
      <p className="mt-4 text-lg">Current count: {count}</p>
      <button onClick={inc} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg">Increment</button>
    </div>
  )
}

export default DashboardPage
