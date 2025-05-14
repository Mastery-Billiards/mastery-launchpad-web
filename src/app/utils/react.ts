import { FC, PropsWithChildren } from 'react'

export type ParentFC<P = object> = FC<PropsWithChildren<P>>
