'use client'
import React, { FunctionComponent, ReactNode } from 'react'
import { Stack, Box, AppBar, Toolbar, Avatar } from '@mui/material'
import Image from 'next/image'

interface DefaultLayoutProps {
  children?: ReactNode
}

const Layout: FunctionComponent<DefaultLayoutProps> = ({ children }) => {
  // const isMobile = useResponsiveValue({ xs: true, md: false })
  return (
    <Stack>
      <AppBar position="static" sx={{ bgcolor: '#212121' }}>
        <Toolbar>
          <Stack
            width="100%"
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Image src="/logo.png" alt="logo" width={80} height={80} />
            <Avatar sx={{ height: 40, width: 40 }} />
          </Stack>
        </Toolbar>
      </AppBar>
      <Box p={4}>{children}</Box>
    </Stack>
  )
}
export default Layout

Layout.displayName = 'Layout'
