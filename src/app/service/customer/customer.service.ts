import { USER_AUTHENTICATION_TOKEN } from '@/app/constant/cookie-name'
import { Customer } from './customer.entity'
import { baseUrl, client } from '@/app/service/client'
import { getCookie } from '@/app/utils/cookie'

export const getCustomer = async (phoneNumber: string): Promise<Customer> => {
  const token = getCookie(USER_AUTHENTICATION_TOKEN)
  const { data } = await client.get(
    `${baseUrl()}/customers?top=1&contactNumber=${phoneNumber}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
  return data.data[0]
}
