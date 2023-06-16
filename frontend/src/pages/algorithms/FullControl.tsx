import { gql, useLazyQuery } from '@apollo/client'
import { Button, Container, Typography, MenuItem, Select, Box, InputLabel } from '@mui/material'
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'

import { Search, Playlist, Loading } from 'sharedComponents'
import { type TFullControl, type TAutocompleteEntry, type TPlaylistEntry, EFilterOption, type TFilter, EFilterValue, stringifyFilters } from 'Utilties'
import { context } from 'context'

interface FilterOptionInfo {
  title: string
  description: string
}

type FilterOptions = {
  [key in EFilterOption]: FilterOptionInfo;
}

const availableValues: FilterOptions = {
  [EFilterOption.Danceability]: {
    title: 'Danceability',
    description:
      'How suitable a track is for dancing based on a combination of musical elements including tempo, rhythm stability, beat strength, and overall regularity.'
  },
  [EFilterOption.Energy]: {
    title: 'Energy',
    description:
      'Represents a perceptual measure of intensity and activity. Typically, energetic tracks feel fast, loud, and noisy. Perceptual features contributing to this attribute include dynamic range, perceived loudness, timbre, onset rate, and general entropy.'
  },
  [EFilterOption.Popularity]: {
    title: 'Popularity',
    description: 'The popularity of the track as determined by Spotify.'
  },
  [EFilterOption.Tempo]: {
    title: 'Tempo',
    description:
      'The overall estimated tempo of a track in beats per minute (BPM).'
  },
  [EFilterOption.Valence]: {
    title: 'Valence',
    description:
      'A measure describing the musical positiveness conveyed by a track. Tracks with high valence sound more positive, while tracks with low valence sound more negative.'
  }
}

interface FullControlFiltersProps {
  filtersSelectedCallback: (filters: TFilter[]) => void
}

const FullControlFilters = ({ filtersSelectedCallback }: FullControlFiltersProps) => {
  const [selectedValues, setSelectedValues] = useState<EFilterOption[]>([])
  const [filters, setFilters] = useState<TFilter[]>([])

  const handleClick = (value: EFilterOption) => {
    if (selectedValues.includes(value)) {
      setSelectedValues(selectedValues.filter((v) => v !== value))
    } else {
      setSelectedValues([...selectedValues, value])
      setFilters([...filters, { value, start: EFilterValue.Medium, end: EFilterValue.Medium }])
    }
  }

  useEffect(() => {
    filtersSelectedCallback(filters.filter((filter) => selectedValues.includes(filter.value)))
  }, [filters, filtersSelectedCallback, selectedValues])

  const handleStartChange = (index: number, value: EFilterValue) => {
    const updatedFilters = [...filters]
    updatedFilters[index].start = value
    setFilters(updatedFilters)
  }

  const handleEndChange = (index: number, value: EFilterValue) => {
    const updatedFilters = [...filters]
    updatedFilters[index].end = value
    setFilters(updatedFilters)
  }

  return (
    <>
      <Typography align='center' variant="body1">What would you like to control?</Typography>
      {Object.values(EFilterOption).map((filterOption) => (
        <Box key={filterOption} sx={{ marginBottom: '0.5rem' }}>
          <Button
            fullWidth
            variant={selectedValues.includes(filterOption) ? 'contained' : 'outlined'}
            onClick={() => {
              handleClick(filterOption)
            }}
          >
            {availableValues[filterOption].title}
          </Button>
          {selectedValues.includes(filterOption) && (
            <>
              <Typography gutterBottom variant="body2">{availableValues[filterOption].description}</Typography>
              <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '1.5rem'
              }}>
                <Box sx={{ flexGrow: 0.48 }}>
                  <InputLabel id={`start-${filterOption}`}>Start playlist</InputLabel>
                  <Select
                    fullWidth
                    labelId={`start-${filterOption}`}
                    value={filters.find((filter) => filter.value === filterOption)?.start}
                    onChange={(event) => {
                      handleStartChange(
                        filters.findIndex((filter) => filter.value === filterOption),
                        event.target.value as EFilterValue
                      )
                    }}
                  >
                    <MenuItem value={EFilterValue.ExtraLow}>Extra Low</MenuItem>
                    <MenuItem value={EFilterValue.Low}>Low</MenuItem>
                    <MenuItem value={EFilterValue.Medium}>Medium</MenuItem>
                    <MenuItem value={EFilterValue.High}>High</MenuItem>
                    <MenuItem value={EFilterValue.ExtraHigh}>Extra High</MenuItem>
                  </Select>
                </Box>
                <Box sx={{ flexGrow: 0.48 }}>
                  <InputLabel id={`end-${filterOption}`}>End Playlist</InputLabel>
                  <Select
                    fullWidth
                    labelId={`end-${filterOption}`}
                    value={filters.find((filter) => filter.value === filterOption)?.end}
                    onChange={(event) => {
                      handleEndChange(
                        filters.findIndex((filter) => filter.value === filterOption),
                        event.target.value as EFilterValue
                      )
                    }}
                  >
                    <MenuItem value={EFilterValue.ExtraLow}>Extra Low</MenuItem>
                    <MenuItem value={EFilterValue.Low}>Low</MenuItem>
                    <MenuItem value={EFilterValue.Medium}>Medium</MenuItem>
                    <MenuItem value={EFilterValue.High}>High</MenuItem>
                    <MenuItem value={EFilterValue.ExtraHigh}>Extra High</MenuItem>
                  </Select>
                </Box>
              </Box>
            </>
          )}
        </Box >
      ))}
    </ >
  )
}

const CREATE_FULL_CONTROL_PLAYLIST = gql`
  query createFullControlPlaylist(
    $artistId: String!
    $market: String!
    $filters: String!
  ) {
    createFullControlPlaylist(
      artistId: $artistId
      market: $market
      filters: $filters
    ) {
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
  const [selectedFilters, setSelectedFilters] = useState<TFilter[]>([])
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

  const filtersSelectedCallback = useCallback(async (filters: TFilter[]) => {
    setSelectedFilters(filters)
  }, [])

  const handleSubmit = useCallback(async () => {
    setIsLoading(true)
    if (!selectedArist) return

    if (!state.user) {
      dispatch({ type: 'ADD_ALERT', data: { text: 'User is not logged in', severity: 'error' } })
      return
    }

    const result = await createFullControl({ variables: { artistId: selectedArist.id, market: state.user.market, filters: stringifyFilters(selectedFilters) } })
    if ((result.data?.createFullControlPlaylist) != null) {
      setPlaylistEntries(result.data?.createFullControlPlaylist)
    }

    setIsLoading(false)
  }, [selectedArist, createFullControl, dispatch, state.user, selectedFilters])

  const isDisabled = useMemo(() => selectedArist === null || selectedFilters.length === 0, [selectedArist, selectedFilters])
  const content = useMemo(() => {
    if (selectedArist === null || playlistEntries === null) {
      return (
        <>
          <Search label={'Select an Artist'} resultSelectedCallback={resultSelectedCallback} />
          <FullControlFilters filtersSelectedCallback={filtersSelectedCallback} />
          <Button fullWidth disabled={isDisabled} onClick={handleSubmit}>Submit</Button>
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
  }, [playlistEntries, handleSubmit, resultSelectedCallback, selectedArist, onCreateCallback, isLoading, filtersSelectedCallback, isDisabled])

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
