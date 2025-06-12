'use server'
import { baseUrl, client } from '@/app/service/client'
import { cookies } from 'next/headers'
import { USER_AUTHENTICATION_TOKEN } from '@/app/constant/cookie-name'

export const requestOTP = async (phoneNumber: string) => {
  const cookieStore = await cookies()
  const token = cookieStore.get(USER_AUTHENTICATION_TOKEN)?.value
  const { data } = await client.post(
    `${baseUrl()}/otp/send`,
    {
      recipient: phoneNumber,
      channel: 'ZNS',
      context: 'card_issue',
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
  return data
}
