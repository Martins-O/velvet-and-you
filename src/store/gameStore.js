import { create } from 'zustand'

const initial = {
  activeGame: null,
  intensity: 'romantic',
  currentTurn: 0,
  turnCount: 0,
  scores: [0, 0],
  deck: [],
  usedIndices: [],
  timerEnabled: false,
  timerDuration: 60,
  soundEnabled: false,
  scoringEnabled: true,
}

const useGameStore = create((set, get) => ({
  ...initial,

  setActiveGame: (gameId) => set({ activeGame: gameId }),

  setIntensity: (level) =>
    set({ intensity: level, deck: [], usedIndices: [] }),

  setCurrentTurn: (index) => set({ currentTurn: index }),

  setScores: (arr) => set({ scores: arr }),

  setDeck: (arr) => set({ deck: arr }),

  setCustomDeck: (arr) => set({ deck: arr, usedIndices: [] }),

  drawCard: () => {
    const { deck, usedIndices } = get()
    const available = deck
      .map((card, i) => ({ card, i }))
      .filter(({ i }) => !usedIndices.includes(i))

    if (available.length === 0) {
      const firstCard = deck[0]
      set({ usedIndices: [] })
      return { card: firstCard, reshuffled: true }
    }

    const randomIndex = Math.floor(Math.random() * available.length)
    const { card, i } = available[randomIndex]
    set({ usedIndices: [...usedIndices, i] })
    return { card, reshuffled: false }
  },

  advanceTurn: () =>
    set((state) => ({
      currentTurn: state.currentTurn === 0 ? 1 : 0,
      turnCount: state.turnCount + 1,
    })),

  addScore: (playerIndex, points) =>
    set((state) => {
      const newScores = [...state.scores]
      newScores[playerIndex] = (newScores[playerIndex] || 0) + points
      return { scores: newScores }
    }),

  resetScores: () => set({ scores: [0, 0] }),

  resetSession: () => set({ ...initial }),

  setTimerEnabled: (bool) => set({ timerEnabled: bool }),

  setTimerDuration: (seconds) => set({ timerDuration: seconds }),

  setSoundEnabled: (bool) => set({ soundEnabled: bool }),

  setScoringEnabled: (bool) => set({ scoringEnabled: bool }),
}))

export default useGameStore
