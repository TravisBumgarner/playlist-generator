import { css } from '@emotion/react'
import spotifyLogo from '../static/spotify_dark.png'
import { Box } from '@mui/system'
import { Typography } from '@mui/material'

const SHARED_HEIGHT = 18

const SpotifyLogo = () => {
  return (
    <Box css={wrapperCSS}>
      <Typography css={{ marginBottom: `${SHARED_HEIGHT}px` }}>Powered by:</Typography>
      <Box component="img" src={spotifyLogo} css={imgCSS} />
    </Box >
  )
}

const wrapperCSS = css`
  position:fixed;
  right: 0;
  bottom: 0;
  flex-direction: row;
  display: flex;
  justify-content: end;
  align-items: end;
`

const imgCSS = css`
  height: calc(${SHARED_HEIGHT}px * 2);
  margin: ${SHARED_HEIGHT}px;
`

export default SpotifyLogo
