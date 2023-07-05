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

// Copied, and filtered from Spotify package
enum SearchRequestType {
  Album = 'album',
  Artist = 'artist',
  Playlist = 'playlist',
  Track = 'track',
}

enum SearchResponseType {
  Album = 'albums',
  Artist = 'artists',
  Playlist = 'playlists',
  Track = 'tracks',
}

export const autocomplete = {
  type: new GraphQLList(AutoCompleteType),
  description: 'Get a list of items searched for autocomplete',
  args: {
    type: { type: new GraphQLNonNull(GraphQLString) },
    query: { type: new GraphQLNonNull(GraphQLString) },
    market: { type: new GraphQLNonNull(GraphQLString) }
  },
  resolve: async (_: any, { query, type, market }: TAutocomplete['Request']): Promise<TAutocomplete['Response']> => {
    const client = await getSpotifyClient()

    // Spotify won't rank different types against each other so for now, return just one item.


    const spotifyResults = await client.search(query, [type as SearchRequestType], { market, offset: 0, limit: 10 })

    let autocompleteResults: TAutocompleteEntry[] | undefined = undefined
    if (type === 'artist') {
      autocompleteResults = spotifyResults?.body?.artists?.items.map(({ id, name, images }) => {
        return {
          id,
          name,
          image: images.length > 0 ? images[0].url : ''
        }
      })
    } else if (type === 'track') {
      autocompleteResults = spotifyResults?.body?.tracks?.items.map(({ id, name, album }) => {
        return {
          id,
          name,
          image: album.images.length > 0 ? album.images[0].url : ''
        }
      })
    } else if (type === 'album') {
      autocompleteResults = spotifyResults?.body?.albums?.items.map(({ id, name, images }) => {
        return {
          id,
          name,
          image: images.length > 0 ? images[0].url : ''
        }
      })
    } else if (type === 'playlist') {
      autocompleteResults = spotifyResults?.body?.playlists?.items.map(({ id, name, images }) => {
        return {
          id,
          name,
          image: images.length > 0 ? images[0].url : ''
        }
      })
    }

    return autocompleteResults ?? [] as TAutocompleteEntry[]
  }
}