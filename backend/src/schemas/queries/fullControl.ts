import { GraphQLEnumType, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql'

import { GetRecommendationsForPlaylistOptions, getRecommendationsForPlaylist } from '../../spotify'
import { PlaylistType } from '../types'
import { TFullControl, EFilterValue, TPlaylistEntry, parseFilters } from 'utilities'

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


const FilterValues = new GraphQLEnumType({
  name: 'FilterValue',
  values: Object.fromEntries(
    Object.values(EFilterValue).map((value) => [value, { value }])
  ),
});

const Filter = new GraphQLObjectType({
  name: 'FilterFoo',
  description: 'This represents a filter',
  fields: () => ({
    start: { type: FilterValues },
    // end: { type: new GraphQLNonNull(FilterValues) },
  }),
})


export const createFullControlPlaylist = {
  type: new GraphQLList(PlaylistType),
  description: 'See frontend',
  args: {
    artistId: { type: new GraphQLNonNull(GraphQLString) },
    market: { type: new GraphQLNonNull(GraphQLString) },
    filters: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (_: any, { artistId, market, filters: filtersString }: TFullControl['Request']): Promise<TFullControl['Response']> => {
    const optionsToPromise: GetRecommendationsForPlaylistOptions[] = []
    for (let i = 0; i < MAGIC_NUMBER; i++) {
      const options: GetRecommendationsForPlaylistOptions = {
        seed_artists: artistId,
        market,
        limit: 10,
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