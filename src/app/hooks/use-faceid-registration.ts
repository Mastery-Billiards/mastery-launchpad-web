import { useCallback, useState } from 'react'
import { useSnackbar } from '@/app/providers/snackbar-provider/hooks/use-snackbar'
import { useCardIssuanceError } from '@/app/stores/card-issuance.store'
import { dataURLtoBlob } from '@/app/utils/image'
import { submitFaceID } from '@/app/service/face-id'

export function useFaceIDRegistration(resetState: () => void) {
  const openSnackbar = useSnackbar()
  const { setError } = useCardIssuanceError()
  const [loading, setLoading] = useState<boolean>(false)

  const submit = useCallback(
    (
      customerId: string,
      customerRevision: string,
      imgUrl: string,
      otp: string,
      customerPhone: string,
      contextKey: string
    ) => {
      setLoading(true)
      const formData = new FormData()
      formData.append('customerId', customerId)
      formData.append('revision', customerRevision)
      formData.append('otpValue', otp)
      formData.append('otpContextKey', contextKey)
      const blob = dataURLtoBlob(imgUrl)
      formData.append('avatar', blob, `avatar_${customerPhone}.jpg`)

      submitFaceID(formData)
        .then(() => {
          openSnackbar({
            severity: 'success',
            message: 'Cập nhật face ID thành công',
          })
          setLoading(false)
          resetState()
        })
        .catch((e) => {
          setError({
            status: e?.response?.status,
            res: e.response,
          })
          setLoading(false)
        })
    },
    [openSnackbar, resetState, setError]
  )
  return {
    submit,
    loading,
  }
}
