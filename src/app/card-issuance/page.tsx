'use client'
import React from 'react'
import { Stack, TextField, Button, Typography, Divider, Avatar } from '@mui/material'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useResponsiveValue } from '@/app/hooks/use-responsive-value'

export default function Page() {
  const router = useRouter()
  const isMobile = useResponsiveValue({ xs: true, md: false })
  return (
    <>
      <Stack
        alignItems="center"
        justifyContent="center"
        borderRadius="50%"
        sx={{
          cursor: 'pointer',
          transition: 'transform .3s ease',
          '&:hover': {
            transform: 'scale(1.1)',
          },
        }}
        onClick={() => router.push('/')}
        position="absolute"
        zIndex={10}
        left={{ xs: 30, md: 50 }}
        top={{ xs: 105, md: 120 }}
      >
        <ArrowBackIosIcon />
      </Stack>
      <Stack
        pt={{ xs: 4, md: 4 }}
        spacing={{ xs: 2, md: 4 }}
        alignItems="center"
        justifyContent="center"
        height="calc(100vh - 144px)"
      >
        <Stack
          position="relative"
          bgcolor="#FFFFFF"
          boxShadow="0 0 0 1px rgba(0,0,0,.04),0 4px 16px -4px rgba(0,0,0,.16)"
          borderRadius={isMobile ? 0 : '8px'}
          width={{ xs: '100%', md: 500 }}
          spacing={2.5}
          py={3}
          divider={<Divider sx={{ borderStyle: 'dashed' }} />}
        >
          <Stack px={3} spacing={2.5}>
            <Typography textAlign="center" fontSize={24}>
              Thông tin khách
            </Typography>
            <Stack direction="row" alignItems="center" spacing={2}>
              <TextField
                fullWidth
                size="small"
                variant="standard"
                label="SỐ ĐIỆN THOẠI"
              />
              <Button variant="outlined" size="large">
                OK
              </Button>
            </Stack>
            <Stack
              border="1px solid #A3A7A9"
              borderRadius="4px"
              p={1}
              spacing={1}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography>Họ và tên:</Typography>
                <Typography>XXXXXXXXXXXXXXX</Typography>
              </Stack>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography>Số điện thoại:</Typography>
                <Typography>XXXXXXXXXXXXXXX</Typography>
              </Stack>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography>Ngày sinh:</Typography>
                <Typography>XX/XX/XXX</Typography>
              </Stack>
            </Stack>
          </Stack>
          <Stack px={3} spacing={2.5}>
            <Typography textAlign="center" fontSize={24}>
              Thông tin thẻ
            </Typography>
            <Stack direction="row" alignItems="center" spacing={2}>
              <TextField
                fullWidth
                size="small"
                variant="standard"
                label="QUÉT MÃ BARCODE"
              />
              <Button variant="outlined" size="large">
                OK
              </Button>
            </Stack>
            <Stack
              border="1px solid #A3A7A9"
              borderRadius="4px"
              p={1}
              spacing={1.5}
            >
              <Stack spacing={1}>
                <Stack
                  position="relative"
                  width="100%"
                  height={{ xs: 190, md: 220 }}
                >
                  <Image src="/platium.png" alt="platium" fill />
                </Stack>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography>Mã thẻ:</Typography>
                  <Typography>XXXXXXXXXXXXXXXXX</Typography>
                </Stack>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography>Hạng thẻ:</Typography>
                  <Typography>Platium</Typography>
                </Stack>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography>Trạng thái:</Typography>
                  <Typography>Active</Typography>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
          <Stack px={3}>
            <Avatar />
          </Stack>
          <Stack px={3} direction="row" alignItems="center" spacing={2}>
            <TextField fullWidth size="small" variant="standard" label="OTP" />
            <Button variant="outlined" size="large">
              Submit
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </>
  )
}
