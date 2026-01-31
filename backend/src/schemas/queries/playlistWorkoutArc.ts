import { SearchType, type TAlgorithmWorkoutArc, type TPlaylistEntry } from 'playlist-generator-utilities'
import { type GetRecommendationsForPlaylistOptions, getRecommendationsForPlaylist } from '../../spotify'

export default async function playlistWorkoutArc(
  args: TAlgorithmWorkoutArc['Request'],
): Promise<TAlgorithmWorkoutArc['Response']> {
  const { selectedId, selectedType, market, trackCount } = args

  const phases = [
    { target_energy: 0.4, target_tempo: 100 },
    { target_energy: 0.8, target_tempo: 140 },
    { target_energy: 0.3, target_tempo: 90 },
  ]

  const limit = Math.ceil(trackCount / phases.length)

  const promises = await Promise.all(
    phases.map((phase) => {
      const options: GetRecommendationsForPlaylistOptions = {
        market,
        limit,
        target_energy: phase.target_energy,
        target_tempo: phase.target_tempo,
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
