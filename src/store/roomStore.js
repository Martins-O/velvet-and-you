import { create } from 'zustand'

const initial = {
  mode: 'solo',
  roomCode: null,
  inviteUrl: null,
  isHost: false,
  connectionState: 'idle',
  partnerConnected: false,
  syncedState: null,
}

const useRoomStore = create((set) => ({
  ...initial,

  setMode: (mode) => set({ mode }),

  setRoom: ({ roomCode, inviteUrl, isHost }) =>
    set({ roomCode, inviteUrl, isHost }),

  setConnectionState: (state) => set({ connectionState: state }),

  setPartnerConnected: (bool) => set({ partnerConnected: bool }),

  setSyncedState: (state) => set({ syncedState: state }),

  resetRoom: () =>
    set({
      roomCode: null,
      inviteUrl: null,
      isHost: false,
      connectionState: 'idle',
      partnerConnected: false,
      syncedState: null,
    }),
}))

export default useRoomStore
