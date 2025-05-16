'use client'
import React, { FC, useCallback } from 'react'
import {
  Stack,
  TextField,
  Button,
  Typography,
  CircularProgress,
} from '@mui/material'
import { useSnackbar } from '@/app/providers/snackbar-provider/hooks/use-snackbar'
import { format } from 'date-fns'
import { Customer } from '@/app/card-issuance/page'

interface CustomerInfoProps {
  handleNextAction: () => void
  activeStep: number
  setShowErrorAction: (
    value: null | {
      status: number
      res: { string: { string: string } }
    }
  ) => void
  loading: {
    isLoading: boolean
    type: string
  } | null
  setLoadingAction: (
    value: {
      isLoading: boolean
      type: string
    } | null
  ) => void
  customerInfo: Customer | null
  setCustomerInfoAction: (customerInfo: Customer | null) => void
  phoneNumber: string
  setPhoneNumberAction: (phoneNumber: string) => void
  isEdit: boolean
}

export const CustomerInfo: FC<CustomerInfoProps> = ({
  handleNextAction,
  activeStep,
  setShowErrorAction,
  loading,
  setLoadingAction,
  customerInfo,
  setCustomerInfoAction,
  phoneNumber,
  setPhoneNumberAction,
  isEdit,
}) => {
  const openSnackbar = useSnackbar()

  const fetchCustomerInfo = useCallback(async () => {
    if (!!phoneNumber) {
      setLoadingAction({ isLoading: true, type: 'phone' })
      try {
        setCustomerInfoAction(null)
        const res = await fetch(
          `http://103.90.226.218:8080/api/v1/mastery/customers?top=1&contactNumber=${phoneNumber}`
        )
        if (!res.ok) {
          setShowErrorAction({
            status: res.status,
            res: await res.json(),
          })
          if (res.status === 404) {
            openSnackbar({
              severity: 'error',
              message: `Khách hàng với số điện thoại ${phoneNumber} không tồn tại`,
            })
          } else {
            openSnackbar({ severity: 'error', message: 'Failed to fetch data' })
          }
        } else {
          const json = await res.json()
          if (json.data[0]?.isCardIssued) {
            openSnackbar({
              severity: 'error',
              message: `Khách hàng với số điện thoại ${phoneNumber} đã được cấp thẻ`,
            })
          } else if (json.data[0]?.rank === 'BASIC') {
            openSnackbar({
              severity: 'warning',
              message: 'Khách hàng không đủ điều kiện để phát hành thẻ',
            })
          } else {
            setCustomerInfoAction(json.data[0])
          }
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          openSnackbar({ severity: 'error', message: err.message })
        } else {
          openSnackbar({
            severity: 'error',
            message: `'An unexpected error occurred:', ${err}`,
          })
        }
      } finally {
        setLoadingAction(null)
      }
    }
  }, [
    openSnackbar,
    phoneNumber,
    setCustomerInfoAction,
    setLoadingAction,
    setShowErrorAction,
  ])

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
          disabled={
            ((loading?.isLoading && loading?.type === 'phone') ||
              activeStep > 0) &&
            !isEdit
          }
        />
        <Button
          variant="outlined"
          onClick={fetchCustomerInfo}
          disabled={
            (((loading?.isLoading && loading?.type === 'phone') ||
              activeStep > 0) &&
              !isEdit) ||
            !phoneNumber.length
          }
          startIcon={
            loading?.isLoading &&
            loading?.type === 'phone' && <CircularProgress size={20} />
          }
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
