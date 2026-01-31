import { SearchType, type TAlgorithmTimeMachine } from 'playlist-generator-utilities'
import { type GetRecommendationsForPlaylistOptions, getRecommendationsForPlaylist } from '../../spotify'

const eraTargets: Record<string, { target_tempo: number; target_danceability: number }> = {
  '1960s': { target_tempo: 115, target_danceability: 0.55 },
  '1970s': { target_tempo: 120, target_danceability: 0.65 },
  '1980s': { target_tempo: 125, target_danceability: 0.7 },
  '1990s': { target_tempo: 110, target_danceability: 0.6 },
  '2000s': { target_tempo: 120, target_danceability: 0.7 },
  '2010s': { target_tempo: 118, target_danceability: 0.75 },
  '2020s': { target_tempo: 122, target_danceability: 0.72 },
}

export default async function playlistTimeMachine(
  args: TAlgorithmTimeMachine['Request'],
): Promise<TAlgorithmTimeMachine['Response']> {
  const { selectedId, selectedType, era, market, trackCount } = args
  const targets = eraTargets[era] ?? eraTargets['2000s']

  const options: GetRecommendationsForPlaylistOptions = {
    market,
    limit: trackCount,
    target_tempo: targets.target_tempo,
    target_danceability: targets.target_danceability,
  }

  if (selectedType === SearchType.Artist) {
    options.seed_artists = selectedId
  } else if (selectedType === SearchType.Track) {
    options.seed_tracks = selectedId
  }

  const results = await getRecommendationsForPlaylist(options)
  return Object.values(results)
}
