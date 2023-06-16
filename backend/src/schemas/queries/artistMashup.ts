import { GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql'

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
  },
  resolve: async (_: any, { artistIds, market }: TArtistMashup['Request']): Promise<TArtistMashup['Response']> => {
    const promises = await Promise.all(artistIds.map(artistId => getRecommendationsForPlaylist({ seed_artists: artistId, market, limit: 20 })))
    const dedupped = promises.reduce((accum, curr) => ({ ...accum, ...curr }), {} as { [key: string]: TPlaylistEntry })
    return shuffle(Object.values(dedupped))
  }
}