'use client'
import React, { useCallback, useState } from 'react'
import OtpInput from 'react-otp-input'
import {
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
import CustomerInfo from '@/app/card-issuance/components/customer-info'
import { Container } from '@/app/card-issuance/page.styled'
import { useFetchCustomer } from '@/app/hooks/use-fetch-customer'
import { useCardIssuanceError } from '@/app/stores/card-issuance.store'
import { syntaxHighlight } from '@/app/utils/string'
import { useRequestOtp } from '@/app/hooks/use-request-otp'
import { useSubmitCardIssue } from '@/app/hooks/use-submit-card-issue'
import Avatar from '@/app/card-issuance/components/avatar'

export default function Page() {
  const [url, setUrl] = useState<string | null>(null)
  const [activeStep, setActiveStep] = useState(0)
  const [phoneNumber, setPhoneNumber] = useState<string>('')
  const [otp, setOtp] = useState<string>('')
  const { setError, error } = useCardIssuanceError()

  const {
    loading: customerLoading,
    customerInfo,
    setCustomerInfo,
    fetchData: fetchCustomerData,
  } = useFetchCustomer(phoneNumber)
  const { requestOTPFn, contextKey, loading: otpLoading } = useRequestOtp()
  const { submit, loading: submitLoading } = useSubmitCardIssue()

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  }
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const submitData = useCallback(async () => {
    if (!!customerInfo && url) {
      submit(
        customerInfo.id,
        customerInfo.code,
        customerInfo.revision,
        '',
        url,
        otp,
        customerInfo.contactNumber,
        contextKey
      )
    }
  }, [customerInfo, url, submit, otp, contextKey])

  const requestOTP = useCallback(
    (isResend?: boolean) => {
      if (!!customerInfo && url) {
        if (isResend) {
          setOtp('')
        }
        return requestOTPFn(customerInfo.contactNumber, isResend)
      }
    },
    [customerInfo, url, requestOTPFn]
  )

  const handleResetState = useCallback(() => {
    setUrl(null)
    setActiveStep(0)
    setPhoneNumber('')
    setCustomerInfo(null)
    setOtp('')
    setError(null)
  }, [setCustomerInfo, setError])

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
            onClick={submitData}
            disabled={
              (submitLoading?.isLoading && submitLoading?.type === 'submit') ||
              !otp.length
            }
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
    </>
  )
}
