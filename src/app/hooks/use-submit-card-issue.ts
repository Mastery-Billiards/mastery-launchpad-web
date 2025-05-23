import { useCallback, useState } from 'react'
import { useSnackbar } from '@/app/providers/snackbar-provider/hooks/use-snackbar'
import { useCardIssuanceError } from '@/app/stores/card-issuance.store'
import { dataURLtoBlob } from '@/app/utils/image'
import { submitCardIssue } from '@/app/service/card'

export function useSubmitCardIssue() {
  const openSnackbar = useSnackbar()
  const { setError } = useCardIssuanceError()
  const [loading, setLoading] = useState<{
    isLoading: boolean
    type: string
  } | null>(null)

  const submit = useCallback(
    (
      customerCode: string,
      customerRevision: string,
      cardCode: string,
      imgUrl: string,
      otp: string,
      customerPhone: string,
      contextKey: string
    ) => {
      setLoading({ isLoading: true, type: 'submit' })
      const formData = new FormData()
      formData.append('revision', customerRevision)
      formData.append('newCode', cardCode)
      const blob = dataURLtoBlob(imgUrl)
      formData.append('avatar', blob, `avatar_${customerPhone}.jpg`)
      formData.append('otp', otp)
      formData.append('otpContextKey', contextKey)
      submitCardIssue(customerCode, formData)
        .then(() => {
          openSnackbar({
            severity: 'success',
            message: 'Phát hành thẻ thành công',
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
    submit,
    loading,
  }
}
