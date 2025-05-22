import { create } from 'zustand'

interface authErrorState {
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

interface userIndoState {
  info: {
    name: string
    role: string
    expiresIn: number
  } | null
  setInfo: (
    value: {
      name: string
      role: string
      expiresIn: number
    } | null
  ) => void
}

export const useAuthError = create<authErrorState>((set) => ({
  error: null,
  setError: (value) => set({ error: value }),
}))

export const useUserInfo = create<userIndoState>((set) => ({
  info: null,
  setInfo: (value) => set({ info: value }),
}))
