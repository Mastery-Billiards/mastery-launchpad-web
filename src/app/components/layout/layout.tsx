'use client'
import React, { FunctionComponent, ReactNode, useRef, useState } from 'react'
import {
  Stack,
  Box,
  AppBar,
  Toolbar,
  Avatar,
  Typography,
  Popover,
  MenuItem,
  ListItemText,
  ListItemIcon,
  IconButton,
} from '@mui/material'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { ROUTES_TITLE } from '@/app/constant/route'
import { useResponsiveValue } from '@/app/hooks/use-responsive-value'
import { useUserInfo } from '@/app/stores/auth.store'
import { ROLE } from '@/app/constant/role'
import LogoutIcon from '@mui/icons-material/Logout'
import { useLogout } from '@/app/hooks/use-logout'
import Link from 'next/link'
import CustomBreadcrumbs from '@/app/components/shared/breadcrums'

interface DefaultLayoutProps {
  children?: ReactNode
}

const Layout: FunctionComponent<DefaultLayoutProps> = ({ children }) => {
  const isMobile = useResponsiveValue({ xs: true, md: false })
  const pathname = usePathname()
  const { logout } = useLogout()
  const { info } = useUserInfo()
  const anchorRef = useRef<HTMLButtonElement | null>(null)
  const [openPopover, setOpenPopover] = useState<boolean>(false)

  return (
    <Stack justifyContent="space-between" height="100%">
      <AppBar position="static" sx={{ bgcolor: '#212121' }}>
        <Toolbar>
          <Stack
            width="100%"
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Image
              src="/logo-black-bg.png"
              alt="logo"
              width={140}
              height={70}
            />
            {!isMobile && (
              <Typography
                fontWeight={600}
                fontSize={24}
                textTransform="uppercase"
              >
                {ROUTES_TITLE[pathname]}
              </Typography>
            )}
            <Stack direction="row" alignItems="center" spacing={1}>
              <Stack alignItems="flex-end">
                <Typography fontSize={14} fontWeight={600} noWrap>
                  {info?.name}
                </Typography>
                <Typography fontWeight={400} fontSize={12} noWrap>
                  {ROLE[info?.role || '']}
                </Typography>
              </Stack>
              <IconButton
                size="small"
                onClick={() => setOpenPopover(true)}
                ref={anchorRef}
                sx={{ alignItems: 'center', display: 'flex' }}
              >
                <Avatar sx={{ height: 40, width: 40 }} />
              </IconButton>
            </Stack>
          </Stack>
        </Toolbar>
        {pathname !== '/' && (
          <Box bgcolor="white" maxHeight={30} px={5} py={0.5}>
            <CustomBreadcrumbs />
          </Box>
        )}
      </AppBar>
      <Box minHeight={`calc(100vh - ${pathname !== '/' ? 99 : 70}px - 50px)`}>
        {children}
      </Box>
      <Stack
        alignItems="center"
        justifyContent="center"
        minHeight={50}
        bgcolor="#212121"
      >
        <Typography color="white">
          License &#169; Mastery Billiards. All rights reserved.
        </Typography>
      </Stack>
      <Popover
        anchorEl={anchorRef.current}
        anchorOrigin={{
          horizontal: 'center',
          vertical: 'bottom',
        }}
        keepMounted
        onClose={() => setOpenPopover(false)}
        open={openPopover}
        // slotProps={{
        //   paper: { sx: { width: 300 } },
        // }}
        transitionDuration={0}
      >
        <Box sx={{ my: 1 }}>
          <MenuItem onClick={logout}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary={<Typography variant="body1">Thoát</Typography>}
            />
          </MenuItem>
        </Box>
      </Popover>
    </Stack>
  )
}
export default Layout

Layout.displayName = 'Layout'
