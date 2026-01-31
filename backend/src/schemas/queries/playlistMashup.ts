import type { TAlgorithmMashup, TPlaylistEntry } from 'playlist-generator-utilities'
import { getRecommendationsForPlaylist } from '../../spotify'
import { shuffle } from '../../utilities'

export default async function playlistMashup(args: TAlgorithmMashup['Request']): Promise<TAlgorithmMashup['Response']> {
  const { artistIds, trackIds, market, trackCount } = args
  const limit = Math.ceil(trackCount / (artistIds.length + trackIds.length))
  const artistPromises = await Promise.all(
    artistIds.map((artistId) => getRecommendationsForPlaylist({ seed_artists: artistId, market, limit })),
  )
  const trackPromises = await Promise.all(
    trackIds.map((trackId) => getRecommendationsForPlaylist({ seed_tracks: trackId, market, limit })),
  )
  const deduped = [...artistPromises, ...trackPromises].reduce(
    (accum, curr) => ({ ...accum, ...curr }),
    {} as { [key: string]: TPlaylistEntry },
  )
  return shuffle(Object.values(deduped))
}
