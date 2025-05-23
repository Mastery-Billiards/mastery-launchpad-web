'use client'
import React from 'react'
import { Stack } from '@mui/material'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import { useRouter } from 'next/navigation'

export const BackButton: React.FC = () => {
  const router = useRouter()
  return (
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
      left={{ xs: 20, md: 50 }}
      top={{ xs: 90, md: 108 }}
    >
      <ArrowBackIosIcon />
    </Stack>
  )
}
