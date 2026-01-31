import { gql } from '@apollo/client'
import { useLazyQuery } from '@apollo/client/react'
import { Avatar, debounce } from '@mui/material'
import Autocomplete from '@mui/material/Autocomplete'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/system'
import { context } from 'context'
import type { TAutocomplete, TAutocompleteEntry } from 'playlist-generator-utilities'
import { useContext, useEffect, useMemo, useState } from 'react'
import { logger } from 'utilities'

const AUTOCOMPLETE_QUERY = gql`
query Autocomplete($query: String!, $market: String!) {
    autocomplete(query: $query, market: $market) {
        name
        id
        image
        type
    }
  }
`

interface SearchParams {
  resultSelectedCallback: (data: TAutocompleteEntry) => void
  disabled?: boolean
}
const Search = ({ resultSelectedCallback, disabled }: SearchParams) => {
  const { state } = useContext(context)
  const [query, setQuery] = useState('')
  const [options, setOptions] = useState<readonly TAutocompleteEntry[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [autocomplete] = useLazyQuery<{ autocomplete: TAutocomplete['Response'] }>(AUTOCOMPLETE_QUERY)

  const fetch = useMemo(
    () =>
      debounce((request: string, handleResults: (results?: TAutocomplete['Response']) => void) => {
        autocomplete({ variables: { query: request, market: state.user!.market } })
          .then((result) => {
            if (result.data?.autocomplete != null) {
              handleResults(result.data?.autocomplete)
            } else {
              return []
            }
          })
          .catch((_e) => {
            logger('failed to autocomplete')
          })
      }, 400),
    [autocomplete, state.user],
  )

  useEffect(() => {
    setIsLoading(true)

    let active = true

    if (query === '') {
      return undefined
    }

    fetch(query, (results?: readonly TAutocompleteEntry[]) => {
      if (active) {
        let newOptions: readonly TAutocompleteEntry[] = []

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
  }, [query, fetch])

  return (
    <Autocomplete
      disabled={disabled}
      fullWidth
      getOptionLabel={(option) => option.name}
      options={options}
      loading={isLoading}
      clearOnBlur
      clearOnEscape
      loadingText="Enter a query to get started"
      noOptionsText="No Results"
      onChange={(_event: any, newValue: TAutocompleteEntry | null) => {
        newValue && resultSelectedCallback(newValue)
        setQuery('')
      }}
      onInputChange={(_event, newInputValue) => {
        setQuery(newInputValue)
      }}
      renderInput={(params) => <TextField {...params} label="Select an Artist or Track" fullWidth margin="normal" />}
      groupBy={(option) => option.type}
      renderOption={(props, option) => {
        return (
          <li {...props} key={option.id}>
            <Grid container alignItems="center">
              <Grid sx={{ display: 'flex', width: 44 }}>
                <Avatar variant="square" alt={option.name} src={option.image} />
              </Grid>
              <Grid sx={{ width: 'calc(100% - 44px)', wordWrap: 'break-word' }}>
                <Typography variant="body2" color="text.secondary">
                  {option.name}
                </Typography>
              </Grid>
            </Grid>
          </li>
        )
      }}
      renderGroup={(params) => {
        return (
          <li key={params.key}>
            <GroupHeader>{params.group}s</GroupHeader>
            <ul>{params.children}</ul>
          </li>
        )
      }}
    />
  )
}

const GroupHeader = styled('div')(({ theme }) => ({
  position: 'sticky',
  top: '-8px',
  padding: '4px 10px',
  color: theme.palette.text.primary,
  fontWeight: 900,
  backgroundColor: theme.palette.background.paper,
}))

export default Search
