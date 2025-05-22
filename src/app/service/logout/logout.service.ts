import { baseAuthUrl, client } from '@/app/service/client'
import { authHeader } from '@/app/service/header'

export const logoutService = async () => {
  const { data } = await client.post(`${baseAuthUrl()}/logout`, {
    headers: {
      ...authHeader,
    },
  })
  return data
}
