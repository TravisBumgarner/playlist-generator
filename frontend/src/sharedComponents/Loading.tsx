import { IconButton, css } from '@mui/material'
import LoopIcon from '@mui/icons-material/Loop'

const Loading = () => {
  return (
    <IconButton
      size="large"
      edge="start"
      color="inherit"
      aria-label="menu"
      sx={{ mr: 2 }}>
      <LoopIcon

        css={iconCSS}
      />
    </IconButton>
  )
}

const iconCSS = css`
  animation: rotating 2s linear infinite;
  @keyframes rotating {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
}
`

export default Loading
