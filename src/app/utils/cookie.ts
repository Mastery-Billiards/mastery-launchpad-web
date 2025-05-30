export function getCookie(cookieName: string) {
  if (typeof window !== 'undefined') {
    const name = `${cookieName}=`
    const decodedCookie = decodeURIComponent(document.cookie)
    const ca = decodedCookie.split(';')
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i]
      while (c.charAt(0) === ' ') {
        c = c.substring(1)
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length)
      }
    }
    return ''
  }
}

export function setCookie(cookieName: string, value: string, expiresDays = 7) {
  const d = new Date()
  d.setTime(d.getTime() + expiresDays * 24 * 60 * 60 * 1000)
  const expires = `expires=${d.toUTCString()}`
  document.cookie = `${cookieName}=${value};${expires};path=/`
}

export function removeCookie(cookieName: string) {
  document.cookie = `${cookieName}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`
}
