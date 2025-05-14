import React from 'react'
import './globals.css'
import LinearProgress from '@mui/material/LinearProgress'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter'
import { Josefin_Sans } from 'next/font/google'
import { ThemeProvider } from '@mui/material/styles'
import theme from '../theme'
import Layout from '@/app/components/layout/layout'
import SnackbarProvider from '@/app/providers/snackbar-provider'

const josefin = Josefin_Sans({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-josefin',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={josefin.variable}>
      <body>
        <AppRouterCacheProvider options={{ enableCssLayer: true, key: 'css' }}>
          <React.Suspense fallback={<LinearProgress />}>
            <ThemeProvider theme={theme}>
              <SnackbarProvider>
                <Layout>{children}</Layout>
              </SnackbarProvider>
            </ThemeProvider>
          </React.Suspense>
        </AppRouterCacheProvider>
      </body>
    </html>
  )
}
