import { useCallback, useState } from 'react'
import { useSnackbar } from '@/app/providers/snackbar-provider/hooks/use-snackbar'
import { useCardIssuanceError } from '@/app/stores/card-issuance.store'
import { requestOTP } from '@/app/service/otp/opt.service'

export function useRequestOtp() {
  const openSnackbar = useSnackbar()
  const { setError } = useCardIssuanceError()
  const [loading, setLoading] = useState<{
    isLoading: boolean
    type: string
  } | null>(null)

  const requestOTPFn = useCallback(
    (phoneNumber: string, isResend?: boolean) => {
      setLoading({ isLoading: true, type: isResend ? 'resend' : 'otp' })
      requestOTP(phoneNumber)
        .then(() => {
          openSnackbar({
            severity: 'success',
            message: isResend
              ? 'Gửi lại mã OTP đến Zalo khách hàng thành công'
              : 'Gửi mã OTP đến Zalo của khách hàng thành công',
          })
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
    requestOTPFn,
    loading,
  }
}
