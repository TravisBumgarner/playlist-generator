import { gql, useLazyQuery } from '@apollo/client'
import { Button, Container, Typography } from '@mui/material'
import { useCallback, useContext, useMemo, useState } from 'react'

import { Search, Playlist, Loading } from 'sharedComponents'
import { type TFullControl, type TAutocompleteEntry, type TPlaylistEntry } from 'Utilties'
import { context } from 'context'

const CREATE_FULL_CONTROL_PLAYLIST = gql`
query createFullControlPlaylist($artistId: String!, $market: String!) {
  createFullControlPlaylist(artistId: $artistId, market: $market) {
        name
        id
        album {
          href
          name
        }
        artists {
          href
          name
        }
        uri
        image
        href
    }
  }
`

interface FullControlParams { title: string, description: string }
const FullControl = ({ title, description }: FullControlParams) => {
  const { state, dispatch } = useContext(context)
  const [selectedArist, setSelectedArtist] = useState<{ id: string, name: string } | null>(null)
  const [createFullControl] = useLazyQuery<{ createFullControlPlaylist: TFullControl['Response'] }, TFullControl['Request']>(CREATE_FULL_CONTROL_PLAYLIST, { fetchPolicy: 'network-only' })
  const [playlistEntries, setPlaylistEntries] = useState<TPlaylistEntry[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const resetState = useCallback(() => {
    setSelectedArtist(null)
    setPlaylistEntries([])
  }, [])

  const onCreateCallback = useCallback(() => {
    resetState()
  }, [resetState])

  const resultSelectedCallback = useCallback(async (value: TAutocompleteEntry) => {
    setSelectedArtist(value)
  }, [])

  const handleSubmit = useCallback(async () => {
    setIsLoading(true)
    if (!selectedArist) return

    if (!state.user) {
      dispatch({ type: 'ADD_ALERT', data: { text: 'User is not logged in', severity: 'error' } })
      return
    }

    const result = await createFullControl({ variables: { artistId: selectedArist.id, market: state.user.market } })
    if ((result.data?.createFullControlPlaylist) != null) {
      setPlaylistEntries(result.data?.createFullControlPlaylist)
    }

    setIsLoading(false)
  }, [selectedArist, createFullControl, dispatch, state.user])

  const content = useMemo(() => {
    if (selectedArist === null || playlistEntries === null) {
      return (
        <>
          <Search label={'Select an Artist'} resultSelectedCallback={resultSelectedCallback} />
          <Button disabled={selectedArist === null} onClick={handleSubmit}>Submit</Button>
        </>
      )
    }

    if (isLoading) {
      return (
        <>
          <Loading />
        </>
      )
    }

    if (playlistEntries && playlistEntries.length === 0) {
      return (
        <Typography>
          No results found
        </Typography>
      )
    }

    return (
      <Playlist onCreateCallback={onCreateCallback} initialTitle={`Full Control with ${selectedArist.name}`} playlistEntries={playlistEntries} />
    )
  }, [playlistEntries, handleSubmit, resultSelectedCallback, selectedArist, onCreateCallback, isLoading])

  return (
    <Container sx={{ marginTop: '2rem', justifyContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h2" gutterBottom>{title}</Typography>
      <Typography variant="body1" gutterBottom>{description}</Typography>
      <Container sx={{ maxWidth: '500px', width: '500px' }}>
        {content}
      </Container>
    </Container >
  )
}

export default FullControl
