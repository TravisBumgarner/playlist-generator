import { gql, useLazyQuery } from '@apollo/client'
import { Box, Container, List, ListItemButton, Typography } from '@mui/material'
import { useState, useMemo, useEffect } from 'react'
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
  const [autocomplete, { loading }] = useLazyQuery<{ autocomplete: TAutocompleteEntry[] }>(AUTOCOMPLETE_QUERY)
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

  useEffect(() => {
    if (debouncedQuery.length === 0) {
      setResults([])
    }
  }, [debouncedQuery])

  const Results = useMemo(() => {
    if (debouncedQuery.length === 0) {
      return (
        <Container>
          <Typography textAlign="center">Search for an artist to generate your playlist.</Typography>
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

    if (query && !loading && results.length === 0) {
      return (
        <Container>
          <Typography textAlign="center">Could not find anything, try again.</Typography>
        </Container>
      )
    }

    const ListItems = results.map(data => {
      const handleClick = () => {
        resultSelectedCallback(data)
      }

      return (
        <ListItem key={data.id} >
          <ListItemButton onClick={handleClick}>
            <ListItemAvatar>
              <Avatar variant="square" alt={data.name} src={data.image} />
            </ListItemAvatar>
            <ListItemText primary={data.name} />
          </ListItemButton>
        </ListItem >
      )
    })

    return (
      <List>
        {ListItems}
      </List>
    )
  }, [resultSelectedCallback, results, query, loading])

  return (
    <Container>
      <TextField
        fullWidth
        label={label}
        type="search"
        value={query}
        autoFocus
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setQuery(event.target.value)
        }}
        margin="normal"
      />
      <Box sx={{ overflowY: 'auto', maxHeight: '500px', height: '500px' }}>
        {Results}
      </Box>
    </Container>
  )
}

export default Search
