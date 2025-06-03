import { useCallback, useState } from 'react'
import { Customer } from '@/app/service/customer/customer.entity'
import { useSnackbar } from '@/app/providers/snackbar-provider/hooks/use-snackbar'
import { getCustomer } from '@/app/service/customer'
import { useCardIssueError } from '@/app/stores/card-issue.store'

export function useFetchCustomer(phoneNumber: string) {
  const openSnackbar = useSnackbar()
  const [customerInfo, setCustomerInfo] = useState<Customer | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const { setError } = useCardIssueError()

  const fetchData = useCallback(
    (checkIsCardIssued: boolean) => {
      if (!!phoneNumber.length) {
        setLoading(true)
        setCustomerInfo(null)
        getCustomer(phoneNumber)
          .then((data) => {
            if (checkIsCardIssued) {
              if (data?.isCardIssued) {
                openSnackbar({
                  severity: 'error',
                  message: `Khách hàng với số điện thoại ${phoneNumber} đã được cấp thẻ`,
                })
              } else if (data?.rank === 'BASIC') {
                openSnackbar({
                  severity: 'warning',
                  message: 'Khách hàng không đủ điều kiện để phát hành thẻ',
                })
              } else {
                setCustomerInfo(data)
              }
            } else {
              setCustomerInfo(data)
            }
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
                  message: `Khách hàng với số điện thoại ${phoneNumber} không tồn tại`,
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
    },
    [openSnackbar, phoneNumber, setError]
  )
  return {
    customerInfo,
    setCustomerInfo,
    loading,
    fetchData,
  }
}
