import { SearchType, type TAlgorithmPartyCurve, type TPlaylistEntry } from 'playlist-generator-utilities'
import { type GetRecommendationsForPlaylistOptions, getRecommendationsForPlaylist } from '../../spotify'

export default async function playlistPartyCurve(
  args: TAlgorithmPartyCurve['Request'],
): Promise<TAlgorithmPartyCurve['Response']> {
  const { selectedId, selectedType, market, trackCount } = args

  const phases = [
    { target_energy: 0.4, target_danceability: 0.4 },
    { target_energy: 0.6, target_danceability: 0.6 },
    { target_energy: 0.85, target_danceability: 0.85 },
    { target_energy: 0.6, target_danceability: 0.6 },
    { target_energy: 0.35, target_danceability: 0.35 },
  ]

  const limit = Math.ceil(trackCount / phases.length)

  const promises = await Promise.all(
    phases.map((phase) => {
      const options: GetRecommendationsForPlaylistOptions = {
        market,
        limit,
        target_energy: phase.target_energy,
        target_danceability: phase.target_danceability,
      }
      if (selectedType === SearchType.Artist) {
        options.seed_artists = selectedId
      } else if (selectedType === SearchType.Track) {
        options.seed_tracks = selectedId
      }
      return getRecommendationsForPlaylist(options)
    }),
  )

  const ordered: TPlaylistEntry[] = []
  for (const batch of promises) {
    ordered.push(...Object.values(batch))
  }
  return ordered
}
