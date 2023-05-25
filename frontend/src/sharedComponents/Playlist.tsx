import { Box, Link, css } from '@mui/material'
import { useMemo } from 'react'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import { type TPlaylistEntry } from 'sharedTypes'

const playlistLinkCSS = css`
  text-decoration: none;
  color: black;
  margin-right: 0.25rem;
  
  &:hover {
    text-decoration: underline;
  }
`

const PlaylistItem = (data: TPlaylistEntry) => {
  const Artists = useMemo(() => {
    return data.artists.map(({ name, href }) => (<Link css={playlistLinkCSS} key={href} target="_blank" href={href}>{name}</Link>))
  }, [data.artists])

  return (
    <ListItem>
      <ListItemAvatar>
        <Link target="_blank" href={data.album.href}>
          <Avatar variant="square" alt={data.name} src={data.image} />
        </Link>
      </ListItemAvatar>

      <ListItemText primary={<Link css={playlistLinkCSS} target="_blank" href={data.href}>{data.name}</Link>} secondary={Artists} />
    </ListItem >
  )
}

const Playlist = ({ playlistEntries }: { playlistEntries: TPlaylistEntry[] }) => {
  const Playlist = useMemo(() => {
    return playlistEntries.map(result => <PlaylistItem key={result.uri} {...result} />)
  }, [playlistEntries])

  return (<Box component="ul" sx={{ overflowY: 'scroll', maxHeight: '500px' }}>
    {Playlist}
  </Box>
  )
}

export default Playlist
