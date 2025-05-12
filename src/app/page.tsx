'use client'
import React from 'react'
import { Typography, Stack } from '@mui/material'
import AddCardIcon from '@mui/icons-material/AddCard'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  return (
    <Stack
      m={2.5}
      spacing={{ xs: 2, md: 4 }}
      direction="row"
      alignItems="center"
    >
      <Stack spacing={1.5} alignItems="center">
        <Stack
          width={{ xs: 50, md: 120 }}
          height={{ xs: 50, md: 120 }}
          borderRadius="12px"
          bgcolor="#FF3B4B"
          alignItems="center"
          justifyContent="center"
          sx={{
            cursor: 'pointer',
            transition: 'transform .3s ease',
            '&:hover': {
              transform: 'scale(1.1)',
            },
          }}
          onClick={() => router.push('/card-issuance')}
        >
          <AddCardIcon sx={{ fontSize: { xs: 24, md: 80 }, color: 'white' }} />
        </Stack>
        <Typography fontWeight={400} fontSize={{ xs: 14, md: 18 }}>
          Phát Hành Thẻ
        </Typography>
      </Stack>
      <Stack spacing={1.5} alignItems="center">
        <Stack
          position="relative"
          width={{ xs: 50, md: 120 }}
          height={{ xs: 50, md: 120 }}
          borderRadius="12px"
          bgcolor="#FFC000"
          alignItems="center"
          justifyContent="center"
          sx={{
            cursor: 'pointer',
            transition: 'transform .3s ease',
            '&:hover': {
              transform: 'scale(1.05)',
            },
          }}
          onClick={() => router.push('/card-issuance')}
        >
          <Image src="/phat-hanh-the.png" alt="phat-hanh-the" fill />
        </Stack>
        <Typography fontWeight={400} fontSize={{ xs: 14, md: 18 }}>
          Phát Hành Thẻ
        </Typography>
      </Stack>
    </Stack>
  )
}
