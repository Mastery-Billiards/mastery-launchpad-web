import { useCallback } from 'react'
import { useSnackbar } from '@/app/providers/snackbar-provider/hooks/use-snackbar'
import { useCardIssuanceError } from '@/app/stores/card-issuance.store'
import { dataURLtoBlob } from '@/app/utils/image'
import { submitCardIssue } from '@/app/service/card'

export function useSubmitCardIssue() {
  const openSnackbar = useSnackbar()
  const { setError } = useCardIssuanceError()

  const submit = useCallback(
    (
      customerCode: string,
      customerRevision: string,
      cardCode: string,
      imgUrl: string,
      otp: string,
      customerPhone: string
    ) => {
      const formData = new FormData()
      formData.append('revision', customerRevision)
      formData.append('newCode', cardCode)
      const blob = dataURLtoBlob(imgUrl)
      formData.append('avatar', blob, `avatar_${customerPhone}.jpg`)
      formData.append('otp', otp)
      submitCardIssue(customerCode, formData)
        .then(() => {
          openSnackbar({
            severity: 'success',
            message: 'Phát hành thẻ thành công',
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
    submit,
  }
}
