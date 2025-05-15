'use client'
import React, { useRef, useCallback, useState } from 'react'
import OtpInput from 'react-otp-input'
import {
  Stack,
  TextField,
  Button,
  Typography,
  Avatar,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  CircularProgress,
  Divider,
  Link,
} from '@mui/material'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Webcam from 'react-webcam'
import { useSnackbar } from '@/app/providers/snackbar-provider/hooks/use-snackbar'
import { format } from 'date-fns'
import { CARD_IMAGE_MAP, CARD_STATUS } from '@/app/constant/card'
import { dataURLtoBlob } from '@/app/utils/image'
import ConfirmDialog from '@/app/components/shared/confirm-dialog'

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
  isCardIssued: boolean
}

type Card = {
  code: string
  rank: string
  status: string
}

export default function Page() {
  const router = useRouter()
  const openSnackbar = useSnackbar()
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
  const [otp, setOtp] = useState<string>('')
  const [showSuccess, setShowSuccess] = useState<boolean>(false)
  const [showError, setShowError] = useState<boolean>(false)

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
        setCustomerInfo(null)
        const res = await fetch(
          `http://103.90.226.218:8080/api/v1/mastery/customers?top=1&contactNumber=${phoneNumber}`
        )
        if (!res.ok) {
          if (res.status === 404) {
            const json = await res.json()
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
            setCustomerInfo(json.data[0])
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
        setLoading(null)
      }
    }
  }, [openSnackbar, phoneNumber])
  const fetchCardInfo = useCallback(async () => {
    if (!!cardCode) {
      setLoading({ isLoading: true, type: 'card' })
      try {
        const res = await fetch(
          `http://103.90.226.218:8080/api/v1/mastery/customers/membership/cards/${cardCode}`
        )
        if (!res.ok) {
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
          setCardInfo(json)
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
  }, [openSnackbar, cardCode])
  const submitData = useCallback(async () => {
    if (!!cardInfo && !!customerInfo && url) {
      setLoading({ isLoading: true, type: 'submit' })
      try {
        const formData = new FormData()
        formData.append('revision', customerInfo.revision)
        formData.append('newCode', cardInfo.code)
        const blob = dataURLtoBlob(url)
        formData.append(
          'avatar',
          blob,
          `avatar_${customerInfo.contactNumber}.jpg`
        )
        formData.append('otp', otp)
        const res = await fetch(
          `http://103.90.226.218:8080/api/v1/mastery/customers/${customerInfo.code}/membership/cards/issue`,
          {
            method: 'POST',
            body: formData,
          }
        )
        if (!res.ok) {
          openSnackbar({ severity: 'error', message: 'Failed to fetch data' })
        } else {
          setShowSuccess(true)
          openSnackbar({
            severity: 'success',
            message: 'Phát hành thẻ thành công',
          })
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
  }, [cardInfo, customerInfo, url, otp, openSnackbar])
  const requestOTP = useCallback(
    async (isResend?: boolean) => {
      if (!!cardInfo && !!customerInfo && url) {
        setLoading({ isLoading: true, type: isResend ? 'resend' : 'otp' })
        if (isResend) {
          setOtp('')
        }
        try {
          const res = await fetch(
            'http://103.90.226.218:8080/api/v1/mastery/otp/send',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ phoneNumber: customerInfo.contactNumber }),
            }
          )
          if (!res.ok) {
            openSnackbar({ severity: 'error', message: 'Failed to fetch data' })
          } else {
            openSnackbar({
              severity: 'success',
              message: isResend
                ? 'Gửi lại mã OTP đến Zalo khách hàng thành công'
                : 'Gửi mã OTP đến Zalo của khách hàng thành công',
            })
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
    },
    [cardInfo, customerInfo, url, openSnackbar]
  )

  const closeSuccessDialog = useCallback(() => {
    setShowSuccess(false)
    setUrl(null)
    setActiveStep(0)
    setPhoneNumber('')
    setCardCode('')
    setCustomerInfo(null)
    setCardInfo(null)
    setOtp('')
  }, [])

  const handleCheckCard = useCallback(() => {
    if (customerInfo?.rank === cardInfo?.rank) {
      return handleNext()
    }
    return openSnackbar({
      severity: 'error',
      message: 'Hạng thành viên và hạng thẻ không trùng khớp',
    })
  }, [cardInfo?.rank, customerInfo?.rank, openSnackbar])

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
        <Stack
          spacing={3}
          divider={<Divider />}
          sx={{ width: { xs: '100%', md: 500 } }}
        >
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
                      disabled={
                        (loading?.isLoading && loading?.type === 'phone') ||
                        activeStep > 0
                      }
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
                      disabled={
                        (loading?.isLoading && loading?.type === 'card') ||
                        activeStep > 1
                      }
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
                            height={{ xs: 200, md: 250 }}
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
                            <Typography>
                              {CARD_STATUS[cardInfo?.status]}
                            </Typography>
                          </Stack>
                        </Stack>
                      </Stack>
                      <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Button
                          variant="contained"
                          fullWidth
                          onClick={handleCheckCard}
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
                          onClick={() => {
                            handleNext()
                            return requestOTP()
                          }}
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
              <StepLabel>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <span>OTP</span>
                  {loading?.isLoading && loading?.type === 'otp' && (
                    <CircularProgress size={16} />
                  )}
                </Stack>
              </StepLabel>
              <StepContent>
                <Stack spacing={1}>
                  <OtpInput
                    value={otp}
                    onChange={setOtp}
                    numInputs={6}
                    renderSeparator={<span>-</span>}
                    renderInput={(props) => <input {...props} />}
                    inputStyle={{
                      width: 50,
                      height: 50,
                      margin: 8,
                      fontSize: '1.5rem',
                      borderRadius: 4,
                      border: '1px solid rgba(0,0,0,0.3)',
                    }}
                  />
                  <Stack
                    direction="row"
                    width="100%"
                    alignItems="center"
                    justifyContent="flex-end"
                    spacing={1}
                  >
                    {loading?.isLoading && loading?.type === 'resend' && (
                      <CircularProgress size={16} />
                    )}
                    <Link
                      underline="hover"
                      sx={{ cursor: 'pointer' }}
                      onClick={() => requestOTP(true)}
                    >
                      Gửi lại mã OTP
                    </Link>
                  </Stack>
                </Stack>
              </StepContent>
            </Step>
          </Stepper>
          <Button
            fullWidth
            variant="contained"
            onClick={submitData}
            disabled={
              (loading?.isLoading && loading?.type === 'submit') || !otp.length
            }
            startIcon={
              loading?.isLoading &&
              loading?.type === 'submit' && <CircularProgress size={20} />
            }
          >
            Phát hành thẻ
          </Button>
        </Stack>
      </Stack>
      <ConfirmDialog
        open={showSuccess}
        onClose={closeSuccessDialog}
        title="Phát hành thẻ"
        type="success"
      >
        <Stack spacing={1}>
          <Stack alignItems="center" spacing={2}>
            <Avatar
              src={url ? url : undefined}
              sx={{ width: 100, height: 100 }}
            />
          </Stack>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography>Mã khách hàng:</Typography>
            <Typography>{customerInfo?.code}</Typography>
          </Stack>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography>Họ và tên:</Typography>
            <Typography>{customerInfo?.name}</Typography>
          </Stack>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography>Số điện thoại:</Typography>
            <Typography>{customerInfo?.contactNumber}</Typography>
          </Stack>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography>Hạng thẻ:</Typography>
            <Typography>{cardInfo?.rank}</Typography>
          </Stack>
        </Stack>
      </ConfirmDialog>
      <ConfirmDialog
        open={showError}
        onClose={closeSuccessDialog}
        title="Phát hành thẻ"
        type="error"
      >
        <Stack spacing={1}>
          <Stack alignItems="center" spacing={2}>
            <Avatar
              src={url ? url : undefined}
              sx={{ width: 100, height: 100 }}
            />
          </Stack>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography>Mã khách hàng:</Typography>
            <Typography>{customerInfo?.code}</Typography>
          </Stack>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography>Họ và tên:</Typography>
            <Typography>{customerInfo?.name}</Typography>
          </Stack>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography>Số điện thoại:</Typography>
            <Typography>{customerInfo?.contactNumber}</Typography>
          </Stack>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography>Hạng thẻ:</Typography>
            <Typography>{cardInfo?.rank}</Typography>
          </Stack>
        </Stack>
      </ConfirmDialog>
    </>
  )
}
