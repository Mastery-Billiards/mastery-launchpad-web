import { useCallback, useState } from 'react'
import { useSnackbar } from '@/app/providers/snackbar-provider/hooks/use-snackbar'
import { useCardIssueError } from '@/app/stores/card-issue.store'
import { Card } from '@/app/service/card/card.entity'
import { getCard } from '@/app/service/card'

export function useFetchCard(cardCode: string) {
  const openSnackbar = useSnackbar()
  const [cardInfo, setCardInfo] = useState<Card | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const { setError } = useCardIssueError()

  const fetchData = useCallback(() => {
    if (!!cardCode.length) {
      setLoading(true)
      setCardInfo(null)
      getCard(cardCode)
        .then((data) => {
          setCardInfo(data)
          return setLoading(false)
        })
        .catch((e) => {
          setError({
            status: e?.response?.status,
            res: e.response,
          })
          switch (e?.response?.status) {
            case 404:
              openSnackbar({
                severity: 'error',
                message: `Thẻ khách hàng với mã ${cardCode} không tồn tại`,
              })
              break
            default:
              openSnackbar({
                severity: 'error',
                message: 'Failed to fetch data',
              })
          }
          return setLoading(false)
        })
    }
  }, [openSnackbar, cardCode, setError])
  return {
    cardInfo,
    setCardInfo,
    loading,
    fetchData,
  }
}
