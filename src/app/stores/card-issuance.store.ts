import { create } from 'zustand'

interface cardIssuanceErrorState {
  error: {
    status: number
    res: { string: { string: string } }
  } | null
  setError: (
    value: {
      status: number
      res: { string: { string: string } }
    } | null
  ) => void
}

export const useCardIssuanceError = create<cardIssuanceErrorState>((set) => ({
  error: null,
  setError: (value) => set({ error: value }),
}))
