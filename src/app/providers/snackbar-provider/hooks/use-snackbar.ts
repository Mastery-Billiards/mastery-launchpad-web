import { useContext } from 'react'
import { SnackbarContext } from '../snackbar-provider'

export function useSnackbar() {
  const { openSnackbar } = useContext(SnackbarContext)
  return openSnackbar
}
