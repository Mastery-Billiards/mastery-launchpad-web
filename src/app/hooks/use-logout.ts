import { useCallback, useState } from 'react'
import { useCardIssueError } from '@/app/stores/card-issue.store'
import { logoutService } from '@/app/service/logout'
import { useRouter } from 'next/navigation'
import { removeCookie } from '@/app/utils/cookie'
import { USER_AUTHENTICATION_TOKEN } from '@/app/constant/cookie-name'
import { USER_AUTHENTICATION_INFO_KEY } from '@/app/constant/local-storage-key'

export function useLogout() {
  const router = useRouter()
  const { setError } = useCardIssueError()
  const [loading, setLoading] = useState<boolean>(false)

  const logout = useCallback(() => {
    setLoading(true)
    console.log(111)
    logoutService()
      .then(() => {
        removeCookie(USER_AUTHENTICATION_TOKEN)
        localStorage.removeItem(USER_AUTHENTICATION_INFO_KEY)
        router.push('/login')
        setLoading(false)
      })
      .catch((e) => {
        setError({
          status: e?.response?.status,
          res: e.response,
        })
        setLoading(false)
      })
  }, [router, setError])
  return {
    logout,
    loading,
  }
}
