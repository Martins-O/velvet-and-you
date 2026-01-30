import Room from '../models/Room.js'

const DISCONNECT_TIMEOUT =
  parseInt(process.env.ROOM_DISCONNECT_TIMEOUT_SECONDS, 10) * 1000 || 60000

export default function setupRoomHandlers(io) {
  io.on('connection', (socket) => {
    socket.on('create-room', async ({ playerName }, callback) => {
      const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173'

      const roomCode = (await import('nanoid')).nanoid(6).toUpperCase()
      const room = await Room.create({
        roomCode,
        hostSocketId: socket.id,
        playerNames: [playerName, null],
      })

      socket.join(roomCode)
      callback({
        roomCode,
        inviteUrl: `${CLIENT_ORIGIN}/room/${roomCode}`,
      })
    })

    socket.on('join-room', async ({ roomCode, playerName }, callback) => {
      const room = await Room.findOne({ roomCode })

      if (!room || room.status === 'expired') {
        if (typeof callback === 'function') callback({ error: 'ROOM_NOT_FOUND' })
        return
      }

      if (
        room.hostSocketId &&
        room.partnerSocketId &&
        room.hostSocketId !== socket.id &&
        room.partnerSocketId !== socket.id
      ) {
        if (typeof callback === 'function') callback({ error: 'ROOM_FULL' })
        return
      }

      if (!room.hostSocketId) {
        room.hostSocketId = socket.id
        room.playerNames[0] = playerName
      } else if (socket.id === room.hostSocketId) {
        socket.join(roomCode)
        if (typeof callback === 'function') callback({ roomCode })
        return
      } else if (!room.partnerSocketId) {
        room.partnerSocketId = socket.id
        room.playerNames[1] = playerName
        room.status = 'lobby'
      }

      await room.save()

      socket.join(roomCode)

      io.to(roomCode).emit('player:joined', {
        playerNames: room.playerNames,
        isHost: socket.id === room.hostSocketId,
      })

      if (room.status === 'lobby' && room.hostSocketId && room.partnerSocketId) {
        io.to(roomCode).emit('room:ready', {
          playerNames: room.playerNames,
          gameId: room.gameId,
          intensity: room.intensity,
        })
      }

      if (typeof callback === 'function') callback({
        roomCode,
        playerNames: room.playerNames,
        gameId: room.gameId,
        intensity: room.intensity,
        status: room.status,
      })
    })

    socket.on('leave-room', async ({ roomCode }) => {
      const room = await Room.findOne({ roomCode })
      if (!room) return

      const wasHost = socket.id === room.hostSocketId
      const wasPartner = socket.id === room.partnerSocketId

      socket.leave(roomCode)

      if (wasHost) {
        room.status = 'expired'
        await room.save()
        io.to(roomCode).emit('host:left')
      } else if (wasPartner) {
        room.partnerSocketId = null
        room.playerNames[1] = null
        room.status = 'waiting'
        await room.save()
        io.to(roomCode).emit('partner:left')
      }
    })

    socket.on('rejoin-room', async ({ roomCode, playerName }, callback) => {
      const room = await Room.findOne({ roomCode })

      if (!room) {
        callback({ error: 'ROOM_NOT_FOUND' })
        return
      }

      if (!room.hostSocketId || room.hostSocketId === socket.id) {
        room.hostSocketId = socket.id
      } else if (!room.partnerSocketId || room.partnerSocketId === socket.id) {
        room.partnerSocketId = socket.id
      }
      await room.save()

      socket.join(roomCode)
      callback({
        roomCode,
        playerNames: room.playerNames,
        gameId: room.gameId,
        intensity: room.intensity,
        gameState: room.gameState,
        status: room.status,
      })
    })

    socket.on('host:start', async ({ roomCode, gameId, intensity }) => {
      const room = await Room.findOne({ roomCode })
      if (!room) return
      if (socket.id !== room.hostSocketId) return

      room.gameId = gameId
      room.intensity = intensity
      room.status = 'active'
      room.gameState = {
        currentTurn: 0,
        turnCount: 0,
        scores: [0, 0],
        deck: [],
        usedIndices: [],
      }
      await room.save()

      io.to(roomCode).emit('game:started', {
        gameId,
        intensity,
        playerNames: room.playerNames,
      })
    })

    socket.on('disconnecting', async () => {
      for (const roomCode of socket.rooms) {
        if (roomCode === socket.id) continue

        const room = await Room.findOne({ roomCode })
        if (!room) continue

        const wasHost = socket.id === room.hostSocketId
        const wasPartner = socket.id === room.partnerSocketId

        if (wasHost) {
          room.status = 'expired'
          await room.save()
          socket.to(roomCode).emit('host:left')
        } else if (wasPartner) {
          room.partnerSocketId = null
          room.playerNames[1] = null
          room.status = 'waiting'
          await room.save()
          socket.to(roomCode).emit('partner:left')
        }
      }
    })
  })
}

export { DISCONNECT_TIMEOUT }
