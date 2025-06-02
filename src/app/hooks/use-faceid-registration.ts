import { useCallback, useState } from 'react'
import { useSnackbar } from '@/app/providers/snackbar-provider/hooks/use-snackbar'
import { useCardIssuanceError } from '@/app/stores/card-issuance.store'
import { dataURLtoBlob } from '@/app/utils/image'
import { submitFaceID } from '@/app/service/face-id'

export function useFaceIDRegistration() {
  const openSnackbar = useSnackbar()
  const { setError } = useCardIssuanceError()
  const [loading, setLoading] = useState<boolean>(false)
  const [showSuccess, setShowSuccess] = useState<boolean>(false)

  const submit = useCallback(
    (
      customerId: string,
      customerRevision: string,
      imgUrl: string,
      otp: string,
      customerPhone: string,
      contextKey: string,
      customerCode: string
    ) => {
      setLoading(true)
      const formData = new FormData()
      formData.append('customerId', customerId)
      formData.append('revision', customerRevision)
      formData.append('otpValue', otp)
      formData.append('otpContextKey', contextKey)
      const blob = dataURLtoBlob(imgUrl)
      formData.append('avatar', blob, `avatar_${customerPhone}.jpg`)

      submitFaceID(formData, customerCode)
        .then(() => {
          openSnackbar({
            severity: 'success',
            message: 'Cập nhật face ID thành công',
          })
          setShowSuccess(true)
          setLoading(false)
        })
        .catch((e) => {
          setError({
            status: e?.response?.status,
            res: e.response,
          })
          setLoading(false)
        })
    },
    [openSnackbar, setError]
  )
  return {
    submit,
    loading,
    showSuccess,
    setShowSuccess,
  }
}
