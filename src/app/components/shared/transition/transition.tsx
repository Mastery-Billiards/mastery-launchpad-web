import React, { FC, ReactNode } from 'react'
import { Slide, SlideProps } from '@mui/material'

interface TransitionProps {
  children?: ReactNode
}

export const Transition: FC<TransitionProps & SlideProps> = (props) => {
  return (
    <Slide mountOnEnter unmountOnExit {...props}>
      {props.children}
    </Slide>
  )
}

Transition.displayName = 'Transition'
