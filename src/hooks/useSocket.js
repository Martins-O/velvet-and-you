import { useEffect, useCallback } from 'react'
import { io } from 'socket.io-client'
import { useNavigate } from 'react-router-dom'
import useRoomStore from '../store/roomStore'
import useGameStore from '../store/gameStore'
import useSessionStore from '../store/sessionStore'
import { useToast } from '../components/ui/useToast'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000'

const socket = io(SOCKET_URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 10000,
})

export { socket }

export default function useSocket(roomCode) {
  const navigate = useNavigate()
  const { addToast } = useToast()

  const setConnectionState = useRoomStore((s) => s.setConnectionState)
  const setPartnerConnected = useRoomStore((s) => s.setPartnerConnected)
  const setSyncedState = useRoomStore((s) => s.setSyncedState)
  const isHost = useRoomStore((s) => s.isHost)

  const setActiveGame = useGameStore((s) => s.setActiveGame)
  const setIntensity = useGameStore((s) => s.setIntensity)
  const setCurrentTurn = useGameStore((s) => s.setCurrentTurn)
  const setScores = useGameStore((s) => s.setScores)
  const addScore = useGameStore((s) => s.addScore)
  const advanceTurn = useGameStore((s) => s.advanceTurn)

  const playerNames = useSessionStore((s) => s.playerNames)

  useEffect(() => {
    if (!roomCode) {
      if (socket.connected) {
        socket.disconnect()
      }
      setConnectionState('idle')
      return
    }

    const onConnect = () => setConnectionState('connected')

    const onDisconnect = () => setConnectionState('disconnected')

    const onReconnecting = () => setConnectionState('reconnecting')

    const onReconnect = () => {
      setConnectionState('connected')
      const nameIndex = isHost ? 0 : 1
      socket.emit('rejoin-room', {
        roomCode,
        playerName: playerNames[nameIndex] || `Player ${nameIndex + 1}`,
      }, (res) => {
        if (res && !res.error) {
          setSyncedState(res.gameState || res)
        }
      })
    }

    const onConnectError = () => setConnectionState('disconnected')

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)
    socket.on('reconnect_attempt', onReconnecting)
    socket.on('reconnect', onReconnect)
    socket.on('connect_error', onConnectError)

    socket.on('player:joined', (data) => {
      setPartnerConnected(true)
      addToast(`${data.playerNames?.[1] || 'Partner'} joined`)
    })

    socket.on('room:ready', (data) => {
      setSyncedState({
        playerNames: data.playerNames,
        gameId: data.gameId,
        intensity: data.intensity,
      })
    })

    socket.on('partner:left', () => {
      setPartnerConnected(false)
      addToast('Partner left the room')
    })

    socket.on('game:state-restored', (gameState) => {
      setSyncedState(gameState)
    })

    socket.on('game:started', (data) => {
      setActiveGame(data.gameId)
      setIntensity(data.intensity)
      navigate(`/games/${data.gameId}`)
    })

    socket.on('game:card-drawn', (data) => {
      setSyncedState((prev) => ({ ...prev, card: data.card, turn: data.turn, scores: data.scores }))
      if (data.scores) setScores(data.scores)
      if (data.turn !== undefined) setCurrentTurn(data.turn)
    })

    socket.on('game:turn-changed', ({ currentTurn }) => {
      setCurrentTurn(currentTurn)
    })

    socket.on('game:score-updated', ({ scores }) => {
      setScores(scores)
    })

    socket.on('game:card-skipped', (data) => {
      setSyncedState((prev) => ({ ...prev, ...data }))
      if (data.scores) setScores(data.scores)
      if (data.turn !== undefined) setCurrentTurn(data.turn)
    })

    socket.on('game:intensity-changed', ({ intensity }) => {
      setIntensity(intensity)
    })

    socket.on('game:deck-reset', () => {
      addToast('Deck reshuffled')
    })

    socket.on('game:timer-expired', ({ turn, scores }) => {
      setScores(scores)
      addScore(turn === 0 ? 0 : 1, 0)
      advanceTurn()
      addToast("Time's up!")
    })

    socket.on('game:ended', ({ scores, summary }) => {
      setSyncedState((prev) => ({ ...prev, ended: true, scores, summary }))
    })

    socket.connect()

    return () => {
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
      socket.off('reconnect_attempt', onReconnecting)
      socket.off('reconnect', onReconnect)
      socket.off('connect_error', onConnectError)
      socket.off('player:joined')
      socket.off('room:ready')
      socket.off('partner:left')
      socket.off('game:state-restored')
      socket.off('game:started')
      socket.off('game:card-drawn')
      socket.off('game:turn-changed')
      socket.off('game:score-updated')
      socket.off('game:card-skipped')
      socket.off('game:intensity-changed')
      socket.off('game:deck-reset')
      socket.off('game:timer-expired')
      socket.off('game:ended')

      if (!roomCode) {
        socket.disconnect()
      }
    }
  }, [roomCode])

  const joinRoom = useCallback((playerName) => {
    socket.emit('join-room', { roomCode, playerName })
  }, [roomCode])

  const leaveRoom = useCallback(() => {
    socket.emit('leave-room', { roomCode })
  }, [roomCode])

  const startGame = useCallback((gameId, intensity) => {
    socket.emit('host:start', { roomCode, gameId, intensity })
  }, [roomCode])

  const emitCardDrawn = useCallback((card, turn, scores) => {
    socket.emit('game:draw-card', { roomCode, card, turn, scores })
  }, [roomCode])

  const emitCardSkipped = useCallback((card, turn, scores) => {
    socket.emit('game:card-skipped', { roomCode, card, turn, scores })
  }, [roomCode])

  const emitCardFavourited = useCallback((card) => {
    socket.emit('game:card-favourited', { roomCode, card })
  }, [roomCode])

  const emitIntensityChanged = useCallback((intensity) => {
    socket.emit('game:intensity-changed', { roomCode, intensity })
  }, [roomCode])

  const emitDeckReset = useCallback(() => {
    socket.emit('game:deck-reset', { roomCode })
  }, [roomCode])

  const emitTimerExpired = useCallback((turn, scores) => {
    socket.emit('game:timer-expired', { roomCode, turn, scores })
  }, [roomCode])

  const emitGameEnded = useCallback((scores, summary) => {
    socket.emit('game:ended', { roomCode, scores, summary })
  }, [roomCode])

  return {
    joinRoom,
    leaveRoom,
    startGame,
    emitCardDrawn,
    emitCardSkipped,
    emitCardFavourited,
    emitIntensityChanged,
    emitDeckReset,
    emitTimerExpired,
    emitGameEnded,
  }
}
