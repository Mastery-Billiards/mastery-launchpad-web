import { baseAuthUrl, client } from '@/app/service/client'
import { getCookie } from '@/app/utils/cookie'
import { USER_AUTHENTICATION_TOKEN } from '@/app/constant/cookie-name'

export const logoutService = async () => {
  const token = getCookie(USER_AUTHENTICATION_TOKEN)
  const { data } = await client.post(
    `${baseAuthUrl()}/logout`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
  return data
}
