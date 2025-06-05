'use client'
import React, { KeyboardEvent, useCallback, useRef, useState } from 'react'
import OtpInput from 'react-otp-input'
import {
  Avatar as MuiAvatar,
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
import ConfirmDialog from '@/app/components/shared/confirm-dialog'
import CustomerInfo from '../components/shared/customer-info'
import { Container } from '@/app/card-issue/page.styled'
import { useFetchCustomer } from '@/app/hooks/use-fetch-customer'
import { useCardIssueError } from '@/app/stores/card-issue.store'
import { syntaxHighlight } from '@/app/utils/string'
import { useRequestOtp } from '@/app/hooks/use-request-otp'
import Avatar from '../components/shared/avatar'
import { useFaceIDRegistration } from '@/app/hooks/use-faceid-registration'
import CountdownTimer from '@/app/components/shared/countdown-timer'

export default function Page() {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [url, setUrl] = useState<string | null>(null)
  const [activeStep, setActiveStep] = useState(0)
  const [phoneNumber, setPhoneNumber] = useState<string>('')
  const [otp, setOtp] = useState<string>('')
  const [isOTPExpired, setIsOTPExpired] = useState<boolean>(false)
  const [resendExpire, setResendExpire] = useState(0)
  const [isResendDisabled, setIsResendDisabled] = useState<boolean>(false)
  const { setError, error } = useCardIssueError()

  const {
    loading: customerLoading,
    customerInfo,
    setCustomerInfo,
    fetchData: fetchCustomerData,
  } = useFetchCustomer(phoneNumber)
  const {
    requestOTPFn,
    contextKey,
    loading: otpLoading,
    expiresIn,
  } = useRequestOtp()

  const {
    submit,
    loading: submitLoading,
    showSuccess,
    setShowSuccess,
  } = useFaceIDRegistration()

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  }
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const submitData = useCallback(() => {
    if (!!customerInfo && url) {
      submit(
        customerInfo.id,
        customerInfo.revision,
        url,
        otp,
        customerInfo.contactNumber,
        contextKey,
        customerInfo.code
      )
    }
  }, [customerInfo, url, submit, otp, contextKey])

  const handleReset = useCallback(() => {
    setUrl(null)
    setActiveStep(0)
    setPhoneNumber('')
    setCustomerInfo(null)
    setOtp('')
    setError(null)
    setShowSuccess(false)
  }, [setCustomerInfo, setError, setShowSuccess])

  const requestOTP = useCallback(
    (isResend?: boolean) => {
      if (!!customerInfo && url) {
        setIsOTPExpired(false)
        if (isResend) {
          setOtp('')
        }
        return requestOTPFn(customerInfo.contactNumber, isResend)
      }
    },
    [customerInfo, url, requestOTPFn]
  )

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      if (buttonRef.current) {
        buttonRef.current.focus()
        buttonRef.current.click()
      }
    }
  }

  return (
    <>
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
              <StepLabel>Thông tin khách hàng</StepLabel>
              <StepContent>
                <CustomerInfo
                  handleNextAction={handleNext}
                  activeStep={activeStep}
                  loading={customerLoading}
                  customerInfo={customerInfo}
                  phoneNumber={phoneNumber}
                  setPhoneNumberAction={setPhoneNumber}
                  isEdit={false}
                  fetchDataAction={() => fetchCustomerData(false)}
                  showAvatar
                />
              </StepContent>
            </Step>
            <Step active={activeStep === 1 || activeStep > 1}>
              <StepLabel>Ảnh khách hàng</StepLabel>
              <StepContent>
                <Avatar
                  handleBackAction={handleBack}
                  handleNextAction={() => {
                    handleNext()
                    requestOTP()
                  }}
                  activeStep={activeStep}
                  isEdit={false}
                  url={url}
                  setUrlAction={setUrl}
                />
              </StepContent>
            </Step>
            <Step active={activeStep === 2 || activeStep > 2}>
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
                    shouldAutoFocus
                    value={otp}
                    onChange={setOtp}
                    numInputs={6}
                    renderSeparator={<span>-</span>}
                    renderInput={(props) => (
                      <input
                        {...props}
                        onKeyDown={(e) => {
                          props.onKeyDown(e)
                          handleKeyDown(e)
                        }}
                      />
                    )}
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
                    alignItems="center"
                    justifyContent="space-between"
                    width="100%"
                  >
                    {expiresIn ? (
                      <>
                        {isOTPExpired ? (
                          <Typography
                            fontSize={12}
                            fontWeight={600}
                            color="error"
                          >
                            Mã OTP đã hết hạn
                          </Typography>
                        ) : (
                          <CountdownTimer
                            seconds={Number(expiresIn)}
                            label="Mã OTP hết hạn sau:"
                            onComplete={() => setIsOTPExpired(true)}
                          />
                        )}
                      </>
                    ) : (
                      <span />
                    )}
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      {otpLoading?.isLoading &&
                        otpLoading?.type === 'resend' && (
                          <CircularProgress size={16} />
                        )}
                      <Link
                        color={isResendDisabled ? 'textDisabled' : 'primary'}
                        underline="hover"
                        sx={{
                          cursor: 'pointer',
                          pointerEvents: isResendDisabled ? 'none' : 'default',
                        }}
                        onClick={() => {
                          setResendExpire(30)
                          setIsResendDisabled(true)
                          requestOTP(true)
                        }}
                      >
                        Gửi lại mã OTP
                      </Link>
                      {resendExpire > 0 && (
                        <CountdownTimer
                          seconds={resendExpire}
                          onComplete={() => {
                            setResendExpire(0)
                            setIsResendDisabled(false)
                          }}
                        />
                      )}
                    </Stack>
                  </Stack>
                </Stack>
              </StepContent>
            </Step>
          </Stepper>
          <Button
            ref={buttonRef}
            fullWidth
            variant="contained"
            onClick={submitData}
            loading={submitLoading}
            disabled={submitLoading || otp.length !== 6 || isOTPExpired}
            loadingPosition="start"
          >
            Cập nhật ảnh
          </Button>
        </Stack>
      </Stack>
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
        open={showSuccess}
        onClose={handleReset}
        title="Cập nhật face ID thành công"
        type="success"
      >
        <Stack spacing={1}>
          <Stack alignItems="center" spacing={2}>
            <MuiAvatar
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
            <Typography>Hạng thành viên:</Typography>
            <Typography>{customerInfo?.rank}</Typography>
          </Stack>
        </Stack>
      </ConfirmDialog>
    </>
  )
}
