import React, { FunctionComponent, useMemo } from 'react'
import { Dialog, Box, IconButton, Typography, Stack } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

export interface ConfirmDialogProps {
  open: boolean
  onClose: () => unknown
  title: string
  type?: 'default' | 'success' | 'error'
  children?: React.ReactNode
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

export const ConfirmDialog: FunctionComponent<ConfirmDialogProps> = ({
  open = false,
  onClose,
  title,
  children,
  size = 'sm',
  type = 'default',
}) => {
  const color = useMemo(() => {
    switch (type) {
      case 'success':
        return '#22BB33'
      case 'error':
        return '#FF3333'
      default:
        return '#D8D8D8'
    }
  }, [type])

  return (
    <Dialog
      open={open}
      sx={{ backdropFilter: 'blur(3px)' }}
      maxWidth={size}
      fullWidth
    >
      <Box py={1.5}>
        <Stack spacing={1}>
          <IconButton
            size="small"
            sx={{
              position: 'absolute',
              right: 8,
              top: 6,
              zIndex: 2,
            }}
            onClick={onClose}
          >
            <CloseIcon
              sx={{
                fontSize: 24,
                color: type === 'default' ? 'inherit' : 'white',
              }}
            />
          </IconButton>
          <Stack spacing={2} px={2.5} justifyContent="center">
            <Stack
              position="absolute"
              top={0}
              left={0}
              width="100%"
              height={50}
              bgcolor={color}
              justifyContent="center"
            >
              <Typography
                textTransform="uppercase"
                fontSize={18}
                fontWeight={700}
                textAlign="left"
                color={type === 'default' ? 'inherit' : 'white'}
                px={2}
              >
                {title}
              </Typography>
            </Stack>
            <Stack pt={4} pb={2}>
              {children}
            </Stack>
          </Stack>
        </Stack>
      </Box>
    </Dialog>
  )
}

ConfirmDialog.displayName = 'ConfirmDialog'
