import { GraphQLList, GraphQLNonNull, GraphQLString, GraphQLInt } from 'graphql'

import { getRecommendationsForPlaylist, getRelatedArtistFromArtists } from '../../spotify'
import { PlaylistType } from '../types'
import { TFromArtistToArtist, TPlaylistEntry } from 'playlist-generator-utilities'

export const createFromArtistToArtistPlaylist = {
  type: new GraphQLList(PlaylistType),
  description: 'See frontend',
  args: {
    artistIdStart: { type: new GraphQLNonNull(GraphQLString) },
    artistIdEnd: { type: new GraphQLNonNull(GraphQLString) },
    market: { type: new GraphQLNonNull(GraphQLString) },
    trackCount: { type: new GraphQLNonNull(GraphQLInt) },
  },
  resolve: async (_: any, { artistIdStart, artistIdEnd, market, trackCount }: TFromArtistToArtist['Request']): Promise<TFromArtistToArtist['Response']> => {
    // Ooh look at this possibility for a recursive solution.
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

    const limit = Math.ceil(trackCount / artistIds.length)
    const promises = await Promise.all(artistIds.map(artistId => getRecommendationsForPlaylist({ seed_artists: artistId, market, limit })))
    const dedupped = promises.reduce((accum, curr) => ({ ...accum, ...curr }), {} as { [key: string]: TPlaylistEntry })
    return Object.values(dedupped)
  }
}