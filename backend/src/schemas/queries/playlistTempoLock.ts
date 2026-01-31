import { SearchType, type TAlgorithmTempoLock } from 'playlist-generator-utilities'
import { type GetRecommendationsForPlaylistOptions, getRecommendationsForPlaylist } from '../../spotify'

export default async function playlistTempoLock(
  args: TAlgorithmTempoLock['Request'],
): Promise<TAlgorithmTempoLock['Response']> {
  const { selectedId, selectedType, bpm, market, trackCount } = args

  const options: GetRecommendationsForPlaylistOptions = {
    market,
    limit: trackCount,
    target_tempo: bpm,
    min_tempo: bpm - 5,
    max_tempo: bpm + 5,
  }

  if (selectedType === SearchType.Artist) {
    options.seed_artists = selectedId
  } else if (selectedType === SearchType.Track) {
    options.seed_tracks = selectedId
  }

  const results = await getRecommendationsForPlaylist(options)
  return Object.values(results)
}
