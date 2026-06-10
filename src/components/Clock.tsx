import { useState, useEffect } from 'react'

function Clock() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    // Side Effect: ตั้ง interval อัปเดตเวลาทุกวินาที
    const timer = setInterval(() => setNow(new Date()), 1000)

    // Cleanup: ต้องเคลียร์ interval เมื่อ component ถูกถอด
    // ไม่งั้นจะเกิด memory leak
    return () => clearInterval(timer)
  }, [])   // [] = ทำงานครั้งเดียวตอน mount

  return (
    <span className="text-sm tabular-nums text-muted-foreground">
      {now.toLocaleTimeString('th-TH')}
    </span>
  )
}

export default Clock