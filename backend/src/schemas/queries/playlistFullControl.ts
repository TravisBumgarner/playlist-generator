import {
  EFilterValue,
  parseFilters,
  SearchType,
  type TAlgorithmFullControl,
  type TPlaylistEntry,
} from 'playlist-generator-utilities'
import { type GetRecommendationsForPlaylistOptions, getRecommendationsForPlaylist } from '../../spotify'

const MAGIC_NUMBER = 5

const valueMap = {
  [EFilterValue.ExtraLow]: 0.167,
  [EFilterValue.Low]: 0.333,
  [EFilterValue.Medium]: 0.5,
  [EFilterValue.High]: 0.667,
  [EFilterValue.ExtraHigh]: 0.833,
}

function calculateTargetValue(
  start: EFilterValue,
  end: EFilterValue,
  totalSamples: number,
  currentSample: number,
): number {
  const startValue = valueMap[start]
  const endValue = valueMap[end]

  const xRatio = currentSample / totalSamples
  const yRange = endValue - startValue
  const y = startValue + xRatio * yRange

  return y
}

export default async function playlistFullControl(
  args: TAlgorithmFullControl['Request'],
): Promise<TAlgorithmFullControl['Response']> {
  const { selectedId, selectedType, market, filters: filtersString, trackCount } = args
  const optionsToPromise: GetRecommendationsForPlaylistOptions[] = []
  const limit = Math.ceil(trackCount / MAGIC_NUMBER)

  for (let i = 0; i < MAGIC_NUMBER; i++) {
    const options: GetRecommendationsForPlaylistOptions = {
      market,
      limit,
    }

    if (selectedType === SearchType.Artist) {
      options.seed_artists = selectedId
    } else if (selectedType === SearchType.Track) {
      options.seed_tracks = selectedId
    }

    const filters = parseFilters(filtersString) // I cannot figure out filters and nested types in Apollo. So lazy JSON it is.
    filters.forEach(
      ({ start, end, value }) => (options[`target_${value}`] = calculateTargetValue(start, end, MAGIC_NUMBER - 1, i)),
    )
    optionsToPromise.push(options)
  }
  const promises = await Promise.all(optionsToPromise.map((options) => getRecommendationsForPlaylist(options)))
  const deduped = promises.reduce((accum, curr) => ({ ...accum, ...curr }), {} as { [key: string]: TPlaylistEntry })
  return Object.values(deduped)
}
