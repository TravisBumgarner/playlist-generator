import TextField from '@mui/material/TextField'
import React, { useMemo, useContext, useEffect, useState } from 'react'
import Autocomplete from '@mui/material/Autocomplete'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { debounce } from '@mui/material/utils'
import { gql, useLazyQuery } from '@apollo/client'
import { type TAutocompleteEntry } from 'playlist-generator-utilities'
import { logger } from 'utilities'
import { Avatar, FormControlLabel, Box, FormControl, FormLabel, RadioGroup, Radio } from '@mui/material'
import { context } from 'context'

enum Filter {
  Album = 'album',
  Artist = 'artist',
  Playlist = 'playlist',
  Track = 'track'
}

const AUTOCOMPLETE_QUERY = gql`
query Autocomplete($query: String!, $market: String!, $type: String!) {
    autocomplete(query: $query, type: $type, market: $market) {
        name
        id
        image
    }
  }
`

interface SearchV2Params {
  label: string
  resultSelectedCallback: (data: TAutocompleteEntry) => void
}
const SearchV2 = ({ label, resultSelectedCallback }: SearchV2Params) => {
  const { state } = useContext(context)
  const [selected, setSelected] = useState<TAutocompleteEntry | null>(null)
  const [query, setQuery] = useState('')
  const [options, setOptions] = useState<readonly TAutocompleteEntry[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [autocomplete] = useLazyQuery<{ autocomplete: TAutocompleteEntry[] }>(AUTOCOMPLETE_QUERY)
  const [selectedType, setSelectedType] = useState<Filter>(Filter.Artist)

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedType(event.target.value as Filter)
  }

  const fetch = useMemo(
    () =>
      debounce(
        (
          request: string,
          handleResults: (results?: readonly TAutocompleteEntry[]) => void
        ) => {
          autocomplete({ variables: { query: request, market: state.user!.market, type: selectedType } }).then(result => {
            if ((result.data?.autocomplete) != null) {
              handleResults(result.data?.autocomplete)
            } else {
              return []
            }
          }).catch(e => {
            logger('failed to autocomplete')
          })
        },
        400
      ),
    [autocomplete, state.user, selectedType]
  )

  useEffect(() => {
    setIsLoading(true)

    let active = true

    if (query === '') {
      setOptions(selected ? [selected] : [])
      return undefined
    }

    fetch(query, (results?: readonly TAutocompleteEntry[]) => {
      if (active) {
        let newOptions: readonly TAutocompleteEntry[] = []

        if (selected) {
          newOptions = [selected]
        }

        if (results) {
          newOptions = [...newOptions, ...results]
        }

        setOptions(newOptions)
      }
      setIsLoading(false)
    })

    return () => {
      active = false
    }
  }, [selected, query, fetch])
  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="body2" sx={{ marginRight: '1rem' }} color="text.secondary">
          Filter Search Results by:
        </Typography>
        <FormControl component="fieldset">
          <RadioGroup row aria-label="media-type" name="media-type" value={selectedType} onChange={handleRadioChange}>
            <FormControlLabel value="album" control={<Radio />} label="Album" />
            <FormControlLabel value="artist" control={<Radio />} label="Artist" />
            <FormControlLabel value="playlist" control={<Radio />} label="Playlist" />
            <FormControlLabel value="track" control={<Radio />} label="Track" />
          </RadioGroup>
        </FormControl>
      </Box>      <Autocomplete
        fullWidth
        getOptionLabel={(option) => option.name}
        options={options}
        value={selected}
        loading={isLoading}
        clearOnBlur
        clearOnEscape
        loadingText="Enter a query to get started"
        noOptionsText="No Results"
        onChange={(event: any, newValue: TAutocompleteEntry | null) => {
          setOptions(newValue ? [newValue, ...options] : options)
          newValue && resultSelectedCallback(newValue)
          setSelected(newValue)
        }}
        onInputChange={(event, newInputValue) => {
          setQuery(newInputValue)
        }}
        renderInput={(params) => (
          <TextField {...params} label={label} fullWidth margin='normal' />
        )}
        renderOption={(props, option) => {
          return (
            <li {...props} key={option.id}>
              <Grid container alignItems="center">
                <Grid item sx={{ display: 'flex', width: 44 }}>
                  <Avatar variant="square" alt={option.name} src={option.image} />
                </Grid>
                <Grid item sx={{ width: 'calc(100% - 44px)', wordWrap: 'break-word' }}>
                  <Typography variant="body2" color="text.secondary">
                    {option.name}
                  </Typography>
                </Grid>
              </Grid>
            </li>
          )
        }}
      />
    </>
  )
}

export default SearchV2
