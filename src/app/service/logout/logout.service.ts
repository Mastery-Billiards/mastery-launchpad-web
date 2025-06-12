'use server'
import { baseAuthUrl, client } from '@/app/service/client'
import { cookies } from 'next/headers'
import { USER_AUTHENTICATION_TOKEN } from '@/app/constant/cookie-name'

export const logoutService = async () => {
  const cookieStore = await cookies()
  const token = cookieStore.get(USER_AUTHENTICATION_TOKEN)?.value
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
