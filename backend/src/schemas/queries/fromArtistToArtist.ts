import { GraphQLEnumType, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql'

import getSpotifyClient, { getRecommendationsForPlaylist, getRelatedArtistFromArtists } from '../../spotify'
import { PlaylistType } from '../types'

type FromArtistToArtistParams = {
  artistIdStart: string,
  artistIdEnd: string,
  market: string
}

export const createFromArtistToArtistPlaylist = {
  type: new GraphQLList(PlaylistType),
  description: 'Start with a start artist and an end artist, and create a playlist of songs between the two.',
  args: {
    artistIdStart: { type: new GraphQLNonNull(GraphQLString) },
    artistIdEnd: { type: new GraphQLNonNull(GraphQLString) },
    market: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (_: any, { artistIdStart, artistIdEnd, market }: FromArtistToArtistParams) => {
    const client = await getSpotifyClient()
    // Ooh look at this possibility for a recursive solution.
    console.log(artistIdStart, artistIdEnd)
    const artistIdMiddle = await getRelatedArtistFromArtists(market, artistIdStart, artistIdEnd)


    const artistIdBeforeMiddle = await getRelatedArtistFromArtists(market, artistIdStart, artistIdMiddle)
    const artistIdAfterMiddle = await getRelatedArtistFromArtists(market, artistIdMiddle, artistIdEnd)

    const artistIds = [
      artistIdStart,
      artistIdBeforeMiddle,
      artistIdMiddle,
      artistIdAfterMiddle,
      artistIdEnd
    ]

    console.log(artistIds)
    const promises = await Promise.all(artistIds.map(artistId => getRecommendationsForPlaylist({ seed_artists: artistId, market, limit: 20 })))
    console.log(promises)
    return promises.flat().flat()
  }
}