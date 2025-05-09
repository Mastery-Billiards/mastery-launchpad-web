import React from 'react'
import { Stack, TextField, Button, Typography, Divider } from '@mui/material'

export default function Page() {
  return (
    <Stack
      spacing={{ xs: 2, md: 4 }}
      alignItems="center"
      justifyContent="center"
      height="calc(100vh - 144px)"
    >
      <Stack
        bgcolor="#FFFFFF"
        boxShadow="0 0 0 1px rgba(0,0,0,.04),0 4px 16px -4px rgba(0,0,0,.16)"
        borderRadius="8px"
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
              label="Số điện thoại"
            />
            <Button variant="outlined">Tìm</Button>
          </Stack>
          <Stack
            border="1px solid #A3A7A9"
            borderRadius="4px"
            p={2}
            spacing={1}
          >
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography>Họ và tên:</Typography>
              <Typography>ABC</Typography>
            </Stack>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography>Số điện thoại:</Typography>
              <Typography>ABC</Typography>
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
              label="Mã thẻ"
            />
            <Button variant="outlined">Tìm</Button>
          </Stack>
          <Stack
            border="1px solid #A3A7A9"
            borderRadius="4px"
            p={2}
            spacing={1}
          >
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography>Họ và tên:</Typography>
              <Typography>ABC</Typography>
            </Stack>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography>Số điện thoại:</Typography>
              <Typography>ABC</Typography>
            </Stack>
          </Stack>
        </Stack>
        <Stack px={3} direction="row" alignItems="center" spacing={2}>
          <TextField fullWidth size="small" variant="standard" label="OTP" />
          <Button variant="outlined">Submit</Button>
        </Stack>
      </Stack>
    </Stack>
  )
}
