import { baseUrl, client } from '@/app/service/client'
import { Card } from '@/app/service/card/card.entity'
// import { authHeader } from '@/app/service/header'

export const getCard = async (cardCode: string): Promise<Card> => {
  const { data } = await client.get(
    `${baseUrl()}/customers/membership/cards/${cardCode}`
    // {
    //   headers: authHeader,
    // }
  )
  return data
}
