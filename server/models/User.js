import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  coupleAlias: {
    type: String,
    default: '',
  },
  playerNames: {
    type: [String],
    default: ['Player 1', 'Player 2'],
  },
  favourites: {
    type: Array,
    default: [],
  },
  history: {
    type: Array,
    default: [],
  },
  totalGamesPlayed: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.model('User', userSchema)
