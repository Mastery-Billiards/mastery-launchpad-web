import { Customer } from './customer.entity'
import { baseUrl, client } from '@/app/service/client'
import { authHeader } from '@/app/service/header'

export const getCustomer = async (phoneNumber: string): Promise<Customer> => {
  const { data } = await client.get(
    `${baseUrl()}/customers?top=1&contactNumber=${phoneNumber}`,
    {
      headers: {
        ...authHeader,
      },
    }
  )
  return data.data[0]
}
