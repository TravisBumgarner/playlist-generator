import { GraphQLEnumType, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql'

import { GetRecommendationsForPlaylistOptions, getRecommendationsForPlaylist } from '../../spotify'
import { PlaylistType } from '../types'
import { TFullControl, EFilterValue, TPlaylistEntry } from 'utilities'
import { EFilterOption } from 'utilties'

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
  name: 'Filter',
  description: 'This represents a filter',
  fields: () => ({
    start: { type: new GraphQLNonNull(FilterValues) },
    end: { type: new GraphQLNonNull(FilterValues) },
  }),
})


export const createFullControlPlaylist = {
  type: new GraphQLList(PlaylistType),
  description: 'See frontend',
  args: {
    artistId: { type: new GraphQLNonNull(GraphQLString) },
    market: { type: new GraphQLNonNull(GraphQLString) },
    // TODO Need to figure out how to make this type work.
    danceability: { type: Filter },
    energy: { type: Filter },
    popularity: { type: Filter },
    tempo: { type: Filter },
    valence: { type: Filter },
    resolve: async (_: any, { artistId, market, ...rest }: TFullControl['Request']): Promise<TFullControl['Response']> => {
      const optionsToPromise: GetRecommendationsForPlaylistOptions[] = []
      for (let i = 0; i < MAGIC_NUMBER; i++) {
        const options: GetRecommendationsForPlaylistOptions = {
          seed_artists: artistId,
          market,
          limit: 10,
        }
        Object.keys(rest).forEach((filter) => {
          // Too much head slamming here. Types are propbably bad.
          const typecast = filter as unknown as EFilterOption
          if (Object.values(EFilterOption).includes(typecast)) {
            const key = `target_${filter}` as unknown as `target_${EFilterOption}`
            options[key] = calculateTargetValue(rest[typecast]!.start, rest[typecast]!.end, MAGIC_NUMBER, i)
          }
        })
        optionsToPromise.push(options)
      }
      const promises = await Promise.all(optionsToPromise.map((options) => getRecommendationsForPlaylist(options)))
      const dedupped = promises.reduce((accum, curr) => ({ ...accum, ...curr }), {} as { [key: string]: TPlaylistEntry })
      return Object.values(dedupped)
    }
  }
}