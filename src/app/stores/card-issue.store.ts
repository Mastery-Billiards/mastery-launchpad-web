import { create } from 'zustand'

interface cardIssueErrorState {
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

export const useCardIssueError = create<cardIssueErrorState>((set) => ({
  error: null,
  setError: (value) => set({ error: value }),
}))
