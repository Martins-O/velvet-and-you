import { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import PageWrapper from '../components/layout/PageWrapper'
import Button from '../components/ui/Button'
import TurnIndicator from '../components/shared/TurnIndicator'
import ScoreBoard from '../components/shared/ScoreBoard'
import IntensitySelector from '../components/shared/IntensitySelector'
import CardDisplay from '../components/shared/CardDisplay'
import TimerBar from '../components/shared/TimerBar'
import SessionSummary from '../components/shared/SessionSummary'
import GameSettingsPanel from '../components/games/GameSettingsPanel'
import HandOffScreen from '../components/multiplayer/HandOffScreen'
import SpinBottle from '../components/games/SpinBottle'
import ConnectionStatus from '../components/multiplayer/ConnectionStatus'
import PartnerDisconnectedScreen from '../components/multiplayer/PartnerDisconnectedScreen'
import useGameStore from '../store/gameStore'
import useSessionStore from '../store/sessionStore'
import useRoomStore from '../store/roomStore'
import { buildDeck } from '../utils/deck'
import { calculatePoints, POINTS } from '../utils/scoring'
import { useToast } from '../components/ui/useToast'
import { useSound } from '../hooks/useSound'
import useSocket from '../hooks/useSocket'
import { socket } from '../hooks/useSocket'

function GamePlay() {
  const { gameId } = useParams()
  const navigate = useNavigate()

  const [currentCard, setCurrentCard] = useState(null)
  const [isRevealed, setIsRevealed] = useState(false)
  const [showHandOff, setShowHandOff] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showSummary, setShowSummary] = useState(false)
  const [skipCount, setSkipCount] = useState(0)
  const [currentHistoryId, setCurrentHistoryId] = useState(null)
  const [showDisconnectOverlay, setShowDisconnectOverlay] = useState(false)
  const [disconnectCountdown, setDisconnectCountdown] = useState(60)

  const activeGame = useGameStore((s) => s.activeGame)
  const intensity = useGameStore((s) => s.intensity)
  const currentTurn = useGameStore((s) => s.currentTurn)
  const scoringEnabled = useGameStore((s) => s.scoringEnabled)
  const timerEnabled = useGameStore((s) => s.timerEnabled)
  const setActiveGame = useGameStore((s) => s.setActiveGame)
  const setIntensity = useGameStore((s) => s.setIntensity)
  const setDeck = useGameStore((s) => s.setDeck)
  const drawCard = useGameStore((s) => s.drawCard)
  const advanceTurn = useGameStore((s) => s.advanceTurn)
  const addScore = useGameStore((s) => s.addScore)
  const resetSession = useGameStore((s) => s.resetSession)
  const setScores = useGameStore((s) => s.setScores)

  const playerNames = useSessionStore((s) => s.playerNames)
  const addToHistory = useSessionStore((s) => s.addToHistory)
  const updateHistoryEntry = useSessionStore((s) => s.updateHistoryEntry)
  const startSession = useSessionStore((s) => s.startSession)
  const endSession = useSessionStore((s) => s.endSession)
  const clearHistory = useSessionStore((s) => s.clearHistory)

  const mode = useRoomStore((s) => s.mode)
  const isHost = useRoomStore((s) => s.isHost)
  const roomCode = useRoomStore((s) => s.roomCode)
  const syncedState = useRoomStore((s) => s.syncedState)
  const connectionState = useRoomStore((s) => s.connectionState)
  const partnerConnected = useRoomStore((s) => s.partnerConnected)

  const { emitCardDrawn, emitCardSkipped, emitCardFavourited, emitIntensityChanged, emitTimerExpired, emitGameEnded } = useSocket(roomCode)

  const { addToast } = useToast()
  const { play } = useSound()

  const isSolo = mode === 'solo'
  const isOnline = mode === 'online'
  const isPassAndPlay = mode === 'pass-and-play'

  const wasConnected = useRef(false)

  useEffect(() => {
    setActiveGame(gameId)
    startSession()
    ;(async () => {
      const deck = await buildDeck(gameId, intensity)
      setDeck(deck)
    })()
  }, [gameId])

  useEffect(() => {
    if (partnerConnected) wasConnected.current = true
    if (isOnline && wasConnected.current && !partnerConnected) {
      setShowDisconnectOverlay(true)
      setDisconnectCountdown(60)
    }
    if (partnerConnected && showDisconnectOverlay) {
      setShowDisconnectOverlay(false)
    }
  }, [isOnline, partnerConnected])

  useEffect(() => {
    if (!showDisconnectOverlay) return
    const interval = setInterval(() => {
      setDisconnectCountdown((prev) => Math.max(0, prev - 1))
    }, 1000)
    return () => clearInterval(interval)
  }, [showDisconnectOverlay])

  useEffect(() => {
    if (syncedState?.ended && isOnline && !isHost) {
      setShowSummary(true)
      if (syncedState.scores) {
        setScores(syncedState.scores)
      }
    }
  }, [syncedState?.ended, isOnline, isHost])

  const handleIntensityChange = useCallback(async (level) => {
    setIntensity(level)
    const deck = await buildDeck(gameId, level)
    setDeck(deck)
    if (isOnline && isHost) {
      emitIntensityChanged(level)
    }
  }, [gameId, isOnline, isHost, emitIntensityChanged])

  const drawNextCard = useCallback(() => {
    const { card } = drawCard()
    const cardText = typeof card === 'string' ? card : card.text
    const id = addToHistory({
      game: activeGame,
      intensity,
      text: cardText,
      playerIndex: currentTurn,
      result: 'drawn',
    })
    setCurrentCard(card)
    setCurrentHistoryId(id)
    play('card_flip')

    if (isSolo) {
      setIsRevealed(true)
    } else if (isOnline && isHost) {
      advanceTurn()
      setIsRevealed(true)
      const state = useGameStore.getState()
      emitCardDrawn(card, state.currentTurn, state.scores)
    } else if (isPassAndPlay) {
      advanceTurn()
      setShowHandOff(true)
      setIsRevealed(false)
    }
  }, [drawCard, addToHistory, activeGame, intensity, currentTurn, isSolo, isOnline, isHost, isPassAndPlay, advanceTurn, play, emitCardDrawn])

  const handleDraw = () => {
    if (currentHistoryId !== null) return
    if (isOnline && (!isHost || currentTurn !== 0)) return
    drawNextCard()
  }

  const handleMarkComplete = () => {
    if (!currentCard || currentHistoryId === null) return

    const playerIdx = isSolo ? 0 : currentTurn
    updateHistoryEntry(currentHistoryId, { result: 'completed' })
    if (scoringEnabled) {
      addScore(playerIdx, calculatePoints('complete', activeGame))
      play('score_point')
    }
    setCurrentHistoryId(null)

    if (isOnline && isHost) {
      advanceTurn()
      const { scores } = useGameStore.getState()
      socket.emit('game:score-update', { roomCode, scores })
    }
  }

  const handleSkip = () => {
    if (!currentCard || currentHistoryId === null) return

    const playerIdx = isSolo ? 0 : currentTurn
    updateHistoryEntry(currentHistoryId, { result: 'skipped' })
    setCurrentHistoryId(null)

    if (skipCount === 0) {
      addToast('No worries \u2014 moving on.')
    } else {
      if (scoringEnabled) {
        addScore(playerIdx, POINTS.SKIP)
        play('score_point')
      }
      addToast('-5 pts')
    }
    setSkipCount((prev) => prev + 1)

    if (isOnline && isHost) {
      advanceTurn()
      const state = useGameStore.getState()
      emitCardSkipped(currentCard, state.currentTurn, state.scores)
      drawNextCard()
    } else {
      advanceTurn()
      drawNextCard()
    }
  }

  const handleTimerExpire = useCallback(() => {
    if (!currentCard || currentHistoryId === null) return
    play('timer_expire')

    const playerIdx = isSolo ? 0 : currentTurn
    updateHistoryEntry(currentHistoryId, { result: 'skipped', note: 'timer' })
    setCurrentHistoryId(null)

    if (scoringEnabled) {
      addScore(playerIdx, POINTS.SKIP)
    }

    if (mode !== 'solo') advanceTurn()

    const { card } = drawCard()
    const cardText = typeof card === 'string' ? card : card.text
    const id = addToHistory({
      game: activeGame,
      intensity,
      text: cardText,
      playerIndex: isSolo ? 0 : currentTurn,
      result: 'drawn',
    })
    setCurrentCard(card)
    setCurrentHistoryId(id)

    if (isSolo) {
      setIsRevealed(true)
    } else if (isOnline && isHost) {
      advanceTurn()
      setIsRevealed(true)
      const state = useGameStore.getState()
      emitCardDrawn(card, state.currentTurn, state.scores)
    } else {
      setShowHandOff(true)
      setIsRevealed(false)
    }
  }, [currentCard, currentHistoryId, isSolo, currentTurn, scoringEnabled,
      mode, activeGame, intensity, drawCard, addToHistory, updateHistoryEntry, addScore, advanceTurn,
      isOnline, isHost, play, emitCardDrawn])

  const handleHandOffConfirm = () => {
    setShowHandOff(false)
    setIsRevealed(true)
  }

  const handleEndSession = () => {
    endSession()
    setShowSummary(true)
    if (isOnline && isHost) {
      const { scores } = useGameStore.getState()
      emitGameEnded(scores, {})
    }
  }

  const handlePlayAgain = () => {
    resetSession()
    clearHistory()
    setShowSummary(false)
    navigate('/games')
  }

  const handleViewHistory = () => {
    setShowSummary(false)
    navigate('/history')
  }

  const handleGoHome = () => {
    setShowSummary(false)
    navigate('/')
  }

  const handleFavourite = (cardText, saved) => {
    if (isOnline && isHost && saved) {
      emitCardFavourited(cardText)
    }
  }

  const displayCard = isOnline && !isHost ? syncedState?.card : currentCard
  const displayRevealed = isOnline && !isHost ? true : isRevealed

  const canAct = displayCard && displayRevealed && currentHistoryId !== null
  const nextPlayer = isSolo ? '' : playerNames[currentTurn]

  const hostName = syncedState?.playerNames?.[0] || playerNames[0] || 'Host'
  const waitingLabel = isOnline && !isHost
    ? `Waiting for ${hostName}\u2026`
    : isOnline && isHost && currentTurn !== 0
      ? 'Waiting for partner\u2026'
      : 'Draw Card'

  const displayTitle = activeGame
    ? activeGame.charAt(0).toUpperCase() + activeGame.slice(1).replace(/-/g, ' ')
    : ''

  return (
    <PageWrapper>
      <div className="gameplay-container" style={{ maxWidth: '760px', margin: '0 auto', padding: '2rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.5rem',
            position: 'relative',
          }}
        >
          <button
            onClick={() => navigate('/games')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-dim)',
              fontSize: '0.85rem',
              cursor: 'pointer',
              letterSpacing: '0.05em',
            }}
          >
            &larr; Games
          </button>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.6rem',
              color: 'var(--ivory)',
              margin: 0,
            }}
          >
            {displayTitle}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {isOnline && <ConnectionStatus state={connectionState} />}
            <button
              onClick={() => setShowSettings(true)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-dim)',
                fontSize: '1.2rem',
                cursor: 'pointer',
              }}
            >
              &#9881;
            </button>
          </div>
        </div>

        {!isSolo && <TurnIndicator />}
        {scoringEnabled && <ScoreBoard />}

        {gameId !== 'bottle' && (
          <IntensitySelector
            value={intensity}
            onChange={isOnline && !isHost ? () => {} : handleIntensityChange}
          />
        )}

        {gameId === 'bottle' ? (
          <SpinBottle />
        ) : (
          <>
            <CardDisplay
              key={displayCard}
              card={displayCard}
              isRevealed={displayRevealed}
              gameId={activeGame}
              intensity={intensity}
              onFavourite={handleFavourite}
            />

            <div
              className="gameplay-actions"
              style={{
                display: 'flex',
                gap: '0.75rem',
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}
            >
              {isOnline && !isHost ? (
                <Button
                  disabled
                  style={{ opacity: 0.4, cursor: 'not-allowed' }}
                  title={waitingLabel}
                >
                  {waitingLabel}
                </Button>
              ) : (
                <Button
                  onClick={handleDraw}
                  disabled={
                    showHandOff ||
                    (currentCard && !isRevealed) ||
                    currentHistoryId !== null ||
                    (isOnline && isHost && currentTurn !== 0)
                  }
                  title={
                    isOnline && isHost && currentTurn !== 0
                      ? waitingLabel
                      : undefined
                  }
                >
                  {isOnline && isHost && currentTurn !== 0
                    ? waitingLabel
                    : 'Draw Card'}
                </Button>
              )}

              {(isOnline && !isHost) ? (
                <Button
                  variant="ghost"
                  disabled
                  style={{ opacity: 0.4, cursor: 'not-allowed' }}
                >
                  Mark Complete
                </Button>
              ) : (
                canAct && (
                  <Button variant="ghost" onClick={handleMarkComplete}>
                    Mark Complete
                  </Button>
                )
              )}

              {(isOnline && !isHost) ? (
                <Button
                  variant="ghost"
                  disabled
                  style={{ opacity: 0.4, cursor: 'not-allowed' }}
                >
                  Skip
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  onClick={handleSkip}
                  disabled={!canAct}
                >
                  Skip
                </Button>
              )}

              {(isOnline && !isHost) ? (
                <Button
                  variant="ghost"
                  disabled
                  style={{ opacity: 0.4, cursor: 'not-allowed' }}
                >
                  End Session
                </Button>
              ) : (
                <Button variant="ghost" onClick={handleEndSession}>
                  End Session
                </Button>
              )}
            </div>
          </>
        )}

        {timerEnabled && (
          <TimerBar key={currentHistoryId} onExpire={handleTimerExpire} />
        )}

        {showHandOff && (
          <HandOffScreen playerName={nextPlayer} onConfirm={handleHandOffConfirm} />
        )}

        {showSettings && (
          <GameSettingsPanel onClose={() => setShowSettings(false)} />
        )}

        {showSummary && (
          <SessionSummary
            isOpen={showSummary}
            onPlayAgain={handlePlayAgain}
            onViewHistory={handleViewHistory}
            onGoHome={handleGoHome}
          />
        )}

        {showDisconnectOverlay && (
          <PartnerDisconnectedScreen
            isOpen={showDisconnectOverlay}
            countdown={disconnectCountdown}
            onWait={() => setShowDisconnectOverlay(false)}
            onNewRoom={() => navigate('/games')}
          />
        )}
      </div>
    </PageWrapper>
  )
}

export default GamePlay
