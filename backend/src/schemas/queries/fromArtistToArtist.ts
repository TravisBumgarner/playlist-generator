import { GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql'

import { getRecommendationsForPlaylist, getRelatedArtistFromArtists } from '../../spotify'
import { PlaylistType } from '../types'
import { TFromArtistToArtist, TPlaylistEntry, foo } from 'playlist-generator-utilities'

const foobar: 7 = foo;

export const createFromArtistToArtistPlaylist = {
  type: new GraphQLList(PlaylistType),
  description: 'See frontend',
  args: {
    artistIdStart: { type: new GraphQLNonNull(GraphQLString) },
    artistIdEnd: { type: new GraphQLNonNull(GraphQLString) },
    market: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (_: any, { artistIdStart, artistIdEnd, market }: TFromArtistToArtist['Request']): Promise<TFromArtistToArtist['Response']> => {
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

    const promises = await Promise.all(artistIds.map(artistId => getRecommendationsForPlaylist({ seed_artists: artistId, market, limit: 20 })))
    const dedupped = promises.reduce((accum, curr) => ({ ...accum, ...curr }), {} as { [key: string]: TPlaylistEntry })
    return Object.values(dedupped)
  }
}