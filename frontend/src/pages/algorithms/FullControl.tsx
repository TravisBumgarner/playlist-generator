import { useLazyQuery } from '@apollo/client'
import { Button, Typography, MenuItem, Select, Box, InputLabel } from '@mui/material'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { Search } from 'sharedComponents'
import { type TFullControl, type TAutocompleteEntry, EFilterOption, type TFilter, EFilterValue, stringifyFilters, type TSharedRequestParams } from 'playlist-generator-utilities'
import AlgorithmWrapper from './AlgorithmWrapper'
import { CREATE_FULL_CONTROL_PLAYLIST } from './queries'

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

interface FullControlParams { title: string, description: string }
const FullControl = ({ title, description }: FullControlParams) => {
  const [selectedArtist, setSelectedArtist] = useState<{ id: string, name: string } | null>(null)
  const [selectedFilters, setSelectedFilters] = useState<TFilter[]>([])
  const [createFullControl] = useLazyQuery<{ createFullControlPlaylist: TFullControl['Response'] }, TFullControl['Request']>(CREATE_FULL_CONTROL_PLAYLIST, { fetchPolicy: 'network-only' })

  const resetState = useCallback(() => {
    setSelectedArtist(null)
  }, [])

  const resultSelectedCallback = useCallback(async (value: TAutocompleteEntry) => {
    setSelectedArtist(value)
  }, [])

  const filtersSelectedCallback = useCallback(async (filters: TFilter[]) => {
    setSelectedFilters(filters)
  }, [])

  const apiCall = useCallback(async (shared: TSharedRequestParams) => {
    const result = await createFullControl({ variables: { artistId: selectedArtist!.id, filters: stringifyFilters(selectedFilters), ...shared } })
    return result.data?.createFullControlPlaylist
  }, [selectedArtist, createFullControl, selectedFilters])

  const initialPlaylistDescription = useMemo(() => {
    let result = description
    result += ' Selected Filters - '
    result += selectedFilters.map(({ value, start, end }) => ` ${availableValues[value].title} from ${start} to ${end}`).join(', ')
    result += '.'
    return result
  }, [description, selectedFilters])

  return (
    <AlgorithmWrapper
      title={title}
      initialPlaylistDescription={initialPlaylistDescription}
      description={description}
      searchParams={
        <>
          <Search label={'Select an Artist'} resultSelectedCallback={resultSelectedCallback} />
          <FullControlFilters filtersSelectedCallback={filtersSelectedCallback} />
        </>
      }
      searchDisabled={selectedArtist === null || selectedFilters.length === 0}
      apiCall={apiCall}
      resetStateCallback={resetState}
      initialPlaylistTitle={`Full Control with ${selectedArtist?.name}`}
    >
    </AlgorithmWrapper >
  )
}

export default FullControl
