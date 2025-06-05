import React, { useState, useEffect, FC } from 'react'
import { Typography } from '@mui/material'

interface CountdownTimerProps {
  seconds: number
  label?: string
  onComplete?: () => void
}

export const CountdownTimer: FC<CountdownTimerProps> = ({
  seconds,
  label,
  onComplete,
}) => {
  const [totalMillis, setTotalMillis] = useState<number>(
    Math.floor(seconds * 1000)
  )
  const [isRunning, setIsRunning] = useState<boolean>(true)

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null

    if (isRunning && totalMillis > 0) {
      timer = setInterval(() => {
        setTotalMillis((prev) => prev - 10)
      }, 10)
    } else if (totalMillis <= 0 && isRunning) {
      setIsRunning(false)
      if (onComplete) onComplete()
    }

    return () => {
      if (timer) clearInterval(timer)
    }
  }, [isRunning, totalMillis, onComplete])

  const formatTime = (millis: number): string => {
    const totalSec = millis / 1000
    const mins = Math.floor(totalSec / 60)
    const secs = Math.floor(totalSec % 60)
    return `${mins > 0 ? `${mins} phút` : ''} ${secs < 10 ? '0' : ''}${secs} giây`
  }

  return (
    <Typography fontSize={12} fontWeight={600} color="textSecondary">
      {label ? `${label} ${formatTime(totalMillis)}` : formatTime(totalMillis)}
    </Typography>
  )
}
