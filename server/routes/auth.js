import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { verifyToken } from '../middleware/auth.js'

const router = express.Router()

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const SALT_ROUNDS = 12
const JWT_SECRET = process.env.JWT_SECRET || 'change_me_in_production'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

function signToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

router.post('/register', async (req, res) => {
  try {
    const { email, password, playerNames } = req.body

    if (!email || !EMAIL_RE.test(email)) {
      return res.status(400).json({ message: 'A valid email address is required.' })
    }
    if (!password || password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters.' })
    }
    if (!Array.isArray(playerNames) || playerNames.length !== 2 || !playerNames[0]?.trim()) {
      return res.status(400).json({ message: 'Two player names are required.' })
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)

    const user = await User.create({
      email: email.toLowerCase().trim(),
      passwordHash,
      playerNames: playerNames.map((n) => (n || '').trim() || 'Player').slice(0, 2),
    })

    const token = signToken(user._id)

    res.status(201).json({ token })
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'An account with this email already exists.' })
    }
    res.status(500).json({ message: 'Registration failed.' })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' })
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() })
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' })
    }

    const match = await bcrypt.compare(password, user.passwordHash)
    if (!match) {
      return res.status(401).json({ message: 'Invalid email or password.' })
    }

    const token = signToken(user._id)

    res.json({
      token,
      userId: user._id,
      email: user.email,
      coupleAlias: user.coupleAlias,
      playerNames: user.playerNames,
    })
  } catch {
    res.status(500).json({ message: 'Login failed.' })
  }
})

router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-passwordHash')
    if (!user) {
      return res.status(404).json({ message: 'User not found.' })
    }
    res.json({
      userId: user._id,
      email: user.email,
      coupleAlias: user.coupleAlias,
      playerNames: user.playerNames,
      totalGamesPlayed: user.totalGamesPlayed,
      createdAt: user.createdAt,
    })
  } catch {
    res.status(500).json({ message: 'Failed to fetch user.' })
  }
})

export default router
