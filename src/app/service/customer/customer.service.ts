'use server'
import { cookies } from 'next/headers'
import { USER_AUTHENTICATION_TOKEN } from '@/app/constant/cookie-name'
import { Customer } from './customer.entity'
import { baseUrl, client } from '@/app/service/client'

export const getCustomer = async (phoneNumber: string): Promise<Customer> => {
  const cookieStore = await cookies()
  const token = cookieStore.get(USER_AUTHENTICATION_TOKEN)?.value
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
