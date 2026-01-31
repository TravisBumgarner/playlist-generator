import { css } from '@emotion/react'
import { Box, Typography } from '@mui/material'
import spotifyLogo from '../static/spotify_dark.png'
import Alert from './Alert'

const SHARED_HEIGHT = 18

const Footer = () => {
  return (
    <Box css={wrapperCSS}>
      <div></div>
      <Alert />
      <Box css={logoWrapperCSS}>
        <Typography css={{ marginBottom: `${SHARED_HEIGHT}px` }}>Powered by:</Typography>
        <Box component="img" src={spotifyLogo} css={imgCSS} />
      </Box>
    </Box>
  )
}

const logoWrapperCSS = css`
  display: flex;
  flex-direction: row;
  justify-content: end;
  align-items: end;
`

const wrapperCSS = css`
  flex-direction: row;
  display: flex;
  justify-content: space-between;
  align-items: center;

  > div {
    width: calc(100%/3);
  }
`

const imgCSS = css`
  height: calc(${SHARED_HEIGHT}px * 2);
  margin: ${SHARED_HEIGHT}px;
`

export default Footer
