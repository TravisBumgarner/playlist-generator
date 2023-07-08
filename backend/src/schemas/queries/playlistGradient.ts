import { GraphQLList, GraphQLNonNull, GraphQLString, GraphQLInt } from 'graphql'

import { getRecommendationsForPlaylist, getRecommendedArtist } from '../../spotify'
import { PlaylistType } from '../types'
import { SearchType, TAlgorithmGradient, TPlaylistEntry } from 'playlist-generator-utilities'

const playlistGradient = {
  type: new GraphQLList(PlaylistType),
  description: 'See frontend',
  args: {
    startWithId: { type: new GraphQLNonNull(GraphQLString) },
    endWithId: { type: new GraphQLNonNull(GraphQLString) },
    startWithType: { type: new GraphQLNonNull(GraphQLString) },
    endWithType: { type: new GraphQLNonNull(GraphQLString) },
    market: { type: new GraphQLNonNull(GraphQLString) },
    trackCount: { type: new GraphQLNonNull(GraphQLInt) },
  },
  resolve: async (_: any, { startWithId, startWithType, endWithType, endWithId, market, trackCount }: TAlgorithmGradient['Request']): Promise<TAlgorithmGradient['Response']> => {
    // Ooh look at this possibility for a recursive solution.
    const start = { id: startWithId, type: startWithType }
    const end = { id: endWithId, type: endWithType }

    const middle = { id: await getRecommendedArtist(market, [start, end]), type: SearchType.Artist }
    const beforeMiddle = { id: await getRecommendedArtist(market, [start, middle]), type: SearchType.Artist }
    const afterMiddle = { id: await getRecommendedArtist(market, [middle, end]), type: SearchType.Artist }


    const ids = [
      start,
      beforeMiddle,
      middle,
      afterMiddle,
      end
    ]

    const limit = Math.ceil(trackCount / ids.length)
    const promises: Promise<{ [key: string]: TPlaylistEntry }>[] = []

    ids.forEach(async ({ id, type }) => {
      if (type === SearchType.Artist) {
        promises.push(getRecommendationsForPlaylist({ seed_artists: id, market, limit }))
      } else if (type === SearchType.Track) {
        promises.push(getRecommendationsForPlaylist({ seed_tracks: id, market, limit }))
      }
    })
    const promised = await Promise.all(promises)
    const deduped = promised.reduce((accum, curr) => ({ ...accum, ...curr }), {} as { [key: string]: TPlaylistEntry })
    return Object.values(deduped)
  }
}

export default playlistGradient