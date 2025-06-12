import { ThemeOptions } from '@mui/material'
import { MuiButtonComponent } from './mui-button.component'

const components: ThemeOptions['components'] = {
  MuiButton: MuiButtonComponent,
  // MuiCssBaseline: {
  //   styleOverrides: {
  //     body: {
  //       '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
  //         width: 0,
  //       },
  //       '&::-webkit-scrollbar-track, *::-webkit-scrollbar-track': {
  //         backgroundColor: 'transparent',
  //       },
  //     },
  //   },
  // },
}

export default components
