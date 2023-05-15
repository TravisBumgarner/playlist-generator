import { gql, useLazyQuery } from '@apollo/client'
import { Box, Button, Container, ListItemButton } from '@mui/material'
import { useCallback, useState, useMemo } from 'react'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import TextField from '@mui/material/TextField'

import { type TAutocompleteEntry } from '../sharedTypes'

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
  const [autocomplete] = useLazyQuery<{ autocomplete: TAutocompleteEntry[] }>(AUTOCOMPLETE_QUERY)
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
    <Container sx={{ maxWidth: '500px' }}>
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
      <Button fullWidth onClick={handleSubmit} variant="contained">Search</Button>
      <Box sx={{ overflowY: 'scroll', maxHeight: '500px' }}>
        {AutocompleteItemsList}
      </Box>
    </Container>
  )
}

export default Search
