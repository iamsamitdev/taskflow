import 'dotenv/config'
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import auth from './routes/auth.js'
import tasks from './routes/tasks.js'

const app = new Hono()

// Health check
app.get('/', (c) => c.json({ name: 'TaskFlow API', status: 'ok' }))

// รวม routes
app.route('/api/auth', auth)
app.route('/api/tasks', tasks)

const port = Number(process.env.PORT ?? 3000)

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`🚀 TaskFlow API พร้อมใช้งานที่ http://localhost:${info.port}`)
})