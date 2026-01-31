import type {
  ApiResponse,
  TAlgorithmContrastPairs,
  TAlgorithmDiscoveryDial,
  TAlgorithmFocusMode,
  TAlgorithmFullControl,
  TAlgorithmGenreDrift,
  TAlgorithmGoodBeatsToGoodSleeps,
  TAlgorithmGradient,
  TAlgorithmMashup,
  TAlgorithmMoodSwing,
  TAlgorithmPartyCurve,
  TAlgorithmRandomWalk,
  TAlgorithmTempoLock,
  TAlgorithmTimeMachine,
  TAlgorithmWorkoutArc,
  TAutocompleteEntry,
  TCreatePlaylist,
  TPlaylistEntry,
} from 'playlist-generator-utilities'

async function fetchApi<T>(url: string, options?: RequestInit): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url, options)
    const json = await response.json()
    return json as ApiResponse<T>
  } catch {
    return { success: false, errorCode: 'INTERNAL_ERROR' }
  }
}

export async function getSpotifyRedirectUri(): Promise<ApiResponse<string>> {
  return fetchApi<string>(`${__API_BASE_URL__}/api/auth/spotify-redirect-uri`)
}

export async function refreshToken(
  token: string,
): Promise<ApiResponse<{ refreshToken: string; accessToken: string; expiresIn: number }>> {
  const params = new URLSearchParams({ refreshToken: token })
  return fetchApi(`${__API_BASE_URL__}/api/auth/refresh-token?${params}`)
}

export async function autocomplete(query: string, market: string): Promise<ApiResponse<TAutocompleteEntry[]>> {
  const params = new URLSearchParams({ query, market })
  return fetchApi<TAutocompleteEntry[]>(`${__API_BASE_URL__}/api/search/autocomplete?${params}`)
}

export async function playlistGradient(args: TAlgorithmGradient['Request']): Promise<ApiResponse<TPlaylistEntry[]>> {
  const params = new URLSearchParams({
    startWithId: args.startWithId,
    endWithId: args.endWithId,
    startWithType: args.startWithType,
    endWithType: args.endWithType,
    market: args.market,
    trackCount: String(args.trackCount),
  })
  return fetchApi<TPlaylistEntry[]>(`${__API_BASE_URL__}/api/playlist/gradient?${params}`)
}

export async function playlistFullControl(
  args: TAlgorithmFullControl['Request'],
): Promise<ApiResponse<TPlaylistEntry[]>> {
  const params = new URLSearchParams({
    selectedId: args.selectedId,
    selectedType: args.selectedType,
    market: args.market,
    filters: args.filters,
    trackCount: String(args.trackCount),
  })
  return fetchApi<TPlaylistEntry[]>(`${__API_BASE_URL__}/api/playlist/full-control?${params}`)
}

export async function playlistGoodBeatsToGoodSleeps(
  args: TAlgorithmGoodBeatsToGoodSleeps['Request'],
): Promise<ApiResponse<TPlaylistEntry[]>> {
  const params = new URLSearchParams({
    selectedId: args.selectedId,
    selectedType: args.selectedType,
    market: args.market,
    trackCount: String(args.trackCount),
  })
  return fetchApi<TPlaylistEntry[]>(`${__API_BASE_URL__}/api/playlist/good-beats-to-good-sleeps?${params}`)
}

export async function playlistMashup(args: TAlgorithmMashup['Request']): Promise<ApiResponse<TPlaylistEntry[]>> {
  const params = new URLSearchParams({
    artistIds: args.artistIds.join(','),
    trackIds: args.trackIds.join(','),
    market: args.market,
    trackCount: String(args.trackCount),
  })
  return fetchApi<TPlaylistEntry[]>(`${__API_BASE_URL__}/api/playlist/mashup?${params}`)
}

export async function playlistTimeMachine(
  args: TAlgorithmTimeMachine['Request'],
): Promise<ApiResponse<TPlaylistEntry[]>> {
  const params = new URLSearchParams({
    selectedId: args.selectedId,
    selectedType: args.selectedType,
    era: args.era,
    market: args.market,
    trackCount: String(args.trackCount),
  })
  return fetchApi<TPlaylistEntry[]>(`${__API_BASE_URL__}/api/playlist/time-machine?${params}`)
}

