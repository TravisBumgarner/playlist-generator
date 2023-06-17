import { GraphQLList, GraphQLNonNull, GraphQLString, GraphQLInt } from 'graphql'

import { getRecommendationsForPlaylist } from '../../spotify'
import { PlaylistType } from '../types'
import { shuffle } from '../../utilities'
import { TArtistMashup, TPlaylistEntry } from 'playlist-generator-utilities'

export const createArtistMashupPlaylist = {
  type: new GraphQLList(PlaylistType),
  description: 'See frontend',
  args: {
    artistIds: { type: new GraphQLNonNull(new GraphQLList(GraphQLString)) },
    market: { type: new GraphQLNonNull(GraphQLString) },
    trackCount: { type: new GraphQLNonNull(GraphQLInt) },
  },
  resolve: async (_: any, { artistIds, market, trackCount }: TArtistMashup['Request']): Promise<TArtistMashup['Response']> => {
    const limit = Math.ceil(trackCount / artistIds.length)
    const promises = await Promise.all(artistIds.map(artistId => getRecommendationsForPlaylist({ seed_artists: artistId, market, limit })))
    const dedupped = promises.reduce((accum, curr) => ({ ...accum, ...curr }), {} as { [key: string]: TPlaylistEntry })
    return shuffle(Object.values(dedupped))
  }
}