'use client'
import * as React from 'react'
import { usePathname } from 'next/navigation'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Typography from '@mui/material/Typography'
import { ROUTES_TITLE } from '@/app/constant/route-name'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import HomeIcon from '@mui/icons-material/Home'
import Link from '@mui/material/Link'

export function CustomBreadcrumbs() {
  const pathname = usePathname()
  const pathSegments = pathname.split('/').filter((segment) => segment)

  const breadcrumbItems = pathSegments.map((segment, index) => {
    const href = `/${pathSegments.slice(0, index + 1).join('/')}`
    const isLastItem = index === pathSegments.length - 1

    return (
      <div key={segment}>
        {isLastItem ? (
          <Typography color="text.primary" fontSize={14}>
            {ROUTES_TITLE[href]}
          </Typography>
        ) : (
          <Link href={href} underline="hover" color="inherit" fontSize={14}>
            {ROUTES_TITLE[href]}
          </Link>
        )}
      </div>
    )
  })

  return (
    <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
      <Link
        sx={{ display: 'flex', alignItems: 'center' }}
        color="inherit"
        href="/"
        underline="hover"
        fontSize={14}
      >
        <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
        Trang chủ
      </Link>
      {breadcrumbItems}
    </Breadcrumbs>
  )
}
