import mongoose from 'mongoose'

const roomSchema = new mongoose.Schema({
  roomCode: {
    type: String,
    unique: true,
    index: true,
    required: true,
  },
  hostSocketId: String,
  partnerSocketId: {
    type: String,
    default: null,
  },
  playerNames: {
    type: [String],
    default: ['Player 1', 'Player 2'],
  },
  gameId: {
    type: String,
    default: null,
  },
  intensity: {
    type: String,
    default: 'romantic',
  },
  status: {
    type: String,
    enum: ['waiting', 'lobby', 'active', 'ended', 'expired'],
    default: 'waiting',
  },
  gameState: {
    type: Object,
    default: {},
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 1800,
  },
})

export default mongoose.model('Room', roomSchema)
