import { baseUrl, client } from '@/app/service/client'
import { Card } from '@/app/service/card/card.entity'
import { authHeader } from '@/app/service/header'

export const submitFaceID = async (
  formData: FormData,
  customerCode: string
): Promise<Card> => {
  const { data } = await client.post(
    `${baseUrl()}/customers/${customerCode}/face`,
    formData,
    {
      headers: {
        ...authHeader,
        contentType: 'multipart/form-data',
      },
    }
  )
  return data
}
