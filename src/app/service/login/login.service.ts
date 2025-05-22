import { baseAuthUrl, client } from '@/app/service/client'

export const loginService = async (username: string, password: string) => {
  const { data } = await client.post(`${baseAuthUrl()}/login`, {
    retailer: 'mastery',
    username: username,
    password: password,
  })
  return data
}
