import { gql, useLazyQuery } from '@apollo/client'
import { Container, Typography } from '@mui/material'
import { useCallback, useMemo, useState } from 'react'

import { Search, Playlist, Loading } from 'sharedComponents'
import { type TAutocompleteEntry, type TPlaylistEntry } from '../../sharedTypes'
import { useAlgorithmRoute } from '../../algorithms'

const CREATE_ENERGIZING_PLAYLIST_QUERY = gql`
query createEnergizingPlaylist($artistId: String!) {
    createEnergizingPlaylist(artistId: $artistId) {
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

const ProgressivelyEnergetic = () => {
  const [selectedArtist, setSelectedArtist] = useState<{ id: string, name: string } | null>(null)
  const [createEnergizingPlaylist, { loading, called, data }] = useLazyQuery<{ createEnergizingPlaylist: TPlaylistEntry[] }>(CREATE_ENERGIZING_PLAYLIST_QUERY)
  const [playlistEntries, setPlaylistEntries] = useState<TPlaylistEntry[]>([])

  const algorithm = useAlgorithmRoute()

  const resetState = useCallback(() => {
    setSelectedArtist(null)
    setPlaylistEntries([])
  }, [])

  const onCreateCallback = useCallback(() => {
    resetState()
  }, [resetState])

  const resultSelectedCallback = useCallback(async (value: TAutocompleteEntry) => {
    setSelectedArtist(value)

    const result = await createEnergizingPlaylist({ variables: { artistId: value.id } })
    if ((result.data?.createEnergizingPlaylist) != null) {
      setPlaylistEntries(result.data?.createEnergizingPlaylist)
    }
  }, [createEnergizingPlaylist])

  const content = useMemo(() => {
    if (!selectedArtist) {
      return (<Search label={'Artist'} resultSelectedCallback={resultSelectedCallback} />)
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
      <Playlist onCreateCallback={onCreateCallback} initialTitle={`Progressively Energetic with ${selectedArtist.name}`} playlistEntries={playlistEntries} />
    )
  }, [called, data, loading, playlistEntries, resultSelectedCallback, selectedArtist, onCreateCallback])

  return (
    <Container sx={{ marginTop: '2rem', justifyContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h2" gutterBottom>{algorithm.title}</Typography>
      <Typography variant="body1" gutterBottom>{algorithm.description}</Typography>
      <Container sx={{ maxWidth: '500px', width: '500px' }}>
        {content}
      </Container>
    </Container >
  )
}

export default ProgressivelyEnergetic
