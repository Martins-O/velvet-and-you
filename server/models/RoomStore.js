const rooms = new Map()

const TTL = 30 * 60 * 1000
const CODE_LENGTH = 6
const DISCONNECT_TIMEOUT = 60 * 1000

function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < CODE_LENGTH; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return code
}

function createRoom(hostSocketId, playerName) {
  let roomCode
  do {
    roomCode = generateCode()
  } while (rooms.has(roomCode))

  const room = {
    roomCode,
    hostSocketId,
    partnerSocketId: null,
    playerNames: [playerName, null],
    gameId: null,
    intensity: 'romantic',
    status: 'waiting',
    gameState: {
      currentTurn: 0,
      turnCount: 0,
      scores: [0, 0],
      deck: [],
      usedIndices: [],
    },
    createdAt: Date.now(),
    ttlTimer: null,
  }

  startTTL(room)
  rooms.set(roomCode, room)
  return room
}

function startTTL(room) {
  if (room.ttlTimer) clearTimeout(room.ttlTimer)
  room.ttlTimer = setTimeout(() => {
    if (room.status === 'waiting' || room.status === 'expired') {
      rooms.delete(room.roomCode)
    }
  }, TTL)
}

function getRoom(roomCode) {
  return rooms.get(roomCode) || null
}

function joinRoom(roomCode, socketId, playerName) {
  const room = rooms.get(roomCode)
  if (!room) return { error: 'Room not found' }
  if (room.status === 'expired') return { error: 'Room expired' }
  if (room.status === 'active' || room.status === 'ended') return { error: 'Game already in progress' }
  if (room.partnerSocketId) return { error: 'Room is full' }

  room.partnerSocketId = socketId
  room.playerNames[1] = playerName
  room.status = 'lobby'

  if (room.ttlTimer) {
    clearTimeout(room.ttlTimer)
    room.ttlTimer = null
  }

  return { room, error: null }
}

function leaveRoom(roomCode, socketId) {
  const room = rooms.get(roomCode)
  if (!room) return

  if (room.hostSocketId === socketId) {
    room.status = 'expired'
    if (room.ttlTimer) clearTimeout(room.ttlTimer)
    room.ttlTimer = setTimeout(() => rooms.delete(roomCode), 5000)
    return { hostLeft: true }
  }

  if (room.partnerSocketId === socketId) {
    room.partnerSocketId = null
    room.playerNames[1] = null
    room.status = 'waiting'
    return { partnerLeft: true }
  }

  return {}
}

function rejoinRoom(roomCode, socketId, playerName) {
  const room = rooms.get(roomCode)
  if (!room) return { error: 'Room not found' }

  if (room.hostSocketId === null) {
    room.hostSocketId = socketId
  } else if (room.partnerSocketId === null) {
    room.partnerSocketId = socketId
  }

  return { room, error: null }
}

function startGame(roomCode, gameId, intensity) {
  const room = rooms.get(roomCode)
  if (!room) return null

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

  return room
}

function endGame(roomCode) {
  const room = rooms.get(roomCode)
  if (!room) return null

  room.status = 'ended'
  setTimeout(() => rooms.delete(roomCode), 5 * 60 * 1000)
  return room
}

function deleteRoom(roomCode) {
  rooms.delete(roomCode)
}

export {
  createRoom,
  getRoom,
  joinRoom,
  leaveRoom,
  rejoinRoom,
  startGame,
  endGame,
  deleteRoom,
  DISCONNECT_TIMEOUT,
}
