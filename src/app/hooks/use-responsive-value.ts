'use client'
import { Breakpoint, useMediaQuery, useTheme } from '@mui/material'
import { useMemo } from 'react'

export type ResponsiveProp<T> = T | Partial<Record<Breakpoint, T>>

export const breakpoints: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl']

export function isValueWithResponsive<T>(
  value: ResponsiveProp<T>
): value is Record<Breakpoint, T> {
  return breakpoints.some(
    (key) =>
      typeof value === 'object' &&
      value &&
      'hasOwnProperty' in value &&
      value.hasOwnProperty(key)
  )
}

export function useResponsiveValue<T>(value: ResponsiveProp<T>): T {
  const theme = useTheme()
  const xs = useMediaQuery(theme.breakpoints.up('xs'))
  const sm = useMediaQuery(theme.breakpoints.up('sm'))
  const md = useMediaQuery(theme.breakpoints.up('md'))
  const lg = useMediaQuery(theme.breakpoints.up('lg'))
  const xl = useMediaQuery(theme.breakpoints.up('xl'))
  return useMemo(() => {
    if (isValueWithResponsive(value)) {
      const smallestBreakpoint = breakpoints.find(
        (breakpoint) => breakpoint in value
      )
      if (!smallestBreakpoint) {
        throw new Error("can't find smallest breakpoint")
      }
      let realValue: T = value[smallestBreakpoint]
      const breakpointChecks = {
        xs,
        sm,
        md,
        lg,
        xl,
      }
      for (const key of breakpoints) {
        if (key in value && breakpointChecks[key]) {
          realValue = value[key]
        }
      }
      return realValue
    }
    return value as T
  }, [lg, md, sm, value, xl, xs])
}
