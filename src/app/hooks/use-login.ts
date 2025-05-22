import { useCallback, useState } from 'react'
import { useSnackbar } from '@/app/providers/snackbar-provider/hooks/use-snackbar'
import { loginService } from '@/app/service/login'
import { useRouter } from 'next/navigation'
import { setCookie } from '@/app/utils/cookie'
import { USER_AUTHENTICATION_TOKEN } from '@/app/constant/cookie-name'
import { useAuthError, useUserInfo } from '@/app/stores/auth.store'
import { USER_AUTHENTICATION_INFO_KEY } from '@/app/constant/local-storage-key'

export function useLogin() {
  const router = useRouter()
  const openSnackbar = useSnackbar()
  const { setError } = useAuthError()
  const { setInfo } = useUserInfo()
  const [loading, setLoading] = useState<boolean>(false)

  const login = useCallback(
    (userName: string, password: string) => {
      setLoading(true)
      loginService(userName, password)
        .then((data) => {
          openSnackbar({
            severity: 'success',
            message: 'Đăng nhập thành công',
          })
          setInfo({
            name: data.name,
            role: data.role,
            expiresIn: data.expiresIn,
          })
          setCookie(`${USER_AUTHENTICATION_TOKEN}`, data.accessToken)
          localStorage.setItem(
            USER_AUTHENTICATION_INFO_KEY,
            JSON.stringify({
              name: data.name,
              role: data.role,
              expiresIn: data.expiresIn,
            })
          )
          router.push('/')
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
    [openSnackbar, router, setError]
  )
  return {
    login,
    loading,
  }
}
