import { Box, Link, css, Button } from '@mui/material'
import { useCallback, useContext, useMemo, useState } from 'react'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import { type TPlaylistEntry } from 'sharedTypes'
import TextField from '@mui/material/TextField'
import { gql, useLazyQuery } from '@apollo/client'
import { useNavigate } from 'react-router'

import { ELocalStorageItems, getLocalStorage } from 'utilities'
import { context } from 'context'
import { Loading } from 'sharedComponents'

const playlistLinkCSS = css`
  text-decoration: none;
  color: black;
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
  onCreateCallback: () => void
}
const Playlist = ({ playlistEntries, initialTitle, onCreateCallback }: PlaylistParams) => {
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
      onCreateCallback()
    } else {
      dispatch({ type: 'ADD_ALERT', data: { text: 'Failed to save playlist', severity: 'error' } })
    }

    setIsSavingPlaylist(false)
  }, [playlistEntries, playlistTitle, savePlaylist, navigate, dispatch, onCreateCallback])

  const Playlist = useMemo(() => {
    return playlistEntries.map(result => <PlaylistItem key={result.uri} {...result} />)
  }, [playlistEntries])

  if (isSavingPlaylist) {
    return <Loading />
  }

  return (<Box component="ul" sx={{ overflowY: 'scroll', maxHeight: '500px' }}>
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
    <Button
      css={{ margin: '1rem 0' }}
      variant='text' onClick={onCreateCallback}>Start Over
    </Button>
    <Button
      css={{ margin: '1rem 0' }}
      variant='contained' disabled={isSavingPlaylist} onClick={handleSavePlaylistSubmit}>Save it to your Spotify
    </Button>
    {Playlist}
  </Box>
  )
}

export default Playlist
