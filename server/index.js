import 'dotenv/config'
import express from 'express'
import { createServer } from 'node:http'
import { Server } from 'socket.io'
import cors from 'cors'
import mongoose from 'mongoose'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import roomsRouter from './routes/rooms.js'
import authRouter from './routes/auth.js'
import profileRouter from './routes/profile.js'
import setupRoomHandlers from './socket/roomHandlers.js'
import setupGameHandlers from './socket/gameHandlers.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PORT = process.env.PORT || 4000
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173'
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/velvet'

const app = express()
app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }))
app.use(express.json())

app.use('/api/auth', authRouter)
app.use('/api/rooms', roomsRouter)
app.use('/api/profile', profileRouter)

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', ts: Date.now() })
})

if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '..', 'dist')
  app.use(express.static(distPath))
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'))
  })
}

const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: CLIENT_ORIGIN,
    methods: ['GET', 'POST'],
    credentials: true,
  },
})

setupRoomHandlers(io)
setupGameHandlers(io)

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB')
    server.listen(PORT, () => {
      console.log(`Velvet server running on http://localhost:${PORT}`)
    })
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message)
  })
