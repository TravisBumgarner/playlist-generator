import * as React from 'react'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { debounce } from '@mui/material/utils'
import { gql, useLazyQuery } from '@apollo/client'
import { type TAutocompleteEntry } from 'sharedTypes'
import { logger } from 'utilities'
import { Avatar } from '@mui/material'
import { context } from 'context'

const AUTOCOMPLETE_QUERY = gql`
query Autocomplete($query: String!, $market: String!) {
    autocomplete(query: $query, types: artist, market: $market) {
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
  const { state } = React.useContext(context)
  const [selected, setSelected] = React.useState<TAutocompleteEntry | null>(null)
  const [query, setQuery] = React.useState('')
  const [options, setOptions] = React.useState<readonly TAutocompleteEntry[]>([])

  const [autocomplete] = useLazyQuery<{ autocomplete: TAutocompleteEntry[] }>(AUTOCOMPLETE_QUERY)

  const fetch = React.useMemo(
    () =>
      debounce(
        (
          request: string,
          handleResults: (results?: readonly TAutocompleteEntry[]) => void
        ) => {
          autocomplete({ variables: { query: request, market: state.user!.market } }).then(result => {
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
    [autocomplete, state.user]
  )

  React.useEffect(() => {
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
    })

    return () => {
      active = false
    }
  }, [selected, query, fetch])

  return (
    <Autocomplete
      fullWidth
      getOptionLabel={(option) => option.name}
      options={options}
      autoComplete
      value={selected}
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
  )
}

export default SearchV2
