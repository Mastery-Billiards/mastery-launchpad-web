import {
  ComponentsProps,
  ComponentsVariants,
  ComponentsOverrides,
  Theme as MuiTheme,
  ButtonProps,
} from '@mui/material'

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    black: true
    white: true
    auto: true
  }
}

interface MuiButtonComponentType {
  styleOverrides?: ComponentsOverrides<MuiTheme>['MuiButton']
  defaultProps?: ComponentsProps['MuiButton']
  variants?: ComponentsVariants['MuiButton']
}

export const createColorStyle = ({
  ownerState: { color, variant },
}: {
  theme: MuiTheme
  ownerState: ButtonProps
}) => {
  if (!color) {
    return {
      backgroundColor: 'transparent',
    }
  }
  if (variant === 'contained') {
    return {
      color: 'white',
    }
  }
  return {}
}

export const MuiButtonComponent: MuiButtonComponentType = {
  variants: [],
  defaultProps: {
    variant: 'contained',
  },
  styleOverrides: {
    root: ({ theme, ownerState }) => {
      return {
        borderRadius: theme.spacing(0.5),
        textTransform: 'uppercase',
        boxShadow: 'none',
        ':hover': {
          boxShadow: 'none',
        },
        ...createColorStyle({ theme, ownerState }),
      }
    },
  },
}
