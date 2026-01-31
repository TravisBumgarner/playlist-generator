import { SearchType, type TAlgorithmDiscoveryDial } from 'playlist-generator-utilities'
import { type GetRecommendationsForPlaylistOptions, getRecommendationsForPlaylist } from '../../spotify'

export default async function playlistDiscoveryDial(
  args: TAlgorithmDiscoveryDial['Request'],
): Promise<TAlgorithmDiscoveryDial['Response']> {
  const { selectedId, selectedType, adventurousness, market, trackCount } = args

  const maxPopularity = Math.round(100 - adventurousness * 100)
  const targetPopularity = Math.round(Math.max(0, 50 - adventurousness * 50))

  const options: GetRecommendationsForPlaylistOptions = {
    market,
    limit: trackCount,
    max_popularity: maxPopularity,
    target_popularity: targetPopularity,
  }

  if (selectedType === SearchType.Artist) {
    options.seed_artists = selectedId
  } else if (selectedType === SearchType.Track) {
    options.seed_tracks = selectedId
  }

  const results = await getRecommendationsForPlaylist(options)
  return Object.values(results)
}
