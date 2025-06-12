'use client'
import { createTheme } from '@mui/material/styles'
import components from '@/theme/components'
import { createPalette } from '@/theme/palette'

export type ThemeMode = 'light'

const theme = createTheme({
  cssVariables: true,
  palette: createPalette('light'),
  typography: {
    fontFamily: 'var(--font-open-sans)',
  },
  components,
})

export default theme
