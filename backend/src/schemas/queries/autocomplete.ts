import { GraphQLEnumType, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql'

import getSpotifyClient from '../../spotify'
import { SearchType, TAutocomplete, TAutocompleteEntry } from 'playlist-generator-utilities'

const AutoCompleteType = new GraphQLObjectType({
  name: 'AutocompleteResult',
  description: 'This represents an autocomplete entry',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLString) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    image: { type: new GraphQLNonNull(GraphQLString) },
    type: { type: new GraphQLNonNull(GraphQLString) },
  }),
})

export const autocomplete = {
  type: new GraphQLList(AutoCompleteType),
  description: 'Get a list of items searched for autocomplete',
  args: {
    query: { type: new GraphQLNonNull(GraphQLString) },
    market: { type: new GraphQLNonNull(GraphQLString) }
  },
  resolve: async (_: any, { query, market }: TAutocomplete['Request']): Promise<TAutocomplete['Response']> => {
    const client = await getSpotifyClient()

    // hard coding for now, I suspect I'll want to expand. 
    const TYPES = ['artist', 'track'] as const

    const spotifyResults = await client.search(query, TYPES, { market, offset: 0, limit: 10 })

    const autocompleteResults: TAutocompleteEntry[] = []

    if (TYPES.includes('artist') && spotifyResults?.body?.artists?.items) {
      spotifyResults.body.artists.items.forEach(({ id, name, images }) => {
        autocompleteResults.push({
          id,
          name,
          image: images.length > 0 ? images[0].url : '',
          type: SearchType.Artist
        })
      })
    }

    if (TYPES.includes('track') && spotifyResults?.body?.tracks?.items) {
      spotifyResults.body.tracks.items.forEach(({ id, name, album }) => {
        autocompleteResults.push({
          id,
          name,
          image: album.images.length > 0 ? album.images[0].url : '',
          type: SearchType.Track
        })
      })
    }

    return autocompleteResults
  }
}