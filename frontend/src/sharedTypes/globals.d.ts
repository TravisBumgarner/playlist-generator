declare let __STATIC__: string
declare let __API_WS_ENDPOINT__: string
declare let __API_HTTP_ENDPOINT__: string
declare let __LOGGING_LEVEL__: string

interface SpotifyIframeApi {
  createController(
    element: HTMLElement,
    options: { width?: number | string; height?: number | string; uri?: string },
    callback: (controller: EmbedController) => void,
  ): void
}

interface EmbedController {
  loadUri(uri: string): void
  play(): void
  togglePlay(): void
  addListener(event: 'playback_update', callback: (data: { isPaused: boolean; isBuffering: boolean }) => void): void
  addListener(event: 'ready', callback: () => void): void
}

interface Window {
  onSpotifyIframeApiReady: (IFrameAPI: SpotifyIframeApi) => void
}
