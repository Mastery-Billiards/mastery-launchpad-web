import { useCallback, useState } from 'react'
import { useSnackbar } from '@/app/providers/snackbar-provider/hooks/use-snackbar'
import { useCardIssueError } from '@/app/stores/card-issue.store'
import { requestOTP } from '@/app/service/otp/opt.service'

export function useRequestOtp() {
  const openSnackbar = useSnackbar()
  const { setError } = useCardIssueError()
  const [loading, setLoading] = useState<{
    isLoading: boolean
    type: string
  } | null>(null)
  const [contextKey, setContextKey] = useState<string>('')
  const [expiresIn, setExpiresIn] = useState<string | null>(null)

  const requestOTPFn = useCallback(
    (phoneNumber: string, isResend?: boolean) => {
      setExpiresIn(null)
      setLoading({ isLoading: true, type: isResend ? 'resend' : 'otp' })
      requestOTP(phoneNumber)
        .then((data) => {
          openSnackbar({
            severity: 'success',
            message: isResend
              ? 'Gửi lại mã OTP đến Zalo khách hàng thành công'
              : 'Gửi mã OTP đến Zalo của khách hàng thành công',
          })
          setContextKey(data.contextKey)
          setExpiresIn(data.expiresIn)
          setLoading(null)
        })
        .catch((e) => {
          setError({
            status: e?.response?.status,
            res: e.response,
          })
          setLoading(null)
        })
    },
    [openSnackbar, setError]
  )
  return {
    expiresIn,
    contextKey,
    requestOTPFn,
    loading,
  }
}
