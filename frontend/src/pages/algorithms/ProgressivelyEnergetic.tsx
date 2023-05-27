import { gql, useLazyQuery } from '@apollo/client'
import { Button, Container, Typography } from '@mui/material'
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

  const [selectedArtist, setSelectedArtist] = useState<{ id: string, name: string } | null>(null)
  const [createProgressivelyEnergeticPlaylist] = useLazyQuery<{ createProgressivelyEnergeticPlaylist: TPlaylistEntry[] }>(CREATE_PROGRESSIVELY_ENERGETIC_PLAYLIST_QUERY)
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

    const result = await createProgressivelyEnergeticPlaylist({ variables: { artistId: selectedArtist.id } })
    if ((result.data?.createProgressivelyEnergeticPlaylist) != null) {
      setPlaylistEntries(result.data?.createProgressivelyEnergeticPlaylist)
    }

    setIsLoading(false)
  }, [selectedArtist, createProgressivelyEnergeticPlaylist])

  const content = useMemo(() => {
    if (selectedArtist === null || playlistEntries === null) {
      return (
        <>
          <Search label={'Artist'} resultSelectedCallback={resultSelectedCallback} />
          <Button onClick={handleSubmit}>Submit</Button>
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
