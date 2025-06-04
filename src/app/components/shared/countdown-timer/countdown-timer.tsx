import React, { useState, useEffect, FC } from 'react'
import { Typography } from '@mui/material'

interface CountdownTimerProps {
  seconds: number
  onComplete?: () => void
}

export const CountdownTimer: FC<CountdownTimerProps> = ({
  seconds,
  onComplete,
}) => {
  const [totalMillis, setTotalMillis] = useState<number>(seconds * 1000)
  const [isRunning, setIsRunning] = useState<boolean>(true)

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null

    if (isRunning && totalMillis > 0) {
      timer = setInterval(() => {
        setTotalMillis((prev) => prev - 10)
      }, 10) // update every 10ms
    } else if (totalMillis <= 0 && isRunning) {
      setIsRunning(false)
      if (onComplete) onComplete()
    }

    return () => {
      if (timer) clearInterval(timer)
    }
  }, [isRunning, totalMillis, onComplete])

  const formatTime = (millis: number): string => {
    const mins = Math.floor(millis / 60000)
    const secs = Math.floor((millis % 60000) / 1000)
    return `${mins} phút ${secs < 10 ? '0' : ''}${secs} giây`
  }

  return (
    <Typography fontSize={12} fontWeight={600} color="textSecondary">
      Hết hạn trong: {formatTime(totalMillis)}
    </Typography>
  )
}
