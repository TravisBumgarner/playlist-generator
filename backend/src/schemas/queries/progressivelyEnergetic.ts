import { GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql'

import { getRecommendationsForPlaylist } from '../../spotify'
import { PlaylistType } from '../types'
import { TPlaylistEntry, TProgressivelyEnergetic} from 'utilities'

export const createProgressivelyEnergeticPlaylist = {
  type: new GraphQLList(PlaylistType),
  description: 'See frontend',
  args: {
    artistId: { type: new GraphQLNonNull(GraphQLString) },
    market: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (_: any, { artistId, market }: TProgressivelyEnergetic['Request']): Promise<TProgressivelyEnergetic['Response']>  => {
    const promises = await Promise.all([0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9].map(async (minEnergy) => {
      const options = { seed_artists: artistId, market, limit: 10, min_energy: minEnergy, max_energy: minEnergy + 0.1 }
      return getRecommendationsForPlaylist(options)
    }))
    
    const dedupped = promises.reduce((accum, curr) => ({...accum, ...curr}), {} as { [key: string]: TPlaylistEntry })
    return Object.values(dedupped)
  }
}