import { create } from 'zustand'

let _nextId = 1

const initial = {
  playerNames: ['Player 1', 'Player 2'],
  history: [],
  sessionActive: false,
}

const useSessionStore = create((set) => ({
  ...initial,

  setPlayerNames: (names) => set({ playerNames: names }),

  setPlayerName: (index, name) =>
    set((state) => {
      const newNames = [...state.playerNames]
      newNames[index] = name
      return { playerNames: newNames }
    }),

  addToHistory: (entry) => {
    const id = _nextId++
    set((state) => ({
      history: [{ id, ...entry }, ...state.history],
    }))
    return id
  },

  updateHistoryEntry: (id, updates) =>
    set((state) => ({
      history: state.history.map((e) =>
        e.id === id ? { ...e, ...updates } : e
      ),
    })),

  clearHistory: () => set({ history: [] }),

  startSession: () => set({ sessionActive: true }),

  endSession: () => set({ sessionActive: false }),
}))

export default useSessionStore
