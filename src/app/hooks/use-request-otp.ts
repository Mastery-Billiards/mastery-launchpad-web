import { useCallback } from 'react'
import { useSnackbar } from '@/app/providers/snackbar-provider/hooks/use-snackbar'
import { useCardIssuanceError } from '@/app/stores/card-issuance.store'
import { requestOTP } from '@/app/service/otp/opt.service'

export function useRequestOtp() {
  const openSnackbar = useSnackbar()
  const { setError } = useCardIssuanceError()

  const requestOTPFn = useCallback(
    (phoneNumber: string, isResend?: boolean) => {
      requestOTP(phoneNumber)
        .then(() => {
          openSnackbar({
            severity: 'success',
            message: isResend
              ? 'Gửi lại mã OTP đến Zalo khách hàng thành công'
              : 'Gửi mã OTP đến Zalo của khách hàng thành công',
          })
        })
        .catch((e) => {
          setError({
            status: e?.response?.status,
            res: e.response,
          })
        })
    },
    [openSnackbar, setError]
  )
  return {
    requestOTPFn,
  }
}
