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
import ConfirmDialog from '@/app/components/shared/confirm-dialog'
import BackButton from '@/app/components/shared/back-button'
import CustomerInfo from '@/app/card-issuance/components/customer-info'
import CardInfo from '@/app/card-issuance/components/card-info'
import { Container } from '@/app/card-issuance/page.styled'
import { useFetchCustomer } from '@/app/hooks/use-fetch-customer'
import { useCardIssuanceError } from '@/app/stores/card-issuance.store'
import { useFetchCard } from '@/app/hooks/use-fetch-card'
import { syntaxHighlight } from '@/app/utils/string'
import { useRequestOtp } from '@/app/hooks/use-request-otp'
import { useSubmitCardIssue } from '@/app/hooks/use-submit-card-issue'

export default function Page() {
  const openSnackbar = useSnackbar()
  const webcamRef = useRef<Webcam>(null)
  const [url, setUrl] = useState<string | null>(null)
  const [activeStep, setActiveStep] = useState(0)
  const [phoneNumber, setPhoneNumber] = useState<string>('')
  const [cardCode, setCardCode] = useState<string>('')
  const [otp, setOtp] = useState<string>('')
  const [showSuccess, setShowSuccess] = useState<boolean>(false)
  const [confirmInfo, setConfirmInfo] = useState<boolean>(false)
  const [isEdit, setIsEdit] = useState(false)
  const { setError, error } = useCardIssuanceError()

  const {
    loading: customerLoading,
    customerInfo,
    setCustomerInfo,
    fetchData: fetchCustomerData,
  } = useFetchCustomer(phoneNumber)
  const {
    loading: cardLoading,
    cardInfo,
    setCardInfo,
    fetchData: fetchCardData,
  } = useFetchCard(cardCode)
  const { requestOTPFn, contextKey, loading: otpLoading } = useRequestOtp()
  const { submit, loading: submitLoading } = useSubmitCardIssue()

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
      submit(
        customerInfo.code,
        customerInfo.revision,
        cardInfo.code,
        url,
        otp,
        customerInfo.contactNumber,
        contextKey
      )
      setShowSuccess(true)
    }
  }, [cardInfo, customerInfo, url, submit, otp, contextKey])

  const requestOTP = useCallback(
    (isResend?: boolean) => {
      if (!!cardInfo && !!customerInfo && url) {
        if (isResend) {
          setOtp('')
        }
        return requestOTPFn(customerInfo.contactNumber, isResend)
      }
    },
    [cardInfo, customerInfo, url, requestOTPFn]
  )

  const handleResetState = useCallback(() => {
    setUrl(null)
    setActiveStep(0)
    setPhoneNumber('')
    setCardCode('')
    setCustomerInfo(null)
    setCardInfo(null)
    setOtp('')
    setError(null)
  }, [setCardInfo, setCustomerInfo, setError])

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

  const handleEdit = useCallback(() => {
    setConfirmInfo(false)
    setIsEdit(true)
  }, [])

  return (
    <>
      <BackButton />
      <Stack
        py={{ xs: 6, md: 4 }}
        px={1.5}
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
                  loading={customerLoading}
                  customerInfo={customerInfo}
                  phoneNumber={phoneNumber}
                  setPhoneNumberAction={setPhoneNumber}
                  isEdit={isEdit}
                  fetchDataAction={fetchCustomerData}
                />
              </StepContent>
            </Step>
            <Step active={activeStep === 1 || activeStep > 1}>
              <StepLabel>Thông tin thẻ</StepLabel>
              <StepContent>
                <CardInfo
                  handleBackAction={handleBack}
                  activeStep={activeStep}
                  loading={cardLoading}
                  cardCode={cardCode}
                  setCardCodeAction={setCardCode}
                  cardInfo={cardInfo}
                  handleCheckCardAction={handleCheckCard}
                  isEdit={isEdit}
                  fetchDataAction={fetchCardData}
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
                  {otpLoading?.isLoading && otpLoading?.type === 'otp' && (
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
                    {otpLoading?.isLoading && otpLoading?.type === 'resend' && (
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
              (submitLoading?.isLoading && submitLoading?.type === 'submit') ||
              !otp.length
            }
          >
            Phát hành thẻ
          </Button>
        </Stack>
      </Stack>
      <ConfirmDialog
        open={showSuccess}
        onClose={closeSuccessDialog}
        title="Phát hành thẻ thành công"
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
        open={!!error}
        onClose={() => setError(null)}
        title="Lỗi hệ thống"
        type="error"
        size="xl"
      >
        <Stack spacing={1}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography>Status:</Typography>
            <Typography color="error" fontWeight={600}>
              {error?.status}
            </Typography>
          </Stack>
          <Container
            dangerouslySetInnerHTML={{
              __html: error?.res
                ? syntaxHighlight(JSON.stringify(error.res, null, 4))
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
              disabled={
                submitLoading?.isLoading && submitLoading?.type === 'submit'
              }
              onClick={handleEdit}
            >
              Chỉnh sửa
            </Button>
            <Button
              fullWidth
              variant="contained"
              disabled={
                submitLoading?.isLoading && submitLoading?.type === 'submit'
              }
              loading={
                submitLoading?.isLoading && submitLoading?.type === 'submit'
              }
              loadingPosition="start"
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
