import { css } from '@emotion/react'
import spotifyLogo from '../static/spotify.png'
import { Box } from '@mui/system'
import { Typography } from '@mui/material'

const SpotifyLogo = () => {
  return (
    <Box css={wrapperCSS}>
      <Typography css={{ marginBottom: '36px' }}>Powered by:</Typography>
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
  height: 72px;
  margin: 36px;
`

export default SpotifyLogo
