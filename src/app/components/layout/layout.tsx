'use client'
import React, { FunctionComponent, ReactNode } from 'react'
import { Stack, Box, AppBar, Toolbar, Avatar, Typography } from '@mui/material'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { ROUTES_TITLE } from '@/app/constant/route'

interface DefaultLayoutProps {
  children?: ReactNode
}

const Layout: FunctionComponent<DefaultLayoutProps> = ({ children }) => {
  // const isMobile = useResponsiveValue({ xs: true, md: false })
  const pathname = usePathname()
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
            <Typography
              fontWeight={600}
              fontSize={24}
              textTransform="uppercase"
            >
              {ROUTES_TITLE[pathname]}
            </Typography>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Stack alignItems="flex-end">
                <Typography fontSize={14} fontWeight={600}>
                  User name
                </Typography>
                <Typography fontWeight={400} fontSize={12}>
                  Role
                </Typography>
              </Stack>
              <Avatar sx={{ height: 40, width: 40 }} />
            </Stack>
          </Stack>
        </Toolbar>
      </AppBar>
      <Box>{children}</Box>
    </Stack>
  )
}
export default Layout

Layout.displayName = 'Layout'
