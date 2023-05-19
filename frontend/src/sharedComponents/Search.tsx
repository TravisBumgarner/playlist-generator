import { gql, useLazyQuery } from '@apollo/client'
import { Box, Button, Container, ListItemButton, Typography } from '@mui/material'
import { useCallback, useState, useMemo } from 'react'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import TextField from '@mui/material/TextField'

import { type TAutocompleteEntry } from '../sharedTypes'
import Loading from './Loading'

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

  const handleSubmit = useCallback(async () => {
    setResults([])
    const result = await autocomplete({ variables: { query } })
    if ((result.data?.autocomplete) != null) {
      setResults(result.data?.autocomplete)
    }
  }, [query, autocomplete])

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
  }, [resultSelectedCallback, results])

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
      <Button disabled={query.length === 0} fullWidth onClick={handleSubmit} variant="contained">Search</Button>
      <Box component="ul" sx={{ overflowY: 'scroll', maxHeight: '500px' }}>
        {AutocompleteItemsList}
      </Box>
    </Container>
  )
}

export default Search
