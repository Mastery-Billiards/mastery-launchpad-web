import { PaletteOptions } from '@mui/material'
import { ThemeMode } from '@/theme/theme'

export const colors = {
  textPrimary: '#6E6B7B',
  textSecondary: '#768184',
}

const primary = {
  main: '#febd03',
}

const createSharedOptions = (mode: ThemeMode): PaletteOptions => ({
  mode,
  primary,
})
const createModeOptions = (mode: ThemeMode) => {
  const modeOptions: Record<ThemeMode, Partial<PaletteOptions>> = {
    light: {
      text: {
        primary: colors.textPrimary,
        secondary: colors.textSecondary,
      },
    },
  }
  return modeOptions[mode]
}

export const createPalette = (mode: ThemeMode): PaletteOptions => ({
  ...createSharedOptions(mode),
  ...createModeOptions(mode),
})
