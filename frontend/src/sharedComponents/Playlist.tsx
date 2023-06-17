import { Box, Link, css, Button, Typography, Card } from '@mui/material'
import { useCallback, useContext, useMemo, useState } from 'react'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import { type TPlaylistEntry } from 'playlist-generator-utilities'
import TextField from '@mui/material/TextField'
import { gql, useLazyQuery } from '@apollo/client'
import { useNavigate } from 'react-router'

import { ELocalStorageItems, getLocalStorage } from 'utilities'
import { context } from 'context'
import { Loading } from 'sharedComponents'

const playlistLinkCSS = css`
  text-decoration: none;
  margin-right: 0.25rem;
  
  &:hover {
    text-decoration: underline;
  }
`

const SAVE_PLAYLIST_QUERY = gql`
query savePlaylist($accessToken: String! $playlistTitle: String! $uris: [String]!) {
    savePlaylist(accessToken: $accessToken, playlistTitle: $playlistTitle, uris: $uris) 
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

interface PlaylistParams {
  playlistEntries: TPlaylistEntry[]
  initialTitle: string
  resetStateCallback: () => void
}
const Playlist = ({ playlistEntries, initialTitle, resetStateCallback }: PlaylistParams) => {
  const [savePlaylist] = useLazyQuery<{ savePlaylist: string }>(SAVE_PLAYLIST_QUERY)
  const [playlistTitle, setPlaylistTitle] = useState(initialTitle)
  const [isSavingPlaylist, setIsSavingPlaylist] = useState(false)
  const navigate = useNavigate()
  const { dispatch } = useContext(context)

  const handleSavePlaylistSubmit = useCallback(async () => {
    setIsSavingPlaylist(true)
    const uris = playlistEntries.map(({ uri }) => uri)

    const accessToken = getLocalStorage(ELocalStorageItems.AccessToken)
    if (!accessToken) {
      dispatch({ type: 'ADD_ALERT', data: { text: 'You need to login first', severity: 'info' } })
      navigate('/')
      return
    }
    const response = await savePlaylist({ variables: { uris, playlistTitle, accessToken } })
    if (response.data) {
      dispatch({ type: 'ADD_ALERT', data: { text: 'Playlist created!', url: response.data.savePlaylist, severity: 'success' } })
      resetStateCallback()
    } else {
      dispatch({ type: 'ADD_ALERT', data: { text: 'Failed to save playlist', severity: 'error' } })
    }

    setIsSavingPlaylist(false)
  }, [playlistEntries, playlistTitle, savePlaylist, navigate, dispatch, resetStateCallback])

  const Playlist = useMemo(() => {
    // Sometimes duplicate tracks come back in a playlist. Currently it doesn't look possible to dedup a playlist and keep its integrity.
    return playlistEntries.map((result, index) => <PlaylistItem key={`${result.uri}_${index}`} {...result} />)
  }, [playlistEntries])

  if (isSavingPlaylist) {
    return <Loading />
  }

  return (<Box>
    <TextField
      fullWidth
      label="Title this Playlist"
      type="title"
      margin="normal"
      value={playlistTitle}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
        setPlaylistTitle(event.target.value)
      }}
      css={{ marginBottom: '1rem' }}
    />
    <Typography variant="h6" component="div" gutterBottom>Preview Playlist</Typography>
    <Card component="ul" sx={{ overflowY: 'scroll', maxHeight: '30vh', margin: '0.5rem 0', border: '1px solid #363636', borderRadius: '0.4rem' }}>
      {Playlist}
    </Card>
    <Button
      fullWidth
      variant='contained' disabled={isSavingPlaylist} onClick={handleSavePlaylistSubmit}>Save it to your Spotify
    </Button>
    <Button
      fullWidth
      variant='text' onClick={resetStateCallback}>Start Over
    </Button>
  </Box >
  )
}

export default Playlist
