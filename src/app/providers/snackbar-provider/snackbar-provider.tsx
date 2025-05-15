'use client'
import React, {
  createContext,
  ReactNode,
  useCallback, useEffect,
  useMemo,
  useState,
} from 'react'
import { AlertColor, Snackbar, Alert } from '@mui/material'
import { ParentFC } from '@/app/utils/react'

interface SnackMessage {
  id: number
  severity?: AlertColor
  message: ReactNode
  timeout?: number
}

interface SnackbarAction {
  openSnackbar(message: Omit<SnackMessage, 'id'>): number
}

export const SnackbarContext = createContext<SnackbarAction>({
  openSnackbar: () => Number.NaN,
})
SnackbarContext.displayName = 'SnackbarContext'

export const SnackbarProvider: ParentFC = ({ children }) => {
  const [message, setMessage] = useState<null | SnackMessage>(null)

  const openSnackbar = useCallback<SnackbarAction['openSnackbar']>((msg) => {
    const id = Date.now()
    setMessage({
      id,
      ...msg,
    })
    return id
  }, [])

  const value = useMemo(
    () => ({
      openSnackbar,
    }),
    [openSnackbar]
  )

  return (
    <SnackbarContext.Provider value={value}>
      {children}
      <Snackbar
        open={!!message}
        autoHideDuration={message?.timeout || 5000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        onClose={() => setMessage(null)}
      >
        <Alert
          onClose={() => setMessage(null)}
          severity={message?.severity}
          variant="standard"
          sx={{ width: '100%' }}
        >
          {message?.message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  )
}

SnackbarProvider.displayName = 'SnackbarProvider'
