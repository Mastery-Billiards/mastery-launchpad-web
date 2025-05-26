import { baseUrl, client } from '@/app/service/client'
import { Card } from '@/app/service/card/card.entity'
import { authHeader } from '@/app/service/header'

export const getCard = async (cardCode: string): Promise<Card> => {
  const { data } = await client.get(
    `${baseUrl()}/customers/membership/cards/${cardCode}`,
    {
      headers: {
        ...authHeader,
      },
    }
  )
  return data
}

export const submitCardIssue = async (
  customerCode: string,
  formData: FormData
): Promise<Card> => {
  const { data } = await client.post(
    `${baseUrl()}/customers/${customerCode}/membership/cards/issue`,
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

// export const submitCardIssue = async (
//   customerCode: string,
//   formData: FormData
// ): Promise<Card> => {
//   const data = await fetch(
//     `${baseUrl()}/customers/${customerCode}/membership/cards/issue`,
//     {
//       method: 'POST',
//       body: formData,
//     }
//   )
//   return data.json()
// }
