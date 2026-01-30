import express from 'express'
import User from '../models/User.js'
import { verifyToken } from '../middleware/auth.js'

const router = express.Router()

router.use(verifyToken)

router.get('/', async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-passwordHash')
    if (!user) {
      return res.status(404).json({ message: 'User not found.' })
    }
    res.json(user)
  } catch {
    res.status(500).json({ message: 'Failed to fetch profile.' })
  }
})

router.patch('/', async (req, res) => {
  try {
    const { coupleAlias, playerNames } = req.body
    const updates = {}

    if (coupleAlias !== undefined) updates.coupleAlias = coupleAlias
    if (playerNames !== undefined) {
      if (!Array.isArray(playerNames) || playerNames.length !== 2) {
        return res.status(400).json({ message: 'Player names must be an array of two strings.' })
      }
      updates.playerNames = playerNames.map((n) => (n || '').trim() || 'Player')
    }

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $set: updates },
      { new: true, runValidators: true },
    ).select('-passwordHash')

    if (!user) {
      return res.status(404).json({ message: 'User not found.' })
    }

    res.json(user)
  } catch {
    res.status(500).json({ message: 'Failed to update profile.' })
  }
})

router.post('/sync', async (req, res) => {
  try {
    const { favourites, history } = req.body
    const updates = {}

    if (favourites !== undefined) updates.favourites = favourites
    if (history !== undefined) updates.history = history

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      {
        $set: updates,
        $inc: { totalGamesPlayed: history ? 1 : 0 },
      },
      { new: true, runValidators: true },
    ).select('-passwordHash')

    if (!user) {
      return res.status(404).json({ message: 'User not found.' })
    }

    res.json({ synced: true })
  } catch {
    res.status(500).json({ message: 'Failed to sync data.' })
  }
})

export default router
