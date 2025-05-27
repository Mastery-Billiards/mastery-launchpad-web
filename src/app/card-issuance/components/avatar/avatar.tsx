'use client'
import React, { FC, useCallback, useEffect, useRef, useState } from 'react'
import { Avatar as MuiAvatar, Button, Stack, Typography } from '@mui/material'
import Webcam from 'react-webcam'
import * as faceapi from 'face-api.js'
import Image from 'next/image'
import faceIcon from '../../../../../public/face-overlay.svg'

interface AvatarProps {
  handleBackAction: () => void
  handleNextAction: () => void
  activeStep: number
  isEdit: boolean
  url: string | null
  setUrlAction: (url: string | null) => void
}

const DEFAULT_STATUS = 'Đang tải mô hình nhận diện...'

export const Avatar: FC<AvatarProps> = ({
  isEdit,
  activeStep,
  handleBackAction,
  handleNextAction,
  url,
  setUrlAction,
}) => {
  const webcamRef = useRef<Webcam>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [modelsLoaded, setModelsLoaded] = useState(false)
  const [statusMessage, setStatusMessage] = useState(DEFAULT_STATUS)
  const [countdown, setCountdown] = useState<number | null>(null)
  const countdownRef = useRef<NodeJS.Timeout | null>(null)

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot()
    if (imageSrc) {
      return setUrlAction(imageSrc)
    }
  }, [setUrlAction])

  const clearCountdown = () => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current)
      countdownRef.current = null
    }
    setCountdown(null)
  }

  const startCountdown = useCallback(() => {
    let timeLeft = 3
    setCountdown(timeLeft)
    setStatusMessage(
      `✅ Khuôn mặt đã căn chỉnh! Bắt đầu chụp sau ${timeLeft}...`
    )

    countdownRef.current = setInterval(() => {
      timeLeft -= 1
      if (timeLeft > 0) {
        setCountdown(timeLeft)
        setStatusMessage(
          `✅ Khuôn mặt đã căn chỉnh! Bắt đầu chụp sau ${timeLeft}...`
        )
      } else {
        clearCountdown()
        capture()
      }
    }, 1000)
  }, [capture])

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = '/models'
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      ])
      setModelsLoaded(true)
      setStatusMessage('Hệ thống đã sẵn sàng. Vui lòng nhìn vào camera.')
    }
    loadModels()
  }, [])

  useEffect(() => {
    if (url === null) {
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
            if (detections.length === 0) {
              clearCountdown()
              setStatusMessage('Không phát hiện khuôn mặt, hãy nhìn vào camera')
            } else if (detections.length > 1) {
              clearCountdown()
              setStatusMessage('Phát hiện nhiều hơn một khuôn mặt')
            } else if (detections.length === 1) {
              resizedDetections.forEach((det) => {
                const landmarks = det.landmarks
                const leftEye = landmarks.getLeftEye()
                const rightEye = landmarks.getRightEye()
                const eyeDeltaX = Math.abs(leftEye[0].x - rightEye[3].x)
                const eyeDeltaY = Math.abs(leftEye[0].y - rightEye[3].y)
                // Basic check: eyes roughly horizontal
                const eyeSlope = eyeDeltaY / eyeDeltaX
                if (eyeSlope < 0.1) {
                  const centerBoxWidth = displaySize.width * 0.5
                  const centerBoxHeight = displaySize.height * 0.5
                  const centerBoxX = (displaySize.width - centerBoxWidth) / 2
                  const centerBoxY = (displaySize.height - centerBoxHeight) / 2
                  const faceBox = detections[0].detection.box
                  const faceCenterX = faceBox.x + faceBox.width / 2
                  const faceCenterY = faceBox.y + faceBox.height / 2
                  const isCentered =
                    faceCenterX > centerBoxX &&
                    faceCenterX < centerBoxX + centerBoxWidth &&
                    faceCenterY > centerBoxY &&
                    faceCenterY < centerBoxY + centerBoxHeight
                  if (isCentered) {
                    const box = det.detection.box
                    const cornerLen = 25
                    // === DRAW GREEN CORNER BRACKETS ===
                    context.strokeStyle = '#00FF66' // bright green
                    context.lineWidth = 2
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
                    context.moveTo(
                      box.x + box.width - cornerLen,
                      box.y + box.height
                    )
                    context.lineTo(box.x + box.width, box.y + box.height)
                    context.lineTo(
                      box.x + box.width,
                      box.y + box.height - cornerLen
                    )
                    context.stroke()
                    if (countdown === null) {
                      return startCountdown()
                    }
                  } else {
                    clearCountdown()
                    setStatusMessage(
                      'Vui lòng điều chỉnh để khuôn mặt nằm giữa khung.'
                    )
                  }
                } else {
                  clearCountdown()
                  setStatusMessage(
                    'Vui lòng điều chỉnh để khuôn mặt nằm giữa khung.'
                  )
                }
              })
            }
          }
        }, 300)
      }
      return () => clearInterval(intervalId)
    }
  }, [capture, countdown, modelsLoaded, startCountdown, url])

  return (
    <Stack spacing={2}>
      {url ? (
        <Stack spacing={2}>
          <Stack alignItems="center" position="relative">
            <MuiAvatar
              variant="square"
              src={url}
              sx={{
                width: '100%',
                height: 'auto',
                borderRadius: '8px',
              }}
            />
            <Button
              color="error"
              size="small"
              variant="contained"
              sx={{ position: 'absolute', bottom: 8, right: 8 }}
              onClick={() => {
                setStatusMessage(DEFAULT_STATUS)
                setUrlAction(null)
              }}
            >
              Chụp lại
            </Button>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Button
              variant="contained"
              fullWidth
              onClick={() => handleNextAction()}
              disabled={activeStep > 2}
            >
              Tiếp tục
            </Button>
            <Button
              onClick={handleBackAction}
              variant="outlined"
              fullWidth
              disabled={activeStep > 2}
            >
              Trở lại
            </Button>
          </Stack>
        </Stack>
      ) : (
        <>
          {(activeStep < 3 || isEdit) && (
            <Stack position="relative" width="100%" height={400}>
              <Typography fontSize={13} fontWeight={600} color="text.secondary">
                {statusMessage}
              </Typography>
              {modelsLoaded && (
                <>
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
                    justifyContent="center"
                    zIndex={2}
                    width="100%"
                    height="100%"
                  >
                    <Image
                      priority
                      src={faceIcon}
                      alt="face overlay"
                      style={{ width: '75%' }}
                    />
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
                </>
              )}
            </Stack>
          )}
        </>
      )}
    </Stack>
  )
}
