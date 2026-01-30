import express from 'express'
import { nanoid } from 'nanoid'
import Room from '../models/Room.js'

const router = express.Router()

router.post('/create', async (req, res) => {
  const { playerName } = req.body
  if (!playerName) {
    return res.status(400).json({ error: 'playerName required' })
  }

  const roomCode = nanoid(6).toUpperCase()
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000)

  const room = await Room.create({
    roomCode,
    playerNames: [playerName, null],
    createdAt: new Date(),
  })

  const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173'
  const inviteUrl = `${CLIENT_ORIGIN}/room/${roomCode}`

  res.json({
    roomCode,
    inviteUrl,
    expiresAt: expiresAt.getTime(),
  })
})

router.get('/:code', async (req, res) => {
  const room = await Room.findOne({ roomCode: req.params.code })

  if (!room) {
    return res.json({ valid: false, expired: false, full: false })
  }

  if (room.status === 'expired') {
    return res.json({ valid: false, expired: true, full: false })
  }

  res.json({
    valid: true,
    expired: false,
    full: room.partnerSocketId !== null && room.status !== 'active',
    status: room.status,
  })
})

export default router
