import { gql, useLazyQuery } from '@apollo/client'
import { Button, Container, Typography } from '@mui/material'
import { useCallback, useContext, useMemo, useState } from 'react'

import { Search, Playlist, Loading } from 'sharedComponents'
import { type TProgressivelyEnergetic, type TAutocompleteEntry, type TPlaylistEntry } from 'Utilties'
import { context } from 'context'

const CREATE_PROGRESSIVELY_ENERGETIC_PLAYLIST_QUERY = gql`
query createProgressivelyEnergeticPlaylist($artistId: String!, $market: String!) {
  createProgressivelyEnergeticPlaylist(market: $market, artistId: $artistId) {
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

interface ProgressivelyEnergeticProps { title: string, description: string }
const ProgressivelyEnergetic = ({ title, description }: ProgressivelyEnergeticProps) => {
  const { state, dispatch } = useContext(context)
  const [selectedArtist, setSelectedArtist] = useState<{ id: string, name: string } | null>(null)
  const [createProgressivelyEnergeticPlaylist] = useLazyQuery<{ createProgressivelyEnergeticPlaylist: TProgressivelyEnergetic['Response'] }, TProgressivelyEnergetic['Request']>(CREATE_PROGRESSIVELY_ENERGETIC_PLAYLIST_QUERY, { fetchPolicy: 'network-only' })
  const [playlistEntries, setPlaylistEntries] = useState<TPlaylistEntry[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const resetState = useCallback(() => {
    setSelectedArtist(null)
    setPlaylistEntries(null)
  }, [])

  const onCreateCallback = useCallback(() => {
    resetState()
  }, [resetState])

  const resultSelectedCallback = useCallback(async (value: TAutocompleteEntry) => {
    setSelectedArtist(value)
  }, [])

  const handleSubmit = useCallback(async () => {
    setIsLoading(true)
    if (!selectedArtist) return

    if (!state.user) {
      dispatch({ type: 'ADD_ALERT', data: { text: 'User is not logged in', severity: 'error' } })
      return
    }

    const result = await createProgressivelyEnergeticPlaylist({ variables: { artistId: selectedArtist.id, market: state.user.market } })
    if ((result.data?.createProgressivelyEnergeticPlaylist) != null) {
      setPlaylistEntries(result.data?.createProgressivelyEnergeticPlaylist)
    }

    setIsLoading(false)
  }, [selectedArtist, createProgressivelyEnergeticPlaylist, state.user, dispatch])

  const content = useMemo(() => {
    if (selectedArtist === null || playlistEntries === null) {
      return (
        <>
          <Search label={'Artist'} resultSelectedCallback={resultSelectedCallback} />
          <Button disabled={selectedArtist === null} onClick={handleSubmit}>Submit</Button>
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
      <Playlist onCreateCallback={onCreateCallback} initialTitle={`Progressively Energetic with ${selectedArtist.name}`} playlistEntries={playlistEntries} />
    )
  }, [playlistEntries, handleSubmit, resultSelectedCallback, selectedArtist, onCreateCallback, isLoading])

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

export default ProgressivelyEnergetic
