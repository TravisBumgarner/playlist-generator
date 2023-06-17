import { GraphQLEnumType, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString, GraphQLInt } from 'graphql'

import { GetRecommendationsForPlaylistOptions, getRecommendationsForPlaylist } from '../../spotify'
import { PlaylistType } from '../types'
import { TFullControl, EFilterValue, TPlaylistEntry, parseFilters } from 'playlist-generator-utilities'

const MAGIC_NUMBER = 5

const valueMap = {
  [EFilterValue.ExtraLow]: 0.167,
  [EFilterValue.Low]: 0.333,
  [EFilterValue.Medium]: 0.500,
  [EFilterValue.High]: 0.667,
  [EFilterValue.ExtraHigh]: 0.833,
}

function calculateTargetValue(start: EFilterValue, end: EFilterValue, totalSamples: number, currentSample: number): number {
  const startValue = valueMap[start];
  const endValue = valueMap[end];

  const xRatio = currentSample / totalSamples;
  const yRange = endValue - startValue;
  const y = startValue + xRatio * yRange;

  return y;
}

export const createFullControlPlaylist = {
  type: new GraphQLList(PlaylistType),
  description: 'See frontend',
  args: {
    artistId: { type: new GraphQLNonNull(GraphQLString) },
    market: { type: new GraphQLNonNull(GraphQLString) },
    filters: { type: new GraphQLNonNull(GraphQLString) },
    trackCount: { type: new GraphQLNonNull(GraphQLInt) },
  },
  resolve: async (_: any, { artistId, market, filters: filtersString, trackCount }: TFullControl['Request']): Promise<TFullControl['Response']> => {
    const optionsToPromise: GetRecommendationsForPlaylistOptions[] = []
    const limit = Math.ceil(trackCount / MAGIC_NUMBER)

    for (let i = 0; i < MAGIC_NUMBER; i++) {
      const options: GetRecommendationsForPlaylistOptions = {
        seed_artists: artistId,
        market,
        limit,
      }

      const filters = parseFilters(filtersString) // I cannot figure out filters and nested types in Apollo. So lazy JSON it is.
      filters.forEach(({ start, end, value }) => options[`target_${value}`] = calculateTargetValue(start, end, MAGIC_NUMBER - 1, i))
      optionsToPromise.push(options)
    }
    console.log(optionsToPromise)
    const promises = await Promise.all(optionsToPromise.map((options) => getRecommendationsForPlaylist(options)))
    const dedupped = promises.reduce((accum, curr) => ({ ...accum, ...curr }), {} as { [key: string]: TPlaylistEntry })
    return Object.values(dedupped)
  }
}