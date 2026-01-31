import { createTheme, type LinkProps, type ThemeOptions } from '@mui/material'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import merge from 'lodash/merge'
import { forwardRef, useMemo } from 'react'
import { Link as RouterLink, type LinkProps as RouterLinkProps } from 'react-router-dom'
import { BORDER_RADIUS, DARK_BUTTON_STYLES, FONT_SIZES, LIGHT_BUTTON_STYLES, PALETTE } from './styles/styleConsts'

const LinkBehavior = forwardRef<HTMLAnchorElement, Omit<RouterLinkProps, 'to'> & { href: RouterLinkProps['to'] }>(
  (props, ref) => {
    const { href, ...other } = props
    return <RouterLink ref={ref} to={href} {...other} />
  },
)
LinkBehavior.displayName = 'LinkBehavior'

const baseThemeOptions: ThemeOptions = {
  components: {
    MuiLink: {
      defaultProps: {
        component: LinkBehavior,
      } as LinkProps,
    },
    MuiButtonBase: {
      defaultProps: {
        LinkComponent: LinkBehavior,
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: BORDER_RADIUS.ZERO.PX,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: BORDER_RADIUS.ZERO.PX,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: BORDER_RADIUS.ZERO.PX,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        contained: {
          fontWeight: 900,
        },
        outlined: {
          fontWeight: 600,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          borderRadius: BORDER_RADIUS.ZERO.PX,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: BORDER_RADIUS.ZERO.PX,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: BORDER_RADIUS.ZERO.PX,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: BORDER_RADIUS.ZERO.PX,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: BORDER_RADIUS.ZERO.PX,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          borderRadius: BORDER_RADIUS.ZERO.PX,
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        paper: {
          borderRadius: BORDER_RADIUS.ZERO.PX,
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        thumb: {
          borderRadius: BORDER_RADIUS.ZERO.PX,
        },
        track: {
          borderRadius: BORDER_RADIUS.ZERO.PX,
        },
        rail: {
          borderRadius: BORDER_RADIUS.ZERO.PX,
        },
      },
    },
  },
  typography: {
    fontFamily: '"Satoshi", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: FONT_SIZES.HUGE.PX,
      fontWeight: 900,
    },
    h2: {
      fontSize: FONT_SIZES.LARGE.PX,
      fontWeight: 900,
    },
    h3: {
      fontSize: FONT_SIZES.MEDIUM.PX,
      fontWeight: 900,
    },
    body1: {
      fontSize: FONT_SIZES.MEDIUM.PX,
    },
    body2: {
      fontSize: FONT_SIZES.SMALL.PX,
    },
  },
}

const getThemeOptions = (mode: 'light' | 'dark'): ThemeOptions => ({
  palette: {
    mode,
    background: {
      default: mode === 'light' ? PALETTE.grayscale[50] : PALETTE.grayscale[900],
      paper: mode === 'light' ? PALETTE.grayscale[50] : PALETTE.grayscale[800],
    },
    text: {
      primary: mode === 'light' ? PALETTE.grayscale[900] : PALETTE.grayscale[100],
      secondary: mode === 'light' ? PALETTE.grayscale[800] : PALETTE.grayscale[200],
    },
    divider: mode === 'light' ? PALETTE.grayscale[200] : PALETTE.grayscale[800],
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          color: mode === 'light' ? PALETTE.grayscale[700] : PALETTE.grayscale[300],
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: mode === 'light' ? PALETTE.grayscale[700] : PALETTE.grayscale[300],
          },
        },
        notchedOutline: {
          borderColor: mode === 'light' ? PALETTE.grayscale[400] : PALETTE.grayscale[600],
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          '&.Mui-focused': {
            color: mode === 'light' ? PALETTE.grayscale[700] : PALETTE.grayscale[300],
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        contained: {
          color: mode === 'light' ? LIGHT_BUTTON_STYLES.color : DARK_BUTTON_STYLES.color,
          backgroundColor: mode === 'light' ? LIGHT_BUTTON_STYLES.background : DARK_BUTTON_STYLES.background,
          '&:hover': {
            backgroundColor:
              mode === 'light' ? LIGHT_BUTTON_STYLES.hoverBackground : DARK_BUTTON_STYLES.hoverBackground,
          },
          '&:disabled': {
            backgroundColor: mode === 'light' ? PALETTE.grayscale[400] : PALETTE.grayscale[700],
          },
        },
        outlined: {
          color: mode === 'light' ? PALETTE.grayscale[700] : PALETTE.grayscale[100],
          borderColor: mode === 'light' ? PALETTE.grayscale[700] : PALETTE.grayscale[200],
          '&:hover': {
            backgroundColor: mode === 'light' ? PALETTE.grayscale[100] : PALETTE.grayscale[700],
          },
        },
        text: {
          color: mode === 'light' ? PALETTE.grayscale[700] : PALETTE.grayscale[100],
          '&:hover': {
            backgroundColor: mode === 'light' ? PALETTE.grayscale[100] : PALETTE.grayscale[700],
          },
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: mode === 'light' ? PALETTE.grayscale[800] : PALETTE.grayscale[100],
          '&:hover': {
            color: mode === 'light' ? PALETTE.grayscale[800] : PALETTE.grayscale[100],
          },
          '&:visited': {
            color: mode === 'light' ? PALETTE.grayscale[800] : PALETTE.grayscale[100],
          },
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        thumb: {
          color: mode === 'light' ? PALETTE.grayscale[900] : PALETTE.grayscale[100],
        },
        track: {
          color: mode === 'light' ? PALETTE.grayscale[900] : PALETTE.grayscale[100],
        },
        rail: {
          color: mode === 'light' ? PALETTE.grayscale[400] : PALETTE.grayscale[600],
        },
        markLabel: {
          color: mode === 'light' ? PALETTE.grayscale[700] : PALETTE.grayscale[300],
        },
      },
    },
  },
})

const lightTheme = createTheme(merge({}, baseThemeOptions, getThemeOptions('light')))
const darkTheme = createTheme(merge({}, baseThemeOptions, getThemeOptions('dark')))

export const AppThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')

  const theme = useMemo(() => (prefersDarkMode ? darkTheme : lightTheme), [prefersDarkMode])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}
