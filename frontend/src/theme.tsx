import { type LinkProps, createTheme, css } from '@mui/material'
import { Link as RouterLink, type LinkProps as RouterLinkProps } from 'react-router-dom'
import { forwardRef } from 'react'

const LinkBehavior = forwardRef<HTMLAnchorElement, Omit<RouterLinkProps, 'to'> & { href: RouterLinkProps['to'] }
>((props, ref) => {
  const { href, ...other } = props
  return <RouterLink ref={ref} to={href} {...other} />
})
LinkBehavior.displayName = 'LinkBehavior'

export const theme = createTheme({
  palette: {
    background: {
      default: '#d4eaff'
    },
    text: {
      primary: '#363636'
    }
  },
  typography: {
    h2: {
      fontSize: '2rem',
      fontWeight: 700
    }
  },
  components: {
    MuiLink: {
      defaultProps: {
        component: LinkBehavior
      } as LinkProps
    },
    MuiButtonBase: {
      defaultProps: {
        LinkComponent: LinkBehavior
      }
    }
  }
})

export const pageWrapperCSS = css`
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-top: 50px;
  box-sizing: border-box;
  max-height: 90vh;
  overflow-y: scroll;
  max-width: 500px !important;
  text-align: center;
`
