'use client'
import React from 'react'
import { Button, Stack, TextField, Typography } from '@mui/material'
import { useRouter } from 'next/navigation'
import { LeftSideContainer } from '@/app/login/page.styled'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import LockIcon from '@mui/icons-material/Lock'
import LoginIcon from '@mui/icons-material/Login'

export default function Home() {
  const router = useRouter()
  return (
    <>
      <form>
        <Stack
          direction="row"
          height="100dvh"
          alignItems="center"
          justifyContent="space-between"
          spacing={2.5}
          pr={2.5}
          sx={{
            bgcolor: '#f3f2f2',
            backgroundImage: {
              xs: 'url("/login-img.png")',
              md: 'none',
            },
            backgroundSize: 'cover',
          }}
        >
          <LeftSideContainer />
          <Stack
            px={4}
            flexBasis={{ xs: '100%', md: '45%' }}
            alignItems="center"
            justifyContent="center"
          >
            <Stack
              spacing={{ xs: 2, md: 4 }}
              width="100%"
              maxWidth={477}
              bgcolor="#fefefe"
              boxShadow="rgba(0, 0, 0, 0.15) 0px 5px 15px 0px"
              p={3}
              borderRadius={(theme) => theme.spacing(1)}
            >
              <Typography
                fontSize={{ xs: 28, md: 42 }}
                fontWeight={600}
                lineHeight={{ xs: '20px', md: '49px' }}
                textAlign="center"
              >
                MASTERY
              </Typography>
              <Stack spacing={{ xs: 4, md: 6 }}>
                <Stack spacing={2}>
                  <Stack direction="row" alignItems="flex-end">
                    <AccountCircleIcon
                      sx={{ color: 'action.active', mr: 1, my: 0.5 }}
                    />
                    <TextField
                      fullWidth
                      variant="standard"
                      label="Tên đăng nhập"
                    />
                  </Stack>
                  <Stack direction="row" alignItems="flex-end">
                    <LockIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                    <TextField
                      fullWidth
                      variant="standard"
                      label="Mật khẩu"
                      // type={showPassword ? 'text' : 'password'}
                      // slotProps={{
                      //   input: {
                      //     endAdornment: (
                      //       <InputAdornment position="end">
                      //         <IconButton
                      //           onClick={() => setShowPassword(!showPassword)}
                      //           onMouseDown={(e) => e.preventDefault()}
                      //           edge="end"
                      //         >
                      //           {showPassword ? (
                      //             <EyesOffIcon fontSize="small" />
                      //           ) : (
                      //             <EyesIcon fontSize="small" />
                      //           )}
                      //         </IconButton>
                      //       </InputAdornment>
                      //     ),
                      //   },
                      // }}
                    />
                  </Stack>
                </Stack>
                <Stack alignItems="flex-end">
                  <Button
                    fullWidth
                    // loading
                    loadingPosition="start"
                    variant="contained"
                    endIcon={<LoginIcon />}
                    // type="submit"
                    // disabled={isLoading || isSuccess}
                    // isLoading={isLoading || isSuccess}
                  >
                    Đăng nhập
                  </Button>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </form>
    </>
  )
}
