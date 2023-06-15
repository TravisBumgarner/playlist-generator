import { gql, useLazyQuery } from '@apollo/client'
import { Button, Container, Typography, MenuItem, Select, Box, InputLabel } from '@mui/material'
import React, { useCallback, useContext, useMemo, useState } from 'react'

import { Search, Playlist, Loading } from 'sharedComponents'
import { type TFullControl, type TAutocompleteEntry, type TPlaylistEntry } from 'Utilties'
import { context } from 'context'

enum AvailableValue {
  Acousticness = 'Acousticness',
  Danceability = 'Danceability',
  Energy = 'Energy',
  Instrumentalness = 'Instrumentalness',
  Popularity = 'Popularity',
  Tempo = 'Tempo',
  Mood = 'Mood', // Valence
}

interface Item {
  value: AvailableValue
  start: string
  end: string
}

const FullControlFilters = () => {
  const [selectedValues, setSelectedValues] = useState<AvailableValue[]>([])
  const [items, setItems] = useState<Item[]>([])

  const handleClick = (value: AvailableValue) => {
    if (selectedValues.includes(value)) {
      setSelectedValues(selectedValues.filter((v) => v !== value))
    } else {
      setSelectedValues([...selectedValues, value])
      setItems([...items, { value, start: 'medium', end: 'medium' }])
    }
  }

  const handleSubmit = () => {
    console.log(items.filter(({ value }) => selectedValues.includes(value)))
  }

  const handleStartChange = (index: number, value: string) => {
    const updatedItems = [...items]
    updatedItems[index].start = value
    setItems(updatedItems)
  }

  const handleEndChange = (index: number, value: string) => {
    const updatedItems = [...items]
    updatedItems[index].end = value
    setItems(updatedItems)
  }

  return (
    <Container>
      <Typography variant="h1">Sandbox</Typography>
      <Typography variant="body1">What would you like to control?</Typography>
      {Object.values(AvailableValue).map((value) => (
        <Box key={value} sx={{ marginBottom: '1rem', display: 'flex', height: '70px', boxSizing: 'border-box' }}>
          <Button
            variant={selectedValues.includes(value) ? 'contained' : 'outlined'}
            onClick={() => {
              handleClick(value)
            }}
            sx={{ marginRight: '0.5rem', width: '250px' }}
          >
            {value}
          </Button>
          {selectedValues.includes(value) && (
            <>
              <Box sx={{ flexGrow: 0.5 }}>
                <InputLabel id="start">Start playlist</InputLabel>
                <Select
                  fullWidth
                  labelId="start"
                  value={items.find((item) => item.value === value)?.start}
                  onChange={(event) => {
                    handleStartChange(
                      items.findIndex((item) => item.value === value),
                      event.target.value
                    )
                  }}
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </Select>
              </Box>
              <Box sx={{ flexGrow: 0.5 }}>
                <InputLabel id="end">End Playlist</InputLabel>
                <Select
                  fullWidth
                  labelId="end"
                  value={items.find((item) => item.value === value)?.end}
                  onChange={(event) => {
                    handleEndChange(
                      items.findIndex((item) => item.value === value),
                      event.target.value
                    )
                  }}
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </Select>
              </Box>
            </>
          )}
        </Box >
      ))}
      <Button disabled={selectedValues.length === 0} fullWidth variant="contained" onClick={handleSubmit}>
        Submit
      </Button>
    </Container >
  )
}

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
          <FullControlFilters />
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
