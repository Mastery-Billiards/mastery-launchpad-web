'use client'
import React, { useCallback, useRef, useState } from 'react'
import OtpInput from 'react-otp-input'
import {
  Avatar,
  Button,
  CircularProgress,
  Divider,
  Link,
  Stack,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Typography,
} from '@mui/material'
import Webcam from 'react-webcam'
import { useSnackbar } from '@/app/providers/snackbar-provider/hooks/use-snackbar'
import { dataURLtoBlob } from '@/app/utils/image'
import ConfirmDialog from '@/app/components/shared/confirm-dialog'
import BackButton from '@/app/components/shared/back-button'
import CustomerInfo from '@/app/card-issuance/components/customer-info'
import CardInfo from '@/app/card-issuance/components/card-info'
import { Container } from '@/app/card-issuance/page.styled'
import { CARD_STATUS } from '@/app/constant/card'

export type Customer = {
  name: string
  contactNumber: string
  birthDate: string
  rank: string
  gender: boolean
  revision: string
  code: string
  isCardIssued: boolean
}

export type Card = {
  code: string
  rank: string
  status: string
}

export default function Page() {
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
  const [showError, setShowError] = useState<null | {
    status: number
    res: { string: { string: string } }
  }>(null)
  const [confirmInfo, setConfirmInfo] = useState<boolean>(false)
  const [isEdit, setIsEdit] = useState(false)

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
          setShowError({
            status: res.status,
            res: await res.json(),
          })
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
            setShowError({
              status: res.status,
              res: await res.json(),
            })
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
  const handleResetState = useCallback(() => {
    setUrl(null)
    setActiveStep(0)
    setPhoneNumber('')
    setCardCode('')
    setCustomerInfo(null)
    setCardInfo(null)
    setOtp('')
  }, [])
  const closeSuccessDialog = useCallback(() => {
    setShowSuccess(false)
    handleResetState()
  }, [handleResetState])
  const handleCheckCard = useCallback(() => {
    if (customerInfo?.rank === cardInfo?.rank) {
      return handleNext()
    }
    return openSnackbar({
      severity: 'error',
      message: 'Hạng thành viên và hạng thẻ không trùng khớp',
    })
  }, [cardInfo?.rank, customerInfo?.rank, openSnackbar])

  const syntaxHighlight = useCallback((json: string) => {
    const newJson = json
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
    return newJson.replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      function (match: string) {
        let cls = 'number'
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = 'key'
          } else {
            cls = 'string'
          }
        } else if (/true|false/.test(match)) {
          cls = 'boolean'
        } else if (/null/.test(match)) {
          cls = 'null'
        }
        return '<span class="' + cls + '">' + match + '</span>'
      }
    )
  }, [])

  const handleEdit = useCallback(() => {
    setConfirmInfo(false)
    setIsEdit(true)
  }, [])

  return (
    <>
      <BackButton />
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
                <CustomerInfo
                  handleNextAction={handleNext}
                  activeStep={activeStep}
                  setShowErrorAction={setShowError}
                  loading={loading}
                  setLoadingAction={setLoading}
                  customerInfo={customerInfo}
                  setCustomerInfoAction={setCustomerInfo}
                  phoneNumber={phoneNumber}
                  setPhoneNumberAction={setPhoneNumber}
                  isEdit={isEdit}
                />
              </StepContent>
            </Step>
            <Step active={activeStep === 1 || activeStep > 1}>
              <StepLabel>Thông tin thẻ</StepLabel>
              <StepContent>
                <CardInfo
                  handleBackAction={handleBack}
                  activeStep={activeStep}
                  loading={loading}
                  setLoadingAction={setLoading}
                  cardCode={cardCode}
                  setCardCodeAction={setCardCode}
                  cardInfo={cardInfo}
                  setCardInfoAction={setCardInfo}
                  handleCheckCardAction={handleCheckCard}
                  setShowErrorAction={setShowError}
                  isEdit={isEdit}
                />
              </StepContent>
            </Step>
            <Step active={activeStep === 2 || activeStep > 2}>
              <StepLabel>Ảnh khách hàng</StepLabel>
              <StepContent>
                <Stack spacing={2}>
                  {(activeStep < 3 || isEdit) && (
                    <>
                      <Webcam
                        audio={false}
                        height="100%"
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        width="100%"
                        videoConstraints={{
                          width: 1280,
                          height: 720,
                          facingMode: 'user',
                        }}
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
            onClick={() => {
              if (customerInfo?.rank === cardInfo?.rank) {
                return setConfirmInfo(true)
              }
              return openSnackbar({
                severity: 'error',
                message: 'Hạng thành viên và hạng thẻ không trùng khớp',
              })
            }}
            disabled={
              (loading?.isLoading && loading?.type === 'submit') || !otp.length
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
        open={!!showError}
        onClose={() => setShowError(null)}
        title="Lỗi hệ thống"
        type="error"
        size="xl"
      >
        <Stack spacing={1}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography>Status:</Typography>
            <Typography color="error" fontWeight={600}>
              {showError?.status}
            </Typography>
          </Stack>
          <Container
            dangerouslySetInnerHTML={{
              __html: showError?.res
                ? syntaxHighlight(JSON.stringify(showError.res, null, 4))
                : '',
            }}
          />
        </Stack>
      </ConfirmDialog>
      <ConfirmDialog
        open={confirmInfo}
        onClose={() => setConfirmInfo(false)}
        title="Xác nhận thông tin"
        size="sm"
      >
        <Stack spacing={2}>
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
              <Typography>{CARD_STATUS[cardInfo?.status as string]}</Typography>
            </Stack>
          </Stack>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={1}
          >
            <Button
              fullWidth
              variant="outlined"
              disabled={loading?.isLoading && loading?.type === 'submit'}
              onClick={handleEdit}
            >
              Chỉnh sửa
            </Button>
            <Button
              fullWidth
              variant="contained"
              disabled={loading?.isLoading && loading?.type === 'submit'}
              startIcon={
                loading?.isLoading &&
                loading?.type === 'submit' && (
                  <CircularProgress size={20} sx={{ color: 'white' }} />
                )
              }
              onClick={submitData}
            >
              Xác nhận
            </Button>
          </Stack>
        </Stack>
      </ConfirmDialog>
    </>
  )
}
