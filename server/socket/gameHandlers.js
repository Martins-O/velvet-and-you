import Room from '../models/Room.js'

export default function setupGameHandlers(io) {
  io.on('connection', (socket) => {
    socket.on('game:draw-card', ({ roomCode, card, turn, scores }) => {
      socket.to(roomCode).emit('game:card-drawn', { card, turn, scores })
    })

    socket.on('game:advance-turn', ({ roomCode, currentTurn }) => {
      socket.to(roomCode).emit('game:turn-changed', { currentTurn })
    })

    socket.on('game:score-update', ({ roomCode, scores }) => {
      socket.to(roomCode).emit('game:score-updated', { scores })
    })

    socket.on('game:card-skipped', ({ roomCode, card, turn, scores }) => {
      socket.to(roomCode).emit('game:card-skipped', { card, turn, scores })
    })

    socket.on('game:card-favourited', ({ roomCode, card }) => {
      socket.to(roomCode).emit('game:card-favourited', { card })
    })

    socket.on('game:intensity-changed', ({ roomCode, intensity }) => {
      socket.to(roomCode).emit('game:intensity-changed', { intensity })
    })

    socket.on('game:deck-reset', ({ roomCode }) => {
      socket.to(roomCode).emit('game:deck-reset', {})
    })

    socket.on('game:timer-expired', ({ roomCode, turn, scores }) => {
      socket.to(roomCode).emit('game:timer-expired', { turn, scores })
    })

    socket.on('game:ended', async ({ roomCode, scores, summary }) => {
      await Room.updateOne({ roomCode }, { status: 'ended' })
      socket.to(roomCode).emit('game:ended', { scores, summary })
    })
  })
}
