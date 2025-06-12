'use client'
import React, { useEffect } from 'react'
import './globals.css'
import LinearProgress from '@mui/material/LinearProgress'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter'
import { Josefin_Sans } from 'next/font/google'
import { ThemeProvider } from '@mui/material/styles'
import theme from '../theme/theme'
import Layout from '@/app/components/layout/layout'
import SnackbarProvider from '@/app/providers/snackbar-provider'
import { ROUTES_HEAD } from '@/app/constant/route-name'
import { usePathname } from 'next/navigation'
import { useUserInfo } from '@/app/stores/auth.store'
import { USER_AUTHENTICATION_INFO_KEY } from '@/app/constant/local-storage-key'

const openSans = Josefin_Sans({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-open-sans',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()
  const { setInfo } = useUserInfo()

  useEffect(() => {
    const storedObject = localStorage.getItem(USER_AUTHENTICATION_INFO_KEY)
    if (storedObject) {
      setInfo(JSON.parse(storedObject))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <html lang="en" className={openSans.variable}>
      <head>
        <title>{ROUTES_HEAD[pathname]}</title>
        <meta charSet="utf-8" />
      </head>
      <body>
        <AppRouterCacheProvider options={{ enableCssLayer: true, key: 'css' }}>
          <React.Suspense fallback={<LinearProgress />}>
            <ThemeProvider theme={theme}>
              <SnackbarProvider>
                {pathname === '/login' ? children : <Layout>{children}</Layout>}
              </SnackbarProvider>
            </ThemeProvider>
          </React.Suspense>
        </AppRouterCacheProvider>
      </body>
    </html>
  )
}
