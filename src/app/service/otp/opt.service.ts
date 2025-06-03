import { baseUrl, client } from '@/app/service/client'
import { authHeader } from '@/app/service/header'

export const requestOTP = async (phoneNumber: string) => {
  const { data } = await client.post(
    `${baseUrl()}/otp/send`,
    {
      recipient: phoneNumber,
      channel: 'ZNS',
      context: 'card_issue',
    },
    {
      headers: {
        ...authHeader,
      },
    }
  )
  return data
}
