import { GraphQLEnumType, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql'

import getSpotifyClient from '../../spotify'
import { TAutocomplete, TAutocompleteEntry } from 'playlist-generator-utilities'

const AutoCompleteType = new GraphQLObjectType({
  name: 'AutocompleteResult',
  description: 'This represents an autocomplete entry',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLString) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    image: { type: new GraphQLNonNull(GraphQLString) },
    market: { type: new GraphQLNonNull(GraphQLString) },
  }),
})

const SearchTypeEnum = new GraphQLEnumType({
  name: 'SearchTypeEnum',
  values: {
    artist: { value: 'artist' },
  }
})

export const autocomplete = {
  type: new GraphQLList(AutoCompleteType),
  description: 'Get a list of items searched for autocomplete',
  args: {
    types: { type: new GraphQLNonNull(SearchTypeEnum) },
    query: { type: new GraphQLNonNull(GraphQLString) },
    market: { type: new GraphQLNonNull(GraphQLString) }
  },
  resolve: async (_: any, { query, types, market }: TAutocomplete['Request']): Promise<TAutocomplete['Response']> => {
    const client = await getSpotifyClient()
    const spotifyResults = await client.search(query, [types], { market, offset: 0, limit: 10 })
    const autocompleteResults = spotifyResults?.body?.artists?.items.map(({ id, images, name }) => {
      return {
        id,
        name,
        image: images.length > 0 ? images[0].url : ''
      }
    }) ?? []

    return autocompleteResults as TAutocompleteEntry[]
  }
}