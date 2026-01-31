import { SearchType, type TAlgorithmFocusMode } from 'playlist-generator-utilities'
import { type GetRecommendationsForPlaylistOptions, getRecommendationsForPlaylist } from '../../spotify'

export default async function playlistFocusMode(
  args: TAlgorithmFocusMode['Request'],
): Promise<TAlgorithmFocusMode['Response']> {
  const { selectedId, selectedType, market, trackCount } = args

  const options: GetRecommendationsForPlaylistOptions = {
    market,
    limit: trackCount,
    max_energy: 0.4,
    target_energy: 0.25,
    min_acousticness: 0.6,
    target_acousticness: 0.8,
  }

  if (selectedType === SearchType.Artist) {
    options.seed_artists = selectedId
  } else if (selectedType === SearchType.Track) {
    options.seed_tracks = selectedId
  }

  const results = await getRecommendationsForPlaylist(options)
  return Object.values(results)
}
