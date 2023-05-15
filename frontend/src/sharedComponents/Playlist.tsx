import { Box } from '@mui/material'
import { useMemo } from 'react'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import { type TPlaylistEntry } from 'sharedTypes'

const PlaylistItem = (data: TPlaylistEntry) => {
  return (
    <ListItem>
      <ListItemAvatar>
        <Avatar alt={data.name} />
      </ListItemAvatar>
      <ListItemText primary={data.name} secondary={data.artists} />
    </ListItem >
  )
}

const Playlist = ({ playlistEntries }: { playlistEntries: TPlaylistEntry[] }) => {
  const Playlist = useMemo(() => {
    return playlistEntries.map(result => <PlaylistItem key={result.uri} {...result} />)
  }, [playlistEntries])

  return (<Box>
    {Playlist}
  </Box>
  )
}

export default Playlist
