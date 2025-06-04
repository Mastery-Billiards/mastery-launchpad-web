import { Stack, styled } from '@mui/material'

export const LeftSideContainer = styled(Stack)(({ theme }) => ({
  width: '100%',
  height: 'auto',
  minHeight: '100%',
  position: 'relative',
  backgroundImage: 'url("/login-img.png")',
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  flexBasis: '0%',
  [theme.breakpoints.up('md')]: {
    flexBasis: '60%',
  },
  justifyContent: 'center',
  alignItems: 'center',
}))
