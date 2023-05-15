import { gql, useLazyQuery } from '@apollo/client'
import { Box, Button } from '@mui/material'
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

const AutocompleteItem = ({ data, resultSelectedCallback }: { data: TAutocompleteEntry, resultSelectedCallback: (artistId: string) => void }) => {
  const handleClick = useCallback(() => { resultSelectedCallback(data.id) }, [data.id, resultSelectedCallback])
  return (
    <ListItem onClick={handleClick}>
      <ListItemAvatar>
        <Avatar alt={data.name} src={data.image} />
      </ListItemAvatar>
      <ListItemText primary={data.name} />
    </ListItem >
  )
}

const Search = ({ resultSelectedCallback }: { resultSelectedCallback: (artistId: string) => void }) => {
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

  const handleResultSelected = useCallback((artistId: string) => {
    resultSelectedCallback(artistId)
    setResults([])
  }, [resultSelectedCallback])

  const AutocompleteItemsList = useMemo(() => {
    return results.map(data => <AutocompleteItem resultSelectedCallback={handleResultSelected} key={data.id} data={data} />)
  }, [results, handleResultSelected])

  return (
    <Box>
      <TextField
        label="Artist"
        type="search"
        value={query}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setQuery(event.target.value)
        }}
      />
      <Button onClick={handleSubmit} variant="contained">Search</Button>
      {AutocompleteItemsList}
    </Box>
  )
}

export default Search