export async function playlistMoodSwing(args: TAlgorithmMoodSwing['Request']): Promise<ApiResponse<TPlaylistEntry[]>> {
  const params = new URLSearchParams({
    selectedId: args.selectedId,
    selectedType: args.selectedType,
    market: args.market,
    trackCount: String(args.trackCount),
  })
  return fetchApi<TPlaylistEntry[]>(`${__API_BASE_URL__}/api/playlist/mood-swing?${params}`)
}

export async function playlistWorkoutArc(
  args: TAlgorithmWorkoutArc['Request'],
): Promise<ApiResponse<TPlaylistEntry[]>> {
  const params = new URLSearchParams({
    selectedId: args.selectedId,
    selectedType: args.selectedType,
    market: args.market,
    trackCount: String(args.trackCount),
  })
  return fetchApi<TPlaylistEntry[]>(`${__API_BASE_URL__}/api/playlist/workout-arc?${params}`)
}

export async function playlistDiscoveryDial(
  args: TAlgorithmDiscoveryDial['Request'],
): Promise<ApiResponse<TPlaylistEntry[]>> {
  const params = new URLSearchParams({
    selectedId: args.selectedId,
    selectedType: args.selectedType,
    adventurousness: String(args.adventurousness),
    market: args.market,
    trackCount: String(args.trackCount),
  })
  return fetchApi<TPlaylistEntry[]>(`${__API_BASE_URL__}/api/playlist/discovery-dial?${params}`)
}

export async function playlistTempoLock(args: TAlgorithmTempoLock['Request']): Promise<ApiResponse<TPlaylistEntry[]>> {
  const params = new URLSearchParams({
    selectedId: args.selectedId,
    selectedType: args.selectedType,
    bpm: String(args.bpm),
    market: args.market,
    trackCount: String(args.trackCount),
  })
  return fetchApi<TPlaylistEntry[]>(`${__API_BASE_URL__}/api/playlist/tempo-lock?${params}`)
}

export async function playlistGenreDrift(
  args: TAlgorithmGenreDrift['Request'],
): Promise<ApiResponse<TPlaylistEntry[]>> {
  const params = new URLSearchParams({
    startWithId: args.startWithId,
    endWithId: args.endWithId,
    startWithType: args.startWithType,
    endWithType: args.endWithType,
    market: args.market,
    trackCount: String(args.trackCount),
  })
  return fetchApi<TPlaylistEntry[]>(`${__API_BASE_URL__}/api/playlist/genre-drift?${params}`)
}

export async function playlistPartyCurve(
  args: TAlgorithmPartyCurve['Request'],
): Promise<ApiResponse<TPlaylistEntry[]>> {
  const params = new URLSearchParams({
    selectedId: args.selectedId,
    selectedType: args.selectedType,
    market: args.market,
    trackCount: String(args.trackCount),
  })
  return fetchApi<TPlaylistEntry[]>(`${__API_BASE_URL__}/api/playlist/party-curve?${params}`)
}

export async function playlistContrastPairs(
  args: TAlgorithmContrastPairs['Request'],
): Promise<ApiResponse<TPlaylistEntry[]>> {
  const params = new URLSearchParams({
    firstId: args.firstId,
    firstType: args.firstType,
    secondId: args.secondId,
    secondType: args.secondType,
    market: args.market,
    trackCount: String(args.trackCount),
  })
  return fetchApi<TPlaylistEntry[]>(`${__API_BASE_URL__}/api/playlist/contrast-pairs?${params}`)
}

export async function playlistFocusMode(args: TAlgorithmFocusMode['Request']): Promise<ApiResponse<TPlaylistEntry[]>> {
  const params = new URLSearchParams({
    selectedId: args.selectedId,
    selectedType: args.selectedType,
    market: args.market,
    trackCount: String(args.trackCount),
  })
  return fetchApi<TPlaylistEntry[]>(`${__API_BASE_URL__}/api/playlist/focus-mode?${params}`)
}

export async function playlistRandomWalk(
  args: TAlgorithmRandomWalk['Request'],
): Promise<ApiResponse<TPlaylistEntry[]>> {
  const params = new URLSearchParams({
    selectedId: args.selectedId,
    selectedType: args.selectedType,
    market: args.market,
    trackCount: String(args.trackCount),
  })
  return fetchApi<TPlaylistEntry[]>(`${__API_BASE_URL__}/api/playlist/random-walk?${params}`)
}

export async function savePlaylist(args: TCreatePlaylist['Request']): Promise<ApiResponse<string>> {
  return fetchApi<string>(`${__API_BASE_URL__}/api/playlist/save`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(args),
  })
}
