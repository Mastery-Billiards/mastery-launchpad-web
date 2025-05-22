import { getCookie } from '../utils/cookie'
import { USER_AUTHENTICATION_TOKEN } from '@/app/constant/cookie-name'

let authString = ''

export const updateAuthString = () => {
  authString = `Bearer ${getCookie(USER_AUTHENTICATION_TOKEN)}`
}

updateAuthString()

export const authHeader = {
  'Content-Type': 'application/json',
  Authorization: authString,
}
export const postHeader = {
  Authorization: authString,
}
