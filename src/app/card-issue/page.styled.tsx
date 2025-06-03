import { styled } from '@mui/material'

export const Container = styled('pre')(({ theme }) => ({
  backgroundColor: '#f5f5f5',
  padding: 10,
  borderRadius: 5,
  overflow: 'auto',
  minHeight: '100%',
  maxHeight: '100%',
  [theme.breakpoints.up('md')]: {
    minHeight: '52.5vh',
    maxHeight: '52.5vh',
  },
  '.string': { color: 'green' },
  '.number': { color: 'darkorange' },
  '.boolean': { color: 'blue' },
  '.null': { color: 'magenta' },
  '.key': { color: 'red' },
}))
