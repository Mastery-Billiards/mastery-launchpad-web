import { baseUrl, client } from '@/app/service/client'
import { Card } from '@/app/service/card/card.entity'
import { USER_AUTHENTICATION_TOKEN } from '@/app/constant/cookie-name'
import { getCookie } from '@/app/utils/cookie'

export const submitFaceID = async (
  formData: FormData,
  customerCode: string
): Promise<Card> => {
  const token = getCookie(USER_AUTHENTICATION_TOKEN)
  const { data } = await client.post(
    `${baseUrl()}/customers/${customerCode}/face`,
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
