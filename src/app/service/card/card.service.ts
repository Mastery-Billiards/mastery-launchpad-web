import { baseUrl, client } from '@/app/service/client'
import { Card } from '@/app/service/card/card.entity'
import { USER_AUTHENTICATION_TOKEN } from '@/app/constant/cookie-name'
import { getCookie } from '@/app/utils/cookie'

export const getCard = async (cardCode: string): Promise<Card> => {
  const token = getCookie(USER_AUTHENTICATION_TOKEN)
  const { data } = await client.get(
    `${baseUrl()}/customers/membership/cards/${cardCode}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
  return data
}

export const submitCardIssue = async (
  customerCode: string,
  formData: FormData
): Promise<Card> => {
  const token = getCookie(USER_AUTHENTICATION_TOKEN)
  const { data } = await client.post(
    `${baseUrl()}/customers/${customerCode}/membership/cards/issue`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        contentType: 'multipart/form-data',
      },
    }
  )
  return data
}
