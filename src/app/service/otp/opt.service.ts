import { baseUrl, client } from '@/app/service/client'
// import { authHeader } from '@/app/service/header'

export const requestOTP = async (phoneNumber: string) => {
  const { data } = await client.post(`${baseUrl()}/otp/send`, {
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ phoneNumber: phoneNumber }),
  })
  return data
}
