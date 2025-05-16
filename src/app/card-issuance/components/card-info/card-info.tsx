'use client'
import React, { FC, useCallback, useMemo } from 'react'
import {
  Stack,
  TextField,
  Button,
  Typography,
  CircularProgress,
} from '@mui/material'
import { useSnackbar } from '@/app/providers/snackbar-provider/hooks/use-snackbar'
import Image from 'next/image'
import { CARD_IMAGE_MAP, CARD_STATUS } from '@/app/constant/card'
import { Card } from '@/app/card-issuance/page'

interface CardInfoProps {
  handleBackAction: () => void
  activeStep: number
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
  cardCode: string
  setCardCodeAction: (code: string) => void
  cardInfo: Card | null
  setCardInfoAction: (cardInfo: Card | null) => void
  handleCheckCardAction: () => void
  setShowErrorAction: (
    value: null | {
      status: number
      res: { string: { string: string } }
    }
  ) => void
  isEdit: boolean
}

export const CardInfo: FC<CardInfoProps> = ({
  handleBackAction,
  activeStep,
  loading,
  setLoadingAction,
  cardCode,
  setCardCodeAction,
  cardInfo,
  setCardInfoAction,
  handleCheckCardAction,
  setShowErrorAction,
  isEdit,
}) => {
  const openSnackbar = useSnackbar()

  const fetchCardInfo = useCallback(async () => {
    if (!!cardCode) {
      setLoadingAction({ isLoading: true, type: 'card' })
      try {
        const res = await fetch(
          `http://103.90.226.218:8080/api/v1/mastery/customers/membership/cards/${cardCode}`
        )
        if (!res.ok) {
          setShowErrorAction({
            status: res.status,
            res: await res.json(),
          })
          if (res.status === 404) {
            openSnackbar({
              severity: 'error',
              message: `Thẻ khách hàng với mã ${cardCode} không tồn tại`,
            })
          } else {
            openSnackbar({ severity: 'error', message: 'Failed to fetch data' })
          }
        } else {
          const json = await res.json()
          setCardInfoAction(json)
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
    cardCode,
    setLoadingAction,
    setShowErrorAction,
    openSnackbar,
    setCardInfoAction,
  ])

  return (
    <Stack spacing={2}>
      <Stack direction="row" alignItems="center" spacing={2}>
        <TextField
          fullWidth
          size="small"
          variant="standard"
          label="QUÉT MÃ BARCODE"
          value={cardCode}
          onChange={(e) => setCardCodeAction(e.target.value)}
          disabled={
            ((loading?.isLoading && loading?.type === 'card') ||
              activeStep > 1) &&
            !isEdit
          }
        />
        <Button
          variant="outlined"
          onClick={fetchCardInfo}
          disabled={
            (((loading?.isLoading && loading?.type === 'card') ||
              activeStep > 1) &&
              !isEdit) ||
            !cardCode.length
          }
          startIcon={
            loading?.isLoading &&
            loading?.type === 'card' && <CircularProgress size={20} />
          }
          sx={{ minWidth: 'max-content' }}
        >
          Xác nhận
        </Button>
      </Stack>
      {!!cardInfo && (
        <Stack spacing={2}>
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
                height={{ xs: 200, md: 250 }}
              >
                <Image src={CARD_IMAGE_MAP[cardInfo.rank]} alt="platium" fill />
              </Stack>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography>Mã thẻ:</Typography>
                <Typography>{cardInfo?.code}</Typography>
              </Stack>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography>Hạng thẻ:</Typography>
                <Typography>{cardInfo?.rank}</Typography>
              </Stack>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography>Trạng thái:</Typography>
                <Typography>{CARD_STATUS[cardInfo?.status]}</Typography>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      )}
      <Stack direction="row" alignItems="center" spacing={1.5}>
        <Button
          variant="contained"
          fullWidth
          onClick={handleCheckCardAction}
          disabled={activeStep > 1 || !cardInfo}
        >
          Tiếp tục
        </Button>
        <Button
          onClick={handleBackAction}
          variant="outlined"
          fullWidth
          disabled={activeStep > 1}
        >
          Trở lại
        </Button>
      </Stack>
    </Stack>
  )
}
