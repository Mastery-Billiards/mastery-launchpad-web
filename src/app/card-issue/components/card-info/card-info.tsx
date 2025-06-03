'use client'
import React, { FC, KeyboardEvent, useRef } from 'react'
import { Stack, TextField, Button, Typography } from '@mui/material'
import Image from 'next/image'
import { CARD_IMAGE_MAP, CARD_STATUS } from '@/app/constant/card'
import { Card } from '@/app/service/card/card.entity'

interface CardInfoProps {
  handleBackAction: () => void
  activeStep: number
  loading: boolean
  cardCode: string
  setCardCodeAction: (code: string) => void
  cardInfo: Card | null
  handleCheckCardAction: () => void
  isEdit: boolean
  fetchDataAction: () => void
}

export const CardInfo: FC<CardInfoProps> = ({
  handleBackAction,
  activeStep,
  loading,
  cardCode,
  setCardCodeAction,
  cardInfo,
  handleCheckCardAction,
  isEdit,
  fetchDataAction,
}) => {
  const buttonConfirmRef = useRef<HTMLButtonElement>(null)
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      if (buttonConfirmRef.current) {
        buttonConfirmRef.current.focus()
        buttonConfirmRef.current.click()
      }
    }
  }
  return (
    <Stack spacing={2}>
      <Stack direction="row" alignItems="center" spacing={2}>
        <TextField
          autoFocus
          fullWidth
          size="small"
          variant="standard"
          label="QUÉT MÃ BARCODE"
          value={cardCode}
          onKeyDown={handleKeyDown}
          onChange={(e) => setCardCodeAction(e.target.value)}
          disabled={(loading || activeStep > 1) && !isEdit}
        />
        <Button
          ref={buttonConfirmRef}
          variant="outlined"
          onClick={fetchDataAction}
          disabled={
            ((loading || activeStep > 1) && !isEdit) || !cardCode.length
          }
          loading={loading}
          loadingPosition="start"
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
          autoFocus
          variant="contained"
          fullWidth
          onClick={handleCheckCardAction}
          disabled={activeStep > 1 || !cardInfo || cardInfo?.status === 'INUSE'}
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
