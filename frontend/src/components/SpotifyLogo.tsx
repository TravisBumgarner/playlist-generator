import { css } from '@emotion/react'
import spotifyLogo from '../static/spotify.png'
import { Box } from '@mui/system'
import { Typography } from '@mui/material'

const SHARED_HEIGHT = '18px'

const SpotifyLogo = () => {
  return (
    <Box css={wrapperCSS}>
      <Typography css={{ marginBottom: SHARED_HEIGHT }}>Powered by:</Typography>
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
  height: calc(${SHARED_HEIGHT} * 2);
  margin: ${SHARED_HEIGHT};
`

export default SpotifyLogo
