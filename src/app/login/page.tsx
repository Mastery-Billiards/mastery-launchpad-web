'use client'
import React, { useState } from 'react'
import { Box, Button, Stack, TextField, Typography } from '@mui/material'
import { LeftSideContainer } from '@/app/login/page.styled'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import LockIcon from '@mui/icons-material/Lock'
import LoginIcon from '@mui/icons-material/Login'
import Image from 'next/image'
import { useLogin } from '@/app/hooks/use-login'
import ConfirmDialog from '@/app/components/shared/confirm-dialog'
import { Container } from '@/app/card-issue/page.styled'
import { syntaxHighlight } from '@/app/utils/string'
import { useAuthError } from '@/app/stores/auth.store'
import { useForm } from 'react-hook-form'

interface LoginInput {
  userName: string
  password: string
}

export default function Home() {
  const { loading, login } = useLogin()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const { setError, error } = useAuthError()

  const form = useForm<LoginInput>({
    defaultValues: {
      userName: '',
      password: '',
    },
  })

  const { handleSubmit, register } = form

  const onSubmit = handleSubmit((data) => {
    return login(data.userName, data.password)
  })

  return (
    <>
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
            <Stack alignItems="center" spacing={1.5}>
              <Box width={300} height={150} position="relative">
                <Image
                  src="/logo-square-no-bg.png"
                  alt="logo"
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </Box>
              <Typography fontSize={28} fontWeight={600} textAlign="center">
                MASTERY LAUNCHPAD
              </Typography>
            </Stack>
            <form onSubmit={onSubmit}>
              <Stack spacing={{ xs: 4, md: 6 }}>
                <Stack spacing={2}>
                  <Stack direction="row" alignItems="flex-end">
                    <AccountCircleIcon
                      sx={{ color: 'action.active', mr: 1, my: 0.5 }}
                    />
                    <TextField
                      {...register('userName')}
                      fullWidth
                      variant="standard"
                      label="Tên đăng nhập"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </Stack>
                  <Stack direction="row" alignItems="flex-end">
                    <LockIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                    <TextField
                      {...register('password')}
                      fullWidth
                      variant="standard"
                      label="Mật khẩu"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </Stack>
                </Stack>
                <Stack alignItems="flex-end">
                  <Button
                    type="submit"
                    fullWidth
                    loading={loading}
                    loadingPosition="start"
                    variant="contained"
                    endIcon={<LoginIcon />}
                    disabled={loading}
                  >
                    Đăng nhập
                  </Button>
                </Stack>
              </Stack>
            </form>
          </Stack>
        </Stack>
      </Stack>
      <ConfirmDialog
        open={!!error}
        onClose={() => setError(null)}
        title="Lỗi hệ thống"
        type="error"
        size="xl"
      >
        <Stack spacing={1}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography>Status:</Typography>
            <Typography color="error" fontWeight={600}>
              {error?.status}
            </Typography>
          </Stack>
          <Container
            dangerouslySetInnerHTML={{
              __html: error?.res
                ? syntaxHighlight(JSON.stringify(error.res, null, 4))
                : '',
            }}
          />
        </Stack>
      </ConfirmDialog>
    </>
  )
}
