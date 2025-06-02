'use client'
import React, { FC } from 'react'
import { Stack, TextField, Button, Typography, Avatar } from '@mui/material'
import { format } from 'date-fns'
import { Customer } from '@/app/service/customer/customer.entity'

interface CustomerInfoProps {
  handleNextAction: () => void
  activeStep: number
  loading: boolean
  customerInfo: Customer | null
  phoneNumber: string
  setPhoneNumberAction: (phoneNumber: string) => void
  isEdit: boolean
  fetchDataAction: () => void
  showAvatar?: boolean
}

export const CustomerInfo: FC<CustomerInfoProps> = ({
  handleNextAction,
  activeStep,
  loading,
  customerInfo,
  phoneNumber,
  setPhoneNumberAction,
  isEdit,
  fetchDataAction,
  showAvatar = false,
}) => {
  return (
    <Stack spacing={2}>
      <Stack direction="row" alignItems="center" spacing={2}>
        <TextField
          fullWidth
          size="small"
          variant="standard"
          label="SỐ ĐIỆN THOẠI"
          value={phoneNumber}
          onChange={(e) => setPhoneNumberAction(e.target.value)}
          disabled={(loading || activeStep > 0) && !isEdit}
        />
        <Button
          variant="outlined"
          onClick={fetchDataAction}
          disabled={
            ((loading || activeStep > 0) && !isEdit) || !phoneNumber.length
          }
          loading={loading}
          loadingPosition="start"
          sx={{ minWidth: 'max-content' }}
        >
          Xác nhận
        </Button>
      </Stack>
      {!!customerInfo && (
        <Stack spacing={2}>
          <Stack
            border="1px solid #A3A7A9"
            borderRadius="4px"
            p={1}
            spacing={1}
          >
            {showAvatar && (
              <Stack justifyContent="center" alignItems="center">
                <Avatar
                  src={customerInfo.avatar}
                  sx={{ width: 100, height: 100 }}
                />
              </Stack>
            )}
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography>Mã khách hàng:</Typography>
              <Typography>{customerInfo.code}</Typography>
            </Stack>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography>Họ và tên:</Typography>
              <Typography>{customerInfo.name}</Typography>
            </Stack>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography>Số điện thoại:</Typography>
              <Typography>{customerInfo.contactNumber}</Typography>
            </Stack>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography>Ngày sinh:</Typography>
              <Typography>
                {format(new Date(customerInfo.birthDate), 'dd/MM/yyyy')}
              </Typography>
            </Stack>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography>Giới tính:</Typography>
              <Typography>{customerInfo.gender ? 'Nam' : 'Nữ'}</Typography>
            </Stack>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography>Hạng thành viên:</Typography>
              <Typography>{customerInfo.rank}</Typography>
            </Stack>
          </Stack>
          <Button
            variant="contained"
            onClick={handleNextAction}
            disabled={activeStep > 0}
          >
            Tiếp tục
          </Button>
        </Stack>
      )}
    </Stack>
  )
}
