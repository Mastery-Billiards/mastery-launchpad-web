'use client'
import React, { useRef, useCallback, useState } from 'react'
import {
  Stack,
  TextField,
  Button,
  Typography,
  Avatar,
  Stepper,
  Box,
  Step,
  StepLabel,
  StepContent,
  CircularProgress,
} from '@mui/material'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Webcam from 'react-webcam'
import { useSnackbar } from '@/app/providers/snackbar-provider/hooks/use-snackbar'
import { format } from 'date-fns'
import { CARD_IMAGE_MAP } from '@/app/constant/card'

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: 'user',
}

type Customer = {
  name: string
  contactNumber: string
  birthDate: string
  rank: string
  gender: boolean
  revision: string
  code: string
}

type Card = {
  code: string
  rank: string
  status: string
}

export default function Page() {
  const router = useRouter()
  const openSnackbar = useSnackbar()
  // const isMobile = useResponsiveValue({ xs: true, md: false })
  const webcamRef = useRef<Webcam>(null)
  const [url, setUrl] = useState<string | null>(null)
  const [activeStep, setActiveStep] = useState(0)
  const [phoneNumber, setPhoneNumber] = useState<string>('')
  const [cardCode, setCardCode] = useState<string>('')
  const [customerInfo, setCustomerInfo] = useState<Customer | null>(null)
  const [cardInfo, setCardInfo] = useState<Card | null>(null)
  const [loading, setLoading] = useState<{
    isLoading: boolean
    type: string
  } | null>(null)

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot()
    if (imageSrc) {
      return setUrl(imageSrc)
    }
  }, [webcamRef])

  const fetchCustomerInfo = useCallback(async () => {
    if (!!phoneNumber) {
      setLoading({ isLoading: true, type: 'phone' })
      try {
        const res = await fetch(
          `https://2124e8a9-da88-46d7-94fc-4310f61faab3.mock.pstmn.io/api/v1/mastery/customers?top=1&contactNumber=${phoneNumber}`
        )
        if (!res.ok) {
          openSnackbar({ severity: 'error', message: 'Failed to fetch data' })
        }
        const json = await res.json()
        setCustomerInfo(json.data[0])
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
        setLoading(null)
      }
    }
  }, [openSnackbar, phoneNumber])
  const fetchCardInfo = useCallback(async () => {
    if (!!cardCode) {
      setLoading({ isLoading: true, type: 'card' })
      try {
        const res = await fetch(
          `https://2124e8a9-da88-46d7-94fc-4310f61faab3.mock.pstmn.io/api/v1/mastery/customers/membership/cards/${cardCode}`
        )
        if (!res.ok) {
          openSnackbar({ severity: 'error', message: 'Failed to fetch data' })
        }
        const json = await res.json()
        setCardInfo(json)
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
        setLoading(null)
      }
    }
  }, [openSnackbar, cardCode])
  const submitData = useCallback(async () => {
    if (!!cardInfo && !!customerInfo && url) {
      setLoading({ isLoading: true, type: 'submit' })
      try {
        const formData = new FormData()
        formData.append('revision', customerInfo.revision)
        formData.append('newCode', cardInfo.code)
        formData.append('avatar', url)
        const res = await fetch(
          'https://2124e8a9-da88-46d7-94fc-4310f61faab3.mock.pstmn.io/api/v1/mastery/customers/DEVRYDW3L2/membership/cards/issue',
          {
            method: 'POST',
            body: formData,
          }
        )
        if (!res.ok) {
          openSnackbar({ severity: 'error', message: 'Failed to fetch data' })
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
        setLoading(null)
      }
    }
  }, [cardInfo, customerInfo, url, openSnackbar])

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
        py={4}
        spacing={{ xs: 2, md: 4 }}
        alignItems="center"
        justifyContent="center"
      >
        <Box sx={{ width: { xs: '100%', md: 500 } }}>
          <Stepper activeStep={activeStep} orientation="vertical">
            <Step active={activeStep === 0 || activeStep > 0}>
              <StepLabel>Thông tin khách</StepLabel>
              <StepContent>
                <Stack spacing={2}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <TextField
                      fullWidth
                      size="small"
                      variant="standard"
                      label="SỐ ĐIỆN THOẠI"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                    <Button
                      variant="outlined"
                      onClick={fetchCustomerInfo}
                      disabled={
                        (loading?.isLoading && loading?.type === 'phone') ||
                        activeStep > 0 ||
                        !phoneNumber.length
                      }
                      startIcon={
                        loading?.isLoading &&
                        loading?.type === 'phone' && (
                          <CircularProgress size={20} />
                        )
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
                            {format(
                              new Date(customerInfo.birthDate),
                              'dd/MM/yyyy'
                            )}
                          </Typography>
                        </Stack>
                        <Stack
                          direction="row"
                          alignItems="center"
                          justifyContent="space-between"
                        >
                          <Typography>Giới tính:</Typography>
                          <Typography>
                            {customerInfo.gender ? 'Nam' : 'Nữ'}
                          </Typography>
                        </Stack>
                      </Stack>
                      <Button
                        variant="contained"
                        onClick={handleNext}
                        disabled={activeStep > 0}
                      >
                        Tiếp tục
                      </Button>
                    </Stack>
                  )}
                </Stack>
              </StepContent>
            </Step>
            <Step active={activeStep === 1 || activeStep > 1}>
              <StepLabel>Thông tin thẻ</StepLabel>
              <StepContent>
                <Stack spacing={2}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <TextField
                      fullWidth
                      size="small"
                      variant="standard"
                      label="QUÉT MÃ BARCODE"
                      value={cardCode}
                      onChange={(e) => setCardCode(e.target.value)}
                    />
                    <Button
                      variant="outlined"
                      onClick={fetchCardInfo}
                      disabled={
                        (loading?.isLoading && loading?.type === 'card') ||
                        activeStep > 1 ||
                        !cardCode.length
                      }
                      startIcon={
                        loading?.isLoading &&
                        loading?.type === 'card' && (
                          <CircularProgress size={20} />
                        )
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
                            height={{ xs: 190, md: 220 }}
                          >
                            <Image
                              src={CARD_IMAGE_MAP[cardInfo.rank]}
                              alt="platium"
                              fill
                            />
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
                            <Typography>{cardInfo?.status}</Typography>
                          </Stack>
                        </Stack>
                      </Stack>
                      <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Button
                          variant="contained"
                          fullWidth
                          onClick={handleNext}
                          disabled={activeStep > 1}
                        >
                          Tiếp tục
                        </Button>
                        <Button
                          onClick={handleBack}
                          variant="outlined"
                          fullWidth
                          disabled={activeStep > 1}
                        >
                          Trở lại
                        </Button>
                      </Stack>
                    </Stack>
                  )}
                </Stack>
              </StepContent>
            </Step>
            <Step active={activeStep === 2 || activeStep > 2}>
              <StepLabel>Ảnh khách hàng</StepLabel>
              <StepContent>
                <Stack spacing={2}>
                  {activeStep < 3 && (
                    <>
                      <Webcam
                        audio={false}
                        height="100%"
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        width="100%"
                        videoConstraints={videoConstraints}
                        imageSmoothing
                        mirrored
                      />
                      <Button variant="contained" onClick={capture}>
                        Chụp ảnh
                      </Button>
                    </>
                  )}
                  {url && (
                    <Stack spacing={2}>
                      <Stack alignItems="center">
                        <Avatar src={url} sx={{ width: 250, height: 250 }} />
                      </Stack>
                      <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Button
                          variant="contained"
                          fullWidth
                          onClick={handleNext}
                          disabled={activeStep > 2}
                        >
                          Tiếp tục
                        </Button>
                        <Button
                          onClick={handleBack}
                          variant="outlined"
                          fullWidth
                          disabled={activeStep > 2}
                        >
                          Trở lại
                        </Button>
                      </Stack>
                    </Stack>
                  )}
                </Stack>
              </StepContent>
            </Step>
            <Step active={activeStep === 3 || activeStep > 3}>
              <StepLabel>OTP</StepLabel>
              <StepContent>
                <Stack spacing={2}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <TextField
                      fullWidth
                      size="small"
                      variant="standard"
                      label="OTP"
                    />
                    <Button
                      variant="contained"
                      onClick={submitData}
                      disabled={
                        loading?.isLoading && loading?.type === 'submit'
                      }
                      startIcon={
                        loading?.isLoading &&
                        loading?.type === 'submit' && (
                          <CircularProgress size={20} />
                        )
                      }
                    >
                      Gửi
                    </Button>
                  </Stack>
                  <Button variant="outlined" onClick={handleBack}>
                    Trở lại
                  </Button>
                </Stack>
              </StepContent>
            </Step>
          </Stepper>
        </Box>
      </Stack>
    </>
  )
}
