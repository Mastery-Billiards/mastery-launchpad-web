'use client'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import OtpInput from 'react-otp-input'
import {
  Avatar,
  Box,
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
import * as faceapi from 'face-api.js'
import { useSnackbar } from '@/app/providers/snackbar-provider/hooks/use-snackbar'
import ConfirmDialog from '@/app/components/shared/confirm-dialog'
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
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [modelsLoaded, setModelsLoaded] = useState(false)
  const [status, setStatus] = useState('Loading models...')
  const [url, setUrl] = useState<string | null>(null)
  const [activeStep, setActiveStep] = useState(0)
  const [phoneNumber, setPhoneNumber] = useState<string>('')
  const [cardCode, setCardCode] = useState<string>('')
  const [otp, setOtp] = useState<string>('')
  const [confirmInfo, setConfirmInfo] = useState<boolean>(false)
  const [isEdit, setIsEdit] = useState(false)
  const { setError, error } = useCardIssuanceError()

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = '/models'
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      ])
      setModelsLoaded(true)
      setStatus('Models loaded. Detecting...')
    }
    loadModels()
  }, [])

  useEffect(() => {
    let intervalId: NodeJS.Timeout

    if (modelsLoaded) {
      intervalId = setInterval(async () => {
        const webcam = webcamRef.current
        const canvas = canvasRef.current

        if (webcam && webcam.video && canvas && canvas.getContext) {
          const video = webcam.video
          const context = canvas.getContext('2d')
          if (!video || !context) return
          const displaySize = {
            width: video.offsetWidth,
            height: video.offsetHeight,
          }
          faceapi.matchDimensions(canvas, displaySize)
          const detections = await faceapi
            .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
          const resizedDetections = faceapi.resizeResults(
            detections,
            displaySize
          )
          context.clearRect(0, 0, canvas.width, canvas.height)
          let frontalCount = 0
          resizedDetections.forEach((det) => {
            const landmarks = det.landmarks
            const leftEye = landmarks.getLeftEye()
            const rightEye = landmarks.getRightEye()
            const eyeDeltaX = Math.abs(leftEye[0].x - rightEye[3].x)
            const eyeDeltaY = Math.abs(leftEye[0].y - rightEye[3].y)
            // Basic check: eyes roughly horizontal
            const eyeSlope = eyeDeltaY / eyeDeltaX
            if (eyeSlope < 0.1) {
              frontalCount++

              const box = det.detection.box
              const cornerLen = 25

              // === DRAW GREEN CORNER BRACKETS ===
              context.strokeStyle = '#00FF66' // bright green
              context.lineWidth = 4

              // Top-left
              context.beginPath()
              context.moveTo(box.x, box.y + cornerLen)
              context.lineTo(box.x, box.y)
              context.lineTo(box.x + cornerLen, box.y)
              context.stroke()

              // Top-right
              context.beginPath()
              context.moveTo(box.x + box.width - cornerLen, box.y)
              context.lineTo(box.x + box.width, box.y)
              context.lineTo(box.x + box.width, box.y + cornerLen)
              context.stroke()

              // Bottom-left
              context.beginPath()
              context.moveTo(box.x, box.y + box.height - cornerLen)
              context.lineTo(box.x, box.y + box.height)
              context.lineTo(box.x + cornerLen, box.y + box.height)
              context.stroke()

              // Bottom-right
              context.beginPath()
              context.moveTo(box.x + box.width - cornerLen, box.y + box.height)
              context.lineTo(box.x + box.width, box.y + box.height)
              context.lineTo(box.x + box.width, box.y + box.height - cornerLen)
              context.stroke()
            }
          })
          setStatus(
            frontalCount > 0
              ? `Detected ${frontalCount} front-facing face(s)`
              : 'No front-facing face detected'
          )
        }
      }, 0)
    }

    return () => clearInterval(intervalId)
  }, [modelsLoaded])

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
  const {
    submit,
    loading: submitLoading,
    showSuccess,
    setShowSuccess,
  } = useSubmitCardIssue()

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
  }, [handleResetState, setShowSuccess])

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
                      <Box position="relative" width={400} height={400}>
                        <Webcam
                          audio={false}
                          ref={webcamRef}
                          screenshotFormat="image/jpeg"
                          videoConstraints={{ facingMode: 'user' }}
                          imageSmoothing
                          style={{
                            zIndex: 1,
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                          }}
                        />
                        <Stack
                          alignItems="center"
                          position="absolute"
                          justifyContent="flex-start"
                          zIndex={2}
                          width="100%"
                          height="100%"
                          top={16}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="230"
                            height="320"
                            viewBox="0 0 768 768"
                          >
                            <path
                              d="M384,96c-70,0-134,20-184,58s-84,93-92,160c-5,41,0,84,4,108-7-5-14-5-18-2s-7,10-9,16c-10,30-6,60,8,86,10,20,15,31,15,52,0,16,6,26,13,30,4,2,9,3,15,2,1,21,7,46,18,72,21,54,46,86,102,131,48,40,92,56,145,56s97-16,145-56c56-45,81-77,102-131,11-26,17-51,18-72,6,1,11,0,15-2,7-4,13-14,17-30,4-21,9-32,15-52,14-26,18-56,8-86-2-6-4-12-9-16s-11-3-18,2c4-24,9-67,4-108-8-67-42-123-92-160S454,96,384,96z"
                              fill="none"
                              stroke="#ffffff"
                              strokeWidth="3"
                            />
                          </svg>
                        </Stack>
                        <canvas
                          ref={canvasRef}
                          style={{
                            zIndex: 2,
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                          }}
                        />
                      </Box>
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
