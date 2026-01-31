import Box from '@mui/material/Box'
import type React from 'react'
import { useMemo } from 'react'

const PageWrapper = ({
  children,
  width = 'medium',
}: {
  children: React.ReactNode
  width?: 'small' | 'medium' | 'full'
}) => {
  const widthCSS = useMemo((): React.CSSProperties => {
    if (width === 'small') {
      return { width: '400px', maxWidth: '95%', margin: '0 auto' }
    }
    if (width === 'medium') {
      return { width: '600px', maxWidth: '95%', margin: '0 auto' }
    }
    return {}
  }, [width])

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: '2rem',
        marginBottom: '2rem',
        ...widthCSS,
      }}
    >
      {children}
    </Box>
  )
}

export default PageWrapper
