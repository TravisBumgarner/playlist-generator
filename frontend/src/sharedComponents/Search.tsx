import { gql, useLazyQuery } from '@apollo/client'
import { Box, Container, ListItemButton, Typography } from '@mui/material'
import { useState, useMemo } from 'react'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import TextField from '@mui/material/TextField'
import useAsyncEffect from 'use-async-effect'

import { type TAutocompleteEntry } from '../sharedTypes'
import Loading from './Loading'
import useDebounce from 'utilities'

const AUTOCOMPLETE_QUERY = gql`
query Autocomplete($query: String!) {
    autocomplete(query: $query, types: artist) {
        name
        id
        image
    }
  }
`

const Search = ({ resultSelectedCallback, label }: { label: string, resultSelectedCallback: (data: TAutocompleteEntry) => void }) => {
  const [autocomplete, { loading, called }] = useLazyQuery<{ autocomplete: TAutocompleteEntry[] }>(AUTOCOMPLETE_QUERY)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<TAutocompleteEntry[]>([])
  const debouncedQuery = useDebounce<string>(query, 500)

  useAsyncEffect(async () => {
    if (query.length === 0) return

    setResults([])
    const result = await autocomplete({ variables: { query } })
    if ((result.data?.autocomplete) != null) {
      setResults(result.data?.autocomplete)
    }
  }, [debouncedQuery])

  const AutocompleteItemsList = useMemo(() => {
    if (!called) {
      return (
        <Container>
          <Typography textAlign="center">Search for an artist for your playlist</Typography>
        </Container>
      )
    }

    if (loading) {
      return (
        <Container>
          <Loading />
        </Container>
      )
    }

    if (called && !loading && results.length === 0) {
      return (
        <Container>
          <Typography textAlign="center">Could not find anything, try again.</Typography>
        </Container>
      )
    }

    return results.map(data => {
      const handleClick = () => {
        resultSelectedCallback(data)
      }

      return (
        <ListItem key={data.id} >
          <ListItemButton onClick={handleClick}>
            <ListItemAvatar>
              <Avatar alt={data.name} src={data.image} />
            </ListItemAvatar>
            <ListItemText primary={data.name} />
          </ListItemButton>
        </ListItem >
      )
    })
  }, [resultSelectedCallback, results, called, loading])

  return (
    <Container>
      <TextField
        fullWidth
        label={label}
        type="search"
        value={query}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setQuery(event.target.value)
        }}
        margin="dense"
      />
      <Box component="ul" sx={{ overflowY: 'scroll', maxHeight: '500px' }}>
        {AutocompleteItemsList}
      </Box>
    </Container>
  )
}

export default Search
