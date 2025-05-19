import { getCookie } from '../utils/cookie'
import { USER_AUTHENTICATION_TOKEN } from '@/app/constant/cookie-name'

let authString = ''

export const updateAuthString = () => {
  authString = `Bearer ${getCookie(USER_AUTHENTICATION_TOKEN)}`
}

updateAuthString()

export const authHeader = {
  Authorization: authString,
  // 'Content-Type': 'application/x-www-form-urlencoded',
}
export const postHeader = {
  Authorization: authString,
  // 'Content-Type': 'application/json',
}
