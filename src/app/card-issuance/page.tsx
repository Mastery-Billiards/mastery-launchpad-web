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
} from '@mui/material'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
// import { useResponsiveValue } from '@/app/hooks/use-responsive-value'
import Webcam from 'react-webcam'

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: 'user',
}

export default function Page() {
  const router = useRouter()
  // const isMobile = useResponsiveValue({ xs: true, md: false })
  const webcamRef = useRef<Webcam>(null)
  const [url, setUrl] = useState<string | null>(null)
  const [activeStep, setActiveStep] = useState(0)

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
                    />
                    <Button variant="outlined" size="large">
                      OK
                    </Button>
                  </Stack>
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
                      <Typography>Họ và tên:</Typography>
                      <Typography>XXXXXXXXXXXXXXX</Typography>
                    </Stack>
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Typography>Số điện thoại:</Typography>
                      <Typography>XXXXXXXXXXXXXXX</Typography>
                    </Stack>
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Typography>Ngày sinh:</Typography>
                      <Typography>XX/XX/XXX</Typography>
                    </Stack>
                  </Stack>
                </Stack>
                <Box sx={{ mb: 2 }}>
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Continue
                  </Button>
                </Box>
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
                    />
                    <Button variant="outlined" size="large">
                      OK
                    </Button>
                  </Stack>
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
                        <Image src="/platium.png" alt="platium" fill />
                      </Stack>
                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Typography>Mã thẻ:</Typography>
                        <Typography>XXXXXXXXXXXXXXXXX</Typography>
                      </Stack>
                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Typography>Hạng thẻ:</Typography>
                        <Typography>Platium</Typography>
                      </Stack>
                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Typography>Trạng thái:</Typography>
                        <Typography>Active</Typography>
                      </Stack>
                    </Stack>
                  </Stack>
                </Stack>

                <Box sx={{ mb: 2 }}>
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Continue
                  </Button>
                  <Button onClick={handleBack} sx={{ mt: 1, mr: 1 }}>
                    Back
                  </Button>
                </Box>
              </StepContent>
            </Step>
            <Step active={activeStep === 2 || activeStep > 2}>
              <StepLabel>Ảnh khách hàng</StepLabel>
              <StepContent>
                <Stack>
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
                  {url && (
                    <Stack alignItems="center">
                      <Avatar src={url} sx={{ width: 250, height: 250 }} />
                    </Stack>
                  )}
                  <Button onClick={capture}>Capture photo</Button>
                </Stack>
                <Box sx={{ mb: 2 }}>
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Continue
                  </Button>
                  <Button onClick={handleBack} sx={{ mt: 1, mr: 1 }}>
                    Back
                  </Button>
                </Box>
              </StepContent>
            </Step>
            <Step active={activeStep === 3 || activeStep > 3}>
              <StepLabel>OTP</StepLabel>
              <StepContent>
                <Stack px={3} direction="row" alignItems="center" spacing={2}>
                  <TextField
                    fullWidth
                    size="small"
                    variant="standard"
                    label="OTP"
                  />
                  <Button variant="outlined" size="large">
                    Submit
                  </Button>
                </Stack>
                <Box sx={{ mb: 2 }}>
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Continue
                  </Button>
                  <Button onClick={handleBack} sx={{ mt: 1, mr: 1 }}>
                    Back
                  </Button>
                </Box>
              </StepContent>
            </Step>
          </Stepper>
        </Box>
      </Stack>
    </>
  )
}
