import { gql, useLazyQuery } from '@apollo/client'
import { Button, Container, type SelectChangeEvent, Typography } from '@mui/material'
import { useCallback, useContext, useMemo, useState } from 'react'

import { Search, Playlist, Loading } from 'sharedComponents'
import { type TGoodBeatsToGoodSleeps, type TAutocompleteEntry, type TPlaylistEntry } from 'playlist-generator-utilities'
import { context } from 'context'
import { pageWrapperCSS } from 'theme'

const CREATE_GOOD_BEATS_TO_GOOD_SLEEPS_QUERY = gql`
query createGoodBeatsToGoodSleepsPlaylist($artistId: String!, $market: String!) {
  createGoodBeatsToGoodSleepsPlaylist(market: $market, artistId: $artistId) {
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

enum EWhiteNoise {
  White = 'White',
  Brown = 'Brown',
  Pink = 'Pink',
  Blue = 'Blue',
}

interface GoodBeatsToGoodSleepsProps { title: string, description: string }
const GoodBetsToGoodSleeps = ({ title, description }: GoodBeatsToGoodSleepsProps) => {
  const { state, dispatch } = useContext(context)
  const [selectedArtist, setSelectedArtist] = useState<{ id: string, name: string } | null>(null)
  const [createGoodBeatsToGoodSleepsPlaylist] = useLazyQuery<{ createGoodBeatsToGoodSleepsPlaylist: TGoodBeatsToGoodSleeps['Response'] }, TGoodBeatsToGoodSleeps['Request']>(CREATE_GOOD_BEATS_TO_GOOD_SLEEPS_QUERY, { fetchPolicy: 'network-only' })
  const [playlistEntries, setPlaylistEntries] = useState<TPlaylistEntry[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [whiteNoise, setWhiteNoise] = useState(EWhiteNoise.Brown)

  const resetState = useCallback(() => {
    setSelectedArtist(null)
    setPlaylistEntries(null)
  }, [])

  const resetStateCallback = useCallback(() => {
    resetState()
  }, [resetState])

  const resultSelectedCallback = useCallback(async (value: TAutocompleteEntry) => {
    setSelectedArtist(value)
  }, [])

  const handleChange = useCallback((event: SelectChangeEvent<EWhiteNoise>) => {
    setWhiteNoise(event.target.value as EWhiteNoise)
  }, [])

  const handleSubmit = useCallback(async () => {
    setIsLoading(true)
    if (!selectedArtist) return

    if (!state.user) {
      dispatch({ type: 'ADD_ALERT', data: { text: 'User is not logged in', severity: 'error' } })
      return
    }

    const result = await createGoodBeatsToGoodSleepsPlaylist({ variables: { artistId: selectedArtist.id, market: state.user.market } })
    if ((result.data?.createGoodBeatsToGoodSleepsPlaylist) != null) {
      setPlaylistEntries(result.data?.createGoodBeatsToGoodSleepsPlaylist)
    }

    setIsLoading(false)
  }, [selectedArtist, createGoodBeatsToGoodSleepsPlaylist, state.user, dispatch])

  const content = useMemo(() => {
    if (selectedArtist === null || playlistEntries === null) {
      return (
        <>
          <Search label={'Artist'} resultSelectedCallback={resultSelectedCallback} />
          {/* <InputLabel id="white-noise-selector">Noise Color</InputLabel>
          <Select
            fullWidth
            labelId="white-noise-selector"
            value={whiteNoise}
            label="White Noise"
            onChange={handleChange}
          >
            <MenuItem value={EWhiteNoise.Blue}>{EWhiteNoise.Blue}</MenuItem>
            <MenuItem value={EWhiteNoise.Brown}>{EWhiteNoise.Brown}</MenuItem>
            <MenuItem value={EWhiteNoise.White}>{EWhiteNoise.White}</MenuItem>
            <MenuItem value={EWhiteNoise.Pink}>{EWhiteNoise.Pink}</MenuItem>
          </Select> */}

          <Button fullWidth variant='contained' disabled={selectedArtist === null} onClick={handleSubmit}>Submit</Button>
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
      <Playlist resetStateCallback={resetStateCallback} initialTitle={`Good Beats to Good Sleeps ${selectedArtist.name}`} playlistEntries={playlistEntries} />
    )
  }, [playlistEntries, handleSubmit, resultSelectedCallback, selectedArtist, resetStateCallback, isLoading, whiteNoise, handleChange])

  return (
    <Container css={pageWrapperCSS}>
      <Typography variant="h2" gutterBottom>{title}</Typography>
      <Typography variant="body1" gutterBottom>{description}</Typography>
      <Container>
        {content}
      </Container>
    </Container >
  )
}

export default GoodBetsToGoodSleeps
