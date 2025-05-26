import { getCookie } from '../utils/cookie'
import { USER_AUTHENTICATION_TOKEN } from '@/app/constant/cookie-name'

export let authString = ''

export const updateAuthString = () => {
  authString = `Bearer ${getCookie(USER_AUTHENTICATION_TOKEN)}`
}

updateAuthString()

export const authHeader = {
  Authorization: authString,
}
