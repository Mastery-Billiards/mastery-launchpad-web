import { baseUrl, client } from '@/app/service/client'
import { USER_AUTHENTICATION_TOKEN } from '@/app/constant/cookie-name'
import { getCookie } from '@/app/utils/cookie'

export const requestOTP = async (phoneNumber: string) => {
  const token = getCookie(USER_AUTHENTICATION_TOKEN)
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
