import { gql, useLazyQuery } from '@apollo/client'
import { Container, Typography } from '@mui/material'
import { useCallback, useMemo, useState } from 'react'

import { Search, Playlist, Loading } from 'sharedComponents'
import { type TAutocompleteEntry, type TPlaylistEntry } from '../../sharedTypes'

const CREATE_PROGRESSIVELY_ENERGETIC_PLAYLIST_QUERY = gql`
query createProgressivelyEnergeticPlaylist($artistId: String!) {
    createProgressivelyEnergeticPlaylist(artistId: $artistId) {
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
  console.log('ProgressivelyEnergetic', title, description)
  const [selectedArtistStart, setSelectedArtistStart] = useState<{ id: string, name: string } | null>(null)
  const [selectedArtistEnd, setSelectedArtistEnd] = useState<{ id: string, name: string } | null>(null)
  const [createProgressivelyEnergeticPlaylist, { loading, called, data }] = useLazyQuery<{ createProgressivelyEnergeticPlaylist: TPlaylistEntry[] }>(CREATE_PROGRESSIVELY_ENERGETIC_PLAYLIST_QUERY)
  const [playlistEntries, setPlaylistEntries] = useState<TPlaylistEntry[]>([])

  const resetState = useCallback(() => {
    setSelectedArtistStart(null)
    setSelectedArtistEnd(null)
    setPlaylistEntries([])
  }, [])

  const onCreateCallback = useCallback(() => {
    resetState()
  }, [resetState])

  const resultSelectedCallbackStart = useCallback(async (value: TAutocompleteEntry) => {
    setSelectedArtistStart(value)
  }, [])

  const resultSelectedCallbackEnd = useCallback(async (value: TAutocompleteEntry) => {
    setSelectedArtistEnd(value)
  }, [])

  const content = useMemo(() => {
    if (selectedArtistStart === null || selectedArtistEnd === null) {
      return (
        <>
          <Search label={'Starting Artist'} resultSelectedCallback={resultSelectedCallbackStart} />
          <Search label={'Ending Artist'} resultSelectedCallback={resultSelectedCallbackEnd} />
        </>
      )
    }

    if (called && loading) {
      return (
        <>
          <Loading />
        </>
      )
    }

    if (!data) {
      return (
        <>
          <Typography variant="h2" gutterBottom>
            Fetching
          </Typography>
        </>
      )
    }
    return (
      <Playlist onCreateCallback={onCreateCallback} initialTitle={`From ${selectedArtistStart.name} to ${selectedArtistEnd.name}`} playlistEntries={playlistEntries} />
    )
  }, [called, data, loading, playlistEntries, resultSelectedCallbackStart, resultSelectedCallbackEnd, selectedArtistEnd, selectedArtistStart, onCreateCallback])

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
